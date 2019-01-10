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

  const host = createHost(hostURL, client.ownerDocument)
  client.host = host
  client.root.append(host, status)

  client.connected = when("load", host)
  host.addEventListener("message", client)
  serviceWorker.addEventListener("message", client)

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

  if (client.hasAttribute("reconnect")) {
    client.ownerDocument.location.reload()
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
  event /*:Data.Request*/
) => {
  await client.connected

  client.host.contentWindow.postMessage(
    event.data,
    client.host.src,
    event.data.transfer
  )
}

export const respond = async (
  client /*:LunetClient*/,
  event /*:Data.Response*/
) => {
  await client.controlled
  const { service } = client
  if (service) {
    service.postMessage(event.data, event.data.transfer)
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

customElements.define("lunet-client", LunetClient)
