import { Injectable } from '@angular/core'
import type { Action, Store, UnknownAction } from 'redux'

@Injectable({providedIn: null})
export class ReduxProvider<A extends Action<string> = UnknownAction, S = unknown> {
  store!: Store<S, A>;
}
