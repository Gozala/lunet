// @flow strict

import ENV from "../universal/env.js"
import { server, Response } from "../universal/http.js"
import { File } from "../universal/file.js"
import * as WS from "../universal/ws.js"
import { baseURL } from "../../package.js"
import ssl from "../universal/ssl.js"

const ws = async connections => {
  for await (const socket of connections) {
    handlerSocket(socket)
  }
}

const handlerSocket = socket => {
  console.log("ws connection", socket)
  socket.addEventListener("message", event => {
    console.log(`<<< WS ${event.data}`)
    socket.send(`Echo ${event.data}`)
  })
  socket.send(`Hello`)
}

const serve = async connections => {
  for await (const connection of connections) {
    void request(connection)
  }
}

const request = async request => {
  console.log("<<<", request)
  const origin = request.headers.get("origin") || ""
  const allowOrigin = origin.endsWith("lunet.link")
    ? origin
    : // : "https://lunet.link"
      "*"

  const response = new Response(
    `<html><head><meta charset="UTF-8" /></head><body>Response from ${
      request.url
    }</body></html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": allowOrigin
      }
    }
  )

  request.respond(response)
}

const main = async port => {
  console.log("Start local")
  const { key, certificate } = await ssl({
    key: new URL("./.env/local-key.pem", baseURL),
    certificate: new URL("./.env/local-certificate.pem", baseURL)
  })

  serve(server({ key, certificate }).listen(port))
  const host = server({ key, certificate })
  host.server.listen(9001)
  ws(WS.listen({ server: host }))
}

main(9000)
