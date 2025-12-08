# Testing

This project uses **Jest** and **React Testing Library** for unit and integration testing.

## Running Tests

- Run all tests:
  ```bash
  npm test
  ```

- Run tests in watch mode:
  ```bash
  npm run test:watch
  ```

- Run tests with coverage report:
  ```bash
  npm run test:coverage
  ```

## Coverage Report

After running `npm run test:coverage`, you can view the detailed HTML report by opening:
`coverage/lcov-report/index.html` in your browser.

## Configuration

- **Jest Config**: `jest.config.ts` at the project root.
- **Setup**: `src/test/setupTests.ts` handles global mocks (like `fetch`, `ResizeObserver`).
- **Mocks**: `src/test/__mocks__` contains file mocks.
