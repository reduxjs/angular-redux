# Angular Redux

Official Angular bindings for [Redux](https://github.com/reduxjs/redux).
Performant and flexible.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/reduxjs/angular-redux/test.yml?style=flat-square) [![npm version](https://img.shields.io/npm/v/@reduxjs/angular-redux.svg?style=flat-square)](https://www.npmjs.com/package/@reduxjs/angular-redux)
[![npm downloads](https://img.shields.io/npm/dm/@reduxjs/angular-redux.svg?style=flat-square)](https://www.npmjs.com/package/@reduxjs/angular-redux)

## Installation

Angular Redux requires **Angular 17.3 or later**.

### Installing with `ng add`

You can install the Store to your project with the following `ng add` command <a href="https://angular.dev/cli/add" target="_blank">(details here)</a>:

```sh
ng add @reduxjs/angular-redux@latest
```

#### Optional `ng add` flags

| flag          | description                                                                                                                                                                         | value type | default value |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|---------------
| `--path`      | Path to the module that you wish to add the import for the StoreModule to.                                                                                                          | `string`   |
| `--project`   | Name of the project defined in your `angular.json` to help locating the module to add the `provideRedux` to.                                                                        | `string`   |
| `--module`    | Name of file containing the module that you wish to add the import for the `provideRedux` to. Can also include the relative path to the file. For example, `src/app/app.module.ts`. | `string`   | `app`         
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

This assumes that you’re using [npm](http://npmjs.com/) package manager
with a module bundler like [Webpack](https://webpack.js.org/) or
[Browserify](http://browserify.org/) to consume [CommonJS
modules](https://webpack.js.org/api/module-methods/#commonjs).

# Usage

The following Angular component works as-expected:

```typescript
import { Component } from '@angular/core'
import { injectSelector, injectDispatch } from "@reduxjs/angular-redux";
import { decrement, increment } from './store/counter-slice'
import { RootState } from './store'

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
      <button (click)="dispatch(increment())">
        Increment
      </button>
      <span>{{ count() }}</span>
      <button (click)="dispatch(decrement())">
        Decrement
      </button>
  `
})
export class AppComponent {
  count = injectSelector((state: RootState) => state.counter.value)
  dispatch = injectDispatch()
  increment = increment
  decrement = decrement
}
```
