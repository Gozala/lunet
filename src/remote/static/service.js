// @flow strict

self.addEventListener("install", function(event) {
  console.log("ServiceWorker was installed", event)

  event.waitUntil(initCache())
})

self.addEventListener("activate", function(event) {
  console.log("ServiceWorker was activated", event)
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", async function(event) {
  const { request } = event
  const response = matchRoute(request)
  event.respondWith(response)
})

self.addEventListener("message", function({ data, ports, source }) {
  const [port] = ports
  const { origin, info } = data
  console.log("received connection request from", {
    origin,
    port,
    info
  })

  handleConnection(port)
})

const handleConnection = port => {
  port.onmessage = async message => {
    const { id, url } = message.data
    const response = await satelliteRoute(new URL(url))
    const buffer = await response.arrayBuffer()
    port.postMessage(
      {
        id,
        url: response.url,
        redirected: response.redirected,
        status: response.status,
        statusText: response.statusText,
        headers: [...response.headers.entries()],
        buffer
      },
      [buffer]
    )
  }
  port.start()
}

const initCache = async () => {
  const cache = await caches.open("companion")
  return cache.addAll([
    "./companion/bridge.html",
    "./companion/api.js",
    "./companion/companion.js",
    "./companion/service.js"
  ])
}

const matchRoute = request => {
  const url = new URL(request.url)
  const { pathname, hostname } = url
  const [base, ...entries] = pathname.slice(1).split("/")
  switch (base) {
    case "": {
      return mainRoute(request)
    }
    case "companion": {
      return companionRoute(request)
    }
    case "ipfs":
    case "ipns": {
      return subdomainRoute(request)
    }
    case "keep-alive!": {
      keepAlive(request)
      return new Response(null, { status: 200 })
    }
    default: {
      return satelliteRoute(url)
    }
  }
}

const mainRoute = request => {
  const body = `<h1>Hello there</h1><p>You've fetched ${request.url}</p>`
  return new Response(body, {
    status: 200,
    statusText: "OK",
    headers: {
      "content-type": "text/html"
    }
  })
}

const subdomainRoute = async request => {
  const { pathname } = new URL(request.url)
  const [_base, protocol, cid, ...rest] = pathname.slice(1).split("/")
  const path = rest.join("/")
  return new Response("", {
    status: 301,
    statusText: "Moved Permanently",
    headers: {
      Location: `https://${cid}.${protocol}.lunet.link/${path}`
    }
  })
}

const companionRoute = async request => {
  const cache = await caches.open("companion")
  const response = await cache.match(request)
  if (response) {
    return response
  } else {
    return notFound(request)
  }
}

const keepAlive = async () => {
  while (true) {
    await sleep(100)
    console.log("still alive", Date.now())
  }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const notFound = async request => {
  return new Response("<h1>Page Not Found</h1>", {
    status: 404,
    headers: {
      "content-type": "text/html"
    }
  })
}

const satelliteRoute = async url => {
  try {
    const localURL = new URL(url.pathname, `https://127.0.0.1:9000`)
    console.log("Request", localURL)
    const response = await fetch(localURL)
    console.log("Response", response)
    return response
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
      "Access-Control-Allow-Origin": "*"
    })
  }
}
