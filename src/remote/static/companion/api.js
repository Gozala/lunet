export const client = async () => {
  try {
    const baseURL = new URL("https://lunet.link/companion/")
    setStatusMessage(
      "⚙️ Setting application to serve you even without interent."
    )
    const registration = await navigator.serviceWorker.register(
      "./lunet.link.companion.service.js",
      {
        scope: new URL(location).pathname
      }
    )
    // try {
    //   await registration.update()
    // } catch (error) {
    //   console.warn("Failed to perform update", error)
    // }
    setStatusMessage("⚙️ Setting up a bridge with lunet.link.")
    const frame = document.createElement("iframe")
    frame.src = new URL("bridge.html", baseURL)
    frame.style.display = "none"
    const loaded = onLoad(frame)
    document.head.appendChild(frame)
    await loaded
    var { port1, port2 } = new MessageChannel()
    frame.contentWindow.postMessage("connect", baseURL, [port1])
    const ready = await navigator.serviceWorker.ready
    setStatusMessage("⚙️ Bridging with lunet.link.")
    ready.active.postMessage("connect", [port2])
    await onMessage(navigator.serviceWorker)
    setStatusMessage("🎉 All set! Will be there for you any time")
    const request = await fetch(location.href)
    const content = await request.text()
    const parser = new DOMParser()
    const { documentElement } = parser.parseFromString(content, "text/html")
    document.documentElement.replaceWith(documentElement)
  } catch (error) {
    setStatusMessage(`☹️ Ooops, Something went wrong`)
    console.error({ message: error.message, stack: error.stack })
  }
}

const when = type => target =>
  new Promise(resolve => target.addEventListener(type, resolve))

const onLoad = when("load")

const onMessage = when("message")

const setStatusMessage = message => {
  document.body.textContent = message
}

client()
