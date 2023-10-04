import { Comp } from "@dunes/tag";
import { ViewEventRes, ViewRevealType } from "../types";


export abstract class View<Props extends obj = {}> {
	abstract content({view}: {view: View<Props>}, comp: Comp<Props>): JSX.Element

	willShow(type: ViewRevealType): ViewEventRes {}
	hasShown(type: ViewRevealType): ViewEventRes {}
	willDestroy(type: ViewRevealType): ViewEventRes {}
}