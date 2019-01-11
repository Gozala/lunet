// @flow strict

/*::
import * as Data from "./data.js"
*/

class LunetHost extends HTMLElement {
  /*::
  root:ShadowRoot
  isConnected:boolean
  status:HTMLElement
  controlled:Promise<mixed>
  */
  constructor() {
    super()
    const root = this.attachShadow({ mode: "closed" })
    const status = this.ownerDocument.createElement("h1")
    root.appendChild(status)

    this.root = root
    this.status = status
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
  const window = host.ownerDocument.defaultView
  window.addEventListener("message", host)

  try {
    setStatus(host, "⚙️ Setting things up, to serve you even without interent.")

    const serviceURL = new URL("/service.js?", window.location.href)
    // Uses the scope of the page it's served from.

    const registration = await serviceWorker.register(serviceURL.href, {
      scope: "./",
      type: "classic"
    })
    setStatus(host, "🎛 Activating local setup")

    const controlled = serviceWorker.controller
      ? Promise.resolve()
      : when("controllerchange", serviceWorker)

    host.controlled = controlled

    await controlled
    setStatus(host, "🛰 All set!")

    if (window.top === window) {
      const service = await host.service
      setStatus(host, "🎉 Loading dashboard!")
      await activate(host)
    }
  } catch (error) {
    setStatus(host, `☹️ Ooops, Something went wrong ${error}`)
  }
}

export const receive = (host /*:LunetHost*/, event /*:any*/) => {
  if (event.target instanceof MessagePort) {
    relay(host, event)
  } else {
    const [port] = event.ports
    if (port) {
      port.addEventListener("message", host)
      port.start()
    }
  }
}

export const relay = async (host /*:LunetHost*/, event /*:Data.Request*/) => {
  const { data, target, origin } = event
  const { request, id } = data
  const response = await fetch(decodeRequest(request))

  const out = await encodeResponse(response)

  const message /*:Data.ResponseMessage*/ = {
    type: "response",
    id,
    response: out
  }

  target.postMessage(message, transfer(out))
}

const activate = async host => {
  const document = host.ownerDocument
  // Once SW is ready we load "control panel" UI by fetching it from SW.
  const response = await fetch(host.mount)
  const content = await response.text()

  const parser = new DOMParser()
  const { documentElement } = parser.parseFromString(content, "text/html")

  const root = documentElement
    ? document.adoptNode(documentElement)
    : document.createElement("html")

  const scripts = [...root.querySelectorAll("script")]
  for (const source of scripts) {
    const script = document.createElement("script")
    for (const { name, value, namespaceURI } of source.attributes) {
      if (namespaceURI) {
        script.setAttributeNS(namespaceURI, name, value)
      } else {
        script.setAttribute(name, value)
      }
    }
    source.replaceWith(script)
  }

  history.pushState(null, "", response.url)

  if (document.documentElement) {
    document.documentElement.replaceWith(root)
  } else {
    document.appendChild(root)
  }
}

const decodeRequest = (request /*:Data.RequestData*/) =>
  new Request(request.url, {
    headers: new Headers(request.headers),
    body: request.body,
    method: request.method,
    cache: request.cache,
    credentials: request.credentials,
    destination: request.destination,
    integrity: request.integrity,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy
  })

const encodeResponse = async (
  response /*:Response*/
) /*:Promise<Data.ResponseData>*/ => {
  const body = await response.arrayBuffer()
  const headers /*:any*/ = [...response.headers.entries()]

  return {
    url: response.url,
    body,
    headers,
    status: response.status,
    statusText: response.statusText,
    redirected: response.redirected,
    type: response.type
  }
}

const setStatus = (host, status) => {
  host.status.textContent = status
}

export const getSetting = (
  client /*:LunetHost*/,
  name /*:string*/,
  fallback /*:string*/ = ""
) /*:string*/ => {
  const value = client.getAttribute(name)
  if (value != null && value !== "") {
    return value
  } else {
    const meta = client.ownerDocument.querySelector(`meta[name=${name}]`)
    const value = meta ? meta.getAttribute("content") : null
    if (value != null && value !== "") {
      return value
    } else {
      return fallback
    }
  }
}

const when = (type, target) =>
  new Promise(resolve => target.addEventListener(type, resolve, { once: true }))

const transfer = data => (data.body ? [data.body] : [])

customElements.define("lunet-host", LunetHost)
