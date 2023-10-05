
import {extract} from "@dunes/tools";
import {myFunc} from "../fns/myFunc"
import styles from "test/src/subdir/style.m.css"

myFunc()

const div = extract([1, 2, 3], 1);

console.log(div, styles)