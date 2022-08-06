export const setUpHardhat = (dappInfo) => {
    console.log(chalk.yellow(`Copying ${dappInfo.type} files...`));
      const bar2 = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      );
      bar2.start(100, 0);
      bar2.update(50);

      switch (dappInfo.type) {
        case "hardhat":
          let hardhatTemplate = path.join(
            process.cwd(),
            "templates",
            "hardhat"
          );
            fse.mkdirSync(path.join(process.cwd(), "backend"));
          fse.copySync(hardhatTemplate, path.join(process.cwd(), "backend"));
          createEnv(dappInfo.APIKey, path.join(process.cwd(), "backend"))
          break;
        case "foundry":
          break;
        case "anchor":
          break;
      }

      bar2.update(100);
      bar2.stop();
      console.log(
        chalk.green("Smart Contract Development Environment copied ✅")
      );
    
}