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
        await this.oncontrolled()
        console.log(navigator.serviceWorker.controller)
        this.setStatusMessage("🎉 Loading dashboard!")
        await this.activateDashboard()
      }
    } catch (error) {
      this.setStatusMessage(`☹️ Ooops, Something went wrong ${error}`)
    }
  }
  oncontrolled() {
    return new Promise(resolve => {
      navigator.serviceWorker.addEventListener("controllerchange", resolve, {
        once: true
      })
    })
  }
  async activateDashboard() {
    // Once SW is ready we load "control panel" UI by fetching it from SW.
    const response = await fetch("/webui")
    const content = await response.text()
    history.pushState(null, "", response.url)
    document.write(content)
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
