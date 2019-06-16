// @flow strict

/*::
import * as Data from "./lunet/data.js"
*/

/*::
type ServiceWorkerStatus =
  | { status: "idle" }
  | { status: "installing" }
  | { status: "ready" }
  | { status: "unavailable" }
  | { status: "failed", error:Error }

type ServiceStatus =
  | { status: "pending" }
  | { status: "ready" }
  | { status: "error", error:Error }
*/

export class UserAgent {
  /*::
  root:ShadowRoot|HTMLBodyElement
  registration:ServiceWorkerRegistration
  isConnected:boolean
  status:HTMLElement
  ready:Promise<mixed>
  handleEvent:Event => mixed
  services:Services
  frame:HTMLIFrameElement
  menu:HTMLElement

  serviceWorkerStatus: ServiceWorkerStatus;
  serviceStatus:ServiceStatus;

  mountedResource:Promise<Resource> | Resource
  mountedDriver:Driver
  search:string;
  hash:string;
  */
  get ownerDocument() {
    return document
  }
  set ownerDocument(_ /*:Document*/) {}
  attach(options /*:ShadowRootInit*/) {
    if (this instanceof HTMLElement) {
      return this.attachShadow(options)
    } else {
      const { ownerDocument } = this
      return (
        ownerDocument.body ||
        ownerDocument.appendChild(ownerDocument.createElement("body"))
      )
    }
  }
  constructor() {
    this.root = this.attach({ mode: "open" })
    this.frame = this.createFrame()
    this.menu = this.createMenu()
    this.root.appendChild(this.menu)
    this.root.appendChild(this.frame)
    this.isConnected = true
    this.services = new Services()
    this.connectedCallback()
  }
  connectedCallback() {
    if (this.isConnected) {
      this.ready = this.activate()
    }
  }
  async activate() {
    this.listen()
    // this.activateServiceWorker()
    this.load()
  }
  listen() {
    const window = this.ownerDocument.defaultView
    window.addEventListener("message", this)
  }
  async activateServiceWorker() {
    const { serviceWorker } = this.ownerDocument.defaultView.navigator
    if (serviceWorker == null) {
      this.onStatusChange({ status: "unavailable" })
    } else if (serviceWorker.controller == null) {
      this.onStatusChange({ status: "installing" })
      try {
        const registration = await serviceWorker.register(SERVICE_URL, {
          scope: SERVICE_SCOPE,
          type: "classic"
        })
        this.onStatusChange({ status: "ready" })
      } catch (error) {
        this.onStatusChange({ status: "failed", error })
      }
    } else {
      this.onStatusChange({ status: "ready" })
    }
  }
  onStatusChange(status /*:ServiceWorkerStatus*/) {
    this.serviceWorkerStatus = status
  }
  async load() {
    const url = new URL(this.ownerDocument.location.href)
    const { pathname, hash, search } = url
    const [primary, secondary] = parseAddressComposition(pathname)

    const [mountAddress, driverAddress] =
      secondary == null ? [null, primary] : [primary, secondary]

    const driver = await this.createDrive(driverAddress)
    const resource = mountAddress
      ? await this.createMount(mountAddress)
      : await driver.createMount()

    this.mount(resource)
    this.mountedDriver = driver

    this.search = search
    this.hash = hash
    this.frame.src = this.sandboxURL.href
  }
  async createMount(address /*:Address*/) /*:Promise<Resource>*/ {
    const service = this.services
    switch (address.protocol) {
      case "ipfs":
      case "ipns":
        return await IPFSResource.mount(service.ipfs, address)
      case "local":
        return await LocalIPFSResource.mount(service.ipfs, address)
      case "": {
        // If protocol is unknown attempt to open as local resource
        // first otherwise attempt to open as IPNS resource
        try {
          return await LocalIPFSResource.mount(service.ipfs, address)
        } catch (error) {
          return await IPFSResource.mount(service.ipfs, address)
        }
      }
      default: {
        throw RangeError(`Unsupported resource address ${address.toString()}`)
      }
    }
  }
  async createDrive(address /*:Address*/) /*:Promise<Driver>*/ {
    const service = this.services
    switch (address.protocol) {
      case "ipfs":
      case "ipns":
        return await IPFSDriver.mount(service.ipfs, address)
      case "local":
        return await LocalIPFSDriver.mount(service.ipfs, address)
      case "": {
        // If protocol is unknown attempt to open as local resource
        // first otherwise attempt to open as IPNS resource
        try {
          return await LocalIPFSDriver.mount(service.ipfs, address)
        } catch (error) {
          return await IPFSDriver.mount(service.ipfs, address)
        }
      }
      default: {
        throw RangeError(`Unsupported resource address ${address.toString()}`)
      }
    }
  }
  createFrame() {
    const iframe = this.ownerDocument.createElement("iframe")
    iframe.setAttribute("sandbox", SANDBOX_OPTIONS.join(" "))
    iframe.setAttribute("seamless", "true")
    // TODO: Figure out a way to set CSP headers in AWS
    // iframe.setAttribute("csp", SANDBOX_CSP)
    iframe.name = "driver"
    iframe.style.height = iframe.style.width = "100%"
    iframe.style.top = iframe.style.left = "0"
    iframe.style.position = "absolute"
    iframe.style.border = "none"
    return iframe
  }
  createMenu() {
    const menu = document.createElement("aside")
    menu.classList.toggle("busy")
    menu.style.position = "absolute"
    menu.style.top = "0"
    menu.style.right = "0"
    menu.style.margin = "10px"
    menu.style.pointerEvents = "none"
    menu.style.display = "inline-block"
    menu.innerHTML += hexagonStyleSheet()
    menu.innerHTML += hexagonMarkup({
      side: 16.17,
      strokeWidth: 0.5,
      pathColor: "black",
      strokeColor: "#eee",
      polygonFill: "none",
      pathFill: "none"
    })
    return menu
  }
  // set driver(driver /*:Resource*/) {
  //   if (this.state.driver !== driver) {
  //     this.state.driver = driver
  //     this.frame.setAttribute("data-driver", `${driver.address.toString()}`)
  //     this.frame.setAttribute("data-origin", `${driver.origin}`)
  //   }
  // }
  // get driver() /*:Resource*/ {
  //   return this.state.driver
  // }
  mount(resource /*:Resource*/) {
    this.mountedResource = resource
    this.frame.setAttribute("data-mount", resource.address.toString())
  }
  get sandboxURL() {
    const { search, hash } = this
    const { origin, address } = this.mountedDriver
    const { pathname } = address
    const params = new URLSearchParams({ search, hash, pathname })
    return new URL(`https://${origin}.${SANDBOX_DOMAIN}/?${params.toString()}`)
  }
  get sandboxOrigin() {
    return this.sandboxURL.origin
  }
  // get pathname() {
  //   const { mountAddress, driverAddress } = this
  //   const { hash, search } = this.state
  //   const mount = mountAddress ? mountAddress.toString() : ""
  //   const driver = `${driverAddress.address.toString()}${search}${hash}`
  //   return mount === "" ? `${mount}|${driver}` : driver
  //   return driver
  // }
  disconnectedCallback() {}
  handleEvent(event /*:any*/) {
    switch (event.type) {
      case "message": {
        return this.onmessage(event)
      }
    }
  }
  onmessage(event /*:Data.LunetMessage*/) {
    const { data, ports } = event
    switch (data.type) {
      case "connect": {
        return this.onconnect(...ports)
      }
      case "request": {
        // TODO: Fix up types. Problem is that we match on `data` which does not
        // refine event which is what we need to refine instead.
        const $event /*:any*/ = event
        return this.onrequest($event)
      }
      case "hashchange": {
        return this.onhashchange(data.hashchange)
      }
      case "popstate": {
        return this.onpopstate(data.popstate)
      }
      case "pushstate": {
        return this.onpushstate(data.pushstate)
      }
      case "replacestate": {
        return this.onreplacestate(data.replacestate)
      }
      case "beforeunload": {
        return this.onbeforeunload()
      }
      case "ready": {
        return this.onready()
      }
    }
  }
  onhashchange(data /*:Data.HashChangeData*/) {
    this.setDriverLocation(new URL(data.newURL))
  }
  onpopstate(data /*:Data.PopStateData*/) {
    this.setDriverLocation(new URL(data.newURL))
  }
  onpushstate(data /*:Data.PopStateData*/) {
    this.setDriverLocation(new URL(data.newURL))
  }
  onreplacestate(data /*:Data.PopStateData*/) {
    this.setDriverLocation(new URL(data.newURL))
  }
  onbeforeunload() {
    this.deactivate()
  }
  onready() {
    this.menu.classList.toggle("busy")
  }
  deactivate() {
    this.frame.removeEventListener("message", this)
  }
  setDriverLocation({ pathname, hash, search } /*:URL*/) {
    // this.driver = this.driver.setPathname(pathname)
    this.hash = hash
    this.search = search
    // this.ownerDocument.defaultView.history.replaceState(null, "", this.pathname)
  }
  onrequest(event /*:Data.Request*/) {
    return this.relay(event)
  }
  onconnect(port /*:MessagePort*/) {
    console.log(`Host received a port from the client`)
    if (port) {
      port.addEventListener("message", this)
      port.start()
    }
  }
  async relay(event /*:Data.Request*/) {
    const { data, target } = event
    await this.ready

    const request = decodeRequest(data.request)
    const response = await this.handleRequest(request)
    const payload = await encodeResponse(response)

    console.log(
      `Host is forwarding response ${data.id} back to client ${response.url}`,
      response
    )

    target.postMessage(
      {
        type: "response",
        id: data.id,
        response: payload
      },
      transfer(payload)
    )
  }
  async response(data /*:Promise<null|Object>*/) /*:Promise<Response>*/ {
    try {
      const json = await data
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: {
          "content-type": "application/json"
        }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.toString() }), {
        status: error.status || 500,
        headers: {
          "content-type": "application/json"
        }
      })
    }
  }
  async stat(path /*:string*/) {
    const mountedResource = await this.mountedResource
    const info = await mountedResource.stat(path)
    if (info === null) {
      throw { status: 404, message: "Not such file or directory" }
    } else {
      return info
    }
  }
  async list(path /*:string*/) {
    const mountedResource = await this.mountedResource
    const entries = mountedResource.list(path)
    return entries
  }
  async watch(path /*:string*/) {
    const mountedResource = await this.mountedResource
    return mountedResource.watch(path)
  }
  async read(path /*:string*/, options /*::?:ReadOptions*/) {
    const mountedResource = await this.mountedResource
    return mountedResource.read(path, options)
  }
  async fork() {
    return this.mountedResource
  }
  async write(
    path /*:string*/,
    content /*:Request*/,
    options /*:{offset:?number, length:?number, parents:?boolean, truncate:?boolean, create:?boolean, title:?string}*/
  ) {
    const mountedResource = await this.mountedResource
    if (mountedResource.isLocal) {
      return mountedResource.write(path, content, options)
    } else {
      const mountedResource = await this.fork()
      return mountedResource.write(path, content, options)
    }
  }
  async delete(path /*:string*/, options /*::?:DeletOptions*/) {
    const mountedResource = await this.mountedResource
    if (mountedResource.isLocal) {
      return mountedResource.delete(path, options)
    } else {
      try {
        const stat = await mountedResource.stat(path)
        const resource = await this.fork()
        return resource.delete(path, options)
      } catch (error) {}
    }
  }
  async handleRequest(request /*:Request*/) /*:Promise<Response>*/ {
    const { method } = request
    const { hostname, pathname, origin, searchParams } = new URL(request.url)

    if (origin === this.sandboxOrigin) {
      if (pathname.startsWith("/data")) {
        const path = pathname === "/data" ? "/" : pathname.substr(5)
        switch (method) {
          case "INFO": {
            return this.response(this.stat(path))
          }
          case "LIST": {
            return this.response(this.list(path))
          }
          case "GET": {
            const { headers } = request
            switch (headers.get("content-type")) {
              case "text/event-stream": {
                return await this.watch(path)
              }
              default: {
                const offset = decodeIntParam(searchParams, "offset")
                const length = decodeIntParam(searchParams, "length")
                return this.read(path, { offset, length })
              }
            }
          }
          case "DELETE": {
            const recurse = decodeBooleanParam(searchParams, "recursive")
            return this.response(this.delete(path, { recurse }))
          }
          case "PUT": {
            const offset = decodeIntParam(searchParams, "offset")
            const length = decodeIntParam(searchParams, "length")
            const truncate = decodeBooleanParam(searchParams, "truncate")
            const create = decodeBooleanParam(searchParams, "create")
            const parents = decodeBooleanParam(searchParams, "parents")
            const title = searchParams.get("title")

            return this.response(
              this.write(path, request, {
                offset,
                length,
                truncate,
                create,
                parents,
                title
              })
            )
          }
          case "POST": {
            return new Response(
              JSON.stringify({
                error: `Write via POST method is not yet implemented`
              }),
              {
                status: 501,
                statusText: "Not Implemented"
              }
            )
          }
          default: {
            return new Response(JSON.stringify({ error: "Bad Request" }), {
              status: 400,
              statusText: "Bad Request",
              headers: { "content-type": "application/json" }
            })
          }
        }
      } else {
        return this.mountedDriver.fetch(pathname)
      }
    } else {
      // TODO: In the future we should probably allow application request a
      // permission for certain service endpoints that user could grant.
      return new Response(
        JSON.stringify({
          error: `Access to foreign origin ${origin} is forbidden`
        }),
        {
          status: 403,
          statusText: "Forbidden",
          headers: { "content-type": "application/json" }
        }
      )
    }
  }
}

class Services {
  /*::
  ipfs:IPFSService
  */
  get ipfs() {
    const service = IPFSService.activate()
    Object.defineProperty(this, "ipfs", { value: service })
    return service
  }
}
const SearchParams = (values /*:{[string]:?string|number|boolean}*/) => {
  const params = new URLSearchParams()
  for (const key in values) {
    const value = values[key]
    if (value != null) {
      params.set(key, value.toString())
    }
  }
  return params
}

const decodeBooleanParam = (params /*:URLSearchParams*/, name /*:string*/) => {
  const param = params.get(name)
  switch (param) {
    case null:
      return null
    case undefined:
      return null
    case "0":
      return false
    case "false":
      return false
    default:
      true
  }
}

const decodeIntParam = (params /*:URLSearchParams*/, name /*:string*/) => {
  const param = params.get(name)
  if (param === null) {
    return null
  } else {
    const value = parseInt(param, 10)
    if (isNaN(value)) {
      return null
    } else {
      return value
    }
  }
}

const decodeRequest = (request /*:Data.EncodedRequest*/) =>
  new Request(request.url, {
    headers: decodeHeaders(request.headers),
    body: request.body,
    method: request.method,
    cache: request.cache,
    credentials: request.credentials,
    destination: request.destination,
    integrity: request.integrity,
    redirect: request.redirect,
    // Throws on Safari if referrer is different
    // referrer: request.referrer
    referrerPolicy: request.referrerPolicy
  })

const decodeResponse = (response /*:Data.EncodedResponse*/) /*:Response*/ => {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: decodeHeaders(response.headers)
  })
}

const encodeResponse = async (
  response /*:Response*/
) /*:Promise<Data.EncodedResponse>*/ => {
  return {
    url: response.url,
    body: await response.arrayBuffer(),
    headers: encodeHeaders(response.headers),
    status: response.status,
    statusText: response.statusText,
    redirected: response.redirected,
    type: response.type
  }
}

const encodeRequest = async (
  request /*:Request*/
) /*:Promise<Data.EncodedRequest>*/ => {
  const $request /*:Object*/ = request
  const mode = String(request.mode) === "navigate" ? null : request.mode
  const cache = request.cache === "only-if-cached" ? "default" : request.cache
  const body = await encodeBody(request)

  return {
    url: request.url,
    body,
    headers: encodeHeaders(request.headers),
    mode,
    cache,
    method: request.method,
    credentials: request.credentials,
    destination: $request.destination,
    integrity: request.integrity,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy
  }
}
const encodeBody = (request /*:Request*/) => {
  switch (request.method) {
    case "GET":
    case "HEAD":
      return null
    default:
      return request.arrayBuffer()
  }
}

const encodeHeaders = (headers /*:Headers*/) => [...headers.entries()]
const decodeHeaders = (headers /*:Array<[string, string]>*/) /*:Headers*/ => {
  const init /*:any*/ = headers
  return new Headers(init)
}

const transfer = data => (data.body instanceof ArrayBuffer ? [data.body] : [])

class IPFSService {
  /*::
  connection:Connection
  */
  static activate() /*:IPFSService*/ {
    const params = new URL(window.location).searchParams
    const connection =
      self.SharedWorker && params.get("use-sw") == null
        ? new IPFSSharedWorkerConnection()
        : navigator.serviceWorker != null
        ? new IPFSServiceWorkerConnection()
        : null

    if (connection == null) {
      throw Error("Runtime does not provide `SharedWorker` nor `ServiceWorker`")
    } else {
      return new IPFSService(connection)
    }
  }
  constructor(connection /*:Connection*/) {
    this.connection = connection
  }

  // async resolveDNSLink(domain /*:string*/) /*:Promise<string>*/ {
  //   const url = new URL(`/api/v0/dns?arg=${domain}`, BASE_URL)
  //   const response = await this.fetch(url)
  //   const json = await response.json()
  //   const { Path } = json
  //   return Path
  // }
  async resolveName(
    name /*:string*/
  ) /*:Promise<{cid:string, path:string, protocol:string}>*/ {
    const url = new URL(`/api/v0/name/resolve?arg=${name}`, BASE_URL)
    const response = await this.fetch(url)
    const json = await response.text()
    const { Path } = JSON.parse(json)
    const [, protocol, cid] = Path.split("/")
    return { path: Path, cid, protocol }
  }
  async formatAsBase32(cid /*:string*/) /*:Promise<string>*/ {
    const url = new URL(`/api/v0/cid/base32?arg=${cid}`, BASE_URL)
    const response = await this.fetch(url)
    const { Formatted } = await response.json()
    return Formatted
  }
  async resolveLocalName(name /*:string*/) /*:Promise<?string>*/ {
    try {
      const url = new URL(`/api/v0/files/stat?arg=/Local/${name}/`, BASE_URL)
      const response = await this.fetch(url)
      const { Hash: cid } = await response.json()
      return cid
    } catch (error) {
      return null
    }
  }

  fetch(input /*:URL | Request*/) /*:Promise<Response>*/ {
    return this.connection.fetch(input)
  }
}

class Connection {
  /*::
  pendingRequests:{[string]:(Data.EncodedResponse) => void}
  sandbox:HTMLIFrameElement
  handleEvent: any => mixed
  */
  constructor() {
    this.pendingRequests = {}
  }
  async fetch(input /*:URL | Request*/) /*:Promise<Response>*/ {
    const id = `IPFSConnection@${Math.random()
      .toString(36)
      .slice(2)}`
    const request =
      input instanceof URL
        ? { url: input.href, body: null, headers: [] }
        : await encodeRequest(input)

    this.postMessage({ id, request, type: "request" }, transfer(request))
    const response = await this.receive(id)
    // TODO: Make sure that origin of the requesting site is used.
    response.headers.push(["access-control-allow-origin", "*"])

    return decodeResponse(response)
  }
  ping() {
    this.postMessage({ type: "ping" })
  }
  receive(id /*:string*/) /*:Promise<Data.EncodedResponse>*/ {
    return new Promise((resolve /*:Data.EncodedResponse => void*/) => {
      this.pendingRequests[id] = resolve
    })
  }
  postMessage(data /*:mixed*/, transfer /*::?:ArrayBuffer[]*/) {
    throw Error("Not implemented")
  }
  get sandbox() {
    const sandbox = document.querySelector("iframe")
    if (sandbox == null) {
      const sandbox = document.createElement("iframe")
      sandbox.name = "fetch"
      sandbox.id = "fetch-service"
      sandbox.setAttribute("sandbox", "allow-scripts allow-same-origin")
      sandbox.setAttribute("srcdoc", "")
      const root = document.head || document
      root.appendChild(sandbox)
      Object.defineProperty(this, "sandbox", { value: sandbox })
      return sandbox
    } else {
      Object.defineProperty(this, "sandbox", { value: sandbox })
      return sandbox
    }
  }
  handleEvent(event /*:Data.WorkerOutbox|{|type:"error", message:string|}*/) {
    switch (event.type) {
      case "message": {
        return this.onmessage(event)
      }
      case "error": {
        return this.onerror(event)
      }
    }
  }
  onerror(event /*:{type:"error", message:string}*/) {}
  onpong() {}
  onresponse(message /*:Data.ResponseMessage*/) {
    const { pendingRequests } = this
    const { id, response } = message
    const pendingRequest = pendingRequests[id]
    delete pendingRequests[id]
    if (pendingRequest) {
      pendingRequest(response)
    } else {
      console.warn("Received response for unrecognized request")
    }
  }
  async onrequest(message /*:Data.RequestMessage*/) {
    const { id, request } = message
    try {
      const response = await this.sandbox.contentWindow.fetch.fetch(
        request.url,
        {
          method: request.method,
          headers: decodeHeaders(request.headers),
          body: request.body
        }
      )
      const data = await encodeResponse(response)
      this.postMessage({ type: "response", id, response: data }, transfer(data))
    } catch (error) {
      const reseponse = new Response(error.toString(), {
        status: 500
      })
      const data = await encodeResponse(reseponse)
      this.postMessage({ type: "response", id, response: data }, transfer(data))
    }
  }
  onmessage(event /*:Data.WorkerOutbox*/) {
    const { data: message, target } = event
    switch (message.type) {
      case "pong": {
        return this.onpong()
      }
      case "response": {
        return this.onresponse(message)
      }
      case "request": {
        return this.onrequest(message)
      }
    }
  }
}

class IPFSSharedWorkerConnection extends Connection {
  /*::
  worker:SharedWorker
  */
  constructor() {
    super()
    const worker /*:SharedWorker*/ = new SharedWorker(
      `/ipfs.js`,
      // @noflow - Flow does not seem to know that SharedWorker takes optional name.
      "IPFS"
    )
    this.worker = worker
    this.connect()
  }
  postMessage(data /*:mixed*/, transfer /*::?:ArrayBuffer[]*/) {
    this.worker.port.postMessage(data, transfer)
  }
  connect() {
    this.worker.addEventListener("error", this)
    this.worker.port.addEventListener("message", this)
    this.worker.port.start()
    return this
  }
  disconnect() {
    this.worker.removeEventListener("error", this)
    this.worker.port.removeEventListener("message", this)
    this.worker.port.close()
  }
}

class IPFSServiceWorkerConnection extends Connection {
  /*::
  serviceWorker:Promise<ServiceWorker>
  port:?ServiceWorker
  */
  static async connect() {
    const { serviceWorker } = navigator
    if (!serviceWorker) {
      throw Error("Runtime does not provide `ServiceWorker` API")
    }

    const scope = new URL("/lunet/worker/", location.href).href
    let registration = await serviceWorker.getRegistration(scope)
    if (registration == null) {
      registration = await serviceWorker.register(`/ipfs.js`, {
        scope,
        type: "classic"
      })
    }

    const worker =
      registration.active || registration.waiting || registration.installing

    if (worker == null) {
      throw Error(`Service worker registration has failed`)
    }

    return worker
  }
  constructor() {
    super()
    this.serviceWorker = IPFSServiceWorkerConnection.connect()
    this.port = null
    this.activate()
  }

  async activate() {
    const serviceWorker = await this.serviceWorker
    this.port = serviceWorker
    serviceWorker.addEventListener("message", this)
    this.ping()
  }
  async deactivate() {
    const serviceWorker = await this.serviceWorker
    serviceWorker.removeEventListener("message", this)
  }
  postMessage(data /*:mixed*/, transfer /*::?:ArrayBuffer[]*/) {
    const { port } = this
    if (port != null) {
      const $transfer /*:any*/ = transfer
      port.postMessage(data, $transfer)
    } else {
      this.enqueueMessage(data, transfer)
    }
  }
  async enqueueMessage(data /*:mixed*/, transfer /*:?ArrayBuffer[]*/) {
    const port = await this.serviceWorker
    const $transfer /*:any*/ = transfer
    port.postMessage(data, $transfer)
  }
  onpong() {
    this.ping()
  }
}

class LocalIPFSMount {
  /*::
  address:Address
  service:IPFSService
  */
  resolvePath(path) {
    return `/Local/${this.address.toString()}${path}`
  }
  async stat(path /*:string*/) {
    const arg = this.resolvePath(path)
    const url = new URL(`/api/v0/files/stat?arg=${arg}`, BASE_URL)
    try {
      const arg = this.resolvePath(path)

      const response = await this.service.fetch(url)
      if (response.status === 200) {
        const { Type: type, CumulativeSize: size } = await response.json()
        return new Response(JSON.stringify({ type, size }), {
          status: 200,
          headers: {
            "content-type": "application/json"
          }
        })
      } else {
        return new Response(JSON.stringify({ error: "does not exist" }), {
          status: 404,
          headers: {
            "content-type": "application/json"
          }
        })
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.toString() }), {
        status: 500,
        headers: {
          "content-type": "application/json"
        }
      })
    }
  }
  async list(path /*:string*/) {
    const arg = this.resolvePath(path)
    const url = new URL(`/api/v0/files/ls?l=1&arg=${arg}`, BASE_URL)
    try {
      const response = await this.service.fetch(url)
      if (response.status === 200) {
        const { Entries } = await response.json()
        const entries = Entries.map(entry => ({
          type: entry.Type === 0 ? "file" : "directory",
          name: entry.Name,
          size: entry.Size
        }))
        return new Response(entries, {
          status: 200,
          headers: {
            "content-type": "application/json"
          }
        })
      } else {
        return response
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.toString() }), {
        status: 500,
        headers: {
          "content-type": "application/json"
        }
      })
    }
  }
  async watch(path /*:string*/) {
    return new Response(
      JSON.stringify({ error: "Watch API is not yet implemented" }),
      {
        status: 501,
        statusText: "Not Implemented",
        headers: { "content-type": "application/json" }
      }
    )
  }
  async read(path /*:string*/, offset /*:?number*/, length /*:?number*/) {
    const arg = this.resolvePath(path)
    const params = SearchParams({ arg, offset, length })
    const url = new URL(`/api/v0/files/read?${params.toString()}`, BASE_URL)
    try {
      return await this.service.fetch(url)
    } catch (error) {
      return new Response(JSON.stringify({ error: error.toString() }), {
        status: 500,
        headers: {
          "content-type": "application/json"
        }
      })
    }
  }
  async write(
    path /*:string*/,
    content /*:Request*/,
    options /*:{offset:?number, length:?number, parents:?boolean, truncate:?boolean, create:?boolean, title:?string}*/
  ) {
    const arg = this.resolvePath(path)
    const params = SearchParams({ ...options, arg })
    const url = new URL(`/api/v0/files/write?${params.toString()}`, BASE_URL)
    const formData = new FormData()
    const blob = await content.blob()
    formData.append("file", blob)
    const request = new Request(url, { method: "POST", body: formData })
    return await this.service.fetch(request)
  }
  async delete(path /*:string*/, recursive /*:?boolean*/) {
    const arg = this.resolvePath(path)
    const params = new SearchParams({ arg, r: recursive })
    const url = new URL(`/api/v0/files/rm?${params.toString()}`, BASE_URL)
    return await this.service.fetch(url)
  }
}

// -------------------------------------

const BASE_URL = new URL("/", self.location.href)
const SERVICE_URL = "/service.js"
const SERVICE_SCOPE = "/"

const SANDBOX_CSP = `default-src 'self' data: blob: lunet.link; script-src 'self' blob: data: 'unsafe-inline' 'unsafe-eval' lunet.link; style-src 'self' data: blob: 'unsafe-inline'; connect-src 'self' data: blob: lunet.link http://127.0.0.1:5001 http://127.0.0.1:8080;`
const SANDBOX_DOMAIN = "celestial.link"
const SANDBOX_OPTIONS = [
  "allow-scripts",
  "allow-presentation",
  "allow-popups",
  "allow-pointer-lock",
  "allow-orientation-lock",
  "allow-modals",
  "allow-forms",
  "allow-same-origin"
]

const base32CidPattern = /^baf[abcdefghijklmnopqrstuvwxyz234567=]{56}$/
const base58btcPattern = /^Qm[A-Za-z0-9]{44}$/

// Takes pathname representing address composition and returns the parsed
// representation contaning every address.
//
// parseAddressComposition('/ipfs/Qm...5MdVo/document|/ipfs/Qm...F9Ufd/render')
// [
//   { protocol:"ipfs", authority:"Qm...5MdVo", key: "Qm...5MdVo", pathname:"document" },
//   { protocol:"ipfs", authority:"Qm...5MdVo", key: "Qm...F9Ufd", pathname:"/render" }
// ]
//
// parseAddressComposition('/ipfs/Qm...5MdVo/code.js|/dat/code.gozala.io')
// [
//   { protocol:"ipfs", authority: "Qm...5MdVo", key:"Qm...5MdVo", pathname: "/document" },
//   { protocol:"dat", authority: "code.gozala.io", key:"515...a27f", pathname:"/" }
// ]

const parseAddressComposition = (address /*:string*/) /*:Address[]*/ =>
  address.split("!").map(Address.parse)

class Address {
  static parse(address /*:string*/) /*:Address*/ {
    const input = address.startsWith("/") ? address.slice(1) : address
    const match = input.match(/\/|:/)
    if (match == null) {
      return new Address("", input, "/")
    }
    const protocol = input.slice(0, match.index)
    const locator = input.slice(match.index + 1).replace(/^\/+/, "")
    if (locator === "") {
      if (match[0] === ":") {
        return new Address(protocol, "", "")
      } else {
        return new Address("", protocol, "")
      }
    } else {
      const index = locator.indexOf("/")
      if (index < 0) {
        return new Address(protocol, locator, "")
      } else {
        const authority = locator.slice(0, index)
        const pathname = locator.slice(index)
        return new Address(protocol, authority, pathname)
      }
    }
  }
  /*::
  protocol:string
  authority:string
  pathname:string
  */
  constructor(
    protocol /*:string*/,
    authority /*:string*/,
    pathname /*:string*/
  ) {
    this.protocol = protocol
    this.authority = authority
    this.pathname = pathname
  }
  toString() {
    const { protocol, authority, pathname } = this
    return protocol === ""
      ? `/${authority}${pathname}`
      : `/${protocol}/${authority}${pathname}`
  }
  toURLString() {
    const { protocol, authority, pathname } = this
    return protocol === ""
      ? `//${authority}${pathname}`
      : `${protocol}://${authority}${pathname}`
  }

  setPathname(pathname /*:string*/) {
    if (this.pathname === pathname) {
      return this
    } else {
      const { protocol, authority } = this
      return new this.constructor(protocol, authority, pathname)
    }
  }
  resolve(path /*:string*/) {
    const { pathname, authority, protocol } = this
    const base = pathname.endsWith("/") ? pathname : `${pathname}/`
    const relative = path.startsWith("/") ? path.slice(1) : path
    return new Address(protocol, authority, `${base}${relative}`)
  }
}

// class Driver {
//   /*::
//   address:Address
//   origin:string
//   key:string
//   */
//   formatSandboxURL({ search, hash } /*:{search:string, hash:string}*/) {
//     const { pathname } = this.address
//     const params = new URLSearchParams({ search, hash, pathname })
//     return `https://${this.origin}.${SANDBOX_DOMAIN}/?${params.toString()}`
//   }
// }

/*::
type WriteOptions = {
  offset?:?number;
  length?:?number;
  parents?:?boolean;
  truncate?:?boolean;
  create?:?boolean;
  title?:?string;
}

type ReadOptions = {
  offset?:?number;
  length?:?number;
}

type Stat = {
  type:"directory"|"file";
  size:number;
}

type Entry = {
  type:"directory"|"file";
  name:string;
  size:number;
}

interface DeletOptions {
  recursive?:?boolean;
}

interface Resource {
  isLocal:boolean;
  address:Address;
  stat(string):Promise<?Stat>;
  list(string):Promise<Entry[]>;
  watch(string):Promise<Response>;
  read(string, options?:ReadOptions):Promise<Response>;
  write(string, Request, options?:WriteOptions):Promise<void>;
  delete(string, options?:DeletOptions):Promise<void>;
}

interface Driver {
  origin:string;
  address:Address;
  fetch(string):Promise<Response>;
  createMount():Promise<Resource>;
}
*/

class IPFSDriver /*::implements Driver*/ {
  static async mount(service /*:IPFSService*/, address /*:Address*/) {
    const { protocol, authority } = address
    switch (protocol) {
      case "ipfs": {
        const key = authority
        const origin = await service.formatAsBase32(key)
        return new IPFSDriver(service, address, key, origin)
      }
      case "ipns":
      // if protocol unknown assume ipns
      case "": {
        // const name = authority.includes(".")
        //   ? await service.resolveDNSLink(authority)
        //   : authority

        const { cid } = await service.resolveName(authority)
        const origin = authority.split(".").join("_")
        return new IPFSDriver(service, address, cid, origin)
      }
      default: {
        throw RangeError(
          `Address ${address.toString()} is not vaild IPFS resource`
        )
      }
    }
  }
  /*::
  service:IPFSService;
  address:Address;
  cid:string;
  origin:string;
  */
  constructor(
    service /*:IPFSService*/,
    address /*:Address*/,
    cid /*:string*/,
    origin /*:string*/
  ) {
    this.service = service
    this.address = address
    this.cid = cid
    this.origin = origin
  }
  resolvePath(path /*:string*/ = "") {
    return `/ipfs/${this.cid}${path}`
  }
  async fetch(path /*:string*/) {
    const url = new URL(this.resolvePath(path), BASE_URL)
    const response = await this.service.fetch(url)
    if (response.status === 302) {
      const headers = response.headers
      const location = headers.get("location")
      if (location && !location.startsWith("/")) {
        const { pathname } = new URL(location)
        // const base = this.resolvePath()
        // const path = pathname.startsWith(base)
        //   ? pathname.slice(base.length)
        //   : pathname
        // const url = new URL(path, request.url)
        headers.set("location", pathname)
      }
    }
    return response
  }
  async createMount() {
    return new IPFSResource(
      this.service,
      Address.parse(this.resolvePath("data")),
      this.cid
    )
  }
}

class LocalIPFSDriver /*::implements Driver*/ {
  /*::
  service:IPFSService
  address:Address
  key:string
  origin:string
  base:string
  */
  constructor(
    service /*:IPFSService*/,
    address /*:Address*/,
    key /*:string*/,
    origin /*:string*/
  ) {
    this.service = service
    this.address = address
    this.origin = origin
    this.key = key

    const { pathname, authority } = address
    const path = pathname.endsWith("/")
      ? pathname.slice(0, pathname.length - 1)
      : pathname
    this.base = `/Local/${authority}${path}`
  }
  resolvePath(path /*:string*/ = "") {
    return `${this.base}${path}`
  }
  static async mount(service, address) {
    const { authority, pathname } = address
    const key = await service.resolveLocalName(authority)

    if (key != null) {
      const encoder = new TextEncoder()
      const hash = await window.crypto.subtle.digest(
        "SHA-256",
        encoder.encode(pathname)
      )
      const origin = base32Encode(new Uint8Array(hash))
      return new LocalIPFSDriver(service, address, key, origin)
    } else {
      throw new RangeError(`Local resource ${address.toString()} not found`)
    }
  }
  async stat(path /*:string*/) {
    const arg = this.resolvePath(path)
    const url = new URL(`/api/v0/files/stat?arg=${arg}`, BASE_URL)

    const response = await this.service.fetch(url)
    if (response.status === 200) {
      const { Type: type, CumulativeSize: size } = await response.json()
      return { type, size }
    } else {
      return null
    }
  }
  async read(path /*:string*/, { offset, length } /*:ReadOptions*/ = {}) {
    const arg = this.resolvePath(path)
    const params = SearchParams({ arg, offset, length })
    const url = new URL(`/api/v0/files/read?${params.toString()}`, BASE_URL)
    return await this.service.fetch(url)
  }
  detectContentType(path) {
    const extension = path.slice(path.lastIndexOf("."))
    return contentTypes[extension] || "application/octet-stream"
  }
  async cat(path /*:string*/) {
    const response = await this.read(path)
    response.headers.set("content-type", this.detectContentType(path))
    return response
  }
  async fetch(path) {
    const stat = await this.stat(path)
    if (stat == null) {
      return new Response("Not such file", {
        status: 404
      })
    } else if (stat.type === "file") {
      return await this.cat(path)
    } else {
      const file = path.endsWith("/") ? "index.html" : "/index.html"
      return await this.cat(`${path}${file}`)
    }
  }
  async createMount() {
    return new LocalIPFSResource(this.service, this.address.resolve("data"))
  }
  // format(pathname) {
  //   const { key, protocol } = this
  //   return `/Local/Applications/${protocol}/${key}${pathname}`
  // }
}

const contentTypes = {
  ".bmp": "image/bmp",
  ".css": "text/css",
  ".gif": "image/gif",
  ".htm": "text/html",
  ".html": "text/html",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".mp3": "audio/mpeg",
  ".mpeg": "video/mpeg",
  ".otf": "font/otf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".weba": "audio/webm",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff"
}

class IPFSResource /*::implements Resource*/ {
  /*::
  service:IPFSService
  address:Address
  origin:string
  cid:string
  isLocal:boolean
  */
  constructor(service /*:IPFSService*/, address /*:Address*/, cid /*:string*/) {
    this.isLocal = false
    this.service = service
    this.address = address
    this.cid = cid
  }
  static async mount(service /*:IPFSService*/, address /*:Address*/) {
    const { protocol, authority } = address
    switch (protocol) {
      case "ipfs": {
        const cid = authority
        return new IPFSResource(service, address, cid)
      }
      case "ipns":
      // if protocol unknown assume ipns
      case "": {
        // const name = authority.includes(".")
        //   ? await service.resolveDNSLink(authority)
        //   : authority

        const { cid } = await service.resolveName(authority)
        return new IPFSResource(service, address, cid)
      }
      default: {
        throw RangeError(
          `Address ${address.toString()} is not vaild IPFS resource`
        )
      }
    }
  }

  resolvePath(path /*:string*/) {
    return `/ipfs/${this.cid}${this.address.pathname}data${path}`
  }
  async stat(path /*:string*/) {
    const arg = this.resolvePath(path)
    const url = new URL(`/api/v0/files/stat?arg=${arg}`, BASE_URL)

    const response = await this.service.fetch(url)
    if (response.status === 200) {
      const { Type: type, CumulativeSize: size } = await response.json()
      return { type, size }
    } else {
      return null
    }
  }
  async list(path /*:string*/) {
    //   // TODO: Figure out why `/api/v0/files/ls` does not work here.
    const arg = this.resolvePath(path)
    const url = new URL(`/api/v0/file/ls?arg=${arg}`, BASE_URL)
    const response = await this.service.fetch(url)
    if (response.ok) {
      const { Objects, Arguments } = await response.json()
      const entry = Objects[Arguments[arg]]
      switch (entry.Type) {
        case "File": {
          return []
        }
        default: {
          return entry.Links.map(entry => ({
            type: entry.Type.toLowerCase(),
            name: entry.Name,
            size: entry.Size
          }))
        }
      }
    } else {
      const message = await response.text()
      throw new Error(message)
    }
  }
  async watch(path /*:string*/) {
    throw new Error("Can only watch local resources")
  }
  async read(path /*:string*/, { offset, length } /*:ReadOptions*/ = {}) {
    const arg = this.resolvePath(path)
    const params = SearchParams({ arg, offset, length })
    const url = new URL(`/api/v0/cat?${params.toString()}`, BASE_URL)
    return await this.service.fetch(url)
  }
  async write(
    path /*:string*/,
    content /*:Request*/,
    options /*:WriteOptions*/ = {}
  ) {
    throw new Error("Can not write into remote resource")
  }
  async delete(path /*:string*/, options /*:DeletOptions*/ = {}) {
    throw new Error("Can not delete remote resource")
  }
}

class LocalIPFSResource /*::implements Resource*/ {
  /*::
  service:IPFSService
  address:Address
  isLocal:boolean
  */
  constructor(service /*:IPFSService*/, address /*:Address*/) {
    this.isLocal = true
    this.service = service
    this.address = address
  }
  static async mount(service, address) {
    const { authority, pathname } = address
    const cid = await service.resolveLocalName(authority)

    if (cid != null) {
      return new LocalIPFSResource(service, address)
    } else {
      throw new RangeError(`Local resource ${address.toString()} not found`)
    }
  }

  resolvePath(path) {
    const { authority, pathname } = this.address
    return `/Local/${authority}${pathname}${path}`
  }

  async stat(path /*:string*/) {
    const arg = this.resolvePath(path)
    const url = new URL(`/api/v0/files/stat?arg=${arg}`, BASE_URL)

    const response = await this.service.fetch(url)
    if (response.status === 200) {
      const { Type: type, CumulativeSize: size } = await response.json()
      return { type, size }
    } else {
      return null
    }
  }
  async list(path /*:string*/) {
    const arg = this.resolvePath(path)
    const url = new URL(`/api/v0/files/ls?l=1&arg=${arg}`, BASE_URL)
    const response = await this.service.fetch(url)
    if (response.ok) {
      const { Entries } = await response.json()
      const entries = Entries.map(entry => ({
        type: entry.Type === 0 ? "file" : "directory",
        name: entry.Name,
        size: entry.Size
      }))
      return entries
    } else {
      const message = await response.text()
      throw new Error(message)
    }
  }
  async watch(path /*:string*/) {
    throw new Error("Watch API is not yet implemented")
  }
  async read(path /*:string*/, { offset, length } /*:ReadOptions*/ = {}) {
    const arg = this.resolvePath(path)
    const params = SearchParams({ arg, offset, length })
    const url = new URL(`/api/v0/files/read?${params.toString()}`, BASE_URL)
    return await this.service.fetch(url)
  }
  async write(
    path /*:string*/,
    content /*:Request*/,
    options /*:WriteOptions*/ = {}
  ) {
    const arg = this.resolvePath(path)
    const params = SearchParams({ ...options, arg })
    const url = new URL(`/api/v0/files/write?${params.toString()}`, BASE_URL)
    const formData = new FormData()
    const blob = await content.blob()
    formData.append("file", blob)
    const request = new Request(url, { method: "POST", body: formData })
    const response = await this.service.fetch(request)
    if (!response.ok) {
      throw Error(await response.text())
    }
  }
  async delete(path /*:string*/, { recursive } /*:DeletOptions*/ = {}) {
    const arg = this.resolvePath(path)
    const params = new SearchParams({ arg, r: recursive })
    const url = new URL(`/api/v0/files/rm?${params.toString()}`, BASE_URL)
    const response = await this.service.fetch(url)
    if (!response.ok) {
      throw Error(await response.text())
    }
  }
}

const base32Encode = (bytes, alphabet = "0123456789abcdefghjkmnpqrstvwxyz") => {
  let [shift, carry, result] = [3, 0, ""]

  for (const byte of bytes) {
    let symbol = carry | (byte >> shift)
    result += alphabet[symbol & 0x1f]

    if (shift > 5) {
      shift -= 5
      symbol = byte >> shift
      result += alphabet[symbol & 0x1f]
    }

    shift = 5 - shift
    carry = byte << shift
    shift = 8 - shift
  }

  if (shift !== 3) {
    result += alphabet[carry & 0x1f]
  }

  return result
}

const hexagonMarkup = options => {
  const { side } = options
  const strokeWidth = options.strokeWidth || 1
  const strokeColor = options.strokeColor || "#D9F8F3"
  const pathColor = options.pathColor || "#16A18A"
  const polygonFill = options.polygonFill || "none"
  const pathFill = options.pathFill || "none"
  const points = hexagonPath(side)
  const [_a, [width], _c, [, height], _e, f] = points
  const markup = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="${0 - 4 * strokeWidth} ${0 + 4 * strokeWidth} ${height} ${width}"
  width="${width * 2}px"
  height="${height * 2}px"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <polygon
    fill="${polygonFill}"
    stroke="${strokeColor}"
    stroke-width="${strokeWidth}"
    points="${points.join(" ")}"
  />
  <path
    class="path"
    stroke="${pathColor}"
    stroke-width="${strokeWidth}"
    d="M${f.join(",")} ${points.join(" ")}"
    stroke-linecap="round"
    fill="${pathFill}"
    stroke-linejoin="round"
  />
</svg>`
  return markup
}
const hexagonPath = (sideLength /*:number*/) => {
  const a = sideLength / 2
  const width = 2 * Math.sqrt(3) * a
  const height = 4 * a
  return [
    [Math.sqrt(3) * a, 0],
    [width, a],
    [width, 3 * a],
    [Math.sqrt(3) * a, height],
    [0, 3 * a],
    [0, a]
  ]
}

const hexagonStyleSheet = () => {
  return `
<style>
.path {
  stroke-dasharray: 400;
  stroke-dashoffset: -400;
}

.busy .path {
  animation: dash 3s linear infinite;
}

@keyframes dash {
  from {
    stroke-dashoffset: -400;
  }
  to {
    stroke-dashoffset: 400;
  }
}
</style>
`
}

window.userAgent = new UserAgent()
