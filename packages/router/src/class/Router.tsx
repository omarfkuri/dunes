import { type Comp, Elem, type Template } from "@dunes/tag";
import type { Redirect, RouterConfig, ViewConst, ViewRevealType } from "../types/index.js";
import type { View } from "./View.js";
import { splitLast } from "@dunes/tools";

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

    if (this.latestURL?.pathname === url.pathname
      || this.latestURL?.pathname === url.pathname + "/index") {

      if (this.latestReq?.pathname === req.pathname) {
        return;
      }
    }
    this.latestReq = req;

		if (url.pathname === "/" || url.pathname === "/index") {
			url.pathname = this.config.views.home;
		}
		else if (this.config.pages.includes(url.pathname + "/index")) {
			url.pathname += "/index";
		}
		else if (!this.config.pages.includes(url.pathname)) {
			url.pathname = this.config.views.error;
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
    const {scrollTop, scrollLeft} = document.body;
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
    document.body.scrollTop = scrollTop;
    document.body.scrollLeft = scrollLeft;
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

    const dir = path + (path.endsWith("/")?"":"/");

		const {default: Vc} = (await import(this.hash(`${dir}script.js`))) as {default: ViewConst};
		if (!Vc) {
			throw `View is not default export of "${pathname}.js"`
		}
		Vc.stylesRef = this.hash(`${dir}styles.css`);
		return Vc;
	}

  hash(filename: string): string {
    const [name, ext] = splitLast(filename, ".", 0);
    return name + (
      this.config.hash ? ("." + this.config.hash): ""
    ) + ext;
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