

import localResolve from '@dunes/wrap-plug';
import { SiteBuilder } from '../src/index.js';
import { jsxPreset, tsPreset } from '@dunes/bab';
import nodeResolve from '@rollup/plugin-node-resolve';

const builder = new SiteBuilder({
  src: "test/src",
  out: "test/out",
  
})

/*
wrap: {
    replaceAfter: [
      [/export *{ .+ };? *\n* /, ""],
      [/let \w+\$\d+ = /g, ""],
      [
        /(Router|Comp|Fire|Elem|FireAuth|FireStore)\$\d+/g, 
        (_str, name) => name
      ]
    ],
    plugs: [
      localResolve({
        keeps: new Set,
        id: "script.ts",
        parseOptions: {
          sourceType: "module",
          plugins: [
            "typescript", "jsx",
            "destructuringPrivate"
          ]
        },
        transformOptions(id) {
          return {
            filename: id,
            presets: [
              jsxPreset({
                pragma: "Elem.create"
              }),
              tsPreset({}),
            ]
          }
        },
      }),
      nodeResolve(),
    ]
  }

*/

// try {
//   const result = await builder.build({
//     clean: true
//   });
//   console.log("Finished in", result.took);
// }
// catch(error) {
//   console.warn(error)
// }

// console.log("watching...")
// await builder.watch({

//   onActionStart(e) {
//     console.log("Building", e.name);
//   },
//   onActionFinish(e) {
//     console.log("Built", e.name, "in", e.took);
//   },

//   onActionFailure({error}) {
//     console.log(error);
//     console.log("THERE WAS AN ERROR");
//   },

// });
// process.exit(0);
