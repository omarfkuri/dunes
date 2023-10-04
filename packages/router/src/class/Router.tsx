import { Elem, type Template } from "@dunes/tag";
import type { Redirect, RouterConfig, ViewConst, ViewRevealType } from "../types";
import type { View } from "./View";

export class Router {

	latestURL?: URL
	latestView?: View

	#views = new Map<string, ViewConst>();
	get root(): HTMLElement {
		return document.querySelector(this.config.root)!;
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

		Elem.create(view.content as Template, {view}).replace(this.root);
		history.pushState("", "", url);
		this.latestURL = url;

		const hasRes = await view.hasShown(type);
		if (hasRes) {
			return await this.go(hasRes);
		}
		this.latestView = view;
	}

	async go(redirect: Redirect): Promise<void>
	async go(to: string, w?: string): Promise<void>
	async go(red: string | Redirect, w?: string): Promise<void> {
		if (typeof red === "object") {
			await this.render(red.to)
		}
		else {
			await this.render(red)
		}
	}

	async #load(pathname: string): Promise<ViewConst> {
		const path = `${this.config.views.folder}${pathname}.js`;
		const {default: Vc} = await import(path);
		if (!Vc) {
			throw `View is not default export of "${pathname}.js"`
		}
		return Vc;
	}
}