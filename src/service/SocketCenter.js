/**
 *
 * Created by zhangjiawei on 2018/12/6 15:20:52
 * socket处理中心
 */
import socket from "socket.io-client";

import {socketUrl} from './urls'

class SocketCenter {
  constructor() {
    this.scoketInstance = socket.connect(socketUrl, {
      transports: ["websocket", "xhr-polling", "jsonp-polling"]
    });
    this._initEventListener();
  }
  _initEventListener = () => {
    if (this.scoketInstance) {
        // 监听
      console.log('注册监听');
      // this.scoketInstance.on("Important", viewSocket.onImportant);
      // this.scoketInstance.on('circuid',viewSocket.onCustomCircuit)
      this.scoketInstance.on("disconnect", this._disconnect);
    }
  };
 
  _disconnect = (value) => {
    console.log("_disconnect---->>",value);
  };
}
let socketCenter = new SocketCenter();
export { socketCenter};