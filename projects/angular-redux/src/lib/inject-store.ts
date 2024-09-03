import { assertInInjectionContext, inject } from '@angular/core'
import { ReduxProvider } from './provider'
import type { Store, Action, UnknownAction } from 'redux'

export function injectStore<A extends Action<string> = UnknownAction, S = unknown>(): Store<S, A> {
  assertInInjectionContext(injectStore)
  const context = inject(ReduxProvider)
  const { store } = context
  return store
}
