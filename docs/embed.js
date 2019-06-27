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
  connection:MessagePort
  channel:MessageChannel
  */
  constructor(ownerDocument /*:Document*/) {
    this.ownerDocument = ownerDocument
    const status = this.ownerDocument.createElement("span")

    this.status = status
    this.params = new URLSearchParams(ownerDocument.location.search)
    const { port1, port2 } = new MessageChannel()
    this.connection = port1
    this.port = port2

    this.isConnected = true
    this.connectedCallback()
  }
  connectedCallback() {
    if (this.isConnected) {
      this.activate()
    }
  }

  getParam(url /*:URL*/, name /*:string*/, fallback /*:string*/) {
    const value = url.searchParams.get(name)
    return value == null ? fallback : value
  }
  async activate() {
    this.listen()
    await this.activateServiceWorker()
    this.connect(self.top)

    const url = new URL(document.location.href)

    const pathname = this.getParam(url, "pathname", url.pathname)
    const search = this.getParam(url, "search", url.search)
    const hash = this.getParam(url, "hash", url.hash)
    const location = `${pathname}${search}${hash}` || "/"
    this.load({ location })
  }

  async activateServiceWorker() {
    const { mount, serviceURL, scope, serviceWorkerVersion } = this
    const swv = serviceWorkerVersion ? `&swv=${serviceWorkerVersion}` : ""
    const src = `${serviceURL}?${swv}`
    const { serviceWorker } = navigator
    if (serviceWorker) {
      serviceWorker.addEventListener("message", this)
      if (!serviceWorker.controller) {
        this.setStatus("⚙️")
        const registration = await serviceWorker.register(src, {
          scope,
          type: "classic"
        })
      }
      const controlled = serviceWorker.controller
        ? Promise.resolve()
        : when("controllerchange", serviceWorker)

      this.controlled = controlled

      this.setStatus("🎛")
    } else {
      this.controlled = Promise.reject(
        new Error("Service Worker API not available")
      )
      this.setStatus("🚫")
    }
  }
  async connect(target /*:any*/) {
    target.postMessage({ type: "connect", port: this.connection }, "*", [
      this.connection
    ])
    this.port.start()
  }
  setStatus(status /*:string*/) {
    this.status.textContent = status
  }

  listen() {
    this.port.addEventListener("message", this)
    window.addEventListener("hashchange", this)
    window.addEventListener("popstate", this)
    window.addEventListener("click", this)
    window.addEventListener("beforeunload", this)
    const self = this
    const { pushState, replaceState } = History.prototype
    const History$prototype /*:Object*/ = History.prototype
    Object.defineProperties(History$prototype, {
      pushState: {
        value(state, title, url) {
          pushState.call(this, state, title, url)
          self.pushState(state, title, url)
        }
      },
      replaceState: {
        value(state, title, url) {
          replaceState.call(this, state, title, url)
          self.replaceState(state, title, url)
        }
      }
    })
  }

  async load({ location } /*:{location:string}*/) {
    history.replaceState(null, "", location)
    await this.controlled
    const response = await fetch("/")
    if (response.status === 404) {
      await this.loadIndex()
    } else {
      const contentType = response.headers.get("content-type") || ""
      const mime = contentType.split(";").shift()
      if (mime === "text/html") {
        await this.loadDocument(response)
      } else {
        await this.loadBlob(response)
      }
    }
    this.ready()
  }
  async loadDocument(response /*:Response*/) {
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

  async loadIndex() {
    const $document /*:any*/ = document
    const {
      head,
      body
    } /*:{head:HTMLHeadElement, body:HTMLBodyElement}*/ = $document
    body.innerHTML = `<h1>Not Found</h1><ul>`

    const response = await fetch(location.href, { method: "LIST" })
    if (!response.ok) {
      body.innerHTML += `<li><a class="directory parent" href="../">../</a></li>`
    } else {
      const entries = await response.json()
      for (const { name, type, size } of entries) {
        const path = type === "file" ? name : `${name}/`
        body.innerHTML += `<li><a class="${type}" href="./${path}">./${path}</a><code>${size}</code></li>`
      }
    }

    body.innerHTML + "</ul>"
  }

  async loadBlob(response /*:Response*/) {
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

  disconnectedCallback() {}
  handleEvent(event /*:Event*/) {
    switch (event.type) {
      case "message": {
        return this.onmessage(event)
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
  onServiceMessage({ data } /*:Data.Request*/) {
    // await client.connected

    console.log("Client is forwarding request", data)

    this.port.postMessage(data, transfer(data.request))
  }
  async onAgentMessage({ data } /*:Data.ClientInbox*/) {
    switch (data.type) {
      case "response": {
        return void this.onresponse(data)
      }
      case "load": {
        return this.load(data)
      }
    }
  }
  async onresponse(message /*:Data.ResponseMessage*/) {
    await this.controlled
    const { service } = this

    console.log("Client received response, forwarding to proxy", message)

    if (service) {
      service.postMessage(message, transfer(message.response))
    } else {
      this.setStatus("🚫")
    }
  }
  onmessage(event /*:any*/) {
    if (event.source instanceof ServiceWorker) {
      return this.onServiceMessage(event)
    } else {
      return this.onAgentMessage(event)
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
    // This causes prompts in firefox which we really don't want.
    // event.preventDefault()
    return top.postMessage(
      {
        type: "beforeunload",
        beforeunload: { href: location.href }
      },
      "*"
    )
  }
  get serviceURL() {
    return this.getSetting("service", "./lunet.js")
  }
  get scope() {
    return this.getSetting("scope", "./")
  }
  get mount() {
    return this.getSetting("mount", "")
  }
  getSetting(name /*:string*/, fallback /*:string*/ = "") /*:string*/ {
    const meta = this.ownerDocument.querySelector(`meta[name=${name}]`)
    const value = meta ? meta.getAttribute("content") : null
    if (value != null && value !== "") {
      return value
    } else {
      return fallback
    }
  }
  get serviceWorkerVersion() {
    return this.params.get("sw-version")
  }
  get service() {
    const serviceWorker = navigator.serviceWorker
    return serviceWorker ? serviceWorker.controller : null
  }
}

const when = (type, target) =>
  new Promise(resolve => target.addEventListener(type, resolve, { once: true }))

const transfer = (data /*:{body:Data.Body}*/) /*:void|ArrayBuffer[]*/ =>
  data.body instanceof ArrayBuffer ? [data.body] : undefined

new LunetClient(document)
