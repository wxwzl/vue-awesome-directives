import resolve from "rollup-plugin-node-resolve"; //—帮助 Rollup 查找外部模块，然后导入
import commonjs from "@rollup/plugin-commonjs"; // —将CommonJS模块转换为 ES2015 供 Rollup 处理
import json from "@rollup/plugin-json"; // 可以将json文件以es6 模块的方式导入引用
import dts from "rollup-plugin-dts";
import ts from "@rollup/plugin-typescript"; // 解析ts文件转成js,供 Rollup 处理
// import ts from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser"; //压缩js代码，包括es6代码压缩,供 Rollup 处理
import alias from "@rollup/plugin-alias"; // 别名的解析
import nodePolyfills from "rollup-plugin-node-polyfills"; //解决第三方依赖引入问题。
import path from "path";
// import fs from "fs";
const resolvePath = (p) => path.resolve(__dirname, p);
const outPutDir = process.env.output;
const input = process.env.input;
const format = process.env.format;
const sourcemap = process.env.sourcemap;
const sourcemapFile = process.env.sourcemapFile;
const name = process.env.name;
const externalStr = process.env.external;
// function cleanDir(dir) {
//   if (fs.existsSync(dir)) {
//     fs.rmdirSync(dir, { recursive: true, force: true });
//   }
// }
// cleanDir(outPutDir);
const customResolver = resolve({
  extensions: [".ts", ".js", ".jsx", ".json", ".less", ".vue"],
});
function getPlungins() {
  return [
    alias({
      entries: [],
      customResolver,
    }),
    resolve({
      browser: true,
    }),
    nodePolyfills(),
    json(),
    ts(),
    commonjs(),
  ];
}
const plugins = getPlungins();
plugins.push(
  terser({
    module: /^esm/.test(format),
    compress: {
      ecma: 2015,
      pure_getters: true,
    },
    safari10: true,
  })
);
const outputConfigs = {
  umd: {
    file: resolvePath(`${outPutDir}/index.umd.js`),
    format: `umd`,
  },
  esm: {
    file: resolvePath(`${outPutDir}/index.esm.js`),
    format: `esm`,
  },
  cjs: {
    file: resolvePath(`${outPutDir}/index.cjs.js`),
    format: `cjs`,
  },
  global: {
    file: resolvePath(`${outPutDir}/index.iife.js`),
    format: `iife`,
  },
  default: {
    file: resolvePath(`${outPutDir}/index.min.js`),
    format: `umd`,
  },
};

function getOutputArray() {
  if (outputConfigs[format]) {
    return [getOutputConfig(outputConfigs[format])];
  } else {
    return Object.keys(outputConfigs).map((key) => {
      return getOutputConfig(outputConfigs[key]);
    });
  }
}
function getOutputConfig(outputConfigs) {
  return {
    exports: "auto",
    sourcemap: sourcemap,
    sourcemapFile: sourcemapFile, //设置了没有效果
    name: name,
    ...outputConfigs,
  };
}
export default [
  {
    input: input,
    output: getOutputArray(),
    plugins: plugins,
    external: externalStr ? externalStr.split(":") : [],
  },
  {
    input: input,
    output: [
      {
        file: resolvePath(`${outPutDir}/index.js`),
        format: "umd",
        exports: "auto",
        name: name,
      },
    ],
    plugins: getPlungins(),
    external: externalStr ? externalStr.split(":") : [],
  },
  {
    input: input,
    output: [
      {
        file: resolvePath(`${outPutDir}/index.d.ts`),
        format: "esm",
        exports: "auto",
      },
    ],
    plugins: [dts()],
  },
];
