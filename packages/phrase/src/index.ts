import type { LangDecl } from "./types.js";

export class Phrases<L extends string, T extends LangDecl<L>> {
  #current: L
  #phrases: T
  #def: L
  #languages: L[]
  constructor(
    languages: [L, ...L[]],
    def: L,
    phrases: T,
  ) {
    this.#def = def;
    this.#languages = languages;
    this.#current = def;
    this.#phrases = phrases;
  }

  set lang(l: L) {
    if (!this.isLang(l)) {
      this.#current = this.#def;
    }
    else {
      this.#current = l;
    }
  }

  get lang(): L {
    return this.#current;
  }

  isLang(x: string): x is L {
    return this.#languages.includes(x as L);
  }

  userLang() {
    return navigator.language.slice(0, 2);
  }

  _(name: keyof T): string {
    return this.#phrases[name]![this.#current];
  }

}