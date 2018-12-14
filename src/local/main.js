import ENV from "./env.js"
import { server, Response } from "./http.js"
import { File } from "./file.js"

const main = async port => {
  const { url } = import.meta
  const keyURL = new URL("../../.env/localhost.key", url)
  const certificateURL = new URL("../../.env/localhost.certificate", url)

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

main(9000)
