import { Component, effect, signal } from '@angular/core'
import {injectSelector, injectDispatch, injectStore} from "angular-redux";
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
        <span>{{ count }}</span>
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

  store = injectStore()

  val = signal(0);
  _test = effect(() => {
    if (this.val()) {
      console.log((this.store.getState() as any).counter.value)
    }
  })

  increment = () => {
    setTimeout(() => this.val.set(this.val() + 1), 100)
    return increment()
  };
  decrement = () => {
    setTimeout(() => this.val.set(this.val() + 1), 100)
    return decrement()
  };
}
