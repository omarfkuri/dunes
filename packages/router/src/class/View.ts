import { Comp } from "@dunes/tag";
import type { ViewEventRes, ViewRevealType } from "../types/index.js";


export abstract class View {

	static stylesRef: string
	stylesRef() {
		return (this.constructor as typeof View).stylesRef
	}

	comp?: Comp<{}>

	abstract content(this: Comp<{}>, {view}: {view: View}, comp: Comp<{}>): JSX.Element

	willShow(type: ViewRevealType): ViewEventRes {}
	hasShown(type: ViewRevealType): ViewEventRes {}
	willDestroy(type: ViewRevealType): ViewEventRes {}
}