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
  const { driver, source, pathname, search, hash } = parseURL(state.url)
  await spawn({ ...state, driver, source, pathname, search, hash })
}

const spawn = async state => {
  const { driver, source, pathname, search, hash, root } = state

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
    root.innerHTML = ""
  }
}

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

const launch = async state => {
  const { document, root } = state
  const iframe = document.createElement("iframe")
  iframe.setAttribute("sandbox", SANDBOX_OPTIONS.join(" "))
  iframe.setAttribute("seamless", "true")
  // TODO: Figure out a way to set CSP headers in AWS
  // iframe.setAttribute("csp", SANDBOX_CSP)
  iframe.name = "driver"
  iframe.style.height = iframe.style.width = "100%"
  iframe.style.top = iframe.style.left = "0"
  iframe.style.position = "absolute"
  iframe.style.border = "none"
  iframe.setAttribute("data-driver", `${state.driver.name}`)
  iframe.setAttribute("data-source", state.source ? state.source.name : "")
  const host = Lunet.new(iframe)

  const origin = await resolveOrigin(host, state.driver)
  iframe.setAttribute("data-origin", origin)
  const params = new URLSearchParams()
  params.set("pathname", state.pathname)
  params.set("search", state.search)
  params.set("hash", state.hash)
  iframe.src = `${origin}?${params.toString()}`

  root.append(iframe)
}

const base32CidPattern = /^baf[abcdefghijklmnopqrstuvwxyz234567=]{56}$/
const base58btcPattern = /^Qm[A-Za-z0-9]{44}$/

const resolveOrigin = async (host, { protocol, key }) /*:Promise<string>*/ => {
  switch (protocol) {
    case "ipfs": {
      if (base32CidPattern.test(key)) {
        return `https://${key}.${SANDBOX_DOMAIN}`
      } else {
        const cid = await toBase32(host, key)
        return `https://${cid}.${SANDBOX_DOMAIN}`
      }
    }
    case "ipns": {
      const path = await resolveName(host, key)
      const [, protocol, cid] = path.split("/")
      return await resolveOrigin(host, { protocol, key: cid })
    }
    case "dns": {
      const path = await resolveDNSLink(host, key)
      const [, protocol, cid] = path.split("/")
      return await resolveOrigin(host, { protocol, key: cid })
    }
    case "driver": {
      if (key === "webui" || key === "") {
        return await resolveOrigin(host, {
          protocol: "dns",
          key: "webui.lunet.link"
        })
      } else {
        return `data:text/html,<h1>The <code>${key}</code> not found</h1>`
      }
    }
    default: {
      return `data:text/html,<h1>Support for <code>${protocol}</code> is not implemented</h1>`
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

const resolveName = async (host, cid) /*:Promise<string>*/ => {
  const response = await host.fetch(
    new URL(`/api/v0/name/resolve?arg=${cid}`, BASE_URL)
  )

  const { Path } = await response.json()
  return Path
}

const toBase32 = async (host, cid) /*:Promise<string>*/ => {
  const response = await host.fetch(
    new URL(`/api/v0/cid/base32?arg=${cid}`, BASE_URL)
  )
  const { Formatted } = await response.json()
  return Formatted
}

const redirect = async (href, state) => {
  location.href = href
}

const parseURL = ({ pathname, search, hash }) => {
  const [, ...segments] = pathname.split("/")
  const [driver, fragments] = parseDriver(segments)
  const [source, path] = parseURLFragment(fragments)
  return { driver, source, search, hash, pathname: `/${path.join("/")}` }
}

/*::
type URLFragment =
  | { protocol: "ipfs", key: string, name:string }
  | { protocol: "ipns", key: string, name:string }
  | { protocol: "dat", key: string, name:string }
  | { protocol: "ssb", key: string, name:string }
  | { protocol: "hypermerge", key: string, name:string }
  | { protocol: "dns", key:string, name:string }
  | { protocol: "driver", key:string, name:string }
*/

const parseDriver = (parts) /*:[URLFragment, string[]]*/ => {
  const [driver, rest] = parseURLFragment(parts)
  if (driver) {
    return [driver, rest]
  } else {
    const [key, ...rest] = parts
    const name = `/${key}`
    if (key.includes(".")) {
      return [{ protocol: "dns", key, name }, rest]
    } else {
      return [{ protocol: "driver", key, name }, rest]
    }
  }
}
const parseURLFragment = (parts) /*:[?URLFragment, string[]]*/ => {
  const [protocol, ...rest] = parts
  const name = `/${protocol}/${rest[0]}`
  switch (protocol) {
    case "ipfs": {
      const [key, ...fragments] = rest
      return [{ protocol: "ipfs", key, name }, fragments]
    }
    case "ipns": {
      const [key, ...fragments] = rest
      return [{ protocol: "ipns", key, name }, fragments]
    }
    case "dns": {
      const [key, ...fragments] = rest
      return [{ protocol: "dns", key, name }, fragments]
    }
    case "driver": {
      const [key, ...fragments] = rest
      return [{ protocol: "driver", key, name }, fragments]
    }
    case "dat": {
      const [key, ...fragments] = rest
      return [{ protocol: "dat", key, name }, fragments]
    }
    case "ssb": {
      const [key, ...fragments] = rest
      return [{ protocol: "ssb", key, name }, fragments]
    }
    case "hypermerge": {
      const [key, ...fragments] = rest
      return [{ protocol: "hypermerge", key, name }, fragments]
    }
    default: {
      return [null, parts]
    }
  }
}

activate(
  (self.main = {
    url: new URL(location.href),
    root: document.body || document.appendChild(document.createElement("body")),
    document
  })
)
