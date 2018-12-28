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
    await navigator.serviceWorker.ready
    navigator.serviceWorker.controller.postMessage(
      { info: data, origin },
      ports
    )
    void fetch(new URL("../keep-alive!", location))
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
