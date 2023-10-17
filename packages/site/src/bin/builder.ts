#!/usr/bin/env node

import { c } from "@dunes/sys";
import { verify } from "@dunes/verify";
import { resolve } from "path";
import type { BuilderConfig } from "src/index.js";
const [,,SCRIPT_NAME = "build.js"] = process.argv;

let config: unknown;
const configPath = resolve(SCRIPT_NAME);
try {
  const x: object = await import(configPath);
  if (!("default" in x)) {
    throw "Could not find default export in " + SCRIPT_NAME;
  }
  if (typeof x.default !== "function") {
    throw "Default export in " + SCRIPT_NAME + " is not a function";
  }

  config = await x.default();
}
catch(error) {
  raise(
    "ImportError", 
    `@ ${configPath}\nError loading ${SCRIPT_NAME}`, 
    error
  )
}

try {

  if (!config || typeof config !== "object") {
    throw "No configuration was provided";
  }

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
        }, "null", "undefined"],
        views: [{
          prop: {
            folder: "string",
            only: "object"
          }
        }, "undefined"],
        css: [{
          prop: {
            file: "string",
            ext: "string",
            match: "object",
            transform: "function",
          }
        }, "undefined"],
        bundle: ["object", "undefined"]
      }
    },

    build: [{
      prop: {
        clean: ["boolean", "undefined"]
      }
    }, "undefined"],

    watch: [{
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
    }, "undefined"],

    produce: [{
      prop: {
        origin: "string",
        do: ["object", "undefined"]
      }
    }, "undefined"]
  });
}
catch(error) {
  raise(
    "ConfigError", 
    `@ ${configPath}\nError loading ${SCRIPT_NAME}`, 
    error
  )
}

console.log("OK!", config)
process.exit(0);


function raise(title: string, message: string, error?: unknown): never {

  c.red.log(title);
  c.gray.log(message);
  if (error) {
    console.warn(error);
  }

  process.exit(0);
}