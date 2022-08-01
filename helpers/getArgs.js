const getArgs = () => {
    
    const projectName = process.argv[2];
    const taxonomy = process.argv[3]
    const currentPath = process.cwd();
    const projectPath = path.join(currentPath, projectName);
    const gitRepo = "";

    return projectData = {
        projectName,
        taxonomy,
        projectPath,
        gitRepo
    }
}