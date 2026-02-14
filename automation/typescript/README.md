# TypeScript + Playwright Automation

TypeScript automation tests for the Todo application using Playwright.

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test
```bash
npx playwright test -g "Login and add todo"
```

### Run with UI mode (headed)
```bash
npx playwright test --ui
```

### Run in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run specific browser
```bash
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Structure

```
tests/
├── todo-page.ts      # Page Object Model
└── todo.spec.ts      # Test cases
```

## Test Coverage

Same scenarios as Robot Framework:
1. Login and add todo
2. Complete todo
3. Delete todo
4. Filter active todos
5. Filter completed todos
6. Add multiple todos
7. Complete all todos
8. Delete all todos
9. Switch between filters

## Viewing Results

After running tests:
```bash
npx playwright show-report results
```

Or open `results/index.html` in browser.

## Configuration

- `playwright.config.ts` - Test configuration
- Browsers: Chromium, Firefox, WebKit
- Base URL: http://localhost:3000
- Screenshots: Enabled
- HTML Report: Enabled
