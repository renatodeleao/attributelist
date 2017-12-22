class AttributeList {
  static toCamelCase(str){
    return str.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2, offset) =>  p2 ? p2.toUpperCase() : p1.toLowerCase());
  }

  static parseAttributeTokenList(tlist, functionName){
    let parsed = [];
    for (let i = 0; i < tlist.length; i++) {
      var attr = tlist[i];

      if (attr.split(' ').length > 1) {
        throw new Error("Failed to execute '" + functionName + "' on 'TokenList': The token provided ('" + attr + "') contains HTML space characters, which are not valid in tokens.');");
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
  }

  add(attr){
    var parsed = AttributeList.parseAttributeTokenList(arguments, 'add');
    parsed.forEach(token => {
      if (this.tokenList.indexOf(token) === -1){
        this.tokenList.push(token)
      }
    })

    this.el.setAttribute(this.attributeName, this.tokenList.join(" "))
  }
}

export function $al(el) {
  function toCamelCase(str){
    return str.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2, offset) =>  p2 ? p2.toUpperCase() : p1.toLowerCase());
  }

  var al = el.getAttributeNames();
  let obj = {};

  al.forEach(attr =>  {
    var camelCased = toCamelCase(attr);
    obj[camelCased] = new AttributeList(el, attr)
  });

  return obj
}
