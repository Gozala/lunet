self.addEventListener("install", function(event) {
  console.log("ServiceWorker was installed", event)

  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", function(event) {
  console.log("ServiceWorker was activated", event)
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", function(event) {
  const { request } = event
  const body = `<h1>Hello there</h1><p>You've fetched ${request.url}</p>`
  if (url.pathname === "/") {
    event.respondWith(
      new Response(body, {
        status: 200,
        headers: {
          "Content-Type": "text/html"
        }
      })
    )
  } else {
    event.respondWith(routeRequest(url))
  }
})

const routeRequest = async url => {
  try {
    const localURL = new URL(url.pathname, `http://127.0.0.1:9000`)
    console.log("Request", localURL)
    const response = await fetch(localURL)
    const text = await response.text()
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/html"
      }
    })
  } catch (error) {
    return new Response(error.toString(), {
      status: 500
    })
  }
}
