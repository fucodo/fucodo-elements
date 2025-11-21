(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/croppie/croppie.js
  var require_croppie = __commonJS({
    "node_modules/croppie/croppie.js"(exports, module) {
      (function(root, factory) {
        if (typeof define === "function" && define.amd) {
          define(factory);
        } else if (typeof exports === "object" && typeof exports.nodeName !== "string") {
          module.exports = factory();
        } else {
          root.Croppie = factory();
        }
      })(typeof self !== "undefined" ? self : exports, function() {
        if (typeof Promise !== "function") {
          !(function(a3) {
            function b3(a4, b4) {
              return function() {
                a4.apply(b4, arguments);
              };
            }
            function c4(a4) {
              if ("object" !== typeof this) throw new TypeError("Promises must be constructed via new");
              if ("function" !== typeof a4) throw new TypeError("not a function");
              this._state = null, this._value = null, this._deferreds = [], i5(a4, b3(e4, this), b3(f3, this));
            }
            function d3(a4) {
              var b4 = this;
              return null === this._state ? void this._deferreds.push(a4) : void k2(function() {
                var c5 = b4._state ? a4.onFulfilled : a4.onRejected;
                if (null === c5) return void (b4._state ? a4.resolve : a4.reject)(b4._value);
                var d4;
                try {
                  d4 = c5(b4._value);
                } catch (e5) {
                  return void a4.reject(e5);
                }
                a4.resolve(d4);
              });
            }
            function e4(a4) {
              try {
                if (a4 === this) throw new TypeError("A promise cannot be resolved with itself.");
                if (a4 && ("object" === typeof a4 || "function" === typeof a4)) {
                  var c5 = a4.then;
                  if ("function" === typeof c5) return void i5(b3(c5, a4), b3(e4, this), b3(f3, this));
                }
                this._state = true, this._value = a4, g2.call(this);
              } catch (d4) {
                f3.call(this, d4);
              }
            }
            function f3(a4) {
              this._state = false, this._value = a4, g2.call(this);
            }
            function g2() {
              for (var a4 = 0, b4 = this._deferreds.length; b4 > a4; a4++) d3.call(this, this._deferreds[a4]);
              this._deferreds = null;
            }
            function h3(a4, b4, c5, d4) {
              this.onFulfilled = "function" === typeof a4 ? a4 : null, this.onRejected = "function" === typeof b4 ? b4 : null, this.resolve = c5, this.reject = d4;
            }
            function i5(a4, b4, c5) {
              var d4 = false;
              try {
                a4(function(a5) {
                  d4 || (d4 = true, b4(a5));
                }, function(a5) {
                  d4 || (d4 = true, c5(a5));
                });
              } catch (e5) {
                if (d4) return;
                d4 = true, c5(e5);
              }
            }
            var j2 = setTimeout, k2 = "function" === typeof setImmediate && setImmediate || function(a4) {
              j2(a4, 1);
            }, l3 = Array.isArray || function(a4) {
              return "[object Array]" === Object.prototype.toString.call(a4);
            };
            c4.prototype["catch"] = function(a4) {
              return this.then(null, a4);
            }, c4.prototype.then = function(a4, b4) {
              var e5 = this;
              return new c4(function(c5, f4) {
                d3.call(e5, new h3(a4, b4, c5, f4));
              });
            }, c4.all = function() {
              var a4 = Array.prototype.slice.call(1 === arguments.length && l3(arguments[0]) ? arguments[0] : arguments);
              return new c4(function(b4, c5) {
                function d4(f5, g3) {
                  try {
                    if (g3 && ("object" === typeof g3 || "function" === typeof g3)) {
                      var h4 = g3.then;
                      if ("function" === typeof h4) return void h4.call(g3, function(a5) {
                        d4(f5, a5);
                      }, c5);
                    }
                    a4[f5] = g3, 0 === --e5 && b4(a4);
                  } catch (i6) {
                    c5(i6);
                  }
                }
                if (0 === a4.length) return b4([]);
                for (var e5 = a4.length, f4 = 0; f4 < a4.length; f4++) d4(f4, a4[f4]);
              });
            }, c4.resolve = function(a4) {
              return a4 && "object" === typeof a4 && a4.constructor === c4 ? a4 : new c4(function(b4) {
                b4(a4);
              });
            }, c4.reject = function(a4) {
              return new c4(function(b4, c5) {
                c5(a4);
              });
            }, c4.race = function(a4) {
              return new c4(function(b4, c5) {
                for (var d4 = 0, e5 = a4.length; e5 > d4; d4++) a4[d4].then(b4, c5);
              });
            }, c4._setImmediateFn = function(a4) {
              k2 = a4;
            }, "undefined" !== typeof module && module.exports ? module.exports = c4 : a3.Promise || (a3.Promise = c4);
          })(this);
        }
        if (typeof window !== "undefined" && typeof window.CustomEvent !== "function") {
          (function() {
            function CustomEvent2(event, params) {
              params = params || { bubbles: false, cancelable: false, detail: void 0 };
              var evt = document.createEvent("CustomEvent");
              evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
              return evt;
            }
            CustomEvent2.prototype = window.Event.prototype;
            window.CustomEvent = CustomEvent2;
          })();
        }
        if (typeof HTMLCanvasElement !== "undefined" && !HTMLCanvasElement.prototype.toBlob) {
          Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
            value: function(callback, type, quality) {
              var binStr = atob(this.toDataURL(type, quality).split(",")[1]), len = binStr.length, arr = new Uint8Array(len);
              for (var i5 = 0; i5 < len; i5++) {
                arr[i5] = binStr.charCodeAt(i5);
              }
              callback(new Blob([arr], { type: type || "image/png" }));
            }
          });
        }
        var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyles = typeof document !== "undefined" ? document.createElement("div").style : {}, EXIF_NORM = [1, 8, 3, 6], EXIF_FLIP = [2, 7, 4, 5], CSS_TRANS_ORG, CSS_TRANSFORM, CSS_USERSELECT;
        function vendorPrefix(prop) {
          if (prop in emptyStyles) {
            return prop;
          }
          var capProp = prop[0].toUpperCase() + prop.slice(1), i5 = cssPrefixes.length;
          while (i5--) {
            prop = cssPrefixes[i5] + capProp;
            if (prop in emptyStyles) {
              return prop;
            }
          }
        }
        CSS_TRANSFORM = vendorPrefix("transform");
        CSS_TRANS_ORG = vendorPrefix("transformOrigin");
        CSS_USERSELECT = vendorPrefix("userSelect");
        function getExifOffset(ornt, rotate) {
          var arr = EXIF_NORM.indexOf(ornt) > -1 ? EXIF_NORM : EXIF_FLIP, index = arr.indexOf(ornt), offset = rotate / 90 % arr.length;
          return arr[(arr.length + index + offset % arr.length) % arr.length];
        }
        function deepExtend(destination, source) {
          destination = destination || {};
          for (var property in source) {
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
              destination[property] = destination[property] || {};
              deepExtend(destination[property], source[property]);
            } else {
              destination[property] = source[property];
            }
          }
          return destination;
        }
        function clone(object) {
          return deepExtend({}, object);
        }
        function debounce(func, wait, immediate) {
          var timeout;
          return function() {
            var context = this, args = arguments;
            var later = function() {
              timeout = null;
              if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
          };
        }
        function dispatchChange(element) {
          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            element.dispatchEvent(evt);
          } else {
            element.fireEvent("onchange");
          }
        }
        function css(el, styles, val) {
          if (typeof styles === "string") {
            var tmp = styles;
            styles = {};
            styles[tmp] = val;
          }
          for (var prop in styles) {
            el.style[prop] = styles[prop];
          }
        }
        function addClass(el, c4) {
          if (el.classList) {
            el.classList.add(c4);
          } else {
            el.className += " " + c4;
          }
        }
        function removeClass(el, c4) {
          if (el.classList) {
            el.classList.remove(c4);
          } else {
            el.className = el.className.replace(c4, "");
          }
        }
        function setAttributes(el, attrs) {
          for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
          }
        }
        function num(v2) {
          return parseInt(v2, 10);
        }
        function loadImage(src, doExif) {
          if (!src) {
            throw "Source image missing";
          }
          var img = new Image();
          img.style.opacity = "0";
          return new Promise(function(resolve, reject) {
            function _resolve() {
              img.style.opacity = "1";
              setTimeout(function() {
                resolve(img);
              }, 1);
            }
            img.removeAttribute("crossOrigin");
            if (src.match(/^https?:\/\/|^\/\//)) {
              img.setAttribute("crossOrigin", "anonymous");
            }
            img.onload = function() {
              if (doExif) {
                EXIF.getData(img, function() {
                  _resolve();
                });
              } else {
                _resolve();
              }
            };
            img.onerror = function(ev) {
              img.style.opacity = 1;
              setTimeout(function() {
                reject(ev);
              }, 1);
            };
            img.src = src;
          });
        }
        function naturalImageDimensions(img, ornt) {
          var w2 = img.naturalWidth;
          var h3 = img.naturalHeight;
          var orient = ornt || getExifOrientation(img);
          if (orient && orient >= 5) {
            var x2 = w2;
            w2 = h3;
            h3 = x2;
          }
          return { width: w2, height: h3 };
        }
        var TRANSLATE_OPTS = {
          "translate3d": {
            suffix: ", 0px"
          },
          "translate": {
            suffix: ""
          }
        };
        var Transform = function(x2, y3, scale) {
          this.x = parseFloat(x2);
          this.y = parseFloat(y3);
          this.scale = parseFloat(scale);
        };
        Transform.parse = function(v2) {
          if (v2.style) {
            return Transform.parse(v2.style[CSS_TRANSFORM]);
          } else if (v2.indexOf("matrix") > -1 || v2.indexOf("none") > -1) {
            return Transform.fromMatrix(v2);
          } else {
            return Transform.fromString(v2);
          }
        };
        Transform.fromMatrix = function(v2) {
          var vals = v2.substring(7).split(",");
          if (!vals.length || v2 === "none") {
            vals = [1, 0, 0, 1, 0, 0];
          }
          return new Transform(num(vals[4]), num(vals[5]), parseFloat(vals[0]));
        };
        Transform.fromString = function(v2) {
          var values = v2.split(") "), translate = values[0].substring(Croppie2.globals.translate.length + 1).split(","), scale = values.length > 1 ? values[1].substring(6) : 1, x2 = translate.length > 1 ? translate[0] : 0, y3 = translate.length > 1 ? translate[1] : 0;
          return new Transform(x2, y3, scale);
        };
        Transform.prototype.toString = function() {
          var suffix = TRANSLATE_OPTS[Croppie2.globals.translate].suffix || "";
          return Croppie2.globals.translate + "(" + this.x + "px, " + this.y + "px" + suffix + ") scale(" + this.scale + ")";
        };
        var TransformOrigin = function(el) {
          if (!el || !el.style[CSS_TRANS_ORG]) {
            this.x = 0;
            this.y = 0;
            return;
          }
          var css2 = el.style[CSS_TRANS_ORG].split(" ");
          this.x = parseFloat(css2[0]);
          this.y = parseFloat(css2[1]);
        };
        TransformOrigin.prototype.toString = function() {
          return this.x + "px " + this.y + "px";
        };
        function getExifOrientation(img) {
          return img.exifdata && img.exifdata.Orientation ? num(img.exifdata.Orientation) : 1;
        }
        function drawCanvas(canvas, img, orientation) {
          var width = img.width, height = img.height, ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.save();
          switch (orientation) {
            case 2:
              ctx.translate(width, 0);
              ctx.scale(-1, 1);
              break;
            case 3:
              ctx.translate(width, height);
              ctx.rotate(180 * Math.PI / 180);
              break;
            case 4:
              ctx.translate(0, height);
              ctx.scale(1, -1);
              break;
            case 5:
              canvas.width = height;
              canvas.height = width;
              ctx.rotate(90 * Math.PI / 180);
              ctx.scale(1, -1);
              break;
            case 6:
              canvas.width = height;
              canvas.height = width;
              ctx.rotate(90 * Math.PI / 180);
              ctx.translate(0, -height);
              break;
            case 7:
              canvas.width = height;
              canvas.height = width;
              ctx.rotate(-90 * Math.PI / 180);
              ctx.translate(-width, height);
              ctx.scale(1, -1);
              break;
            case 8:
              canvas.width = height;
              canvas.height = width;
              ctx.translate(0, width);
              ctx.rotate(-90 * Math.PI / 180);
              break;
          }
          ctx.drawImage(img, 0, 0, width, height);
          ctx.restore();
        }
        function _create() {
          var self2 = this, contClass = "croppie-container", customViewportClass = self2.options.viewport.type ? "cr-vp-" + self2.options.viewport.type : null, boundary, img, viewport, overlay, bw, bh;
          self2.options.useCanvas = self2.options.enableOrientation || _hasExif.call(self2);
          self2.data = {};
          self2.elements = {};
          boundary = self2.elements.boundary = document.createElement("div");
          viewport = self2.elements.viewport = document.createElement("div");
          img = self2.elements.img = document.createElement("img");
          overlay = self2.elements.overlay = document.createElement("div");
          if (self2.options.useCanvas) {
            self2.elements.canvas = document.createElement("canvas");
            self2.elements.preview = self2.elements.canvas;
          } else {
            self2.elements.preview = img;
          }
          addClass(boundary, "cr-boundary");
          boundary.setAttribute("aria-dropeffect", "none");
          bw = self2.options.boundary.width;
          bh = self2.options.boundary.height;
          css(boundary, {
            width: bw + (isNaN(bw) ? "" : "px"),
            height: bh + (isNaN(bh) ? "" : "px")
          });
          addClass(viewport, "cr-viewport");
          if (customViewportClass) {
            addClass(viewport, customViewportClass);
          }
          css(viewport, {
            width: self2.options.viewport.width + "px",
            height: self2.options.viewport.height + "px"
          });
          viewport.setAttribute("tabindex", 0);
          addClass(self2.elements.preview, "cr-image");
          setAttributes(self2.elements.preview, { "alt": "preview", "aria-grabbed": "false" });
          addClass(overlay, "cr-overlay");
          self2.element.appendChild(boundary);
          boundary.appendChild(self2.elements.preview);
          boundary.appendChild(viewport);
          boundary.appendChild(overlay);
          addClass(self2.element, contClass);
          if (self2.options.customClass) {
            addClass(self2.element, self2.options.customClass);
          }
          _initDraggable.call(this);
          if (self2.options.enableZoom) {
            _initializeZoom.call(self2);
          }
          if (self2.options.enableResize) {
            _initializeResize.call(self2);
          }
        }
        function _hasExif() {
          return this.options.enableExif && window.EXIF;
        }
        function _initializeResize() {
          var self2 = this;
          var wrap = document.createElement("div");
          var isDragging = false;
          var direction;
          var originalX;
          var originalY;
          var minSize = 50;
          var maxWidth;
          var maxHeight;
          var vr;
          var hr;
          addClass(wrap, "cr-resizer");
          css(wrap, {
            width: this.options.viewport.width + "px",
            height: this.options.viewport.height + "px"
          });
          if (this.options.resizeControls.height) {
            vr = document.createElement("div");
            addClass(vr, "cr-resizer-vertical");
            wrap.appendChild(vr);
          }
          if (this.options.resizeControls.width) {
            hr = document.createElement("div");
            addClass(hr, "cr-resizer-horisontal");
            wrap.appendChild(hr);
          }
          function mouseDown(ev) {
            if (ev.button !== void 0 && ev.button !== 0) return;
            ev.preventDefault();
            if (isDragging) {
              return;
            }
            var overlayRect = self2.elements.overlay.getBoundingClientRect();
            isDragging = true;
            originalX = ev.pageX;
            originalY = ev.pageY;
            direction = ev.currentTarget.className.indexOf("vertical") !== -1 ? "v" : "h";
            maxWidth = overlayRect.width;
            maxHeight = overlayRect.height;
            if (ev.touches) {
              var touches = ev.touches[0];
              originalX = touches.pageX;
              originalY = touches.pageY;
            }
            window.addEventListener("mousemove", mouseMove);
            window.addEventListener("touchmove", mouseMove);
            window.addEventListener("mouseup", mouseUp);
            window.addEventListener("touchend", mouseUp);
            document.body.style[CSS_USERSELECT] = "none";
          }
          function mouseMove(ev) {
            var pageX = ev.pageX;
            var pageY = ev.pageY;
            ev.preventDefault();
            if (ev.touches) {
              var touches = ev.touches[0];
              pageX = touches.pageX;
              pageY = touches.pageY;
            }
            var deltaX = pageX - originalX;
            var deltaY = pageY - originalY;
            var newHeight = self2.options.viewport.height + deltaY;
            var newWidth = self2.options.viewport.width + deltaX;
            if (direction === "v" && newHeight >= minSize && newHeight <= maxHeight) {
              css(wrap, {
                height: newHeight + "px"
              });
              self2.options.boundary.height += deltaY;
              css(self2.elements.boundary, {
                height: self2.options.boundary.height + "px"
              });
              self2.options.viewport.height += deltaY;
              css(self2.elements.viewport, {
                height: self2.options.viewport.height + "px"
              });
            } else if (direction === "h" && newWidth >= minSize && newWidth <= maxWidth) {
              css(wrap, {
                width: newWidth + "px"
              });
              self2.options.boundary.width += deltaX;
              css(self2.elements.boundary, {
                width: self2.options.boundary.width + "px"
              });
              self2.options.viewport.width += deltaX;
              css(self2.elements.viewport, {
                width: self2.options.viewport.width + "px"
              });
            }
            _updateOverlay.call(self2);
            _updateZoomLimits.call(self2);
            _updateCenterPoint.call(self2);
            _triggerUpdate.call(self2);
            originalY = pageY;
            originalX = pageX;
          }
          function mouseUp() {
            isDragging = false;
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("touchmove", mouseMove);
            window.removeEventListener("mouseup", mouseUp);
            window.removeEventListener("touchend", mouseUp);
            document.body.style[CSS_USERSELECT] = "";
          }
          if (vr) {
            vr.addEventListener("mousedown", mouseDown);
            vr.addEventListener("touchstart", mouseDown);
          }
          if (hr) {
            hr.addEventListener("mousedown", mouseDown);
            hr.addEventListener("touchstart", mouseDown);
          }
          this.elements.boundary.appendChild(wrap);
        }
        function _setZoomerVal(v2) {
          if (this.options.enableZoom) {
            var z2 = this.elements.zoomer, val = fix(v2, 4);
            z2.value = Math.max(parseFloat(z2.min), Math.min(parseFloat(z2.max), val)).toString();
          }
        }
        function _initializeZoom() {
          var self2 = this, wrap = self2.elements.zoomerWrap = document.createElement("div"), zoomer = self2.elements.zoomer = document.createElement("input");
          addClass(wrap, "cr-slider-wrap");
          addClass(zoomer, "cr-slider");
          zoomer.type = "range";
          zoomer.step = "0.0001";
          zoomer.value = "1";
          zoomer.style.display = self2.options.showZoomer ? "" : "none";
          zoomer.setAttribute("aria-label", "zoom");
          self2.element.appendChild(wrap);
          wrap.appendChild(zoomer);
          self2._currentZoom = 1;
          function change() {
            _onZoom.call(self2, {
              value: parseFloat(zoomer.value),
              origin: new TransformOrigin(self2.elements.preview),
              viewportRect: self2.elements.viewport.getBoundingClientRect(),
              transform: Transform.parse(self2.elements.preview)
            });
          }
          function scroll(ev) {
            var delta, targetZoom;
            if (self2.options.mouseWheelZoom === "ctrl" && ev.ctrlKey !== true) {
              return 0;
            } else if (ev.wheelDelta) {
              delta = ev.wheelDelta / 1200;
            } else if (ev.deltaY) {
              delta = ev.deltaY / 1060;
            } else if (ev.detail) {
              delta = ev.detail / -60;
            } else {
              delta = 0;
            }
            targetZoom = self2._currentZoom + delta * self2._currentZoom;
            ev.preventDefault();
            _setZoomerVal.call(self2, targetZoom);
            change.call(self2);
          }
          self2.elements.zoomer.addEventListener("input", change);
          self2.elements.zoomer.addEventListener("change", change);
          if (self2.options.mouseWheelZoom) {
            self2.elements.boundary.addEventListener("mousewheel", scroll);
            self2.elements.boundary.addEventListener("DOMMouseScroll", scroll);
          }
        }
        function _onZoom(ui) {
          var self2 = this, transform = ui ? ui.transform : Transform.parse(self2.elements.preview), vpRect = ui ? ui.viewportRect : self2.elements.viewport.getBoundingClientRect(), origin = ui ? ui.origin : new TransformOrigin(self2.elements.preview);
          function applyCss() {
            var transCss = {};
            transCss[CSS_TRANSFORM] = transform.toString();
            transCss[CSS_TRANS_ORG] = origin.toString();
            css(self2.elements.preview, transCss);
          }
          self2._currentZoom = ui ? ui.value : self2._currentZoom;
          transform.scale = self2._currentZoom;
          self2.elements.zoomer.setAttribute("aria-valuenow", self2._currentZoom);
          applyCss();
          if (self2.options.enforceBoundary) {
            var boundaries = _getVirtualBoundaries.call(self2, vpRect), transBoundaries = boundaries.translate, oBoundaries = boundaries.origin;
            if (transform.x >= transBoundaries.maxX) {
              origin.x = oBoundaries.minX;
              transform.x = transBoundaries.maxX;
            }
            if (transform.x <= transBoundaries.minX) {
              origin.x = oBoundaries.maxX;
              transform.x = transBoundaries.minX;
            }
            if (transform.y >= transBoundaries.maxY) {
              origin.y = oBoundaries.minY;
              transform.y = transBoundaries.maxY;
            }
            if (transform.y <= transBoundaries.minY) {
              origin.y = oBoundaries.maxY;
              transform.y = transBoundaries.minY;
            }
          }
          applyCss();
          _debouncedOverlay.call(self2);
          _triggerUpdate.call(self2);
        }
        function _getVirtualBoundaries(viewport) {
          var self2 = this, scale = self2._currentZoom, vpWidth = viewport.width, vpHeight = viewport.height, centerFromBoundaryX = self2.elements.boundary.clientWidth / 2, centerFromBoundaryY = self2.elements.boundary.clientHeight / 2, imgRect = self2.elements.preview.getBoundingClientRect(), curImgWidth = imgRect.width, curImgHeight = imgRect.height, halfWidth = vpWidth / 2, halfHeight = vpHeight / 2;
          var maxX = (halfWidth / scale - centerFromBoundaryX) * -1;
          var minX = maxX - (curImgWidth * (1 / scale) - vpWidth * (1 / scale));
          var maxY = (halfHeight / scale - centerFromBoundaryY) * -1;
          var minY = maxY - (curImgHeight * (1 / scale) - vpHeight * (1 / scale));
          var originMinX = 1 / scale * halfWidth;
          var originMaxX = curImgWidth * (1 / scale) - originMinX;
          var originMinY = 1 / scale * halfHeight;
          var originMaxY = curImgHeight * (1 / scale) - originMinY;
          return {
            translate: {
              maxX,
              minX,
              maxY,
              minY
            },
            origin: {
              maxX: originMaxX,
              minX: originMinX,
              maxY: originMaxY,
              minY: originMinY
            }
          };
        }
        function _updateCenterPoint(rotate) {
          var self2 = this, scale = self2._currentZoom, data = self2.elements.preview.getBoundingClientRect(), vpData = self2.elements.viewport.getBoundingClientRect(), transform = Transform.parse(self2.elements.preview.style[CSS_TRANSFORM]), pc = new TransformOrigin(self2.elements.preview), top = vpData.top - data.top + vpData.height / 2, left = vpData.left - data.left + vpData.width / 2, center = {}, adj = {};
          if (rotate) {
            var cx = pc.x;
            var cy = pc.y;
            var tx = transform.x;
            var ty = transform.y;
            center.y = cx;
            center.x = cy;
            transform.y = tx;
            transform.x = ty;
          } else {
            center.y = top / scale;
            center.x = left / scale;
            adj.y = (center.y - pc.y) * (1 - scale);
            adj.x = (center.x - pc.x) * (1 - scale);
            transform.x -= adj.x;
            transform.y -= adj.y;
          }
          var newCss = {};
          newCss[CSS_TRANS_ORG] = center.x + "px " + center.y + "px";
          newCss[CSS_TRANSFORM] = transform.toString();
          css(self2.elements.preview, newCss);
        }
        function _initDraggable() {
          var self2 = this, isDragging = false, originalX, originalY, originalDistance, vpRect, transform;
          function assignTransformCoordinates(deltaX, deltaY) {
            var imgRect = self2.elements.preview.getBoundingClientRect(), top = transform.y + deltaY, left = transform.x + deltaX;
            if (self2.options.enforceBoundary) {
              if (vpRect.top > imgRect.top + deltaY && vpRect.bottom < imgRect.bottom + deltaY) {
                transform.y = top;
              }
              if (vpRect.left > imgRect.left + deltaX && vpRect.right < imgRect.right + deltaX) {
                transform.x = left;
              }
            } else {
              transform.y = top;
              transform.x = left;
            }
          }
          function toggleGrabState(isDragging2) {
            self2.elements.preview.setAttribute("aria-grabbed", isDragging2);
            self2.elements.boundary.setAttribute("aria-dropeffect", isDragging2 ? "move" : "none");
          }
          function keyDown(ev) {
            var LEFT_ARROW = 37, UP_ARROW = 38, RIGHT_ARROW = 39, DOWN_ARROW = 40;
            if (ev.shiftKey && (ev.keyCode === UP_ARROW || ev.keyCode === DOWN_ARROW)) {
              var zoom;
              if (ev.keyCode === UP_ARROW) {
                zoom = parseFloat(self2.elements.zoomer.value) + parseFloat(self2.elements.zoomer.step);
              } else {
                zoom = parseFloat(self2.elements.zoomer.value) - parseFloat(self2.elements.zoomer.step);
              }
              self2.setZoom(zoom);
            } else if (self2.options.enableKeyMovement && (ev.keyCode >= 37 && ev.keyCode <= 40)) {
              ev.preventDefault();
              var movement = parseKeyDown(ev.keyCode);
              transform = Transform.parse(self2.elements.preview);
              document.body.style[CSS_USERSELECT] = "none";
              vpRect = self2.elements.viewport.getBoundingClientRect();
              keyMove(movement);
            }
            function parseKeyDown(key) {
              switch (key) {
                case LEFT_ARROW:
                  return [1, 0];
                case UP_ARROW:
                  return [0, 1];
                case RIGHT_ARROW:
                  return [-1, 0];
                case DOWN_ARROW:
                  return [0, -1];
              }
            }
          }
          function keyMove(movement) {
            var deltaX = movement[0], deltaY = movement[1], newCss = {};
            assignTransformCoordinates(deltaX, deltaY);
            newCss[CSS_TRANSFORM] = transform.toString();
            css(self2.elements.preview, newCss);
            _updateOverlay.call(self2);
            document.body.style[CSS_USERSELECT] = "";
            _updateCenterPoint.call(self2);
            _triggerUpdate.call(self2);
            originalDistance = 0;
          }
          function mouseDown(ev) {
            if (ev.button !== void 0 && ev.button !== 0) return;
            ev.preventDefault();
            if (isDragging) return;
            isDragging = true;
            originalX = ev.pageX;
            originalY = ev.pageY;
            if (ev.touches) {
              var touches = ev.touches[0];
              originalX = touches.pageX;
              originalY = touches.pageY;
            }
            toggleGrabState(isDragging);
            transform = Transform.parse(self2.elements.preview);
            window.addEventListener("mousemove", mouseMove);
            window.addEventListener("touchmove", mouseMove);
            window.addEventListener("mouseup", mouseUp);
            window.addEventListener("touchend", mouseUp);
            document.body.style[CSS_USERSELECT] = "none";
            vpRect = self2.elements.viewport.getBoundingClientRect();
          }
          function mouseMove(ev) {
            ev.preventDefault();
            var pageX = ev.pageX, pageY = ev.pageY;
            if (ev.touches) {
              var touches = ev.touches[0];
              pageX = touches.pageX;
              pageY = touches.pageY;
            }
            var deltaX = pageX - originalX, deltaY = pageY - originalY, newCss = {};
            if (ev.type === "touchmove") {
              if (ev.touches.length > 1) {
                var touch1 = ev.touches[0];
                var touch2 = ev.touches[1];
                var dist = Math.sqrt((touch1.pageX - touch2.pageX) * (touch1.pageX - touch2.pageX) + (touch1.pageY - touch2.pageY) * (touch1.pageY - touch2.pageY));
                if (!originalDistance) {
                  originalDistance = dist / self2._currentZoom;
                }
                var scale = dist / originalDistance;
                _setZoomerVal.call(self2, scale);
                dispatchChange(self2.elements.zoomer);
                return;
              }
            }
            assignTransformCoordinates(deltaX, deltaY);
            newCss[CSS_TRANSFORM] = transform.toString();
            css(self2.elements.preview, newCss);
            _updateOverlay.call(self2);
            originalY = pageY;
            originalX = pageX;
          }
          function mouseUp() {
            isDragging = false;
            toggleGrabState(isDragging);
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("touchmove", mouseMove);
            window.removeEventListener("mouseup", mouseUp);
            window.removeEventListener("touchend", mouseUp);
            document.body.style[CSS_USERSELECT] = "";
            _updateCenterPoint.call(self2);
            _triggerUpdate.call(self2);
            originalDistance = 0;
          }
          self2.elements.overlay.addEventListener("mousedown", mouseDown);
          self2.elements.viewport.addEventListener("keydown", keyDown);
          self2.elements.overlay.addEventListener("touchstart", mouseDown);
        }
        function _updateOverlay() {
          if (!this.elements) return;
          var self2 = this, boundRect = self2.elements.boundary.getBoundingClientRect(), imgData = self2.elements.preview.getBoundingClientRect();
          css(self2.elements.overlay, {
            width: imgData.width + "px",
            height: imgData.height + "px",
            top: imgData.top - boundRect.top + "px",
            left: imgData.left - boundRect.left + "px"
          });
        }
        var _debouncedOverlay = debounce(_updateOverlay, 500);
        function _triggerUpdate() {
          var self2 = this, data = self2.get();
          if (!_isVisible.call(self2)) {
            return;
          }
          self2.options.update.call(self2, data);
          if (self2.$ && typeof Prototype === "undefined") {
            self2.$(self2.element).trigger("update.croppie", data);
          } else {
            var ev;
            if (window.CustomEvent) {
              ev = new CustomEvent("update", { detail: data });
            } else {
              ev = document.createEvent("CustomEvent");
              ev.initCustomEvent("update", true, true, data);
            }
            self2.element.dispatchEvent(ev);
          }
        }
        function _isVisible() {
          return this.elements.preview.offsetHeight > 0 && this.elements.preview.offsetWidth > 0;
        }
        function _updatePropertiesFromImage() {
          var self2 = this, initialZoom = 1, cssReset = {}, img = self2.elements.preview, imgData, transformReset = new Transform(0, 0, initialZoom), originReset = new TransformOrigin(), isVisible = _isVisible.call(self2);
          if (!isVisible || self2.data.bound) {
            return;
          }
          self2.data.bound = true;
          cssReset[CSS_TRANSFORM] = transformReset.toString();
          cssReset[CSS_TRANS_ORG] = originReset.toString();
          cssReset["opacity"] = 1;
          css(img, cssReset);
          imgData = self2.elements.preview.getBoundingClientRect();
          self2._originalImageWidth = imgData.width;
          self2._originalImageHeight = imgData.height;
          self2.data.orientation = _hasExif.call(self2) ? getExifOrientation(self2.elements.img) : self2.data.orientation;
          if (self2.options.enableZoom) {
            _updateZoomLimits.call(self2, true);
          } else {
            self2._currentZoom = initialZoom;
          }
          transformReset.scale = self2._currentZoom;
          cssReset[CSS_TRANSFORM] = transformReset.toString();
          css(img, cssReset);
          if (self2.data.points.length) {
            _bindPoints.call(self2, self2.data.points);
          } else {
            _centerImage.call(self2);
          }
          _updateCenterPoint.call(self2);
          _updateOverlay.call(self2);
        }
        function _updateZoomLimits(initial) {
          var self2 = this, minZoom = Math.max(self2.options.minZoom, 0) || 0, maxZoom = self2.options.maxZoom || 1.5, initialZoom, defaultInitialZoom, zoomer = self2.elements.zoomer, scale = parseFloat(zoomer.value), boundaryData = self2.elements.boundary.getBoundingClientRect(), imgData = naturalImageDimensions(self2.elements.img, self2.data.orientation), vpData = self2.elements.viewport.getBoundingClientRect(), minW, minH;
          if (self2.options.enforceBoundary) {
            minW = vpData.width / imgData.width;
            minH = vpData.height / imgData.height;
            minZoom = Math.max(minW, minH);
          }
          if (minZoom >= maxZoom) {
            maxZoom = minZoom + 1;
          }
          zoomer.min = fix(minZoom, 4);
          zoomer.max = fix(maxZoom, 4);
          if (!initial && (scale < zoomer.min || scale > zoomer.max)) {
            _setZoomerVal.call(self2, scale < zoomer.min ? zoomer.min : zoomer.max);
          } else if (initial) {
            defaultInitialZoom = Math.max(boundaryData.width / imgData.width, boundaryData.height / imgData.height);
            initialZoom = self2.data.boundZoom !== null ? self2.data.boundZoom : defaultInitialZoom;
            _setZoomerVal.call(self2, initialZoom);
          }
          dispatchChange(zoomer);
        }
        function _bindPoints(points) {
          if (points.length !== 4) {
            throw "Croppie - Invalid number of points supplied: " + points;
          }
          var self2 = this, pointsWidth = points[2] - points[0], vpData = self2.elements.viewport.getBoundingClientRect(), boundRect = self2.elements.boundary.getBoundingClientRect(), vpOffset = {
            left: vpData.left - boundRect.left,
            top: vpData.top - boundRect.top
          }, scale = vpData.width / pointsWidth, originTop = points[1], originLeft = points[0], transformTop = -1 * points[1] + vpOffset.top, transformLeft = -1 * points[0] + vpOffset.left, newCss = {};
          newCss[CSS_TRANS_ORG] = originLeft + "px " + originTop + "px";
          newCss[CSS_TRANSFORM] = new Transform(transformLeft, transformTop, scale).toString();
          css(self2.elements.preview, newCss);
          _setZoomerVal.call(self2, scale);
          self2._currentZoom = scale;
        }
        function _centerImage() {
          var self2 = this, imgDim = self2.elements.preview.getBoundingClientRect(), vpDim = self2.elements.viewport.getBoundingClientRect(), boundDim = self2.elements.boundary.getBoundingClientRect(), vpLeft = vpDim.left - boundDim.left, vpTop = vpDim.top - boundDim.top, w2 = vpLeft - (imgDim.width - vpDim.width) / 2, h3 = vpTop - (imgDim.height - vpDim.height) / 2, transform = new Transform(w2, h3, self2._currentZoom);
          css(self2.elements.preview, CSS_TRANSFORM, transform.toString());
        }
        function _transferImageToCanvas(customOrientation) {
          var self2 = this, canvas = self2.elements.canvas, img = self2.elements.img, ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.width = img.width;
          canvas.height = img.height;
          var orientation = self2.options.enableOrientation && customOrientation || getExifOrientation(img);
          drawCanvas(canvas, img, orientation);
        }
        function _getCanvas(data) {
          var self2 = this, points = data.points, left = num(points[0]), top = num(points[1]), right = num(points[2]), bottom = num(points[3]), width = right - left, height = bottom - top, circle = data.circle, canvas = document.createElement("canvas"), ctx = canvas.getContext("2d"), startX = 0, startY = 0, canvasWidth = data.outputWidth || width, canvasHeight = data.outputHeight || height;
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          if (data.backgroundColor) {
            ctx.fillStyle = data.backgroundColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          }
          var sx = left, sy = top, sWidth = width, sHeight = height, dx = 0, dy = 0, dWidth = canvasWidth, dHeight = canvasHeight;
          if (left < 0) {
            sx = 0;
            dx = Math.abs(left) / width * canvasWidth;
          }
          if (sWidth + sx > self2._originalImageWidth) {
            sWidth = self2._originalImageWidth - sx;
            dWidth = sWidth / width * canvasWidth;
          }
          if (top < 0) {
            sy = 0;
            dy = Math.abs(top) / height * canvasHeight;
          }
          if (sHeight + sy > self2._originalImageHeight) {
            sHeight = self2._originalImageHeight - sy;
            dHeight = sHeight / height * canvasHeight;
          }
          ctx.drawImage(this.elements.preview, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
          if (circle) {
            ctx.fillStyle = "#fff";
            ctx.globalCompositeOperation = "destination-in";
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
          }
          return canvas;
        }
        function _getHtmlResult(data) {
          var points = data.points, div = document.createElement("div"), img = document.createElement("img"), width = points[2] - points[0], height = points[3] - points[1];
          addClass(div, "croppie-result");
          div.appendChild(img);
          css(img, {
            left: -1 * points[0] + "px",
            top: -1 * points[1] + "px"
          });
          img.src = data.url;
          css(div, {
            width: width + "px",
            height: height + "px"
          });
          return div;
        }
        function _getBase64Result(data) {
          return _getCanvas.call(this, data).toDataURL(data.format, data.quality);
        }
        function _getBlobResult(data) {
          var self2 = this;
          return new Promise(function(resolve) {
            _getCanvas.call(self2, data).toBlob(function(blob) {
              resolve(blob);
            }, data.format, data.quality);
          });
        }
        function _replaceImage(img) {
          if (this.elements.img.parentNode) {
            Array.prototype.forEach.call(this.elements.img.classList, function(c4) {
              img.classList.add(c4);
            });
            this.elements.img.parentNode.replaceChild(img, this.elements.img);
            this.elements.preview = img;
          }
          this.elements.img = img;
        }
        function _bind(options, cb) {
          var self2 = this, url, points = [], zoom = null, hasExif = _hasExif.call(self2);
          if (typeof options === "string") {
            url = options;
            options = {};
          } else if (Array.isArray(options)) {
            points = options.slice();
          } else if (typeof options === "undefined" && self2.data.url) {
            _updatePropertiesFromImage.call(self2);
            _triggerUpdate.call(self2);
            return null;
          } else {
            url = options.url;
            points = options.points || [];
            zoom = typeof options.zoom === "undefined" ? null : options.zoom;
          }
          self2.data.bound = false;
          self2.data.url = url || self2.data.url;
          self2.data.boundZoom = zoom;
          return loadImage(url, hasExif).then(function(img) {
            _replaceImage.call(self2, img);
            if (!points.length) {
              var natDim = naturalImageDimensions(img);
              var rect = self2.elements.viewport.getBoundingClientRect();
              var aspectRatio = rect.width / rect.height;
              var imgAspectRatio = natDim.width / natDim.height;
              var width, height;
              if (imgAspectRatio > aspectRatio) {
                height = natDim.height;
                width = height * aspectRatio;
              } else {
                width = natDim.width;
                height = natDim.height / aspectRatio;
              }
              var x0 = (natDim.width - width) / 2;
              var y0 = (natDim.height - height) / 2;
              var x1 = x0 + width;
              var y1 = y0 + height;
              self2.data.points = [x0, y0, x1, y1];
            } else if (self2.options.relative) {
              points = [
                points[0] * img.naturalWidth / 100,
                points[1] * img.naturalHeight / 100,
                points[2] * img.naturalWidth / 100,
                points[3] * img.naturalHeight / 100
              ];
            }
            self2.data.orientation = options.orientation || 1;
            self2.data.points = points.map(function(p3) {
              return parseFloat(p3);
            });
            if (self2.options.useCanvas) {
              _transferImageToCanvas.call(self2, self2.data.orientation);
            }
            _updatePropertiesFromImage.call(self2);
            _triggerUpdate.call(self2);
            cb && cb();
          });
        }
        function fix(v2, decimalPoints) {
          return parseFloat(v2).toFixed(decimalPoints || 0);
        }
        function _get() {
          var self2 = this, imgData = self2.elements.preview.getBoundingClientRect(), vpData = self2.elements.viewport.getBoundingClientRect(), x1 = vpData.left - imgData.left, y1 = vpData.top - imgData.top, widthDiff = (vpData.width - self2.elements.viewport.offsetWidth) / 2, heightDiff = (vpData.height - self2.elements.viewport.offsetHeight) / 2, x2 = x1 + self2.elements.viewport.offsetWidth + widthDiff, y22 = y1 + self2.elements.viewport.offsetHeight + heightDiff, scale = self2._currentZoom;
          if (scale === Infinity || isNaN(scale)) {
            scale = 1;
          }
          var max = self2.options.enforceBoundary ? 0 : Number.NEGATIVE_INFINITY;
          x1 = Math.max(max, x1 / scale);
          y1 = Math.max(max, y1 / scale);
          x2 = Math.max(max, x2 / scale);
          y22 = Math.max(max, y22 / scale);
          return {
            points: [fix(x1), fix(y1), fix(x2), fix(y22)],
            zoom: scale,
            orientation: self2.data.orientation
          };
        }
        var RESULT_DEFAULTS = {
          type: "canvas",
          format: "png",
          quality: 1
        }, RESULT_FORMATS = ["jpeg", "webp", "png"];
        function _result(options) {
          var self2 = this, data = _get.call(self2), opts = deepExtend(clone(RESULT_DEFAULTS), clone(options)), resultType = typeof options === "string" ? options : opts.type || "base64", size = opts.size || "viewport", format = opts.format, quality = opts.quality, backgroundColor = opts.backgroundColor, circle = typeof opts.circle === "boolean" ? opts.circle : self2.options.viewport.type === "circle", vpRect = self2.elements.viewport.getBoundingClientRect(), ratio = vpRect.width / vpRect.height, prom;
          if (size === "viewport") {
            data.outputWidth = vpRect.width;
            data.outputHeight = vpRect.height;
          } else if (typeof size === "object") {
            if (size.width && size.height) {
              data.outputWidth = size.width;
              data.outputHeight = size.height;
            } else if (size.width) {
              data.outputWidth = size.width;
              data.outputHeight = size.width / ratio;
            } else if (size.height) {
              data.outputWidth = size.height * ratio;
              data.outputHeight = size.height;
            }
          }
          if (RESULT_FORMATS.indexOf(format) > -1) {
            data.format = "image/" + format;
            data.quality = quality;
          }
          data.circle = circle;
          data.url = self2.data.url;
          data.backgroundColor = backgroundColor;
          prom = new Promise(function(resolve) {
            switch (resultType.toLowerCase()) {
              case "rawcanvas":
                resolve(_getCanvas.call(self2, data));
                break;
              case "canvas":
              case "base64":
                resolve(_getBase64Result.call(self2, data));
                break;
              case "blob":
                _getBlobResult.call(self2, data).then(resolve);
                break;
              default:
                resolve(_getHtmlResult.call(self2, data));
                break;
            }
          });
          return prom;
        }
        function _refresh() {
          _updatePropertiesFromImage.call(this);
        }
        function _rotate(deg) {
          if (!this.options.useCanvas || !this.options.enableOrientation) {
            throw "Croppie: Cannot rotate without enableOrientation && EXIF.js included";
          }
          var self2 = this, canvas = self2.elements.canvas;
          self2.data.orientation = getExifOffset(self2.data.orientation, deg);
          drawCanvas(canvas, self2.elements.img, self2.data.orientation);
          _updateCenterPoint.call(self2, true);
          _updateZoomLimits.call(self2);
          if (Math.abs(deg) / 90 % 2 === 1) {
            var oldHeight = self2._originalImageHeight;
            var oldWidth = self2._originalImageWidth;
            self2._originalImageWidth = oldHeight;
            self2._originalImageHeight = oldWidth;
          }
        }
        function _destroy() {
          var self2 = this;
          self2.element.removeChild(self2.elements.boundary);
          removeClass(self2.element, "croppie-container");
          if (self2.options.enableZoom) {
            self2.element.removeChild(self2.elements.zoomerWrap);
          }
          delete self2.elements;
        }
        if (typeof window !== "undefined" && window.jQuery) {
          var $2 = window.jQuery;
          $2.fn.croppie = function(opts) {
            var ot = typeof opts;
            if (ot === "string") {
              var args = Array.prototype.slice.call(arguments, 1);
              var singleInst = $2(this).data("croppie");
              if (opts === "get") {
                return singleInst.get();
              } else if (opts === "result") {
                return singleInst.result.apply(singleInst, args);
              } else if (opts === "bind") {
                return singleInst.bind.apply(singleInst, args);
              }
              return this.each(function() {
                var i5 = $2(this).data("croppie");
                if (!i5) return;
                var method = i5[opts];
                if ($2.isFunction(method)) {
                  method.apply(i5, args);
                  if (opts === "destroy") {
                    $2(this).removeData("croppie");
                  }
                } else {
                  throw "Croppie " + opts + " method not found";
                }
              });
            } else {
              return this.each(function() {
                var i5 = new Croppie2(this, opts);
                i5.$ = $2;
                $2(this).data("croppie", i5);
              });
            }
          };
        }
        function Croppie2(element, opts) {
          if (element.className.indexOf("croppie-container") > -1) {
            throw new Error("Croppie: Can't initialize croppie more than once");
          }
          this.element = element;
          this.options = deepExtend(clone(Croppie2.defaults), opts);
          if (this.element.tagName.toLowerCase() === "img") {
            var origImage = this.element;
            addClass(origImage, "cr-original-image");
            setAttributes(origImage, { "aria-hidden": "true", "alt": "" });
            var replacementDiv = document.createElement("div");
            this.element.parentNode.appendChild(replacementDiv);
            replacementDiv.appendChild(origImage);
            this.element = replacementDiv;
            this.options.url = this.options.url || origImage.src;
          }
          _create.call(this);
          if (this.options.url) {
            var bindOpts = {
              url: this.options.url,
              points: this.options.points
            };
            delete this.options["url"];
            delete this.options["points"];
            _bind.call(this, bindOpts);
          }
        }
        Croppie2.defaults = {
          viewport: {
            width: 100,
            height: 100,
            type: "square"
          },
          boundary: {},
          orientationControls: {
            enabled: true,
            leftClass: "",
            rightClass: ""
          },
          resizeControls: {
            width: true,
            height: true
          },
          customClass: "",
          showZoomer: true,
          enableZoom: true,
          enableResize: false,
          mouseWheelZoom: true,
          enableExif: false,
          enforceBoundary: true,
          enableOrientation: false,
          enableKeyMovement: true,
          update: function() {
          }
        };
        Croppie2.globals = {
          translate: "translate3d"
        };
        deepExtend(Croppie2.prototype, {
          bind: function(options, cb) {
            return _bind.call(this, options, cb);
          },
          get: function() {
            var data = _get.call(this);
            var points = data.points;
            if (this.options.relative) {
              points[0] /= this.elements.img.naturalWidth / 100;
              points[1] /= this.elements.img.naturalHeight / 100;
              points[2] /= this.elements.img.naturalWidth / 100;
              points[3] /= this.elements.img.naturalHeight / 100;
            }
            return data;
          },
          result: function(type) {
            return _result.call(this, type);
          },
          refresh: function() {
            return _refresh.call(this);
          },
          setZoom: function(v2) {
            _setZoomerVal.call(this, v2);
            dispatchChange(this.elements.zoomer);
          },
          rotate: function(deg) {
            _rotate.call(this, deg);
          },
          destroy: function() {
            return _destroy.call(this);
          }
        });
        return Croppie2;
      });
    }
  });

  // node_modules/@lit/reactive-element/css-tag.js
  var t = globalThis;
  var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = Symbol();
  var o = /* @__PURE__ */ new WeakMap();
  var n = class {
    constructor(t3, e4, o5) {
      if (this._$cssResult$ = true, o5 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t3, this.t = e4;
    }
    get styleSheet() {
      let t3 = this.o;
      const s4 = this.t;
      if (e && void 0 === t3) {
        const e4 = void 0 !== s4 && 1 === s4.length;
        e4 && (t3 = o.get(s4)), void 0 === t3 && ((this.o = t3 = new CSSStyleSheet()).replaceSync(this.cssText), e4 && o.set(s4, t3));
      }
      return t3;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t3) => new n("string" == typeof t3 ? t3 : t3 + "", void 0, s);
  var i = (t3, ...e4) => {
    const o5 = 1 === t3.length ? t3[0] : e4.reduce(((e5, s4, o6) => e5 + ((t4) => {
      if (true === t4._$cssResult$) return t4.cssText;
      if ("number" == typeof t4) return t4;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t4 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s4) + t3[o6 + 1]), t3[0]);
    return new n(o5, t3, s);
  };
  var S = (s4, o5) => {
    if (e) s4.adoptedStyleSheets = o5.map(((t3) => t3 instanceof CSSStyleSheet ? t3 : t3.styleSheet));
    else for (const e4 of o5) {
      const o6 = document.createElement("style"), n4 = t.litNonce;
      void 0 !== n4 && o6.setAttribute("nonce", n4), o6.textContent = e4.cssText, s4.appendChild(o6);
    }
  };
  var c = e ? (t3) => t3 : (t3) => t3 instanceof CSSStyleSheet ? ((t4) => {
    let e4 = "";
    for (const s4 of t4.cssRules) e4 += s4.cssText;
    return r(e4);
  })(t3) : t3;

  // node_modules/@lit/reactive-element/reactive-element.js
  var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
  var a = globalThis;
  var c2 = a.trustedTypes;
  var l = c2 ? c2.emptyScript : "";
  var p = a.reactiveElementPolyfillSupport;
  var d = (t3, s4) => t3;
  var u = { toAttribute(t3, s4) {
    switch (s4) {
      case Boolean:
        t3 = t3 ? l : null;
        break;
      case Object:
      case Array:
        t3 = null == t3 ? t3 : JSON.stringify(t3);
    }
    return t3;
  }, fromAttribute(t3, s4) {
    let i5 = t3;
    switch (s4) {
      case Boolean:
        i5 = null !== t3;
        break;
      case Number:
        i5 = null === t3 ? null : Number(t3);
        break;
      case Object:
      case Array:
        try {
          i5 = JSON.parse(t3);
        } catch (t4) {
          i5 = null;
        }
    }
    return i5;
  } };
  var f = (t3, s4) => !i2(t3, s4);
  var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
  Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
  var y = class extends HTMLElement {
    static addInitializer(t3) {
      this._$Ei(), (this.l ??= []).push(t3);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t3, s4 = b) {
      if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t3) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t3, s4), !s4.noAccessor) {
        const i5 = Symbol(), h3 = this.getPropertyDescriptor(t3, i5, s4);
        void 0 !== h3 && e2(this.prototype, t3, h3);
      }
    }
    static getPropertyDescriptor(t3, s4, i5) {
      const { get: e4, set: r4 } = h(this.prototype, t3) ?? { get() {
        return this[s4];
      }, set(t4) {
        this[s4] = t4;
      } };
      return { get: e4, set(s5) {
        const h3 = e4?.call(this);
        r4?.call(this, s5), this.requestUpdate(t3, h3, i5);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t3) {
      return this.elementProperties.get(t3) ?? b;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d("elementProperties"))) return;
      const t3 = n2(this);
      t3.finalize(), void 0 !== t3.l && (this.l = [...t3.l]), this.elementProperties = new Map(t3.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
        const t4 = this.properties, s4 = [...r2(t4), ...o2(t4)];
        for (const i5 of s4) this.createProperty(i5, t4[i5]);
      }
      const t3 = this[Symbol.metadata];
      if (null !== t3) {
        const s4 = litPropertyMetadata.get(t3);
        if (void 0 !== s4) for (const [t4, i5] of s4) this.elementProperties.set(t4, i5);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t4, s4] of this.elementProperties) {
        const i5 = this._$Eu(t4, s4);
        void 0 !== i5 && this._$Eh.set(i5, t4);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s4) {
      const i5 = [];
      if (Array.isArray(s4)) {
        const e4 = new Set(s4.flat(1 / 0).reverse());
        for (const s5 of e4) i5.unshift(c(s5));
      } else void 0 !== s4 && i5.push(c(s4));
      return i5;
    }
    static _$Eu(t3, s4) {
      const i5 = s4.attribute;
      return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t3 ? t3.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise(((t3) => this.enableUpdating = t3)), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(((t3) => t3(this)));
    }
    addController(t3) {
      (this._$EO ??= /* @__PURE__ */ new Set()).add(t3), void 0 !== this.renderRoot && this.isConnected && t3.hostConnected?.();
    }
    removeController(t3) {
      this._$EO?.delete(t3);
    }
    _$E_() {
      const t3 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
      for (const i5 of s4.keys()) this.hasOwnProperty(i5) && (t3.set(i5, this[i5]), delete this[i5]);
      t3.size > 0 && (this._$Ep = t3);
    }
    createRenderRoot() {
      const t3 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S(t3, this.constructor.elementStyles), t3;
    }
    connectedCallback() {
      this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach(((t3) => t3.hostConnected?.()));
    }
    enableUpdating(t3) {
    }
    disconnectedCallback() {
      this._$EO?.forEach(((t3) => t3.hostDisconnected?.()));
    }
    attributeChangedCallback(t3, s4, i5) {
      this._$AK(t3, i5);
    }
    _$ET(t3, s4) {
      const i5 = this.constructor.elementProperties.get(t3), e4 = this.constructor._$Eu(t3, i5);
      if (void 0 !== e4 && true === i5.reflect) {
        const h3 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s4, i5.type);
        this._$Em = t3, null == h3 ? this.removeAttribute(e4) : this.setAttribute(e4, h3), this._$Em = null;
      }
    }
    _$AK(t3, s4) {
      const i5 = this.constructor, e4 = i5._$Eh.get(t3);
      if (void 0 !== e4 && this._$Em !== e4) {
        const t4 = i5.getPropertyOptions(e4), h3 = "function" == typeof t4.converter ? { fromAttribute: t4.converter } : void 0 !== t4.converter?.fromAttribute ? t4.converter : u;
        this._$Em = e4;
        const r4 = h3.fromAttribute(s4, t4.type);
        this[e4] = r4 ?? this._$Ej?.get(e4) ?? r4, this._$Em = null;
      }
    }
    requestUpdate(t3, s4, i5) {
      if (void 0 !== t3) {
        const e4 = this.constructor, h3 = this[t3];
        if (i5 ??= e4.getPropertyOptions(t3), !((i5.hasChanged ?? f)(h3, s4) || i5.useDefault && i5.reflect && h3 === this._$Ej?.get(t3) && !this.hasAttribute(e4._$Eu(t3, i5)))) return;
        this.C(t3, s4, i5);
      }
      false === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t3, s4, { useDefault: i5, reflect: e4, wrapped: h3 }, r4) {
      i5 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t3) && (this._$Ej.set(t3, r4 ?? s4 ?? this[t3]), true !== h3 || void 0 !== r4) || (this._$AL.has(t3) || (this.hasUpdated || i5 || (s4 = void 0), this._$AL.set(t3, s4)), true === e4 && this._$Em !== t3 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t3));
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t4) {
        Promise.reject(t4);
      }
      const t3 = this.scheduleUpdate();
      return null != t3 && await t3, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
          for (const [t5, s5] of this._$Ep) this[t5] = s5;
          this._$Ep = void 0;
        }
        const t4 = this.constructor.elementProperties;
        if (t4.size > 0) for (const [s5, i5] of t4) {
          const { wrapped: t5 } = i5, e4 = this[s5];
          true !== t5 || this._$AL.has(s5) || void 0 === e4 || this.C(s5, void 0, i5, e4);
        }
      }
      let t3 = false;
      const s4 = this._$AL;
      try {
        t3 = this.shouldUpdate(s4), t3 ? (this.willUpdate(s4), this._$EO?.forEach(((t4) => t4.hostUpdate?.())), this.update(s4)) : this._$EM();
      } catch (s5) {
        throw t3 = false, this._$EM(), s5;
      }
      t3 && this._$AE(s4);
    }
    willUpdate(t3) {
    }
    _$AE(t3) {
      this._$EO?.forEach(((t4) => t4.hostUpdated?.())), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t3)), this.updated(t3);
    }
    _$EM() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t3) {
      return true;
    }
    update(t3) {
      this._$Eq &&= this._$Eq.forEach(((t4) => this._$ET(t4, this[t4]))), this._$EM();
    }
    updated(t3) {
    }
    firstUpdated(t3) {
    }
  };
  y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.1");

  // node_modules/lit-html/lit-html.js
  var t2 = globalThis;
  var i3 = t2.trustedTypes;
  var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t3) => t3 }) : void 0;
  var e3 = "$lit$";
  var h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
  var o3 = "?" + h2;
  var n3 = `<${o3}>`;
  var r3 = document;
  var l2 = () => r3.createComment("");
  var c3 = (t3) => null === t3 || "object" != typeof t3 && "function" != typeof t3;
  var a2 = Array.isArray;
  var u2 = (t3) => a2(t3) || "function" == typeof t3?.[Symbol.iterator];
  var d2 = "[ 	\n\f\r]";
  var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var _ = />/g;
  var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var p2 = /'/g;
  var g = /"/g;
  var $ = /^(?:script|style|textarea|title)$/i;
  var y2 = (t3) => (i5, ...s4) => ({ _$litType$: t3, strings: i5, values: s4 });
  var x = y2(1);
  var b2 = y2(2);
  var w = y2(3);
  var T = Symbol.for("lit-noChange");
  var E = Symbol.for("lit-nothing");
  var A = /* @__PURE__ */ new WeakMap();
  var C = r3.createTreeWalker(r3, 129);
  function P(t3, i5) {
    if (!a2(t3) || !t3.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== s2 ? s2.createHTML(i5) : i5;
  }
  var V = (t3, i5) => {
    const s4 = t3.length - 1, o5 = [];
    let r4, l3 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c4 = f2;
    for (let i6 = 0; i6 < s4; i6++) {
      const s5 = t3[i6];
      let a3, u3, d3 = -1, y3 = 0;
      for (; y3 < s5.length && (c4.lastIndex = y3, u3 = c4.exec(s5), null !== u3); ) y3 = c4.lastIndex, c4 === f2 ? "!--" === u3[1] ? c4 = v : void 0 !== u3[1] ? c4 = _ : void 0 !== u3[2] ? ($.test(u3[2]) && (r4 = RegExp("</" + u3[2], "g")), c4 = m) : void 0 !== u3[3] && (c4 = m) : c4 === m ? ">" === u3[0] ? (c4 = r4 ?? f2, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? m : '"' === u3[3] ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r4 = void 0);
      const x2 = c4 === m && t3[i6 + 1].startsWith("/>") ? " " : "";
      l3 += c4 === f2 ? s5 + n3 : d3 >= 0 ? (o5.push(a3), s5.slice(0, d3) + e3 + s5.slice(d3) + h2 + x2) : s5 + h2 + (-2 === d3 ? i6 : x2);
    }
    return [P(t3, l3 + (t3[s4] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), o5];
  };
  var N = class _N {
    constructor({ strings: t3, _$litType$: s4 }, n4) {
      let r4;
      this.parts = [];
      let c4 = 0, a3 = 0;
      const u3 = t3.length - 1, d3 = this.parts, [f3, v2] = V(t3, s4);
      if (this.el = _N.createElement(f3, n4), C.currentNode = this.el.content, 2 === s4 || 3 === s4) {
        const t4 = this.el.content.firstChild;
        t4.replaceWith(...t4.childNodes);
      }
      for (; null !== (r4 = C.nextNode()) && d3.length < u3; ) {
        if (1 === r4.nodeType) {
          if (r4.hasAttributes()) for (const t4 of r4.getAttributeNames()) if (t4.endsWith(e3)) {
            const i5 = v2[a3++], s5 = r4.getAttribute(t4).split(h2), e4 = /([.?@])?(.*)/.exec(i5);
            d3.push({ type: 1, index: c4, name: e4[2], strings: s5, ctor: "." === e4[1] ? H : "?" === e4[1] ? I : "@" === e4[1] ? L : k }), r4.removeAttribute(t4);
          } else t4.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r4.removeAttribute(t4));
          if ($.test(r4.tagName)) {
            const t4 = r4.textContent.split(h2), s5 = t4.length - 1;
            if (s5 > 0) {
              r4.textContent = i3 ? i3.emptyScript : "";
              for (let i5 = 0; i5 < s5; i5++) r4.append(t4[i5], l2()), C.nextNode(), d3.push({ type: 2, index: ++c4 });
              r4.append(t4[s5], l2());
            }
          }
        } else if (8 === r4.nodeType) if (r4.data === o3) d3.push({ type: 2, index: c4 });
        else {
          let t4 = -1;
          for (; -1 !== (t4 = r4.data.indexOf(h2, t4 + 1)); ) d3.push({ type: 7, index: c4 }), t4 += h2.length - 1;
        }
        c4++;
      }
    }
    static createElement(t3, i5) {
      const s4 = r3.createElement("template");
      return s4.innerHTML = t3, s4;
    }
  };
  function S2(t3, i5, s4 = t3, e4) {
    if (i5 === T) return i5;
    let h3 = void 0 !== e4 ? s4._$Co?.[e4] : s4._$Cl;
    const o5 = c3(i5) ? void 0 : i5._$litDirective$;
    return h3?.constructor !== o5 && (h3?._$AO?.(false), void 0 === o5 ? h3 = void 0 : (h3 = new o5(t3), h3._$AT(t3, s4, e4)), void 0 !== e4 ? (s4._$Co ??= [])[e4] = h3 : s4._$Cl = h3), void 0 !== h3 && (i5 = S2(t3, h3._$AS(t3, i5.values), h3, e4)), i5;
  }
  var M = class {
    constructor(t3, i5) {
      this._$AV = [], this._$AN = void 0, this._$AD = t3, this._$AM = i5;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t3) {
      const { el: { content: i5 }, parts: s4 } = this._$AD, e4 = (t3?.creationScope ?? r3).importNode(i5, true);
      C.currentNode = e4;
      let h3 = C.nextNode(), o5 = 0, n4 = 0, l3 = s4[0];
      for (; void 0 !== l3; ) {
        if (o5 === l3.index) {
          let i6;
          2 === l3.type ? i6 = new R(h3, h3.nextSibling, this, t3) : 1 === l3.type ? i6 = new l3.ctor(h3, l3.name, l3.strings, this, t3) : 6 === l3.type && (i6 = new z(h3, this, t3)), this._$AV.push(i6), l3 = s4[++n4];
        }
        o5 !== l3?.index && (h3 = C.nextNode(), o5++);
      }
      return C.currentNode = r3, e4;
    }
    p(t3) {
      let i5 = 0;
      for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t3, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t3[i5])), i5++;
    }
  };
  var R = class _R {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t3, i5, s4, e4) {
      this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t3, this._$AB = i5, this._$AM = s4, this.options = e4, this._$Cv = e4?.isConnected ?? true;
    }
    get parentNode() {
      let t3 = this._$AA.parentNode;
      const i5 = this._$AM;
      return void 0 !== i5 && 11 === t3?.nodeType && (t3 = i5.parentNode), t3;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t3, i5 = this) {
      t3 = S2(this, t3, i5), c3(t3) ? t3 === E || null == t3 || "" === t3 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t3 !== this._$AH && t3 !== T && this._(t3) : void 0 !== t3._$litType$ ? this.$(t3) : void 0 !== t3.nodeType ? this.T(t3) : u2(t3) ? this.k(t3) : this._(t3);
    }
    O(t3) {
      return this._$AA.parentNode.insertBefore(t3, this._$AB);
    }
    T(t3) {
      this._$AH !== t3 && (this._$AR(), this._$AH = this.O(t3));
    }
    _(t3) {
      this._$AH !== E && c3(this._$AH) ? this._$AA.nextSibling.data = t3 : this.T(r3.createTextNode(t3)), this._$AH = t3;
    }
    $(t3) {
      const { values: i5, _$litType$: s4 } = t3, e4 = "number" == typeof s4 ? this._$AC(t3) : (void 0 === s4.el && (s4.el = N.createElement(P(s4.h, s4.h[0]), this.options)), s4);
      if (this._$AH?._$AD === e4) this._$AH.p(i5);
      else {
        const t4 = new M(e4, this), s5 = t4.u(this.options);
        t4.p(i5), this.T(s5), this._$AH = t4;
      }
    }
    _$AC(t3) {
      let i5 = A.get(t3.strings);
      return void 0 === i5 && A.set(t3.strings, i5 = new N(t3)), i5;
    }
    k(t3) {
      a2(this._$AH) || (this._$AH = [], this._$AR());
      const i5 = this._$AH;
      let s4, e4 = 0;
      for (const h3 of t3) e4 === i5.length ? i5.push(s4 = new _R(this.O(l2()), this.O(l2()), this, this.options)) : s4 = i5[e4], s4._$AI(h3), e4++;
      e4 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e4), i5.length = e4);
    }
    _$AR(t3 = this._$AA.nextSibling, i5) {
      for (this._$AP?.(false, true, i5); t3 !== this._$AB; ) {
        const i6 = t3.nextSibling;
        t3.remove(), t3 = i6;
      }
    }
    setConnected(t3) {
      void 0 === this._$AM && (this._$Cv = t3, this._$AP?.(t3));
    }
  };
  var k = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t3, i5, s4, e4, h3) {
      this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t3, this.name = i5, this._$AM = e4, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = E;
    }
    _$AI(t3, i5 = this, s4, e4) {
      const h3 = this.strings;
      let o5 = false;
      if (void 0 === h3) t3 = S2(this, t3, i5, 0), o5 = !c3(t3) || t3 !== this._$AH && t3 !== T, o5 && (this._$AH = t3);
      else {
        const e5 = t3;
        let n4, r4;
        for (t3 = h3[0], n4 = 0; n4 < h3.length - 1; n4++) r4 = S2(this, e5[s4 + n4], i5, n4), r4 === T && (r4 = this._$AH[n4]), o5 ||= !c3(r4) || r4 !== this._$AH[n4], r4 === E ? t3 = E : t3 !== E && (t3 += (r4 ?? "") + h3[n4 + 1]), this._$AH[n4] = r4;
      }
      o5 && !e4 && this.j(t3);
    }
    j(t3) {
      t3 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t3 ?? "");
    }
  };
  var H = class extends k {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t3) {
      this.element[this.name] = t3 === E ? void 0 : t3;
    }
  };
  var I = class extends k {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t3) {
      this.element.toggleAttribute(this.name, !!t3 && t3 !== E);
    }
  };
  var L = class extends k {
    constructor(t3, i5, s4, e4, h3) {
      super(t3, i5, s4, e4, h3), this.type = 5;
    }
    _$AI(t3, i5 = this) {
      if ((t3 = S2(this, t3, i5, 0) ?? E) === T) return;
      const s4 = this._$AH, e4 = t3 === E && s4 !== E || t3.capture !== s4.capture || t3.once !== s4.once || t3.passive !== s4.passive, h3 = t3 !== E && (s4 === E || e4);
      e4 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t3), this._$AH = t3;
    }
    handleEvent(t3) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t3) : this._$AH.handleEvent(t3);
    }
  };
  var z = class {
    constructor(t3, i5, s4) {
      this.element = t3, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t3) {
      S2(this, t3);
    }
  };
  var j = t2.litHtmlPolyfillSupport;
  j?.(N, R), (t2.litHtmlVersions ??= []).push("3.3.1");
  var B = (t3, i5, s4) => {
    const e4 = s4?.renderBefore ?? i5;
    let h3 = e4._$litPart$;
    if (void 0 === h3) {
      const t4 = s4?.renderBefore ?? null;
      e4._$litPart$ = h3 = new R(i5.insertBefore(l2(), t4), t4, void 0, s4 ?? {});
    }
    return h3._$AI(t3), h3;
  };

  // node_modules/lit-element/lit-element.js
  var s3 = globalThis;
  var i4 = class extends y {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      const t3 = super.createRenderRoot();
      return this.renderOptions.renderBefore ??= t3.firstChild, t3;
    }
    update(t3) {
      const r4 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t3), this._$Do = B(r4, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(true);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(false);
    }
    render() {
      return T;
    }
  };
  i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
  var o4 = s3.litElementPolyfillSupport;
  o4?.({ LitElement: i4 });
  (s3.litElementVersions ??= []).push("4.2.1");

  // packages/fucodo-image-crop-dialog/index.js
  var import_croppie = __toESM(require_croppie(), 1);

  // packages/fucodo-image-crop-dialog/croppie.scss
  var croppie_default = `@charset "UTF-8";
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
  content: "";
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
  /*border: 1px solid white; */ /*fix for FF unable to apply focus style bug */
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
  content: "\u21BA";
}

.cr-rotate-r i:before {
  content: "\u21BB";
}`;

  // packages/fucodo-image-crop-dialog/style.scss
  var style_default = `.dialog {
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
}`;

  // packages/fucodo-image-crop-dialog/index.js
  var ImageCrop = class extends i4 {
    static get properties() {
      return {
        width: { type: Number, attribute: true },
        height: { type: Number, attribute: true }
      };
    }
    constructor() {
      super();
      this.width = 400;
      this.height = 400;
    }
    static styles = i`
    ${r(croppie_default)}
    ${r(style_default)}
  `;
    render() {
      return x`
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
    `;
    }
    firstUpdated() {
      const scale = 400 / Math.max(this.width, this.height);
      this._croppie = new import_croppie.default(this.renderRoot.querySelector(".dialog__body"), {
        viewport: {
          width: this.width * scale,
          height: this.height * scale,
          type: "square",
          showZoomer: false
        }
      });
    }
    handleChange(event) {
      const dialog = this.renderRoot.querySelector("dialog");
      if (event.target.files === 0) {
        return;
      }
      this._file = event.target.files[0];
      dialog.showModal();
      this._croppie.bind({
        url: URL.createObjectURL(this._file)
      });
    }
    handleCancel(event) {
      event.preventDefault();
      this.renderRoot.querySelector("slot").assignedElements().forEach((input) => {
        input.value = "";
      });
      this.renderRoot.querySelector("dialog")?.close();
    }
    handleConfirm(event) {
      event.preventDefault();
      const options = {
        type: "rawcanvas",
        size: "original",
        format: "png",
        quality: 1,
        circle: false
      };
      this._croppie.result(options).then((canvas) => {
        if (canvas.width > this.width || canvas.height > this.height) {
          this.rescaleCanvas(canvas);
        }
        canvas.toBlob((blob) => {
          const name = this._file.name ? this._file.name.split(".").slice(0, -1).join(".") : "image";
          const file = new File([blob], name + ".png", { type: "image/png" });
          const input = this.renderRoot.querySelector("slot").assignedElements()[0];
          const transfer = new DataTransfer();
          transfer.items.add(file);
          input.files = transfer.files;
          this.renderRoot.querySelector("dialog").close();
        });
      });
    }
    rescaleCanvas(srcCanvas) {
      let srcContext = srcCanvas.getContext("2d");
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      canvas.width = this.width;
      canvas.height = this.height;
      context.drawImage(srcCanvas, 0, 0, this.width, this.height);
      srcCanvas.width = this.width;
      srcCanvas.height = this.height;
      srcContext.drawImage(canvas, 0, 0);
    }
  };
  customElements.define("fucodo-image-crop-dialog", ImageCrop);
})();
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
