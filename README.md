<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->


TODO:
- ADD SOLANA
- STYLE COMPONENTS
- RELEASE BETA 1
- CONVERT TO TYPESCRIPT
- ADD TYPESCRYPT SUPPORT
- RELEASE BETA 2
- ADD TAILWIND
- RELEASE

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/eversmile12/create-web3-dapp">
    <img src="images/logo.webp" alt="Logo" width="100" height="100">
  </a>

<h2 align="center">create-web3-dapp</h2>

  <p align="center">
    Everything you need to build decentralized applications
    <br />
    <a href="https://docs.alchemy.com"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/eversmile12/create-web3-dapp">Contribute</a>
    ·
    <a href="https://github.com/eversmile12/create-web3-dapp/issues">Report Bug</a>
    ·
    <a href="https://github.com/eversmile12/create-web3-dapp/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contributors">Contributors</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

**ATTENTION**: This project is under beta and not ready for production - using it in product is highgly discouraged without prior thorough review. 

![product-screenshot]

Create and deploy a decentralized application on Ethereum, Polygon, Solana, and all major chains, in a matter of minutes.

create-web3-dapp is an utility NPX package built on top of NextJS that allows developers to pick and choose the boilerplates of their decentralized application.

From the chain to use, through the wallet login system, to the React components to include and the Blockchain development environment, everything developers need to spin up their web3 dapps, bundled in an easy to use command line tool.

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

* NodeJS

To install node go on the [official Node website](https://nodejs.org/en/download/), and download the LTS package for your Operating System.

To verify if NodeJS has been correctly installed on your system, open your terminal and run:
```sh
node -v
```
and
```sh
npm -v
```


### Installation

1. In your terminal run
* ```sh
  npx create-web3-dapp
  ```

2. The first time you'll run this command, it will install the package. 

3. Now the following command again:
 * ```sh
    npx create-web3-dapp
   ```
This will start the DApp creation flow.

<p align="right">(<a href="#top">back to top</a>)</p>


## DApp Creation Flow
Once started, the create-web3-dapp wizard will ask you a series of questions to understand what to and what to not include in your dapp boilerplates.

Here's a reference to the creation flow:

1. **Insert new dapp name** *(text)*
2. **select dapp chain** *(options)*:
    1. The user can choose between the chains supported by Alchemy including Solana
        1. Because our support to Solana is currently limited, the Solana implementation has partial ROI against the EVM one. 
3. **select if we want to import the template files** *(true/false)*:
    1. The template files contain code showcasing the Alchemy SDK capabilities (NFT API, Transfer API) through a set of NextJs components visual components.
    2. If the user doesn’t install the template files, Alchemy will be only used to connect the wallet - the Alchemy SDK won’t be installed (to brainstorm)
4. **Select if we want to import a Blockchain development environment like** *(options)*:
    1. Hardhat (partially supported) - EVM
    2. Foundry (not yet supported) - EVM
    3. Anchor (not yet supported) - Solana
5. **Add Alchemy API Key:**
    1. The key will be used:
        1. In the front-end to connect:
            1. The wallet (Solana, EVM)
            2. In the Alchemy SDK if the user has installed the template files[4a](EVM)
        2. In the Blockchain development environment [5](Solana, EVM)
6. **The builder will now proceed to create the project, performing the following actions:**
    1. download the files from the GitHub repositories:
        1. 
    2. Install the dependencies (Alchemy SDK, Rainbow Kit, Hardhat, etc)
    3. Update the dependencies
    4. Run the application 
6. **The user will now be able to see the following landing page at http://localhost:3000:**

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/github_username/repo_name](https://github.com/github_username/repo_name)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/eversmile12/create-web3-dapp.svg?style=for-the-badge
[contributors-url]: https://github.com/eversmile12/create-web3-dapp/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/eversmile12/create-web3-dapp.svg?style=for-the-badge
[forks-url]: https://github.com/eversmile12/create-web3-dapp/network/members
[stars-shield]: https://img.shields.io/github/stars/eversmile12/create-web3-dapp.svg?style=for-the-badge
[stars-url]: https://github.com/eversmile12/create-web3-dapp/stargazers
[issues-shield]: https://img.shields.io/github/issues/eversmile12/create-web3-dapp.svg?style=for-the-badge
[issues-url]: https://github.com/eversmile12/create-web3-dapp/issues
[license-shield]: https://img.shields.io/github/license/eversmile12/create-web3-dapp.svg?style=for-the-badge
[license-url]: https://github.com/eversmile12/create-web3-dapp/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555


[product-screenshot]: images/screenshot.png
