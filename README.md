# Mai Automation Project

A Todo Application built with Next.js for demonstrating web automation testing with multiple frameworks: **Robot Framework (Python)** and **TypeScript + Playwright**.

## Project Overview

This project showcases a simple but complete Todo application with comprehensive automation tests using two different approaches:

1. **Robot Framework (Python)** - Keyword-driven testing with Playwright
2. **TypeScript + Playwright** - Modern JavaScript/TypeScript testing with Page Object Model

Both frameworks demonstrate best practices for web UI automation with organized screenshot structures and cross-browser testing.

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

### 2. Choose Your Automation Framework

#### Option A: TypeScript + Playwright (Recommended for JS/TS developers)

```bash
cd automation/typescript

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests (all 3 browsers)
npx playwright test

# Or run specific browser
npx playwright test --project=chromium
```

**View Results:**
```bash
# Open HTML report
npx playwright show-report

# Or check screenshots in:
# test-output/<timestamp>/<browser>/<test>/
```

#### Option B: Robot Framework (Python) - Keyword-driven approach

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
robot --pythonpath . tests/web

# Or use the convenience script
./run_tests.sh        # Linux/Mac
run_tests.bat         # Windows
```

**View Results:**
- Check `test-output/<timestamp>/<browser>/<test>/` for organized screenshots
- Open `log.html` and `report.html` for Robot Framework reports

### Testing Against Different Environments

Both frameworks support testing against production (default) or localhost:

**TypeScript:**
```bash
# Run against production (default)
npx playwright test

# Run against localhost
BASE_URL=http://localhost:3000 npx playwright test
```

**Python:**
```bash
# Run against production (default)
robot --pythonpath . tests/web

# Run against localhost
robot --pythonpath . -v URL:http://localhost:3000 tests/web
```

**Note:** By default, tests run against the deployed production app at https://mai-automation-project.vercel.app. Use the commands above to test locally.

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
    ├── ARCHITECTURE.md           # Architecture documentation
    │
    ├── typescript/               # TypeScript + Playwright
    │   ├── tests/
    │   │   ├── todo-page.ts     # Page Object Model
    │   │   ├── todo.spec.ts     # Test cases
    │   │   └── screenshot-manager.ts  # Screenshot organization
    │   ├── playwright.config.ts
    │   ├── package.json
    │   └── README.md
    │
    └── python/
        └── robotframework/       # Robot Framework
            ├── libraries/
            │   └── CustomKeywordsLibrary.py
            ├── tests/
            │   └── web/
            │       └── todo_tests.robot
            ├── requirements.txt
            ├── run_tests.sh      # Unix/Mac runner
            ├── run_tests.bat     # Windows runner
            └── README.md
```

## Screenshot Organization

Both frameworks now use the same organized folder structure:

```
test-output/
└── 2026-02-14_10-30-00_Run_001/          <- Test run timestamp
    ├── chromium/
    │   ├── 01_Login_And_Add_Todo/
    │   │   ├── 01_page_loaded.png
    │   │   ├── 02_email_filled.png
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
- Numbered tests (see execution order)
- Clean filenames (no confusing timestamps)
- Multi-browser support (compare results)

See [ARCHITECTURE.md](automation/ARCHITECTURE.md) for detailed documentation.

## Test Coverage

Both frameworks cover the same 9 comprehensive test scenarios:

1. **Login And Add Todo** - Basic workflow
2. **Complete Todo** - Mark items complete
3. **Delete Todo** - Remove items
4. **Filter Active Todos** - View active only
5. **Filter Completed Todos** - View completed only
6. **Add Multiple Todos** - Bulk add
7. **Complete All Todos** - Mark all done
8. **Delete All Todos** - Clear all
9. **Switch Between Filters** - Test all views

## Cross-Browser Testing

Both frameworks support testing on:
- ✅ **Chromium** (Chrome/Edge)
- ✅ **Firefox**
- ✅ **WebKit** (Safari)

## Tech Stack

### Application
- **Framework:** Next.js 16
- **UI:** React + Tailwind CSS
- **Icons:** Lucide React

### Automation Options

**TypeScript + Playwright:**
- Modern JavaScript/TypeScript
- Page Object Model pattern
- Built-in parallel execution
- HTML reports with traces

**Robot Framework (Python):**
- Keyword-driven testing
- Readable test syntax
- Built-in reporting
- Python extensibility

## Documentation

- **[Architecture Guide](automation/ARCHITECTURE.md)** - Folder structure and organization
- **[Repository Files](docs/REPOSITORY_FILES.md)** - What files are tracked vs ignored
- **[TypeScript README](automation/typescript/README.md)** - TypeScript automation details
- **[Python README](automation/python/robotframework/README.md)** - Robot Framework details

## Why Two Frameworks?

This project demonstrates automation testing using two different paradigms:

1. **TypeScript + Playwright** - For teams preferring JavaScript/TypeScript with modern testing patterns
2. **Robot Framework** - For teams preferring keyword-driven testing with Python

Both achieve the same goal: comprehensive, maintainable web automation testing!

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Mai Automation Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
