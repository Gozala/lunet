// @flow strict

/*::
import * as Data from "./lunet/data.js"
*/

class SupervisorNode {
  /*::
  nativeNode:NativeClientNode
  browserNode:BrowserNode
  params:URLSearchParams
  */
  static new(params) {
    return new this(params)
  }
  constructor(params /*:URLSearchParams*/) {
    this.params = params
    this.nativeNode = NativeClientNode.new(params)
    this.browserNode = BrowserNode.new(params)
    self.addEventListener("connect", this)
    self.addEventListener("message", this)
    self.addEventListener("activate", this)
  }
  handleEvent(event) {
    switch (event.type) {
      case "connect": {
        return this.connect(event)
      }
      case "activate": {
        return self.skipWaiting()
      }
      default: {
        if (event.waitUntil) {
          const message /*:any*/ = {
            data: event.data,
            origin: event.origin,
            target: event.source
          }
          const response = this.receive(message)
          event.waitUntil(response)
        } else {
          this.receive(event)
        }
      }
    }
  }
  connect({ ports: [port] }) {
    port.addEventListener("message", event => this.receive(event))
    port.start()

    this.nativeNode.connect(port)
    this.browserNode.connect(port)
  }
  receive({ data, target, origin } /*:Data.WorkerInbox*/) {
    switch (data.type) {
      case "ping": {
        return this.ping(data, target)
      }
      case "request": {
        return this.request(data, target)
      }
      case "response": {
        return this.respond(data, target)
      }
      default: {
        console.warn(
          `Unexpected message received ${data.type} from ${origin}`,
          data
        )
      }
    }
  }
  async ping(data, port, origin) {
    await sleep(1000)
    port.postMessage({ type: "pong", time: Date.now() })
  }
  respond(data, port, origin) {
    this.nativeNode.respond(data, port, origin)

    this.browserNode.respond(data, port, origin)
  }
  async request(request, port) {
    const native = this.nativeNode.request(request, port)
    const browser = this.browserNode.request(request, port)

    try {
      const response = await native
      if (response.status === 200) {
        port.postMessage(
          { type: "response", id: request.id, response },
          transfer(response)
        )
      } else {
        throw response
      }
    } catch (error) {
      const response = await browser
      port.postMessage(
        { type: "response", id: request.id, response },
        transfer(response)
      )
    }
  }
}

const DAEMON_URL = new URL("http://127.0.0.1:5001")
const GATEWAY_URL = new URL("http://127.0.0.1:8080")

class NativeClientNode {
  /*::
  params:URLSearchParams
  selectedFetch:"local"|"proxy"|null
  pendingRequests:{[string]:(Data.EncodedResponse) => void}
  request:(Data.RequestMessage, MessagePort) => Promise<Data.EncodedResponse>
  ready:Promise<void>
  onready:() => void
  onerror:(Error) => void
  */
  static new(params) {
    return new this(params)
  }
  constructor(params) {
    this.params = params
    this.selectedFetch = null
    this.pendingRequests = {}
    this.ready = new Promise((resolve, reject) => {
      this.onready = resolve
      this.onerror = reject
    })
  }
  async connect(port) {
    try {
      const value = await this.request(
        {
          type: "request",
          id: "init",
          request: {
            url: new URL("/api/v0/id", DAEMON_URL).href,
            destination: "",
            body: null,
            headers: []
          }
        },
        port
      )
      this.onready()
    } catch (error) {
      this.onerror(error)
    }
  }
  async request(
    requestMessage /*:Data.RequestMessage*/,
    port /*:MessagePort*/
  ) /*:Promise<Data.EncodedResponse>*/ {
    if (this.params.get("native") === "0") {
      throw Error("Native node is disabled")
    }

    const request = this.routeRequest(requestMessage)
    try {
      const value = await this.localRequest(request, port)
      return value
    } catch (error) {
      const value = await this.proxyRequest(request, port)
      return value
    }
  }
  async localRequest(
    { request } /*:Data.RequestMessage*/,
    port
  ) /*:Promise<Data.EncodedResponse>*/ {
    const response = await fetch(request.url, {
      method: request.method,
      headers: decodeHeaders(request.headers),
      body: request.body
    })

    return await encodeResponse(response, request.url)
  }
  async proxyRequest({ request, id } /*:Data.RequestMessage*/, port) {
    port.postMessage({ type: "request", id, request }, transfer(request))
    return this.response(id)
  }
  routeRequest({ id, request }) /*:Data.RequestMessage*/ {
    const url = this.route(new URL(request.url)).href
    const { method } = request
    const headers = decodeHeaders(request.headers)
    headers.delete("upgrade-insecure-requests")
    headers.delete("origin")
    headers.delete("dnt")
    headers.delete("accept")
    headers.delete("user-agent")
    headers.delete("x-requested-with")
    headers.delete("cache-control")
    headers.delete("pragma")

    return {
      id,
      type: "request",
      request: {
        ...request,
        url,
        method,
        headers: encodeHeaders(headers)
      }
    }
  }
  route(url) /*:URL*/ {
    const [, base] = url.pathname.split("/")
    switch (base) {
      case "ipfs":
      case "ipns":
        return new URL(`${url.pathname}${url.search}`, GATEWAY_URL)
      case "api":
      case "webui":
        return new URL(`${url.pathname}${url.search}`, DAEMON_URL)
      default:
        return url
    }
  }
  response(id /*:string*/) /*:Promise<Data.EncodedResponse>*/ {
    return new Promise((resolve /*:Data.EncodedResponse => void*/) => {
      this.pendingRequests[id] = resolve
    })
  }
  respond(message /*:Data.ResponseMessage*/, port, origin) {
    const { id, response } = message
    const pendingRequest = this.pendingRequests[id]
    delete this.pendingRequests[id]
    if (pendingRequest) {
      return pendingRequest(response)
    } else {
      return console.warn(`Unable to find request for id ${id}`, response)
    }
  }
}

class BrowserNode {
  /*::
  params:URLSearchParams
  daemon:*
  gateway:*
  ready:Promise<void>
  Buffer:typeof Buffer
  multiaddr:*
  CID:*
  dagPB:*
  */
  static new(params) {
    return new this(params)
  }
  constructor(params) {
    self.window = self
    importScripts("lunet/unpkg.com/ipfs/dist/index.js")
    importScripts("lunet/unpkg.com/ipfs-http-response/dist/index.js")
    importScripts("lunet/unpkg.com/tar-stream/dist/index.js")

    this.params = params
    const { Buffer, multiaddr, CID } = self.Ipfs
    this.Buffer = Buffer
    this.multiaddr = multiaddr
    this.CID = CID

    const daemon = new self.Ipfs()
    this.daemon = daemon
    this.gateway = self.IpfsHttpResponse
    this.ready = this.activate()
  }
  async activate() {
    await onready(this.daemon)
    this.dagPB = await this.daemon._ipld._getFormat("dag-pb")
  }
  async connect(connection) {}
  async request(
    request /*:Data.RequestMessage*/,
    port /*:MessagePort*/
  ) /*:Promise<Data.EncodedResponse>*/ {
    if (this.params.get("in-browser") === "0") {
      throw Error("Browser node is disabled")
    }

    return BrowserNode.request(this, request.request, port)
  }
  respond(response, port, origin) {}
  gatewayRequest(path) {
    return this.gateway.getResponse(this.daemon, path)
  }
  static async request(
    ipfs /*:BrowserNode*/,
    request /*:Data.EncodedRequest*/,
    port /*:MessagePort*/
  ) /*:Promise<Data.EncodedResponse>*/ {
    try {
      await ipfs.ready
      const { pathname, searchParams } = new URL(request.url)
      switch (pathname) {
        case "/api/v0/version": {
          const version = await ipfs.daemon.version()
          return encodeDaemonResponse({
            url: request.url,
            body: {
              Version: version.version,
              Commit: version.commit,
              Repo: version.repo
            }
          })
        }
        case "/api/v0/shutdown": {
          await ipfs.daemon.stop()
          return self.close()
        }
        case "/api/v0/id": {
          const id = await ipfs.daemon.id()
          return encodeDaemonResponse({
            url: request.url,
            body: {
              ID: id.id,
              PublicKey: id.publicKey,
              Addresses: id.addresses,
              AgentVersion: id.agentVersion,
              ProtocolVersion: id.protocolVersion
            }
          })
        }
        case "/api/v0/dns": {
          const Path = await ipfs.daemon.dns(searchParams.get("arg"))
          return encodeDaemonResponse({ url: request.url, body: { Path } })
        }
        // TODO: Report a bug to API incompatibility buf to JS-IPFS. Because go-ipfs
        // takes arbirtrary arg domain, ipfs CID, ipns CID and returns resolved
        // IPFS path while js-version only accepts IPNS CID.
        case "/api/v0/name/resolve": {
          const options = new ParamDecoder(searchParams)
          const { arg, recursive, nocache } = options
          let cid = ipfs.parseCID(String(arg))
          if (cid == null) {
            const Path = await ipfs.daemon.dns(arg)
            const [, protocol, key] = Path.split("/")
            if (protocol === "ipfs") {
              return encodeDaemonResponse({ url: request.url, body: { Path } })
            } else {
              cid = key
            }
          }
          const Path = await ipfs.daemon.name.resolve(cid.toString(), {
            recursive,
            nocache
          })
          return encodeDaemonResponse({ url: request.url, body: { Path } })
        }
        // TODO: Report a bug to JS-IPFS as /api/v0/cid/base32 endpoint does not
        // exist.
        case "/api/v0/cid/base32": {
          const arg = searchParams.get("arg")
          const cid = new ipfs.CID(searchParams.get("arg"))
          const base32CID = cid.toV1().toString("base32")
          return encodeDaemonResponse({
            url: request.url,
            body: { CidStr: arg, Formatted: base32CID }
          })
        }
        case "/api/v0/bootstrap/add": {
          const options = new ParamDecoder(searchParams)
          const { arg } = options
          const addr = arg || ipfs.daemon.multiaddr(arg)
          const data = await ipfs.daemon.add(addr && addr.toString(), {
            default: options.default
          })
          return encodeDaemonResponse({ url: request.url, body: data })
        }
        case "/api/v0/bootstrap/list": {
          const data = await ipfs.daemon.list()
          return encodeDaemonResponse({ url: request.url, body: data })
        }
        case "/api/v0/bootstrap/rm": {
          const { arg, all } = new ParamDecoder(searchParams)
          const addr = arg || ipfs.daemon.multiaddr(arg)
          const data = await ipfs.daemon.bootstrap.rm(addr && addr.toString(), {
            all
          })
          return encodeDaemonResponse({ url: request.url, body: data })
        }
        case "/api/v0/block/get": {
          const key = new ipfs.CID(searchParams.get("arg"))
          const block = await ipfs.daemon.block.get(key)
          return encodeDaemonResponse({
            url: request.url,
            body: block.data.buffer,
            headers: [["X-Stream-Output", "1"]]
          })
        }
        case "/api/v0/block/put": {
          const { mhtype, format, version, base } = new ParamDecoder(
            searchParams
          )
          const data = await decodeFileBody(request)
          const content = ipfs.Buffer.from(data)
          const block = await ipfs.daemon.block.put(content, {
            mhtype,
            format,
            version
          })

          return encodeDaemonResponse({
            url: request.url,
            body: {
              Key: ipfs.cidToString(block.cid, { base }),
              Size: block.data.length
            }
          })
        }
        case "/api/v0/block/rm": {
          const key = new ipfs.CID(searchParams.get("arg"))
          const data = await ipfs.daemon.block.rm(key)
          return encodeDaemonResponse({ url: request.url, body: data })
        }
        case "/api/v0/block/stat": {
          const { arg, base } = new ParamDecoder(searchParams)
          const key = new ipfs.CID(arg)
          const block = await ipfs.daemon.block.stat(key)
          return encodeDaemonResponse({
            url: request.url,
            body: {
              Key: ipfs.cidToString(block.cid, { base }),
              Size: block.data.length
            }
          })
        }
        case "/api/v0/object/new": {
          const { arg, base } = new ParamDecoder(searchParams)
          const cid = await ipfs.daemon.object.new(arg)
          const body = await ipfs.object$get(cid, base, false)
          return encodeDaemonResponse({
            url: request.url,
            body
          })
        }
        case "/api/v0/object/get": {
          const { arg, base, enc, dataEncoding } = new ParamDecoder(
            searchParams
          )
          const upgrade = false
          const key = new ipfs.CID(arg)
          const body = await ipfs.object$get(key, base, false, dataEncoding)
          return encodeDaemonResponse({
            url: request.url,
            body
          })
        }
        case "/api/v0/object/put": {
          const { arg, inputenc, base } = new ParamDecoder(searchParams)
          const upgrade = false
          const body = await decodeFileBody(request)
          if (inputenc === "protobuf") {
            const content = ipfs.Buffer.from(body)
            const node = await ipfs.dagPB.util.deserialize(content)
            const cid = await ipfs.dagPB.util.cid(node)
            const { data, size, links } = node.toJSON()
            return encodeDaemonResponse({
              url: request.url,
              body: {
                Data: data,
                Hash: ipfs.cidToString(cid, { base, upgrade }),
                Size: size,
                Links: links.map(link => {
                  return {
                    Name: link.name,
                    Size: link.size,
                    Hash: ipfs.cidToString(link.cid, { base, upgrade })
                  }
                })
              }
            })
          }
          return encodeDaemonResponse({
            url: request.url,
            body
          })
        }
        case "/api/v0/object/stat": {
          const { arg, base } = new ParamDecoder(searchParams)
          const upgrade = false
          const key = new ipfs.CID(arg)
          const stats = await ipfs.daemon.object.stat(key)
          const data = {
            Hash: ipfs.cidToString(stats.Hash, { base, upgrade }),
            ...stats
          }
          return encodeDaemonResponse({ url: request.url, body: data })
        }
        case "/api/v0/object/data": {
          const { arg, base } = new ParamDecoder(searchParams)
          const upgrade = false
          const key = new ipfs.CID(arg)
          const data = await ipfs.daemon.object.data(key)
          return encodeDaemonResponse({ url: request.url, body: data.buffer })
        }
        case "/api/v0/object/links": {
          const { arg, base } = new ParamDecoder(searchParams)
          const key = new ipfs.CID(arg)
          const { Hash, Links } = await ipfs.object$get(key, base, false)
          return encodeDaemonResponse({
            url: request.url,
            body: { Hash, Links }
          })
        }
        case "/api/v0/object/patch/append-data": {
          const { arg, inputenc, base } = new ParamDecoder(searchParams)
          const upgrade = false
          const key = new ipfs.CID(arg)
          const body = await decodeFileBody(request)
          const content = ipfs.Buffer.from(body)
          const cid = await ipfs.daemon.object.patch.appendData(key, content)
          const data = await ipfs.object$get(cid, base, false)
          return encodeDaemonResponse({
            url: request.url,
            body: data
          })
        }
        case "/api/v0/object/patch/set-data": {
          const { arg, inputenc, base } = new ParamDecoder(searchParams)
          const key = new ipfs.CID(arg)
          const upgrade = false
          const body = await decodeFileBody(request)
          const content = ipfs.Buffer.from(body)
          const cid = await ipfs.daemon.object.patch.setData(key, content)
          const { Hash, Links } = await ipfs.object$get(cid, base, false)
          return encodeDaemonResponse({
            url: request.url,
            body: { Hash, Links }
          })
        }
        case "/api/v0/object/patch/add-link": {
          const { args, base } = new ParamDecoder(searchParams)
          const [root, name, ref] = args
          const rootCID = new ipfs.CID(root)
          const refCID = new ipfs.CID(ref)
          const node = await ipfs.daemon.object.get(rootCID)
          const link = new ipfs.dagPB.DAGLink(name, node.size, refCID)
          const cid = await ipfs.daemon.object.patch.addLink(rootCID, link)
          const body = await ipfs.object$get(cid, base, false)
          return encodeDaemonResponse({
            url: request.url,
            body
          })
        }
        case "/api/v0/object/patch/rm-link": {
          const { args, base } = new ParamDecoder(searchParams)
          const [root, link] = args
          const rootCID = new ipfs.CID(root)
          const cid = await ipfs.daemon.object.patch.rmLink(rootCID, {
            name: link
          })
          const body = await ipfs.object$get(cid, base, false)
          return encodeDaemonResponse({
            url: request.url,
            body
          })
        }
        case "/api/v0/pin/add": {
          const { arg, recursive, base } = new ParamDecoder(searchParams)
          const pins = await ipfs.daemon.pin.add(arg, { recursive })
          return encodeDaemonResponse({
            url: request.url,
            body: {
              Pins: pins.map(pin => ipfs.cidToString(pin.hash, { base }))
            }
          })
        }
        case "/api/v0/pin/rm": {
          const { arg, recursive, base } = new ParamDecoder(searchParams)
          const pins = await ipfs.daemon.pin.rm(arg, { recursive })
          return encodeDaemonResponse({
            url: request.url,
            body: {
              Pins: pins.map(pin => ipfs.cidToString(pin.hash, { base }))
            }
          })
        }
        case "/api/v0/pin/ls": {
          const { arg, recursive, base } = new ParamDecoder(searchParams)
          const pins = await ipfs.daemon.pin.ls(arg)
          const pinset = {}
          for (const { hash, type } of pins) {
            pinset[ipfs.cidToString(hash, { base })] = { Type: type }
          }
          return encodeDaemonResponse({
            url: request.url,
            body: { Keys: pinset }
          })
        }
        case "/api/v0/dns": {
          const path = await ipfs.daemon.dns(searchParams.get("arg"))
          return encodeDaemonResponse({
            url: request.url,
            body: { Path: path }
          })
        }
        case "/api/v0/add": {
          const input = decodeRequest(request)
          const formData = await input.formData()
          const base = searchParams.get("cid-base")
          const files = []
          for (const file of formData.values()) {
            if (file instanceof File) {
              const buffer = await readWith(reader =>
                reader.readAsArrayBuffer(file)
              )
              const content = ipfs.Buffer.from(buffer)
              files.push({ path: file.name, content })
            }
          }

          const result = await ipfs.daemon.add(files)
          const data = result.map(file => ({
            Name: file.path, // addPullStream already turned this into a hash if it wanted to
            Hash: ipfs.cidToString(file.hash, { base }),
            Size: file.size
          }))

          return encodeDaemonResponse({
            url: request.url,
            body: data.length === 1 ? data[0] : data
          })
        }
        case "/api/v0/get": {
          const { arg } = new ParamDecoder(searchParams)
          const files = await ipfs.daemon.get(arg)
          const pack = self.tar.pack()
          for (const file of files) {
            if (file.content) {
              const header = { name: file.path, size: file.size }
              await callout(cb => pack.entry(header, file.content, cb))
            } else {
              const header = { type: "directory", name: file.path }
              await callout(cb => pack.entry(header, cb))
            }
          }
          pack.finalize()

          const blob = await nodeSreamAsBlob(pack)
          const buffer = await readWith(reader =>
            reader.readAsArrayBuffer(blob)
          )

          return encodeDaemonResponse({
            url: request.url,
            body: buffer,
            headers: [["X-Stream-Output", "1"]]
          })
        }
        case "/api/v0/cat": {
          const { arg, offset, length } = new ParamDecoder(searchParams)
          const content /*:Uint8Array*/ = await ipfs.daemon.cat(arg, {
            offset,
            length
          })
          const { buffer, byteOffset, byteLength } = content
          return encodeDaemonResponse({
            url: request.url,
            body:
              byteLength === 0 && buffer.byteLength === byteLength
                ? buffer
                : buffer.slice(byteOffset, byteOffset + byteLength)
          })
        }
        case "/api/v0/stats/bw": {
          const { peer, proto, poll, interval } = new ParamDecoder(searchParams)

          const data = await ipfs.daemon.stats.bw({
            peer,
            proto,
            poll,
            interval
          })

          return encodeDaemonResponse({
            url: request.url,
            body: `${encodeBandwidth(data)}\n`,
            headers: [
              ["x-chunked-output", "1"],
              ["content-type", "application/json"]
            ]
          })
        }
        case "/api/v0/config/show": {
          const data = await ipfs.daemon.config.get()
          return encodeDaemonResponse({
            url: request.url,
            body: data
          })
        }
        case "/api/v0/config/get": {
        }
        case "/api/v0/swarm/peers": {
          const { verbose } = new ParamDecoder(searchParams)
          const peers = await ipfs.daemon.swarm.peers({ verbose: verbose })
          return encodeDaemonResponse({
            url: request.url,
            body: {
              Peers: peers.map(({ peer, addr, latency }) => ({
                Peer: peer.toB58String(),
                Addr: addr.toString(),
                Latency: latency
              }))
            }
          })
        }
        case "/api/v0/files/stat": {
          const { arg, hash, size, withLocal, cidBase } = new ParamDecoder(
            searchParams
          )

          const stats = await ipfs.daemon.files.stat(arg || "/", {
            hash,
            size,
            withLocal,
            cidBase
          })

          return encodeDaemonResponse({
            url: request.url,
            body: {
              Type: stats.type,
              Blocks: stats.blocks,
              Size: stats.size,
              Hash: stats.hash,
              CumulativeSize: stats.cumulativeSize,
              WithLocality: stats.withLocality,
              Local: stats.local,
              SizeLocal: stats.sizeLocal
            }
          })
        }
        case "/api/v0/files/ls": {
          const { arg, long, cidBase } = new ParamDecoder(searchParams)

          const files = await ipfs.daemon.files.ls(arg || "/", {
            long,
            cidBase
          })
          return encodeDaemonResponse({
            url: request.url,
            body: {
              Entries: files.map(entry => ({
                Name: entry.name,
                Type: entry.type,
                Size: entry.size,
                Hash: entry.hash
              }))
            }
          })
        }
        case "/api/v0/files/read": {
          const { arg, offset, length } = new ParamDecoder(searchParams)
          const content = await ipfs.daemon.files.read(arg, { offset, length })
          return encodeDaemonResponse({
            url: request.url,
            body: content.buffer,
            headers: [["X-Stream-Output", "1"]]
          })
        }
        case "/api/v0/files/cp": {
          const {
            args,
            parents,
            format,
            hashAlg,
            shardSplitThreshold
          } = new ParamDecoder(searchParams)
          const [from, to] = args

          const data = await ipfs.daemon.files.cp(from, to, {
            parents,
            format,
            hashAlg,
            shardSplitThreshold
          })
          return encodeDaemonResponse({ url: request.url, body: data })
        }
        case "/api/v0/files/mv": {
          const {
            args,
            parents,
            format,
            hashAlg,
            shardSplitThreshold
          } = new ParamDecoder(searchParams)
          const [from, to] = args

          const data = await ipfs.daemon.files.mv(from, to, {
            parents,
            format,
            hashAlg,
            shardSplitThreshold
          })
          return encodeDaemonResponse({ url: request.url, body: data })
        }
        case "/api/v0/files/mkdir": {
          const {
            arg,
            parents,
            format,
            hashAlg,
            shardSplitThreshold,
            flush,
            cidVersion
          } = new ParamDecoder(searchParams)

          const data = await ipfs.daemon.files.mkdir(arg, {
            parents,
            format,
            hashAlg,
            cidVersion,
            flush,
            shardSplitThreshold
          })
          return encodeDaemonResponse({ url: request.url, body: data })
        }
        case "/api/v0/files/rm": {
          const { arg, recursive } = new ParamDecoder(searchParams)
          const data = await ipfs.daemon.files.rm(arg, {
            recursive
          })
          return encodeDaemonResponse({ url: request.url, body: data })
        }
        case "/api/v0/files/flush": {
          const arg = searchParams.get("arg")
          const data = await ipfs.daemon.files.flush(arg)
          return encodeDaemonResponse({ url: request.url, body: data })
        }
        case "/api/v0/files/write": {
          const {
            arg,
            offset,
            length,
            create,
            truncate,
            format,
            parents,
            rawLeaves,
            cidVersion,
            strategy,
            progress,
            flush,
            hashAlg,
            shardSplitThreshold
          } = new ParamDecoder(searchParams)
          const input = decodeRequest(request)
          const formData = await input.formData()

          for (const file of formData.values()) {
            if (file instanceof File) {
              const buffer = await readWith(reader =>
                reader.readAsArrayBuffer(file)
              )
              const content = ipfs.Buffer.from(buffer)
              const data = await ipfs.daemon.files.write(arg, content, {
                offset,
                length,
                create,
                truncate,
                rawLeaves,
                cidVersion,
                hashAlg,
                format,
                parents,
                progress,
                strategy,
                flush,
                shardSplitThreshold
              })
              return encodeDaemonResponse({ url: request.url, body: data })
            }
          }

          throw Error("Please only send one file")
        }
        default: {
          if (pathname.startsWith("/ipfs/") || pathname.startsWith("/ipns/")) {
            return encodeResponse(
              await ipfs.gatewayRequest(pathname),
              request.url
            )
          } else {
            return {
              url: request.url,
              body: `Unsupported API endpoint ${pathname}`,
              headers: [],
              status: 502,
              statusText: `Unsupported API endpoint ${pathname}`,
              redirected: false,
              type: "default"
            }
          }
        }
      }
    } catch (error) {
      return {
        url: request.url,
        body: error.toString(),
        headers: [],
        status: 500,
        statusText: "Internal Server Error",
        redirected: false,
        type: "default"
      }
    }
  }
  parseCID(input /*:string*/) {
    try {
      return new this.CID(input)
    } catch (error) {
      return null
    }
  }
  cidToString(
    input,
    options /*:{base?:?string, upgrade?:?boolean}*/ = {}
  ) /*:string*/ {
    const { Buffer, cidToString, CID } = this
    let cid = input
    const base = options.base || null
    const upgrade = options.upgrade !== false

    if (!CID.isCID(cid)) {
      cid = new CID(cid)
    }

    if (cid.version === 0 && options.base && options.base !== "base58btc") {
      if (!options.upgrade) return cid.toString()
      cid = cid.toV1()
    }

    return cid.toBaseEncodedString(options.base)
  }
  async object$get(cid, base, upgrade, dataEncoding) {
    const node = await this.daemon.object.get(cid)
    const { data, size, links } = node.toJSON()
    const content = this.Buffer.isBuffer(data)
      ? data.toString(dataEncoding)
      : data

    return {
      Data: content,
      Size: size,
      Hash: this.cidToString(cid, { base, upgrade }),
      Links: links.map(link => ({
        Name: link.name,
        Size: link.size,
        Hash: this.cidToString(link.cid, { base, upgrade })
      }))
    }
  }
}

const encodeDaemonResponse = (
  response /*:{url:string, body:string | Object | ArrayBuffer, headers?:Array<[string, string]>}*/
) /*:Data.EncodedResponse*/ => {
  const [body, headers] =
    response.body instanceof ArrayBuffer
      ? [response.body, response.headers || []]
      : [
          typeof response.body === "string"
            ? response.body
            : JSON.stringify(response.body),
          response.headers || [["content-type", "application/json"]]
        ]

  return {
    url: response.url,
    body,
    status: 200,
    statusText: "Ok",
    headers,
    redirected: false,
    type: "default"
  }
}

const encodeResponse = async (
  response /*:Response*/,
  url
) /*:Promise<Data.EncodedResponse>*/ => {
  const body = await response.arrayBuffer()
  return {
    url: response.url || url,
    body,
    headers: encodeHeaders(response.headers),
    status: response.status,
    statusText: response.statusText,
    redirected: response.redirected,
    type: response.type
  }
}

const decodeRequest = (request /*:Data.EncodedRequest*/) /*:Request*/ => {
  const options /*:any*/ = request
  return new Request(request.url, options)
}

const decodeFileBody = async (request /*:Data.EncodedRequest*/) => {
  const input = decodeRequest(request)
  const formData = await input.formData()

  for (const file of formData.values()) {
    if (file instanceof File) {
      const buffer = await readWith(reader => reader.readAsArrayBuffer(file))
      return buffer
    }
  }

  throw Error(`File argument 'data' is required`)
}

const encodeHeaders = (headers /*:Headers*/) => [...headers.entries()]

const decodeHeaders = (headers /*:Array<[string, string]>*/) /*:Headers*/ => {
  const init /*:any*/ = headers
  return new Headers(init)
}

const encodeBandwidth = stat =>
  JSON.stringify({
    TotalIn: stat.totalIn,
    TotalOut: stat.totalOut,
    RateIn: stat.rateIn,
    RateOut: stat.rateOut
  })

class ParamDecoder {
  /*::
  searchParams:URLSearchParams
  */
  constructor(searchParams) {
    this.searchParams = searchParams
  }
  get arg() {
    return this.searchParams.get("arg")
  }
  get args() {
    return this.searchParams.getAll("arg")
  }
  get format() {
    return this.searchParams.get("format") || "dag-pb"
  }
  get hashAlg() {
    return this.searchParams.get("hashAlg") || "sha2-256"
  }
  get offset() {
    return decodeInt(this.searchParams.get("o"))
  }
  get length() {
    return decodeInt(
      this.searchParams.get("n") || this.searchParams.get("length")
    )
  }

  get peer() {
    return this.searchParams.get("peer")
  }
  get proto() {
    return this.searchParams.get("proto")
  }
  get poll() {
    return Boolean(this.searchParams.get("poll"))
  }
  get interval() {
    return this.searchParams.get("interval") || "1s"
  }
  get verbose() {
    return this.searchParams.get("verbose") === "true"
  }

  get hash() {
    return Boolean(this.searchParams.get("hash"))
  }
  get size() {
    return Boolean(this.searchParams.get("size"))
  }
  get withLocal() {
    return Boolean(this.searchParams.get("withLocal"))
  }
  get cidBase() {
    return this.searchParams.get("cidBase") || "base58btc"
  }
  get long() {
    return Boolean(this.searchParams.get("l"))
  }
  get parents() {
    return (
      Boolean(this.searchParams.get("parents")) ||
      Boolean(this.searchParams.get("parents"))
    )
  }
  get shardSplitThreshold() {
    return this.searchParams.get("shardSplitThreshold")
  }
  get cidVersion() {
    return decodeInt(this.searchParams.get("cidVersion")) || 0
  }
  get flush() {
    return this.searchParams.get("flush") == null ? true : false
  }
  get recursive() {
    return Boolean(
      this.searchParams.get("r") || this.searchParams.get("recursive")
    )
  }
  get create() {
    return Boolean(
      this.searchParams.get("e") || this.searchParams.get("create")
    )
  }
  get truncate() {
    return Boolean(
      this.searchParams.get("t") || this.searchParams.get("truncate")
    )
  }
  get rawLeaves() {
    return Boolean(this.searchParams.get("rawLeaves"))
  }
  get strategy() {
    return this.searchParams.get("strategy") || "trickle"
  }
  get progress() {
    return this.searchParams.get("progress")
  }

  get default() {
    return this.searchParams.get("default") === "true"
  }

  get all() {
    return this.searchParams.get("all") === "true"
  }

  get mhtype() {
    return this.searchParams.get("mhtype")
  }
  get version() {
    return decodeInt(this.searchParams.get("version"))
  }
  get base() {
    return this.searchParams.get("cid-base")
  }
  get enc() {
    return this.searchParams.get("enc") || "base58"
  }
  get inputenc() {
    return this.searchParams.get("inputenc")
  }
  get dataEncoding() {
    return this.searchParams.get("data-encoding") || undefined
  }

  get nocache() {
    return this.searchParams.get("nocache") != null
  }
}

const decodeInt = value => (value ? parseInt(value) : undefined)

const transfer = data => (data.body instanceof ArrayBuffer ? [data.body] : [])

const callout = fn =>
  new Promise((resolve, reject) => {
    fn((error, ...args) => {
      if (error) {
        reject(error)
      } else {
        resolve(...args)
      }
    })
  })

const readWith = (read /*:FileReader => void*/) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    read(reader)
  })

const nodeSreamAsBlob = (stream, options) /*:Promise<Blob>*/ =>
  new Promise((resolve, reject) => {
    const chunks = []
    stream
      .on("data", chunk => chunks.push(chunk))
      .on("end", () => resolve(new Blob(chunks, options)))
      .on("error", reject)
  })

const once = type => target =>
  new Promise(resolve => target.once(type, resolve))
const onready = once("ready")

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const service = SupervisorNode.new(new URLSearchParams(location.search))
