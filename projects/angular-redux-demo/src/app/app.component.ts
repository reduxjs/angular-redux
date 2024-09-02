import { Component } from '@angular/core'
import { injectSelector } from 'angular-redux'
import { RootState } from './store'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <div>
      {{count}}
    </div>
  `
})
export class AppComponent {
  count = injectSelector((state: RootState) => state.counter.value)
}
