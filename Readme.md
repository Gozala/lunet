# lunet.link

This is a litte experiment that explores idea of progressive peer-to-peer web applications (PPWA) in mainstream browsers. Primary goal is to deliver seamless experience that can be transparently enhanced to truly P2P (as in no server intermediaries) [through the native application][native talk] providing access to the corresponding network.

### Status

This is **proof of concept** and an ongoing exploration. Things keep changing and you should not use it for anything other explorations / prototypes which will likely break here and there.

Current prototype provides access to the [IPFS][] network, using in-browser [JS IPFS][] node running in a [shared worker][]. Prototype will also attempts to leverage [ipfs-desktop][] application if one is installed and runing.

> Local IPFS node with running [daemon][ipfs-daemon] and [gateway][ipfs-gateway] works just as well.

It works on Firefox and Chrome, probably on Edge (don't have access to test). In Safari only in-browser node is used due to [deliberete](https://bugs.webkit.org/show_bug.cgi?id=171934) choice by Apple to be [incompatible with standards](https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy) and block access to loopback address.

> In Safari [service worker][] is used instead of [shared worker][] which are also difficult to debug there, which is to say technically it works on Safari but it's less tested and chances are it might be broken there from time to time.

#### Example PPWA

If you navigate to

https://lunet.link/peerdium.gozala.io/

You should a fork of https://peerdium.com/ application.

You could access same exact example by navigating to

https://lunet.link/ipfs/QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro/

That is because peerdium.gozala.io is set up with IPFS [DNSLink][] corresponding to that exact IPFS address:

```
dig +noall +answer TXT _dnslink.peerdium.gozala.io
_dnslink.peerdium.gozala.io. 4502 IN    TXT     "dnslink=/ipfs/QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro/"
```

### How does this work ?

Actual [application resources](https://github.com/Gozala/peerdium/tree/632f7e138472406db89e8d4ac9c3153216e0e3dc) are published to IPFS network and can be addressed as [`/ipfs/QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro/`](https://explore.ipld.io/#/explore/QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro). As you could see from `dig` command output there is also a corresponding DNS record for `peerdium.gozala.io`.

When https://lunet.link/peerdium.gozala.io/ is loaded it connects to the IPFS network through in-browser node in [shared worker][] and / or [ipfs-desktop][].

It then resolve `peerdium.gozala.io` IPFS address recorded as [DNSLink]. And creates [sandboxed iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox) corresponding to it's origin

> It takes CID `QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro` and encodes it as base32 (to avoid case sesitivity) and uses that as subdomain to provide origin separation between apps. Specifically it loads following URL into iframe:
>
> `bafybeie2rd23t4aa6qebc4ivjs4tewkaapm6t2ibwe3d6mpwxzd47g76da.celestial.link`
>
> **Note:** celestal.link serves same [static content](https://github.com/Gozala/lunet/tree/master/docs/celestial) regardless of the subdomain.

Sanboxed iframe is setup with a service worker such that all requestes will be served from shared IPFS node and are relative to IPFS application IPFS address - [`/ipfs/QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro/`](https://explore.ipld.io/#/explore/QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro)

Application can also issue POST request to write posted data into user library managed by lunet.link.

> This is not fully implemented yet, but idea is that application will not know where produced data ends up, what the address for it or whether it's saved encrypted. Application will only be able to access data provided to it without revealing any of the details about it. By navigating to
>
> https://lunet.link/peerdium.gozala.io/ipfs/QmXg4doMsTcBXgZ3JQosowt12q9Z6xZgURZVkcwCDwRX42/
>
> Lunet will setup application sandox such that it can access data provided `/ipfs/QmXg4doMsTcBXgZ3JQosowt12q9Z6xZgURZVkcwCDwRX42/` through `GET` requests `fetch('/data')` and save updates into user library via `PATCH` request all without knowing address of the data or a key used to encrypt it before (if ever) it's published to IPFS.

Various methods provided by web platfrom are used to prevent application from every talking to any servers as we want an ecosystem that does not monetize on smuggled data, but rather keeps user in full control of it.

### Wait, what ? How ?

When application is first loaded [lunet client][] will install service worker that will act as proxy to the IPFS network. Then it will fetch page corresponding to it's location from IPFS (by resolving path to a mounted path) and update document accordingly. All the linked resources will also be server by service worker and there for be loaded from IPFS network from the mounted path.

Below diagram illustrates a flow through which in this setup browser fetches each resource

![request flow diagram](./request-flow.svg)

# Protocol Diversity

This prototype uses IPFS, however there is no reason why same approach could not be used to support [Dat][], [SSB][] or other P2P protocol of your choice. In fact why not embrace diversity ? Everything is intentionally designed such that multiple protocols could be used in synergy, would not it be nice to e.g. load application from [IPFS][] and data it reads / writes from [Dat][]:

```
lunet.link/ipfs/QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro/dat/e56c7ad7bb3d27f516970d14ee5cb9d2cfa7eb15184278cf5a2dd5bbccd02a6b/posts
```

How about application from [Dat][] operating on data from [SSB][]:

```
lunet.link/dat/6dd4a37c98ef31d2c6a13b27d27a25e2fc7fa9b7bc16b72617852b043367a0be/ssb/@B/Pg4xaGbgy2CFrza9g5kGZurAILCk+NapOcTXah98I=.ed25519
```

# Can I trust you ?

How can I trust lunet.link / celestal.link not to compromise my privacy ? What if you tomorrow you deploy version that smuggles all my private data so you could sell it off to [Cambridge Analytica](https://en.wikipedia.org/wiki/Facebook%E2%80%93Cambridge_Analytica_data_scandal) ?

You can not, nor you should! You can embrace [IndieWeb](http://indieweb.org/) spirit in you and deploy lunet yourself! In fact in a future lunet will [register protocol handlers](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler) so that instead of using https://lunet.link/peerdium.gozala.io/ we'll use `ipfs://peerdium.gozala.io` which will redirect to your own (maybe even altered) lunet deployment.

[lunet client]: https://github.com/Gozala/lunet/blob/master/docs/lunet/client.js
[ipfs]: http://ipfs.io/
[service worker]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Updating_your_service_worker
[`lunet.js`]: https://github.com/Gozala/peerdium/blob/master/docs/lunet.js
[lunet proxy]: https://github.com/Gozala/lunet/blob/master/docs/lunet/proxy.js
[peerdium example]: https://gozala.io/peerdium/
[native talk]: https://via.hypothes.is/https://gozala.hashbase.io/posts/Native%20talk.html
[ipfs-desktop]: https://github.com/ipfs-shipyard/ipfs-desktop
[ipfs-gateway]: https://github.com/ipfs/go-ipfs/blob/v0.4.15/docs/config.md#gateway
[ipfs-daemon]: https://github.com/ipfs/go-ipfs/blob/v0.4.15/docs/config.md#api
[discussion thread]: https://github.com/ipfs/in-web-browsers/issues/137
[js ipfs]: https://github.com/ipfs/js-ipfs
[dat]: http://datproject.org/
[ssb]: https://www.scuttlebutt.nz/
[shared worker]: https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
[dnslink]: https://docs.ipfs.io/guides/concepts/dnslink/
