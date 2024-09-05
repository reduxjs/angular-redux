# Angular Redux

Official Angular bindings for [Redux](https://github.com/reduxjs/redux).
Performant and flexible.


![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/reduxjs/angular-redux/test.yml?style=flat-square) [![npm version](https://img.shields.io/npm/v/@reduxjs/angular-redux.svg?style=flat-square)](https://www.npmjs.com/package/@reduxjs/angular-redux)
[![npm downloads](https://img.shields.io/npm/dm/@reduxjs/angular-redux.svg?style=flat-square)](https://www.npmjs.com/package/@reduxjs/angular-redux)

> [!WARNING]  
> This package is in alpha and is rapidly developing.

## Installation

Angular Redux requires **Angular 17.3 or later**.

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

```angular-ts
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
