import { type Comp, Elem, type Template } from "@dunes/tag";
import type { Redirect, RouterConfig, ViewConst, ViewRevealType } from "../types";
import type { View } from "./View";

export class Router {

	latestURL?: URL
	latestReq?: URL
	latestView?: View


	#views = new Map<string, ViewConst>();
	get root(): HTMLElement {
		const root = document.querySelector<HTMLElement>(
			this.config.root
		);
		if (!root) {
			throw `${this.config.root} was not found`
		}
		return root;
	}
	get link(): HTMLLinkElement {
		const link = document.querySelector<HTMLLinkElement>(
			this.config.rootStyles
		);
		if (!link) {
			throw `${this.config.rootStyles} was not found`
		}
		if (link.tagName !== "LINK")
			throw `${this.config.rootStyles} is not a link`
		return link;
	}

	constructor(public config: RouterConfig) {}

	start() {
		window.onpopstate = () => {
			// e.preventDefault();
			this.render(location.href);
		}
		return this.render(location.href);
	}

	async reloadCurrent() {
		if (!this.latestView) {
			throw "Cannot reload none"
		}
		if (!this.latestURL) {
			throw "Cannot reload because no URL"
		}
		if (!this.latestReq) {
			throw "Cannot reload because no Req URL"
		}
		await this.#reveal(this.latestView, this.latestURL, this.latestReq, "reload")
	}

	async render(href: string) {
		const req = new URL(href);
		const url = new URL(href);
		await this.config.direct(url, req);
		this.latestReq = req;

		if (
			this.latestURL?.pathname === url.pathname || 
			this.latestURL?.pathname === url.pathname + "/index") {
			return;
		}
		if (url.pathname === "/" || url.pathname === "/index") {
			url.pathname = this.config.views.home;
		}
		else if (this.config.pages.includes(url.pathname + "/index")) {
			url.pathname += "/index";
		}
		else if (!this.config.pages.includes(url.pathname)) {
			url.pathname = this.config.views.error;
		}

		if (this.latestURL?.pathname === url.pathname) {
			return;
		}

		let viewConst = this.#views.get(url.pathname)

		if (!viewConst) {
			viewConst = await this.#load(url.pathname);
		}

		const view = new viewConst();

		const desRes = await this.latestView?.willDestroy("load");
		if (desRes) {
			return await this.go(desRes);
		}
		await this.#reveal(view, url, req, "load");
	}

	async #reveal(view: View, url: URL, req: URL, type: ViewRevealType) {
		const willRes = await view.willShow(type);
		if (willRes) {
			return await this.go(willRes);
		}

		const linkClone = this.link.cloneNode(true) as HTMLLinkElement;
		linkClone.href = view.stylesRef();
		this.link.replaceWith(linkClone);

		const comp = Elem.create(view.content as Template, {view});
		view.comp = comp as Comp<any>;
		
		comp.replace(this.root);
		history.pushState("", "", req);
		this.latestURL = url;

		const hasRes = await view.hasShown(type);
		if (hasRes) {
			return await this.go(hasRes);
		}
		this.latestView = view;
	}

	go(redirect: Redirect): Promise<void>
	go(to: string, w?: string): Promise<void>
	go(red: string | Redirect, w?: string): Promise<void> {
		if (typeof red === "object") {
			return this.render(red.to)
		}
		else {
			return this.render(red)
		}
	}

  visit(redirect: Redirect): Promise<void>
  visit(to: string, w?: string): Promise<void>
  visit(red: string | Redirect, w?: string): Promise<void> {
    if (typeof red === "object") {
      return this.render(location.origin + red.to)
    }
    else {
      return this.render(location.origin + red)
    }
  }

	async #load(pathname: string): Promise<ViewConst> {
    const path = (
      pathname === "index" ? ""
      : (
        pathname.endsWith("index")
        ? pathname.slice(0, pathname.lastIndexOf("/")+1)
        : pathname
      )
    )

    const endslash = path.endsWith("/")?"":"/";
		const {default: Vc} = (await import(`${path}${endslash}script.js`)) as {default: ViewConst};
		if (!Vc) {
			throw `View is not default export of "${pathname}.js"`
		}
		Vc.stylesRef = `${path}${endslash}styles.css`;
		return Vc;
	}

  async print() {

    const pages: {[key: string]: string} = {}

    for (const page of this.config.pages) {
      await this.go({to: location.origin + page});
      pages[page] = document.documentElement.outerHTML;
    }

    return pages;
  }
}