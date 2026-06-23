# Testing Guide

This project uses Jest and React Testing Library for testing.

## Setup

First, install the testing dependencies:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

## Running Tests

- `npm test` - Run tests in watch mode (for development)
- `npm run test:ci` - Run tests once (for CI/CD)
- `npm run test:coverage` - Run tests with coverage report

## Writing Tests

Tests should be placed in `__tests__` directories or named with `.test.ts` or `.spec.ts` extensions.

### Example Test

```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## CI/CD

Tests run automatically on:
- Push to `main` or `add-basic-tests` branches
- Pull requests to `main`

The GitHub Actions workflow also runs:
- Linting (`npm run lint`)
- Build verification (`npm run build`)
- Tests on Node.js 18.x and 20.x

## Test Structure

- `src/__tests__/` - General unit tests
- `src/components/__tests__/` - Component tests
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test environment setup
