import { EqualityFn } from './types'
import { inject } from '@angular/core'
import { ReduxProvider } from './provider'

export interface UseSelectorOptions<Selected = unknown> {
  equalityFn?: EqualityFn<Selected>
}

const refEquality: EqualityFn<any> = (a, b) => a === b

// TODO: Add support for `withTypes`
export function injectSelector<TState = unknown, Selected = unknown>(
  selector: (state: TState) => Selected,
  equalityFnOrOptions?: EqualityFn<Selected> | UseSelectorOptions<Selected>,
): Selected {
  const reduxContext = inject(ReduxProvider);

  // const { equalityFn = refEquality } =
  //   typeof equalityFnOrOptions === 'function'
  //     ? { equalityFn: equalityFnOrOptions }
  //     : equalityFnOrOptions

  const {
    store
  } = reduxContext

  const selectedState = selector(store.getState())

  return selectedState
}
