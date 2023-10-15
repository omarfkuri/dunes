
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
    {name: "Tennis"},
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
    chin: {
      type: "object",
      props: {}
    },
    shan: {
      type: "array",
      item: "string"
    },
    hobbies: {
      type: "array",
      item: {
        type: "object",
        props: {
          name: "string"
        }
      }
    }
  });

  console.log(obj.name, obj.date, obj.chin.cachin)
}
catch(error) {
  console.log("ERROR!")
  console.warn(error)
}