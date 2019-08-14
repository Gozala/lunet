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
      "DNS:localhost",
      "DNS:lunet.link",
      "DNS:lunet.dev",
      "DNS:*.lunet.link",
      "DNS:celestial.link",
      "DNS:*.celestial.link",
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
  const requestURL = new URL(request.url)
  const base = requestURL.host.endsWith("celestial.link")
    ? `./docs/celestial`
    : `./docs`

  const path = `${base}${requestURL.pathname}`
  const url = new URL(path.endsWith("/") ? `${path}index.html` : path, baseURL)

  console.log(requestURL)

  try {
    const file = await File.fromURL(url)
    const content = await file.readAsStream()
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
    const url = new URL(`${base}/404.html`, baseURL)
    const file = await File.fromURL(url)
    const content = await file.readAsStream()
    request.respond(
      new Response(content, {
        status: 404,
        headers: {
          "Content-Type": mime.lookup(url.pathname),
          "Access-Control-Allow-Origin": "*"
        }
      })
    )
  }
}

main(443)
