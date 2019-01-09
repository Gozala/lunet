// Embed script here will register a companion service worker unless it's
// already loaded from one (in which case it's controlled by it) and will
// connect it to the access point service worker through a `MessagePort`.
export const embed = async () => {
  try {
    const baseURL = new URL("https://lunet.link/")
    const meta = document.querySelector("meta[name=mount]")
    const mount = meta ? meta.content : ""

    let registration = null
    // Register a service worker unless this document is controlled by one.
    if (!navigator.serviceWorker.controller) {
      setStatusMessage(
        "⚙️ Setting application to serve you even without interent."
      )
      registration = await navigator.serviceWorker.register(
        `./lunet.js?mount=${mount}`,
        {
          scope: "./"
        }
      )
    }
    // try {
    //   await registration.update()
    // } catch (error) {
    //   console.warn("Failed to perform update", error)
    // }
    setStatusMessage("⚙️ Setting up a bridge with lunet.link.")
    // Create a hidden iframe that will be used for forwarding a MessagePort
    // to a access point service worker. We need iframe that shares origin
    // with an access point SW so that it is able to send message to SW.
    const frame = document.createElement("iframe")
    frame.src = baseURL
    frame.style.display = "none"
    const loaded = onLoad(frame)
    document.head.appendChild(frame)
    await loaded
    // Once iframe is loaded we create a message channel.
    var { port1, port2 } = new MessageChannel()
    // Forward one port to the iframe which will forward it to access point SW.
    frame.contentWindow.postMessage({ type: "connect" }, baseURL, [port1])
    // Once companion SW is ready we send it the other message port.
    const ready = await navigator.serviceWorker.ready
    setStatusMessage("⚙️ Bridging with lunet.link.")
    ready.active.postMessage("connect", [port2])
    // We wait for an acknowledgement message from companion SW confirming that
    // channel has being established.
    await onMessage(navigator.serviceWorker)
    setStatusMessage("🎉 All set! Will be there for you any time")

    // After SW is all wired up we fetch content corresponding to our own
    // URL and swap the document content with it.
    const request = await fetch(location.href)
    const content = await request.text()
    const parser = new DOMParser()
    const root = parser.parseFromString(content, document.contentType)

    const scripts = [...root.querySelectorAll("script")]
    for (const source of scripts) {
      const script = document.createElement("script")
      for (const { name, value, namespaceURI } of source.attributes) {
        if (namespaceURI) {
          script.setAttributeNS(namespaceURI, name, value)
        } else {
          script.setAttribute(name, value)
        }
      }
      script.async = false
      source.replaceWith(script)
    }

    for (const node of [...document.head.childNodes]) {
      switch (node) {
        case meta:
        case frame:
        default: {
          if (node.localName !== "script") {
            node.removeChild()
          }
        }
      }
    }
    document.head.append(document.adoptNode(root.head).childNodes)
    document.body.replaceWith(document.adoptNode(root.body))
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

embed()
