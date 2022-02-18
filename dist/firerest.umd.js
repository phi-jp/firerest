var Q=Object.defineProperty;var D=Object.getOwnPropertySymbols;var V=Object.prototype.hasOwnProperty,X=Object.prototype.propertyIsEnumerable;var F=(h,d,p)=>d in h?Q(h,d,{enumerable:!0,configurable:!0,writable:!0,value:p}):h[d]=p,C=(h,d)=>{for(var p in d||(d={}))V.call(d,p)&&F(h,p,d[p]);if(D)for(var p of D(d))X.call(d,p)&&F(h,p,d[p]);return h};(function(h,d){typeof exports=="object"&&typeof module!="undefined"?module.exports=d():typeof define=="function"&&define.amd?define(d):(h=typeof globalThis!="undefined"?globalThis:h||self,h.firerest=d())})(this,function(){"use strict";function h(n){if(typeof n!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(n))}function d(n,e){for(var t="",r=0,i=-1,o=0,s,f=0;f<=n.length;++f){if(f<n.length)s=n.charCodeAt(f);else{if(s===47)break;s=47}if(s===47){if(!(i===f-1||o===1))if(i!==f-1&&o===2){if(t.length<2||r!==2||t.charCodeAt(t.length-1)!==46||t.charCodeAt(t.length-2)!==46){if(t.length>2){var u=t.lastIndexOf("/");if(u!==t.length-1){u===-1?(t="",r=0):(t=t.slice(0,u),r=t.length-1-t.lastIndexOf("/")),i=f,o=0;continue}}else if(t.length===2||t.length===1){t="",r=0,i=f,o=0;continue}}e&&(t.length>0?t+="/..":t="..",r=2)}else t.length>0?t+="/"+n.slice(i+1,f):t=n.slice(i+1,f),r=f-i-1;i=f,o=0}else s===46&&o!==-1?++o:o=-1}return t}function p(n,e){var t=e.dir||e.root,r=e.base||(e.name||"")+(e.ext||"");return t?t===e.root?t+r:t+n+r:r}var L={resolve:function(){for(var e="",t=!1,r,i=arguments.length-1;i>=-1&&!t;i--){var o;i>=0?o=arguments[i]:(r===void 0&&(r=process.cwd()),o=r),h(o),o.length!==0&&(e=o+"/"+e,t=o.charCodeAt(0)===47)}return e=d(e,!t),t?e.length>0?"/"+e:"/":e.length>0?e:"."},normalize:function(e){if(h(e),e.length===0)return".";var t=e.charCodeAt(0)===47,r=e.charCodeAt(e.length-1)===47;return e=d(e,!t),e.length===0&&!t&&(e="."),e.length>0&&r&&(e+="/"),t?"/"+e:e},isAbsolute:function(e){return h(e),e.length>0&&e.charCodeAt(0)===47},join:function(){if(arguments.length===0)return".";for(var e,t=0;t<arguments.length;++t){var r=arguments[t];h(r),r.length>0&&(e===void 0?e=r:e+="/"+r)}return e===void 0?".":L.normalize(e)},relative:function(e,t){if(h(e),h(t),e===t||(e=L.resolve(e),t=L.resolve(t),e===t))return"";for(var r=1;r<e.length&&e.charCodeAt(r)===47;++r);for(var i=e.length,o=i-r,s=1;s<t.length&&t.charCodeAt(s)===47;++s);for(var f=t.length,u=f-s,v=o<u?o:u,l=-1,a=0;a<=v;++a){if(a===v){if(u>v){if(t.charCodeAt(s+a)===47)return t.slice(s+a+1);if(a===0)return t.slice(s+a)}else o>v&&(e.charCodeAt(r+a)===47?l=a:a===0&&(l=0));break}var g=e.charCodeAt(r+a),y=t.charCodeAt(s+a);if(g!==y)break;g===47&&(l=a)}var m="";for(a=r+l+1;a<=i;++a)(a===i||e.charCodeAt(a)===47)&&(m.length===0?m+="..":m+="/..");return m.length>0?m+t.slice(s+l):(s+=l,t.charCodeAt(s)===47&&++s,t.slice(s))},_makeLong:function(e){return e},dirname:function(e){if(h(e),e.length===0)return".";for(var t=e.charCodeAt(0),r=t===47,i=-1,o=!0,s=e.length-1;s>=1;--s)if(t=e.charCodeAt(s),t===47){if(!o){i=s;break}}else o=!1;return i===-1?r?"/":".":r&&i===1?"//":e.slice(0,i)},basename:function(e,t){if(t!==void 0&&typeof t!="string")throw new TypeError('"ext" argument must be a string');h(e);var r=0,i=-1,o=!0,s;if(t!==void 0&&t.length>0&&t.length<=e.length){if(t.length===e.length&&t===e)return"";var f=t.length-1,u=-1;for(s=e.length-1;s>=0;--s){var v=e.charCodeAt(s);if(v===47){if(!o){r=s+1;break}}else u===-1&&(o=!1,u=s+1),f>=0&&(v===t.charCodeAt(f)?--f==-1&&(i=s):(f=-1,i=u))}return r===i?i=u:i===-1&&(i=e.length),e.slice(r,i)}else{for(s=e.length-1;s>=0;--s)if(e.charCodeAt(s)===47){if(!o){r=s+1;break}}else i===-1&&(o=!1,i=s+1);return i===-1?"":e.slice(r,i)}},extname:function(e){h(e);for(var t=-1,r=0,i=-1,o=!0,s=0,f=e.length-1;f>=0;--f){var u=e.charCodeAt(f);if(u===47){if(!o){r=f+1;break}continue}i===-1&&(o=!1,i=f+1),u===46?t===-1?t=f:s!==1&&(s=1):t!==-1&&(s=-1)}return t===-1||i===-1||s===0||s===1&&t===i-1&&t===r+1?"":e.slice(t,i)},format:function(e){if(e===null||typeof e!="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof e);return p("/",e)},parse:function(e){h(e);var t={root:"",dir:"",base:"",ext:"",name:""};if(e.length===0)return t;var r=e.charCodeAt(0),i=r===47,o;i?(t.root="/",o=1):o=0;for(var s=-1,f=0,u=-1,v=!0,l=e.length-1,a=0;l>=o;--l){if(r=e.charCodeAt(l),r===47){if(!v){f=l+1;break}continue}u===-1&&(v=!1,u=l+1),r===46?s===-1?s=l:a!==1&&(a=1):s!==-1&&(a=-1)}return s===-1||u===-1||a===0||a===1&&s===u-1&&s===f+1?u!==-1&&(f===0&&i?t.base=t.name=e.slice(1,u):t.base=t.name=e.slice(f,u)):(f===0&&i?(t.name=e.slice(1,s),t.base=e.slice(1,u)):(t.name=e.slice(f,s),t.base=e.slice(f,u)),t.ext=e.slice(s,u)),f>0?t.dir=e.slice(0,f-1):i&&(t.dir="/"),t},sep:"/",delimiter:":",win32:null,posix:null};L.posix=L;var O=L,A={exports:{}},b=typeof Reflect=="object"?Reflect:null,R=b&&typeof b.apply=="function"?b.apply:function(e,t,r){return Function.prototype.apply.call(e,t,r)},_;b&&typeof b.ownKeys=="function"?_=b.ownKeys:Object.getOwnPropertySymbols?_=function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:_=function(e){return Object.getOwnPropertyNames(e)};function z(n){console&&console.warn&&console.warn(n)}var x=Number.isNaN||function(e){return e!==e};function c(){c.init.call(this)}A.exports=c,A.exports.once=G,c.EventEmitter=c,c.prototype._events=void 0,c.prototype._eventsCount=0,c.prototype._maxListeners=void 0;var T=10;function w(n){if(typeof n!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof n)}Object.defineProperty(c,"defaultMaxListeners",{enumerable:!0,get:function(){return T},set:function(n){if(typeof n!="number"||n<0||x(n))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+n+".");T=n}}),c.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},c.prototype.setMaxListeners=function(e){if(typeof e!="number"||e<0||x(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this};function j(n){return n._maxListeners===void 0?c.defaultMaxListeners:n._maxListeners}c.prototype.getMaxListeners=function(){return j(this)},c.prototype.emit=function(e){for(var t=[],r=1;r<arguments.length;r++)t.push(arguments[r]);var i=e==="error",o=this._events;if(o!==void 0)i=i&&o.error===void 0;else if(!i)return!1;if(i){var s;if(t.length>0&&(s=t[0]),s instanceof Error)throw s;var f=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw f.context=s,f}var u=o[e];if(u===void 0)return!1;if(typeof u=="function")R(u,this,t);else for(var v=u.length,l=k(u,v),r=0;r<v;++r)R(l[r],this,t);return!0};function P(n,e,t,r){var i,o,s;if(w(t),o=n._events,o===void 0?(o=n._events=Object.create(null),n._eventsCount=0):(o.newListener!==void 0&&(n.emit("newListener",e,t.listener?t.listener:t),o=n._events),s=o[e]),s===void 0)s=o[e]=t,++n._eventsCount;else if(typeof s=="function"?s=o[e]=r?[t,s]:[s,t]:r?s.unshift(t):s.push(t),i=j(n),i>0&&s.length>i&&!s.warned){s.warned=!0;var f=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");f.name="MaxListenersExceededWarning",f.emitter=n,f.type=e,f.count=s.length,z(f)}return n}c.prototype.addListener=function(e,t){return P(this,e,t,!1)},c.prototype.on=c.prototype.addListener,c.prototype.prependListener=function(e,t){return P(this,e,t,!0)};function K(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function S(n,e,t){var r={fired:!1,wrapFn:void 0,target:n,type:e,listener:t},i=K.bind(r);return i.listener=t,r.wrapFn=i,i}c.prototype.once=function(e,t){return w(t),this.on(e,S(this,e,t)),this},c.prototype.prependOnceListener=function(e,t){return w(t),this.prependListener(e,S(this,e,t)),this},c.prototype.removeListener=function(e,t){var r,i,o,s,f;if(w(t),i=this._events,i===void 0)return this;if(r=i[e],r===void 0)return this;if(r===t||r.listener===t)--this._eventsCount==0?this._events=Object.create(null):(delete i[e],i.removeListener&&this.emit("removeListener",e,r.listener||t));else if(typeof r!="function"){for(o=-1,s=r.length-1;s>=0;s--)if(r[s]===t||r[s].listener===t){f=r[s].listener,o=s;break}if(o<0)return this;o===0?r.shift():W(r,o),r.length===1&&(i[e]=r[0]),i.removeListener!==void 0&&this.emit("removeListener",e,f||t)}return this},c.prototype.off=c.prototype.removeListener,c.prototype.removeAllListeners=function(e){var t,r,i;if(r=this._events,r===void 0)return this;if(r.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):r[e]!==void 0&&(--this._eventsCount==0?this._events=Object.create(null):delete r[e]),this;if(arguments.length===0){var o=Object.keys(r),s;for(i=0;i<o.length;++i)s=o[i],s!=="removeListener"&&this.removeAllListeners(s);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(t=r[e],typeof t=="function")this.removeListener(e,t);else if(t!==void 0)for(i=t.length-1;i>=0;i--)this.removeListener(e,t[i]);return this};function N(n,e,t){var r=n._events;if(r===void 0)return[];var i=r[e];return i===void 0?[]:typeof i=="function"?t?[i.listener||i]:[i]:t?$(i):k(i,i.length)}c.prototype.listeners=function(e){return N(this,e,!0)},c.prototype.rawListeners=function(e){return N(this,e,!1)},c.listenerCount=function(n,e){return typeof n.listenerCount=="function"?n.listenerCount(e):M.call(n,e)},c.prototype.listenerCount=M;function M(n){var e=this._events;if(e!==void 0){var t=e[n];if(typeof t=="function")return 1;if(t!==void 0)return t.length}return 0}c.prototype.eventNames=function(){return this._eventsCount>0?_(this._events):[]};function k(n,e){for(var t=new Array(e),r=0;r<e;++r)t[r]=n[r];return t}function W(n,e){for(;e+1<n.length;e++)n[e]=n[e+1];n.pop()}function $(n){for(var e=new Array(n.length),t=0;t<e.length;++t)e[t]=n[t].listener||n[t];return e}function G(n,e){return new Promise(function(t,r){function i(s){n.removeListener(e,o),r(s)}function o(){typeof n.removeListener=="function"&&n.removeListener("error",i),t([].slice.call(arguments))}U(n,e,o,{once:!0}),e!=="error"&&I(n,i,{once:!0})})}function I(n,e,t){typeof n.on=="function"&&U(n,"error",e,t)}function U(n,e,t,r){if(typeof n.on=="function")r.once?n.once(e,t):n.on(e,t);else if(typeof n.addEventListener=="function")n.addEventListener(e,function i(o){r.once&&n.removeEventListener(e,i),t(o)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof n)}var J=A.exports;class q extends J{constructor(){super()}emitAsync(e,...t){let r=[];return this.listeners(e).forEach(i=>{var o=i(...t);r.push(o)}),Promise.all(r)}}class E extends q{constructor({parent:e,root:t,path:r,headers:i={}}){super();this._parent=e,this._root=t,this._path=r,this._headers=i}child(e){return new E({parent:this,root:this.isRoot()?this:this.root,headers:{},path:e.toString()})}async fetch({type:e,data:t={}}){let r=this.root,i=this.path,o=r._baseURL+"/"+i;e=e.toUpperCase();try{await this.root.emitAsync("prefetch",{self:this,path:i,endpoint:o,type:e})}catch(l){console.error("--- prefetch error ---",l)}let s=this.headers(),f="",u=null,v=r._fetch;if(e==="GET"||e==="DELETE"){let l=new URLSearchParams;Object.entries(t).forEach(([g,y])=>{Array.isArray(y)?(g=g+"[]",y.forEach(m=>{l.append(g,m)})):typeof y=="object"?Object.entries(y).forEach(([m,H])=>{l.append(`${g}[${m}]`,H)}):l.append(g,y)});let a=l.toString();a&&(f="?"+a)}else t.constructor!==globalThis.FormData?(s["Content-Type"]="application/json; charset=utf-8",u=JSON.stringify(t)):u=t;try{let l=await v(o+f,{method:e,headers:s,body:u}),a=await l.json();if(!l.ok){let g=new Error(a.message);throw g.status=l.status,g.res=l,g.result=a,g}return r._debug&&(console.groupCollapsed("## firerest: %s",o),console.log("payload:",t),console.log("response:",a),console.groupEnd()),await this.root.emitAsync("postfetch",{self:this,path:i,endpoint:o,type:e,res:l,status:l.status,result:a}),a}catch(l){throw await this.root.emitAsync("fail",{self:this,path:i,endpoint:o,type:e,res:l.res,status:l.res.status,result:l.result}),l}}get(e){return this.fetch({type:"GET",data:e})}post(e){return this.fetch({type:"POST",data:e})}put(e){return this.fetch({type:"PUT",data:e})}del(e){return this.fetch({type:"DELETE",data:e})}get root(){return this._root}get parent(){return this._parent}get path(){if(this.isRoot())return this._baseURL;let e=[],t=this;do t._path&&e.unshift(t._path);while(t=t.parent);let r=O.join(...e);return O.normalize(r)}headers(...e){if(e.length===1){let r=typeof e[0];if(r==="string")return this._headers[e[0]];if(r==="object")return Object.assign(this._headers,e[0]),this}else if(e.length===2)return this._headers[e[0]]=e[1],this;let t=this.parent?this.parent.headers():{};return C(C({},t),this._headers)}isRoot(){return this.root===null}}class B extends E{constructor({baseURL:e,debug:t=!1,fetch:r=globalThis.fetch}){super({parent:null,root:null,headers:{},path:""});this._debug=t,this._baseURL=e.replace(/\/$/,""),this._fetch=r}setFetch(e){this._fetch=e}}return{create(n){return new B(n)}}});
