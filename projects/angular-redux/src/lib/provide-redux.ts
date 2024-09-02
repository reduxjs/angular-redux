import { Injectable } from '@angular/core'
import type { Action, Store, UnknownAction } from 'redux'

export interface ProviderProps<
  A extends Action<string> = UnknownAction,
  S = unknown,
> {
  /**
   * The single Redux store in your application.
   */
  store: Store<S, A>
}


@Injectable()
export class ReduxProvider<A extends Action<string> = UnknownAction, S = unknown> {
  constructor(private store: Store<S, A>) {
  }
  message = 'Hello, world'
}

export function provideRedux<A extends Action<string> = UnknownAction, S = unknown>({
  store
}: ProviderProps<A, S>) {
  return [
    new ReduxProvider<A, S>(store)
  ]
}
