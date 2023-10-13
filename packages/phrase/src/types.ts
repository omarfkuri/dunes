

export interface LangDecl<L extends string> {
  [key: string]: LangObj<L>
}

export type LangObj<L extends string> = {
  [key in L]: string
}