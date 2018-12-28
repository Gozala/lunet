import electron from "electron"
import * as path from "./modules/node/path.js"
import daemon from "./local/daemon.js"
import open from "./modules/opn.js"

const identity = a => a
const when = (target, signal, pack = identity) =>
  new Promise(resolve =>
    target.once(signal, (...args) => resolve(pack(...args)))
  )

const main = async ({ app, Menu, Tray }) => {
  try {
    await when(app, "ready")
    app.dock.hide()
    daemon(9000)

    const iconPath = path.resolve(
      module.filename,
      "../../images/iconTemplate.png"
    )
    console.log(iconPath)
    const tray = new Tray(iconPath)
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Home",
        click() {
          open("https://lunet.link/")
        }
      },
      {
        label: "Quit",
        click() {
          app.quit()
        }
      }
    ])
    tray.setToolTip("Lunet Satellite")
    tray.setContextMenu(contextMenu)
  } catch (error) {
    console.error(error)
  }
}

main(electron)
