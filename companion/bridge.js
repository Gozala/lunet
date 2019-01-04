class Companion {
  static spawn() {
    const host = new this()
    host.init()
  }
  async init() {
    console.log("setup")
    window.addEventListener("message", this)
  }
  async onMessage({ data, ports, origin, source }) {
    console.log("connection request", { data, origin, ports })
    // TODO: Handle a case where lunet.link has not being visite and no
    // sw is registered yet.
    await navigator.serviceWorker.ready
    navigator.serviceWorker.controller.postMessage(
      { info: data, origin },
      ports
    )
  }
  handleEvent(event) {
    switch (event.type) {
      case "message": {
        return this.onMessage(event)
      }
    }
  }
}

Companion.spawn()
