
import { verify } from "../src/index.js";

const obj: object = {};

type R = {
    name: string
    date: Date
    chin: {
      [key: string]: any
    }
    shan: string[]
    hobbies?: {
      name: string
    }[]
  }

try {

  verify<R>(obj, {
    name: "string",
    date(p, name) {
      if (!(p instanceof Date)) {
        throw `${name} is not a Date.`
      }
    },
    chin: "object",
    shan: {
      item: "string"
    },
    hobbies: [
      {
        item: {
          prop: {
            name: "string"
          }
        }
      },
      "undefined",
    ]
  });

  console.log(obj.name, obj.date, obj.chin.some)
}
catch(error) {
  console.log("ERROR!")
  console.warn(error)
}
// try {

//   verify<R>(obj, {
//     name: "string",
//     date: "number",
//     chin: {
//       type: "object",
//       props: {}
//     },
//     shan: {
//       type: "array",
//       item: "string"
//     },
//     hobbies: {
//       type: "array",
//       or: "undefined",
//       item: {
//         type: "object",
//         props: {
//           name: "string"
//         }
//       }
//     }
//   });

//   console.log(obj.name, obj.date, obj.chin.some)
// }
// catch(error) {
//   console.log("ERROR!")
//   console.warn(error)
// }