// @flow strict

/*::
import * as Data from "./data.js"
*/

export class LunetClient extends HTMLElement {
  /*::
  root:ShadowRoot
  host:HTMLIFrameElement
  status:HTMLElement
  isConnected:boolean
  handleEvent:Event => mixed
  connected:Promise<mixed>
  controlled:Promise<mixed>
  port:MessagePort
  */
  constructor() {
    super()
    const root = this.attachShadow({ mode: "closed" })
    const status = this.ownerDocument.createElement("span")
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
    }
  }
  get hostURL() {
    return getSetting(this, "host", "https://lunet.link/")
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
  get service() {
    const serviceWorker = navigator.serviceWorker
    return serviceWorker ? serviceWorker.controller : null
  }
}

export const connect = async (
  client /*:LunetClient*/,
  serviceWorker /*:ServiceWorkerContainer*/
) => {
  const { mount, serviceURL, hostURL, scope } = client
  const src = `${serviceURL}?mount=${mount}`
  const { port1, port2 } = new MessageChannel()
  port1.addEventListener("message", client)
  serviceWorker.addEventListener("message", client)

  const host = createHost(hostURL, client.ownerDocument)
  client.host = host
  client.root.append(host, status)
  client.port = port1

  client.connected = when("load", host)
  host.contentWindow.postMessage("connect", host.src, [port2])

  if (serviceWorker.controller) {
    client.controlled = Promise.resolve()
  } else {
    client.controlled = when("controllerchange", serviceWorker)
    setStatus(client, "⚙️")
    await serviceWorker.register(src, { scope, type: "classic" })
    setStatus(client, "🎛")
  }

  await client.controlled
  setStatus(client, "🛰")

  if (!client.hasAttribute("passive")) {
    activate(client)
  }
}

const activate = async (client /*:LunetClient*/, event /*:any*/) => {
  const document = client.ownerDocument
  const response = await fetch(document.location.href)
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
  await client.connected

  client.port.postMessage(data, transfer(data.request))
}

export const respond = async (
  client /*:LunetClient*/,
  { data } /*:Data.Response*/
) => {
  await client.controlled
  const { service } = client
  if (service) {
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

const createHost = (url, document) /*:HTMLIFrameElement*/ => {
  const frame = document.createElement("iframe")
  frame.src = url
  frame.style.display = "none"
  return frame
}

const setStatus = (client, status) => {
  client.status.textContent = status
}

const when = (type, target) =>
  new Promise(resolve => target.addEventListener(type, resolve, { once: true }))

const transfer = data => (data.body ? [data.body] : [])

customElements.define("lunet-client", LunetClient)
