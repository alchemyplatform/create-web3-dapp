
import fs from "fs";
import path from "path";

export const cleanUpFiles = () => {
  console.log("deleting template files");
  fs.rmSync(path.join(process.cwd(), "templates"), {
    recursive: true,
    force: true,
  });
  fs.rmSync(path.join(process.cwd(), "helpers"), {
    recursive: true,
    force: true,
  });
};
