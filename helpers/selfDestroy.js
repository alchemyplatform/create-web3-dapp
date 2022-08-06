import fs from "fs";

let root = ""

export const setRoot = (path) => {
    root = path;
}

export const selfDestroy = (e) => {
    // console.log("CURRENT WORKING DIRECTORY::", process.cwd())
    // console.log("ROOT::", root)

    fs.rmSync(root, {
        recursive: true,
        force: true,
      });
    process.exit(1)
}

process.on('exit', selfDestroy.bind(null))
process.on('SIGINT', selfDestroy.bind(null))
process.on('SIGUSR1', selfDestroy.bind(null))
process.on('SIGUSR2', selfDestroy.bind(null))
process.on('uncaughtException', selfDestroy.bind(null))

