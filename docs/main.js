// @flow strict

import { LunetHost } from "./lunet.js"

class Lunet extends LunetHost {
  route(request) {
    const { hostname, pathname } = new URL(request.url)
    if (hostname.endsWith(SANDBOX_DOMAIN)) {
      const [cid] = hostname.split(".")
      const url = new URL(`/ipfs/${cid}${pathname}`, BASE_URL)
      request.url = url.href
    }

    return request
  }
}

const activate = async state => {
  const [, app, src, ...path] = state.url.pathname.split("/")
  switch (app) {
    case "":
    case "webui": {
      return await spawn({ ...state, app: "webui", src, path: path.join("/") })
    }
    default: {
      return await spawn({ ...state, app, src, path: path.join("/") })
    }
  }
}

const spawn = async state => {
  const { app, src, path, root } = state

  const { serviceWorker } = navigator
  if (serviceWorker) {
    serve({ ...state, serviceWorker })
    launch(state)
  } else {
    root.innerHTML = `<h1>Error: Service worker API is required but isn't available</h1>`
  }
}

const BASE_URL = new URL("/", self.location.href)
const SERVICE_URL = "/service.js"
const SERVICE_SCOPE = "/"

const serve = async state => {
  const { serviceWorker, root } = state
  if (!serviceWorker.controller) {
    root.innerHTML = "<h1>⚙️</h1>"
    const registration = await serviceWorker.register(SERVICE_URL, {
      scope: SERVICE_SCOPE,
      type: "classic"
    })
  }
}

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

const launch = async state => {
  const { document, root } = state
  const iframe = document.createElement("iframe")
  iframe.setAttribute("sandbox", SANDBOX_OPTIONS.join(" "))
  iframe.setAttribute("seamless", "true")
  iframe.name = "app"
  iframe.style.height = iframe.style.width = "100%"
  iframe.style.top = iframe.style.left = "0"
  iframe.style.position = "absolute"
  iframe.style.border = "none"
  iframe.setAttribute("data-source", state.src)

  const host = Lunet.new(document)

  const appCID = await resolveCID(host, state.app)
  iframe.src = `https://${appCID}.${SANDBOX_DOMAIN}`

  root.append(iframe)
}

const base32CidPattern = /^baf[abcdefghijklmnopqrstuvwxyz234567=]{56}$/
const base58btcPattern = /^Qm[A-Za-z0-9]{44}$/

const resolveCID = async (host, id) /*:Promise<string>*/ => {
  if (base58btcPattern.test(id)) {
    return await toBase36(host, id)
  } else if (base32CidPattern.test(id)) {
    return id
  } else {
    const path = await resolveDNSLink(host, id)
    const [, , cid] = path.split("/")
    if (base32CidPattern.test(cid)) {
      return cid
    } else {
      return await toBase36(host, cid)
    }
  }
}

const resolveDNSLink = async (host, domain) /*:Promise<string>*/ => {
  const response = await host.fetch(
    new URL(`/api/v0/dns?arg=${domain}`, BASE_URL)
  )

  const { Path } = await response.json()
  return Path
}

const toBase36 = async (host, cid) /*:Promise<string>*/ => {
  const response = await host.fetch(
    new URL(`/api/v0/cid/base32?arg=${cid}`, BASE_URL)
  )
  const { Formatted } = await response.json()
  return Formatted
}

const redirect = async (href, state) => {
  location.href = href
}

activate(
  (self.main = {
    url: new URL(location.href),
    root: document.body || document.appendChild(document.createElement("body")),
    document
  })
)
