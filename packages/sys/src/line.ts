import { Stringify } from "@dunes/tools";

type Ret = (
	((text: string) => void)
	&
	{
    text(text: string): string
    warn(text: string): string
  }
)

function LineColor(c1: number, c2: number): Ret {
	const ret = (text => console.log(
		"\x1B[" + String(c1) + "m" + text + "\x1B[" + String(c2) + "m"
	)) as Ret;
	ret.text = (text => 
		"\x1B[" + String(c1) + "m" + text + "\x1B[" + String(c2) + "m"
	)
	return ret;
}

export class line {
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
      space: this.gray.text(" "),
      break: this.gray.text("\n"),
      tab: this.gray.text(" "),
      colon: this.gray.text(":"),
      comma: this.gray.text(","),
      openSquare: this.gray.text("["),
      closeSquare: this.gray.text("]"),
      openBracket: this.gray.text("{"),
      closeBracket: this.gray.text("}"),
    },

    options: {
      excludeColon: "function"
    },

    style: {
      key: {
        number: num => this.cyanLi.text(String(num)),
        string: str => this.gray.text(str),
        symbol: sym => 
          this.gray.text(`[${sym.description || String(sym)}]`),
      },
      value: {
        string({value}) {
          return JSON.stringify(value);
        },
        boolean: ({value}) => value
        ? this.green.text("true")
        : this.red.text("false"),
        number: ({value}) => this.cyanLi.text(String(value)),
        function({value}) {
          return String(value)
          .replace(/^[^(]*/g, "")
          .replace(/  /g, " ")
        },
      }
    }
  })

  static obj(x: unknown) {
    console.log(this.#str.this(x))
  }
}