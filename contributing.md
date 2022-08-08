# Contributing

Contributions are welcome!

1. Check the [ISSUES](https://github.com/Eversmile12/create-web3-dapp/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc). Read every issue to understand what's needed and whether it's something you can help with.

2. Ask other contributors to see if no one has taken the issue yet. If you're interested in tackling such a feature and it's still available, we will assign you to the task.

3. Clone the repo and create your own branch using `git checkout -b your_branch_name`. Remember to use a branch name that describes WHAT you're doing/fixing.

4. Setup your local development environment. Instructions

5. Once your work is done with the local copy of the repo, don't hesitate to open a pull request. We'll gladly revise and push as deemed fit.

6. Feel free to add new issues as you read the code and find inconsistencies and/or possible features that may add up to the website. Follow the labeling standards to make it easier to understand what you're proposing.

7. Document changes and/or issues clearly. Make it easy for everyone involved to understand your ideas/changes.

## Local development

To setup your local dev environment:

```sh
# Clone the repo
git clone https://github.com/Eversmile12/create-web3-dapp.git

cd create-web3-dapp

# Install dependencies
yarn

```

## Creating a pull request

In order to create a pull request for create-web3-dapp, follow the GitHub instructions for [Creating a pull request from a fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork). Please link your pull request to an existing issue.

## About
This document provides a set of best practices for open source contributions - bug reports, code submissions / pull requests, etc.

Please read this before starting contributing to create-web3-dapp.

## Submitting bugs

### Due diligence
Before submitting a bug, please perform basic troubleshooting steps:

Make sure you’re on the latest version. If you’re not on the most recent version, your problem may have been solved already! Upgrading is always the best first step.

If you don’t find a pre-existing issue and/or solution in ADD LINK, consider checking on StackOverflow ADD LINK or the Alchemy Discord Server. 

### What to put in your bug report
Make sure your report gets the attention it deserves: bug reports with missing information may be ignored or punted back to you, delaying a fix. The below constitutes a bare minimum; more info is almost always better:

1. How can the developers recreate the bug on their end?
2. Your NodeJS and npm versions. You can get them by running:
```
npm -v && node -v
```
3. If possible, include a copy of your code, the command you used to invoke it, and the full output of your run (if applicable.)

A common tactic is to pare down your code until a simple (but still bug-causing) “base case” remains. Not only can this help you identify problems which aren’t real bugs, but it means the developer can get to fixing the bug faster.

## Contributing changes

### Licensing of contributed material
This project is licensed under MIT license, you can read more about what you can and CAN'T do by visiting this link ADD LINK

Anything submitted to this project falls under the licensing terms in the repository’s top level LICENSE file ADD LINK.

### Version control branching
Always make a new branch for your work, no matter how small. This makes it easy for others to take just that one set of changes from your repository, in case you have multiple unrelated changes floating around.



A corollary: don’t submit unrelated changes in the same branch/pull request! The maintainer shouldn’t have to reject your awesome bugfix because the feature you put in with it needs more review.
Base your new branch off of the appropriate branch on the main repository:

## Bug Fixes 

Bug fixes should be based on the branch named after the oldest supported release line the bug affects.

E.g. if a feature was introduced in 1.1, the latest release line is 1.3, and a bug is found in that feature - make your branch based on 1.1. The maintainer will then forward-port it to 1.3 and main.

Bug fixes requiring large changes to the code or which have a chance of being otherwise disruptive, may need to base off of master instead - Open an issue in Issues first ADD LINK

## New Features

New features should branch off of the ‘main’ branch.

Note that depending on how long it takes for the dev team to merge your patch, the copy of master you worked off of may get out of date! If you find yourself ‘bumping’ a pull request that’s been sidelined for a while, make sure you rebase or merge to latest main to ensure a speedier resolution.

## Code formatting

Follow the style you see used in the primary repository! Consistency with the rest of the project always trumps other considerations. It doesn’t matter if you have your own style or if the rest of the code breaks with the greater community - just follow along.

## Opening a Pull Request

PRs without documentation o comments will be returned to sender. By “documentation” we mean:

- List of changes and explanation of them.

New features should ideally include updates to prose documentation, including useful example code snippets.

All submissions should have a changelog entry crediting the contributor and/or any individuals instrumental in identifying the problem.

Full example
Here’s an example workflow for a project theproject hosted on Github, which is currently in version 1.3.x. Your username is yourname and you’re submitting a basic bugfix. (This workflow only changes slightly if the project is hosted at Bitbucket, self-hosted, or etc.)

### Preparing your Fork
1. Click ‘Fork’ on Github, creating e.g. yourname/theproject.
2. Clone your project: git clone git@github.com:yourname/theproject.
3. cd theproject
4. Install the development requirements: pip install -r dev-requirements.txt.
5. Create a branch: git checkout -b foo-the-bars 1.3.
6. Making your Changes
7. Hack, hack, hack.
8. Add changelog entry crediting yourself.
9. Commit your changes: git commit -m "Foo the bars"

### Creating Pull Requests
1. Push your commit to get it back up to your fork: git push origin HEAD
2. Visit Github, click handy “Pull request” button that it will make upon noticing your new branch.
3. In the description field, write down issue number (if submitting code fixing an existing issue) or describe the issue + your fix (if submitting a wholly new bugfix).
4. Hit ‘submit’! And please be patient - the maintainers will get to you when they can.
