# Mai Automation Project

A Todo Application built with Next.js for demonstrating web automation testing with Robot Framework and Playwright.

## Project Overview

This project showcases a simple but complete Todo application with comprehensive automation tests using Robot Framework's keyword-driven approach. It demonstrates best practices for web UI automation with Python and Playwright.

## Application Features

- **Login/Authentication** - Simple email/password login
- **Todo Management** - Add, complete, and delete todo items
- **Filtering** - View All, Active, or Completed todos
- **Bulk Operations** - Clear all todos at once

## Test Credentials

- **Email:** test@test.com
- **Password:** password

## Quick Start

### 1. Start the Application

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000

### 2. Run Automation Tests

Navigate to the Robot Framework directory:

```bash
cd automation/python/robotframework

# Setup virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
python -m playwright install chromium

# Run all tests
robot --pythonpath . --outputdir results tests/web
```

## Project Structure

```
mai-automation-project/
├── src/                          # Next.js Application
│   ├── app/
│   │   ├── page.tsx             # Login page
│   │   ├── todos/
│   │   │   └── page.tsx         # Todo dashboard
│   │   └── layout.tsx
│   └── ...
│
└── automation/
    └── python/
        └── robotframework/       # Robot Framework Tests
            ├── libraries/
            │   └── CustomKeywordsLibrary.py    # Python keyword library
            ├── tests/
            │   └── web/
            │       └── todo_tests.robot        # Test cases
            ├── requirements.txt
            └── README.md
```

## Robot Framework Tests

### Custom Keywords Library

The `CustomKeywordsLibrary.py` provides business-level keywords:

- `Open Browser` / `Close Browser`
- `Go To Page` - Navigate to URL
- `Login` - Authenticate user
- `Add Todo` - Create new todo
- `Complete Todo` - Mark as done
- `Delete Todo` - Remove todo
- `Filter Todos` - Filter by status
- `Verify Todo Visible` - Check existence
- `Count Todos` - Get todo count
- `Clear All Todos` - Bulk delete

### Test Coverage

9 comprehensive test scenarios:

1. **Login And Add Todo** - Basic workflow
2. **Complete Todo** - Mark items complete
3. **Delete Todo** - Remove items
4. **Filter Active Todos** - View active only
5. **Filter Completed Todos** - View completed only
6. **Add Multiple Todos** - Bulk add
7. **Complete All Todos** - Mark all done
8. **Delete All Todos** - Clear all
9. **Switch Between Filters** - Test all views

### Viewing Test Results

After execution, check `automation/python/robotframework/results/`:

- `report.html` - Test summary with statistics
- `log.html` - Detailed execution log with screenshots
- `screenshots/` - Step-by-step visual documentation

## Running Tests

### Run All Tests
```bash
robot --pythonpath . --outputdir results tests/web
```

### Run Specific Test
```bash
robot --pythonpath . --outputdir results -t "Login And Add Todo" tests/web
```

### Run with Different Browser
```bash
robot --pythonpath . --outputdir results -v BROWSER:firefox tests/web
```

### Run in Headless Mode
```bash
robot --pythonpath . --outputdir results -v HEADLESS:True tests/web
```

## Tech Stack

### Application
- **Framework:** Next.js 16
- **UI:** React + Tailwind CSS
- **Icons:** Lucide React

### Automation
- **Test Framework:** Robot Framework
- **Browser Engine:** Playwright (Python)
- **Browser:** Chromium (default), Firefox, WebKit
- **Reports:** Robot Framework HTML reports

## Documentation

- [Robot Framework Tests README](automation/python/robotframework/README.md)
- [Robot Framework Docs](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html)
- [Playwright Python](https://playwright.dev/python)

## Why Robot Framework?

1. **Readable Tests** - Keywords read like English
2. **Built-in Reporting** - HTML reports with screenshots
3. **Python Integration** - Custom keywords in Python
4. **Cross-browser** - Test on Chromium, Firefox, WebKit
5. **Maintainable** - Easy to update and extend

## License

[Your License]
