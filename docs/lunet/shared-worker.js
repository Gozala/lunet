// @flow strict

/*::
declare class BroadcastChannel {
  +name:string;
  constructor(string):void;
  postMessage(mixed):void;
  close():void;
}

*/
export class SharedWorker {
  /*::
  +broadcastChannel:BroadcastChannel
  +port:MessagePort
  */
  constructor(url /*:string*/) {
    this.broadcastChannel = new BroadcastChannel("shared-worker")
    const { port1, port2 } = new MessageChannel()
    this.port = port1
  }
}
