# Angular Redux

Unofficial Angular bindings for [Redux](https://github.com/reduxjs/redux).
Performant and flexible.

# Features

- Compatible with Angular 18+
- [Signals](https://angular.dev/guide/signals) support
- [Redux Toolkit](https://redux-toolkit.js.org/) support

# Usage

The following Angular component works as-expected:

```angular-ts
import { Component } from '@angular/core'
import {injectSelector, injectDispatch} from "angular-redux";
import { decrement, increment, RootState  } from './store/counter-slice'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <div>
      <div>
        <button
          aria-label="Increment value"
          (click)="dispatch(increment())"
        >
          Increment
        </button>
        <span>{{ count() }}</span>
        <button
          aria-label="Decrement value"
          (click)="dispatch(decrement())"
        >
          Decrement
        </button>
      </div>
    </div>
  `
})
export class AppComponent {
  count = injectSelector((state: RootState) => state.counter.value)
  dispatch = injectDispatch()
  increment = increment
  decrement = decrement
}
```

Assuming the following `store.ts` file is present:

```typescript
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```
