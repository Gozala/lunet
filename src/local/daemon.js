// @flow strict

import ENV from "../universal/env.js"
import { server, Response, Headers } from "../universal/http.js"
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

const REST_URL = "http://127.0.0.1:5001"

const request = async request => {
  const origin = request.headers.get("origin") || ""
  const allowOrigin = origin.endsWith("lunet.link")
    ? origin
    : // : "https://lunet.link"
      "*"

  const endpoint = new URL(request.url, REST_URL)
  console.log("request.url", endpoint.href)
  try {
    const apiResponse = await fetch(endpoint.href)

    const headers = {
      ...fromEntries(apiResponse.headers.entries()),
      "Access-Control-Allow-Origin": allowOrigin
    }

    const response = new Response(apiResponse.body, {
      status: 200,
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
  const host = server({ key, certificate })
  host.server.listen(port + 1)
  ws(WS.listen({ server: host }))
}
