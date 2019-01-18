# lunet.link

This is a litte experiment that explores idea progressive peer-to-peer web applications (PPWA) in mainstream browsers. Primary goal is to deliver seamless experience that can be transparently enhanced to truly P2P (as in no server intermediaries) [through the native application][native talk] providing access to the network.

### Status

Current proof of concept provides access to the [IPFS][] network. It assumes [ipfs-desktop][] application installed and runing.

> It should also work with just local IPFS node as long as it has [daemon][ipfs-daemon] and [gateway][ipfs-gateway] active (Which is the a default).

It works on Firefox and Chrome, probably on Edge (don't have access to test) but not on Safari as it [deliberetly](https://bugs.webkit.org/show_bug.cgi?id=171934) chooses to be [incompatible with standards](https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy) and block access to loopback address.

> Support for Safari is likely to be added in the future for details follow along this [discussion thread][].

#### Example PPWA

Assuming [ipfs-desktop][] is running you can try a fork of https://peerdium.com/ that will load / publish documents on [IPFS] network. You can try it at:

https://gozala.io/peerdium/

And browse the source at:

https://github.com/gozala/peerdium

### How is PWAA is setup ?

Application hosts a minimal [static HTML file](https://github.com/Gozala/peerdium/blob/master/docs/index.html) used for bootstrapping app hosted on IPFS. To do this HTML file embeds [lunet client][] implementation (or equivalent) and a pointer to an app resources on IPFS network through a `meta` tag as illustrated below:

```html
<meta
  name="mount"
  content="/ipfs/QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro/"
/>

<script type="module" async src="https://lunet.link/lunet/client.js"></script>
```

> You can [browse path mounted](https://webui.ipfs.io/#/explore/QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro) through IPLD explorer (Those are just [files from my peerdium fork](https://github.com/gozala/peerdium)).

Application also needs to host static [`lunet.js`] file to setup a [service worker][] which will serve resources from mounted IPFS path through the embedded [lunet client][]. This file just needs to import [lunet proxy][] that takes care of all this:

```js
importScripts("https://lunet.link/lunet/proxy.js")
```

> This file is necessary because [service worker][] can only be registered from the same URL it will serve.

Note that on a first load everything will be setup such that any subsequent loads will be handled by service worker, meaning application will be fully functional offline and it will be loading everything from IPFS network.

### Wait, what ? How ?

When application is first loaded [lunet client][] will install service worker that will act as proxy to the IPFS network. Then it will fetch page corresponding to it's location from IPFS (by resolving path to a mounted path) and update document accordingly. All the linked resources will also be server by service worker and there for be loaded from IPFS network from the mounted path.

Below diagram illustrates a flow through which in this setup browser fetches each resource

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="overflow: hidden; position: relative; top: -0.366638px;" viewBox="0 0 927.1999988555908 772.5" preserveAspectRatio="xMidYMid meet"><desc>Created with Raphaël 2.2.0</desc><defs><path stroke-linecap="round" d="M5,0 0,2.5 5,5z" id="raphael-marker-block"></path><marker id="raphael-marker-endblock55-objygedn" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker><marker id="raphael-marker-endblock55-obj2aj90" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker><marker id="raphael-marker-endblock55-objcyj68" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker><marker id="raphael-marker-endblock55-objwx2pz" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker><marker id="raphael-marker-endblock55-objbjil4" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker><marker id="raphael-marker-endblock55-obj27277" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker><marker id="raphael-marker-endblock55-obja49dp" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker><marker id="raphael-marker-endblock55-obj84mhb" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker><marker id="raphael-marker-endblock55-obj01wvo" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker><marker id="raphael-marker-endblock55-obj4tnui" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker><marker id="raphael-marker-endblock55-objq8fvm" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker><marker id="raphael-marker-endblock55-objmdfg5" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5"><use xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none"></use></marker></defs><rect x="10" y="20" width="49.79999923706055" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="20.000001907348633" y="30" width="29.799999237060547" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="34.89999961853027" y="58.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">App</tspan></text><rect x="10" y="675" width="49.79999923706055" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="20.000001907348633" y="685" width="29.799999237060547" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="34.89999961853027" y="713.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">App</tspan></text><path style="" fill="none" stroke="#000000" d="M34.89999961853027,97.5L34.89999961853027,675" stroke-width="2"></path><rect x="176.2000026702881" y="20" width="203.39999389648438" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="186.1999969482422" y="30" width="183.39999389648438" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="277.8999996185303" y="58.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">Proxy ServiceWorker</tspan></text><rect x="176.2000026702881" y="675" width="203.39999389648438" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="186.1999969482422" y="685" width="183.39999389648438" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="277.8999996185303" y="713.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">Proxy ServiceWorker</tspan></text><path style="" fill="none" stroke="#000000" d="M277.8999996185303,97.5L277.8999996185303,675" stroke-width="2"></path><rect x="399.59999656677246" y="20" width="78.5999984741211" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="409.6000061035156" y="30" width="58.599998474121094" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="438.899995803833" y="58.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">iframe</tspan></text><rect x="399.59999656677246" y="675" width="78.5999984741211" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="409.6000061035156" y="685" width="58.599998474121094" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="438.899995803833" y="713.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">iframe</tspan></text><path style="" fill="none" stroke="#000000" d="M438.899995803833,97.5L438.899995803833,675" stroke-width="2"></path><rect x="550.1999988555908" y="20" width="69" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="560.2000122070312" y="30" width="49" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="584.6999988555908" y="58.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">lunet</tspan></text><rect x="550.1999988555908" y="675" width="69" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="560.2000122070312" y="685" width="49" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="584.6999988555908" y="713.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">lunet</tspan></text><path style="" fill="none" stroke="#000000" d="M584.6999988555908,97.5L584.6999988555908,675" stroke-width="2"></path><rect x="662.4000034332275" y="20" width="136.1999969482422" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="672.4000244140625" y="30" width="116.19999694824219" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="730.5000019073486" y="58.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">SharedWorker</tspan></text><rect x="662.4000034332275" y="675" width="136.1999969482422" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="672.4000244140625" y="685" width="116.19999694824219" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="730.5000019073486" y="713.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">SharedWorker</tspan></text><path style="" fill="none" stroke="#000000" d="M730.5000019073486,97.5L730.5000019073486,675" stroke-width="2"></path><rect x="818.6000003814697" y="20" width="78.5999984741211" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="828.6000366210938" y="30" width="58.599998474121094" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="857.8999996185303" y="58.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">Daemon</tspan></text><rect x="818.6000003814697" y="675" width="78.5999984741211" height="77.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="828.6000366210938" y="685" width="58.599998474121094" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="857.8999996185303" y="713.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">Daemon</tspan></text><path style="" fill="none" stroke="#000000" d="M857.8999996185303,97.5L857.8999996185303,675" stroke-width="2"></path><rect x="131.89999389648438" y="93.75" width="49" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="156.39999961853027" y="122.5" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">fetch</tspan></text><path style="" fill="none" stroke="#000000" d="M34.89999961853027,175C34.89999961853027,175,238.2544886469841,175,272.9081588964618,175" stroke-width="2" marker-end="url(#raphael-marker-endblock55-objygedn)" stroke-dasharray="none"></path><rect x="54.89999961853027" y="195" width="203" height="67.5" rx="0" ry="0" fill="none" stroke="#000000" style="" stroke-width="2"></rect><rect x="59.899993896484375" y="200" width="193" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="156.39999961853027" y="228.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">Realy thorugh client</tspan></text><rect x="0" y="0" width="0" height="0" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="156.39999961853027" y="287.5" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="287.5"></tspan></text><path style="" fill="none" stroke="#000000" d="M277.8999996185303,282.5C277.8999996185303,282.5,74.54551059007645,282.5,39.89184034059872,282.5" stroke-width="2" marker-end="url(#raphael-marker-endblock55-obj2aj90)" stroke-dasharray="none"></path><rect x="0" y="0" width="0" height="0" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="236.89999771118164" y="307.5" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="307.5"></tspan></text><path style="" fill="none" stroke="#000000" d="M34.89999961853027,302.5C34.89999961853027,302.5,387.57801605047075,302.5,433.9014469197051,302.5" stroke-width="2" marker-end="url(#raphael-marker-endblock55-objcyj68)" stroke-dasharray="none"></path><rect x="448.8999938964844" y="298.75" width="125.80000305175781" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="511.7999973297119" y="327.5" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">relay request</tspan></text><path style="" fill="none" stroke="#000000" d="M438.899995803833,380C438.899995803833,380,554.107029572534,380,579.7023422506389,380" stroke-width="2" marker-end="url(#raphael-marker-endblock55-objwx2pz)" stroke-dasharray="none"></path><rect x="594.699951171875" y="376.25" width="125.80000305175781" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="657.6000003814697" y="405" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">serve request</tspan></text><path style="" fill="none" stroke="#000000" d="M584.6999988555908,457.5C584.6999988555908,457.5,699.9070326242918,457.5,725.5023453023967,457.5" stroke-width="2" marker-end="url(#raphael-marker-endblock55-objbjil4)" stroke-dasharray="none"></path><rect x="740.9000244140625" y="453.75" width="106.5999984741211" height="57.5" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="794.2000007629395" y="482.5" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="5.75">/api/v0/cat</tspan></text><path style="" fill="none" stroke="#000000" d="M730.5000019073486,535C730.5000019073486,535,829.3513467195589,535,852.9057687255934,535" stroke-width="2" marker-end="url(#raphael-marker-endblock55-obj27277)" stroke-dasharray="none"></path><rect x="0" y="0" width="0" height="0" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="794.2000007629395" y="560" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="560"></tspan></text><path style="" fill="none" stroke="#000000" d="M857.8999996185303,555C857.8999996185303,555,759.04865480632,555,735.4942328002855,555" stroke-width="2" marker-end="url(#raphael-marker-endblock55-obja49dp)" stroke-dasharray="none"></path><rect x="0" y="0" width="0" height="0" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="657.6000003814697" y="580" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="580"></tspan></text><path style="" fill="none" stroke="#000000" d="M730.5000019073486,575C730.5000019073486,575,615.2929681386477,575,589.6976554605427,575" stroke-width="2" marker-end="url(#raphael-marker-endblock55-obj84mhb)" stroke-dasharray="none"></path><rect x="0" y="0" width="0" height="0" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="511.7999973297119" y="600" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="600"></tspan></text><path style="" fill="none" stroke="#000000" d="M584.6999988555908,595C584.6999988555908,595,469.49296508688985,595,443.89765240878495,595" stroke-width="2" marker-end="url(#raphael-marker-endblock55-obj01wvo)" stroke-dasharray="none"></path><rect x="0" y="0" width="0" height="0" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="236.89999771118164" y="620" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="620"></tspan></text><path style="" fill="none" stroke="#000000" d="M438.899995803833,615C438.899995803833,615,86.22197937189253,615,39.89854850265816,615" stroke-width="2" marker-end="url(#raphael-marker-endblock55-obj4tnui)" stroke-dasharray="none"></path><rect x="0" y="0" width="0" height="0" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="156.39999961853027" y="640" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="640"></tspan></text><path style="" fill="none" stroke="#000000" d="M34.89999961853027,635C34.89999961853027,635,238.2544886469841,635,272.9081588964618,635" stroke-width="2" marker-end="url(#raphael-marker-endblock55-objq8fvm)" stroke-dasharray="none"></path><rect x="0" y="0" width="0" height="0" rx="0" ry="0" fill="#ffffff" stroke="none" style=""></rect><text style="text-anchor: middle; font-family: Andale Mono, monospace; font-size: 16px;" x="156.39999961853027" y="660" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000"><tspan dy="660"></tspan></text><path style="" fill="none" stroke="#000000" d="M277.8999996185303,655C277.8999996185303,655,74.54551059007645,655,39.89184034059872,655" stroke-width="2" marker-end="url(#raphael-marker-endblock55-objmdfg5)" stroke-dasharray="none"></path></svg>

Additonally proxy service worker also relays request for `https://lunet.link/api/` to an IPFS [Daemon REST API](https://docs.ipfs.io/reference/api/http/). That is also how [forked peerdium example][peerdium example] [publishes](https://github.com/Gozala/peerdium/blob/960422670399a76d5bbb9aff4f2c1cf704ebf0a9/static/js/editor.js#L97-L108) and [loads](https://github.com/Gozala/peerdium/blob/960422670399a76d5bbb9aff4f2c1cf704ebf0a9/static/js/editor.js#L110-L119) documents out of IPFS network.

> **Warning**: At the moment lunet will allow any embedder to read / write data into local IPFS node. In a future it will request user consent before doing so.

## Next

Next step would be to use in-browser [JS IPFS][] node in case IPFS Daemon is not available.

# Beyond IPFS

This prototype uses IPFS, however you are encouraged to make a [Dat][], [SSB][] or other P2P protocol version to make these kind of applications on the web more mainstream!

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
