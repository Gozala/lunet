// @flow strict

const { Server } = self.WebSocket || self.Websocket

/*::
import * as HTTP from "./http.js"

type Options =
  | { port: number, server?:HTTP.Server }
  | { server:HTTP.Server }


*/

class WebSocketServer extends Server {
  /*::
  opened:Promise<void>;
  closed:Promise<void>;
  */
  constructor(options /*:Options*/) {
    const server = options.server ? options.server.server : undefined
    super({ ...options, server })
    this.opened = new Promise(resolve => this.once("listening", resolve))
    this.closed = new Promise(resolve => this.once("close", resolve))
  }
  async *listen() /*:AsyncGenerator<WebSocket, void, void>*/ {
    const listener = connection => listener.resume(connection)
    listener.wait = () => new Promise(resolve => (listener.resume = resolve))
    this.on("connection", listener)

    try {
      while (true) {
        yield await listener.wait()
      }
    } finally {
      this.removeListener("connection", listener)
    }
  }
}

export const server = (options /*:Options*/) /*:WebSocketServer*/ =>
  new WebSocketServer(options)

export const listen = (
  options /*:Options*/
) /*:AsyncGenerator<WebSocket, void, void>*/ => server(options).listen()
