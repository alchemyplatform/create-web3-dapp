import fs from "fs";

let root = ""

export const setRoot = (path: string) => {
    root = path;
}

export const selfDestroy = () => {
    fs.rmSync(root, {
        recursive: true,
        force: true,
      });
    process.exit(1)
}


process.on('SIGINT', selfDestroy.bind(null))
process.on('SIGUSR1', selfDestroy.bind(null))
process.on('SIGUSR2', selfDestroy.bind(null))
process.on('uncaughtException', selfDestroy.bind(null))

