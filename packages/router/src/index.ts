
export { Anchor } from "./api/Anchor.js"
export { View } from "./class/View.js"
export { Router } from "./class/Router.js"


import type { Router } from "./class/Router.js"

declare global {
	const router: Router
}