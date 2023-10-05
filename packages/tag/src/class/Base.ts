import { isConstructor, isNone } from "@dunes/tools";
import { Content } from "./Content";
import { Descendants, Properties, Template, TemplateFunctionParam, Thing } from "../types";

abstract class Base<P extends {[key: string]: any}> implements Thing {
	static type: "elem" | "comp"

	static isElement(x: unknown): x is JSX.Element {
		return (x != null) && (
			x instanceof Elem || x instanceof Comp || (
				typeof x === "object" && "type" in x && (
					x.type === "elem" || x.type === "comp"
				)
			)
		)
	}

	static create(
		temp: Template, 
		props: Properties, 
		...
		desc: Descendants
	): JSX.Element
	{
		if (typeof temp === "function") {
			if (isConstructor(temp)) {
				if (temp.type === "elem") {
					throw "Cannot extend Elem yet"
				}
				return new temp(temp, props, desc);
			}
			else {
				return new Comp(temp, props, desc)
			}
		}
		return new Elem(temp as "div", props, desc);
	}

	abstract type: "elem" | "comp"
	abstract readonly temp: Template

	readonly kind = "element";

	abstract appendTo(elem: HTMLElement): HTMLElement
	abstract replace(elem: HTMLElement): HTMLElement

	#children: Child[] = [];
	#parent: null | JSX.Element = null;
	#original: null | JSX.Element = null;
	#root: null | HTMLElement = null;

	constructor(public props: P, desc: Descendants) {
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

	get desc(): Child[] {
		return this.#children;
	}

	set desc(children: unknown[]) {
		this.#children = [];

		for (const child of children.flat().filter(e => e || e !== 0)) {
			if (Base.isElement(child)) {
				child.#parent = this as unknown as JSX.Element;
				this.#children.push(child)
			}
			else {
				this.#children.push(new Content(child))
			}
		}
	}

	re(props?: Partial<P>) {
		if (!this.root) throw "Not rooted";

		if (props) for (const key in props) {
			// @ts-expect-error
			this.props[key] = props[key];
		}

		this.replace(this.root);
	}
}
export class Elem<T extends TagName = "div"> extends Base<JSX.IntrinsicElements[T]> {
	static override readonly type = "elem";
	readonly type = Elem.type

	constructor(readonly temp: T, props: JSX.IntrinsicElements[T] | null, desc: Descendants) {
		super(props || {}, desc);
	}

	isTag<Tn extends TagName>(name: Tn): this is Elem<Tn> {
		return this.temp as TagName === name;
	}

	override toString(n = 0): string {
	  
		const self = ["input", "meta"].includes(this.temp);

		let str = `<${this.temp}`;

		for (const [name, value] of Object.entries(this.props)) {
			if (typeof value === "function") continue;
			str += " " + name;
			if (value === true) {
				continue
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
			str += "\t".repeat(n-1)
		}

		str += `</${this.temp}>`

		return str;
	}

	#createNode(): HTMLElement {
	  const node = document.createElement(this.temp);

		for (let [name, value] of Object.entries(this.props)) {
	  	if (name.startsWith("on")) {
	  		node.addEventListener(
	  			name.replace(/^on/, ""), 
	  			e => value.bind(node)(e)
	  		)
	  	}
	  	else if (isNone(value) && value !== false) {
	  		continue;
	  	}
	  	else {
	  		if (name == "cl") {
					name = "class"
				}
				node.setAttribute(name, value.toString());
	  	}
	  }

	  return node;
	}

	override appendTo(elem: HTMLElement) {
	  const node = this.#createNode();

	  for (const child of this.desc) {
	  	if (child.kind === "element") {
	  		child.appendTo(node);
	  	}
	  	else {
	  		node.append(child.toString());
	  	}
	  }

	  elem.append(node);
	  this.root = node;
		return node;
	}

	override replace(elem: HTMLElement) {
	  const node = this.#createNode();

	  for (const child of this.desc) {
	  	if (child.kind === "element") {
	  		child.appendTo(node);
	  	}
	  	else {
	  		node.append(child.toString());
	  	}
	  }

	  elem.replaceWith(node);
	  this.root = node;
		return node;
	}

}

export class Comp<P extends { [key: string]: any; } = any> extends Base<P> {
	static override readonly type = "comp";
	readonly type = Comp.type;

	constructor(readonly temp: TemplateFunctionParam, props: P | null, desc: Descendants) {
		super(props || {} as P, desc);
	}

	protected produce(): JSX.Element {
		if (isConstructor(this.temp)) {
			throw "Override produce in a class component";
		}

		return this.temp(this.props, this);
	}

	override toString(n = 0): string {
		return this.template().toString(n);
	}

	template() {
		(this.props as any).desc = this.desc;
		const elem = this.produce();
		elem.original = this;

		return elem;
	}

	override appendTo(elem: HTMLElement): HTMLElement {
		const node = this.template().appendTo(elem);
		this.root = node;
		return node;

	}

	override replace(elem: HTMLElement): HTMLElement {
		const node = this.template().replace(elem);
		this.root = node;
		return node;
	}
}
