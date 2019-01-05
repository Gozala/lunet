// @noflow

const setStatusMessage = message => {
  document.querySelector(".status").textContent = message
}

export const main = async () => {
  try {
    setStatusMessage(
      "⚙️ Setting things up, to serve you even without interent."
    )
    // Register "access point" service worker that will serve all the p2p sites
    // through `MessagePort` instances.
    const serviceURL = new URL("/service.js", location.href)
    // Uses the scope of the page it's served from.
    const registration = await navigator.serviceWorker.register(serviceURL, {
      scope: new URL(location).pathname
    })
    setStatusMessage("🎉 All set! Will be there for you any time")
    // TODO: Work out a SW upgrade rollout strategy. For the proove of concept
    // we just call update here to ease development.

    await navigator.serviceWorker.ready
    await registration.update()

    await activate()
  } catch (error) {
    setStatusMessage(`☹️ Ooops, Something went wrong ${error}`)
  }
}

const activate = async () => {
  // Once SW is ready we load "control panel" UI by fetching it from SW.
  const request = await fetch(location.href)
  const content = await request.text()
  // Then we parse it as HTML and replacing current DOM tree with new one.
  const parser = new DOMParser()
  const { documentElement } = parser.parseFromString(content, "text/html")
  document.documentElement.replaceWith(documentElement)
}

main()
