import chalk from "chalk";
import {spawn} from "./spawn";
import yargs from "yargs";

function checkCodeStyle() {
    console.info(chalk`{green.bold [task]} {white.bold check code style}`);
    return spawn("prettier", ["--write", "--config", "config/prettier.json", "--list-different", "{src,test}/**/*.{ts,tsx}"], "check code style failed, please format above files");
}

function lint() {
    console.info(chalk`{green.bold [task]} {white.bold lint}`);
    return spawn("eslint", ["src/**/*.{ts,tsx}"], "lint failed, please fix");
}

function cleanup() {
    console.info(chalk`{green.bold [task]} {white.bold cleanup}`);
    return spawn("rm", ["-rf", "./dist"], "cannot remove dist folder");
}

function compile() {
    console.info(chalk`{green.bold [task]} {white.bold compile}`);
    return spawn("tsc", ["-p", "config/tsconfig.json"], "compile failed, please fix");
}

function build() {
    const isFastMode = (yargs.argv as any).mode === "fast";

    if (!isFastMode) {
        checkCodeStyle();
        lint();
    }

    cleanup();
    compile();
}

build();
