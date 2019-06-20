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

  driver:Driver
  drive:Drive

  driverAddress:Address
  mountAddress:?Address
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
    await this.load()
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
    const [primary, secondary] = Address.parseComposition(pathname)

    const [mountAddress, driverAddress] =
      secondary == null ? [null, primary] : [primary, secondary]

    this.driverAddress = driverAddress
    this.frame.setAttribute("data-driver", driverAddress.toString())

    this.mountAddress = mountAddress
    if (mountAddress) {
      this.frame.setAttribute("data-mount", mountAddress.toString())
    }

    const driver = await this.createDriver(driverAddress)
    const drive = new IPFSDrive(this.services.ipfs, driverAddress.authority)

    if (mountAddress) {
      const resource = await this.createMount(mountAddress)
      drive.mount("/@", resource)
    }

    this.driver = driver
    this.drive = drive

    this.search = search
    this.hash = hash
    this.frame.src = this.sandboxURL.href
  }
  async loadContent(port /*:MessagePort*/) {
    await this.ready
    const { driverAddress, search, hash } = this
    const { pathname } = driverAddress
    const location = `${pathname}${search}${hash}`
    port.postMessage({ type: "load", location })
  }
  async createMount(address /*:Address*/) /*:Promise<Resource>*/ {
    const service = this.services
    switch (address.protocol) {
      case "ipfs":
      case "ipns":
        return await IPFSResource.mount(service.ipfs, address)
      case "local":
        return await LocalIPFSResource.mount(service.ipfs, address, true)
      case "": {
        // If protocol is unknown attempt to open as local resource
        // first otherwise attempt to open as IPNS resource
        try {
          return await LocalIPFSResource.mount(service.ipfs, address, true)
        } catch (error) {
          return await IPFSResource.mount(service.ipfs, address)
        }
      }
      default: {
        const { protocol, authority, pathname } = address
        const fallback = new Address("", protocol, `/${authority}${pathname}`)
        try {
          return await this.createMount(fallback)
        } catch (_) {
          throw RangeError(`Unsupported resource address ${address.toString()}`)
        }
      }
    }
  }
  async createDriver(address /*:Address*/) /*:Promise<Driver>*/ {
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
        const { protocol, authority, pathname } = address
        const fallback = new Address("", protocol, `/${authority}${pathname}`)
        try {
          return await this.createDriver(fallback)
        } catch (_) {
          throw RangeError(`Unsupported resource address ${address.toString()}`)
        }
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
  // mount(resource /*:Resource*/) {
  //   this.mountedResource = resource
  //   this.mountAddress = resource.address
  //   this.frame.setAttribute("data-mount", resource.address.toString())
  //   this.ownerDocument.defaultView.history.pushState(null, "", this.pathname)
  // }
  get sandboxURL() {
    const { search, hash } = this
    const { origin } = this.driver
    const { pathname } = this.driverAddress
    const params = new URLSearchParams({ search, hash, pathname })
    return new URL(`https://${origin}.${SANDBOX_DOMAIN}/?${params.toString()}`)
  }
  get sandboxOrigin() {
    return this.sandboxURL.origin
  }
  get pathname() {
    const { driverAddress, mountAddress, hash, search } = this
    const mount = mountAddress ? `${mountAddress.toString()}!` : ""
    const driver = `${driverAddress.toString()}${search}${hash}`
    return `${mount}${driver}`
  }
  disconnectedCallback() {}
  handleEvent(event /*:any*/) {
    switch (event.type) {
      case "message": {
        return this.onmessage(event)
      }
    }
  }
  onmessage(event /*:Data.AgentInbox*/) {
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
    // this.deactivate()
  }
  onready() {
    this.menu.classList.toggle("busy")
  }
  deactivate() {
    this.frame.removeEventListener("message", this)
  }
  setDriverLocation({ pathname, hash, search } /*:URL*/) {
    this.driverAddress = this.driverAddress.setPathname(pathname)
    this.hash = hash
    this.search = search
    this.ownerDocument.defaultView.history.replaceState(null, "", this.pathname)
  }
  onrequest(event /*:Data.Request*/) {
    return this.relay(event)
  }
  async onconnect(port /*:MessagePort*/) {
    console.log(`Host received a port from the client`)
    if (port) {
      port.addEventListener("message", this)
      port.start()

      // this.loadContent(port)
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
      const body = await data
      if (body instanceof Response) {
        return body
      } else {
        return new Response(JSON.stringify(body), {
          status: 200,
          headers: {
            "content-type": "application/json"
          }
        })
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.toString() }), {
        status: error.status || 500,
        headers: {
          "content-type": "application/json"
        }
      })
    }
  }
  // async stat(path /*:string*/) {
  //   const mountedResource = await this.mountedResource
  //   const info = await mountedResource.stat(path)
  //   if (info === null) {
  //     throw { status: 404, message: "Not such file or directory" }
  //   } else {
  //     return info
  //   }
  // }
  // async list(path /*:string*/) {
  //   const mountedResource = await this.mountedResource
  //   const entries = mountedResource.list(path)
  //   return entries
  // }
  // async watch(path /*:string*/) {
  //   const mountedResource = await this.mountedResource
  //   return mountedResource.watch(path)
  // }
  // async read(path /*:string*/, options /*::?:ReadOptions*/) {
  //   const mountedResource = await this.mountedResource
  //   return mountedResource.read(path, options)
  // }
  // async fork() {
  //   return this.mountedResource
  // }
  // async write(
  //   path /*:string*/,
  //   content /*:Request*/,
  //   options /*:{offset:?number, length:?number, parents:?boolean, truncate:?boolean, create:?boolean, title:?string}*/
  // ) {
  //   const mountedResource = await this.mountedResource
  //   if (mountedResource.open) {
  //     return mountedResource.write(path, content, options)
  //   } else {
  //     const mountedResource = await this.fork()
  //     return mountedResource.write(path, content, options)
  //   }
  // }
  // async delete(path /*:string*/, options /*::?:DeletOptions*/) {
  //   const mountedResource = await this.mountedResource
  //   if (mountedResource.open) {
  //     return mountedResource.delete(path, options)
  //   } else {
  //     try {
  //       const stat = await mountedResource.stat(path)
  //       const resource = await this.fork()
  //       return resource.delete(path, options)
  //     } catch (error) {}
  //   }
  // }
  async handleRequest(request /*:Request*/) /*:Promise<Response>*/ {
    const { method } = request
    const { hostname, pathname, origin, searchParams } = new URL(request.url)

    if (origin === this.sandboxOrigin) {
      // if (pathname.startsWith("/data")) {
      //   const path = pathname === "/data" ? "/" : pathname.substr(5)
      //   switch (method) {
      //     case "INFO": {
      //       return this.response(this.stat(path))
      //     }
      //     case "LIST": {
      //       return this.response(this.list(path))
      //     }
      //     case "GET": {
      //       const { headers } = request
      //       switch (headers.get("content-type")) {
      //         case "text/event-stream": {
      //           return await this.watch(path)
      //         }
      //         default: {
      //           const offset = decodeIntParam(searchParams, "offset")
      //           const length = decodeIntParam(searchParams, "length")
      //           return this.response(this.read(path, { offset, length }))
      //         }
      //       }
      //     }
      //     case "DELETE": {
      //       const recurse = decodeBooleanParam(searchParams, "recursive")
      //       return this.response(this.delete(path, { recurse }))
      //     }
      //     case "PUT": {
      //       const offset = decodeIntParam(searchParams, "offset")
      //       const length = decodeIntParam(searchParams, "length")
      //       const truncate = decodeBooleanParam(searchParams, "truncate")
      //       const create = decodeBooleanParam(searchParams, "create")
      //       const parents = decodeBooleanParam(searchParams, "parents")
      //       const title = searchParams.get("title")

      //       return this.response(
      //         this.write(path, request, {
      //           offset,
      //           length,
      //           truncate,
      //           create,
      //           parents,
      //           title
      //         })
      //       )
      //     }
      //     case "POST": {
      //       return new Response(
      //         JSON.stringify({
      //           error: `Write via POST method is not yet implemented`
      //         }),
      //         {
      //           status: 501,
      //           statusText: "Not Implemented"
      //         }
      //       )
      //     }
      //     default: {
      //       return new Response(JSON.stringify({ error: "Bad Request" }), {
      //         status: 400,
      //         statusText: "Bad Request",
      //         headers: { "content-type": "application/json" }
      //       })
      //     }
      //   }
      // } else
      if (pathname.startsWith("/data")) {
        const path = pathname === "/data" ? "/" : pathname.substr(5)
        switch (method) {
          case "INFO": {
            return this.response(this.drive.stat(path))
          }
          case "LIST": {
            return this.response(this.drive.list(path))
          }
          case "OPEN": {
            return this.response(
              this.drive.open(path, {
                create: searchParams.get("create"),
                new: decodeBooleanParam(searchParams, "new") || false
              })
            )
          }
          case "GET": {
            const { headers } = request
            switch (headers.get("content-type")) {
              case "text/event-stream": {
                return this.response(this.drive.watch(path))
              }
              default: {
                const offset = decodeIntParam(searchParams, "offset")
                const length = decodeIntParam(searchParams, "length")
                return this.response(this.drive.read(path, { offset, length }))
              }
            }
          }
          case "DELETE": {
            const recurse = decodeBooleanParam(searchParams, "recursive")
            return this.response(this.drive.delete(path, { recurse }))
          }
          case "PUT": {
            const offset = decodeIntParam(searchParams, "offset")
            const length = decodeIntParam(searchParams, "length")
            const truncate = decodeBooleanParam(searchParams, "truncate")
            const create = decodeBooleanParam(searchParams, "create")
            const parents = decodeBooleanParam(searchParams, "parents")
            const title = searchParams.get("title")

            return this.response(
              this.drive.write(path, request, {
                offset,
                length,
                truncate,
                create,
                parents,
                title
              })
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
        switch (method) {
          case "INFO": {
            return this.response(this.driver.stat(pathname))
          }
          case "LIST": {
            return this.response(this.driver.list(pathname))
          }
          case "GET": {
            return this.response(this.driver.fetch(pathname))
          }
          default: {
            return new Response(JSON.stringify({ error: "Bad Request" }), {
              status: 400,
              statusText: "Bad Request",
              headers: { "content-type": "application/json" }
            })
          }
        }
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

class Address {
  // Takes pathname representing address composition and returns the parsed
  // representation contaning every address.
  //
  // parseAddressComposition('/ipfs/Qm...5MdVo/document!/ipfs/Qm...F9Ufd/render')
  // [
  //   { protocol:"ipfs", authority:"Qm...5MdVo", key: "Qm...5MdVo", pathname:"document" },
  //   { protocol:"ipfs", authority:"Qm...5MdVo", key: "Qm...F9Ufd", pathname:"/render" }
  // ]
  //
  // parseAddressComposition('/ipfs/Qm...5MdVo/code.js!/dat/code.gozala.io')
  // [
  //   { protocol:"ipfs", authority: "Qm...5MdVo", key:"Qm...5MdVo", pathname: "/document" },
  //   { protocol:"dat", authority: "code.gozala.io", key:"515...a27f", pathname:"/" }
  // ]

  static parseComposition(address /*:string*/) /*:Address[]*/ {
    return address.split("!").map(Address.parse)
  }

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
class IPFSDriver /*::implements Driver*/ {
  static async mount(service /*:IPFSService*/, address /*:Address*/) {
    const { protocol, authority } = address
    switch (protocol) {
      case "ipfs": {
        const key = authority
        const origin = await service.formatAsBase32(key)
        return new IPFSDriver(service, key, origin)
      }
      case "ipns":
      // if protocol unknown assume ipns
      case "": {
        const { cid } = await service.resolveName(authority)
        const origin = authority.split(".").join("_")
        return new IPFSDriver(service, cid, origin)
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
  cid:string;
  origin:string;
  */
  constructor(service /*:IPFSService*/, cid /*:string*/, origin /*:string*/) {
    this.service = service
    this.cid = cid
    this.origin = origin
  }
  resolvePath(path /*:string*/ = "") {
    return `/ipfs/${this.cid}${path}`
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
  authority:string
  origin:string
  */
  constructor(
    service /*:IPFSService*/,
    authority /*:string*/,
    origin /*:string*/
  ) {
    this.service = service
    this.authority = authority
    this.origin = origin
  }
  resolvePath(path /*:string*/ = "") {
    return `/Local/${this.authority}${path}`
  }
  static async mount(service, address) {
    const { authority, pathname } = address
    const key = await service.resolveLocalName(authority)

    if (key != null) {
      // const encoder = new TextEncoder()
      // const hash = await window.crypto.subtle.digest(
      //   "SHA-256",
      //   encoder.encode(pathname)
      // )
      // const origin = `local_${base32Encode(new Uint8Array(hash))}`
      const domain = `${authority}.local`
      const origin = encodeURIComponent(
        domain.replace(/\s/g, "-").replace(/\./g, "_")
      )
      return new LocalIPFSDriver(service, authority, origin)
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
      return { type, size, open: true }
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
  async read(path /*:string*/, { offset, length } /*:ReadOptions*/ = {}) {
    const arg = this.resolvePath(path)
    const params = SearchParams({ arg, offset, length })
    const url = new URL(`/api/v0/files/read?${params.toString()}`, BASE_URL)
    return await this.service.fetch(url)
  }
  detectContentType(path) {
    const extension = path.slice(path.lastIndexOf("."))
    return contentTypes[extension]
  }
  async cat(path /*:string*/) {
    const response = await this.read(path)
    const contentType = this.detectContentType(path)
    if (contentType) {
      response.headers.set("content-type", contentType)
    } else if (!response.headers.has("content-type")) {
      response.headers.set("content-type", "application/octet-stream")
    }
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
    return new LocalIPFSResource(
      this.service,
      new Address("local", this.authority, "/"),
      null,
      false
    )
  }
}

class IPFSResource /*::implements Resource*/ {
  /*::
  service:IPFSService
  address:Address
  origin:string
  cid:string
  */
  constructor(service /*:IPFSService*/, address /*:Address*/, cid /*:string*/) {
    this.service = service
    this.address = address
    this.cid = cid
  }
  get open() {
    return false
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
      return { type, size, open: this.open }
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
    content /*:Request|Response*/,
    options /*:WriteOptions*/ = {}
  ) {
    throw new Error("Can not write into remote resource")
  }
  async delete(path /*:string*/, options /*:DeletOptions*/ = {}) {
    throw new Error("Can not delete remote resource")
  }
}

/*::
interface CryptoKey {
  algorithm:string;
}
interface Encryption {
  key:CryptoKey;
  algorithm:Object
}
*/

class LocalIPFSResource /*::implements Resource*/ {
  /*::
  service:IPFSService
  address:Address
  encryption:?Encryption
  open:boolean
  */
  constructor(
    service /*:IPFSService*/,
    address /*:Address*/,
    encryption /*:?Encryption*/,
    open /*:boolean*/
  ) {
    this.open = open
    this.service = service
    this.address = address
    this.encryption = encryption
  }
  static async read(service, path, { offset, length } /*:ReadOptions*/ = {}) {
    const params = SearchParams({ arg: path, offset, length })
    const url = new URL(`/api/v0/files/read?${params.toString()}`, BASE_URL)
    const content = await service.fetch(url)
    if (content.ok) {
      return content
    } else {
      throw new Error("Resource not found")
    }
  }
  static async write(
    service /*:IPFSService*/,
    path /*:string*/,
    content /*:Request|Response*/,
    options /*:WriteOptions*/ = {}
  ) {
    const arg = path
    const params = SearchParams({ ...options, arg })
    const url = new URL(`/api/v0/files/write?${params.toString()}`, BASE_URL)
    const formData = new FormData()
    const blob = await content.blob()
    formData.append("file", blob)
    const request = new Request(url, { method: "POST", body: formData })
    const response = await service.fetch(request)
    if (!response.ok) {
      throw Error(await response.text())
    }
  }
  static resolveResourcePath(address /*:Address*/) {
    return `/Local/${address.authority}.data${address.pathname}.data`
  }
  static async mount(service, address /*:Address*/, open /*:boolean*/) {
    const path = this.resolveResourcePath(address)
    const file = await this.read(service, `${path}/.keychain`)
    const keychain = file.ok ? await file.json() : null
    if (keychain) {
      const { data, algorithm } = keychain.base
      // TODO: Needs a more reasonable solution
      algorithm.iv = new Uint8Array(algorithm.iv)
      const key = await window.crypto.subtle.importKey(
        "jwk",
        data,
        algorithm,
        true,
        ["encrypt", "decrypt"]
      )
      return new LocalIPFSResource(service, address, { key, algorithm }, open)
    } else {
      throw new RangeError(`Local resource not found`)
    }
  }
  static async create(service, address, open /*:boolean*/) {
    const path = this.resolveResourcePath(address)
    const iv = window.crypto.getRandomValues(new Uint8Array(16))
    const algorithm = {
      name: "AES-GCM",
      length: 256,
      iv: [iv]
    }
    const key = await window.crypto.subtle.generateKey(algorithm, true, [
      "encrypt",
      "decrypt"
    ])
    const data = await window.crypto.subtle.exportKey("jwk", key)
    const body = JSON.stringify({ base: { data, algorithm } })

    await this.write(service, `${path}/.keychain`, new Response(body), {
      create: true,
      parents: true
    })

    return new LocalIPFSResource(service, address, { key, algorithm }, open)
  }

  resolvePath(path) {
    return `${LocalIPFSResource.resolveResourcePath(this.address)}${path}`
  }

  async stat(path /*:string*/) {
    const arg = this.resolvePath(path)
    const url = new URL(`/api/v0/files/stat?arg=${arg}`, BASE_URL)

    const response = await this.service.fetch(url)
    if (response.status === 200) {
      const { Type: type, CumulativeSize: size } = await response.json()
      return { type, size, open: this.open }
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
      throw new Error(response.statusText)
    }
  }
  async watch(path /*:string*/) {
    throw new Error("Watch API is not yet implemented")
  }
  async read(path /*:string*/, options /*::?:ReadOptions*/) {
    const { encryption, service } = this
    const arg = this.resolvePath(path)
    const content = await LocalIPFSResource.read(
      service,
      this.resolvePath(path),
      options
    )
    if (encryption) {
      const buffer = await content.arrayBuffer()
      const data = await window.crypto.subtle.decrypt(
        encryption.algorithm,
        encryption.key,
        buffer
      )
      return new Response(data)
    } else {
      return content
    }
  }
  async write(
    path /*:string*/,
    content /*:Request|Response*/,
    options /*::?:WriteOptions*/
  ) {
    const { encryption, service } = this
    let body = content
    if (encryption) {
      const buffer = await content.arrayBuffer()
      const data = await window.crypto.subtle.encrypt(
        encryption.algorithm,
        encryption.key,
        buffer
      )
      body = new Response(data)
    }

    return await LocalIPFSResource.write(
      service,
      this.resolvePath(path),
      body,
      options
    )
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

class IPFSDrive /*::implements Drive*/ {
  /*::
  authority:string
  service:IPFSService
  opened:?{path:string, resource:Resource}
  */
  constructor(service /*:IPFSService*/, authority /*:string*/) {
    this.service = service
    this.authority = authority
  }
  resolvePath(path /*:string*/) {
    return `/Local/${this.authority}.data${path}`
  }
  resolve(path /*:string*/ = "") {
    const { opened } = this
    const result =
      opened == null
        ? [this.resolvePath(path), null]
        : path.startsWith("/@/")
        ? [path.slice(2), opened.resource]
        : path.startsWith(opened.path)
        ? [path.slice(opened.path.length), opened.resource]
        : [this.resolvePath(path), null]
    return result
  }
  async stat(path /*:string*/) {
    const [arg, resource] = this.resolve(path)
    if (resource) {
      return await resource.stat(arg)
    } else {
      const url = new URL(`/api/v0/files/stat?arg=${arg}`, BASE_URL)
      const response = await this.service.fetch(url)
      if (response.status === 200) {
        const { Type: type, CumulativeSize: size } = await response.json()
        return { type, size }
      } else {
        return null
      }
    }
  }
  async list(path /*:string*/) {
    const [arg, resource] = this.resolve(path)
    if (resource) {
      const entries = await resource.list(arg)
      return entries.map(entry => {
        if (entry.type === "file") {
          return {
            type: "file",
            name: entry.name,
            path: `${path}${entry.name}`
          }
        } else {
          return {
            type: "directory",
            name: entry.name,
            path: `${path}${entry.name}`
          }
        }
      })
    } else {
      const url = new URL(`/api/v0/files/ls?l=1&arg=${arg}`, BASE_URL)
      const response = await this.service.fetch(url)
      if (response.ok) {
        const openedPath = this.opened && this.opened.path
        const { Entries } = await response.json()
        const entries = Entries.map(entry => {
          const { Name: entryName, Type: entryType, Size: size } = entry
          const type = entryName.endsWith(".data") ? "data" : "directory"
          const name =
            type === "data"
              ? entryName.slice(0, entryName.length - 5)
              : entryName
          const pathname = `${path}${name}`
          const open = type === "data" && pathname === openedPath

          return { name, type, path: pathname, open }
        })

        if (path === "/" && this.opened) {
          entries.unshift({
            name: "@",
            path: "/@",
            open: true,
            type: "data"
          })
        }

        return entries
      } else if (response.status === 404) {
        if (path === "/") {
          return []
        } else {
          throw Error("Not such resource")
        }
      } else {
        const message = await response.text()
        throw new Error(message)
      }
    }
  }
  async watch(path /*:string*/) {
    const [arg, resource] = this.resolve(path)
    if (resource) {
      return await resource.watch(arg)
    } else {
      throw Error("Can only watch open resources")
    }
  }
  async read(path /*:string*/, options /*::?:ReadOptions*/) {
    const [arg, resource] = this.resolve(path)
    if (resource) {
      return await resource.read(arg, options)
    } else {
      throw Error("Can only read from open resources")
    }
  }
  async write(
    path /*:string*/,
    content /*:Request|Response*/,
    options /*::?:WriteOptions*/
  ) {
    const [arg, resource] = this.resolve(path)
    if (resource) {
      return await resource.write(arg, content, options)
    } else {
      throw Error("Can only write into open resources")
    }
  }
  async delete(path /*:string*/, options /*::?:DeletOptions*/) {
    const [arg, resource] = this.resolve(path)
    if (resource) {
      return await resource.delete(arg, options)
    } else {
      throw Error("Can only delete open resources")
    }
  }
  async open(path, options /*:OpenOptions*/) {
    const address = new Address("", this.authority, path)
    if (path === "/") {
      return await this.select(options)
    } else {
      const resource =
        options.create != null
          ? await LocalIPFSResource.create(this.service, address, true)
          : await LocalIPFSResource.mount(this.service, address, true)
      return this.mount(path, resource)
    }
  }
  async select(path) {
    throw Error(`Data source selector is not implemented`)
  }
  async mount(path, resource /*:Resource*/) {
    this.opened = { path, resource }
    return { path, address: resource.toString() }
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
      return true
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
  +open:boolean;
  +address:Address;
  stat(string):Promise<?Stat>;
  list(string):Promise<Entry[]>;
  watch(string):Promise<Response>;
  read(string, options?:ReadOptions):Promise<Response>;
  write(string, Request|Response, options?:WriteOptions):Promise<void>;
  delete(string, options?:DeletOptions):Promise<void>;
}

type OpenOptions = {
  create?: ?string,
  new: boolean
 }



interface Driver {
  origin:string;
  stat(string):Promise<?Stat>;
  list(string):Promise<Entry[]>;
  fetch(string):Promise<Response>;
  createMount():Promise<Resource>;
}

type DriveEntry =
  | { type: "file", name:string, path:string }
  | { type: "directory", name:string, path:string }
  | { type: "document", name:string, open:boolean, path:string }

interface Drive {
  stat(string):Promise<?Stat>;
  list(path:string):Promise<DriveEntry[]>;
  open(path:string, OpenOptions):Promise<{path:string, address:string}>;
  watch(string):Promise<Response>;
  read(string, options?:ReadOptions):Promise<Response>;
  write(string, Request|Response, options?:WriteOptions):Promise<void>;
  delete(string, options?:DeletOptions):Promise<void>;
}
*/

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

window.userAgent = new UserAgent()
