import { isConstructor, isNone } from "@dunes/tools";

interface Thing {
	kind: "content" | "element"
	toString(n?: number): string
}

class Content implements Thing {
	readonly kind = "content";

	constructor(public value: unknown) {}

	toString(): string {
	  return String(this.value);
	}
}

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

export class Comp<P extends {[key: string]: any} = any> extends Base<P> {
	static override readonly type = "comp";
	readonly type = Comp.type

	constructor(readonly temp: TemplateFunctionParam, props: P | null, desc: Descendants) {
		super(props || {} as P, desc);
	}

	protected produce(): JSX.Element {
		if (isConstructor(this.temp)) {
			throw "Override produce in a class component"
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

declare global {
	namespace JSX {
		type Element = AnyElem;
		type ElementClass = AnyElem;
		type IntrinsicElements = {
			a: Elements.Anchor
			abbr: Elements.Other
			/** @deprecated*/
			acronym: Elements.Dep
			address: Elements.Other
			applet: Elements.Other
			area: Elements.Area
			article: Elements.Other
			aside: Elements.Other
			audio: Elements.Audio
			b: Elements.Other
			base: Elements.Base
			/** @deprecated*/
			basefont: Elements.Dep
			bdi: Elements.Other
			bdo: Elements.Other
			/** @deprecated*/
			big: Elements.Dep
			/** @deprecated*/
			blockquote: Elements.Other
			body: Elements.Body
			br: Elements.Br
			button: Elements.Button
			canvas: Elements.Canvas
			caption: Elements.Other
			/** @deprecated*/
			center: Elements.Dep
			cite: Elements.Other
			code: Elements.Other
			col: Elements.Other
			colgroup: Elements.Other
			data: Elements.Data
			datalist: Elements.DataList
			dd: Elements.Other
			del: Elements.Other
			details: Elements.Details
			dfn: Elements.Other
			dialog: Elements.Dialog
			/**@deprecated*/ 
			dir: Elements.Dep
			div: Elements.Div
			dl: Elements.DList
			dt: Elements.Other
			em: Elements.Other
			embed: Elements.Embed
			fieldset: Elements.FieldSet
			figcaption: Elements.Other
			figure: Elements.Other
			font: Elements.Dep
			footer: Elements.Other
			form: Elements.Form
			frame: Elements.Dep
			frameset: Elements.Dep
			h1: Elements.Heading
			h2: Elements.Heading
			h3: Elements.Heading
			h4: Elements.Heading
			h5: Elements.Heading
			h6: Elements.Heading
			head: Elements.Head
			header: Elements.Other
			hr: Elements.Hr
			html: Elements.Html
			i: Elements.Other
			iframe: Elements.IFrame
			img: Elements.Image
			input: Elements.Input
			ins: Elements.Other
			kbd: Elements.Other
			label: Elements.Label
			legend: Elements.Legend
			li: Elements.LI
			link: Elements.Link
			main: Elements.Other
			map: Elements.Map
			mark: Elements.Other
			meta: Elements.Meta
			meter: Elements.Meter
			menu: Elements.Menu
			mod: Elements.Mod
			nav: Elements.Other
			noframes: Elements.Dep
			noscript: Elements.Other
			object: Elements.Object
			ol: Elements.OList
			optgroup: Elements.OptGroup
			option: Elements.Option
			output: Elements.Output
			p: Elements.Paragraph
			param: Elements.Param
			picture: Elements.Picture
			pre: Elements.Pre
			progress: Elements.Progress
			q: Elements.Quote
			rp: Elements.Other
			rt: Elements.Other
			ruby: Elements.Other
			s: Elements.Other
			samp: Elements.Other
			script: Elements.Script
			section: Elements.Other
			select: Elements.Select
			small: Elements.Other
			slot: Elements.Slot
			source: Elements.Source
			span: Elements.Span
			strike: Elements.Dep
			strong: Elements.Other
			style: Elements.Style
			sub: Elements.Other
			summary: Elements.Other
			sup: Elements.Other
			table: Elements.Table
			tbody: Elements.Other
			td: Elements.TableCell
			template: Elements.Template
			textarea: Elements.TextArea
			tfoot: Elements.Other
			th: Elements.Other
			thead: Elements.Other
			time: Elements.Time
			title: Elements.Title
			tr: Elements.Other
			track: Elements.Track
			/**@deprecated*/
			tt: Elements.Dep
			u: Elements.Other
			ul: Elements.UList
			"var": Elements.Other
			video: Elements.Video
			wbr: Elements.Other

			svg: Elements.SVG

			animate: Elements.SVG
			animateMotion: Elements.SVG
			animateTransform: Elements.SVG
			circle: Elements.SVGCircle
			clipPath: Elements.SVGClipPath
			defs: Elements.SVGDefs
			desc: Elements.SVGDesc
			ellipse: Elements.SVGEllipse
			feBlend: Elements.SVGFEBlend
			feColorMatrix: Elements.SVGFEColorMatrix
			feComponentTransfer: Elements.SVGFEComponentTransfer
			feComposite: Elements.SVGFEComposite
			feConvolveMatrix: Elements.SVGFEConvolveMatrix
			feDiffuseLighting: Elements.SVGFEDiffuseLighting
			feDisplacementMap: Elements.SVGFEDisplacementMap
			feDistantLight: Elements.SVGFEDistantLight
			feDropShadow: Elements.SVGFEDropShadow
			feFlood: Elements.SVGFEFlood
			feFuncA: Elements.SVGFEFunc
			feFuncB: Elements.SVGFEFunc
			feFuncG: Elements.SVGFEFunc
			feFuncR: Elements.SVGFEFunc
			feGaussianBlur: Elements.SVGFEGaussianBlur
			feImage: Elements.SVGFEImage
			feMerge: Elements.SVGFEMerge
			feMergeNode: Elements.SVGFEMergeNode
			feMorphology: Elements.SVGFEMorphology
			feOffset: Elements.SVGFEOffset
			fePointLight: Elements.SVGFEPointLight
			feSpecularLighting: Elements.SVGFESpecularLighting
			feSpotLight: Elements.SVGFESpotLight
			feTile: Elements.SVGFETile
			feTurbulence: Elements.SVGFETurbulence
			filter: Elements.SVGFilter
			foreignObject: Elements.SVGForeignObject
			g: Elements.SVGG
			image: Elements.SVGImage
			line: Elements.SVGLine
			linearGradient: Elements.SVGLinearGradient
			marker: Elements.SVGMarker
			mask: Elements.SVGMask
			metadata: Elements.SVGMetadata
			mpath: Elements.SVG
			path: Elements.SVGPath
			pattern: Elements.SVGPattern
			polygon: Elements.SVGPolygon
			polyline: Elements.SVGPolyline
			radialGradient: Elements.SVGRadialGradient
			rect: Elements.SVGRect
			stop: Elements.SVGStop
			switch: Elements.SVGSwitch
			symbol: Elements.SVGSymbol
			text: Elements.SVGText
			textPath: Elements.SVGTextPath
			tspan: Elements.SVGTSpan
			use: Elements.SVGUse
			view: Elements.SVGView
		};

		interface IntrinsicAttributes {
			i?: number
			desc?: unknown
		}

    interface ElementAttributesProperty { props: {} }
    interface ElementChildrenAttribute { desc: {} }

    interface LibraryManagedAttributes {}
    interface IntrinsicClassAttributes {}
	}
}

export type TagName = keyof JSX.IntrinsicElements;


export type Template = TagName | TemplateFunctionParam
export type Properties = null | obj
export type Descendants = unknown[]
export type AnyElem = Elem | Comp;

export type TemplateFunctionParam = (
	| TemplateFunction 
	| typeof Comp 
	| typeof Elem
)

export type TemplateFunction = {
	(this: Comp, props: Properties, comp: Comp): JSX.Element
}


export type Component<T extends {[key: string]: any} = {}> = {
	(this: Comp<T>, props: T, comp: Comp<T>): JSX.Element
}



type Child = JSX.Element | Content




export type CSSProperties = 
{[k in keyof CSSStyleDeclaration]: CSSStyleDeclaration[k]}

export type num = number | `${number}`;

export type bool = boolean | `${boolean}`

export type OnEvent<H extends Element, E extends Event = Event> = {
  (this: H, e: TagEvent<H, E>): any | null
}


export type TagEvent<H extends Element, E extends Event = Event> = (
  E & {
    target: H
    jsx: JSX.Element
  }
)

export type InputType = (
	| "button"
	| "checkbox"
	| "color"
	| "date"
	| "datetime-local"
	| "email"
	| "file"
	| "hidden"
	| "image"
	| "month"
	| "number"
	| "password"
	| "radio"
	| "range"
	| "reset"
	| "search"
	| "submit"
	| "tel"
	| "text"  
	| "time"
	| "url"
	| "week"
)

export type AriaRole = (
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'button'
  | 'cell'
  | 'checkbox'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'feed'
  | 'figure'
  | 'form'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem'
  | (string & {})
)

type color = string


export interface ElementDef extends JSX.IntrinsicAttributes {
  cl?: string
  style?: CSSProperties | string;
}

interface element<E extends Element = Element> extends ElementDef {

  id?: string
  // class: string
  animate?: string
  attributes?: string
  localname?: string
  namespaceURI?: string
  onbeforeload?: OnEvent<E>
  onfocusin?: OnEvent<E, FocusEvent>
  onfocusout?: OnEvent<E, FocusEvent>
  onwebkitcurrentplaybacktargetiswirelesschanged?: OnEvent<E>
  onwebkitfullscreenchange?: OnEvent<E>
  onwebkitfullscreenerror?: OnEvent<E>
  onwebkitneedkey?: OnEvent<E>
  onwebkitplaybacktargetavailabilitychanged?: OnEvent<E>
  onwebkitpresentationmodechanged?: OnEvent<E>
  part?: string
  prefix?: string
  role?: AriaRole
  shadowroot?: unknown
  slot?: string

  ariaatomic?: string
  ariaautocomplete?: string
  ariabusy?: string
  ariachecked?: boolean
  ariacolcount?: string
  ariacolindex?: string
  ariacolspan?: string
  ariacurrent?: string
  ariadisabled?: boolean
  ariaexpanded?: boolean
  ariahaspopup?: string
  ariahidden?: string
  ariainvalid?: string
  ariakeyshortcuts?: string
  arialabel?: string
  arialevel?: string
  arialive?: string
  ariamodal?: string
  ariamultiline?: string
  ariamultiselectable?: string
  ariaorientation?: string
  ariaplaceholder?: string
  ariaposinset?: string
  ariapressed?: boolean
  ariareadonly?: string
  ariarelevant?: string
  ariarequired?: boolean
  ariaroledescription?: string
  ariarowcount?: string
  ariarowindex?: string
  ariarowspan?: string
  ariaselected?: boolean
  ariasetsize?: string
  ariasort?: string
  ariavaluemax?: string
  ariavaluemin?: string
  ariavaluenow?: string
  ariavaluetext?: string
}

export namespace Elements {

  export interface Generic<H extends HTMLElement> extends element<H> {


    accesskey?: string
    accesskeylabel?: string
    autocorrect?: string
    autofocus?: string
    contenteditable?: boolean
    dataset?: Record<string, string>
    dir?: string
    draggable?: boolean
    enterkeyhint?: string
    hidden?: boolean
    inputmode?: string
    lang?: string
    nonce?: string
    onabort?: OnEvent<H, UIEvent>
    onanimationcancel?: OnEvent<H, AnimationEvent>
    onanimationend?: OnEvent<H, AnimationEvent>
    onanimationiteration?: OnEvent<H, AnimationEvent>
    onanimationstart?: OnEvent<H, AnimationEvent>
    onauxclick?: OnEvent<H, MouseEvent>
    onbeforecopy?: OnEvent<H>,
    onbeforecut?: OnEvent<H>,
    onbeforeinput?: OnEvent<H, InputEvent>
    onbeforepaste?: OnEvent<H>,
    onblur?: OnEvent<H, FocusEvent>
    oncancel?: OnEvent<H>,
    oncanplay?: OnEvent<H>,
    oncanplaythrough?: OnEvent<H>,
    onchange?: OnEvent<H>,
    onclick?: OnEvent<H, MouseEvent>
    onclose?: OnEvent<H>,
    oncompositionend?: OnEvent<H, CompositionEvent>
    oncompositionstart?: OnEvent<H, CompositionEvent>
    oncompositionupdate?: OnEvent<H, CompositionEvent>
    oncontextmenu?: OnEvent<H, MouseEvent>
    oncopy?: OnEvent<H>,
    oncuechange?: OnEvent<H>,
    oncut?: OnEvent<H>,
    ondblclick?: OnEvent<H, MouseEvent>
    ondrag?: OnEvent<H, DragEvent>
    ondragend?: OnEvent<H, DragEvent>
    ondragenter?: OnEvent<H, DragEvent>
    ondragleave?: OnEvent<H, DragEvent>
    ondragover?: OnEvent<H, DragEvent>
    ondragstart?: OnEvent<H, DragEvent>
    ondrop?: OnEvent<H, DragEvent>
    ondurationchange?: OnEvent<H>,
    onemptied?: OnEvent<H>,
    onended?: OnEvent<H>,
    onerror?: OnEvent<H, ErrorEvent>
    onfocus?: OnEvent<H, FocusEvent>
    // onfocusin?: OnFunction<H, FocusEvent>
    // onfocusout?: OnFunction<H, FocusEvent>
    onformdata?: OnEvent<H, FormDataEvent>
    ongotpointercapture?: OnEvent<H, PointerEvent>
    oninput?: OnEvent<H>,
    oninvalid?: OnEvent<H>,
    onkeydown?: OnEvent<H, KeyboardEvent>
    onkeypress?: OnEvent<H, KeyboardEvent>
    onkeyup?: OnEvent<H, KeyboardEvent>
    onload?: OnEvent<H>,
    onloadeddata?: OnEvent<H>,
    onloadedmetadata?: OnEvent<H>,
    onloadstart?: OnEvent<H>,
    onlostpointercapture?: OnEvent<H, PointerEvent>
    onmousedown?: OnEvent<H, MouseEvent>
    onmouseenter?: OnEvent<H, MouseEvent>
    onmouseleave?: OnEvent<H, MouseEvent>
    onmousemove?: OnEvent<H, MouseEvent>
    onmouseout?: OnEvent<H, MouseEvent>
    onmouseover?: OnEvent<H, MouseEvent>
    onmouseup?: OnEvent<H, MouseEvent>
    onmousewheel?: OnEvent<H>,
    onpaste?: OnEvent<H>,
    onpause?: OnEvent<H>,
    onplay?: OnEvent<H>,
    onplaying?: OnEvent<H>,
    onpointercancel?: OnEvent<H, PointerEvent>
    onpointerdown?: OnEvent<H, PointerEvent>
    onpointerenter?: OnEvent<H, PointerEvent>
    onpointerleave?: OnEvent<H, PointerEvent>
    onpointermove?: OnEvent<H, PointerEvent>
    onpointerout?: OnEvent<H, PointerEvent>
    onpointerover?: OnEvent<H, PointerEvent>
    onpointerup?: OnEvent<H, PointerEvent>
    onprogress?: OnEvent<H, ProgressEvent>
    onratechange?: OnEvent<H>,
    onreset?: OnEvent<H>,
    onresize?: OnEvent<H, UIEvent>
    onscroll?: OnEvent<H>,
    onsearch?: OnEvent<H>,
    onsecuritypolicyviolation?: OnEvent<H, SecurityPolicyViolationEvent>
    onseeked?: OnEvent<H>,
    onseeking?: OnEvent<H>,
    onselect?: OnEvent<H>,
    onselectionchange?: OnEvent<H>,
    onselectstart?: OnEvent<H>,
    onslotchange?: OnEvent<H>,
    onstalled?: OnEvent<H>,
    onsubmit?: OnEvent<H, SubmitEvent>
    onsuspend?: OnEvent<H>,
    ontimeupdate?: OnEvent<H>,
    ontoggle?: OnEvent<H>,
    ontouchcancel?: OnEvent<H, TouchEvent>
    ontouchend?: OnEvent<H, TouchEvent>
    ontouchmove?: OnEvent<H, TouchEvent>
    ontouchstart?: OnEvent<H, TouchEvent>
    ontransitioncancel?: OnEvent<H, TransitionEvent>
    ontransitionend?: OnEvent<H, TransitionEvent>
    ontransitionrun?: OnEvent<H, TransitionEvent>
    ontransitionstart?: OnEvent<H, TransitionEvent>
    onvolumechange?: OnEvent<H>,
    onwaiting?: OnEvent<H>,
    onwebkitanimationend?: OnEvent<H>,
    onwebkitanimationiteration?: OnEvent<H>,
    onwebkitanimationstart?: OnEvent<H>,
    onwebkitmouseforcechanged?: OnEvent<H>,
    onwebkitmouseforcedown?: OnEvent<H>,
    onwebkitmouseforceup?: OnEvent<H>,
    onwebkitmouseforcewillbegin?: OnEvent<H>,
    onwebkittransitionend?: OnEvent<H>,
    onwheel?: OnEvent<H, WheelEvent>
    spellCheck?: string
    tabIndex?: string
    title?: string
    translate?: string
  }

  export interface GenericMedia<H extends HTMLMediaElement> extends Generic<H>{
    error?: string
    src?: string
    srcObject?: string
    currentSrc?: string
    crossOrigin?: string
    networkState?: string
    preload?: string
    buffered?: boolean
    readyState?: string
    seeking?: string
    currentTime?: string
    duration?: string
    paused?: boolean
    defaultPlaybackRate?: string
    playbackRate?: string
    played?: boolean
    seekable?: string
    ended?: boolean
    autoplay?: string
    loop?: string
    controls?: string
    volume?: string
    muted?: boolean
    defaultMuted?: boolean
    webkitPreservesPitch?: string
    webkitHasClosedCaptions?: string
    webkitClosedCaptionsVisible?: string
    webkitKeys?: string
    mediaKeys?: string
    onencrypted?: OnEvent<H>,
    onwaitingforkey?: OnEvent<H>,
    audioTracks?: string
    textTracks?: string
    videoTracks?: string
    mediaGroup?: string
    controller?: string
    webkitCurrentPlaybackTargetIsWireless?: string
    remote?: string
    disableRemotePlayback?: string
    load?: string
    canPlayType?: string
    getStartDate?: string
    play?: string
    pause?: string
    fastSeek?: string
    webkitSetMediaKeys?: string
    setMediaKeys?: string
    addTextTrack?: string
    getVideoPlaybackQuality?: string
    webkitShowPlaybackTargetPicker?: string
  }

  export interface Other extends Generic<HTMLElement> {}
  export interface Anchor extends Generic<HTMLAnchorElement> {
    attributionSourceId?: string
    attributionDestination?: string
    attributionSourceNonce?: string
    charset?: string
    coords?: string
    download?: string
    hrefLang?: string
    name?: string
    ping?: string
    rel?: string
    rev?: string
    shape?: string
    target?: string
    type?: string
    text?: string
    relList?: string
    referrerPolicy?: string
    href?: string
    origin?: string
    protocol?: string
    username?: string
    password?: string
    host?: string
    hostname?: string
    port?: string
    pathname?: string
    search?: string
    hash?: string
    // toString?: string
  }
  export interface Area extends Generic<HTMLAreaElement> {
    alt?: string
    coords?: string
    noHref?: string
    ping?: string
    rel?: string
    shape?: string
    target?: string
    download?: string
    referrerPolicy?: string
    relList?: string
    href?: string
    origin?: string
    protocol?: string
    username?: string
    password?: string
    host?: string
    hostname?: string
    port?: string
    pathname?: string
    search?: string
    hash?: string
    // toString?: string
  }
  export interface Audio extends GenericMedia<HTMLAudioElement> {}
  export interface Br extends Generic<HTMLBRElement> {
    clear?: string
  }
  export interface Base extends Generic<HTMLBaseElement> {
    href?: string
    target?: string
  }
  export interface Body extends Generic<HTMLBodyElement> {
    aLink?: string
    background?: string
    bgColor?: color
    link?: string
    text?: string
    vLink?: string
    onblur?: OnEvent<HTMLBodyElement>,
    onerror?: OnEvent<HTMLBodyElement>,
    onfocus?: OnEvent<HTMLBodyElement>,
    onfocusin?: OnEvent<HTMLBodyElement>,
    onfocusout?: OnEvent<HTMLBodyElement>,
    onload?: OnEvent<HTMLBodyElement>,
    onresize?: OnEvent<HTMLBodyElement>,
    onscroll?: OnEvent<HTMLBodyElement>,
    onwebkitmouseforcechanged?: OnEvent<HTMLBodyElement>,
    onwebkitmouseforcedown?: OnEvent<HTMLBodyElement>,
    onwebkitmouseforcewillbegin?: OnEvent<HTMLBodyElement>,
    onwebkitmouseforceup?: OnEvent<HTMLBodyElement>,
    onafterprint?: OnEvent<HTMLBodyElement>,
    onbeforeprint?: OnEvent<HTMLBodyElement>,
    onbeforeunload?: OnEvent<HTMLBodyElement>,
    onhashchange?: OnEvent<HTMLBodyElement>,
    onlanguagechange?: OnEvent<HTMLBodyElement>,
    onmessage?: OnEvent<HTMLBodyElement>,
    onoffline?: OnEvent<HTMLBodyElement>,
    ononline?: OnEvent<HTMLBodyElement>,
    onpagehide?: OnEvent<HTMLBodyElement>,
    onpageshow?: OnEvent<HTMLBodyElement>,
    onpopstate?: OnEvent<HTMLBodyElement>,
    onrejectionhandled?: OnEvent<HTMLBodyElement>,
    onstorage?: OnEvent<HTMLBodyElement>,
    onunhandledrejection?: OnEvent<HTMLBodyElement>,
    onunload?: OnEvent<HTMLBodyElement>
  }
  export interface Button extends Generic<HTMLButtonElement> {
    disabled?: boolean
    form?: string
    formAction?: string
    formEnctype?: string
    formMethod?: string
    type?: string
    formNoValidate?: string
    formTarget?: string
    name?: string
    value?: string
    willValidate?: string
    validity?: string
    validationMessage?: string
    labels?: string
    checkValidity?: string
    reportValidity?: string
    setCustomValidity?: string
  }
  export interface Canvas extends Generic<HTMLCanvasElement> {
    width?: num
    height?: num
    captureStream?: string
  }
  export interface DList extends Generic<HTMLDListElement> {
    compact?: string
  }
  export interface Data extends Generic<HTMLDataElement> {
    value?: string
  }
  export interface DataList extends Generic<HTMLDataListElement> {
    options?: string
  }
  export interface Dialog extends Generic<HTMLDialogElement> {
    open?: string
    returnValue?: string
    show?: string
    showModal?: string
    close?: string
  }
  export interface Details extends Generic<HTMLDetailsElement> {
    open?: bool
  }
  export interface Directory extends Generic<HTMLDirectoryElement> {
    compact?: string
  }
  export interface Div extends Generic<HTMLDivElement> {
    align?: string
  }
  export interface Embed extends Generic<HTMLEmbedElement> {
    align?: string
    height?: num
    name?: string
    src?: string
    type?: string
    width?: num
  }
  export interface FieldSet extends Generic<HTMLFieldSetElement> {
    disabled?: boolean
    form?: string
    name?: string
    type?: string
    elements?: string
    willValidate?: string
    validity?: string
    validationMessage?: string
    checkValidity?: string
    reportValidity?: string
  }
  export interface Font extends Generic<HTMLFontElement> {
    color?: string
    face?: string
    size?: string
  }
  export interface Form extends Generic<HTMLFormElement> {
    acceptCharset?: string
    action?: string
    autocomplete?: string
    enctype?: string
    encoding?: string
    method?: string
    name?: string
    noValidate?: string
    target?: string
    rel?: string
    relList?: string
    elements?: string
    length?: string
    submit?: string
    reset?: string
    checkValidity?: string
    reportValidity?: string
  }
  export interface Frame extends Generic<HTMLFrameElement> {

    name?: string
    scrolling?: string
    src?: string
    frameBorder?: string
    longDesc?: string
    noResize?: string
    contentDocument?: string
    contentWindow?: string
    marginHeight?: string
    marginWidth?: string
    width?: num
    height?: num
    location?: string
    getSVGDocument?: string
  }
  export interface FrameSet extends Generic<HTMLFrameSetElement> {
    cols?: string
    rows?: string
    onblur?: OnEvent<HTMLFrameSetElement>,
    onerror?: OnEvent<HTMLFrameSetElement>,
    onfocus?: OnEvent<HTMLFrameSetElement>,
    onfocusin?: OnEvent<HTMLFrameSetElement>,
    onfocusout?: OnEvent<HTMLFrameSetElement>,
    onload?: OnEvent<HTMLFrameSetElement>,
    onresize?: OnEvent<HTMLFrameSetElement>,
    onscroll?: OnEvent<HTMLFrameSetElement>,
    onafterprint?: OnEvent<HTMLFrameSetElement>,
    onbeforeprint?: OnEvent<HTMLFrameSetElement>,
    onbeforeunload?: OnEvent<HTMLFrameSetElement>,
    onhashchange?: OnEvent<HTMLFrameSetElement>,
    onlanguagechange?: OnEvent<HTMLFrameSetElement>,
    onmessage?: OnEvent<HTMLFrameSetElement>,
    onoffline?: OnEvent<HTMLFrameSetElement>,
    ononline?: OnEvent<HTMLFrameSetElement>,
    onpagehide?: OnEvent<HTMLFrameSetElement>,
    onpageshow?: OnEvent<HTMLFrameSetElement>,
    onpopstate?: OnEvent<HTMLFrameSetElement>,
    onrejectionhandled?: OnEvent<HTMLFrameSetElement>,
    onstorage?: OnEvent<HTMLFrameSetElement>,
    onunhandledrejection?: OnEvent<HTMLFrameSetElement>,
    onunload?: OnEvent<HTMLFrameSetElement>
  }
  export interface Hr extends Generic<HTMLHRElement> {
    align?: string
    color?: string
    noShade?: string
    size?: string
    width?: num
  }
  export interface Head extends Generic<HTMLHeadElement> {
    profile?: string
  }
  export interface Heading extends Generic<HTMLHeadingElement> {
    align?: string
  }
  export interface Html extends Generic<HTMLHtmlElement> {
    version?: string
    manifest?: string
  }
  export interface IFrame extends Generic<HTMLIFrameElement> {
    align?: string
    frameBorder?: string
    height?: num
    longDesc?: string
    marginHeight?: string
    marginWidth?: string
    name?: string
    sandbox?: string
    allowFullscreen?: string
    allow?: string
    scrolling?: string
    src?: string
    srcdoc?: string
    width?: num
    contentDocument?: string
    contentWindow?: string
    referrerPolicy?: string
    getSVGDocument?: string
  }
  export interface Image extends Generic<HTMLImageElement> {
    alt?: string
    src?: string
    srcset?: string
    sizes?: string
    crossOrigin?: string
    useMap?: string
    isMap?: string
    width?: num
    height?: num
    naturalHeight?: string
    naturalWidth?: string
    complete?: string
    currentSrc?: string
    referrerPolicy?: string
    decoding?: string
    loading?: string
    name?: string
    lowsrc?: string
    align?: string
    hspace?: string
    vspace?: string
    longDesc?: string
    border?: string
    x?: string
    y?: string
    decode?: string
  }
  export interface Input extends Generic<HTMLInputElement> {
    accept?: string
    alt?: string
    autocomplete?: string
    defaultChecked?: boolean
    checked?: boolean
    dirName?: string
    disabled?: boolean
    form?: string
    files?: string
    formAction?: string
    formEnctype?: string
    formMethod?: string
    formNoValidate?: string
    formTarget?: string
    height?: num
    indeterminate?: string
    list?: string
    max?: num
    minLength?: num
    maxLength?: num
    min?: num
    multiple?: string
    name?: string
    pattern?: string
    placeholder?: string
    readOnly?: string
    required?: boolean
    size?: string
    src?: string
    step?: string
    type?: InputType
    defaultValue?: string
    value?: string
    valueAsDate?: string
    valueAsNumber?: string
    width?: num
    willValidate?: string
    validity?: string
    validationMessage?: string
    labels?: string
    selectionStart?: string
    selectionEnd?: string
    selectionDirection?: string
    align?: string
    useMap?: string
    incremental?: string
    webkitdirectory?: string
    webkitEntries?: string
    stepUp?: string
    stepDown?: string
    checkValidity?: string
    reportValidity?: string
    setCustomValidity?: string
    select?: string
    setRangeText?: string
    setSelectionRange?: string
  }
  export interface LI extends Generic<HTMLLIElement> {
    type?: string
    value?: string
  }
  export interface Label extends Generic<HTMLLabelElement> {
    form?: string
    htmlFor?: string
    control?: string
  }
  export interface Legend extends Generic<HTMLLegendElement> {
    form?: string
    align?: string
  }
  export interface Link extends Generic<HTMLLinkElement> {
    disabled?: boolean
    charset?: string
    href?: string
    hrefLang?: string
    media?: string
    rel?: string
    rev?: string
    sizes?: string
    target?: string
    type?: string
    "as"?: string
    crossOrigin?: string
    referrerPolicy?: string
    sheet?: string
    relList?: string
    nonce?: string
    integrity?: string
  }
  export interface Map extends Generic<HTMLMapElement> {
    areas?: string
    name?: string
  }
  export interface Marquee extends Generic<HTMLMarqueeElement> {
    behavior?: string
    bgColor?: color
    direction?: string
    height?: num
    hspace?: string
    loop?: string
    scrollAmount?: string
    scrollDelay?: string
    trueSpeed?: boolean
    vspace?: string
    width?: num
    start?: string
    stop?: string
  }
  export interface Menu extends Generic<HTMLMenuElement> {
    compact?: string
  }
  export interface Meta extends Generic<HTMLMetaElement> {
    content?: string
    httpEquiv?: string
    media?: string
    name?: string
    scheme?: string
    charset?: string
  }
  export interface Meter extends Generic<HTMLMeterElement> {
    value?: string
    min?: string
    max?: string
    low?: string
    high?: string
    optimum?: string
    labels?: string
  }
  export interface Mod extends Generic<HTMLModElement> {
    cite?: string
    dateTime?: string
  }
  export interface OList extends Generic<HTMLOListElement> {
    compact?: string
    start?: string
    reversed?: boolean
    type?: string
  }
  export interface Object extends Generic<HTMLObjectElement> {
    form?: string
    code?: string
    align?: string
    archive?: string
    border?: string
    codeBase?: string
    codeType?: string
    data?: string
    declare?: string
    height?: num
    hspace?: string
    name?: string
    standby?: string
    type?: string
    useMap?: string
    vspace?: string
    width?: num
    willValidate?: string
    validity?: string
    validationMessage?: string
    contentDocument?: string
    contentWindow?: string
    checkValidity?: string
    reportValidity?: string
    setCustomValidity?: string
    getSVGDocument?: string
  }
  export interface OptGroup extends Generic<HTMLOptGroupElement> {
    disabled?: boolean
    label?: string
  }
  export interface Option extends Generic<HTMLOptionElement> {
    disabled?: boolean
    form?: string
    label?: string
    defaultSelected?: boolean
    selected?: boolean
    value?: string
    text?: string
    index?: string
  }
  export interface Output extends Generic<HTMLOutputElement> {
    htmlFor?: string
    form?: string
    name?: string
    type?: string
    defaultValue?: string
    value?: string
    willValidate?: string
    validity?: string
    validationMessage?: string
    labels?: string
    checkValidity?: string
    reportValidity?: string
    setCustomValidity?: string
  }
  export interface Paragraph extends Generic<HTMLParagraphElement> {
    align?: string
  }
  export interface Param extends Generic<HTMLParamElement> {
    name?: string
    type?: string
    value?: string
    valueType?: string
  }
  export interface Picture extends Generic<HTMLPictureElement> {}
  export interface Pre extends Generic<HTMLPreElement> {
    width?: num
    wrap?: string
  }
  export interface Progress extends Generic<HTMLProgressElement> {
    value?: string
    max?: string
    position?: string
    labels?: string
  }
  export interface Quote extends Generic<HTMLQuoteElement> {
    cite?: string
  }
  export interface Script extends Generic<HTMLScriptElement> {
    text?: string
    htmlFor?: string
    event?: string
    charset?: string
    async?: string
    defer?: boolean
    src?: string
    type?: string
    crossOrigin?: string
    noModule?: string
    integrity?: string
    referrerPolicy?: string
  }
  export interface Select extends Generic<HTMLSelectElement> {
    add?: string
    autocomplete?: string
    checkValidity?: string
    disabled?: boolean
    form?: string
    item?: string
    labels?: string
    length?: string
    multiple?: string
    name?: string
    namedItem?: string
    options?: string
    remove?: string
    reportValidity?: string
    required?: boolean
    selectedIndex?: string
    selectedOptions?: string
    setCustomValidity?: string
    size?: string
    type?: string
    validationMessage?: string
    validity?: string
    value?: string
    willValidate?: string
  }
  export interface Slot extends Generic<HTMLSlotElement> {
    assignedElements?: string
    assignedNodes?: string
    name?: string
  }
  export interface Source extends Generic<HTMLSourceElement> {
    height?: num
    media?: string
    sizes?: string
    src?: string
    srcset?: string
    type?: string
    width?: num
  }
  export interface Span extends Generic<HTMLSpanElement> {}
  export interface Style extends Generic<HTMLStyleElement> {
    disabled?: boolean
    media?: string
    type?: string
    sheet?: string
    nonce?: string
  }
  export interface TableCaption extends Generic<HTMLTableCaptionElement> {
    align?: string
  }
  export interface TableCell extends Generic<HTMLTableCellElement> {
    cellIndex?: string
    align?: string
    axis?: string
    bgColor?: color
    ch?: string
    chOff?: string
    colSpan?: string
    rowSpan?: string
    headers?: string
    height?: num
    noWrap?: string
    vAlign?: string
    width?: num
    abbr?: string
    scope?: string
  }
  export interface TableCol extends Generic<HTMLTableColElement> {
    align?: string
    ch?: string
    chOff?: string
    span?: string
    vAlign?: string
    width?: num
  }
  export interface Table extends Generic<HTMLTableElement> {
    caption?: string
    tHead?: string
    tFoot?: string
    rows?: string
    tBodies?: string
    align?: string
    bgColor?: color
    border?: string
    cellPadding?: string
    cellSpacing?: string
    frame?: string
    rules?: string
    summary?: string
    width?: num
    createTHead?: string
    deleteTHead?: string
    createTFoot?: string
    deleteTFoot?: string
    createTBody?: string
    createCaption?: string
    deleteCaption?: string
    insertRow?: string
    deleteRow?: string
  }
  export interface TableRow extends Generic<HTMLTableRowElement> {
    rowIndex?: string
    sectionRowIndex?: string
    cells?: string
    align?: string
    bgColor?: color
    ch?: string
    chOff?: string
    vAlign?: string
    insertCell?: string
    deleteCell?: string
  }
  export interface TableSection extends Generic<HTMLTableSectionElement> {
    align?: string
    ch?: string
    chOff?: string
    vAlign?: string
    rows?: string
    insertRow?: string
    deleteRow?: string
  }
  export interface Template extends Generic<HTMLTemplateElement> {
    content?: string
  }
  export interface TextArea extends Generic<HTMLTextAreaElement> {
    dirName?: string
    disabled?: boolean
    form?: string
    minLength?: string
    maxLength?: string
    name?: string
    placeholder?: string
    readOnly?: string
    required?: boolean
    rows?: string
    cols?: string
    wrap?: string
    type?: string
    defaultValue?: string
    value?: string
    textLength?: string
    willValidate?: string
    validity?: string
    validationMessage?: string
    labels?: string
    selectionStart?: string
    selectionEnd?: string
    selectionDirection?: string
    autocomplete?: string
    checkValidity?: string
    reportValidity?: string
    setCustomValidity?: string
    select?: string
    setRangeText?: string
    setSelectionRange?: string
  }
  export interface Time extends Generic<HTMLTimeElement> {
    dateTime?: string
  }
  export interface Title extends Generic<HTMLTitleElement> {
    text?: string
  }
  export interface Track extends Generic<HTMLTrackElement> {
    kind?: string
    src?: string
    srclang?: string
    label?: string
    default?: string
    readyState?: string
    track?: string
    NONE?: string
    LOADING?: string
    LOADED?: string
    ERROR?: string
  }
  export interface UList extends Generic<HTMLUListElement> {
    compact?: string
    type?: string
  }
  export interface Dep extends Generic<HTMLElement> {}
  export interface Unknown extends Generic<HTMLUnknownElement> {}
  export interface Video extends GenericMedia<HTMLVideoElement> {
    width?: num
    height?: num
    videoWidth?: string
    videoHeight?: string
    poster?: string
    playsInline?: string
    webkitSupportsFullscreen?: string
    webkitDisplayingFullscreen?: string
    webkitWirelessVideoPlaybackDisabled?: boolean
    webkitPresentationMode?: string
    onenterpictureinpicture?: OnEvent<HTMLVideoElement>,
    onleavepictureinpicture?: OnEvent<HTMLVideoElement>,
    autoPictureInPicture?: string
    disablePictureInPicture?: string
    webkitEnterFullscreen?: string
    webkitExitFullscreen?: string
    webkitEnterFullScreen?: string
    webkitExitFullScreen?: string
    webkitSupportsPresentationMode?: string
    webkitSetPresentationMode?: string
    requestPictureInPicture?: string
    requestVideoFrameCallback?: string
    cancelVideoFrameCallback?: string
  }





  interface svgElement<H extends SVGElement> extends Generic<HTMLUnknownElement> {
    color?: string;
    height?: num;

    lang?: string;
    max?: num;
    media?: string;
    method?: string;
    min?: num;
    name?: string;
    target?: string;
    type?: string;
    width?: num;
    style?: CSSProperties | string;

    crossOrigin?: "anonymous" | "use-credentials" | "";

    // SVG Specific attributes
    accentHeight?: num;
    accumulate?: "none" | "sum";
    additive?: "replace" | "sum";
    alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" |
    "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit";
    allowReorder?: "no" | "yes";
    alphabetic?: num;
    amplitude?: num;
    arabicForm?: "initial" | "medial" | "terminal" | "isolated";
    ascent?: num;
    attributeName?: string;
    attributeType?: string;
    autoReverse?: bool;
    azimuth?: num;
    baseFrequency?: num;
    baselineShift?: num;
    baseProfile?: num;
    bbox?: num;
    begin?: num;
    bias?: num;
    by?: num;
    calcMode?: num;
    capHeight?: num;
    clip?: num;
    clipPath?: string;
    clipPathUnits?: num;
    clipRule?: num;
    colorInterpolation?: num;
    colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit";
    colorProfile?: num;
    colorRendering?: num;
    contentScriptType?: num;
    contentStyleType?: num;
    cursor?: num;
    cx?: num;
    cy?: num;
    d?: string;
    decelerate?: num;
    descent?: num;
    diffuseConstant?: num;
    direction?: num;
    display?: num;
    divisor?: num;
    dominantBaseline?: num;
    dur?: num;
    dx?: num;
    dy?: num;
    edgeMode?: num;
    elevation?: num;
    enableBackground?: num;
    end?: num;
    exponent?: num;
    externalResourcesRequired?: bool;
    fill?: string;
    fillOpacity?: num;
    fillRule?: "nonzero" | "evenodd" | "inherit";
    filter?: string;
    filterRes?: num;
    filterUnits?: num;
    floodColor?: num;
    floodOpacity?: num;
    focusable?: bool | "auto";
    fontFamily?: string;
    fontSize?: num;
    fontSizeAdjust?: num;
    fontStretch?: num;
    fontStyle?: num;
    fontVariant?: num;
    fontWeight?: num;
    format?: num;
    fr?: num;
    from?: num;
    fx?: num;
    fy?: num;
    g1?: num;
    g2?: num;
    glyphName?: num;
    glyphOrientationHorizontal?: num;
    glyphOrientationVertical?: num;
    glyphRef?: num;
    gradientTransform?: string;
    gradientUnits?: string;
    hanging?: num;
    horizAdvX?: num;
    horizOriginX?: num;
    href?: string;
    ideographic?: num;
    imageRendering?: num;
    in2?: num;
    in?: string;
    intercept?: num;
    k1?: num;
    k2?: num;
    k3?: num;
    k4?: num;
    k?: num;
    kernelMatrix?: num;
    kernelUnitLength?: num;
    kerning?: num;
    keyPoints?: num;
    keySplines?: num;
    keyTimes?: num;
    lengthAdjust?: num;
    letterSpacing?: num;
    lightingColor?: num;
    limitingConeAngle?: num;
    local?: num;
    markerEnd?: string;
    markerHeight?: num;
    markerMid?: string;
    markerStart?: string;
    markerUnits?: num;
    markerWidth?: num;
    mask?: string;
    maskContentUnits?: num;
    maskUnits?: num;
    mathematical?: num;
    mode?: num;
    numOctaves?: num;
    offset?: num;
    opacity?: num;
    operator?: num;
    order?: num;
    orient?: num;
    orientation?: num;
    origin?: num;
    overflow?: num;
    overlinePosition?: num;
    overlineThickness?: num;
    paintOrder?: num;
    panose1?: num;
    path?: string;
    pathLength?: num;
    patternContentUnits?: string;
    patternTransform?: num;
    patternUnits?: string;
    pointerEvents?: num;
    points?: string;
    pointsAtX?: num;
    pointsAtY?: num;
    pointsAtZ?: num;
    preserveAlpha?: bool;
    preserveAspectRatio?: string;
    primitiveUnits?: num;
    r?: num;
    radius?: num;
    refX?: num;
    refY?: num;
    renderingIntent?: num;
    repeatCount?: num;
    repeatDur?: num;
    requiredExtensions?: num;
    requiredFeatures?: num;
    restart?: num;
    result?: string;
    rotate?: num;
    rx?: num;
    ry?: num;
    scale?: num;
    seed?: num;
    shapeRendering?: num;
    slope?: num;
    spacing?: num;
    specularConstant?: num;
    specularExponent?: num;
    speed?: num;
    spreadMethod?: string;
    startOffset?: num;
    stdDeviation?: num;
    stemh?: num;
    stemv?: num;
    stitchTiles?: num;
    stopColor?: string;
    stopOpacity?: num;
    strikethroughPosition?: num;
    strikethroughThickness?: num;
    string?: num;
    stroke?: string;
    strokeDasharray?: string | number;
    strokeDashoffset?: string | number;
    strokeLinecap?: "butt" | "round" | "square" | "inherit";
    strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
    strokeMiterlimit?: num;
    strokeOpacity?: num;
    strokeWidth?: num;
    surfaceScale?: num;
    systemLanguage?: num;
    tableValues?: num;
    targetX?: num;
    targetY?: num;
    textAnchor?: string;
    textDecoration?: num;
    textLength?: num;
    textRendering?: num;
    to?: num;
    transform?: string;
    u1?: num;
    u2?: num;
    underlinePosition?: num;
    underlineThickness?: num;
    unicode?: num;
    unicodeBidi?: num;
    unicodeRange?: num;
    unitsPerEm?: num;
    vAlphabetic?: num;
    values?: string;
    vectorEffect?: num;
    version?: string;
    vertAdvY?: num;
    vertOriginX?: num;
    vertOriginY?: num;
    vHanging?: num;
    vIdeographic?: num;
    viewBox?: string;
    viewTarget?: num;
    visibility?: num;
    vMathematical?: num;
    widths?: num;
    wordSpacing?: num;
    writingMode?: num;
    x1?: num;
    x2?: num;
    x?: num;
    xChannelSelector?: string;
    xHeight?: num;
    xlinkActuate?: string;
    xlinkArcrole?: string;
    xlinkHref?: string;
    xlinkRole?: string;
    xlinkShow?: string;
    xlinkTitle?: string;
    xlinkType?: string;
    xmlBase?: string;
    xmlLang?: string;
    xmlns?: string;
    xmlnsXlink?: string;
    xmlSpace?: string;
    y1?: num;
    y2?: num;
    y?: num;
    yChannelSelector?: string;
    z?: num;
    zoomAndPan?: string;
  }

  export interface SVG extends svgElement<SVGElement> { }
  export interface SVGCircle extends svgElement<SVGCircleElement> { }
  export interface SVGClipPath extends svgElement<SVGClipPathElement> { }
  export interface SVGDefs extends svgElement<SVGDefsElement> { }
  export interface SVGDesc extends svgElement<SVGDescElement> { }
  export interface SVGEllipse extends svgElement<SVGEllipseElement> { }
  export interface SVGFEBlend extends svgElement<SVGFEBlendElement> { }
  export interface SVGFEColorMatrix extends svgElement<SVGFEColorMatrixElement> { }
  export interface SVGFEComponentTransfer extends svgElement<SVGFEComponentTransferElement> { }
  export interface SVGFEComposite extends svgElement<SVGFECompositeElement> { }
  export interface SVGFEConvolveMatrix extends svgElement<SVGFEConvolveMatrixElement> { }
  export interface SVGFEDiffuseLighting extends svgElement<SVGFEDiffuseLightingElement> { }
  export interface SVGFEDisplacementMap extends svgElement<SVGFEDisplacementMapElement> { }
  export interface SVGFEDistantLight extends svgElement<SVGFEDistantLightElement> { }
  export interface SVGFEDropShadow extends svgElement<SVGFEDropShadowElement> { }
  export interface SVGFEFlood extends svgElement<SVGFEFloodElement> { }
  export interface SVGFEFunc extends svgElement<SVGElement> { }
  export interface SVGFEGaussianBlur extends svgElement<SVGFEGaussianBlurElement> { }
  export interface SVGFEImage extends svgElement<SVGFEImageElement> { }
  export interface SVGFEMerge extends svgElement<SVGFEMergeElement> { }
  export interface SVGFEMergeNode extends svgElement<SVGFEMergeNodeElement> { }
  export interface SVGFEMorphology extends svgElement<SVGFEMorphologyElement> { }
  export interface SVGFEOffset extends svgElement<SVGFEOffsetElement> { }
  export interface SVGFEPointLight extends svgElement<SVGFEPointLightElement> { }
  export interface SVGFESpecularLighting extends svgElement<SVGFESpecularLightingElement> { }
  export interface SVGFESpotLight extends svgElement<SVGFESpotLightElement> { }
  export interface SVGFETile extends svgElement<SVGFETileElement> { }
  export interface SVGFETurbulence extends svgElement<SVGFETurbulenceElement> { }
  export interface SVGFilter extends svgElement<SVGFilterElement> { }
  export interface SVGForeignObject extends svgElement<SVGForeignObjectElement> { }
  export interface SVGG extends svgElement<SVGGElement> { }
  export interface SVGImage extends svgElement<SVGImageElement> { }
  export interface SVGLine extends svgElement<SVGLineElement> { }
  export interface SVGLinearGradient extends svgElement<SVGLinearGradientElement> { }
  export interface SVGMarker extends svgElement<SVGMarkerElement> { }
  export interface SVGMask extends svgElement<SVGMaskElement> { }
  export interface SVGMetadata extends svgElement<SVGMetadataElement> { }
  export interface SVGPath extends svgElement<SVGPathElement> { }
  export interface SVGPattern extends svgElement<SVGPatternElement> { }
  export interface SVGPolygon extends svgElement<SVGPolygonElement> { }
  export interface SVGPolyline extends svgElement<SVGPolylineElement> { }
  export interface SVGRadialGradient extends svgElement<SVGRadialGradientElement> { }
  export interface SVGRect extends svgElement<SVGRectElement> { }
  export interface SVGStop extends svgElement<SVGStopElement> { }
  export interface SVGSwitch extends svgElement<SVGSwitchElement> { }
  export interface SVGSymbol extends svgElement<SVGSymbolElement> { }
  export interface SVGText extends svgElement<SVGTextElement> { }
  export interface SVGTextPath extends svgElement<SVGTextPathElement> { }
  export interface SVGTSpan extends svgElement<SVGTSpanElement> { }
  export interface SVGUse extends svgElement<SVGUseElement> { }
  export interface SVGView extends svgElement<SVGViewElement> { }
}