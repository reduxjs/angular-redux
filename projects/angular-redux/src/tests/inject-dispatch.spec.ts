import { createStore } from 'redux';
import { injectDispatch, provideRedux } from '../public-api';
import { Component } from '@angular/core';
import { render } from '@testing-library/angular';

const store = createStore((c: number = 1): number => c + 1);
const store2 = createStore((c: number = 1): number => c + 2);

describe('injectDispatch', () => {
  it("returns the store's dispatch function", async () => {
    @Component({
      selector: 'app-root',
      standalone: true,
      template: '<p></p>',
    })
    class Testing {
      dispatch = injectDispatch();
    }

    const result = await render(Testing, {
      providers: [provideRedux({ store })],
    });

    expect(result.fixture.componentRef.instance.dispatch).toBe(store.dispatch);
  });
});
