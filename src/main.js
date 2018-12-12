import ENV from "./env.js"
import { server, Response } from "./https.js"
import { File } from "./file.js"

const main = async port => {
  const { url } = import.meta
  const keyURL = new URL("../.env/key.pem", url)
  const certificateURL = new URL("../.env/certificate.pem", url)

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
  const origin = request.headers.get("origin")
  const allowOrigin = origin.endsWith("symbiont.glitch.me")
    ? origin
    : "https://symbiont.glitch.me"

  request.respond(
    new Response(
      `<html><head><meta charset="UTF-8" /></script></head><body></body></html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": allowOrigin
        }
      }
    )
  )
}

main(9000)
