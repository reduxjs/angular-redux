import { Component } from '@angular/core'
import {injectSelector, injectDispatch} from "angular-redux";
import { decrement, increment } from './store/counter-slice'
import { RootState } from './store'

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
