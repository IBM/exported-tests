# Project Overview

A UI testing architecture for writing tests that is UI framework agnostic so the tests can be written once but used in any UI framework application. The tool contains the parser(s) that convert tests written in a unique format to testing framework-specific structure/functions used by the application (e.g. Mocha, Jest, etc). This architecture was created by the Watson Health Design Pattern & Asset Library team.

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

_(recommended)_ Use [NVM](https://github.com/nvm-sh/nvm#node-version-manager---) for managing versions of Node when working on multiple projects.

### Installing

We develop using a [forking workflow](https://guides.github.com/activities/forking/) for all users looking to do any work on Exported Tests.

Now that you you have Exported Tests set up locally, navigate to the project using the `cd` command in the terminal and install dependencies using this command:

```bash
yarn
```

### Deployment

We distribute Exported Tests as ES6 and ES5 modules for backward-compatibility support of various testing frameworks. Import the desired module type from the following locations:

* ES6 - `index.js`
* ES5 - `es5.js`

To run the transpiler and generate the ES5 modules use this command:

```bash
yarn build
```

## Contribution Guide

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.
