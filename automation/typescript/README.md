# TypeScript + Playwright Automation

TypeScript automation tests for the Todo application using Playwright with organized screenshot management.

## Features

- **Page Object Model** - Clean separation of UI interactions
- **Multi-browser Support** - Test on Chromium, Firefox, and WebKit
- **Organized Screenshots** - Structured folder hierarchy with timestamps
- **Step-by-Step Capture** - Every action documented with clean filenames
- **HTML Reports** - Visual test reports with embedded screenshots

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install
```

## Running Tests

### Run all tests (all 3 browsers)
```bash
npx playwright test
```

### Run specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run specific test
```bash
npx playwright test -g "Login and add todo"
```

### Run with UI mode (interactive debugging)
```bash
npx playwright test --ui
```

### Run in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run with slow motion (for debugging)
```bash
npx playwright test --headed --slowmo 1000
```

## Test Structure

```
tests/
├── screenshot-manager.ts   # Screenshot organization utility
├── todo-page.ts           # Page Object Model
└── todo.spec.ts          # Test cases (9 scenarios)
```

### Screenshot Manager

The `ScreenshotManager` class provides organized screenshot storage:

```
test-output/
└── 2026-02-14_10-30-00_Run_001/          <- Test run timestamp
    ├── chromium/
    │   ├── 01_Login_and_add_todo/
    │   │   ├── 01_page_loaded.png
    │   │   ├── 02_email_filled.png
    │   │   ├── 03_password_filled.png
    │   │   └── ...
    │   ├── 02_Complete_todo/
    │   └── ...
    ├── firefox/
    │   └── ...
    └── webkit/
        └── ...
```

**Benefits:**
- One folder per test run (easy to archive/share)
- Numbered tests (01_, 02_, 03_...) show execution order
- Clean filenames (no confusing timestamps)
- Browser-separated results (easy comparison)

## Test Coverage

9 comprehensive test scenarios:

1. **Login and add todo** - Basic workflow
2. **Complete todo** - Mark items complete
3. **Delete todo** - Remove items
4. **Filter active todos** - View active only
5. **Filter completed todos** - View completed only
6. **Add multiple todos** - Bulk add
7. **Complete all todos** - Mark all done
8. **Delete all todos** - Clear all
9. **Switch between filters** - Test all views

## Viewing Results

### HTML Report
```bash
npx playwright show-report
```

### Screenshots
Navigate to `test-output/` folder:
```bash
test-output/
└── <timestamp>_Run_XXX/
    └── <browser>/
        └── <numbered_test>/
            └── <numbered_screenshot>.png
```

Example:
```
test-output/2026-02-14_10-30-00_Run_001/chromium/01_Login_and_add_todo/01_page_loaded.png
```

## Configuration

### playwright.config.ts

Key settings:
- **Browsers:** Chromium, Firefox, WebKit
- **Base URL:** http://localhost:3000
- **Screenshots:** Enabled on every step
- **HTML Report:** Enabled
- **Parallel:** Tests run in parallel for speed
- **Timeouts:** 90s global, 20s per action

### Environment Variables

None required - tests use default credentials:
- Email: test@test.com
- Password: password

## Page Object Model

The `TodoPage` class encapsulates all UI interactions:

```typescript
const todoPage = new TodoPage(page, testInfo);
await todoPage.goto();
await todoPage.login();
await todoPage.addTodo('Learn TypeScript');
```

**Methods:**
- `goto()` - Navigate to app
- `login(email?, password?)` - Authenticate
- `addTodo(text)` - Add new todo
- `completeTodo(text)` - Mark as complete
- `deleteTodo(text)` - Remove todo
- `filterBy(status)` - Filter todos
- `todoExists(text)` - Check visibility
- `clearAllTodos()` - Delete all

## Troubleshooting

### Tests fail to start
- Ensure app is running: `npm run dev` in project root
- Check app is accessible at http://localhost:3000

### Screenshots not appearing
- Check `test-output/` folder exists
- Verify write permissions in project directory

### Browser not found
```bash
npx playwright install
```

## Tech Stack

- **Framework:** Playwright Test
- **Language:** TypeScript
- **Pattern:** Page Object Model
- **Browsers:** Chromium, Firefox, WebKit
- **Reports:** HTML with screenshots

## Documentation

- [Main Project README](../../README.md)
- [Architecture Guide](../ARCHITECTURE.md)
- [Repository Files](../../docs/REPOSITORY_FILES.md)
- [Playwright Docs](https://playwright.dev)
