// @noflow

const { URL } = require("url")
export const baseURL = new URL("./", `file://${module.filename}`)
