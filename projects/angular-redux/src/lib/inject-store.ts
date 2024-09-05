import { assertInInjectionContext, inject } from '@angular/core'
import { ReduxProvider } from './provider'
import type { Store, Action } from 'redux'

/**
 * Represents a type that extracts the action type from a given Redux store.
 *
 * @template StoreType - The specific type of the Redux store.
 *
 * @internal
 */
export type ExtractStoreActionType<StoreType extends Store> =
  StoreType extends Store<any, infer ActionType> ? ActionType : never

/**
 * Represents a custom injection that provides access to the Redux store.
 *
 * @template StoreType - The specific type of the Redux store that gets returned.
 *
 * @public
 */
export interface InjectStore<StoreType extends Store> {
  /**
   * Returns the Redux store instance.
   *
   * @returns The Redux store instance.
   */
  (): StoreType

  /**
   * Returns the Redux store instance with specific state and action types.
   *
   * @returns The Redux store with the specified state and action types.
   *
   * @template StateType - The specific type of the state used in the store.
   * @template ActionType - The specific type of the actions used in the store.
   */
    <
      StateType extends ReturnType<StoreType['getState']> = ReturnType<
        StoreType['getState']
      >,
      ActionType extends Action = ExtractStoreActionType<Store>,
    >(): Store<StateType, ActionType>

  /**
   * Creates a "pre-typed" version of {@linkcode injectStore injectStore}
   * where the type of the Redux `store` is predefined.
   *
   * This allows you to set the `store` type once, eliminating the need to
   * specify it with every {@linkcode injectStore injectStore} call.
   *
   * @returns A pre-typed `injectStore` with the store type already defined.
   *
   * @example
   * ```ts
   * export const useAppStore = injectStore.withTypes<AppStore>()
   * ```
   *
   * @template OverrideStoreType - The specific type of the Redux store that gets returned.
   */
  withTypes: <
    OverrideStoreType extends StoreType,
  >() => InjectStore<OverrideStoreType>
}

/**
 * Injection factory, which creates a `injectStore` injection bound to a given context.
 *
 * @returns {Function} A `injectStore` injection bound to the specified context.
 */
export function createStoreInjection<
  StateType = unknown,
  ActionType extends Action = Action,
>() {
  const injectStore = () => {
    assertInInjectionContext(injectStore)
    const context = inject(ReduxProvider)
    const { store } = context
    return store
  }

  Object.assign(injectStore, {
    withTypes: () => injectStore,
  })

  return injectStore as InjectStore<Store<StateType, ActionType>>
}

/**
 * A injection to access the redux store.
 *
 * @returns {any} the redux store
 *
 * @example
 *
 * import { injectStore } from '@reduxjs/angular-redux'
 *
 * @Component({
 *   selector: 'example-component',
 *   template: `<div>{{store.getState()}}</div>`
 * })
 * export class CounterComponent {
 *   store = injectStore()
 * }
 */
export const injectStore = /* #__PURE__*/ createStoreInjection()
