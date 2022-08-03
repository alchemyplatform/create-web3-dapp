import fs from "fs";

let root = ""

export const setRoot = (path) => {
    root = path;
}

export const selfDestroy = (e) => {
    console.log("CURRENT WORKING DIRECTORY::", process.cwd())
    console.log("ROOT::", root)
    console.log(e)
    fs.rmSync(root, {
        recursive: true,
        force: true,
      });
    process.exit(1)
}