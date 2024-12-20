---
id: getting-started
title: Getting Started with Angular Redux
hide_title: true
sidebar_label: Getting Started
description: "Introduction > Getting Started: First steps with Angular Redux"
---

# Getting Started with Angular Redux

[Angular Redux](https://github.com/reduxjs/angular-redux) is the official [Angular](https://angular.dev/) UI bindings layer for [Redux](https://redux.js.org/). It lets your Angular components read data from a Redux store, and dispatch actions to the store to update state.

## Installation

Angular Redux 2.x requires **Angular 19 or later**, in order to make use of Angular Signals.

### Installing with `ng add`

You can install the Store to your project with the following `ng add` command <a href="https://angular.dev/cli/add" target="_blank">(details here)</a>:

```sh
ng add @reduxjs/angular-redux@latest
```

#### Optional `ng add` flags

| flag          | description                                                                                                                                                                         | value type | default value |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| `--path`      | Path to the module that you wish to add the import for the `provideRedux` to.                                                                                                       | `string`   |               |
| `--project`   | Name of the project defined in your `angular.json` to help locating the module to add the `provideRedux` to.                                                                        | `string`   |               |
| `--module`    | Name of file containing the module that you wish to add the import for the `provideRedux` to. Can also include the relative path to the file. For example, `src/app/app.module.ts`. | `string`   | `app`         |
| `--storePath` | The file path to create the state in.                                                                                                                                               | `string`   | `store`       |

This command will automate the following steps:

1. Update `package.json` > `dependencies` with Redux, Redux Toolkit, and Angular Redux
2. Run `npm install` to install those dependencies.
3. Update your `src/app/app.module.ts` > `imports` array with `provideRedux({store})`
4. If the project is using a `standalone bootstrap`, it adds `provideRedux({store})` into the application config.

### Installing with `npm` or `yarn`

To use Angular Redux with your Angular app, install it as a dependency:

```bash
# If you use npm:
npm install @reduxjs/angular-redux

# Or if you use Yarn:
yarn add @reduxjs/angular-redux
```

You'll also need to [install Redux](https://redux.js.org/introduction/installation) and [set up a Redux store](https://redux.js.org/recipes/configuring-your-store/) in your app.

Angular-Redux is written in TypeScript, so all types are automatically included.

## API Overview

### `provideRedux`

Angular Redux includes a `provideRedux` provider factory, which makes the Redux store available to the rest of your app:

```typescript
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRedux } from "@reduxjs/angular-redux";
import { AppComponent } from "./app/app.component";
import { store } from "./store";

bootstrapApplication(AppComponent, {
  providers: [provideRedux({ store })],
});
```

### Injectables

Angular Redux provides a pair of custom Angular injectable functions that allow your Angular components to interact with the Redux store.

`injectSelector` reads a value from the store state and subscribes to updates, while `injectDispatch` returns the store's `dispatch` method to let you dispatch actions.

```typescript
import { Component } from "@angular/core";
import { injectSelector, injectDispatch } from "@reduxjs/angular-redux";
import { decrement, increment } from "./store/counter-slice";
import { RootState } from "./store";

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <button (click)="dispatch(increment())">Increment</button>
    <span>{{ count() }}</span>
    <button (click)="dispatch(decrement())">Decrement</button>
  `,
})
export class AppComponent {
  count = injectSelector((state: RootState) => state.counter.value);
  dispatch = injectDispatch();
  increment = increment;
  decrement = decrement;
}
```

## Help and Discussion

The **[#redux channel](https://discord.gg/0ZcbPKXt5bZ6au5t)** of the **[Reactiflux Discord community](http://www.reactiflux.com)** is our official resource for all questions related to learning and using Redux. Reactiflux is a great place to hang out, ask questions, and learn - come join us!

You can also ask questions on [Stack Overflow](https://stackoverflow.com) using the **[#redux tag](https://stackoverflow.com/questions/tagged/redux)**.
