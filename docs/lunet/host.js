// @flow strict

/*::
import * as Data from "./data.js"
*/

class LunetHost {
  /*::
  ownerDocument:Document
  registration:ServiceWorkerRegistration
  isConnected:boolean
  status:HTMLElement
  ready:Promise<mixed>
  handleEvent:Event => mixed
  service:IPFSService
  */
  static new(document) {
    const host = new this(document)
    return host
  }
  constructor(ownerDocument) {
    this.ownerDocument = ownerDocument
    const status = ownerDocument.createElement("h1")
    const body = ownerDocument.body
    if (body) {
      body.appendChild(status)
    }

    this.status = status
    this.isConnected = true
    this.connectedCallback()
  }
  connectedCallback() {
    if (this.isConnected) {
      this.ready = this.activate()
    }
  }
  disconnectedCallback() {}
  handleEvent(event) {
    switch (event.type) {
      case "message": {
        return this.receive(event)
      }
    }
  }
  receive(event /*:any*/) {
    if (event.target instanceof MessagePort) {
      this.relay(event)
    } else {
      this.connect(event.ports[0])
    }
  }
  connect(port) {
    console.log(`Host received a port from the client`)
    if (port) {
      port.addEventListener("message", this)
      port.start()
    }
  }
  async relay(event /*:Data.Request*/) {
    const { data, target, origin } = event
    await this.ready
    const message = await this.service.relay(data)

    console.log(
      `Host is forwarding response ${data.id} back to client ${
        message.response.url
      }`,
      message
    )

    target.postMessage(message, transfer(message.response))
  }
  async activate() {
    console.log("Host is connecting")
    const window = this.ownerDocument.defaultView
    window.addEventListener("message", this)
    try {
      const params = new URLSearchParams(location.search)
      const service = await IPFSService.spawn(params)
      this.service = service
    } catch (error) {
      setStatus(this, `☹️ Ooops, Something went wrong ${error}`)
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

const encodeHeaders = (headers /*:Headers*/) => [...headers.entries()]
const decodeHeaders = (headers /*:Array<[string, string]>*/) /*:Headers*/ => {
  const init /*:any*/ = headers
  return new Headers(init)
}

const setStatus = (host, status) => {
  host.status.textContent = status
}

const when = (type, target) =>
  new Promise(resolve => target.addEventListener(type, resolve, { once: true }))

const transfer = data => (data.body instanceof ArrayBuffer ? [data.body] : [])

class IPFSService {
  /*::
  handleEvent: Event => mixed
  port:ServiceWorker|MessagePort
  pendingRequests:{[string]:(Data.EncodedResponse) => void}
  */
  static spawn(params) {
    if (self.SharedWorker && params.get("use-sw") == null) {
      return IPFSSharedWorker.IPFSSharedWorker(self.SharedWorker, params)
    } else if (navigator.serviceWorker) {
      return IPFSServiceWorker.ServiceWorker(navigator.serviceWorker, params)
    } else {
      throw Error("Runtime does not provide `SharedWorker` nor `ServiceWorker`")
    }
  }
  constructor() {
    this.pendingRequests = {}
  }
  receive(event /*:Data.WorkerOutbox*/) {
    const { data: message, target } = event
    switch (message.type) {
      case "pong": {
        return this.pong()
      }
      case "response": {
        return this.response(message)
      }
      case "request": {
        return this.request(message)
      }
    }
  }
  response(message) {
    const { id, response } = message
    const pendingRequest = this.pendingRequests[id]
    delete pendingRequest[id]
    if (pendingRequest) {
      pendingRequest(response)
    } else {
      console.warn("Received response for unrecognized request")
    }
  }
  respond(id /*:string*/) /*:Promise<Data.EncodedResponse>*/ {
    return new Promise((resolve /*:Data.EncodedResponse => void*/) => {
      this.pendingRequests[id] = resolve
    })
  }
  async request(message) {
    const { id, request } = message
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: decodeHeaders(request.headers),
        body: request.body
      })
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
  async relay(
    data /*:Data.RequestMessage*/
  ) /*:Promise<Data.ResponseMessage>*/ {
    const { request, id } = data

    // const response = await fetch(decodeRequest(request))
    // const reseponse = await worker.respond(data)

    // const out = await encodeResponse(response)
    this.postMessage(data, transfer(request))
    const response = await this.respond(id)
    // TODO: Make sure that origin of the requesting site is used.
    response.headers.push(["access-control-allow-origin", "*"])

    const message /*:Data.ResponseMessage*/ = {
      type: "response",
      id,
      response
    }

    return message
  }
  pong() {}
  handleEvent(event) {
    switch (event.type) {
      case "message": {
        return this.receive(event)
      }
    }
  }
  postMessage(message, transfer /*:any*/) {
    this.port.postMessage(message, transfer)
  }
}

class IPFSSharedWorker extends IPFSService {
  /*::
  worker:SharedWorker
  port:ServiceWorker|MessagePort
  */
  static async IPFSSharedWorker(Worker, params) {
    const service = new this()
    const worker /*:SharedWorker*/ = new Worker(
      `./ipfs.js?${params.toString()}`,
      "IPFS"
    )
    worker.onerror = error => console.error(error)
    worker.port.addEventListener("message", service)
    worker.port.start()

    service.worker = worker
    service.port = worker.port
    return service
  }
}

class IPFSServiceWorker extends IPFSService {
  /*::
  port:ServiceWorker|MessagePort
  */
  static async ServiceWorker(
    serviceWorker /*:ServiceWorkerContainer*/,
    params
  ) {
    const service = new this()
    serviceWorker.addEventListener("message", service)

    const scope = new URL("./worker/", location.href).href

    let registration = await serviceWorker.getRegistration(scope)
    if (registration == null) {
      registration = await serviceWorker.register(
        `./ipfs.js?${params.toString()}`,
        {
          scope,
          type: "classic"
        }
      )
    }

    const maybeWorker /*:any*/ =
      registration.active || registration.waiting || registration.installing
    const worker /*:ServiceWorker*/ = maybeWorker

    service.port = worker

    service.ping()

    return service
  }
  ping() {
    this.port.postMessage({ type: "ping" })
  }
  pong() {
    this.ping()
  }
}

window.main = LunetHost.new(document)
