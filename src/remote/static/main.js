// @noflow

const setStatusMessage = message => {
  document.querySelector(".status").textContent = message
}

export const main = async () => {
  try {
    setStatusMessage(
      "⚙️ Setting things up, to serve you even without interent."
    )
    const serviceURL = new URL("https://lunet.link/service.js", location.href)
    const registration = await navigator.serviceWorker.register(serviceURL, {
      scope: new URL(location).pathname
    })
    setStatusMessage("🎉 All set! Will be there for you any time")
    await registration.update()
    activate()
  } catch (error) {
    setStatusMessage(`☹️ Ooops, Something went wrong`)
    console.error(error)
  }
}

const activate = async () => {
  try {
    const request = await fetch(location.href)
    const content = await request.text()
    const { documentElement } = parser.parseFromString(content, "text/html")
    document.documentElement.replaceWith(documentElement)
  } catch (error) {
    setStatusMessage(
      "😕 Ooops, Something went wrong. Have you tried reloading it yet ?"
    )
    console.error(error)
  }
}

main()
