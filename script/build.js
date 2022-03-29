const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const execa = require("execa");
const { gzipSync } = require("zlib");
const { compress } = require("brotli");
const { targets: allTargets, fuzzyMatchTarget } = require("./utils");
require("./build-entry");
const args = require("minimist")(process.argv.slice(2));
const targets = args._;
const formats = args.formats || args.f;
const devOnly = args.devOnly || args.d;
const sourceMap = args.sourcemap || args.s;
const buildAllMatching = args.all || args.a;
const commit = execa.sync("git", ["rev-parse", "--HEAD"]).stdout.slice(0, 7);
const dist="lib";
run();

async function run() {
  // if (isRelease) {
  //   // remove build cache for release builds to avoid outdated enum values
  //   await fs.remove(path.resolve(__dirname, "../node_modules/.rts2_cache"));
  // }
  await build("all");
  if (!targets.length) {
    await buildAll(allTargets);
    checkAllSizes(allTargets);
  } else {
    await buildAll(fuzzyMatchTarget(targets, buildAllMatching));
    checkAllSizes(fuzzyMatchTarget(targets, buildAllMatching));
  }
}

async function buildAll(targets) {
  await runParallel(require("os").cpus().length, targets, build);
}

async function runParallel(maxConcurrency, source, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item, source));
    ret.push(p);

    if (maxConcurrency <= source.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}
function isIndexDir(target){
  return target === "all";
}
async function build(target) {
  let output = path.resolve(`${dist}/${target}`);
  let input = path.resolve(`packages/${target}/src/index.ts`);
  let sourcemapFile = path.resolve(`${dist}/sourceMap/${target}`);
  if (isIndexDir(target)) {
    output = path.resolve(`${dist}/index`);
    input = path.resolve(`src/index.ts`);
    sourcemapFile = path.resolve(`${dist}/sourceMap`);
  }
  // if building a specific format, do not remove dist.
  if (!formats) {
    await fs.remove(output);
  }
  const env = devOnly ? "development" : "production";
  await execa(
    "rollup",
    [
      "-c",
      "--environment",
      [
        `COMMIT:${commit}`,
        `NODE_ENV:${env}`,
        `TARGET:${target}`,
        `output:${output}`,
        `input:${input}`,
        `name:${target}`,
        `external:vue`,
        formats ? `format:${formats}` : ``,
        sourceMap ? `sourcemap:true` : ``,
        sourceMap ? `sourcemapFile:${sourcemapFile}` : ``,
      ]
        .filter(Boolean)
        .join(","),
    ],
    { stdio: "inherit" }
  );
}

function checkAllSizes(targets) {
  if (devOnly || (formats && !formats.includes("global"))) {
    return;
  }
  console.log();
  for (const target of targets) {
    checkSize(target);
  }
  console.log();
}

function checkSize(target) {
  let pkgDir = path.resolve(`${dist}/${target}`);
  if(isIndexDir(target)){
    pkgDir = path.resolve(`${dist}/index`);
  }
  checkFileSize(`${pkgDir}/index.js`);
}

function checkFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const file = fs.readFileSync(filePath);
  const minSize = (file.length / 1024).toFixed(2) + "kb";
  const gzipped = gzipSync(file);
  const gzippedSize = (gzipped.length / 1024).toFixed(2) + "kb";
  const compressed = compress(file);
  const compressedSize = (compressed.length / 1024).toFixed(2) + "kb";
  console.log(
    `${chalk.gray(
      chalk.bold(path.basename(filePath))
    )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
  );
}
