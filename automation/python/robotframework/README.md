# Robot Framework Automation

Python-based keyword-driven automation tests for the Todo application using Robot Framework and Playwright.

## Features

- **Keyword-Driven Testing** - Readable test syntax using keywords
- **Custom Python Keywords** - Extensible keyword library
- **Multi-browser Support** - Test on Chromium, Firefox, and WebKit
- **Organized Screenshots** - Structured folder hierarchy matching TypeScript
- **Built-in Reporting** - HTML reports with embedded screenshots

## Quick Start

### 1. Start the Application

From project root:
```bash
npm install
npm run dev
```

App runs at http://localhost:3000

### 2. Setup Python Environment

```bash
cd automation/python/robotframework

# Create virtual environment
python -m venv venv

# Activate (choose one)
venv\Scripts\activate     # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
python -m playwright install chromium
```

### 3. Run Tests

#### Using convenience scripts (recommended):
```bash
./run_tests.sh     # Linux/Mac
run_tests.bat      # Windows
```

#### Or run manually:
```bash
# Run all tests
robot --pythonpath . tests/web

# Run specific test
robot --pythonpath . -t "Login And Add Todo" tests/web

# Run with different browser
robot --pythonpath . -v BROWSER:firefox tests/web

# Run in headless mode
robot --pythonpath . -v HEADLESS:True tests/web
```

## Screenshot Organization

Screenshots are saved to `test-output/` with the same structure as TypeScript:

```
test-output/
└── 2026-02-14_10-30-00_Run_001/          <- Test run timestamp
    ├── chromium/
    │   ├── 01_Login_And_Add_Todo/
    │   │   ├── 01_page_loaded.png
    │   │   ├── 02_email_filled.png
    │   │   ├── 03_password_filled.png
    │   │   └── ...
    │   ├── 02_Complete_Todo/
    │   └── ...
    ├── firefox/
    │   └── ...
    └── webkit/
        └── ...
```

**Benefits:**
- One folder per test run (easy to archive)
- Numbered tests (01_, 02_, 03_...) show execution order
- Clean filenames (no confusing timestamps)
- Browser-separated folders (easy comparison)

## Project Structure

```
robotframework/
├── libraries/
│   └── CustomKeywordsLibrary.py    # Custom Python keywords
├── tests/
│   └── web/
│       └── todo_tests.robot        # Test cases
├── requirements.txt
├── run_tests.sh                     # Unix/Mac runner
├── run_tests.bat                    # Windows runner
└── README.md
```

## Custom Keywords

The `CustomKeywordsLibrary.py` provides these keywords:

| Keyword | Description | Example |
|---------|-------------|---------|
| `Open Browser` | Launch browser | `Open Browser` |
| `Close Browser` | Close and cleanup | `Close Browser` |
| `Go To Page` | Navigate to URL | `Go To Page  ${URL}` |
| `Login` | Authenticate user | `Login  ${EMAIL}  ${PASSWORD}` |
| `Add Todo` | Create new todo | `Add Todo  Buy milk` |
| `Complete Todo` | Mark as done | `Complete Todo  Buy milk` |
| `Delete Todo` | Remove todo | `Delete Todo  Buy milk` |
| `Filter Todos` | Filter view | `Filter Todos  active` |
| `Verify Todo Visible` | Check exists | `Verify Todo Visible  Buy milk` |
| `Verify Todo Not Visible` | Check removed | `Verify Todo Not Visible  Buy milk` |
| `Count Todos` | Get count | `${count}=  Count Todos` |
| `Clear All Todos` | Bulk delete | `Clear All Todos` |

## Test Cases

The test suite (`todo_tests.robot`) includes 9 scenarios:

1. **Login And Add Todo** - Basic login and add workflow
2. **Complete Todo** - Mark todo as completed
3. **Delete Todo** - Remove a todo item
4. **Filter Active Todos** - Show only active items
5. **Filter Completed Todos** - Show only completed items
6. **Add Multiple Todos** - Add several todos
7. **Complete All Todos** - Complete all items
8. **Delete All Todos** - Clear all todos
9. **Switch Between Filters** - Test all filter options

## Test Credentials

- **Email:** test@test.com
- **Password:** password

## Viewing Results

### HTML Reports
After test execution, view in project root:
- `log.html` - Detailed execution log with screenshots
- `report.html` - Test summary and statistics

### Screenshots
Navigate to `test-output/` folder for organized screenshots:
```
test-output/
└── <timestamp>_Run_XXX/
    └── <browser>/
        └── <numbered_test>/
            └── <numbered_screenshot>.png
```

Example:
```
test-output/2026-02-14_10-30-00_Run_001/chromium/01_Login_And_Add_Todo/01_page_loaded.png
```

## Cross-Browser Testing

Test on different browsers:

```bash
# Chromium (default)
robot --pythonpath . tests/web

# Firefox
robot --pythonpath . -v BROWSER:firefox tests/web

# WebKit (Safari)
robot --pythonpath . -v BROWSER:webkit tests/web
```

## Headless Mode

Run without visible browser (faster):

```bash
robot --pythonpath . -v HEADLESS:True tests/web
```

## Troubleshooting

### Module not found errors
Ensure PYTHONPATH is set:
```bash
export PYTHONPATH=.  # Linux/Mac
set PYTHONPATH=.     # Windows
```

### Browser not found
```bash
python -m playwright install
```

### Tests fail to connect
Ensure the Todo app is running:
```bash
npm run dev  # in project root
```

## Tech Stack

- **Framework:** Robot Framework
- **Language:** Python
- **Browser Engine:** Playwright
- **Browsers:** Chromium (default), Firefox, WebKit
- **Reports:** Robot Framework HTML reports

## Why Robot Framework?

1. **Readable Tests** - Keywords read like English
2. **Built-in Reporting** - HTML reports with screenshots
3. **Python Integration** - Custom keywords in Python
4. **Cross-browser** - Test on Chromium, Firefox, WebKit
5. **Maintainable** - Easy to update and extend

## Documentation

- [Main Project README](../../../README.md)
- [TypeScript Automation](../../typescript/README.md)
- [Architecture Guide](../../ARCHITECTURE.md)
- [Repository Files](../../../docs/REPOSITORY_FILES.md)
- [Robot Framework Docs](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html)
- [Playwright Python](https://playwright.dev/python)
