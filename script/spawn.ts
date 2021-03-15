import chalk from "chalk";
import {spawnSync} from "child_process";

export function spawn(command: string, args: string[], errorMessage: string, ignore: boolean = false) {
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
