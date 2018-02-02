/*
 * @name AttributeList
 * @description manipulated attributes with a classList like API
 *
 * @param {HTMLElement} el — target element
 * @param {String} attributeName — The name of the attribute that will get superpowers
 */
export class AttributeList {
  static parseAttributeFakeTokenList(tlist, functionName){
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

  constructor(el, attributeName){
    this.el = el;
    this.attributeName = attributeName;
    this.tokenList = this.el.getAttribute(attributeName).split(" ").filter(t => t !== "");

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  add(attr){
    var parsed = AttributeList.parseAttributeFakeTokenList(arguments, 'add');
    parsed.forEach(token => {
      if (this.tokenList.indexOf(token) === -1){
        this.tokenList.push(token)
      }
    })

    this.el.setAttribute(this.attributeName, this.tokenList.join(" "))
  }

  remove(attr){
    var parsed = AttributeList.parseAttributeFakeTokenList(arguments, 'add');
    parsed.forEach(token => {
      let pos = this.tokenList.indexOf(token)
      if (pos > -1){
        this.tokenList.splice(pos, 1)
      }
    })

    this.el.setAttribute(this.attributeName, this.tokenList.join(" "))
  }

  toggle(attr){
    let pos = this.tokenList.indexOf(attr)
    if (pos > -1){
      this.remove(attr)
    } else {
      this.add(attr)
    }
    this.el.setAttribute(this.attributeName, this.tokenList.join(" "))
  }
}


// Helper
function toCamelCase(str){
  return str.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2, offset) =>  p2 ? p2.toUpperCase() : p1.toLowerCase());
}


/*
 * @name $attributeList
 * @description AttributeList Wrapper Mode, se like _loadash or jquery
 *
 * @param {HTMLElement|String} el — target element
 */
export function $attributeList(el) {
  // Sidebar element query if there's no one, throw error.
  let _el = ('string' === typeof el ) ? document.querySelector(el) : el;
  if( 'undefined' === typeof el )
    throw new Error("There is no specific sidebar element.");

  // todo: should we remove other attributes from manipulation and only leave data-attributes??
  let al = _el.getAttributeNames().filter(a => a !== "id" && a !== "class");
  let alObj = {};

  al.forEach(attr =>  {
    let camelCased = toCamelCase(attr.replace("data-", ""));
    alObj[camelCased] = new AttributeList(_el, attr)
  });

  return alObj
}


/*
 * [DANGEROUS]
 *
 * @function dangerouslyExtendElementPrototype
 *
 * @description Dangerous because i'm a designer and i don't have
 * enough javaScript (programming) nerdery to fully
 * understand how bad is what i'm doing here
 */
export function dangerouslyExtendElementPrototype(){
  Object.defineProperty(Element.prototype, "yolo", {
    get: function () {
      let al = this.getAttributeNames();
      al.forEach(attr =>  {
        var camelCased = toCamelCase(attr.replace("data-", ""));
        Object.defineProperty(this, "yolo", {
          value: {
            [attr]: new AttributeList(this, attr)
          }
        });
      });

      return this.yolo;
    },
    configurable: true,
    writeable: false
  });
}

