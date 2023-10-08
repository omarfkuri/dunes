

import { js } from "../src/";

const obj = {
  name: "Bruce",
  age: 24,
  occupations: [
    {
      name: "Civil Engineer",
      type: "fulltime"
    },
    {
      name: "Painter",
      type: "hobby",
      func() {
        console.log("Hi there!")
      },
      cl: new Date()
    },
  ],
  info: {
    tel: 55_2212_2213,
    email: "bruce@willis.com",
    address: {
      city: "São Paolo",
      country: "Brazil",
      street: "Cool Street 7",
      number: BigInt(3),
      interior: null
    },
    [Symbol.asyncIterator]() {
      console.log("Hello world!")
    }
  }

}


// console.log(Object.getOwnPropertySymbols(obj.info))

console.log(js(obj));
// console.log(2, JSON.stringify(obj, null, 2));