import { Elem, type Template } from "@dunes/tag";
import type { Redirect, RouterConfig, ViewConst, ViewRevealType } from "../types";
import type { View } from "./View";

export class Router {

	latestURL?: URL
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
		await this.#reveal(this.latestView, this.latestURL, "reload")
	}

	async render(href: string) {
		const url = new URL(href);
		await this.config.direct(url);

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
		await this.#reveal(view, url, "load");
	}

	async #reveal(view: View, url: URL, type: ViewRevealType) {
		const willRes = await view.willShow(type);
		if (willRes) {
			return await this.go(willRes);
		}

		const linkClone = this.link.cloneNode(true) as HTMLLinkElement;
		linkClone.href = view.stylesRef();
		this.link.replaceWith(linkClone);

		Elem.create(view.content as Template, {view}).replace(this.root);
		history.pushState("", "", url);
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

	async #load(pathname: string): Promise<ViewConst> {
		const path = `${this.config.views.folder}/js${pathname}.js`;
		const {default: Vc} = (await import(path)) as {default: ViewConst};
		if (!Vc) {
			throw `View is not default export of "${pathname}.js"`
		}
		Vc.stylesRef = `${this.config.views.folder}/css${pathname}.css`;
		return Vc;
	}
}