import { Component } from '@angular/core'
import { render } from '@testing-library/angular'
import '@testing-library/jest-dom'

@Component({
  selector: "app-root",
  standalone: true,
  template: "<p>Testing</p>"
})
class TestSpec {}

it('Should render a component', async () => {
  const {getByText} = await render(TestSpec)
  expect(getByText("Testing")).toBeInTheDocument();
})
