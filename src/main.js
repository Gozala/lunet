export const main = () => {
  document.body.textContent = "Installing a service worker"
  try {
    const serviceURL = "./service.js"
    const registration = await navigator.serviceWorker.register(serviceURL, {
      scope: "/"
    })
    document.body.textContent = `Service worker registred ${registration}`
    registration.update()
    document.body.textContent = `Service worker updated`
  } catch (error) {
    document.body.textContent = `Service worker registration failed ${error}`
  }
}

main()
