export const checkArgs = () => {
    console.log("args", process.argv)
    if (process.env.length < 3) {
        console.log("Provide a valid project name")
        process.exit(1)
    }
}