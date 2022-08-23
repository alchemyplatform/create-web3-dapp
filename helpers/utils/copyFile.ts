import path from "path"
import fse from "fs-extra"

export const copyFile = (folder, filename, destination) => {
    console.log(`Copying ${folder}/${filename} to ${destination}`)
    const file = path.join(process.cwd(), "templates", folder, filename)

    if (destination !== process.cwd()) {
        destination = path.join(process.cwd(), destination, "/")
    }
    fse.removeSync(path.join(destination, filename), {
		force: true,
	});
    fse.copySync(file, destination)
}