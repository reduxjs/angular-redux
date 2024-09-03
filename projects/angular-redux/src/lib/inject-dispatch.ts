import type { Dispatch, UnknownAction, Action } from 'redux'
import { assertInInjectionContext } from '@angular/core'
import { injectStore } from './inject-store'


/**
 * Represents a custom injection that provides a dispatch function
 * from the Redux store.
 *
 * @template DispatchType - The specific type of the dispatch function.
 *
 * @public
 */
export interface InjectDispatch<
  DispatchType extends Dispatch<UnknownAction> = Dispatch<UnknownAction>,
> {
  /**
   * Returns the dispatch function from the Redux store.
   *
   * @returns The dispatch function from the Redux store.
   *
   * @template AppDispatch - The specific type of the dispatch function.
   */
    <AppDispatch extends DispatchType = DispatchType>(): AppDispatch

  /**
   * Creates a "pre-typed" version of {@linkcode injectDispatch injectDispatch}
   * where the type of the `dispatch` function is predefined.
   *
   * This allows you to set the `dispatch` type once, eliminating the need to
   * specify it with every {@linkcode injectDispatch injectDispatch} call.
   *
   * @returns A pre-typed `injectDispatch` with the dispatch type already defined.
   *
   * @example
   * ```ts
   * export const injectAppDispatch = injectDispatch.withTypes<AppDispatch>()
   * ```
   *
   * @template OverrideDispatchType - The specific type of the dispatch function.
   */
  withTypes: <
    OverrideDispatchType extends DispatchType,
  >() => InjectDispatch<OverrideDispatchType>
}

/**
 * Injection factory, which creates a `injectDispatch` injection bound to a given context.
 *
 * @returns {Function} A `injectDispatch` injection bound to the specified context.
 */
export function createDispatchInjection<
  ActionType extends Action = UnknownAction,
>() {
  const injectDispatch = <AppDispatch extends Dispatch<UnknownAction> = Dispatch<UnknownAction>>(): AppDispatch  => {
    assertInInjectionContext(injectDispatch)
    const store = injectStore();
    return store.dispatch as AppDispatch
  }

  Object.assign(injectDispatch, {
    withTypes: () => injectDispatch,
  })

  return injectDispatch as InjectDispatch<Dispatch<ActionType>>
}

/**
 * A injection to access the redux `dispatch` function.
 *
 * @returns {any|function} redux store's `dispatch` function
 *
 * @example
 *
 * import { injectDispatch } from 'angular-redux'
 *
 * @Component({
 *   selector: 'example-component',
 *   template: `
 *     <div>
 *       <span>{{value}}</span>
 *       <button (click)="increaseCounter()">Increase counter</button>
 *     </div>
 *   `
 * })
 * export class CounterComponent {
 *   dispatch = injectDispatch()
 *   increaseCounter = () => dispatch({ type: 'increase-counter' })
 * }
 */
export const injectDispatch = /* #__PURE__*/ createDispatchInjection()
