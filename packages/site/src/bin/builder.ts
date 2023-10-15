#!/usr/bin/env node

import { verify } from "@dunes/verify";
import { resolve } from "path";
import type { BuilderConfig } from "src/index.js";

const [,,SCRIPT_NAME = "build.js"] = process.argv;

let config;
const configPath = resolve(SCRIPT_NAME);
try {
  ({default: config} = await import(configPath));
}
catch(error) {
  console.log("Could not find", configPath);
  process.exit(0);
}

if (!config || typeof config !== "object") {
  throw "No config";
}

try {
  verify<BuilderConfig>(config, {
    options: {
      prop: {
        out: ["string", "undefined"],
        src: ["string", "undefined"],
        lib: ["string", "undefined"],
        main: ["string", "undefined"],
        base: ["string", "undefined"],

        hash: ["string", "undefined", "null"],
        assets: [{
          prop: {
            source: "string",
            out: ["string", "undefined"],
          }
        }, "null"],
        views: {
          prop: {
            folder: "string",
            only: "object"
          }
        },
        css: [{
          prop: {
            file: "string",
            ext: "string",
            match: "object",
            transform: "function",
          }
        }, "null"],
        wrap: {
          prop: {

          }
        }
      }
    },

    build: {
      prop: {
        clean: ["boolean", "undefined"]
      }
    },

    watch: {
      prop: {
        onFileBuilding: ["function", "undefined"],
        onFileBuilt: ["function", "undefined"],
        onFileFailure: ["function", "undefined"],
        
        onDepStart: ["function", "undefined"],
        onDepBuilding: ["function", "undefined"],
        onDepBuilt: ["function", "undefined"],
        onDepFailure: ["function", "undefined"],
        onDepFinish: ["function", "undefined"],
      }
    },

    produce: {
      prop: {
        origin: "string",
        do: ["object", "undefined"]
      }
    }
  });
  console.log("Builder config is ok!");
}
catch(error) {
  console.log("There was an error");
  console.warn(error);
}