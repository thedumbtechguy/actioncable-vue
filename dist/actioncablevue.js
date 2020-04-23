!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).ActionCableVue=e()}(this,(function(){"use strict";"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;var t,e=function(t,e){return t(e={exports:{}},e.exports),e.exports}((function(t,e){!function(t){var e={logger:self.console,WebSocket:self.WebSocket},n={log:function(){if(this.enabled){for(var t,n=arguments.length,o=Array(n),i=0;i<n;i++)o[i]=arguments[i];o.push(Date.now()),(t=e.logger).log.apply(t,["[ActionCable]"].concat(o))}}},o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},s=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),c=function(){return(new Date).getTime()},r=function(t){return(c()-t)/1e3},l=function(){function t(e){i(this,t),this.visibilityDidChange=this.visibilityDidChange.bind(this),this.connection=e,this.reconnectAttempts=0}return t.prototype.start=function(){this.isRunning()||(this.startedAt=c(),delete this.stoppedAt,this.startPolling(),addEventListener("visibilitychange",this.visibilityDidChange),n.log("ConnectionMonitor started. pollInterval = "+this.getPollInterval()+" ms"))},t.prototype.stop=function(){this.isRunning()&&(this.stoppedAt=c(),this.stopPolling(),removeEventListener("visibilitychange",this.visibilityDidChange),n.log("ConnectionMonitor stopped"))},t.prototype.isRunning=function(){return this.startedAt&&!this.stoppedAt},t.prototype.recordPing=function(){this.pingedAt=c()},t.prototype.recordConnect=function(){this.reconnectAttempts=0,this.recordPing(),delete this.disconnectedAt,n.log("ConnectionMonitor recorded connect")},t.prototype.recordDisconnect=function(){this.disconnectedAt=c(),n.log("ConnectionMonitor recorded disconnect")},t.prototype.startPolling=function(){this.stopPolling(),this.poll()},t.prototype.stopPolling=function(){clearTimeout(this.pollTimeout)},t.prototype.poll=function(){var t=this;this.pollTimeout=setTimeout((function(){t.reconnectIfStale(),t.poll()}),this.getPollInterval())},t.prototype.getPollInterval=function(){var t=this.constructor.pollInterval,e=t.min,n=t.max,o=t.multiplier*Math.log(this.reconnectAttempts+1);return Math.round(1e3*function(t,e,n){return Math.max(e,Math.min(n,t))}(o,e,n))},t.prototype.reconnectIfStale=function(){this.connectionIsStale()&&(n.log("ConnectionMonitor detected stale connection. reconnectAttempts = "+this.reconnectAttempts+", pollInterval = "+this.getPollInterval()+" ms, time disconnected = "+r(this.disconnectedAt)+" s, stale threshold = "+this.constructor.staleThreshold+" s"),this.reconnectAttempts++,this.disconnectedRecently()?n.log("ConnectionMonitor skipping reopening recent disconnect"):(n.log("ConnectionMonitor reopening"),this.connection.reopen()))},t.prototype.connectionIsStale=function(){return r(this.pingedAt?this.pingedAt:this.startedAt)>this.constructor.staleThreshold},t.prototype.disconnectedRecently=function(){return this.disconnectedAt&&r(this.disconnectedAt)<this.constructor.staleThreshold},t.prototype.visibilityDidChange=function(){var t=this;"visible"===document.visibilityState&&setTimeout((function(){!t.connectionIsStale()&&t.connection.isOpen()||(n.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = "+document.visibilityState),t.connection.reopen())}),200)},t}();l.pollInterval={min:3,max:30,multiplier:5},l.staleThreshold=6;var u={message_types:{welcome:"welcome",disconnect:"disconnect",ping:"ping",confirmation:"confirm_subscription",rejection:"reject_subscription"},disconnect_reasons:{unauthorized:"unauthorized",invalid_request:"invalid_request",server_restart:"server_restart"},default_mount_path:"/cable",protocols:["actioncable-v1-json","actioncable-unsupported"]},h=u.message_types,a=u.protocols,p=a.slice(0,a.length-1),d=[].indexOf,f=function(){function t(e){i(this,t),this.open=this.open.bind(this),this.consumer=e,this.subscriptions=this.consumer.subscriptions,this.monitor=new l(this),this.disconnected=!0}return t.prototype.send=function(t){return!!this.isOpen()&&(this.webSocket.send(JSON.stringify(t)),!0)},t.prototype.open=function(){return this.isActive()?(n.log("Attempted to open WebSocket, but existing socket is "+this.getState()),!1):(n.log("Opening WebSocket, current state is "+this.getState()+", subprotocols: "+a),this.webSocket&&this.uninstallEventHandlers(),this.webSocket=new e.WebSocket(this.consumer.url,a),this.installEventHandlers(),this.monitor.start(),!0)},t.prototype.close=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{allowReconnect:!0},e=t.allowReconnect;if(e||this.monitor.stop(),this.isActive())return this.webSocket.close()},t.prototype.reopen=function(){if(n.log("Reopening WebSocket, current state is "+this.getState()),!this.isActive())return this.open();try{return this.close()}catch(t){n.log("Failed to reopen WebSocket",t)}finally{n.log("Reopening WebSocket in "+this.constructor.reopenDelay+"ms"),setTimeout(this.open,this.constructor.reopenDelay)}},t.prototype.getProtocol=function(){if(this.webSocket)return this.webSocket.protocol},t.prototype.isOpen=function(){return this.isState("open")},t.prototype.isActive=function(){return this.isState("open","connecting")},t.prototype.isProtocolSupported=function(){return d.call(p,this.getProtocol())>=0},t.prototype.isState=function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];return d.call(e,this.getState())>=0},t.prototype.getState=function(){if(this.webSocket)for(var t in e.WebSocket)if(e.WebSocket[t]===this.webSocket.readyState)return t.toLowerCase();return null},t.prototype.installEventHandlers=function(){for(var t in this.events){var e=this.events[t].bind(this);this.webSocket["on"+t]=e}},t.prototype.uninstallEventHandlers=function(){for(var t in this.events)this.webSocket["on"+t]=function(){}},t}();f.reopenDelay=500,f.prototype.events={message:function(t){if(this.isProtocolSupported()){var e=JSON.parse(t.data),o=e.identifier,i=e.message,s=e.reason,c=e.reconnect;switch(e.type){case h.welcome:return this.monitor.recordConnect(),this.subscriptions.reload();case h.disconnect:return n.log("Disconnecting. Reason: "+s),this.close({allowReconnect:c});case h.ping:return this.monitor.recordPing();case h.confirmation:return this.subscriptions.notify(o,"connected");case h.rejection:return this.subscriptions.reject(o);default:return this.subscriptions.notify(o,"received",i)}}},open:function(){if(n.log("WebSocket onopen event, using '"+this.getProtocol()+"' subprotocol"),this.disconnected=!1,!this.isProtocolSupported())return n.log("Protocol is unsupported. Stopping monitor and disconnecting."),this.close({allowReconnect:!1})},close:function(t){if(n.log("WebSocket onclose event"),!this.disconnected)return this.disconnected=!0,this.monitor.recordDisconnect(),this.subscriptions.notifyAll("disconnected",{willAttemptReconnect:this.monitor.isRunning()})},error:function(){n.log("WebSocket onerror event")}};var b=function(t,e){if(null!=e)for(var n in e){var o=e[n];t[n]=o}return t},g=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=arguments[2];i(this,t),this.consumer=e,this.identifier=JSON.stringify(n),b(this,o)}return t.prototype.perform=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e.action=t,this.send(e)},t.prototype.send=function(t){return this.consumer.send({command:"message",identifier:this.identifier,data:JSON.stringify(t)})},t.prototype.unsubscribe=function(){return this.consumer.subscriptions.remove(this)},t}(),y=function(){function t(e){i(this,t),this.consumer=e,this.subscriptions=[]}return t.prototype.create=function(t,e){var n=t,i="object"===(void 0===n?"undefined":o(n))?n:{channel:n},s=new g(this.consumer,i,e);return this.add(s)},t.prototype.add=function(t){return this.subscriptions.push(t),this.consumer.ensureActiveConnection(),this.notify(t,"initialized"),this.sendCommand(t,"subscribe"),t},t.prototype.remove=function(t){return this.forget(t),this.findAll(t.identifier).length||this.sendCommand(t,"unsubscribe"),t},t.prototype.reject=function(t){var e=this;return this.findAll(t).map((function(t){return e.forget(t),e.notify(t,"rejected"),t}))},t.prototype.forget=function(t){return this.subscriptions=this.subscriptions.filter((function(e){return e!==t})),t},t.prototype.findAll=function(t){return this.subscriptions.filter((function(e){return e.identifier===t}))},t.prototype.reload=function(){var t=this;return this.subscriptions.map((function(e){return t.sendCommand(e,"subscribe")}))},t.prototype.notifyAll=function(t){for(var e=this,n=arguments.length,o=Array(n>1?n-1:0),i=1;i<n;i++)o[i-1]=arguments[i];return this.subscriptions.map((function(n){return e.notify.apply(e,[n,t].concat(o))}))},t.prototype.notify=function(t,e){for(var n=arguments.length,o=Array(n>2?n-2:0),i=2;i<n;i++)o[i-2]=arguments[i];return("string"==typeof t?this.findAll(t):[t]).map((function(t){return"function"==typeof t[e]?t[e].apply(t,o):void 0}))},t.prototype.sendCommand=function(t,e){var n=t.identifier;return this.consumer.send({command:e,identifier:n})},t}(),m=function(){function t(e){i(this,t),this._url=e,this.subscriptions=new y(this),this.connection=new f(this)}return t.prototype.send=function(t){return this.connection.send(t)},t.prototype.connect=function(){return this.connection.open()},t.prototype.disconnect=function(){return this.connection.close({allowReconnect:!1})},t.prototype.ensureActiveConnection=function(){if(!this.connection.isActive())return this.connection.open()},s(t,[{key:"url",get:function(){return _(this._url)}}]),t}();function _(t){if("function"==typeof t&&(t=t()),t&&!/^wss?:/i.test(t)){var e=document.createElement("a");return e.href=t,e.href=e.href,e.protocol=e.protocol.replace("http","ws"),e.href}return t}function v(t){var e=document.head.querySelector("meta[name='action-cable-"+t+"']");if(e)return e.getAttribute("content")}t.Connection=f,t.ConnectionMonitor=l,t.Consumer=m,t.INTERNAL=u,t.Subscription=g,t.Subscriptions=y,t.adapters=e,t.createWebSocketURL=_,t.logger=n,t.createConsumer=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v("url")||u.default_mount_path;return new m(t)},t.getConfig=v,Object.defineProperty(t,"__esModule",{value:!0})}(e)}));(t=e)&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")&&t.default;var n=e.createConsumer;class o{_debug;_debugLevel;constructor(t,e){this._debug=t,this._debugLevel=e}log(t,e="error"){this._debug&&("all"==this._debugLevel||e==this._debugLevel)&&console.log(t)}}var i={mounted(){this.$options.channels&&Object.entries(this.$options.channels).forEach(t=>{if("computed"!=t[0])this.$cable._addChannel(t[0],t[1],this);else{t[1].forEach(t=>{const e=t.channelName(),n={connected:t.connected,rejected:t.rejected,disconnected:t.disconnected,received:t.received};this.$options.channels[e]=n,this.$cable._addChannel(e,n,this)})}})},destroyed(){this.$options.channels&&Object.keys(this.$options.channels).forEach(t=>this.$cable._removeChannel(t))}};class s{_logger=null;_cable=null;_channels={subscriptions:{}};_contexts={};_connectionUrl=null;constructor(t,e){t.prototype.$cable=this,t.mixin(i);let{debug:n,debugLevel:s,connectionUrl:c,connectImmediately:r}=e||{debug:!1,debugLevel:"error",connectionUrl:null};this._connectionUrl=c,!1!==r&&(r=!0),this._logger=new o(n,s),r&&this._connect(this._connectionUrl),this._attachConnectionObject()}subscribe(t,e){if(this._cable){const n=e||t.channel;this._channels.subscriptions[n]=this._cable.subscriptions.create(t,{connected:()=>{this._fireChannelEvent(n,this._channelConnected)},disconnected:()=>{this._fireChannelEvent(n,this._channelDisconnected)},rejected:()=>{this._fireChannelEvent(n,this._subscriptionRejected)},received:t=>{this._fireChannelEvent(n,this._channelReceived,t)}})}else this._connect(this._connectionUrl),this.subscribe(t,e)}perform(t){const{channel:e,action:n,data:o}=t;this._logger.log(`Performing action '${n}' on channel '${e}'.`,"info");const i=this._channels.subscriptions[e];if(!i)throw new Error(`You need to be subscribed to perform action '${n}' on channel '${e}'.`);i.perform(n,o),this._logger.log(`Performed '${n}' on channel '${e}'.`,"info")}unsubscribe(t){this._channels.subscriptions[t]&&(this._channels.subscriptions[t].unsubscribe(),this._logger.log(`Unsubscribed from channel '${t}'.`,"info"))}_channelConnected(t){t.connected&&t.connected.call(this._contexts[t._uid].context),this._logger.log(`Successfully connected to channel '${t._name}'.`,"info")}_channelDisconnected(t){t.disconnected&&t.disconnected.call(this._contexts[t._uid].context),this._logger.log(`Successfully disconnected from channel '${t._name}'.`,"info")}_subscriptionRejected(t){t.rejected&&t.rejected.call(this._contexts[t._uid].context),this._logger.log(`Subscription rejected for channel '${t._name}'.`)}_channelReceived(t,e){t.received&&t.received.call(this._contexts[t._uid].context,e),this._logger.log(`Message received on channel '${t._name}'.`,"info")}_connect(t){if("string"==typeof t)this._cable=n(t);else{if("function"!=typeof t)throw new Error("Connection URL needs to be a valid Action Cable websocket server URL.");this._cable=n(t())}}_attachConnectionObject(){this.connection={connect:(t=null)=>{console.log(this),this._cable?this._cable.connect():this._connect(t||this._connectionUrl)},disconnect:()=>{this._cable&&this._cable.disconnect()}}}_addChannel(t,e,n){e._uid=n._uid,e._name=t,this._channels[t]=e,this._addContext(n)}_addContext(t){this._contexts[t._uid]?++this._contexts[t._uid].users:this._contexts[t._uid]={context:t,users:1}}_removeChannel(t){if(this._channels.subscriptions[t]){const e=this._channels[t]._uid;this._channels.subscriptions[t].unsubscribe(),delete this._channels[t],delete this._channels.subscriptions[t],--this._contexts[e].users,this._contexts[e].users<=0&&delete this._contexts[e],this._logger.log(`Unsubscribed from channel '${t}'.`,"info")}}_fireChannelEvent(t,e,n){if(this._channels.hasOwnProperty(t)){const o=this._channels[t];e.call(this,o,n)}}}return{install(t,e){new s(t,e)}}}));
