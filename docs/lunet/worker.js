// @flow strict

/*::
import * as Data from "./data.js"
*/

const NAME = "worker"
const VERSION = "0.0.4"
const ID = `${NAME}@${VERSION}`
const daemonURL = new URL("http://127.0.0.1:5001")
const gatewayURL = new URL("http://127.0.0.1:8080")

const request = async (
  message /*:Data.RequestMessage*/,
  target
) /*:Promise<Data.ResponseMessage>*/ => {
  const request = routeRequest(message)
  const response = await respond(request, message.id, target)

  return {
    type: "response",
    id: message.id,
    response
  }
}

const respond = async (request, id, target) => {
  try {
    const response = await selectFetch(request, id, target)

    if (response.url !== request.url) {
      const headers = decodeHeaders(response.headers)
      const location = new URL(response.url)
      headers.set("location", location.href)
      response.headers = encodeHeaders(headers)
      response.status = 302
      return response
    } else {
      return response
    }
  } catch (error) {
    return await encodeResponse(
      new Response(error.toString(), {
        status: 500
      })
    )
  }
}

const selectFetch = async (request, id, target) => {
  try {
    return await localFetch(request)
  } catch (error) {
    return await proxyFetch(request, id, target)
  }
}

const localFetch = async request => {
  const response = await fetch(request.url, {
    method: request.method,
    headers: decodeHeaders(request.headers),
    body: request.body
  })

  return encodeResponse(response)
}

const proxyFetch = async (request, id, target) => {
  target.postMessage({ type: "request", id, request })
  return await receiveResponse(id)
}

const pendingRequests /*:{[string]:(Data.EncodedResponse) => void}*/ = {}

const receiveResponse = (id /*:string*/) /*:Promise<Data.EncodedResponse>*/ =>
  new Promise((resolve /*:Data.EncodedResponse => void*/) => {
    pendingRequests[id] = resolve
  })

const response = message => {
  const { id, response } = message
  const pendingRequest = pendingRequests[id]
  delete pendingRequests[id]
  if (pendingRequest) {
    return pendingRequest(response)
  } else {
    return console.warn(`Unable to find request for id ${id}`, response)
  }
}

const routeRequest = (event /*:Data.RequestMessage*/) => {
  const { request, id } = event
  const url = new URL(request.url)
  switch (url.origin) {
    case self.origin: {
      return routeLocal(request)
    }
    default:
      return routeForeign(request)
  }
}

const routeLocal = request => {
  return routeService(request)
}

const routeForeign = (request, target) => {
  const url = new URL(request.url)
  // At the moment firefox blocks requests to all http from the SW but it does
  // not from the document context. To workaroud that we funnel local requests
  // through our serice.
  switch (url.hostname) {
    case "127.0.0.1":
      return routeService(request)
    default:
      return request
  }
}

// This just routes requests to local systray app. In practice we would want to
// try bunch of different ways to get the content instead.
const routeService = request => {
  const localURL = new URL(request.url)
  const foreignURL = updateHost(localURL)
  console.log(`Daemon request ${foreignURL.href}`)

  const requestHeaders = decodeHeaders(request.headers)
  requestHeaders.delete("upgrade-insecure-requests")
  requestHeaders.delete("origin")
  requestHeaders.delete("dnt")
  requestHeaders.delete("accept")
  requestHeaders.delete("user-agent")
  requestHeaders.delete("x-requested-with")
  requestHeaders.delete("cache-control")
  requestHeaders.delete("pragma")

  request.url = foreignURL.href
  request.headers = encodeHeaders(requestHeaders)
  return request
}

const updateHost = url => {
  const [, base] = url.pathname.split("/")
  switch (base) {
    case "ipfs":
    case "ipns":
      return new URL(`${url.pathname}${url.search}`, gatewayURL)
    case "api":
    case "webui":
      return new URL(`${url.pathname}${url.search}`, daemonURL)
    default:
      return url
  }
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

const receive = async (event /*:Data.WorkerInbox*/) => {
  const { data: message, target } = event
  const response = await match(message, target)
  if (response) {
    target.postMessage(response)
  }
}

const match = (
  message /*:Data.WorkerIncomingMessage*/,
  target
) /*:?Promise<Data.WorkerOutgoingMessage>*/ => {
  switch (message.type) {
    case "ping": {
      return ping(message)
    }
    case "request": {
      return request(message, target)
    }
    case "response": {
      return response(message)
    }
    default: {
      console.warn(`Unexpected message received ${message.type}`, message)
    }
  }
}

const ping = async message => {
  return { type: "pong", time: Date.now() }
}

const connect = event => {
  const [port] = event.ports
  port.addEventListener("message", receive)
  port.start()
}

self.addEventListener("connect", connect)
