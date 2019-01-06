// @flow strict

const { toWebReadableStream } = require("web-streams-node")
const {
  ReadableStream,
  WritableStream,
  TransformStream
} = require("@mattiasbuelens/web-streams-polyfill")
const { Headers, Request, Response } = require("node-fetch")
const { createServer: createHTTPServer } = require("http")
const { createServer: createHTTPSServer } = require("https")
import { fromEntries } from "./Object.js"

/*::
import * as HTTP from "http"
import * as HTTPS from "https"

export type TLSOptions = {
  key: string;
  certificate: string;
}
*/

class Connection extends Request {
  constructor(
    request /*:HTTP.IncomingMessage*/,
    response /*:HTTP.ServerResponse*/
  ) {
    const socket /*:any*/ = request.socket
    const protocol = socket.encrypted ? "https" : "http"
    const url = `${protocol}://${request.headers.host}${request.url}`
    super(url, {
      headers: new Headers(request.headers),
      method: request.method
    })
    this.response = response
    this.data = toWebReadableStream(request)
  }
  get body() {
    return this.data
  }
  async respond(response /*:Response*/) {
    this.response.writeHead(
      response.status,
      fromEntries(response.headers.entries())
    )
    for await (const chunk of response.body) {
      this.response.write(chunk)
    }
    this.response.end()
  }
}

class Server {
  /*::
  server:HTTP.Server|HTTPS.Server;
  */
  constructor(server /*:HTTP.Server|HTTPS.Server*/) {
    this.server = server
  }
  async *listen(port /*:number*/) /*:AsyncGenerator<Connection, void, void>*/ {
    const { server } = this
    server.listen(port)

    const listener = (
      request /*:HTTP.IncomingMessage*/,
      response /*:HTTP.ServerResponse*/
    ) => {
      listener.resume(new Connection(request, response))
    }
    listener.next = () => new Promise(resolve => (listener.resume = resolve))
    server.on("request", listener)
    try {
      while (true) {
        yield await listener.next()
      }
    } finally {
      server.removeListener("request", listener)
    }
  }
  close() {
    this.server.close()
  }
}

export const http = () => new Server(createHTTPServer())

export const https = (options /*:TLSOptions*/) =>
  new Server(
    createHTTPSServer({
      key: options.key,
      cert: options.certificate
    })
  )

export const server = (options /*::?:TLSOptions*/) =>
  options ? https(options) : http()

export const listen = (port /*:number*/, options /*::?:TLSOptions*/) =>
  server(options).listen(port)

export { Headers, Request, Response, Server, Connection }
