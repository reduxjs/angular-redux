import type { Action, Dispatch, UnknownAction } from 'redux'
import { ReduxProvider } from './provider'
import { inject } from '@angular/core'

// TODO: Add `withTypes` support
export function injectDispatch<AppDispatch extends Dispatch<UnknownAction> = Dispatch<UnknownAction>>(): AppDispatch {
  const context = inject(ReduxProvider)
  // TODO: assertInInjectionContext
  const { store } = context

  return store.dispatch as AppDispatch
}
