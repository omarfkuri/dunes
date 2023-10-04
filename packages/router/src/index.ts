
export { Anchor } from "./api/Anchor"
export { View } from "./class/View"
export { Router } from "./class/Router"


import type { Router } from "./class/Router"

declare global {
	const router: Router
}