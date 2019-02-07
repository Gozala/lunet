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
  worker:SharedWorker
  pendingRequests:{[string]:(Data.EncodedResponse) => void}
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

    this.pendingRequests = {}
    this.status = status
    this.isConnected = true
    this.connectedCallback()
  }
  connectedCallback() {
    if (this.isConnected) {
      const { serviceWorker } = navigator
      if (serviceWorker) {
        connect(
          this,
          serviceWorker
        )
      } else {
        setStatus(this, "🚫 Service workers are not unavailable")
      }
    }
  }
  disconnectedCallback() {}
  handleEvent(event) {
    switch (event.type) {
      case "message": {
        return receive(this, event)
      }
    }
  }
  get service() {
    const serviceWorker = navigator.serviceWorker
    return serviceWorker ? serviceWorker.controller : null
  }
  get mount() {
    return getSetting(this, "mount", "")
  }
}

export const connect = async (
  host /*:LunetHost*/,
  serviceWorker /*:ServiceWorkerContainer*/
) => {
  console.log("Host is connecting")
  const window = host.ownerDocument.defaultView
  window.addEventListener("message", host)
  try {
    const worker /*:SharedWorker*/ = new self.SharedWorker(`./ipfs.js`, "IPFS")
    worker.onerror = error => console.error(error)
    worker.port.addEventListener("message", host)
    worker.port.start()

    host.worker = worker

    // setStatus(host, "⚙️ Setting things up, to serve you even without interent.")

    // const serviceURL = new URL("./service.js", window.location.href)
    // // Uses the scope of the page it's served from.

    // const ready = serviceWorker.controller
    //   ? Promise.resolve(serviceWorker.controller)
    //   : when("controllerchange", serviceWorker)
    // host.ready = ready

    // console.log(`Host is registering service worker ${serviceURL.href}`)

    // const registration = await serviceWorker.register(serviceURL.href, {
    //   scope: "./",
    //   type: "classic"
    // })
    // host.registration = registration

    // setStatus(host, "🎛 Activating local setup")

    // await ready
    // console.log(`Host is controlled ${serviceURL.href}`, registration)
    // setStatus(host, "🛰 All set!")

    // if (window.top === window) {
    //   const service = await host.service
    //   setStatus(host, "🎉 Loading dashboard!")
    //   await activate(host)
    // } else {
    // history.replaceState(null, "", new URL("/", location.href).href)
    // }
  } catch (error) {
    setStatus(host, `☹️ Ooops, Something went wrong ${error}`)
  }
}

export const receive = (host /*:LunetHost*/, event /*:any*/) => {
  if (event.target instanceof MessagePort) {
    if (event.target === host.worker.port) {
      receiveWorkerMessage(host, event)
    } else {
      relay(host, event)
    }
  } else {
    console.log(`Host received a port from the client`)
    const [port] = event.ports
    if (port) {
      port.addEventListener("message", host)
      port.start()
    }
  }
}

const receiveWorkerMessage = (
  host /*:LunetHost*/,
  event /*:Data.WorkerOutbox*/
) => {
  const { data: message, target } = event
  switch (message.type) {
    case "pong": {
      return target.postMessage({ type: "ping" })
    }
    case "response": {
      return workerResponse(host, message)
    }
    case "request": {
      return workerRequest(host, message)
    }
  }
}

const workerResponse = (host, message) => {
  const { id, response } = message
  const pendingRequest = host.pendingRequests[id]
  delete pendingRequest[id]
  if (pendingRequest) {
    pendingRequest(response)
  } else {
    console.warn("Received response for unrecognized request")
  }
}

const workerRequest = async (host, message) => {
  const { id, request } = message
  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers: decodeHeaders(request.headers),
      body: request.body
    })
    const data = await encodeResponse(response)
    host.worker.port.postMessage({ type: "response", id, response: data })
  } catch (error) {
    const reseponse = new Response(error.toString(), {
      status: 500
    })
    const data = await encodeResponse(reseponse)
    host.worker.port.postMessage({ type: "response", id, response: data })
  }
}

export const relay = async (host /*:LunetHost*/, event /*:Data.Request*/) => {
  const { data, target, origin } = event
  const { request, id } = data

  await host.ready
  console.log(`Host is relaying request ${id} to daemon ${request.url}`)
  // const response = await fetch(decodeRequest(request))
  // const reseponse = await worker.respond(data)

  // const out = await encodeResponse(response)
  host.worker.port.postMessage(data, transfer(request))
  const response = await receiveResponse(host, id)
  // TODO: Make sure that origin of the requesting site is used.
  response.headers.push(["access-control-allow-origin", "*"])

  const message /*:Data.ResponseMessage*/ = {
    type: "response",
    id,
    response
  }

  console.log(
    `Host is forwarding response ${id} back to client ${response.url}`,
    message
  )

  target.postMessage(message, transfer(response))
}

const receiveResponse = (
  host /*:LunetHost*/,
  id /*:string*/
) /*:Promise<Data.EncodedResponse>*/ =>
  new Promise((resolve /*:Data.EncodedResponse => void*/) => {
    host.pendingRequests[id] = resolve
  })

// const activate = async host => {
//   const document = host.ownerDocument
//   // Once SW is ready we load "control panel" UI by fetching it from SW.
//   const response = await fetch(host.mount)
//   const content = await response.text()

//   const parser = new DOMParser()
//   const { documentElement } = parser.parseFromString(content, "text/html")

//   const root = documentElement
//     ? document.adoptNode(documentElement)
//     : document.createElement("html")

//   const scripts = [...root.querySelectorAll("script")]
//   for (const source of scripts) {
//     const script = document.createElement("script")
//     for (const { name, value, namespaceURI } of source.attributes) {
//       if (namespaceURI) {
//         script.setAttributeNS(namespaceURI, name, value)
//       } else {
//         script.setAttribute(name, value)
//       }
//     }
//     source.replaceWith(script)
//   }

//   history.pushState(null, "", response.url)

//   if (document.documentElement) {
//     document.documentElement.replaceWith(root)
//   } else {
//     document.appendChild(root)
//   }
// }

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

export const getSetting = (
  host /*:LunetHost*/,
  name /*:string*/,
  fallback /*:string*/ = ""
) /*:string*/ => {
  const meta = host.ownerDocument.querySelector(`meta[name=${name}]`)
  const value = meta ? meta.getAttribute("content") : null
  if (value != null && value !== "") {
    return value
  } else {
    return fallback
  }
}

const when = (type, target) =>
  new Promise(resolve => target.addEventListener(type, resolve, { once: true }))

const transfer = data => (data.body instanceof ArrayBuffer ? [data.body] : [])

window.main = LunetHost.new(document)
