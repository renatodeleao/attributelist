// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({9:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$attributeList = $attributeList;
exports.dangerouslyExtendElementPrototypeWithAttributeList = dangerouslyExtendElementPrototypeWithAttributeList;
/*
 * @name AttributeList
 * @description manipulated attributes with a classList like API
 *
 * @param {HTMLElement} el — target element
 * @param {String} attributeName — The name of the attribute that will get superpowers
 */
class AttributeList {
  static parseAttributeFakeTokenList(tlist, functionName) {
    let parsed = [];
    for (let i = 0; i < tlist.length; i++) {
      var attr = tlist[i];

      if (attr.split(' ').length > 1) {
        throw new Error("Failed to execute '" + functionName + "' on 'FakeTokenList': The token provided ('" + attr + "') contains HTML space characters, which are not valid in tokens.');");
      } else {
        parsed.push(attr);
      }
    }

    return parsed;
  }

  constructor(el, attributeName) {
    this.el = el;
    this.attributeName = attributeName;

    if (this.el.getAttribute(attributeName) > 0) {
      this.tokenList = this.el.getAttribute(attributeName).split(" ").filter(t => t !== "");
    }
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  add(attr) {
    var parsed = AttributeList.parseAttributeFakeTokenList(arguments, 'add');
    parsed.forEach(token => {
      if (this.tokenList.indexOf(token) === -1) {
        this.tokenList.push(token);
      }
    });

    this.el.setAttribute(this.attributeName, this.tokenList.join(" "));
  }

  remove(attr) {
    var parsed = AttributeList.parseAttributeFakeTokenList(arguments, 'add');
    parsed.forEach(token => {
      let pos = this.tokenList.indexOf(token);
      if (pos > -1) {
        this.tokenList.splice(pos, 1);
      }
    });

    this.el.setAttribute(this.attributeName, this.tokenList.join(" "));
  }

  toggle(attr) {
    let pos = this.tokenList.indexOf(attr);
    if (pos > -1) {
      this.remove(attr);
    } else {
      this.add(attr);
    }
    this.el.setAttribute(this.attributeName, this.tokenList.join(" "));
  }
}

exports.AttributeList = AttributeList; // Helper

function toCamelCase(str) {
  return str.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2, offset) => p2 ? p2.toUpperCase() : p1.toLowerCase());
}

function getAttributes(el) {
  return el.getAttributeNames().filter(a => a !== "id" && a !== "class");
}

function mapAttributeToInstance(el, al) {
  let _alObj = {};

  if (al.length > 0) {
    al.forEach(attr => {
      let camelCased = toCamelCase(attr.replace("data-", ""));
      _alObj[camelCased] = new AttributeList(el, attr);
    });
  }

  return _alObj;
}

/*
 * @name $attributeList
 * @description AttributeList Wrapper Mode, se like _loadash or jquery
 *
 * @param {HTMLElement|String} el — target element
 */
function $attributeList(el) {
  // Sidebar element query if there's no one, throw error.
  let _el = 'string' === typeof el ? document.querySelector(el) : el;
  if ('undefined' === typeof el) throw new Error("There is no specific sidebar element.");

  // todo: should we remove other attributes from manipulation and only leave data-attributes??
  let al = getAttributes(el);
  let alObj = mapAttributeToInstance(el, al);

  return alObj;
}

/*
 * [DANGEROUS] USE at your own Risk
 *
 * @function dangerouslyExtendElementPrototype
 *
 * @description Dangerous because i'm a designer and i don't have
 * enough javaScript (programming) nerdery to fully
 * understand how bad is what i'm doing here
 */
function dangerouslyExtendElementPrototypeWithAttributeList() {
  if (!Element.prototype.attributeList) {
    Object.defineProperty(Element.prototype, "attributeList", {
      get: function () {
        let al = getAttributes(this);
        let alObj = mapAttributeToInstance(this, al);

        Object.defineProperty(this, "attributeList", {
          value: alObj
        });

        return this.attributeList;
      },
      configurable: true,
      writeable: false
    });
  }
}
},{}],6:[function(require,module,exports) {
'use strict';

var _index = require('../lib/index.js');

console.log("hello world");

window.$al = _index.$attributeList;

(0, _index.dangerouslyExtendElementPrototypeWithAttributeList)();

function toggleClass() {
    console.log('toggled');
}
// Select the node that will be observed for mutations
var targetNode = document.querySelector('.js-observe');

var instance = new _index.AttributeList(targetNode);
// Options for the observer (which mutations to observe)
var config = { attributes: true, childList: true };

// Callback function to execute when mutations are observed
var callback = function (mutationsList) {
    for (var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            console.log('A child node has been added or removed.');
        } else if (mutation.type == 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
            toggleClass();
        }
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
},{"../lib/index.js":9}],13:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var ws = new WebSocket('ws://' + hostname + ':' + '57141' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[13,6])
//# sourceMappingURL=/dist/c8138a811a7d2fd667e4faf396485fb5.map