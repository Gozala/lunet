self.addEventListener("install", function(event) {
  console.log("ServiceWorker was installed", event)

  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", function(event) {
  console.log("ServiceWorker was activated", event)
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", async function(event) {
  const { request } = event
  const url = new URL(request.url)
  if (url.pathname === "/") {
    const body = `<h1>Hello there</h1><p>You've fetched ${url}</p>`
    event.respondWith(
      new Response(body, {
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "text/html",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Expose-Headers": "*"
        }
      })
    )
  } else {
    event.respondWith(routeRequest(url))
  }
})

const routeRequest = async url => {
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
