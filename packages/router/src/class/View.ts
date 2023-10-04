import { ViewEventRes, ViewProduction, ViewRevealType } from "../types";


export abstract class View {
	abstract content(): ViewProduction

	willShow(type: ViewRevealType): ViewEventRes {}
	hasShown(type: ViewRevealType): ViewEventRes {}
	willDestroy(type: ViewRevealType): ViewEventRes {}
}