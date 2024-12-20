---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
hide_title: true
---

&nbsp;

# Angular Redux Quick Start

:::tip What You'll Learn

- How to set up and use Redux Toolkit with Angular Redux

:::

:::info Prerequisites

- Familiarity with [ES6 syntax and features](https://www.taniarascia.com/es6-syntax-and-feature-overview/)
- Knowledge of Angular terminology: [State](https://angular.dev/essentials/managing-dynamic-data), [Components, Props](https://angular.dev/essentials/components), and [Signals](https://angular.dev/guide/signals)
- Understanding of [Redux terms and concepts](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)

:::

## Introduction

Welcome to the Angular Redux Quick Start tutorial! **This tutorial will briefly introduce you to Angular Redux and teach you how to start using it correctly**.

### How to Read This Tutorial

This page will focus on just how to set up a Redux application with Redux Toolkit and the main APIs you'll use. For explanations of what Redux is, how it works, and full examples of how to use Redux Toolkit, see [the Redux core docs tutorials](https://redux.js.org/tutorials/index).

For this tutorial, we assume that you're using Redux Toolkit and Angular Redux together, as that is the standard Redux usage pattern. The examples are based on [a typical Angular CLI folder structure](https://angular.dev/tools/cli) where all the application code is in a `src`, but the patterns can be adapted to whatever project or folder setup you're using.

## Usage Summary

### Install Redux Toolkit and Angular Redux

Add the Redux Toolkit and Angular Redux packages to your project:

```sh
npm install @reduxjs/toolkit @reduxjs/angular-redux
```

### Create a Redux Store

Create a file named `src/app/store.ts`. Import the `configureStore` API from Redux Toolkit. We'll start by creating an empty Redux store, and exporting it:

```typescript title="app/store.ts"
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {},
});
```

This creates a Redux store, and also automatically configure the Redux DevTools extension so that you can inspect the store while developing.

### Provide the Redux Store to Angular

Once the store is created, we can make it available to our Angular components by putting an Angular Redux `provideRedux` in our application's `providers` array in `src/main.ts`. Import the Redux store we just created, put a `provideRedux` in your application's `providers` array, and pass the store as a prop:

```typescript title="main.ts"
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
// highlight-start
import { provideRedux } from "@reduxjs/angular-redux";
import { store } from "./store";
// highlight-end

bootstrapApplication(AppComponent, {
  providers: [
    // highlight-next-line
    provideRedux({ store }),
  ],
});
```

### Create a Redux State Slice

Add a new file named `src/features/counter/counter-slice.ts`. In that file, import the `createSlice` API from Redux Toolkit.

Creating a slice requires a string name to identify the slice, an initial state value, and one or more reducer functions to define how the state can be updated. Once a slice is created, we can export the generated Redux action creators and the reducer function for the whole slice.

Redux requires that [we write all state updates immutably, by making copies of data and updating the copies](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#immutability). However, Redux Toolkit's `createSlice` and `createReducer` APIs use [Immer](https://immerjs.github.io/immer/) inside to allow us to [write "mutating" update logic that becomes correct immutable updates](https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#immutable-updates-with-immer).

```js title="features/counter/counter-slice.ts"
import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes.
      // Also, no return statement is required from these functions.
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
```

### Add Slice Reducers to the Store

Next, we need to import the reducer function from the counter slice and add it to our store. By defining a field inside the `reducer` parameter, we tell the store to use this slice reducer function to handle all updates to that state.

```js title="app/store.ts"
import { configureStore } from "@reduxjs/toolkit";
// highlight-next-line
import counterReducer from "./features/counter/counter-slice";

const store = configureStore({
  reducer: {
    // highlight-next-line
    counter: counterReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {counter: CounterState}
export type AppDispatch = typeof store.dispatch;

export default store;
```

### Use Redux State and Actions in Angular Components

Now we can use the Angular Redux inject functions to let Angular components interact with the Redux store. We can read data from the store with `injectSelector`, and dispatch actions using `injectDispatch`. Create a `src/features/counter/counter.component.ts` file with a `<app-counter>` component inside, then import that component into `app.component.ts` and render it inside of `<app-root>`.

```typescript title="features/counter/counter.component.ts"
import { Component } from "@angular/core";
import { injectSelector, injectDispatch } from "@reduxjs/angular-redux";
import { RootState } from "../../store";
import { decrement, increment } from "./counter-slice";

@Component({
  selector: "app-counter",
  standalone: true,
  template: `
    <button (click)="dispatch(increment())">Increment</button>
    <span>{{ count() }}</span>
    <button (click)="dispatch(decrement())">Decrement</button>
  `,
})
export class CounterComponent {
  count = injectSelector((state: RootState) => state.counter.value);
  dispatch = injectDispatch();
  increment = increment;
  decrement = decrement;
}
```

Now, any time you click the "Increment" and "Decrement buttons:

- The corresponding Redux action will be dispatched to the store
- The counter slice reducer will see the actions and update its state
- The `<app-counter>` component will see the new state value from the store and re-render itself with the new data

## What You've Learned

That was a brief overview of how to set up and use Redux Toolkit with Angular. Recapping the details:

:::tip Summary

- **Create a Redux store with `configureStore`**
  - `configureStore` accepts a `reducer` function as a named argument
  - `configureStore` automatically sets up the store with good default settings
- **Provide the Redux store to the Angular application components**
  - Put a Angular Redux `provideRedux` provider factory in your `bootstrapApplication`'s `providers` array
  - Pass the Redux store as `<Provider store={store}>`
- **Create a Redux "slice" reducer with `createSlice`**
  - Call `createSlice` with a string name, an initial state, and named reducer functions
  - Reducer functions may "mutate" the state using Immer
  - Export the generated slice reducer and action creators
- **Use the Angular Redux `injectSelector/injectDispatch` injections in Angular components**
  - Read data from the store with the `injectSelector` injection
  - Get the `dispatch` function with the `injectDispatch` injection, and dispatch actions as needed

:::

### Full Counter App Example

Here's the complete Counter application as a running StackBlitz:

<iframe
  class="codesandbox"
  src="https://stackblitz.com/github/reduxjs/angular-redux-essentials-counter-example/tree/main?template=node&ctl=1&embed=1&file=src%2Fapp%2Ffeatures%2Fcounter%2Fcounter-slice.ts&hideNavigation=1&view=preview"
  title="angular-redux-essentials-example"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

## What's Next?

We recommend going through [**the "Redux Essentials" and "Redux Fundamentals" tutorials in the Redux core docs**](https://redux.js.org/tutorials/index), which will give you a complete understanding of how Redux works, what Redux Toolkit and Angular Redux do, and how to use it correctly.
