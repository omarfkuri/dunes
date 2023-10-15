

import { Obj, affect } from "../../src/obj";


const myObj = new Obj({

  hello: 22,
  myName: 33,

})



const newObj = myObj.affect(([k, v]) => [k, "v"]);