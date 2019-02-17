// @flow strict

/*::
import * as Data from "./lunet/data.js"
*/

const NAME = "proxy"
const VERSION = "0.0.7"
const ID = `${NAME}@${VERSION}`
const lunetURL = new URL("https://lunet.link/")
const daemonURL = new URL("http://127.0.0.1:5001/")
const gatewayURL = new URL("http://127.0.0.1:8080/")
const embedURL = new URL("/embed.js", lunetURL)

const install = (event /*:InstallEvent*/) => {
  console.log(`Proxy installed at ${self.registration.scope}`)
  // Cache all the assets that we may need so they can be served offline.
  event.waitUntil(setup())
}

// Companion service is used p2p sites / applications. Site uses embedded
// `iframe` with `companion/bridge.html` to connect this SW with an
// "access point" SW allowing site / app to load all of the data from the p2p
// network.
const activate = (event /*:ExtendableEvent*/) => {
  console.log(`Proxy activated at ${self.registration.scope}`)
  // At the moment we claim all the clients. In the future we should
  // consider how do we deal with SW updates when former one already has
  // clients.
  event.waitUntil(initialize())
}

const request = (event /*:FetchEvent*/) => {
  console.log(
    `Proxy ${self.registration.scope} got a fetch request ${event.request.url}`,
    event
  )
  const response = respond(event)
  event.respondWith(response)
}

const respond = (event /*:FetchEvent*/) => {
  const url = new URL(event.request.url)
  switch (url.hostname) {
    case lunetURL.hostname:
    case daemonURL.hostname:
    case daemonURL.hostname:
      return serviceFetch(event)
    default:
      return localFetch(event)
  }
}

const localFetch = (event /*:FetchEvent*/) => {
  console.log(
    `Proxy ${self.registration.scope} handling a local fetch request ${
      event.request.url
    }`
  )
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
  console.log(
    `Proxy ${self.registration.scope} handling a service fetch request ${
      event.request.url
    }`
  )
  const cache = await caches.open(ID)
  const response = await cache.match(event.request)
  if (response) {
    return response
  } else {
    return proxyFetch(event)
  }
}

const navigate = async (event /*:FetchEvent*/) => {
  return new Response(
    `<html>
  <head>
    <meta charset="utf-8" />
    <script type="module" src="${embedURL.href}"></script>
  </head>
  <body>
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
  const id = `${Math.random()
    .toString(36)
    .slice(2)}`
  const payload = await encodeRequest(request)

  console.log(
    `Proxy is forwarding fetch request ${id} ${payload.url} through ${
      client.id
    }`,
    payload,
    client
  )

  const message /*:Data.RequestMessage*/ = {
    type: "request",
    id,
    request: payload
  }
  client.postMessage(message, transfer(payload))
  const response = await receiveResponse(id)
  console.log(`Proxy is received fetch response ${id} ${payload.url}`, response)
  return decodeResponse(response)
}

const writeResponse = async ({ body } /*:any*/, port) => {
  try {
    const reader = body.getReader()
    while (true) {
      const { value, done } = await reader.read()
      const transfer = value ? [value] : []
      port.postMessage({ type: "body", body: value, done }, transfer)
      if (done) {
        return null
      }
    }
  } catch (error) {
    port.postMessage({ error: { message: error.message } })
  }
}

const pendingRequests /*:{[string]:(Data.EncodedResponse) => void}*/ = {}

const receiveResponse = (id /*:string*/) /*:Promise<Data.EncodedResponse>*/ =>
  new Promise((resolve /*:Data.EncodedResponse => void*/) => {
    pendingRequests[id] = resolve
  })

class BodyReader {
  /*::
  port:MessagePort
  controller:ReadableStreamController
  */
  constructor(port) {
    this.port = port
  }
  start(controller) {
    this.controller = controller
  }
  pull(controller) {}
  cancel(reason) {}
  handleEvent(event) {
    const data /*:Data.ResponseData*/ = event.data
    switch (data.type) {
      case "body": {
        const { body, done } = data
        if (body) {
          this.controller.enqueue(body)
        }
        if (done) {
          this.controller.close()
        }
        break
      }
      case "cancel": {
        const { cancel } = data
        if (cancel) {
          this.controller.error(cancel)
        } else {
          this.controller.close()
        }
        break
      }
    }
  }
}

const readResponse = async (port /*:MessagePort*/) =>
  new Promise(resolve => {
    let queue = null
    const body = new ReadableStream({
      start(controller) {
        port.onmessage = (message /*:any*/) => {
          const data /*:Data.ResponseData*/ = message.data
          switch (data.type) {
            case "head": {
              const { status, statusText, headers } = data.head
              resolve(
                new Response(body, {
                  status,
                  statusText,
                  headers: decodeHeaders(headers)
                })
              )
              break
            }
            case "body": {
              const { body, done } = data
              if (body) {
                controller.enqueue(body)
              }
              if (done) {
                controller.close()
              }
              break
            }
            case "cancel": {
              const { cancel } = data
              if (cancel) {
                controller.error(cancel)
              } else {
                controller.close()
              }
              break
            }
          }
        }
      },
      cancel(reason) {
        port.postMessage({ type: "cancel", cancel: reason })
      }
    })
  })

const receive = ({ data, ports, source } /*:Data.Response*/) => {
  console.log(`Proxy received fetch response`, data)
  switch (data.type) {
    case "response": {
      const { id, response } = data
      const pendingRequest = pendingRequests[id]
      delete pendingRequests[id]
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

const encodeRequest = async (
  request /*:Request*/
) /*:Promise<Data.EncodedRequest>*/ => {
  const $request /*:Object*/ = request
  const mode = String(request.mode) === "navigate" ? null : request.mode
  const cache = request.cache === "only-if-cached" ? "default" : request.cache
  const body = await encodeBody(request)

  return {
    url: request.url,
    body,
    headers: encodeHeaders(request.headers),
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

const decodeResponse = (response /*:Data.EncodedResponse*/) /*:Response*/ => {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: decodeHeaders(response.headers)
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

const encodeHeaders = (headers /*:Headers*/) => [...headers.entries()]
const decodeHeaders = (headers /*:Array<[string, string]>*/) /*:Headers*/ => {
  const init /*:any*/ = headers
  return new Headers(init)
}

const noClientFound = (request /*:Request*/) =>
  new Response("Unable to find a window that can relay the message", {
    status: 503
  })

const findClient = async (id /*:string*/) /*:Promise<?WindowClient>*/ => {
  const client = id != "" ? await self.clients.get(id) : null
  // If request is coming from the specific client than select that client
  if (client) {
    return client
  }
  // Otherwise get all window clients (as only they will have <lunet-link>
  // nodes that can be used for relaying requests and select the best candidate.

  const matchedClients = await self.clients.matchAll({ type: "window" })
  return selectClient(matchedClients)
}

// Select the client that is likely to be our best bet for relaying a message.
// We choose a best match by following priority:
// - focuse
// - visible
// Working assumbtion is that that order reflects the likelyhood of client not
// being throttled and there for can do the job best.
// TODO: Validate our assumbtion, maybe reverse order makes more sense as it
// would avoid adding more work to possibly already busy client.
const selectClient = (clients /*:WindowClient[]*/) => {
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
    }
  }

  return visible
}

const setup = async () => {
  const skip = self.skipWaiting()

  console.log(`Proxy is setting up ${self.registration.scope}`)
  const cache = await caches.open(ID)
  const urls = [new URL("/embed.js", lunetURL).href]
  console.log(`Proxy is caching`, urls)
  await cache.addAll(urls)
  console.log(`Proxy cached`)

  await skip
  console.log("Installation is complete!")
}

const initialize = async () => {
  console.log(`Proxy is initializing ${self.registration.scope}`)
  const clients = await self.clients.matchAll({ includeUncontrolled: true })
  console.log(`Proxy is claiming all clients ${clients.map($ => $.url)}`)

  await self.clients.claim()

  const keys = await caches.keys()
  for (const id of keys) {
    if (id !== ID && id.startsWith(NAME)) {
      console.log(`Proxy is clearing obsolete cache: ${id}`)
      await caches.delete(id)
    }
  }

  console.log("Proxy activation is complete")
}

const transfer = data => (data.body instanceof ArrayBuffer ? [data.body] : [])

self.addEventListener("install", install)
self.addEventListener("activate", activate)
self.addEventListener("fetch", request)
self.addEventListener("message", receive)
