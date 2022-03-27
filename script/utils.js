const fs = require("fs");
const chalk = require("chalk");

const targets = (exports.targets = fs.readdirSync("packages").filter((f) => {
  if (f === "shareUtils") {
    return false;
  }
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false;
  }
  if (!fs.existsSync(`packages/${f}/src/index.ts`)) {
    return false;
  }
  return true;
}));

exports.fuzzyMatchTarget = (partialTargets, includeAllMatching) => {
  const matched = [];
  partialTargets.forEach((partialTarget) => {
    for (const target of targets) {
      if (target.match(partialTarget)) {
        matched.push(target);
        if (!includeAllMatching) {
          break;
        }
      }
    }
  });
  if (matched.length) {
    return matched;
  } else {
    console.log();
    console.error(
      `  ${chalk.bgRed.white(" ERROR ")} ${chalk.red(
        `Target ${chalk.underline(partialTargets)} not found!`
      )}`
    );
    console.log();

    process.exit(1);
  }
};
