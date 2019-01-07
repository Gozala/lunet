// @noflow

class Lunet {
  static new() {
    return new Lunet()
  }
  constructor() {
    this.subscribe()
    this.activate()
  }
  async activate() {
    try {
      this.setStatusMessage(
        "⚙️ Setting things up, to serve you even without interent."
      )

      const serviceURL = new URL("/service.js", location.href)
      // Uses the scope of the page it's served from.
      const registration = await navigator.serviceWorker.register(serviceURL, {
        scope: "./"
      })
      this.setStatusMessage("⚙️ Activating local setup")

      const serviceWorker = await navigator.serviceWorker.ready

      this.setStatusMessage("🎉 All set!")

      if (self.top === self) {
        console.log(navigator.serviceWorker.controller)
        this.setStatusMessage("🎉 Loading dashboard!")
        await this.activateDashboard()
      }
    } catch (error) {
      this.setStatusMessage(`☹️ Ooops, Something went wrong ${error}`)
    }
  }
  async activateDashboard() {
    // Once SW is ready we load "control panel" UI by fetching it from SW.
    const response = await fetch("/webui")
    const content = await response.text()
    // Then we parse it as HTML and replacing current DOM tree with new one.
    const parser = new DOMParser()
    const { documentElement } = parser.parseFromString(content, "text/html")
    history.pushState(null, "", response.url)
    document.documentElement.replaceWith(documentElement)
  }
  subscribe() {
    self.addEventListener("message", this)
  }
  addEventListener(event) {
    switch (event.type) {
      case "message": {
        const {
          data: { type, info },
          origin,
          ports
        } = event

        return this.receive({
          type,
          info,
          origin,
          ports
        })
      }
    }
  }
  receive(message) {
    switch (message.type) {
      case "connect": {
        return this.connect(message)
      }
    }
  }
  async connect({ type, info, origin, ports }) {
    console.log("connection request", { type, info, origin, ports })
    // TODO: Handle a case where lunet.link has not being visite and no
    // sw is registered yet.
    const { active } = await navigator.serviceWorker.ready
    active.postMessage({ type, info, origin }, ports)
  }
  setStatusMessage(message) {
    document.querySelector(".status").textContent = message
  }
}

self.main = Lunet.new()
