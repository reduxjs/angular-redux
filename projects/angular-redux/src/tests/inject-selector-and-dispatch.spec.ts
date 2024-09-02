import { Component } from '@angular/core'
import { render } from '@testing-library/angular'
import '@testing-library/jest-dom'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { provideRedux, injectDispatch, injectSelector } from '../public-api'
import { userEvent } from '@testing-library/user-event'

const user = userEvent.setup();

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1
    }
  },
})

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div>
      <div>
        <button
          aria-label="Increment value"
          (click)="dispatch(increment())"
        >
          Increment
        </button>
        <span>Count: {{ count() }}</span>
      </div>
    </div>
  `
})
export class AppComponent {
  count = injectSelector((state: any) => state.counter.value)
  dispatch = injectDispatch()
  increment = counterSlice.actions.increment
}

it('injectSelector should work without reactivity', async () => {
  const store = configureStore({
    reducer: {
      counter: counterSlice.reducer,
    },
  })

  const {getByText} = await render(AppComponent, {
    providers: [provideRedux({store})]
  })

  expect(getByText("Count: 0")).toBeInTheDocument();
})

it('injectSelector should work with reactivity', async () => {
  const store = configureStore({
    reducer: {
      counter: counterSlice.reducer,
    },
  })

  const {getByText, getByLabelText} = await render(AppComponent, {
    providers: [provideRedux({store})]
  })

  expect(getByText("Count: 0")).toBeInTheDocument();

  await user.click(getByLabelText("Increment value"))

  expect(getByText("Count: 1")).toBeInTheDocument();
})
