import { Stringify } from "@dunes/tools";

type Ret = (
  ((text: string) => string)
  &
  {
    log(text: string): void
    warn(text: string): void
  }
)

function wrapColor(c1: number, c2: number, text: string): string {
  return "\x1B[" + String(c1) + "m" + text + "\x1B[" + String(c2) + "m";
}

function LineColor(c1: number, c2: number): Ret {
  const ret = (text => wrapColor(c1, c2, text)) as Ret;
  ret.log = (text => console.log(wrapColor(c1, c2, text)))
  ret.warn = (text => console.warn(wrapColor(c1, c2, text)))
  return ret;
}

export class c {

  private constructor() {}

  static readonly reset = LineColor(0, 0);
  static readonly bold = LineColor(1, 22);
  static readonly dim = LineColor(2, 22);
  static readonly italic = LineColor(3, 23);
  static readonly underline = LineColor(4, 24);
  static readonly inverse = LineColor(7, 27);
  static readonly hidden = LineColor(8, 28);
  static readonly strikethrough = LineColor(9, 29);

  static readonly black = LineColor(30, 39);
  static readonly red = LineColor(31, 39);
  static readonly green = LineColor(32, 39);
  static readonly yellow = LineColor(33, 39);
  static readonly blue = LineColor(34, 39);
  static readonly magenta = LineColor(35, 39);
  static readonly cyan = LineColor(36, 39);
  static readonly white = LineColor(37, 39);
  static readonly gray = LineColor(90, 39);

  static readonly blackBg = LineColor(40, 49);
  static readonly redBg = LineColor(41, 49);
  static readonly greenBg = LineColor(42, 49);
  static readonly yellowBg = LineColor(43, 49);
  static readonly blueBg = LineColor(44, 49);
  static readonly magentaBg = LineColor(45, 49);
  static readonly cyanBg = LineColor(46, 49);
  static readonly whiteBg = LineColor(47, 49);
  static readonly grayBg = LineColor(100, 49);

  static readonly blackLi = LineColor(90, 39);
  static readonly redLi = LineColor(91, 39);
  static readonly greenLi = LineColor(92, 39);
  static readonly yellowLi = LineColor(93, 39);
  static readonly blueLi = LineColor(94, 39);
  static readonly magentaLi = LineColor(95, 39);
  static readonly cyanLi = LineColor(96, 39);
  static readonly whiteLi = LineColor(97, 39);

  static readonly blackLiBg = LineColor(100, 49);
  static readonly redLiBg = LineColor(101, 49);
  static readonly greenLiBg = LineColor(102, 49);
  static readonly yellowLiBg = LineColor(103, 49);
  static readonly blueLiBg = LineColor(104, 49);
  static readonly magentaLiBg = LineColor(105, 49);
  static readonly cyanLiBg = LineColor(106, 49);
  static readonly whiteLiBg = LineColor(107, 49);

  static #str = new Stringify({

    symbol: {
      space: this.gray(" "),
      break: this.gray("\n"),
      tab: this.gray("  "),
      colon: this.gray(":"),
      comma: this.gray(","),
      openSquare: this.gray("["),
      closeSquare: this.gray("]"),
      openBracket: this.gray("{"),
      closeBracket: this.gray("}"),
    },

    options: {
      excludeColon: "function"
    },

    style: {
      key: {
        number: num => this.cyanLi(String(num)),
        string: str => this.gray(str),
        symbol: sym => 
          this.gray(`[${sym.description || String(sym)}]`),
      },
      value: {
        string({value}) {
          return JSON.stringify(value);
        },
        boolean: ({value}) => value
        ? this.green("true")
        : this.red("false"),
        number: ({value}) => this.cyanLi(String(value)),
        function({value}) {
          return String(value)
          .replace(/^[^(]*/g, "")
          .replace(/  /g, " ")
        },
      }
    }
  })

  static log(...x: unknown[]) {
    console.log(x.map(x => this.#str.this(x)))
  }

  static warn(...x: unknown[]) {
    console.warn(x.map(x => this.#str.this(x)))
  }
}