

import { include } from "../src";


const arrow = include(
  import("@dunes/tools"), 
  ({UNICODE}) => UNICODE.arrow.up.black
)


const triangle = include(
  import("@dunes/tools"), 
  ({UNICODE}) => UNICODE.shape.triangle
)

console.log(triangle, arrow);