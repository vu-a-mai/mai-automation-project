# Todo Application - Robot Framework Automation

This project contains automated tests for a Next.js Todo Application using Robot Framework and Playwright.

## Overview

A simple automation project demonstrating web UI testing with Robot Framework's keyword-driven approach. The project uses Playwright as the browser automation engine behind Robot Framework keywords.

## Project Structure

```
mai-automation-project/
├── src/                          # Next.js Todo App source code
│   ├── app/
│   │   ├── page.tsx             # Login page
│   │   ├── todos/page.tsx       # Todo dashboard
│   │   └── layout.tsx
│   └── ...
│
└── automation/
    └── python/
        └── robotframework/       # Robot Framework tests
            ├── libraries/
            │   └── CustomKeywordsLibrary.py    # Custom Python keywords
            ├── tests/
            │   └── web/
            │       └── todo_tests.robot        # Test cases
            ├── requirements.txt
            └── README.md
```

## Features Tested

- ✅ User login/logout
- ✅ Add todo items
- ✅ Complete todo items
- ✅ Delete todo items
- ✅ Filter todos (All/Active/Completed)
- ✅ Bulk operations

## Test Credentials

- **Email:** test@test.com
- **Password:** password

## Quick Start

### 1. Start the Application

```bash
# From project root
npm install
npm run dev
```

The app will be available at http://localhost:3000

### 2. Run Robot Framework Tests

```bash
# Navigate to robotframework directory
cd automation/python/robotframework

# Create and activate virtual environment
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

## Available Keywords

The `CustomKeywordsLibrary` provides these keywords:

| Keyword | Description |
|---------|-------------|
| `Open Browser` | Launch browser instance |
| `Close Browser` | Close browser and cleanup |
| `Go To Page` | Navigate to URL |
| `Login` | Login with email/password |
| `Add Todo` | Add a new todo item |
| `Complete Todo` | Mark todo as completed |
| `Delete Todo` | Remove a todo item |
| `Filter Todos` | Filter by all/active/completed |
| `Verify Todo Visible` | Check todo exists |
| `Verify Todo Not Visible` | Check todo removed |
| `Count Todos` | Get number of todos |
| `Clear All Todos` | Delete all todos |

## Test Cases

The test suite (`todo_tests.robot`) includes 9 test scenarios:

1. **Login And Add Todo** - Basic login and add functionality
2. **Complete Todo** - Mark todo as completed
3. **Delete Todo** - Remove a todo item
4. **Filter Active Todos** - Show only active items
5. **Filter Completed Todos** - Show only completed items
6. **Add Multiple Todos** - Add several todos
7. **Complete All Todos** - Complete all items
8. **Delete All Todos** - Clear all todos
9. **Switch Between Filters** - Test all filter options

## Viewing Results

After test execution, view results in `results/`:

- `log.html` - Detailed execution log with screenshots
- `report.html` - Test summary and statistics
- `screenshots/` - Step-by-step screenshots

## Running Specific Tests

```bash
# Run specific test
robot --pythonpath . --outputdir results -t "Login And Add Todo" tests/web

# Run with different browser
robot --pythonpath . --outputdir results -v BROWSER:firefox tests/web

# Run in headless mode
robot --pythonpath . --outputdir results -v HEADLESS:True tests/web
```

## Tech Stack

- **Frontend:** Next.js 16 + React + Tailwind CSS
- **Automation:** Robot Framework + Playwright (Python)
- **Browser:** Chromium (default), Firefox, WebKit support
- **Test Reports:** Built-in Robot Framework HTML reports

## Resources

- **Robot Framework:** https://robotframework.org
- **Playwright Python:** https://playwright.dev/python
- **Robot Framework User Guide:** https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html
