# lunet.link

This is a litte experiment to explore [idea of talking to native application][native talk] on the system from the service worker.

## Overview

This repository containts two programs.

#### Remote

A static site which registers a [service worker][] which which acts as proxy to a local native application.

#### Local

Currently it's simple https + wss server intended to run on `127.0.0.1`. In the future this will become a system tray / menu bar application that also acts as server accepting connections from [service worker][] above.

#### Setup

At the moment setup assumes `127.0.0.1 lunet.link` record in `/etc/hosts`, but this should probably be made configurable in the future.

You can start `remote` by running `npm run remote` and navigate to `https://lunet.link/` which will get [service worker][] registerd.

You can start "native application" `local` by running `npm run local`. Assuming [service worker][] was set up correctly it will delegate all the networking to this native application.

[native talk]: https://via.hypothes.is/https://gozala.hashbase.io/posts/Native%20talk.html
[service worker]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
