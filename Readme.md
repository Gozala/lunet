# lunet.link

This is a litte experiment to explore [idea of talking to native application][native talk] on the system from the service worker.

## Overview

This repository containts multiple programs. Following sections describes what they are and how they work.

#### [`src/remote`](./src/remote)

Contains source for the server that serves [static site](./src/remote/static/). It is assumed that site will be hosted from `https://lunet.link` but to simplify exploration DNS record for it resolves to `127.0.0.1` and there for you can run it locally via `yarn run remote`.

> **Note**: On first run self signed certificate is generated and added to locally trusted roots on the system.
>
> It works great fine on Chrome and Safari, but firefox still show **Warning: Potential Security Risk Ahead** and will require you to see **more** details and **Accept the Risk and Contiune**.

Primary role of this static site is to be an **access point** to a corresponding p2p network. To accomplish that it's main page _(served on `https://lunet.link/`)_ registers [service worker][] (That we'll refer to it as APSW - Access Point Service Worker). APSW will be used by p2p sites / applications to read / write content into the node of the corresponding p2p network.

At the moment APSW routes all requests to the native application that is expected to be exposing REST API on `https://127.0.0.1:9000/`. In beyond the prove of concept version it will likely also attemp to use gateway servers and whatever else maybe available.

Give that service workers only respond to requests from the clients with a same origin (See [#1188](https://github.com/w3c/ServiceWorker/issues/1188)) p2p sites won't simply be abel to talke to APSW. To address this site also provides few additional resources under [`/companion/`](./src/remote/static/companion/) allowing p2p sites / applications to acquire connection to APSW.

It is assumed that p2p site / application will be using own **CSW** - Companion Service Worker in order to be available offline. It is also assumed that such site / application will host all of it's assets on the p2p network itself. To make this possible off the shelf **CSW** implementation is provided at [`/companion/service.js`](./src/remote/static/companion/service.js) although p2p site will have to register service worker from the same domain. Simple hack would be to have own service worker file like `lunet.link.companion.service.js`

```js
importScripts("https://lunet.link/companion/service.js")
```

But it's not just **CSW** p2p site will need to connect it to the **APSW** and to do that p2p site will need to use iframe from the same origin as **APSW** to post a [`MessagePort`][] to it. For that reason static site also
provides html document that can be embedded as follows:

```js
<iframe src="https://lunet.link/companion/bridge.html" />
```

To avoid the whole ceremony there is also [`/companion/embed.js`](./src/remote/static/companion/embed.js) module that assumes `CSW` (like one above) is available at `./lunet.link.companion.service.js` and it takes care of all the boilerplate.

#### [`./src/local/`](./src/local)

This pretends to be a **native application** exposing REST API to the p2p network that **APSW** will use. In practice it's just a simple https server that prints just prints something like `Response from /some/path` on `GET` to `https://127.0.0.1/some/path`. You can start it by running `yarn run local`.

> Note: On first run self signed certificate is generated and added to locally trusted roots on the system.
>
> It works great fine on Chrome and Safari, but firefox still show Warning: Potential Security Risk Ahead and will require you to see more details and Accept the Risk and Contiune.

In the future this will be replaced by a system tray / menu bar application instead. In fact there is one already in progress already antd you can try that instead by runnig `yarn start` from [`satellite`](./satellite/) directory.

#### Try / Hack

If you want to try things out or hack on this here is what you will need to do (feel free to use `npm` instead of `yarn`)

- `yarn install`
- `yarn run remote`
- `open https://lunet.link/`
- If you're trying on firefox make sure to **Accept the Risk and Contiune**.
- `yarn run local` _You need to keep `yarn run remote` going_.
- If you're on firefox make sure to `open https://127.0.0.1:9000` so that you can **Accept the Risk and Contiune**.
- Then you can try out the [demo](./demo/) available at https://ipfs.io/ipfs/QmSYickcuNoda1ZNShbtT5WpRxMG1jqzUqEypYYpvYBLAY/
- Assuming everything wen't ok, you should be able to go to arbirtary URL _(even when offline)_ e.g. https://ipfs.io/ipfs/QmSYickcuNoda1ZNShbtT5WpRxMG1jqzUqEypYYpvYBLAY/hello/world` and see page like:

  > Response from /ipfs/QmSYickcuNoda1ZNShbtT5WpRxMG1jqzUqEypYYpvYBLAY/hello/world

[native talk]: https://via.hypothes.is/https://gozala.hashbase.io/posts/Native%20talk.html
[service worker]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[`messageport`]: https://developer.mozilla.org/en-US/docs/Web/API/MessagePort
