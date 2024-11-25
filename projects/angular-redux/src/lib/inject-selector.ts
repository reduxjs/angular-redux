import { EqualityFn } from './types';
import {
  assertInInjectionContext,
  DestroyRef,
  effect,
  inject,
  linkedSignal,
  Signal,
  signal,
} from '@angular/core';
import { ReduxProvider } from './provider';

export interface InjectSelectorOptions<Selected = unknown> {
  equalityFn?: EqualityFn<Selected>;
}

const refEquality: EqualityFn<any> = (a, b) => a === b;

/**
 * Represents a custom injection that allows you to extract data from the
 * Redux store state, using a selector function. The selector function
 * takes the current state as an argument and returns a part of the state
 * or some derived data. The injection also supports an optional equality
 * function or options object to customize its behavior.
 *
 * @template StateType - The specific type of state this injection operates on.
 *
 * @public
 */
export interface InjectSelector<StateType = unknown> {
  /**
   * A function that takes a selector function as its first argument.
   * The selector function is responsible for selecting a part of
   * the Redux store's state or computing derived data.
   *
   * @param selector - A function that receives the current state and returns a part of the state or some derived data.
   * @param equalityFnOrOptions - An optional equality function or options object for customizing the behavior of the selector.
   * @returns The selected part of the state or derived data.
   *
   * @template TState - The specific type of state this injection operates on.
   * @template Selected - The type of the value that the selector function will return.
   */
  <TState extends StateType = StateType, Selected = unknown>(
    selector: (state: TState) => Selected,
    equalityFnOrOptions?:
      | EqualityFn<Selected>
      | InjectSelectorOptions<Selected>,
  ): Signal<Selected>;

  /**
   * Creates a "pre-typed" version of {@linkcode injectSelector injectSelector}
   * where the `state` type is predefined.
   *
   * This allows you to set the `state` type once, eliminating the need to
   * specify it with every {@linkcode injectSelector injectSelector} call.
   *
   * @returns A pre-typed `injectSelector` with the state type already defined.
   *
   * @example
   * ```ts
   * export const injectAppSelector = injectSelector.withTypes<RootState>()
   * ```
   *
   * @template OverrideStateType - The specific type of state this injection operates on.
   */
  withTypes: <
    OverrideStateType extends StateType,
  >() => InjectSelector<OverrideStateType>;
}

/**
 * Injection factory, which creates a `injectSelector` injection bound to a given context.
 *
 * @returns {Function} A `injectSelector` injection bound to the specified context.
 */
export function createSelectorInjection(): InjectSelector {
  const injectSelector = <TState, Selected>(
    selector: (state: TState) => Selected,
    equalityFnOrOptions:
      | EqualityFn<Selected>
      | InjectSelectorOptions<Selected> = {},
  ): Signal<Selected> => {
    assertInInjectionContext(injectSelector);
    const reduxContext = inject(ReduxProvider);
    const destroyRef = inject(DestroyRef);

    const { equalityFn = refEquality } =
      typeof equalityFnOrOptions === 'function'
        ? { equalityFn: equalityFnOrOptions }
        : equalityFnOrOptions;

    const { store, subscription } = reduxContext;

    const selectedState = linkedSignal(() => selector(store.getState()));

    const unsubscribe = subscription.addNestedSub(() => {
      const data = selector(store.getState());
      if (equalityFn(selectedState(), data)) {
        return;
      }

      selectedState.set(data);
    });

    destroyRef.onDestroy(() => {
      unsubscribe();
    });

    return selectedState.asReadonly();
  };

  Object.assign(injectSelector, {
    withTypes: () => injectSelector,
  });

  return injectSelector as InjectSelector;
}

/**
 * A injection to access the redux store's state. This injection takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * This injection takes an optional equality comparison function as the second parameter
 * that allows you to customize the way the selected state is compared to determine
 * whether the component needs to be re-rendered.
 *
 * @param {Function} selector the selector function
 * @param {Function=} equalityFn the function that will be used to determine equality
 *
 * @returns {any} the selected state
 *
 * @example
 *
 * import { injectSelector } from '@reduxjs/angular-redux'
 *
 * @Component({
 *   selector: 'counter-component',
 *   template: `<div>{{counter}}</div>`
 * })
 * export class CounterComponent {
 *   counter = injectSelector(state => state.counter)
 * }
 */
export const injectSelector = /* #__PURE__*/ createSelectorInjection();
