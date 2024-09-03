import type { Dispatch, UnknownAction } from 'redux'
import { assertInInjectionContext } from '@angular/core'
import { injectStore } from './inject-store'

// TODO: Add `withTypes` support
export function injectDispatch<AppDispatch extends Dispatch<UnknownAction> = Dispatch<UnknownAction>>(): AppDispatch {
  assertInInjectionContext(injectDispatch)
  const store = injectStore();
  return store.dispatch as AppDispatch
}
