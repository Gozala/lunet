// @flow strict

import { File } from "../universal/file.js"
import * as SSL from "../modules/tls-keygen.js"

const loadCertificate = async options => {
  try {
    const keyFile = await File.fromURL(options.key)
    const certificateFile = await File.fromURL(options.certificate)
    const key = await keyFile.readAsText()
    const certificate = await certificateFile.readAsText()
    return { key, certificate }
  } catch (error) {
    return null
  }
}

const createCertificate = async options =>
  SSL.keygen({
    key: options.key.pathname,
    cert: options.certificate.pathname,
    commonName: options.name || SSL.defaultCommonName,
    subjectAltName: options.names || SSL.defaultSubjectAltName,
    entrust: options.entrust !== false
  })

/*::
type Options = {
  key:URL;
  certificate:URL;
  entrust?:boolean;
  name?:?string;
  names?:?string[];
  entrust?:?boolean;
}
*/

export default async (options /*:Options*/) => {
  const files = await loadCertificate(options)
  if (!files) {
    await createCertificate(options)
    const files = await loadCertificate(options)
    if (files == null) {
      throw Error("Failed to issue self-signed, trusted TLS certificate")
    } else {
      return files
    }
  }
  return files
}
