import { Injectable } from '@angular/core'
import type { Action, Store, UnknownAction } from 'redux'

@Injectable()
export class ReduxProvider<A extends Action<string> = UnknownAction, S = unknown> {
  constructor(public store: Store<S, A>) {
  }
}
