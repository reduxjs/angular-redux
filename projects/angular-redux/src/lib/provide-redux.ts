import type { Action, Store, UnknownAction } from 'redux'
import { ReduxProvider } from './provider'

export interface ProviderProps<
  A extends Action<string> = UnknownAction,
  S = unknown,
> {
  /**
   * The single Redux store in your application.
   */
  store: Store<S, A>
}

export function provideRedux<A extends Action<string> = UnknownAction, S = unknown>({
  store
}: ProviderProps<A, S>) {
  return {
    provide: ReduxProvider,
    useValue: (() => {
      const provider = new ReduxProvider<A, S>();
      provider.store = store;
      return provider;
    })()
  }
}
