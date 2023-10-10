

import { Comp } from "@dunes/tag";

import { ViewEventRes, ViewRevealType } from "../types";


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