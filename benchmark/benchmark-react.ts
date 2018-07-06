#!./node_modules/.bin/sucrase-node
/* eslint-disable no-console */
// @ts-ignore: new babel-core package missing types.
import * as babel from "@babel/core";

// @ts-ignore: May not be built, just ignore for now.
import * as sucrase from "../dist/index"; // eslint-disable-line import/no-unresolved
import {loadReactFiles} from "./loadReactFiles";

async function main(): Promise<void> {
  console.log(`Compiling React codebase:`);
  const reactFiles = await loadReactFiles();
  console.time("Sucrase");
  for (const {code, path} of reactFiles) {
    sucrase.transform(code, {
      transforms: ["jsx", "imports", "flow"],
      filePath: path,
    });
  }
  console.timeEnd("Sucrase");

  console.time("Babel");
  for (const {code} of reactFiles) {
    babel.transform(code, {
      presets: ["@babel/preset-react", "@babel/preset-flow"],
      plugins: [
        "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread",
      ],
    });
  }
  console.timeEnd("Babel");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
