// @flow strict

const baseURI = new URL("https://lunet.link/")

// Companion service is used p2p sites / applications. Site uses embedded
// `iframe` with `companion/bridge.html` to connect this SW with an
// "access point" SW allowing site / app to load all of the data from the p2p
// network.

self.addEventListener("install", function(event) {
  console.log(`Companion service worker is installed for ${self.origin}`)
  // We cache all the companion assets because occasionally we will need to
  // reconnect to the "access point" SW and if we won't be able to do so
  // while offline (as access point doesn't serve across origins).
  event.waitUntil(initCache())
})

self.addEventListener("activate", function(event) {
  console.log(`Companion service worker is activated for ${self.origin}`)

  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", function(event) {
  console.log(`Companion at ${self.origin} got fetch request`, event)
  const { request } = event
  event.respondWith(matchRoute(request))
})

self.addEventListener("message", function({ data, ports, source }) {
  const [port] = ports

  connection = Connection.new(port, source)
  console.log(
    `Companion at ${self.origin} was connected an access point`,
    connection
  )
})

let connection = null

/*::
type EncodedResponse = {
  type:"response";
  id:number;
  buffer:ArrayBuffer;
  url:string;
  status:number;
  statusText:string;
  destination:string;
  headers:{[key: string]: string};
  integrity: string;
  method: string;
  mode: string;
  redirect: boolean;
  referrer: string;
  referrerPolicy: string;
}

type Alive = {
  type:"alive"
}

type Message =
  | Alive
  | EncodedResponse
*/
class Connection {
  /*::
  id:number
  time:number
  port:MessagePort
  pendingRequests: {[number]:(EncodedResponse) => void}
  */
  static new(port /*:MessagePort*/, source /*:WindowProxy*/) {
    const self = new this(port)
    source.postMessage("ready")
    return self
  }
  constructor(port /*:MessagePort*/) {
    this.time = Date.now()
    this.id = 0
    this.port = port
    port.start()
    this.port.onmessage = (message /*:Object*/) => this.receive(message.data)
    this.pendingRequests = {}
  }
  receive(message /*:Message*/) {
    switch (message.type) {
      case "alive": {
        return this.alive()
      }
      case "response": {
        return this.respond(message)
      }
    }
  }
  // Access point service worker will send "alive" messages to every connected
  // companion. We update time on every such message.
  alive() {
    this.time = Date.now()
  }
  // By tracking time of last received "alive" message we can figure out if
  // connection is still alive or had being dropped.
  isAlive() {
    return Date.now() - this.time < 200
  }
  respond(encodedResponse /*:EncodedResponse*/) {
    const pendingRequest = this.pendingRequests[encodedResponse.id]
    if (pendingRequest) {
      pendingRequest(encodedResponse)
    } else {
      console.warn(
        `Unable to find request for id ${encodedResponse.id}`,
        encodedResponse
      )
    }
  }
  wait(id /*:number*/) /*:Promise<EncodedResponse>*/ {
    return new Promise((resolve /*:EncodedResponse => void*/) => {
      this.pendingRequests[id] = resolve
    })
  }
  async request(request) {
    const id = ++this.id
    const buffer = await request.arrayBuffer()
    this.port.postMessage(
      {
        id,
        buffer,
        url: request.url,
        cache: request.cache,
        destination: request.destination,
        headers: [...request.headers.entries()],
        integrity: request.integrity,
        method: request.method,
        mode: request.mode,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy
      },
      [buffer]
    )

    const response = await this.wait(id)
    return new Response(response.buffer, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers)
    })
  }
}

const matchRoute = async request => {
  const url = new URL(request.url)
  // If matches companion route serve it from cache
  if (url.origin === baseURI.origin) {
    return companionRoute(request)
  }
  // If connected to access point and connection is still alive forward
  // underlying request.
  else if (connection && connection.isAlive()) {
    return await connection.request(request)
  }
  // If no live connection is found to access point we load a page that would
  // allow us to reestablish connection.
  // TODO: We need to use a better reconnection stategy, as requests here may be
  // be for some non-html resource e.g. script or image serving page that does
  // reconnection as we do only works in cases where it's a navigation.
  // If it's not a navigation request than it's coming from a loaded document
  // that would be in `self.clients` so we probably well need to exploit one of
  // such document to reconnect and put this request in the queue until than.
  else if (url.origin === self.origin) {
    return await connectRoute(request)
  }
  // Otherwise it is fetch to some other foreign origin in which case we
  // just serve it through fetch.
  else {
    return foreignFetch(request.url)
  }
}

const foreignFetch = url => fetch(url, { mode: "no-cors" })

const companionRoute = async request => {
  const cache = await caches.open("companion")
  const response = await cache.match(request)
  if (response) {
    return response
  } else {
    return notFound(request)
  }
}

// Here we generate a basic page that goes through embedding flow to create
// connection with an access-point SW.
const connectRoute = async request => {
  return new Response(
    `<html>
  <head>
    <meta charset="utf-8" />
    <title>P2P Site</title>
    <script
      type="module"
      async
      defer
      src="https://lunet.link/companion/embed.js"
    ></script>
  </head>
  <body></body>
</html>
`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html"
      }
    }
  )
}

// Non existing documents under `companion` route.
const notFound = async request => {
  return new Response("<h1>Page Not Found</h1>", {
    status: 404,
    headers: {
      "content-type": "text/html"
    }
  })
}

const initCache = async () => {
  console.log(`Init companion cache for ${self.origin}`)
  const cache = await caches.open("companion")
  const urls = [
    new URL("./companion/bridge.html", baseURI),
    new URL("./companion/bridge.js", baseURI),
    new URL("./companion/embed.js", baseURI),
    new URL("./companion/service.js", baseURI)
  ]
  console.log(`Companion "${self.origin}" is caching`, urls)
  return cache.addAll(urls)
}
