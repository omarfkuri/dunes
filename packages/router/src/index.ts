
import "@dunes/tools"
import { Elem } from "@dunes/tag"

export { Anchor } from "./api/Anchor"


export class Router {

	latestURL?: URL
	latestView?: View

	views = new Map<string, ViewConst>();
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

		const view = new (await this.#load(url.pathname));
		const desRes = await this.latestView?.willDestroy();
		if (desRes) {
			return await this.go(desRes);
		}
		const elRes = await view.content();
		if (!Elem.isElement(elRes)) {
			return await this.go(elRes);
		}
		const willRes = await view.willShow();
		if (willRes) {
			return await this.go(willRes);
		}
		elRes.replace(this.root);
		history.pushState("", "", url);
		this.latestURL = url;

		const hasRes = await view.hasShown();
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

export abstract class View {
	abstract content(): ViewProduction

	willShow(): ViewEventRes {}
	hasShown(): ViewEventRes {}
	willDestroy(): ViewEventRes {}
}

interface Director {
	(url: URL): Prom<void>
}

interface RouterConfig {
	hash: null | string
	pages: string[]
	direct: Director
	views: {
		folder: string
		home: string
		error: string
	}
	root: string
}

interface Redirect {
	to: string
	// with?: string
}

type ViewEventRes = Prom<Redirect | void>;

type ViewProduction = Prom<JSX.Element | Redirect>

interface ViewConst {
	new(): View
}

declare global {
	const router: Router
}