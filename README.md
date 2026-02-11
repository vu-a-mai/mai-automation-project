# Mai Automation Project

A simple Todo App built for automation testing with multiple frameworks and languages.

## Quick Start

### 1. Start the App
```bash
npm install
npm run dev
```

Open http://localhost:3000

### 2. Login
- **Email:** test@test.com
- **Password:** password

### 3. Run Tests

#### Python + Playwright (pytest)
```bash
cd automation/python/playwright
pip install -r requirements.txt
pytest test_todo_app.py -v
```

#### Python + Robot Framework (with Playwright)
```bash
cd automation/python/robotframework
pip install -r requirements.txt
robot --outputdir results tests/
```

#### JavaScript + Playwright
```bash
cd automation/javascript/playwright
npm install
npx playwright install
npx playwright test
```

#### TypeScript + Playwright
```bash
cd automation/typescript/playwright
npm install
npx playwright install
npx playwright test
```

#### Java + Playwright
```bash
cd automation/java/playwright
mvn install
mvn playwright:install
mvn test
```

#### C# + Playwright
```bash
cd automation/csharp/playwright
dotnet restore
dotnet playwright install
dotnet test
```

## Features to Test

- ✅ Login/Logout
- ✅ Add todos
- ✅ Complete todos
- ✅ Edit todos
- ✅ Delete todos
- ✅ Filter todos (All/Active/Completed)

## Test Credentials

- **Email:** test@test.com
- **Password:** password

## Project Structure

```
mai-automation-project/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Login page
│   │   ├── todos/page.tsx    # Todo dashboard
│   │   └── layout.tsx        # Root layout
│   └── globals.css           # Styles
├── automation/               # Multi-language automation frameworks
│   ├── python/
│   │   ├── playwright/       # ✅ Python + Playwright (pytest)
│   │   │   ├── test_*.py     # Test files
│   │   │   ├── conftest.py   # Pytest config
│   │   │   └── requirements.txt
│   │   └── robotframework/   # ✅ Python + Playwright + Robot Framework
│   │       ├── keywords/     # Python keyword libraries
│   │       │   ├── LoginLibrary/
│   │       │   │   ├── __init__.py
│   │       │   │   └── LoginLibrary.py
│   │       │   └── TodoLibrary/
│   │       │       ├── __init__.py
│   │       │       └── TodoLibrary.py
│   │       ├── resources/    # Robot resource files
│   │       ├── tests/        # *.robot test files
│   │       │   └── login.robot
│   │       └── requirements.txt
│   ├── javascript/           # JavaScript tests (future)
│   ├── typescript/           # TypeScript tests (future)
│   ├── java/                 # Java tests (future)
│   └── csharp/               # C# tests (future)
├── docs/
│   └── CONTRIBUTING.md
└── README.md
```

## Tech Stack

- **Frontend:** Next.js + React + Tailwind CSS
- **Automation:**
  - Python + Playwright (pytest)
  - Python + Playwright + Robot Framework (keyword-driven)
  - JavaScript/TypeScript + Playwright
  - Java + Playwright
  - C# + Playwright
- **Icons:** Lucide React

## Running Tests

### Python + Playwright (pytest)

#### Headless (Fast)
```bash
cd automation/python/playwright
pytest test_todo_app.py -v
```

#### Headed (See browser)
```bash
cd automation/python/playwright
pytest test_todo_app.py -v --headed
```

#### Generate Report
```bash
cd automation/python/playwright
pytest test_todo_app.py -v --html=report.html
```

### Python + Robot Framework + Playwright

Robot Framework uses Python keyword libraries with Playwright for keyword-driven testing.

#### Run All Tests
```bash
cd automation/python/robotframework
pip install -r requirements.txt
robot --outputdir results tests/
```

#### Run Specific Test File
```bash
cd automation/python/robotframework
robot --outputdir results tests/login.robot
```

#### Run Tests with Tags
```bash
cd automation/python/robotframework
robot --outputdir results --include smoke tests/
robot --outputdir results --exclude wip tests/
```

#### Generate Different Report Formats
```bash
cd automation/python/robotframework
robot --outputdir results --logtitle "Test Log" tests/
# Opens: results/log.html
# Opens: results/report.html
# Opens: results/output.xml
```

#### Run in Headed Mode (See browser)
```bash
cd automation/python/robotframework
robot --outputdir results --browser headlesschrome tests/
```

### JavaScript + Playwright

#### Headless (Fast)
```bash
cd automation/javascript/playwright
npx playwright test
```

#### Headed (See browser)
```bash
cd automation/javascript/playwright
npx playwright test --project=headed
```

#### Generate HTML Report
```bash
cd automation/javascript/playwright
npx playwright test --reporter=html
```

### TypeScript + Playwright

Same as JavaScript since Playwright uses TypeScript natively.

### Java + Playwright

#### Run Tests
```bash
cd automation/java/playwright
mvn test
```

#### Generate Report
```bash
cd automation/java/playwright
mvn allure:serve
```

### C# + Playwright

#### Run Tests
```bash
cd automation/csharp/playwright
dotnet test
```

#### Generate HTML Report
```bash
cd automation/csharp/playwright
dotnet test --logger "html;log_filename=test-results.html"
```

## Python + Robot Framework: Custom Keyword Libraries

This is the core feature: create custom Python keyword libraries using `@library` decorator and use them in Robot Framework test suites.

### Directory Structure

```
automation/python/robotframework/
├── keywords/                  # Python keyword libraries
│   ├── LoginLibrary/         # Login library (folder name = library name)
│   │   ├── __init__.py
│   │   └── LoginLibrary.py   # Class name = file name
│   └── TodoLibrary/
│       ├── __init__.py
│       └── TodoLibrary.py
├── resources/                 # Robot resource files (optional)
├── tests/                    # *.robot test files
│   └── login.robot
└── requirements.txt
```

### Creating a Keyword Library

Create a folder with the library name, then add `__init__.py` and `LibraryName.py`:

```python
# keywords/LoginLibrary/__init__.py
from .LoginLibrary import LoginLibrary
```

```python
# keywords/LoginLibrary/LoginLibrary.py
from playwright.sync_api import Page
from robot.api.deco import library, keyword, not_keyword
import logging

logger = logging.getLogger(__name__)
__version__ = "0.1"
__author__ = "Vu Mai"


@library(scope="GLOBAL", auto_keywords=True)
class LoginLibrary:
    ROBOT_LIBRARY_SCOPE = "GLOBAL"
    ROBOT_LIBRARY_VERSION = __version__

    def __init__(self):
        self._page = None

    @property
    def page(self):
        return self._page

    @page.setter
    def page(self, value):
        self._page = value

    @keyword("Navigate To Login Page")
    def navigate_to_login_page(self, url: str = "http://localhost:3000"):
        logger.debug(f"Navigating to {url}")
        self._page.goto(url)

    @keyword("Login")
    def login(self, email: str = "test@test.com", password: str = "password"):
        self._page.fill("#email", email)
        self._page.fill("#password", password)
        self._page.click("#login-button")
```

### Using Keywords in Robot Tests

Import and use Python keywords in *.robot files:

```robot
*** Settings ***
Library    Browser    strict=False
Library    keywords.LoginLibrary
Library    keywords.TodoLibrary

*** Test Cases ***
Login With Valid Credentials Should Succeed
    [Documentation]    Test login with valid credentials
    [Tags]    smoke    login
    Navigate To Login Page    http://localhost:3000
    Login With Default Credentials

Add New Todo Should Be Successful
    [Documentation]    Login and add a new todo
    [Tags]    smoke    todo
    Navigate To Login Page
    Login With Default Credentials
    Add Todo    Learn Robot Framework
    Verify Todo Exists    Learn Robot Framework

*** Keywords ***
Login With Default Credentials
    Login    test@test.com    password
```

### Key Decorators

| Decorator | Purpose |
|-----------|---------|
| `@library(scope="GLOBAL", auto_keywords=True)` | Mark class as Robot Framework library |
| `@keyword("Custom Name")` | Expose method as Robot keyword with custom name |
| `@not_keyword` | Exclude method from being a keyword |

### Robot Framework Pattern

1. **Folder name** = Library name (e.g., `LoginLibrary`)
2. **Python file** = Same name as folder (e.g., `LoginLibrary.py`)
3. **Class name** = Same as file (e.g., `class LoginLibrary`)
4. **__init__.py** imports the class

### Benefits of Python + Robot Framework

1. **Reusable Keywords:** Write Python classes with methods that become keywords
2. **Hybrid Approach:** Combine Python logic with Robot's readable syntax
3. **Built-in Reports:** HTML reports with screenshots, logs, and statistics
4. **Tags:** Categorize tests for selective execution (`--include smoke`)
5. **Page Object Pattern:** Organize keywords by page/feature (LoginLibrary, TodoLibrary)
6. **Shared Code:** Use same Python code across pytest and Robot Framework
7. **Custom Logic:** Full Python power for complex operations

### Robot Framework Reports

After running tests, you'll get:

```
results/
├── log.html        # Detailed test log with screenshots
├── report.html     # Summary report with statistics
└── output.xml      # XML output for further processing
```

Open `report.html` in a browser to see:
- Test execution summary
- Pass/fail statistics
- Screenshots on failure
- Detailed logs for each test

### Resources

- **Robot Framework:** https://robotframework.org
- **Robot Framework Browser:** https://marketsquare.github.io/robotframework-playwright/
- **Robot Framework User Guide:** https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html
- **Creating Test Libraries:** https://robotframework.org/robotframework/latest/CreatingTestLibraries.html
- **Playwright Python:** https://playwright.dev/python

## Playwright Documentation

- **Official Site:** https://playwright.dev
- **Python:** https://playwright.dev/python
- **JavaScript/TypeScript:** https://playwright.dev/docs/intro
- **Java:** https://playwright.dev/java/docs/intro
- **C#:** https://playwright.dev/dotnet/docs/intro

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on keeping the project clean before committing.
