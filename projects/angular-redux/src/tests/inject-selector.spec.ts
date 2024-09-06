import {InjectSelector, injectSelector, provideRedux} from '../public-api'
import {Component} from "@angular/core";
import {render} from "@testing-library/angular";
import {AnyAction, createStore, Store} from "redux";
import '@testing-library/jest-dom';

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

    normalStore.dispatch({ type: '' })


    expect(await findByText("Count: 1")).toBeInTheDocument();
    expect(selector).toHaveBeenCalledTimes(2)
  })
})
