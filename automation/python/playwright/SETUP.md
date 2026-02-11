# Setup and Run Tests

## Prerequisites
- Python 3.8+ installed
- Node.js 18+ installed

## Step 1: Start the Todo App

Open **Terminal 1** and run:

```bash
cd mai-automation-project
npm install
npm run dev
```

Wait until you see:
```
✓ Ready in XXXms
- Local: http://localhost:3000
```

**Keep this terminal open!**

## Step 2: Verify App is Running

Open browser and go to: http://localhost:3000

You should see the login page.

## Step 3: Run Tests

Open **Terminal 2** (new window) and run:

```bash
cd mai-automation-project/tests-python/playwright

# Install dependencies (one time only)
pip install -r requirements.txt
playwright install chromium

# Run all tests
python -m pytest test_todo_app.py -v

# Run with visible browser
python -m pytest test_todo_app.py -v --headed

# Run specific test
python -m pytest test_todo_app.py::TestLogin::test_login_with_valid_credentials -v --headed
```

## Common Issues

### "Connection Refused" Error
- Make sure the app is running (`npm run dev`)
- Check http://localhost:3000 works in browser
- Try: `python -m pytest test_todo_app.py -v --base-url http://localhost:3000`

### Pytest Not Found
```bash
# Use Python module syntax
python -m pytest test_todo_app.py -v
```

### Playwright Not Found
```bash
pip install pytest-playwright playwright
playwright install chromium
```

## Test Credentials

- **Email:** test@test.com
- **Password:** password

## Available Tests

- `test_login_page_loads` - Verify login page loads
- `test_login_with_valid_credentials` - Test successful login
- `test_login_with_invalid_credentials` - Test error handling
- `test_todos_page_loads` - Verify todos page
- `test_add_new_todo` - Test adding todos
- `test_mark_todo_complete` - Test completing todos
- `test_delete_todo` - Test deleting todos
- `test_edit_todo` - Test editing todos
- `test_filter_todos` - Test filter functionality
- `test_logout` - Test logout

## Generate HTML Report

```bash
python -m pytest test_todo_app.py -v --html=report.html
```

Then open `report.html` in browser.
