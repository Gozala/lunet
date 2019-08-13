const main = async mailbox => {
  mailbox.send("init")
  try {
    // Workaround https://github.com/ipfs/js-ipfs/issues/2349
    self.window = self
    self.importScripts("https://unpkg.com/ipfs/dist/index.js")
    mailbox.send("imported")
    const ipfs = await self.Ipfs.create()
    mailbox.send("IPFS is active")
    const result = await ipfs.cat(
      "/ipfs/QmW86ovL9oHyHm53QhFVbDa3GT59FbJc7dzEC68wHsz1ka"
    )
    mailbox.send({ ok: true, value: result })
  } catch (error) {
    mailbox.send({ ok: false, error: error.toString() })
  }
}

self.onconnect = ({ ports: [port] }) => {
  const id = Date.now().toString(32)
  main({
    send(message) {
      console.log(id, port, message)
      port.postMessage(message)
    }
  })
}
