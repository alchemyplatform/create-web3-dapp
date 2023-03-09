Everything you need to create Web3 Dapps.

This package includes the global command for Create Web3 DApp.
Please refer to its documentation:
-   [Docs](https://docs.alchemy.com/create-web3-dapp) – How to develop apps bootstrapped with Create Web3 Dapp
-   [GitHub](#) – The full code repository


## What is create-web3-dapp?

create-web3-dapp is an npx package that allows developers to **create any web3 application** in ~2 minutes.

The create-web3-dapp package is a NextJS-based framework, **compatible with the most used blockchains such as Ethereum, Polygon, Optimism, Arbitrum, and Solana**, that helps web3 developers build production-ready  decentralized applications at lightning speed, using pre-made React components, webhooks, and APIs.

## Quick Overview

```sh
npx create-web3-dapp@latest
cd my-dapp
npm run dev
```

If you've previously installed `create-web3-dapp` globally via `npx create-web3-dapp`, the CLI builder will notify you if a new version has been released. In any case, we always suggest you to run using the latest available version by running `npx create-web3-dapp@latest`.

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))_

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.<br>

![alt text](./.github/images/cli_builder.gif)



## Usage
```
npx create-web3-dapp@latest
```

## Documentation


**You’ll need to have Node 14.0.0 or later version on your local development machine** (but it’s not required on the server). We recommend using the latest LTS version. You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.

## Create a new dapp

To create a new app, go through the following steps:

1. In your terminal run:

```sh
  npx create-web3-dapp@latest
```

2. Select and create the dependencies, components, and contracts you want to include in your web3 application.


Create Web3 Dapp will then create a directory containing both the files and the dependencies you'll need to kickstart your project<br>

### Folder Structure

Without Blockchain Development Environment
```
my-dapp
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    └── serviceWorker.js
    └── setupTests.js
```

With Blockchain Development Environment
```
my-dapp
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    └── serviceWorker.js
    └── setupTests.js
```

No configuration or complicated folder structures, only the files you need to build your Dapp.<br>
Once the installation is done, you can open your project folder:

```sh
cd my-dapp
```
And, in case you've installed a blockchain development environment, navigate to the frontend folder.

Inside the newly created project, you can run some built-in commands:

`npm run dev`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.



## EVM Components
You can find detailed instructions on implementing the React components downloaded through the Components Marketplace in [the official documentation](#)

