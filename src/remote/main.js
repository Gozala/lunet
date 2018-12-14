import ENV from "../local/env.js"
import { server, Response } from "../local/https.js"
import { File } from "../local/file.js"
import mime from "../local/mime.js"

const baseURL = import.meta.url

const main = async port => {
  console.log("Starting main")
  const keyURL = new URL("../../.env/localhost.key", baseURL)
  const certificateURL = new URL("../../.env/localhost.certificate", baseURL)
  const keyFile = await File.fromURL(keyURL)
  const certificateFile = await File.fromURL(certificateURL)
  const key = await keyFile.readAsText()
  const certificate = await certificateFile.readAsText()
  const host = server(port, { key, certificate })
  for await (const connection of host.listen()) {
    void request(connection)
  }
}

const request = async request => {
  console.log(request.url, request.method, request.headers)
  const path = `./static${request.url}`
  const url = new URL(path.endsWith("/") ? `${path}index.html` : path, baseURL)
  try {
    const file = await File.fromURL(url)
    const content = await file.readAsText()
    request.respond(
      new Response(content, {
        status: 200,
        headers: {
          "Content-Type": mime.lookup(url.pathname)
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
