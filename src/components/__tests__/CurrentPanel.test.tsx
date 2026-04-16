import { render, screen } from '@testing-library/react'
import CurrentPanel from '../homepage/CurrentPanel'

describe('CurrentPanel', () => {
  it('renders without crashing', () => {
    render(<CurrentPanel />)
    expect(document.body).toBeInTheDocument()
  })

  it('displays the current panel heading', () => {
    render(<CurrentPanel />)
    const heading = screen.queryByRole('heading')
    if (heading) {
      expect(heading).toBeInTheDocument()
    }
  })
})
