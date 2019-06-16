// @flow strict

// Script is loaded into an application sandbox iframe. It registers a service
// worker `./lunet.js` (which by default is just an imports from
// `//lunet.link/proxy.js`) and establishes connection with an embedder by
// sending a `MessagePort` to the parent document.
// Script will listen for messages from the Service Worker and forward them
// to the embedder via `MessagePort` and forward responses from `MessagePort`
// back to the Service Worker. More simply it will act as a proxy requests
// received by the Service Worker to the embedder.
// Note: It this script along with all the service worker stuff is just
// for a convenience, application may choose to use different service worker
// implementation or do a direct calls to the embedder, there for API
// limitations MUST be imposed by the embedder (which has a different Origin) to
// ensure that application is sandboxed.
// P.S. Application will be loaded from distinct origin keyed to the CID of the
// appliaction code and have CSP set such that it will not be able to
// communicate with any other host there for preventing tracking or sharing data
// without user consent.
/*::
import * as Data from "./lunet/data.js"
*/

export class LunetClient {
  /*::
  ownerDocument:Document
  params:URLSearchParams
  host:HTMLIFrameElement
  status:HTMLElement
  isConnected:boolean
  handleEvent:Event => mixed
  connected:Promise<mixed>
  controlled:Promise<mixed>
  port:MessagePort
  */
  static new(ownerDocument /*:Document*/) {
    const client = new this(ownerDocument)
    return client
  }
  constructor(ownerDocument /*:Document*/) {
    this.ownerDocument = ownerDocument
    const status = this.ownerDocument.createElement("span")

    this.status = status
    this.params = new URLSearchParams(ownerDocument.location.search)
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
        setStatus(this, "🚫")
      }
    }
  }
  disconnectedCallback() {}
  handleEvent(event /*:Event*/) {
    switch (event.type) {
      case "message": {
        return receive(this, event)
      }
      case "hashchange": {
        const $event /*:any*/ = event
        return this.hashchange($event)
      }
      case "popstate": {
        const $event /*:any*/ = event
        return this.popstate($event)
      }
      case "click": {
        const $event /*:any*/ = event
        return this.click($event)
      }
      case "beforeunload": {
        return this.beforeunload(event)
      }
    }
  }
  hashchange(event /*:Data.HashChangeEvent*/) {
    return top.postMessage(
      {
        type: "hashchange",
        hashchange: {
          newURL: event.newURL,
          oldURL: event.oldURL
        }
      },
      "*"
    )
  }
  popstate(event /*:Data.PopStateEvent*/) {
    return top.postMessage(
      {
        type: "popstate",
        popstate: {
          newURL: location.href,
          state: event.state
        }
      },
      "*"
    )
  }
  pushState(state /*:Object*/, title /*:?string*/, href /*:string*/) {
    return top.postMessage(
      {
        type: "pushstate",
        pushstate: {
          newURL: location.href,
          href,
          title,
          state
        }
      },
      "*"
    )
  }
  replaceState(state /*:Object*/, title /*:?string*/, href /*:string*/) {
    return top.postMessage(
      {
        type: "replacestate",
        replacestate: {
          newURL: location.href,
          href,
          state,
          state
        }
      },
      "*"
    )
  }
  ready() {
    return top.postMessage(
      {
        type: "ready"
      },
      "*"
    )
  }
  click(
    event /*:{target:HTMLAnchorElement & { referrerpolicy?:string}, preventDefault():void}*/
  ) {
    const { href, target, referrerpolicy, rel, type } = event.target
    if (href != null && href != "") {
      const url = new URL(href)
      if (location.origin !== url.origin) {
        event.preventDefault()
        self.open(href, target || "_blank")
      }
    }
  }
  beforeunload(event /*:Event*/) {
    event.preventDefault()
    return top.postMessage(
      {
        type: "beforeunload",
        beforeunload: { href: location.href }
      },
      "*"
    )
  }
  get serviceURL() {
    return getSetting(this, "service", "./lunet.js")
  }
  get scope() {
    return getSetting(this, "scope", "./")
  }
  get mount() {
    return getSetting(this, "mount", "")
  }
  get serviceWorkerVersion() {
    return this.params.get("sw-version")
  }
  get service() {
    const serviceWorker = navigator.serviceWorker
    return serviceWorker ? serviceWorker.controller : null
  }
}

const setup = client => {
  window.addEventListener("hashchange", client)
  window.addEventListener("popstate", client)
  window.addEventListener("click", client)
  window.addEventListener("beforeunload", client)
  const { pushState, replaceState } = History.prototype
  const History$prototype /*:Object*/ = History.prototype
  Object.defineProperties(History$prototype, {
    pushState: {
      value(state, title, url) {
        pushState.call(this, state, title, url)
        client.pushState(state, title, url)
      }
    },
    replaceState: {
      value(state, title, url) {
        replaceState.call(this, state, title, url)
        client.replaceState(state, title, url)
      }
    }
  })
}

export const connect = async (
  client /*:LunetClient*/,
  serviceWorker /*:ServiceWorkerContainer*/
) => {
  setup(client)

  const { mount, serviceURL, scope, serviceWorkerVersion } = client
  const swv = serviceWorkerVersion ? `&swv=${serviceWorkerVersion}` : ""

  const src = `${serviceURL}?${swv}`
  const { port1, port2 } = new MessageChannel()
  port1.addEventListener("message", client)
  serviceWorker.addEventListener("message", client)
  self.top.postMessage({ type: "connect", port: port2 }, "*", [port2])

  client.port = port1

  if (!serviceWorker.controller) {
    setStatus(client, "⚙️")
    const registration = await serviceWorker.register(src, {
      scope,
      type: "classic"
    })
  }
  const controlled = serviceWorker.controller
    ? Promise.resolve()
    : when("controllerchange", serviceWorker)

  client.controlled = controlled

  setStatus(client, "🎛")
  client.port.start()

  await client.controlled
  setStatus(client, "🛰")

  activate(client)
}

const activate = async (client /*:LunetClient*/, event /*:any*/) => {
  const document = client.ownerDocument
  const { searchParams } = new URL(document.location.href)
  const pathname = searchParams.get("pathname") || "/"
  const search = searchParams.get("search") || ""
  const hash = searchParams.get("hash") || ""
  const url = `${pathname}${search}${hash}`

  history.replaceState(null, "", url)
  const response = await fetch(url)
  const contentType = response.headers.get("content-type") || ""
  const mime = contentType.split(";").shift()
  if (mime === "text/html") {
    await activateDocument(response)
  } else {
    await activateBlob(response)
  }
  client.ready()
}

const activateDocument = async response => {
  const content = await response.text()

  const parser = new DOMParser()
  const parsed /*:any*/ = parser.parseFromString(content, "text/html")
  const root /*:{head:HTMLHeadElement, body:HTMLBodyElement} & Document*/ = parsed
  // Remove old nodes
  const $document /*:any*/ = document
  const {
    head,
    body
  } /*:{head:HTMLHeadElement, body:HTMLBodyElement}*/ = $document

  // collect scripts scripts
  const scripts = []
  const links = []
  for (const source of [...root.querySelectorAll("script")]) {
    const script = document.createElement("script")
    const link = document.createElement("link")
    link.href = source.src
    link.rel = "preload"
    link.as = "script"
    links.push(link)

    for (const { name, value, namespaceURI } of source.attributes) {
      if (namespaceURI) {
        script.setAttributeNS(namespaceURI, name, value)
      } else {
        script.setAttribute(name, value)
      }
    }
    scripts.push(script)
    head.append(link)
    source.remove()
  }

  head.append(...links)

  head.append(...document.adoptNode(root.head).childNodes)

  const display = body.style.display
  body.style.display = "none"
  body.innerHTML = ""
  body.append(...document.adoptNode(root.body).childNodes)

  for (const script of scripts) {
    head.append(script)
    await when("load", script)
  }
  body.style.display = display
}

const activateBlob = async response => {
  const $document /*:any*/ = document
  const {
    head,
    body
  } /*:{head:HTMLHeadElement, body:HTMLBodyElement}*/ = $document
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const iframe = document.createElement("iframe")
  iframe.setAttribute("seamless", "true")
  iframe.setAttribute("sandbox", "")
  iframe.style.height = iframe.style.width = "100%"
  iframe.style.top = iframe.style.left = "0"
  iframe.style.position = "absolute"
  iframe.style.border = "none"
  iframe.src = url
  body.append(iframe)
  await when("load", iframe)

  URL.revokeObjectURL(url)
}

export const receive = (client /*:LunetClient*/, event /*:any*/) => {
  if (event.source instanceof ServiceWorker) {
    return request(client, event)
  } else {
    return respond(client, event)
  }
}

export const request = async (
  client /*:LunetClient*/,
  { data } /*:Data.Request*/
) => {
  // await client.connected

  console.log("Client is forwarding request", data)

  client.port.postMessage(data, transfer(data.request))
}

export const respond = async (
  client /*:LunetClient*/,
  { data } /*:Data.Response*/
) => {
  await client.controlled
  const { service } = client

  console.log("Client received response, forwarding to proxy", data)

  if (service) {
    // noflow: postMessage type bug https://github.com/facebook/flow/pull/7817
    service.postMessage(data, transfer(data.response))
  } else {
    setStatus(client, "🚫")
  }
}

export const getSetting = (
  client /*:LunetClient*/,
  name /*:string*/,
  fallback /*:string*/ = ""
) /*:string*/ => {
  const meta = client.ownerDocument.querySelector(`meta[name=${name}]`)
  const value = meta ? meta.getAttribute("content") : null
  if (value != null && value !== "") {
    return value
  } else {
    return fallback
  }
}

const setStatus = (client, status) => {
  client.status.textContent = status
}

const when = (type, target) =>
  new Promise(resolve => target.addEventListener(type, resolve, { once: true }))

const transfer = (data /*:{body:Data.Body}*/) /*:void|ArrayBuffer[]*/ =>
  data.body instanceof ArrayBuffer ? [data.body] : undefined

LunetClient.new(document)
