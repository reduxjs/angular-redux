# Angular Redux

Official Angular bindings for [Redux](https://github.com/reduxjs/redux).
Performant and flexible.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/reduxjs/angular-redux/test.yml?style=flat-square) [![npm version](https://img.shields.io/npm/v/@reduxjs/angular-redux.svg?style=flat-square)](https://www.npmjs.com/package/@reduxjs/angular-redux)
[![npm downloads](https://img.shields.io/npm/dm/@reduxjs/angular-redux.svg?style=flat-square)](https://www.npmjs.com/package/@reduxjs/angular-redux)
[![#redux channel on Discord](https://img.shields.io/badge/discord-redux@reactiflux-61DAFB.svg?style=flat-square)](http://www.reactiflux.com)

## Installation

Angular Redux requires **Angular 17.3 or later**.

### Installing with `ng add`

You can install the Store to your project with the following `ng add` command <a href="https://angular.dev/cli/add" target="_blank">(details here)</a>:

```sh
ng add @reduxjs/angular-redux@latest
```

#### Optional `ng add` flags

| flag          | description                                                                                                                                                                         | value type | default value |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| `--path`      | Path to the module that you wish to add the import for the StoreModule to.                                                                                                          | `string`   |
| `--project`   | Name of the project defined in your `angular.json` to help locating the module to add the `provideRedux` to.                                                                        | `string`   |
| `--module`    | Name of file containing the module that you wish to add the import for the `provideRedux` to. Can also include the relative path to the file. For example, `src/app/app.module.ts`. | `string`   | `app`         |
| `--storePath` | The file path to create the state in.                                                                                                                                               | `string`   | `store`       |

This command will automate the following steps:

1. Update `package.json` > `dependencies` with Redux, Redux Toolkit, and Angular Redux
2. Run `npm install` to install those dependencies.
3. Update your `src/app/app.module.ts` > `imports` array with `provideRedux({store})`
4. If the project is using a `standalone bootstrap`, it adds `provideRedux({store})` into the application config.

## Installing with `npm` or `yarn`

To use React Redux with your Angular app, install it as a dependency:

```bash
# If you use npm:
npm install @reduxjs/angular-redux

# Or if you use Yarn:
yarn add @reduxjs/angular-redux
```

You'll also need to [install Redux](https://redux.js.org/introduction/installation) and [set up a Redux store](https://redux.js.org/recipes/configuring-your-store/) in your app.

## Documentation

The React Redux docs are published at **https://angular-redux.js.org** .

## License

[MIT](LICENSE.md)
