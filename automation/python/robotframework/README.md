# Todo App - Robot Framework Automation

Simple automation tests for the Todo application using Robot Framework and Playwright.

## Project Structure

```
robotframework/
├── libraries/
│   └── CustomKeywordsLibrary.py   # Custom keywords for the app
├── tests/
│   └── web/
│       └── todo_tests.robot       # Test cases
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
python -m playwright install
```

2. Start the Todo app:
```bash
npm run dev
```

## Running Tests

Run all tests:
```bash
robot --pythonpath . --outputdir results tests/web
```

Run specific test:
```bash
robot --pythonpath . --outputdir results -t "Login And Add Todo" tests/web
```

Run with different browser:
```bash
robot --pythonpath . --outputdir results -v BROWSER:firefox tests/web
```

Run in headless mode:
```bash
robot --pythonpath . --outputdir results -v HEADLESS:True tests/web
```

## Available Keywords

- `Open Browser` - Open browser
- `Close Browser` - Close browser  
- `Go To Page` - Navigate to URL
- `Login` - Login with email/password
- `Add Todo` - Add a todo item
- `Complete Todo` - Complete a todo
- `Delete Todo` - Delete a todo
- `Filter Todos` - Filter by all/active/completed
- `Verify Todo Visible` - Check todo exists
- `Verify Todo Not Visible` - Check todo removed
- `Count Todos` - Get todo count
- `Clear All Todos` - Delete all todos

## Test Cases

1. **Login And Add Todo** - Basic login and add
2. **Complete Todo** - Mark todo as complete
3. **Delete Todo** - Remove a todo
4. **Filter Active Todos** - Show only active
5. **Filter Completed Todos** - Show only completed
6. **Add Multiple Todos** - Add several todos
7. **Complete All Todos** - Complete all items
8. **Delete All Todos** - Clear all todos
9. **Switch Between Filters** - Test all filters

## View Results

After running tests:
- `results/log.html` - Detailed log with screenshots
- `results/report.html` - Test summary
- `results/screenshots/` - Step-by-step screenshots
