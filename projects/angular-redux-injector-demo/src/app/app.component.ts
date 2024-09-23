import { Component, EnvironmentInjector, inject } from '@angular/core';
import { injectSelector, injectDispatch } from '@reduxjs/angular-redux';
import { incrementByRandomNumber } from './store/counter-slice';
import { AppDispatch, RootState } from './store';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <button (click)="incrementByRandomNumber()">
      Increment by a random number
    </button>
    <p>{{ count() }}</p>
    @if (isLoading()) {
      <p>Loading...</p>
    }
  `,
})
export class AppComponent {
  injector = inject(EnvironmentInjector);
  count = injectSelector((state: RootState) => state.counter.value);
  isLoading = injectSelector((state: RootState) => state.counter.isLoading);
  dispatch = injectDispatch<AppDispatch>();
  incrementByRandomNumber = () => {
    this.dispatch(incrementByRandomNumber({ injector: this.injector }));
  };
}
