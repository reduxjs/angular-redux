import { EqualityFn } from './types'
import { assertInInjectionContext, effect, inject, Signal, signal } from '@angular/core'
import { ReduxProvider } from './provider'

export interface UseSelectorOptions<Selected = unknown> {
  equalityFn?: EqualityFn<Selected>
}

const refEquality: EqualityFn<any> = (a, b) => a === b

// TODO: Add support for `withTypes`
export function injectSelector<TState = unknown, Selected = unknown>(
  selector: (state: TState) => Selected,
  equalityFnOrOptions: EqualityFn<Selected> | UseSelectorOptions<Selected> = {},
): Signal<Selected> {
  assertInInjectionContext(injectSelector)
  const reduxContext = inject(ReduxProvider);

  const { equalityFn = refEquality } =
    typeof equalityFnOrOptions === 'function'
      ? { equalityFn: equalityFnOrOptions }
      : equalityFnOrOptions

  const {
    store,
    subscription
  } = reduxContext

  const selectedState = signal(selector(store.getState()))

  effect((onCleanup) => {
    const unsubscribe = subscription.addNestedSub(() => {
      const data = selector(store.getState());
      if (equalityFn(selectedState(), data)) {
        return
      }

      selectedState.set(data);
    })

    onCleanup(() => {
      unsubscribe()
    })
  })

  return selectedState
}
