(()=>{var Ht=Object.create;var Fe=Object.defineProperty;var Nt=Object.getOwnPropertyDescriptor;var Ut=Object.getOwnPropertyNames;var It=Object.getPrototypeOf,Zt=Object.prototype.hasOwnProperty;var Dt=(c,t)=>()=>(t||c((t={exports:{}}).exports,t),t.exports);var Wt=(c,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Ut(t))!Zt.call(c,a)&&a!==r&&Fe(c,a,{get:()=>t[a],enumerable:!(o=Nt(t,a))||o.enumerable});return c};var Bt=(c,t,r)=>(r=c!=null?Ht(It(c)):{},Wt(t||!c||!c.__esModule?Fe(r,"default",{value:c,enumerable:!0}):r,c));var ht=Dt((we,ue)=>{(function(c,t){typeof define=="function"&&define.amd?define(t):typeof we=="object"&&typeof we.nodeName!="string"?ue.exports=t():c.Croppie=t()})(typeof self<"u"?self:we,function(){if(typeof Promise!="function"){(function(e){function n(d,w){return function(){d.apply(w,arguments)}}function i(d){if(typeof this!="object")throw new TypeError("Promises must be constructed via new");if(typeof d!="function")throw new TypeError("not a function");this._state=null,this._value=null,this._deferreds=[],b(d,n(h,this),n(l,this))}function s(d){var w=this;return this._state===null?void this._deferreds.push(d):void _(function(){var p=w._state?d.onFulfilled:d.onRejected;if(p===null)return void(w._state?d.resolve:d.reject)(w._value);var v;try{v=p(w._value)}catch(x){return void d.reject(x)}d.resolve(v)})}function h(d){try{if(d===this)throw new TypeError("A promise cannot be resolved with itself.");if(d&&(typeof d=="object"||typeof d=="function")){var w=d.then;if(typeof w=="function")return void b(n(w,d),n(h,this),n(l,this))}this._state=!0,this._value=d,f.call(this)}catch(p){l.call(this,p)}}function l(d){this._state=!1,this._value=d,f.call(this)}function f(){for(var d=0,w=this._deferreds.length;w>d;d++)s.call(this,this._deferreds[d]);this._deferreds=null}function g(d,w,p,v){this.onFulfilled=typeof d=="function"?d:null,this.onRejected=typeof w=="function"?w:null,this.resolve=p,this.reject=v}function b(d,w,p){var v=!1;try{d(function(x){v||(v=!0,w(x))},function(x){v||(v=!0,p(x))})}catch(x){if(v)return;v=!0,p(x)}}var y=setTimeout,_=typeof setImmediate=="function"&&setImmediate||function(d){y(d,1)},E=Array.isArray||function(d){return Object.prototype.toString.call(d)==="[object Array]"};i.prototype.catch=function(d){return this.then(null,d)},i.prototype.then=function(d,w){var p=this;return new i(function(v,x){s.call(p,new g(d,w,v,x))})},i.all=function(){var d=Array.prototype.slice.call(arguments.length===1&&E(arguments[0])?arguments[0]:arguments);return new i(function(w,p){function v(k,P){try{if(P&&(typeof P=="object"||typeof P=="function")){var N=P.then;if(typeof N=="function")return void N.call(P,function(H){v(k,H)},p)}d[k]=P,--x===0&&w(d)}catch(H){p(H)}}if(d.length===0)return w([]);for(var x=d.length,A=0;A<d.length;A++)v(A,d[A])})},i.resolve=function(d){return d&&typeof d=="object"&&d.constructor===i?d:new i(function(w){w(d)})},i.reject=function(d){return new i(function(w,p){p(d)})},i.race=function(d){return new i(function(w,p){for(var v=0,x=d.length;x>v;v++)d[v].then(w,p)})},i._setImmediateFn=function(d){_=d},typeof ue<"u"&&ue.exports?ue.exports=i:e.Promise||(e.Promise=i)})(this)}typeof window<"u"&&typeof window.CustomEvent!="function"&&function(){function e(n,i){i=i||{bubbles:!1,cancelable:!1,detail:void 0};var s=document.createEvent("CustomEvent");return s.initCustomEvent(n,i.bubbles,i.cancelable,i.detail),s}e.prototype=window.Event.prototype,window.CustomEvent=e}(),typeof HTMLCanvasElement<"u"&&!HTMLCanvasElement.prototype.toBlob&&Object.defineProperty(HTMLCanvasElement.prototype,"toBlob",{value:function(e,n,i){for(var s=atob(this.toDataURL(n,i).split(",")[1]),h=s.length,l=new Uint8Array(h),f=0;f<h;f++)l[f]=s.charCodeAt(f);e(new Blob([l],{type:n||"image/png"}))}});var c=["Webkit","Moz","ms"],t=typeof document<"u"?document.createElement("div").style:{},r=[1,8,3,6],o=[2,7,4,5],a,u,m;function L(e){if(e in t)return e;for(var n=e[0].toUpperCase()+e.slice(1),i=c.length;i--;)if(e=c[i]+n,e in t)return e}u=L("transform"),a=L("transformOrigin"),m=L("userSelect");function $(e,n){var i=r.indexOf(e)>-1?r:o,s=i.indexOf(e),h=n/90%i.length;return i[(i.length+s+h%i.length)%i.length]}function R(e,n){e=e||{};for(var i in n)n[i]&&n[i].constructor&&n[i].constructor===Object?(e[i]=e[i]||{},R(e[i],n[i])):e[i]=n[i];return e}function O(e){return R({},e)}function S(e,n,i){var s;return function(){var h=this,l=arguments,f=function(){s=null,i||e.apply(h,l)},g=i&&!s;clearTimeout(s),s=setTimeout(f,n),g&&e.apply(h,l)}}function U(e){if("createEvent"in document){var n=document.createEvent("HTMLEvents");n.initEvent("change",!1,!0),e.dispatchEvent(n)}else e.fireEvent("onchange")}function C(e,n,i){if(typeof n=="string"){var s=n;n={},n[s]=i}for(var h in n)e.style[h]=n[h]}function M(e,n){e.classList?e.classList.add(n):e.className+=" "+n}function pt(e,n){e.classList?e.classList.remove(n):e.className=e.className.replace(n,"")}function Ue(e,n){for(var i in n)e.setAttribute(i,n[i])}function F(e){return parseInt(e,10)}function ut(e,n){if(!e)throw"Source image missing";var i=new Image;return i.style.opacity="0",new Promise(function(s,h){function l(){i.style.opacity="1",setTimeout(function(){s(i)},1)}i.removeAttribute("crossOrigin"),e.match(/^https?:\/\/|^\/\//)&&i.setAttribute("crossOrigin","anonymous"),i.onload=function(){n?EXIF.getData(i,function(){l()}):l()},i.onerror=function(f){i.style.opacity=1,setTimeout(function(){h(f)},1)},i.src=e})}function Ie(e,n){var i=e.naturalWidth,s=e.naturalHeight,h=n||ye(e);if(h&&h>=5){var l=i;i=s,s=l}return{width:i,height:s}}var ft={translate3d:{suffix:", 0px"},translate:{suffix:""}},z=function(e,n,i){this.x=parseFloat(e),this.y=parseFloat(n),this.scale=parseFloat(i)};z.parse=function(e){return e.style?z.parse(e.style[u]):e.indexOf("matrix")>-1||e.indexOf("none")>-1?z.fromMatrix(e):z.fromString(e)},z.fromMatrix=function(e){var n=e.substring(7).split(",");return(!n.length||e==="none")&&(n=[1,0,0,1,0,0]),new z(F(n[4]),F(n[5]),parseFloat(n[0]))},z.fromString=function(e){var n=e.split(") "),i=n[0].substring(I.globals.translate.length+1).split(","),s=n.length>1?n[1].substring(6):1,h=i.length>1?i[0]:0,l=i.length>1?i[1]:0;return new z(h,l,s)},z.prototype.toString=function(){var e=ft[I.globals.translate].suffix||"";return I.globals.translate+"("+this.x+"px, "+this.y+"px"+e+") scale("+this.scale+")"};var te=function(e){if(!e||!e.style[a]){this.x=0,this.y=0;return}var n=e.style[a].split(" ");this.x=parseFloat(n[0]),this.y=parseFloat(n[1])};te.prototype.toString=function(){return this.x+"px "+this.y+"px"};function ye(e){return e.exifdata&&e.exifdata.Orientation?F(e.exifdata.Orientation):1}function Ze(e,n,i){var s=n.width,h=n.height,l=e.getContext("2d");switch(e.width=n.width,e.height=n.height,l.save(),i){case 2:l.translate(s,0),l.scale(-1,1);break;case 3:l.translate(s,h),l.rotate(180*Math.PI/180);break;case 4:l.translate(0,h),l.scale(1,-1);break;case 5:e.width=h,e.height=s,l.rotate(90*Math.PI/180),l.scale(1,-1);break;case 6:e.width=h,e.height=s,l.rotate(90*Math.PI/180),l.translate(0,-h);break;case 7:e.width=h,e.height=s,l.rotate(-90*Math.PI/180),l.translate(-s,h),l.scale(1,-1);break;case 8:e.width=h,e.height=s,l.translate(0,s),l.rotate(-90*Math.PI/180);break}l.drawImage(n,0,0,s,h),l.restore()}function mt(){var e=this,n="croppie-container",i=e.options.viewport.type?"cr-vp-"+e.options.viewport.type:null,s,h,l,f,g,b;e.options.useCanvas=e.options.enableOrientation||be.call(e),e.data={},e.elements={},s=e.elements.boundary=document.createElement("div"),l=e.elements.viewport=document.createElement("div"),h=e.elements.img=document.createElement("img"),f=e.elements.overlay=document.createElement("div"),e.options.useCanvas?(e.elements.canvas=document.createElement("canvas"),e.elements.preview=e.elements.canvas):e.elements.preview=h,M(s,"cr-boundary"),s.setAttribute("aria-dropeffect","none"),g=e.options.boundary.width,b=e.options.boundary.height,C(s,{width:g+(isNaN(g)?"":"px"),height:b+(isNaN(b)?"":"px")}),M(l,"cr-viewport"),i&&M(l,i),C(l,{width:e.options.viewport.width+"px",height:e.options.viewport.height+"px"}),l.setAttribute("tabindex",0),M(e.elements.preview,"cr-image"),Ue(e.elements.preview,{alt:"preview","aria-grabbed":"false"}),M(f,"cr-overlay"),e.element.appendChild(s),s.appendChild(e.elements.preview),s.appendChild(l),s.appendChild(f),M(e.element,n),e.options.customClass&&M(e.element,e.options.customClass),bt.call(this),e.options.enableZoom&&vt.call(e),e.options.enableResize&&gt.call(e)}function be(){return this.options.enableExif&&window.EXIF}function gt(){var e=this,n=document.createElement("div"),i=!1,s,h,l,f=50,g,b,y,_;M(n,"cr-resizer"),C(n,{width:this.options.viewport.width+"px",height:this.options.viewport.height+"px"}),this.options.resizeControls.height&&(y=document.createElement("div"),M(y,"cr-resizer-vertical"),n.appendChild(y)),this.options.resizeControls.width&&(_=document.createElement("div"),M(_,"cr-resizer-horisontal"),n.appendChild(_));function E(p){if(!(p.button!==void 0&&p.button!==0)&&(p.preventDefault(),!i)){var v=e.elements.overlay.getBoundingClientRect();if(i=!0,h=p.pageX,l=p.pageY,s=p.currentTarget.className.indexOf("vertical")!==-1?"v":"h",g=v.width,b=v.height,p.touches){var x=p.touches[0];h=x.pageX,l=x.pageY}window.addEventListener("mousemove",d),window.addEventListener("touchmove",d),window.addEventListener("mouseup",w),window.addEventListener("touchend",w),document.body.style[m]="none"}}function d(p){var v=p.pageX,x=p.pageY;if(p.preventDefault(),p.touches){var A=p.touches[0];v=A.pageX,x=A.pageY}var k=v-h,P=x-l,N=e.options.viewport.height+P,H=e.options.viewport.width+k;s==="v"&&N>=f&&N<=b?(C(n,{height:N+"px"}),e.options.boundary.height+=P,C(e.elements.boundary,{height:e.options.boundary.height+"px"}),e.options.viewport.height+=P,C(e.elements.viewport,{height:e.options.viewport.height+"px"})):s==="h"&&H>=f&&H<=g&&(C(n,{width:H+"px"}),e.options.boundary.width+=k,C(e.elements.boundary,{width:e.options.boundary.width+"px"}),e.options.viewport.width+=k,C(e.elements.viewport,{width:e.options.viewport.width+"px"})),ne.call(e),xe.call(e),ie.call(e),J.call(e),l=x,h=v}function w(){i=!1,window.removeEventListener("mousemove",d),window.removeEventListener("touchmove",d),window.removeEventListener("mouseup",w),window.removeEventListener("touchend",w),document.body.style[m]=""}y&&(y.addEventListener("mousedown",E),y.addEventListener("touchstart",E)),_&&(_.addEventListener("mousedown",E),_.addEventListener("touchstart",E)),this.elements.boundary.appendChild(n)}function G(e){if(this.options.enableZoom){var n=this.elements.zoomer,i=j(e,4);n.value=Math.max(parseFloat(n.min),Math.min(parseFloat(n.max),i)).toString()}}function vt(){var e=this,n=e.elements.zoomerWrap=document.createElement("div"),i=e.elements.zoomer=document.createElement("input");M(n,"cr-slider-wrap"),M(i,"cr-slider"),i.type="range",i.step="0.0001",i.value="1",i.style.display=e.options.showZoomer?"":"none",i.setAttribute("aria-label","zoom"),e.element.appendChild(n),n.appendChild(i),e._currentZoom=1;function s(){wt.call(e,{value:parseFloat(i.value),origin:new te(e.elements.preview),viewportRect:e.elements.viewport.getBoundingClientRect(),transform:z.parse(e.elements.preview)})}function h(l){var f,g;if(e.options.mouseWheelZoom==="ctrl"&&l.ctrlKey!==!0)return 0;l.wheelDelta?f=l.wheelDelta/1200:l.deltaY?f=l.deltaY/1060:l.detail?f=l.detail/-60:f=0,g=e._currentZoom+f*e._currentZoom,l.preventDefault(),G.call(e,g),s.call(e)}e.elements.zoomer.addEventListener("input",s),e.elements.zoomer.addEventListener("change",s),e.options.mouseWheelZoom&&(e.elements.boundary.addEventListener("mousewheel",h),e.elements.boundary.addEventListener("DOMMouseScroll",h))}function wt(e){var n=this,i=e?e.transform:z.parse(n.elements.preview),s=e?e.viewportRect:n.elements.viewport.getBoundingClientRect(),h=e?e.origin:new te(n.elements.preview);function l(){var y={};y[u]=i.toString(),y[a]=h.toString(),C(n.elements.preview,y)}if(n._currentZoom=e?e.value:n._currentZoom,i.scale=n._currentZoom,n.elements.zoomer.setAttribute("aria-valuenow",n._currentZoom),l(),n.options.enforceBoundary){var f=yt.call(n,s),g=f.translate,b=f.origin;i.x>=g.maxX&&(h.x=b.minX,i.x=g.maxX),i.x<=g.minX&&(h.x=b.maxX,i.x=g.minX),i.y>=g.maxY&&(h.y=b.minY,i.y=g.maxY),i.y<=g.minY&&(h.y=b.maxY,i.y=g.minY)}l(),_t.call(n),J.call(n)}function yt(e){var n=this,i=n._currentZoom,s=e.width,h=e.height,l=n.elements.boundary.clientWidth/2,f=n.elements.boundary.clientHeight/2,g=n.elements.preview.getBoundingClientRect(),b=g.width,y=g.height,_=s/2,E=h/2,d=(_/i-l)*-1,w=d-(b*(1/i)-s*(1/i)),p=(E/i-f)*-1,v=p-(y*(1/i)-h*(1/i)),x=1/i*_,A=b*(1/i)-x,k=1/i*E,P=y*(1/i)-k;return{translate:{maxX:d,minX:w,maxY:p,minY:v},origin:{maxX:A,minX:x,maxY:P,minY:k}}}function ie(e){var n=this,i=n._currentZoom,s=n.elements.preview.getBoundingClientRect(),h=n.elements.viewport.getBoundingClientRect(),l=z.parse(n.elements.preview.style[u]),f=new te(n.elements.preview),g=h.top-s.top+h.height/2,b=h.left-s.left+h.width/2,y={},_={};if(e){var E=f.x,d=f.y,w=l.x,p=l.y;y.y=E,y.x=d,l.y=w,l.x=p}else y.y=g/i,y.x=b/i,_.y=(y.y-f.y)*(1-i),_.x=(y.x-f.x)*(1-i),l.x-=_.x,l.y-=_.y;var v={};v[a]=y.x+"px "+y.y+"px",v[u]=l.toString(),C(n.elements.preview,v)}function bt(){var e=this,n=!1,i,s,h,l,f;function g(p,v){var x=e.elements.preview.getBoundingClientRect(),A=f.y+v,k=f.x+p;e.options.enforceBoundary?(l.top>x.top+v&&l.bottom<x.bottom+v&&(f.y=A),l.left>x.left+p&&l.right<x.right+p&&(f.x=k)):(f.y=A,f.x=k)}function b(p){e.elements.preview.setAttribute("aria-grabbed",p),e.elements.boundary.setAttribute("aria-dropeffect",p?"move":"none")}function y(p){var v=37,x=38,A=39,k=40;if(p.shiftKey&&(p.keyCode===x||p.keyCode===k)){var P;p.keyCode===x?P=parseFloat(e.elements.zoomer.value)+parseFloat(e.elements.zoomer.step):P=parseFloat(e.elements.zoomer.value)-parseFloat(e.elements.zoomer.step),e.setZoom(P)}else if(e.options.enableKeyMovement&&p.keyCode>=37&&p.keyCode<=40){p.preventDefault();var N=H(p.keyCode);f=z.parse(e.elements.preview),document.body.style[m]="none",l=e.elements.viewport.getBoundingClientRect(),_(N)}function H(Z){switch(Z){case v:return[1,0];case x:return[0,1];case A:return[-1,0];case k:return[0,-1]}}}function _(p){var v=p[0],x=p[1],A={};g(v,x),A[u]=f.toString(),C(e.elements.preview,A),ne.call(e),document.body.style[m]="",ie.call(e),J.call(e),h=0}function E(p){if(!(p.button!==void 0&&p.button!==0)&&(p.preventDefault(),!n)){if(n=!0,i=p.pageX,s=p.pageY,p.touches){var v=p.touches[0];i=v.pageX,s=v.pageY}b(n),f=z.parse(e.elements.preview),window.addEventListener("mousemove",d),window.addEventListener("touchmove",d),window.addEventListener("mouseup",w),window.addEventListener("touchend",w),document.body.style[m]="none",l=e.elements.viewport.getBoundingClientRect()}}function d(p){p.preventDefault();var v=p.pageX,x=p.pageY;if(p.touches){var A=p.touches[0];v=A.pageX,x=A.pageY}var k=v-i,P=x-s,N={};if(p.type==="touchmove"&&p.touches.length>1){var H=p.touches[0],Z=p.touches[1],re=Math.sqrt((H.pageX-Z.pageX)*(H.pageX-Z.pageX)+(H.pageY-Z.pageY)*(H.pageY-Z.pageY));h||(h=re/e._currentZoom);var zt=re/h;G.call(e,zt),U(e.elements.zoomer);return}g(k,P),N[u]=f.toString(),C(e.elements.preview,N),ne.call(e),s=x,i=v}function w(){n=!1,b(n),window.removeEventListener("mousemove",d),window.removeEventListener("touchmove",d),window.removeEventListener("mouseup",w),window.removeEventListener("touchend",w),document.body.style[m]="",ie.call(e),J.call(e),h=0}e.elements.overlay.addEventListener("mousedown",E),e.elements.viewport.addEventListener("keydown",y),e.elements.overlay.addEventListener("touchstart",E)}function ne(){if(this.elements){var e=this,n=e.elements.boundary.getBoundingClientRect(),i=e.elements.preview.getBoundingClientRect();C(e.elements.overlay,{width:i.width+"px",height:i.height+"px",top:i.top-n.top+"px",left:i.left-n.left+"px"})}}var _t=S(ne,500);function J(){var e=this,n=e.get();if(De.call(e))if(e.options.update.call(e,n),e.$&&typeof Prototype>"u")e.$(e.element).trigger("update.croppie",n);else{var i;window.CustomEvent?i=new CustomEvent("update",{detail:n}):(i=document.createEvent("CustomEvent"),i.initCustomEvent("update",!0,!0,n)),e.element.dispatchEvent(i)}}function De(){return this.elements.preview.offsetHeight>0&&this.elements.preview.offsetWidth>0}function _e(){var e=this,n=1,i={},s=e.elements.preview,h,l=new z(0,0,n),f=new te,g=De.call(e);!g||e.data.bound||(e.data.bound=!0,i[u]=l.toString(),i[a]=f.toString(),i.opacity=1,C(s,i),h=e.elements.preview.getBoundingClientRect(),e._originalImageWidth=h.width,e._originalImageHeight=h.height,e.data.orientation=be.call(e)?ye(e.elements.img):e.data.orientation,e.options.enableZoom?xe.call(e,!0):e._currentZoom=n,l.scale=e._currentZoom,i[u]=l.toString(),C(s,i),e.data.points.length?xt.call(e,e.data.points):$t.call(e),ie.call(e),ne.call(e))}function xe(e){var n=this,i=Math.max(n.options.minZoom,0)||0,s=n.options.maxZoom||1.5,h,l,f=n.elements.zoomer,g=parseFloat(f.value),b=n.elements.boundary.getBoundingClientRect(),y=Ie(n.elements.img,n.data.orientation),_=n.elements.viewport.getBoundingClientRect(),E,d;n.options.enforceBoundary&&(E=_.width/y.width,d=_.height/y.height,i=Math.max(E,d)),i>=s&&(s=i+1),f.min=j(i,4),f.max=j(s,4),!e&&(g<f.min||g>f.max)?G.call(n,g<f.min?f.min:f.max):e&&(l=Math.max(b.width/y.width,b.height/y.height),h=n.data.boundZoom!==null?n.data.boundZoom:l,G.call(n,h)),U(f)}function xt(e){if(e.length!==4)throw"Croppie - Invalid number of points supplied: "+e;var n=this,i=e[2]-e[0],s=n.elements.viewport.getBoundingClientRect(),h=n.elements.boundary.getBoundingClientRect(),l={left:s.left-h.left,top:s.top-h.top},f=s.width/i,g=e[1],b=e[0],y=-1*e[1]+l.top,_=-1*e[0]+l.left,E={};E[a]=b+"px "+g+"px",E[u]=new z(_,y,f).toString(),C(n.elements.preview,E),G.call(n,f),n._currentZoom=f}function $t(){var e=this,n=e.elements.preview.getBoundingClientRect(),i=e.elements.viewport.getBoundingClientRect(),s=e.elements.boundary.getBoundingClientRect(),h=i.left-s.left,l=i.top-s.top,f=h-(n.width-i.width)/2,g=l-(n.height-i.height)/2,b=new z(f,g,e._currentZoom);C(e.elements.preview,u,b.toString())}function Et(e){var n=this,i=n.elements.canvas,s=n.elements.img,h=i.getContext("2d");h.clearRect(0,0,i.width,i.height),i.width=s.width,i.height=s.height;var l=n.options.enableOrientation&&e||ye(s);Ze(i,s,l)}function $e(e){var n=this,i=e.points,s=F(i[0]),h=F(i[1]),l=F(i[2]),f=F(i[3]),g=l-s,b=f-h,y=e.circle,_=document.createElement("canvas"),E=_.getContext("2d"),d=0,w=0,p=e.outputWidth||g,v=e.outputHeight||b;_.width=p,_.height=v,e.backgroundColor&&(E.fillStyle=e.backgroundColor,E.fillRect(0,0,p,v));var x=s,A=h,k=g,P=b,N=0,H=0,Z=p,re=v;return s<0&&(x=0,N=Math.abs(s)/g*p),k+x>n._originalImageWidth&&(k=n._originalImageWidth-x,Z=k/g*p),h<0&&(A=0,H=Math.abs(h)/b*v),P+A>n._originalImageHeight&&(P=n._originalImageHeight-A,re=P/b*v),E.drawImage(this.elements.preview,x,A,k,P,N,H,Z,re),y&&(E.fillStyle="#fff",E.globalCompositeOperation="destination-in",E.beginPath(),E.arc(_.width/2,_.height/2,_.width/2,0,Math.PI*2,!0),E.closePath(),E.fill()),_}function Ct(e){var n=e.points,i=document.createElement("div"),s=document.createElement("img"),h=n[2]-n[0],l=n[3]-n[1];return M(i,"croppie-result"),i.appendChild(s),C(s,{left:-1*n[0]+"px",top:-1*n[1]+"px"}),s.src=e.url,C(i,{width:h+"px",height:l+"px"}),i}function At(e){return $e.call(this,e).toDataURL(e.format,e.quality)}function St(e){var n=this;return new Promise(function(i){$e.call(n,e).toBlob(function(s){i(s)},e.format,e.quality)})}function Rt(e){this.elements.img.parentNode&&(Array.prototype.forEach.call(this.elements.img.classList,function(n){e.classList.add(n)}),this.elements.img.parentNode.replaceChild(e,this.elements.img),this.elements.preview=e),this.elements.img=e}function We(e,n){var i=this,s,h=[],l=null,f=be.call(i);if(typeof e=="string")s=e,e={};else if(Array.isArray(e))h=e.slice();else{if(typeof e>"u"&&i.data.url)return _e.call(i),J.call(i),null;s=e.url,h=e.points||[],l=typeof e.zoom>"u"?null:e.zoom}return i.data.bound=!1,i.data.url=s||i.data.url,i.data.boundZoom=l,ut(s,f).then(function(g){if(Rt.call(i,g),h.length)i.options.relative&&(h=[h[0]*g.naturalWidth/100,h[1]*g.naturalHeight/100,h[2]*g.naturalWidth/100,h[3]*g.naturalHeight/100]);else{var b=Ie(g),y=i.elements.viewport.getBoundingClientRect(),_=y.width/y.height,E=b.width/b.height,d,w;E>_?(w=b.height,d=w*_):(d=b.width,w=b.height/_);var p=(b.width-d)/2,v=(b.height-w)/2,x=p+d,A=v+w;i.data.points=[p,v,x,A]}i.data.orientation=e.orientation||1,i.data.points=h.map(function(k){return parseFloat(k)}),i.options.useCanvas&&Et.call(i,i.data.orientation),_e.call(i),J.call(i),n&&n()})}function j(e,n){return parseFloat(e).toFixed(n||0)}function Be(){var e=this,n=e.elements.preview.getBoundingClientRect(),i=e.elements.viewport.getBoundingClientRect(),s=i.left-n.left,h=i.top-n.top,l=(i.width-e.elements.viewport.offsetWidth)/2,f=(i.height-e.elements.viewport.offsetHeight)/2,g=s+e.elements.viewport.offsetWidth+l,b=h+e.elements.viewport.offsetHeight+f,y=e._currentZoom;(y===1/0||isNaN(y))&&(y=1);var _=e.options.enforceBoundary?0:Number.NEGATIVE_INFINITY;return s=Math.max(_,s/y),h=Math.max(_,h/y),g=Math.max(_,g/y),b=Math.max(_,b/y),{points:[j(s),j(h),j(g),j(b)],zoom:y,orientation:e.data.orientation}}var kt={type:"canvas",format:"png",quality:1},Pt=["jpeg","webp","png"];function Lt(e){var n=this,i=Be.call(n),s=R(O(kt),O(e)),h=typeof e=="string"?e:s.type||"base64",l=s.size||"viewport",f=s.format,g=s.quality,b=s.backgroundColor,y=typeof s.circle=="boolean"?s.circle:n.options.viewport.type==="circle",_=n.elements.viewport.getBoundingClientRect(),E=_.width/_.height,d;return l==="viewport"?(i.outputWidth=_.width,i.outputHeight=_.height):typeof l=="object"&&(l.width&&l.height?(i.outputWidth=l.width,i.outputHeight=l.height):l.width?(i.outputWidth=l.width,i.outputHeight=l.width/E):l.height&&(i.outputWidth=l.height*E,i.outputHeight=l.height)),Pt.indexOf(f)>-1&&(i.format="image/"+f,i.quality=g),i.circle=y,i.url=n.data.url,i.backgroundColor=b,d=new Promise(function(w){switch(h.toLowerCase()){case"rawcanvas":w($e.call(n,i));break;case"canvas":case"base64":w(At.call(n,i));break;case"blob":St.call(n,i).then(w);break;default:w(Ct.call(n,i));break}}),d}function Ot(){_e.call(this)}function Mt(e){if(!this.options.useCanvas||!this.options.enableOrientation)throw"Croppie: Cannot rotate without enableOrientation && EXIF.js included";var n=this,i=n.elements.canvas;if(n.data.orientation=$(n.data.orientation,e),Ze(i,n.elements.img,n.data.orientation),ie.call(n,!0),xe.call(n),Math.abs(e)/90%2===1){var s=n._originalImageHeight,h=n._originalImageWidth;n._originalImageWidth=s,n._originalImageHeight=h}}function Tt(){var e=this;e.element.removeChild(e.elements.boundary),pt(e.element,"croppie-container"),e.options.enableZoom&&e.element.removeChild(e.elements.zoomerWrap),delete e.elements}if(typeof window<"u"&&window.jQuery){var X=window.jQuery;X.fn.croppie=function(e){var n=typeof e;if(n==="string"){var i=Array.prototype.slice.call(arguments,1),s=X(this).data("croppie");return e==="get"?s.get():e==="result"?s.result.apply(s,i):e==="bind"?s.bind.apply(s,i):this.each(function(){var h=X(this).data("croppie");if(h){var l=h[e];if(X.isFunction(l))l.apply(h,i),e==="destroy"&&X(this).removeData("croppie");else throw"Croppie "+e+" method not found"}})}else return this.each(function(){var h=new I(this,e);h.$=X,X(this).data("croppie",h)})}}function I(e,n){if(e.className.indexOf("croppie-container")>-1)throw new Error("Croppie: Can't initialize croppie more than once");if(this.element=e,this.options=R(O(I.defaults),n),this.element.tagName.toLowerCase()==="img"){var i=this.element;M(i,"cr-original-image"),Ue(i,{"aria-hidden":"true",alt:""});var s=document.createElement("div");this.element.parentNode.appendChild(s),s.appendChild(i),this.element=s,this.options.url=this.options.url||i.src}if(mt.call(this),this.options.url){var h={url:this.options.url,points:this.options.points};delete this.options.url,delete this.options.points,We.call(this,h)}}return I.defaults={viewport:{width:100,height:100,type:"square"},boundary:{},orientationControls:{enabled:!0,leftClass:"",rightClass:""},resizeControls:{width:!0,height:!0},customClass:"",showZoomer:!0,enableZoom:!0,enableResize:!1,mouseWheelZoom:!0,enableExif:!1,enforceBoundary:!0,enableOrientation:!1,enableKeyMovement:!0,update:function(){}},I.globals={translate:"translate3d"},R(I.prototype,{bind:function(e,n){return We.call(this,e,n)},get:function(){var e=Be.call(this),n=e.points;return this.options.relative&&(n[0]/=this.elements.img.naturalWidth/100,n[1]/=this.elements.img.naturalHeight/100,n[2]/=this.elements.img.naturalWidth/100,n[3]/=this.elements.img.naturalHeight/100),e},result:function(e){return Lt.call(this,e)},refresh:function(){return Ot.call(this)},setZoom:function(e){G.call(this,e),U(this.elements.zoomer)},rotate:function(e){Mt.call(this,e)},destroy:function(){return Tt.call(this)}}),I})});var fe=globalThis,me=fe.ShadowRoot&&(fe.ShadyCSS===void 0||fe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ee=Symbol(),je=new WeakMap,oe=class{constructor(t,r,o){if(this._$cssResult$=!0,o!==Ee)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(me&&t===void 0){let o=r!==void 0&&r.length===1;o&&(t=je.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&je.set(r,t))}return t}toString(){return this.cssText}},Xe=c=>new oe(typeof c=="string"?c:c+"",void 0,Ee),se=(c,...t)=>{let r=c.length===1?c[0]:t.reduce((o,a,u)=>o+(m=>{if(m._$cssResult$===!0)return m.cssText;if(typeof m=="number")return m;throw Error("Value passed to 'css' function must be a 'css' function result: "+m+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+c[u+1],c[0]);return new oe(r,c,Ee)},Ye=(c,t)=>{if(me)c.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(let r of t){let o=document.createElement("style"),a=fe.litNonce;a!==void 0&&o.setAttribute("nonce",a),o.textContent=r.cssText,c.appendChild(o)}},Ce=me?c=>c:c=>c instanceof CSSStyleSheet?(t=>{let r="";for(let o of t.cssRules)r+=o.cssText;return Xe(r)})(c):c;var{is:Ft,defineProperty:jt,getOwnPropertyDescriptor:Xt,getOwnPropertyNames:Yt,getOwnPropertySymbols:qt,getPrototypeOf:Vt}=Object,ge=globalThis,qe=ge.trustedTypes,Kt=qe?qe.emptyScript:"",Gt=ge.reactiveElementPolyfillSupport,ae=(c,t)=>c,Ae={toAttribute(c,t){switch(t){case Boolean:c=c?Kt:null;break;case Object:case Array:c=c==null?c:JSON.stringify(c)}return c},fromAttribute(c,t){let r=c;switch(t){case Boolean:r=c!==null;break;case Number:r=c===null?null:Number(c);break;case Object:case Array:try{r=JSON.parse(c)}catch{r=null}}return r}},Ke=(c,t)=>!Ft(c,t),Ve={attribute:!0,type:String,converter:Ae,reflect:!1,useDefault:!1,hasChanged:Ke};Symbol.metadata??=Symbol("metadata"),ge.litPropertyMetadata??=new WeakMap;var D=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,r=Ve){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(t,r),!r.noAccessor){let o=Symbol(),a=this.getPropertyDescriptor(t,o,r);a!==void 0&&jt(this.prototype,t,a)}}static getPropertyDescriptor(t,r,o){let{get:a,set:u}=Xt(this.prototype,t)??{get(){return this[r]},set(m){this[r]=m}};return{get:a,set(m){let L=a?.call(this);u?.call(this,m),this.requestUpdate(t,L,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ve}static _$Ei(){if(this.hasOwnProperty(ae("elementProperties")))return;let t=Vt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ae("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ae("properties"))){let r=this.properties,o=[...Yt(r),...qt(r)];for(let a of o)this.createProperty(a,r[a])}let t=this[Symbol.metadata];if(t!==null){let r=litPropertyMetadata.get(t);if(r!==void 0)for(let[o,a]of r)this.elementProperties.set(o,a)}this._$Eh=new Map;for(let[r,o]of this.elementProperties){let a=this._$Eu(r,o);a!==void 0&&this._$Eh.set(a,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let a of o)r.unshift(Ce(a))}else t!==void 0&&r.push(Ce(t));return r}static _$Eu(t,r){let o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,r=this.constructor.elementProperties;for(let o of r.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ye(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,r,o){this._$AK(t,o)}_$ET(t,r){let o=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,o);if(a!==void 0&&o.reflect===!0){let u=(o.converter?.toAttribute!==void 0?o.converter:Ae).toAttribute(r,o.type);this._$Em=t,u==null?this.removeAttribute(a):this.setAttribute(a,u),this._$Em=null}}_$AK(t,r){let o=this.constructor,a=o._$Eh.get(t);if(a!==void 0&&this._$Em!==a){let u=o.getPropertyOptions(a),m=typeof u.converter=="function"?{fromAttribute:u.converter}:u.converter?.fromAttribute!==void 0?u.converter:Ae;this._$Em=a,this[a]=m.fromAttribute(r,u.type)??this._$Ej?.get(a)??null,this._$Em=null}}requestUpdate(t,r,o){if(t!==void 0){let a=this.constructor,u=this[t];if(o??=a.getPropertyOptions(t),!((o.hasChanged??Ke)(u,r)||o.useDefault&&o.reflect&&u===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,o))))return;this.C(t,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,r,{useDefault:o,reflect:a,wrapped:u},m){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,m??r??this[t]),u!==!0||m!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(r=void 0),this._$AL.set(t,r)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,u]of this._$Ep)this[a]=u;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[a,u]of o){let{wrapped:m}=u,L=this[a];m!==!0||this._$AL.has(a)||L===void 0||this.C(a,void 0,u,L)}}let t=!1,r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(r)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(r)}willUpdate(t){}_$AE(t){this._$EO?.forEach(r=>r.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(r=>this._$ET(r,this[r])),this._$EM()}updated(t){}firstUpdated(t){}};D.elementStyles=[],D.shadowRootOptions={mode:"open"},D[ae("elementProperties")]=new Map,D[ae("finalized")]=new Map,Gt?.({ReactiveElement:D}),(ge.reactiveElementVersions??=[]).push("2.1.0");var Me=globalThis,ve=Me.trustedTypes,Ge=ve?ve.createPolicy("lit-html",{createHTML:c=>c}):void 0,nt="$lit$",W=`lit$${Math.random().toFixed(9).slice(2)}$`,rt="?"+W,Jt=`<${rt}>`,V=document,he=()=>V.createComment(""),ce=c=>c===null||typeof c!="object"&&typeof c!="function",Te=Array.isArray,Qt=c=>Te(c)||typeof c?.[Symbol.iterator]=="function",Se=`[ 	
\f\r]`,le=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Je=/-->/g,Qe=/>/g,Y=RegExp(`>|${Se}(?:([^\\s"'>=/]+)(${Se}*=${Se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),et=/'/g,tt=/"/g,ot=/^(?:script|style|textarea|title)$/i,ze=c=>(t,...r)=>({_$litType$:c,strings:t,values:r}),st=ze(1),li=ze(2),hi=ze(3),K=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),it=new WeakMap,q=V.createTreeWalker(V,129);function at(c,t){if(!Te(c)||!c.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ge!==void 0?Ge.createHTML(t):t}var ei=(c,t)=>{let r=c.length-1,o=[],a,u=t===2?"<svg>":t===3?"<math>":"",m=le;for(let L=0;L<r;L++){let $=c[L],R,O,S=-1,U=0;for(;U<$.length&&(m.lastIndex=U,O=m.exec($),O!==null);)U=m.lastIndex,m===le?O[1]==="!--"?m=Je:O[1]!==void 0?m=Qe:O[2]!==void 0?(ot.test(O[2])&&(a=RegExp("</"+O[2],"g")),m=Y):O[3]!==void 0&&(m=Y):m===Y?O[0]===">"?(m=a??le,S=-1):O[1]===void 0?S=-2:(S=m.lastIndex-O[2].length,R=O[1],m=O[3]===void 0?Y:O[3]==='"'?tt:et):m===tt||m===et?m=Y:m===Je||m===Qe?m=le:(m=Y,a=void 0);let C=m===Y&&c[L+1].startsWith("/>")?" ":"";u+=m===le?$+Jt:S>=0?(o.push(R),$.slice(0,S)+nt+$.slice(S)+W+C):$+W+(S===-2?L:C)}return[at(c,u+(c[r]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},de=class c{constructor({strings:t,_$litType$:r},o){let a;this.parts=[];let u=0,m=0,L=t.length-1,$=this.parts,[R,O]=ei(t,r);if(this.el=c.createElement(R,o),q.currentNode=this.el.content,r===2||r===3){let S=this.el.content.firstChild;S.replaceWith(...S.childNodes)}for(;(a=q.nextNode())!==null&&$.length<L;){if(a.nodeType===1){if(a.hasAttributes())for(let S of a.getAttributeNames())if(S.endsWith(nt)){let U=O[m++],C=a.getAttribute(S).split(W),M=/([.?@])?(.*)/.exec(U);$.push({type:1,index:u,name:M[2],strings:C,ctor:M[1]==="."?ke:M[1]==="?"?Pe:M[1]==="@"?Le:ee}),a.removeAttribute(S)}else S.startsWith(W)&&($.push({type:6,index:u}),a.removeAttribute(S));if(ot.test(a.tagName)){let S=a.textContent.split(W),U=S.length-1;if(U>0){a.textContent=ve?ve.emptyScript:"";for(let C=0;C<U;C++)a.append(S[C],he()),q.nextNode(),$.push({type:2,index:++u});a.append(S[U],he())}}}else if(a.nodeType===8)if(a.data===rt)$.push({type:2,index:u});else{let S=-1;for(;(S=a.data.indexOf(W,S+1))!==-1;)$.push({type:7,index:u}),S+=W.length-1}u++}}static createElement(t,r){let o=V.createElement("template");return o.innerHTML=t,o}};function Q(c,t,r=c,o){if(t===K)return t;let a=o!==void 0?r._$Co?.[o]:r._$Cl,u=ce(t)?void 0:t._$litDirective$;return a?.constructor!==u&&(a?._$AO?.(!1),u===void 0?a=void 0:(a=new u(c),a._$AT(c,r,o)),o!==void 0?(r._$Co??=[])[o]=a:r._$Cl=a),a!==void 0&&(t=Q(c,a._$AS(c,t.values),a,o)),t}var Re=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:r},parts:o}=this._$AD,a=(t?.creationScope??V).importNode(r,!0);q.currentNode=a;let u=q.nextNode(),m=0,L=0,$=o[0];for(;$!==void 0;){if(m===$.index){let R;$.type===2?R=new pe(u,u.nextSibling,this,t):$.type===1?R=new $.ctor(u,$.name,$.strings,this,t):$.type===6&&(R=new Oe(u,this,t)),this._$AV.push(R),$=o[++L]}m!==$?.index&&(u=q.nextNode(),m++)}return q.currentNode=V,a}p(t){let r=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,r),r+=o.strings.length-2):o._$AI(t[r])),r++}},pe=class c{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,r,o,a){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=o,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=Q(this,t,r),ce(t)?t===T||t==null||t===""?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==K&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Qt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==T&&ce(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){let{values:r,_$litType$:o}=t,a=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=de.createElement(at(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===a)this._$AH.p(r);else{let u=new Re(a,this),m=u.u(this.options);u.p(r),this.T(m),this._$AH=u}}_$AC(t){let r=it.get(t.strings);return r===void 0&&it.set(t.strings,r=new de(t)),r}k(t){Te(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,o,a=0;for(let u of t)a===r.length?r.push(o=new c(this.O(he()),this.O(he()),this,this.options)):o=r[a],o._$AI(u),a++;a<r.length&&(this._$AR(o&&o._$AB.nextSibling,a),r.length=a)}_$AR(t=this._$AA.nextSibling,r){for(this._$AP?.(!1,!0,r);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ee=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,r,o,a,u){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=r,this._$AM=a,this.options=u,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=T}_$AI(t,r=this,o,a){let u=this.strings,m=!1;if(u===void 0)t=Q(this,t,r,0),m=!ce(t)||t!==this._$AH&&t!==K,m&&(this._$AH=t);else{let L=t,$,R;for(t=u[0],$=0;$<u.length-1;$++)R=Q(this,L[o+$],r,$),R===K&&(R=this._$AH[$]),m||=!ce(R)||R!==this._$AH[$],R===T?t=T:t!==T&&(t+=(R??"")+u[$+1]),this._$AH[$]=R}m&&!a&&this.j(t)}j(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ke=class extends ee{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===T?void 0:t}},Pe=class extends ee{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==T)}},Le=class extends ee{constructor(t,r,o,a,u){super(t,r,o,a,u),this.type=5}_$AI(t,r=this){if((t=Q(this,t,r,0)??T)===K)return;let o=this._$AH,a=t===T&&o!==T||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,u=t!==T&&(o===T||a);a&&this.element.removeEventListener(this.name,this,o),u&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Oe=class{constructor(t,r,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}};var ti=Me.litHtmlPolyfillSupport;ti?.(de,pe),(Me.litHtmlVersions??=[]).push("3.3.0");var lt=(c,t,r)=>{let o=r?.renderBefore??t,a=o._$litPart$;if(a===void 0){let u=r?.renderBefore??null;o._$litPart$=a=new pe(t.insertBefore(he(),u),u,void 0,r??{})}return a._$AI(c),a};var He=globalThis,B=class extends D{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=lt(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}};B._$litElement$=!0,B.finalized=!0,He.litElementHydrateSupport?.({LitElement:B});var ii=He.litElementPolyfillSupport;ii?.({LitElement:B});(He.litElementVersions??=[]).push("4.2.0");var dt=Bt(ht(),1);var ct=se`
    .croppie-container {
        width: 100%;
        height: 100%;
    }

    .croppie-container .cr-image {
        z-index: -1;
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;
        max-height: none;
        max-width: none;
    }

    .croppie-container .cr-boundary {
        position: relative;
        overflow: hidden;
        margin: 0 auto;
        z-index: 1;
        width: 100%;
        height: 100%;
    }

    .croppie-container .cr-viewport,
    .croppie-container .cr-resizer {
        position: absolute;
        border: 2px solid #fff;
        margin: auto;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        box-shadow: 0 0 2000px 2000px rgba(0, 0, 0, 0.5);
        z-index: 0;
    }

    .croppie-container .cr-resizer {
        z-index: 2;
        box-shadow: none;
        pointer-events: none;
    }

    .croppie-container .cr-resizer-vertical,
    .croppie-container .cr-resizer-horisontal {
        position: absolute;
        pointer-events: all;
    }

    .croppie-container .cr-resizer-vertical::after,
    .croppie-container .cr-resizer-horisontal::after {
        display: block;
        position: absolute;
        box-sizing: border-box;
        border: 1px solid black;
        background: #fff;
        width: 10px;
        height: 10px;
        content: '';
    }

    .croppie-container .cr-resizer-vertical {
        bottom: -5px;
        cursor: row-resize;
        width: 100%;
        height: 10px;
    }

    .croppie-container .cr-resizer-vertical::after {
        left: 50%;
        margin-left: -5px;
    }

    .croppie-container .cr-resizer-horisontal {
        right: -5px;
        cursor: col-resize;
        width: 10px;
        height: 100%;
    }

    .croppie-container .cr-resizer-horisontal::after {
        top: 50%;
        margin-top: -5px;
    }

    .croppie-container .cr-original-image {
        display: none;
    }

    .croppie-container .cr-vp-circle {
        border-radius: 50%;
    }

    .croppie-container .cr-overlay {
        z-index: 1;
        position: absolute;
        cursor: move;
        touch-action: none;
    }

    .croppie-container .cr-slider-wrap {
        width: 75%;
        margin: 15px auto;
        text-align: center;
    }

    .croppie-result {
        position: relative;
        overflow: hidden;
    }

    .croppie-result img {
        position: absolute;
    }

    .croppie-container .cr-image,
    .croppie-container .cr-overlay,
    .croppie-container .cr-viewport {
        -webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
    }

    /*************************************/
    /***** STYLING RANGE INPUT ***********/
    /*************************************/
    /*http://brennaobrien.com/blog/2014/05/style-input-type-range-in-every-browser.html */
    /*************************************/

    .cr-slider {
        -webkit-appearance: none;
        /*removes default webkit styles*/
        /*border: 1px solid white; *//*fix for FF unable to apply focus style bug */
        width: 300px;
        /*required for proper track sizing in FF*/
        max-width: 100%;
        padding-top: 8px;
        padding-bottom: 8px;
        background-color: transparent;
    }

    .cr-slider::-webkit-slider-runnable-track {
        width: 100%;
        height: 3px;
        background: rgba(0, 0, 0, 0.5);
        border: 0;
        border-radius: 3px;
    }

    .cr-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #ddd;
        margin-top: -6px;
    }

    .cr-slider:focus {
        outline: none;
    }

    /*
    .cr-slider:focus::-webkit-slider-runnable-track {
    background: #ccc;
    }
    */

    .cr-slider::-moz-range-track {
        width: 100%;
        height: 3px;
        background: rgba(0, 0, 0, 0.5);
        border: 0;
        border-radius: 3px;
    }

    .cr-slider::-moz-range-thumb {
        border: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #ddd;
        margin-top: -6px;
    }

    /*hide the outline behind the border*/

    .cr-slider:-moz-focusring {
        outline: 1px solid white;
        outline-offset: -1px;
    }

    .cr-slider::-ms-track {
        width: 100%;
        height: 5px;
        background: transparent;
        /*remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead */
        border-color: transparent; /*leave room for the larger thumb to overflow with a transparent border */
        border-width: 6px 0;
        color: transparent; /*remove default tick marks*/
    }

    .cr-slider::-ms-fill-lower {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 10px;
    }

    .cr-slider::-ms-fill-upper {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 10px;
    }

    .cr-slider::-ms-thumb {
        border: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #ddd;
        margin-top: 1px;
    }

    .cr-slider:focus::-ms-fill-lower {
        background: rgba(0, 0, 0, 0.5);
    }

    .cr-slider:focus::-ms-fill-upper {
        background: rgba(0, 0, 0, 0.5);
    }

    /*******************************************/

    /***********************************/
    /* Rotation Tools */
    /***********************************/

    .cr-rotate-controls {
        position: absolute;
        bottom: 5px;
        left: 5px;
        z-index: 1;
    }

    .cr-rotate-controls button {
        border: 0;
        background: none;
    }

    .cr-rotate-controls i:before {
        display: inline-block;
        font-style: normal;
        font-weight: 900;
        font-size: 22px;
    }

    .cr-rotate-l i:before {
        content: '↺';
    }

    .cr-rotate-r i:before {
        content: '↻';
    }
`;var Ne=class extends B{static get properties(){return{width:{type:Number,attribute:!0},height:{type:Number,attribute:!0}}}constructor(){super(),this.width=400,this.height=400}static styles=[ct,se`
        .dialog {
            width: 500px;
        }

        .dialog__content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 1rem;
        }

        .dialog__body {
            width: 500px;
            height: 500px;
        }

        .dialog__actions {
            display: flex;
            gap: 0.5rem;
            width: 100%;
            justify-content: flex-end;
            align-items: center;
        }
        
        .cr-slider-wrap {
            visibility: hidden;
        }
    `];render(){return st`
        <slot @change="${this.handleChange}"></slot>
        
        <dialog class="dialog" part="dialog">
            <div class="dialog__content">
                <div class="dialog__body"></div>
                <div class="dialog__actions">
                    <button @click="${this.handleCancel}" part="button cancel"><slot name="label-cancel">Cancel</slot></button>
                    <button @click="${this.handleConfirm}" part="button confirm"><slot name="label-confirm">Confirm</slot></button>
                </div>
            </div>
        </dialog>
    `}firstUpdated(){let t=400/Math.max(this.width,this.height);this._croppie=new dt.default(this.renderRoot.querySelector(".dialog__body"),{viewport:{width:this.width*t,height:this.height*t,type:"square",showZoomer:!1}})}handleChange(t){let r=this.renderRoot.querySelector("dialog");t.target.files!==0&&(this._file=t.target.files[0],r.showModal(),this._croppie.bind({url:URL.createObjectURL(this._file)}))}handleCancel(t){t.preventDefault(),this.renderRoot.querySelector("slot").assignedElements().forEach(r=>{r.value=""}),this.renderRoot.querySelector("dialog")?.close()}handleConfirm(t){t.preventDefault();let r={type:"rawcanvas",size:"original",format:"png",quality:1,circle:!1};this._croppie.result(r).then(o=>{(o.width>this.width||o.height>this.height)&&this.rescaleCanvas(o),o.toBlob(a=>{let u=this._file.name?this._file.name.split(".").slice(0,-1).join("."):"image",m=new File([a],u+".png",{type:"image/png"}),L=this.renderRoot.querySelector("slot").assignedElements()[0],$=new DataTransfer;$.items.add(m),L.files=$.files,this.renderRoot.querySelector("dialog").close()})})}rescaleCanvas(t){let r=t.getContext("2d"),o=document.createElement("canvas"),a=o.getContext("2d");o.width=this.width,o.height=this.height,a.drawImage(t,0,0,this.width,this.height),t.width=this.width,t.height=this.height,r.drawImage(o,0,0)}};customElements.define("image-crop-dialog",Ne);})();
/*! Bundled license information:

croppie/croppie.js:
  (*! promise-polyfill 3.1.0 *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
