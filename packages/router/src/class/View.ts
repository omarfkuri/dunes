import { Comp } from "@dunes/tag";
import { ViewEventRes, ViewRevealType } from "../types";


export abstract class View {
	abstract content({view}: {view: View}, comp: Comp<{}>): JSX.Element

	willShow(type: ViewRevealType): ViewEventRes {}
	hasShown(type: ViewRevealType): ViewEventRes {}
	willDestroy(type: ViewRevealType): ViewEventRes {}
}