import { Component, input } from '@angular/core';
import { render, waitFor } from '@testing-library/angular';
import '@testing-library/jest-dom';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { provideRedux, injectDispatch, injectSelector } from '../public-api';
import { userEvent } from '@testing-library/user-event';
import { createStore } from 'redux';

const user = userEvent.setup();

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
});

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div>
      <div>
        <button aria-label="Increment value" (click)="dispatch(increment())">
          Increment
        </button>
        <span>Count: {{ count() }}</span>
      </div>
    </div>
  `,
})
export class AppComponent {
  count = injectSelector((state: any) => state.counter.value);
  dispatch = injectDispatch();
  increment = counterSlice.actions.increment;
}

it('injectSelector should work without reactivity', async () => {
  const store = configureStore({
    reducer: {
      counter: counterSlice.reducer,
    },
  });

  const { getByText } = await render(AppComponent, {
    providers: [provideRedux({ store })],
  });

  expect(getByText('Count: 0')).toBeInTheDocument();
});

it('injectSelector should work with reactivity', async () => {
  const store = configureStore({
    reducer: {
      counter: counterSlice.reducer,
    },
  });

  const { getByText, getByLabelText } = await render(AppComponent, {
    providers: [provideRedux({ store })],
  });

  expect(getByText('Count: 0')).toBeInTheDocument();

  await user.click(getByLabelText('Increment value'));

  expect(getByText('Count: 1')).toBeInTheDocument();
});

it('should show a value dispatched during ngOnInit', async () => {
  const store = configureStore({
    reducer: {
      counter: counterSlice.reducer,
    },
  });

  @Component({
    selector: 'app-root',
    standalone: true,
    template: '<p>Count: {{count()}}</p>',
  })
  class Comp {
    count = injectSelector((state: any) => state.counter.value);
    dispatch = injectDispatch();
    increment = counterSlice.actions.increment;

    ngOnInit() {
      this.dispatch(this.increment());
    }
  }

  const { getByText } = await render(Comp, {
    providers: [provideRedux({ store })],
  });

  await waitFor(() => expect(getByText('Count: 1')).toBeInTheDocument());
});

it("should not throw an error on a required input passed to the selector's fn", async () => {
  const store = configureStore({
    reducer: {
      counter: counterSlice.reducer,
    },
  });

  @Component({
    selector: 'app-count-and-add',
    standalone: true,
    template: `
      <button aria-label="Increment value" (click)="dispatch(increment())">
        Increment
      </button>
      <p>Count: {{ count() }}</p>
    `,
  })
  class CountAndAdd {
    dispatch = injectDispatch();
    increment = counterSlice.actions.increment;
    addBy = input.required<number>();
    count = injectSelector((state: any) => state.counter.value + this.addBy());
  }

  @Component({
    selector: 'app-root',
    imports: [CountAndAdd],
    standalone: true,
    template: '<app-count-and-add [addBy]="12"/>',
  })
  class App {}

  const { getByText, getByLabelText } = await render(App, {
    providers: [provideRedux({ store })],
  });

  await waitFor(() => expect(getByText('Count: 12')).toBeInTheDocument());
  await user.click(getByLabelText('Increment value'));
  await waitFor(() => expect(getByText('Count: 13')).toBeInTheDocument());
});
