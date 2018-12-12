self.addEventListener("install", function(event) {
  console.log("ServiceWorker was installed", event)
  // event.registerForeignFetch({
  //  scopes: [self.registration.scope], // or some sub-scope
  //  origins: ['*'] // or ['https://example.com']
  // });

  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", function(event) {
  console.log("ServiceWorker was activated", event)
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", function(event) {
  const { request } = event
  const body = `<h1>Hello there</h1><p>You've fetched ${request.url}</p>`
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
})
