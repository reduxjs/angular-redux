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
