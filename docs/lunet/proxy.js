// @flow strict

/*::
import * as Data from "./data.js"
*/

const serviceURL = new URL("https://lunet.link/")
const clientURL = new URL("/lunet/client.js", serviceURL)
const mountURL = new URL(
  new URL(location.href).searchParams.get("mount") || "",
  serviceURL
)

const install = (event /*:InstallEvent*/) => {
  console.log(`Proxy installed at ${self.registration.scope}`)
  // We cache all the companion assets because occasionally we will need to
  // reconnect to the "access point" SW and if we won't be able to do so
  // while offline (as access point doesn't serve across origins).
  event.waitUntil(initCache())
}

// Companion service is used p2p sites / applications. Site uses embedded
// `iframe` with `companion/bridge.html` to connect this SW with an
// "access point" SW allowing site / app to load all of the data from the p2p
// network.
const activate = (event /*:ExtendableEvent*/) => {
  console.log(`Proxy activated at ${self.registration.scope}`)

  event.waitUntil(self.clients.claim())
}

const request = (event /*:FetchEvent*/) => {
  console.log(`Proxy request at ${self.registration.scope}`, event)
  const response = respond(event)
  event.respondWith(response)
}

const respond = (event /*:FetchEvent*/) => {
  const url = new URL(event.request.url)
  switch (url.origin) {
    case self.origin:
      return localFetch(event)
    case serviceURL.origin:
      return serviceFetch(event)
    default:
      return foreignFetch(event)
  }
}

const localFetch = (event /*:FetchEvent*/) => {
  switch (event.request.mode) {
    case "navigate": {
      return navigate(event)
    }
    default: {
      return proxyFetch(event)
    }
  }
}

const serviceFetch = async event => {
  const cache = await caches.open("lunet")
  const response = await cache.match(event.request)
  if (response) {
    return response
  } else {
    switch (event.request.mode) {
      case "navigate": {
        return navigate(event)
      }
      default: {
        return proxyFetch(event)
      }
    }
  }
}

const navigate = async (event /*:FetchEvent*/) => {
  const client = await findClient(event.clientId)
  if (client) {
    return fetchThrough(event.request, client)
  } else {
    return reconnectRoute(event.request)
  }
}

const proxyFetch = async (event /*:FetchEvent*/) => {
  const client = await findClient(event.clientId)

  if (client) {
    return fetchThrough(event.request, client)
  }
  // This should not happen since unless it is a navigation request
  // it should originate from a specific window. However there is a chance
  // say that client spawn another service worker that off the chance outlived
  // document and is initating this request.
  else {
    return noClientFound(event.request)
  }
}

const fetchThrough = async (request /*:Request*/, client /*:WindowClient*/) => {
  const id = ++requestID
  const payload = await encodeRequest(request)
  const transfer = payload.body ? [payload.body] : []
  const message /*:Data.RequestMessage*/ = {
    type: "request",
    id,
    request: payload,
    transfer
  }
  client.postMessage(message)
  const response = await receiveResponse(id)
  return decodeResponse(response)
}

// Maybe  { mode: "no-cors" } ?
const foreignFetch = event => fetch(event.request)

const receive = ({ data, ports, source } /*:Data.Response*/) => {
  switch (data.type) {
    case "response": {
      const { id, response } = data
      const pendingRequest = pendingRequests[id]
      if (pendingRequest) {
        return pendingRequest(response)
      } else {
        return console.warn(`Unable to find request for id ${id}`, response)
      }
    }
    default: {
      return console.warn(`Unexpect message received`, data)
    }
  }
}

let requestID = 0
const pendingRequests /*:{[number]:(Data.ResponseData) => void}*/ = {}

const receiveResponse = (id /*:number*/) /*:Promise<Data.ResponseData>*/ =>
  new Promise((resolve /*:Data.ResponseData => void*/) => {
    pendingRequests[id] = resolve
  })

const encodeRequest = async (
  request /*:Request*/
) /*:Promise<Data.RequestData>*/ => {
  const body = await encodeBody(request)
  const url = request.url.startsWith(self.registration.scope)
    ? `${mountURL.href}${request.url.substr(self.registration.scope)}`
    : request.url
  const $request /*:Object*/ = request
  const headers /*:any*/ = [...request.headers.entries()]
  const mode = String(request.mode) === "navigate" ? null : request.mode
  const cache = request.cache === "only-if-cached" ? "default" : request.cache

  return {
    url,
    body,
    headers,
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

const decodeResponse = (response /*:Data.ResponseData*/) /*:Response*/ => {
  const headers = new Headers(response.headers)
  const body =
    headers.get("content-type") === "text/html"
      ? new Blob([clientMarkup(), response.body], { type: "text/html" })
      : response.body

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
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

const noClientFound = (request /*:Request*/) =>
  new Response("Unable to find a window that can relay the message", {
    status: 503
  })

const clientMarkup = () =>
  `<script type="module" src="${clientURL.href}" />
<lunet-client passive></lunet-client>


`

const reconnectRoute = (request /*:Request*/) =>
  new Response(
    `<html>
  <head>
    <meta charset="utf-8" />
    <meta name="mount" content="${serviceURL.pathname}" />
    <title>Reconnecting</title>
    <script type="module" src="${clientURL.href}"></script>
  </head>
  <body>
    <lunet-client></lunet-client>
  </body>
</html>
`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html"
      }
    }
  )

const findClient = async (id /*:string*/) /*:Promise<?WindowClient>*/ => {
  const client = id != "" ? await self.clients.get(id) : null
  // If request is coming from the specific client than select that client
  if (client) {
    return client
  }
  // Otherwise get all window clients (as only they will have <lunet-link>
  // nodes that can be used for relaying requests and select the best candidate.
  else {
    const matchedClients = await self.clients.matchAll({ type: "window" })
    return selectClient(matchedClients)
  }
}

// Select the client that is likely to be our best bet for relaying a message.
// We choose a best match by following priority:
// - focuse
// - visible
// - hidden
// Working assumbtion is that that order reflects the likelyhood of client not
// being throttled and there for can do the job best.
// TODO: Validate our assumbtion, maybe reverse order makes more sense as it
// would avoid adding more work to possibly already busy client.
const selectClient = (clients /*:WindowClient[]*/) => {
  let hidden = null
  let visible = null
  for (const client of clients) {
    if (client.focused) {
      return client
    }

    switch (client.visibilityState) {
      case "visible": {
        visible = client
        break
      }
      case "hidden": {
        hidden = client
        break
      }
    }
  }

  return visible || hidden || null
}

const initCache = async () => {
  console.log(`Init lunet cache ${self.registration.source}`)
  const cache = await caches.open("lunet")
  const urls = [
    clientURL,
    new URL("/", serviceURL),
    new URL("/lunet/host.js", serviceURL),
    new URL("/lunet/proxy.js", serviceURL)
  ]
  console.log(`Companion "${self.registration.source}" is caching`, urls)
  return cache.addAll(urls)
}

self.addEventListener("install", install)
self.addEventListener("activate", activate)
self.addEventListener("fetch", request)
self.addEventListener("message", receive)
