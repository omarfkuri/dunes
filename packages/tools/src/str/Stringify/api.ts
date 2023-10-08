import { Stringify } from "./class";


export const json = (value: unknown, depth = 2) => {
  return new Stringify({

    symbol: {
      space: " ",
      break: "\n",
      tab: " ".repeat(depth),
      colon: ":",
      comma: ",",
      openSquare: "[",
      closeSquare: "]",
      openBracket: "{",
      closeBracket: "}",
    },

    options: {
      displayClassName: false
    },

    style: {
      key: {
        string: JSON.stringify,
        number: JSON.stringify,
        symbol(){ return null }
      },
      value: {
        string({value}) {
          return JSON.stringify(value);
        },
        null() {return '"null"'},
        undefined() {return '"undefined"'},
        bigint({value}) {return `"${value}"`},
        function({value}) {
          return `"[${value.constructor.name} ${value.name}]"`;
        },
      }
    }
  }).this(value)
}

export const js = (value: unknown, depth = 2) => {
  return new Stringify({

    symbol: {
      space: " ",
      break: "\n",
      tab: " ".repeat(depth),
      colon: ":",
      comma: ",",
      openSquare: "[",
      closeSquare: "]",
      openBracket: "{",
      closeBracket: "}",
    },

    options: {
      excludeColon: "function"
    },

    style: {
      key: {
        symbol(sym) {
          return `[${sym.description || String(sym)}]`
        },
      },
      value: {
        string({value}) {
          return JSON.stringify(value);
        },
        function({value}) {
          return String(value)
          .replace(/^[^(]*/g, "")
          .replace(/  /g, " ")
        },
      }
    }
  }).this(value)
}