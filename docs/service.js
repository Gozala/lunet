// @flow strict

const NAME = "service"
const VERSION = "0.0.1"
const ID = `${NAME}@${VERSION}`
const serviceURL = new URL("https://lunet.link/")

const install = (event /*:InstallEvent*/) => {
  console.log(`Proxy installed at ${self.registration.scope}`)
  // Cache all the assets that we may need so they can be served offline.
  event.waitUntil(setup())
}

// Companion service is used p2p sites / applications. Site uses embedded
// `iframe` with `companion/bridge.html` to connect this SW with an
// "access point" SW allowing site / app to load all of the data from the p2p
// network.
const activate = (event /*:ExtendableEvent*/) => {
  console.log(`Proxy activated at ${self.registration.scope}`)
  // At the moment we claim all the clients. In the future we should
  // consider how do we deal with SW updates when former one already has
  // clients.
  event.waitUntil(initialize())
}

const request = (event /*:FetchEvent*/) => {
  console.log(
    `Proxy ${self.registration.scope} got a fetch request ${event.request.url}`,
    event
  )
  const response = respond(event)
  event.respondWith(response)
}

const respond = async (event /*:FetchEvent*/) => {
  const cache = await caches.open(ID)
  const response = await cache.match(event.request, {
    ignoreSearch: true,
    ignoreMethod: true
  })

  if (response) {
    return response
  } else {
    const url = new URL(event.request.url)
    switch (url.hostname) {
      case self.location.hostname:
        return page(event)
      default:
        return fetch(event.request)
    }
  }
}

const page = async (event /*:FetchEvent*/) => {
  return new Response(
    `<html>
    <head>
      <meta charset="utf-8" />
      <title>Lunet</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="description" content="Lunet" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script type="module" src="/main.js"></script>
    </head>
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

const setup = async () => {
  const skip = self.skipWaiting()

  console.log(`Proxy is setting up ${self.registration.scope}`)
  const cache = await caches.open(ID)
  const urls = [
    new URL("/main.js", serviceURL).href,
    new URL("/embed.js", serviceURL).href,
    new URL("/lunet.js", serviceURL).href,
    new URL("/lunet/ipfs.js", serviceURL).href,
    new URL("/lunet/unpkg.com/ipfs/dist/index.js", serviceURL).href,
    new URL("/lunet/unpkg.com/ipfs/dist/index.js.map", serviceURL).href,
    new URL("/lunet/unpkg.com/ipfs-http-response/dist/index.js", serviceURL)
      .href,
    new URL("/lunet/unpkg.com/ipfs-http-response/dist/index.js.map", serviceURL)
      .href,
    new URL("/lunet/unpkg.com/tar-stream/dist/index.js", serviceURL).href
  ]
  console.log(`Service is caching`, urls)
  await cache.addAll(urls)
  console.log(`Service cached`)

  await skip
  console.log("Installation is complete!")
}

const initialize = async () => {
  console.log(`Proxy is initializing ${self.registration.scope}`)
  const clients = await self.clients.matchAll({ includeUncontrolled: true })
  console.log(`Proxy is claiming all clients ${clients.map($ => $.url)}`)

  await self.clients.claim()

  const keys = await caches.keys()
  for (const id of keys) {
    if (id !== ID && id.startsWith(NAME)) {
      console.log(`Proxy is clearing obsolete cache: ${id}`)
      await caches.delete(id)
    }
  }

  console.log("Proxy activation is complete")
}

self.addEventListener("install", install)
self.addEventListener("activate", activate)
self.addEventListener("fetch", request)
