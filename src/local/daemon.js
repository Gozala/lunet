// @flow strict

import ENV from "../universal/env.js"
import { server, Response, Request, Headers } from "../universal/http.js"
import { File } from "../universal/file.js"
import * as WS from "../universal/ws.js"
import { baseURL } from "../../package.js"
import { fromEntries } from "../universal/Object.js"
import ssl from "../universal/ssl.js"

const ws = async connections => {
  for await (const socket of connections) {
    handlerSocket(socket)
  }
}

const handlerSocket = socket => {
  console.log("ws connection", socket)
  socket.onmessage = event => {
    console.log(`<<< WS ${String(event.data)}`)
    socket.send(`Echo ${String(event.data)}`)
  }
  socket.send(`Hello`)
}

const serve = async connections => {
  for await (const connection of connections) {
    void request(connection)
  }
}

const REST_SERVICE_URL = new URL("http://127.0.0.1:5001")
const GATEWAY_URL = new URL("http://127.0.0.1:8080")

const updateHost = (url, hostURL) =>
  new URL(`${url.pathname}${url.search}`, hostURL)

const matchEndpoint = url => {
  const [_, base] = url.pathname.split("/")
  switch (base) {
    case "ipfs":
    case "ipns":
      return updateHost(url, GATEWAY_URL)
    default:
      return updateHost(url, REST_SERVICE_URL)
  }
}

const request = async request => {
  const url = new URL(request.url)
  const origin = request.headers.get("origin") || ""
  const allowOrigin = origin.endsWith("lunet.link")
    ? origin
    : // : "https://lunet.link"
      "*"

  const endpoint = matchEndpoint(url)
  console.log("request.url", endpoint.href)

  try {
    const body =
      request.method === "HEAD"
        ? null
        : request.method === "GET"
        ? null
        : await request.arrayBuffer()

    const payload = new Request(endpoint.href, {
      redirect: "manual",
      method: request.method,
      headers: request.headers,
      body: body
    })

    const apiResponse = await fetch(payload)

    const headers = {
      ...fromEntries(apiResponse.headers.entries()),
      "access-control-allow-origin": allowOrigin,
      "access-control-allow-visible-redirect": allowOrigin
    }

    if (headers.location) {
      const location = updateHost(new URL(headers.location), url)
      headers.location = location.href
    }

    const response = new Response(apiResponse.body, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: new Headers(headers)
    })

    request.respond(response)
  } catch (error) {
    console.warn(error)
  }
}

export default async (port /*:number*/) => {
  console.log("Start local")
  const { key, certificate } = await ssl({
    key: new URL("./.env/local-key.pem", baseURL),
    certificate: new URL("./.env/local-certificate.pem", baseURL)
  })

  serve(server({ key, certificate }).listen(port))
  serve(server().listen(port + 1))
  const host = server({ key, certificate })
  host.server.listen(port + 2)
  ws(WS.listen({ server: host }))
}
