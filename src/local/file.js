const { resolve, join, basename, dirname } = self.require("path")
const { stat, open, read, write } = self.require("fs").promises
const { Buffer } = self.require("buffer")

class FileBlob {
  constructor(start = 0, end = 0, contentType = "application/octet-stream") {
    this.start = start
    this.end = end
    this.contentType = contentType
  }
  get type() {
    return this.contentType
  }
  get size() {
    return this.end - this.start
  }
}

export class File extends FileBlob {
  static async fromURL(url /*:URL*/, contentType) {
    const info = await stat(url.pathname)
    return new File(url, info, contentType)
  }
  constructor(url, info, contentType) {
    super(0, info.size, contentType)
    this.url = url
    this.info = info
  }
  name() {
    return basename(this.url)
  }
  lastModifiedDate() {
    return this.info.mtime
  }
  async readAsText() {
    let file = null
    try {
      const buffer = Buffer.alloc(this.size)
      file = await open(this.url.pathname, "r")
      await file.read(buffer, 0, buffer.length, this.start)
      const text = buffer.toString("utf-8")
      await file.close()
      file = null
      return text
    } catch (error) {
      if (file != null) {
        await file.close()
      }
      throw error
    }
  }
}

export class FileReader {
  abort() {}
  readAsArrayBuffer(blob) {}
  readAsBinaryString(blob) {}
  readAsDataURL(blob) {}
  readAsText(blob) {
    return blob.readAsText()
  }
}
