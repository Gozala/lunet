import {} from "../unpkg.com/ipfs-http-client/dist/index.js"
const DaemonClient = window.IpfsHttpClient
delete window.IpfsHttpClient
export default DaemonClient
