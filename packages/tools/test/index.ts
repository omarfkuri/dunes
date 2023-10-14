




import { verify } from "../src/index.js";


const obj: object = {
  name: "Hey man",
  date: 33,
  chin: {
    some: 27
  },
  shan: ["Some", "body", "once", "told", "me"],
  hobbies: [
    {name: "Soccer"},
    {namse: "Tennis"},
    {name: "Baseball"},
    {name: "Dance"},
  ]
};

try {
  verify<{
    name: string
    date: number
    chin: {
      [key: string]: any
    }
    shan: string[]
    hobbies: {
      name: string
    }[]
  }>(obj, {
    name: "string",
    date: "number",

    chin: ["object", {

    }],
    shan: ["array", "string"],
    hobbies: ["array", {
      name: "string",
    }],
  })

  console.log(obj.name, obj.date, obj.chin.cachin)
}
catch(error) {
  console.log("ERROR!")
  console.warn(error)
}