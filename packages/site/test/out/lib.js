/* Test whether `x` is none */
function isNone(x) {
  return x === null || x === undefined || x === false;
}
/* Test is function `fn` is a constructor */
function isConstructor(fn) {
  return String(fn).startsWith("class");
}

class Content {
  value;
  kind = "content";
  constructor(value) {
    this.value = value;
  }
  toString() {
    return String(this.value);
  }
}

class Base {
  props;
  static type;
  static isElement(x) {
    return x != null && (x instanceof Elem || x instanceof Comp || typeof x === "object" && "type" in x && (x.type === "elem" || x.type === "comp"));
  }
  static create(temp, props, ...desc) {
    if (typeof temp === "function") {
      if (isConstructor(temp)) {
        if (temp.type === "elem") {
          throw "Cannot extend Elem yet";
        }
        return new temp(temp, props, desc);
      } else {
        return new Comp(temp, props, desc);
      }
    }
    return new Elem(temp, props, desc);
  }
  kind = "element";
  #children = [];
  #parent = null;
  #original = null;
  #root = null;
  constructor(props, desc) {
    this.props = props;
    this.desc = desc;
  }
  get parent() {
    return this.#parent;
  }
  get original() {
    return this.#original;
  }
  set original(value) {
    this.#original = value;
  }
  get root() {
    return this.#root;
  }
  set root(value) {
    this.#root = value;
  }
  get desc() {
    return this.#children;
  }
  set desc(children) {
    this.#children = [];
    for (const child of children.flat().filter(e => e || e !== 0)) {
      if (Base.isElement(child)) {
        child.#parent = this;
        this.#children.push(child);
      } else if (!isNone(child)) {
        this.#children.push(new Content(child));
      }
    }
  }
}
class Elem extends Base {
  temp;
  static type = "elem";
  type = Elem.type;
  constructor(temp, props, desc) {
    super(props || {}, desc);
    this.temp = temp;
  }
  isTag(name) {
    return this.temp === name;
  }
  static SELF = ["area", "base", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source"];
  toString(n = 0) {
    const self = Elem.SELF.includes(this.temp);
    let str = `<${this.temp}`;
    for (const [name, value] of Object.entries(this.props)) {
      if (typeof value === "function") continue;
      str += " " + name;
      if (value === true) {
        continue;
      }
      if (value === false || value) {
        str += "=" + JSON.stringify(value);
      }
    }
    str += self ? "/>" : ">";
    if (self) return str;
    for (const child of this.desc) {
      str += "\n" + "\t".repeat(n) + child.toString(n + 1);
    }
    if (this.desc.length) {
      str += "\n";
    }
    if (n) {
      str += "\t".repeat(n - 1);
    }
    str += `</${this.temp}>`;
    return str;
  }
  #createNode() {
    const node = document.createElement(this.temp);
    for (let [name, value] of Object.entries(this.props)) {
      if (name.startsWith("on")) {
        node.addEventListener(name.replace(/^on/, ""), e => value.bind(node)(e));
      } else if (isNone(value) && value !== false) {
        continue;
      } else {
        if (name == "cl") {
          name = "class";
        }
        node.setAttribute(name, value.toString());
      }
    }
    return node;
  }
  appendTo(elem) {
    const node = this.#createNode();
    for (const child of this.desc) {
      if (child.kind === "element") {
        child.appendTo(node);
      } else {
        node.append(child.toString());
      }
    }
    elem.append(node);
    this.root = node;
    return node;
  }
  replace(elem) {
    const node = this.#createNode();
    for (const child of this.desc) {
      if (child.kind === "element") {
        child.appendTo(node);
      } else {
        node.append(child.toString());
      }
    }
    elem.replaceWith(node);
    this.root = node;
    return node;
  }
}
class Comp extends Base {
  temp;
  static type = "comp";
  type = Comp.type;
  constructor(temp, props, desc) {
    super(props || {}, desc);
    this.temp = temp;
  }
  produce() {
    if (isConstructor(this.temp)) {
      throw "Override produce in a class component";
    }
    return this.temp(this.props, this);
  }
  toString(n = 0) {
    return this.template().toString(n);
  }
  template() {
    this.props.desc = this.desc;
    const elem = this.produce();
    elem.original = this;
    return elem;
  }
  willRender() {}
  hasRendered() {}
  willDestroy() {}
  re(props) {
    if (!this.root) throw "Not rooted";
    this.willDestroy();
    if (props) for (const key in props) {
      // @ts-expect-error
      this.props[key] = props[key];
    }
    this.replace(this.root);
  }
  appendTo(elem) {
    this.willRender();
    const node = this.template().appendTo(elem);
    this.root = node;
    this.hasRendered();
    return node;
  }
  replace(elem) {
    this.willRender();
    const node = this.template().replace(elem);
    this.root = node;
    this.hasRendered();
    return node;
  }
}

