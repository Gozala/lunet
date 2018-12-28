// @flow strict

import ENV from "../universal/env.js"
import { listen, Response } from "../universal/http.js"
import { File } from "../universal/file.js"
import mime from "../universal/mime.js"
import { baseURL } from "../../package.js"
import ssl from "../universal/ssl.js"

const main = async port => {
  console.log("Starting main")

  const { key, certificate } = await ssl({
    key: new URL("./.env/remote-key.pem", baseURL),
    certificate: new URL("./.env/remote-certificate.pem", baseURL),
    name: "lunet.link",
    names: [
      "DNS:lunet.link",
      "DNS:*.lunet.link",
      "IP:127.0.0.1",
      "IP:0.0.0.0",
      "IP:::1",
      "IP:::"
    ]
  })

  for await (const connection of listen(port, { key, certificate })) {
    void request(connection)
  }
}

const request = async request => {
  console.log(request.url, request.method, request.headers)
  const path = `./src/remote/static${request.url}`
  const url = new URL(path.endsWith("/") ? `${path}index.html` : path, baseURL)
  try {
    const file = await File.fromURL(url)
    const content = await file.readAsText()
    request.respond(
      new Response(content, {
        status: 200,
        headers: {
          "Content-Type": mime.lookup(url.pathname),
          "Access-Control-Allow-Origin": "*"
        }
      })
    )
  } catch (error) {
    request.respond(
      new Response(
        `<html><head><meta charset="UTF-8" /></script></head><body><h1>Not Found</h1><pre>${error}</pre></body></html>`,
        {
          status: 404,
          headers: {
            "Content-Type": "text/html"
          }
        }
      )
    )
  }
}

main(443)
