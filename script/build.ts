import chalk from "chalk";
import {spawnSync} from "child_process";
import yargs from "yargs";
import fs from "fs";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {version} = require("../package.json");

function spawn(command: string, args: string[], errorMessage: string, ignore: boolean = false) {
    const isWindows = process.platform === "win32";
    const result = spawnSync(isWindows ? command + ".cmd" : command, args, {stdio: "inherit"});
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0 && !ignore) {
        console.log(result);
        console.error(chalk`{red.bold ${errorMessage}}`);
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${args.join(" ")}`);
        process.exit(1);
    }
}

function checkCodeStyle() {
    console.info(chalk`{green.bold [task]} {white.bold check code style}`);
    return spawn("prettier", ["--write", "--config", "config/prettier.json", "--list-different", "{src,test}/**/*.{ts,tsx}"], "check code style failed, please format above files");
}

function lint() {
    console.info(chalk`{green.bold [task]} {white.bold lint}`);
    return spawn("eslint", ["{src,test}/**/*.{ts,tsx}"], "lint failed, please fix");
}

function cleanup() {
    console.info(chalk`{green.bold [task]} {white.bold cleanup}`);
    return spawn("rm", ["-rf", "./dist"], "cannot remove dist folder");
}

function compile() {
    console.info(chalk`{green.bold [task]} {white.bold compile}`);
    return spawn("tsc", ["-p", "config/tsconfig.json"], "compile failed, please fix");
}

function commit() {
    console.info(chalk`{green.bold [task]} {white.bold commit to git}`);
    spawn("git", ["add", "."], "cannot add changes to git tree", true);
    return spawn("git", ["commit", "-m", `[SYSTEM]: ${version}: build package`], "cannot commit changes", true);
}

function push() {
    console.info(chalk`{green.bold [task]} {white.bold push to github}`);
    spawn("git", ["pull", "--rebase", "--autostash"], "cannot pull changes from upstream", true);
    return spawn("git", ["push", "-u", "origin", "master"], "cannot push to github", true);
}

function publish() {
    console.info(chalk`{green.bold [task]} {white.bold publish to NPM}`);
    const location = path.join(__dirname, "../package.json");
    const rawPackageJSON = fs.readFileSync(location, {encoding: "utf-8"});
    const parsedJSON = JSON.parse(rawPackageJSON);
    // const version = parseInt(parsedJSON.version[parsedJSON.version.length - 1]) + 1;
    console.log(parsedJSON.version);
    // parsedJSON.version = parsedJSON.version.subString(0, parsedJSON.version.length - 1) + version;
    // fs.writeFileSync(location, JSON.stringify(parsedJSON, null, 4), {encoding: "utf-8"});

    // return spawn("git", ["push", "-u", "origin", "master"], "cannot push to github", true);
}

function build() {
    const isFastMode = yargs.argv.mode === "fast";

    if (!isFastMode) {
        checkCodeStyle();
        lint();
    }

    cleanup();
    compile();
    commit();
    push();
    publish();
}

build();
