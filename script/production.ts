import chalk from "chalk";
import fs from "fs";
import path from "path";
import {spawn} from "./spawn";

function commit() {
    console.info(chalk`{green.bold [task]} {white.bold commit to git}`);
    spawn("git", ["add", "."], "cannot add changes to git tree", true);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {version} = require("../package.json");
    return spawn("git", ["commit", "-m", `[SYSTEM]: ${version}: build package`], "cannot commit changes", true);
}

function push() {
    console.info(chalk`{green.bold [task]} {white.bold push to github}`);
    spawn("git", ["pull", "--rebase", "--autostash"], "cannot pull changes from upstream", true);
    return spawn("git", ["push", "-u", "origin", "master"], "cannot push to github", true);
}

function updatePackageJSON() {
    console.info(chalk`{green.bold [task]} {white.bold Update Package.json}`);
    const location = path.join(__dirname, "../package.json");
    const rawPackageJSON = fs.readFileSync(location, {encoding: "utf-8"});
    const parsedJSON = JSON.parse(rawPackageJSON);
    const version = parseInt(parsedJSON.version[parsedJSON.version.length - 1]) + 1;
    parsedJSON.version = parsedJSON.version.substring(0, parsedJSON.version.length - 1) + version;
    fs.writeFileSync(location, JSON.stringify(parsedJSON, null, 4), {encoding: "utf-8"});
}

function build() {
    updatePackageJSON();
    commit();
    push();
}

build();
