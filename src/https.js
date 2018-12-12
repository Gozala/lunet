const { toWebReadableStream } = self.require("web-streams-node")
const { ReadableStream, WritableStream, TransformStream } = self.require(
  "@mattiasbuelens/web-streams-polyfill"
)
const { Headers, Request, Response } = self.require("node-fetch")

const { URL } = self.require("url")
const { createServer } = self.require("https")

const toNodeHeaders = headers => {
  const result = {}
  for (const [key, value] of headers.entries()) {
    result[key] = value
  }
  return result
}

class Connection extends Request {
  constructor(request, response) {
    super(request.url, {
      headers: new Headers(request.headers),
      method: request.method
    })
    this.response = response
    this.data = toWebReadableStream(request)
  }
  get body() {
    return this.data
  }
  async respond(response) {
    this.response.writeHead(response.status, toNodeHeaders(response.headers))
    for await (const chunk of response.body) {
      this.response.write(chunk)
    }
    this.response.end()
  }
}

class Server {
  constructor(port, options) {
    this.server = createServer({
      key: options.key,
      cert: options.certificate
    })
    this.server.listen(port)
  }
  async *listen() {
    const listener = (request, response) => {
      listener.resume(new Connection(request, response))
    }
    listener.next = () => new Promise(resolve => (listener.resume = resolve))

    this.server.on("request", listener)
    try {
      while (true) {
        yield await listener.next()
      }
    } finally {
      this.server.removeListener("request", listener)
    }
  }
  close() {
    if (this.server) {
      this.server.close()
      this.server = null
    }
  }
}

export const server = (port, options) => new Server(port, options)

export { Headers, Request, Response, Server, Connection }
