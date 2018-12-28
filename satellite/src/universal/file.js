// @flow strict

const { resolve, join, basename, dirname } = require("path")
const { stat, open, read, write } = require("fs").promises
const { Buffer } = require("buffer")

/*::
import type {Stats} from "fs"
*/

class FileBlob {
  /*::
  start:number;
  end:number;
  contentType:string;
  */
  constructor(
    start /*:number*/ = 0,
    end /*:number*/ = 0,
    contentType /*:string*/ = "application/octet-stream"
  ) {
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
  static async fromURL(url /*:URL*/, contentType /*::?:string*/) {
    const info = await stat(url.pathname)
    return new File(url, info, contentType)
  }
  /*::
  url:URL
  info:Stats
  */
  constructor(url /*:URL*/, info /*:Stats*/, contentType /*::?:string*/) {
    super(0, info.size, contentType)
    this.url = url
    this.info = info
  }
  name() {
    return basename(this.url.href)
  }
  lastModifiedDate() {
    return this.info.mtime
  }
  async readAsText() /*:Promise<string>*/ {
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
  readAsArrayBuffer(blob /*:Blob*/) /*:ArrayBuffer*/ {
    throw Error("Not implemented")
  }
  readAsBinaryString(blob /*:Blob*/) {
    throw Error("Not implemented")
  }
  readAsDataURL(blob /*:Blob*/) {
    throw Error("Not implemented")
  }
  readAsText(blob /*:File*/) {
    return blob.readAsText()
  }
}
