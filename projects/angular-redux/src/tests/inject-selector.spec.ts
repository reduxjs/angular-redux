import {InjectSelector, injectSelector, provideRedux, ReduxProvider} from '../public-api'
import {Component, effect, inject} from "@angular/core";
import {render, waitFor} from "@testing-library/angular";
import {AnyAction, createStore, Store} from "redux";
import '@testing-library/jest-dom';
import {Subscription} from "../lib/utils/Subscription";

type NormalStateType = {
  count: number
}
let normalStore: Store<NormalStateType, AnyAction>
let renderedItems: any[] = []
type RootState = ReturnType<typeof normalStore.getState>
const injectNormalSelector: InjectSelector<RootState> = injectSelector

beforeEach(() => {
  normalStore = createStore(
    ({count}: NormalStateType = {count: -1}): NormalStateType => ({
      count: count + 1,
    }),
  )
  renderedItems = []
})

describe('injectSelector core subscription behavior', () => {
  it('selects the state on initial render', async () => {
    @Component({
      selector: "app-root",
      standalone: true,
      template: "<div>Count: {{count()}}</div>"
    })
    class Testing {
      count = injectNormalSelector((state) => state.count)
    }

    const {getByText} = await render(Testing, {
      providers: [provideRedux({store: normalStore})]
    })

    expect(getByText("Count: 0")).toBeInTheDocument();
  })

  it('selects the state and renders the component when the store updates', async () => {
    const selector = jest.fn((s: NormalStateType) => s.count)

    @Component({
      selector: "app-root",
      standalone: true,
      template: "<div>Count: {{count()}}</div>"
    })
    class Testing {
      count = injectNormalSelector(selector)
    }

    const {findByText} = await render(Testing, {
      providers: [provideRedux({store: normalStore})]
    })

    expect(await findByText("Count: 0")).toBeInTheDocument();
    expect(selector).toHaveBeenCalledTimes(1)

    normalStore.dispatch({type: ''})


    expect(await findByText("Count: 1")).toBeInTheDocument();
    expect(selector).toHaveBeenCalledTimes(2)
  })
})

describe('injectSelector lifecycle interactions', () => {
  it('always uses the latest state', async () => {
    const store = createStore((c: number = 1): number => c + 1, -1)

    @Component({
      selector: "app-root",
      standalone: true,
      template: "<div></div>"
    })
    class Testing {
      selector = (c: number): number => c + 1
      value = injectSelector(this.selector)
      _test = effect(() => {
        renderedItems.push(this.value())
      })
    }

    await render(Testing, {
      providers: [provideRedux({store})]
    })

    expect(renderedItems).toEqual([1])

    store.dispatch({type: ''})

    await waitFor(() =>
      expect(renderedItems).toEqual([1, 2])
    )
  })

  it('subscribes to the store synchronously', async () => {
    let appSubscription: Subscription | null = null

    @Component({
      selector: "child-root",
      standalone: true,
      template: "<div>{{count()}}</div>"
    })
    class Child {
      count = injectNormalSelector((s) => s.count)
    }

    function injectReduxAndAssignApp() {
      const contextVal = inject(ReduxProvider);
      appSubscription = contextVal && contextVal.subscription
      return contextVal;
    }

    @Component({
      selector: "app-root",
      standalone: true,
      imports: [Child],
      template: `
        @if (count() === 1) {
          <child-root/>
        }
      `
    })
    class Parent {
      contextVal = injectReduxAndAssignApp();
      count = injectNormalSelector((s) => s.count)
    }

    await render(Parent, {
      providers: [provideRedux({store: normalStore})]
    })

    // Parent component only
    expect(appSubscription!.getListeners().get().length).toBe(1)

    normalStore.dispatch({type: ''})

    // Parent component + 1 child component
    await waitFor(() =>
      expect(appSubscription!.getListeners().get().length).toBe(2)
    )
  })

  it('unsubscribes when the component is unmounted', async () => {
    let appSubscription: Subscription | null = null

    @Component({
      selector: "child-root",
      standalone: true,
      template: "<div>{{count()}}</div>"
    })
    class Child {
      count = injectNormalSelector((s) => s.count)
    }

    function injectReduxAndAssignApp() {
      const contextVal = inject(ReduxProvider);
      appSubscription = contextVal && contextVal.subscription
      return contextVal;
    }

    @Component({
      selector: "app-root",
      standalone: true,
      imports: [Child],
      template: `
        @if (count() === 0) {
          <child-root/>
        }
      `
    })
    class Parent {
      contextVal = injectReduxAndAssignApp();
      count = injectNormalSelector((s) => s.count)
    }

    await render(Parent, {
      providers: [provideRedux({store: normalStore})]
    })

    // Parent component only
    expect(appSubscription!.getListeners().get().length).toBe(2)

    normalStore.dispatch({type: ''})

    // Parent component + 1 child component
    await waitFor(() =>
      expect(appSubscription!.getListeners().get().length).toBe(1)
    )
  })
});
