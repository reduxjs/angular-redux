import { Component, inject } from '@angular/core'
import { ReduxProvider } from 'angular-redux'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <div>
      {{data.message}}
    </div>
  `
})
export class AppComponent {
  data = inject(ReduxProvider)
}
