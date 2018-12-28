// @flow strict

self.addEventListener("install", function(event) {
  console.log("ServiceWorker was installed", event)

  self.skipWaiting()
})

self.addEventListener("activate", function(event) {
  console.log("ServiceWorker was activated", event)
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", function(event) {
  console.log("fetch from service worker", event)
  const { request } = event
  event.respondWith(handleRequest(request))
})

self.addEventListener("message", function({ data, ports, source }) {
  const [port] = ports
  const { origin, info } = data
  console.log("connected", {
    origin,
    port,
    info
  })

  accessPoint = new AccessPoint(port)

  source.postMessage("ready")
})

let accessPoint = null

class AccessPoint {
  /*::
  id:number
  port:MessagePort
  pendingRequests: {[number]:(MessageEvent) => void}
  */
  constructor(port /*:MessagePort*/) {
    this.id = 0
    this.port = port
    port.start()
    this.port.onmessage = message => this.onMessage(message)
    this.pendingRequests = {}
  }
  onMessage({ data }) {
    console.log(data)
    const pendingRequest = this.pendingRequests[data.id]
    if (pendingRequest) {
      pendingRequest(data)
    } else {
      console.warn(`Unable to find request for id ${data.id}`, data)
    }
  }
  receive(id /*:number*/) /*:Promise<MessageEvent>*/ {
    return new Promise((resolve /*:MessageEvent => void*/) => {
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

    const response /*:any*/ = await this.receive(id)
    return new Response(response.buffer, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers)
    })
  }
}

const handleRequest = async request => {
  if (accessPoint) {
    return await accessPoint.request(request)
  } else if (new URL(request.url).origin === self.origin) {
    return new Response(
      `<script type="module" src="https://lunet.link/companion/api.js"></script>`,
      {
        headers: {
          "Content-Type": "text/html"
        }
      }
    )
  } else {
    return fetch(request.url)
  }
}
