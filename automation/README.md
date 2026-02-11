# Automation Frameworks

This directory contains automation tests using various languages and frameworks.

## Structure

```
automation/
├── python/
│   ├── playwright/       # Python + Playwright (pytest)
│   │   ├── test_*.py
│   │   ├── conftest.py
│   │   └── requirements.txt
│   └── robotframework/   # Python + Playwright + Robot Framework
│       ├── keywords/     # Python keyword libraries
│       │   ├── LoginLibrary/
│       │   │   ├── __init__.py
│       │   │   └── LoginLibrary.py
│       │   └── TodoLibrary/
│       │       ├── __init__.py
│       │       └── TodoLibrary.py
│       ├── resources/    # Robot resource files
│       ├── tests/       # *.robot test files
│       │   └── login.robot
│       ├── run_tests.bat    # Windows batch script to run tests
│       └── requirements.txt
├── javascript/
│   └── playwright/       # JavaScript Playwright tests (future)
├── typescript/
│   └── playwright/       # TypeScript Playwright tests (future)
├── java/
│   └── playwright/       # Java Playwright tests (future)
└── csharp/
    └── playwright/       # C# Playwright tests (future)
```

## Supported Frameworks

### Python + Playwright (pytest)
- **Documentation:** https://playwright.dev/python
- **Pytest Plugin:** https://playwright.dev/python/docs/test-runners

### Python + Playwright + Robot Framework (KEY FEATURE)
Create custom Python keyword libraries using `@library` decorator.

**Example Keyword Library:**
```python
# keywords/LoginLibrary/LoginLibrary.py
from playwright.sync_api import Page
from robot.api.deco import library, keyword


@library(scope="GLOBAL")
class LoginLibrary:
    ROBOT_LIBRARY_SCOPE = "GLOBAL"

    def __init__(self):
        self.page = None

    @keyword
    def navigate_to_login_page(self, url: str = "http://localhost:3000"):
        self.page.goto(url)

    @keyword
    def login(self, email: str, password: str):
        self.page.fill("#email", email)
        self.page.fill("#password", password)
        self.page.click("#login-button")
```

**Usage in Robot Test:**
```robot
*** Settings ***
Library    keywords.LoginLibrary

*** Test Cases ***
Login Test
    Navigate To Login Page
    Login    test@test.com    password
```

**Benefits:**
- Use `@library` and `@keyword` decorators
- Full Python power with Robot's readable syntax
- Built-in HTML reports with screenshots
- Tags for selective test execution
- Reusable across projects

**Resources:**
- **Robot Framework:** https://robotframework.org
- **Robot Framework Browser:** https://marketsquare.github.io/robotframework-playwright/
- **User Guide:** https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html
- **Creating Test Libraries:** https://robotframework.org/robotframework/latest/CreatingTestLibraries.html

## Quick Start

### Python + Playwright (pytest)
```bash
cd automation/python/playwright
pip install -r requirements.txt
pytest test_*.py -v
```

### Python + Robot Framework

#### Prerequisites

1. Create a virtual environment:
```bash
cd automation/python/robotframework
python -m venv venv
```

2. Activate the virtual environment:
```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat

# Linux/macOS
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Install Playwright browsers:
```bash
python -m playwright install chromium
```

#### Running Tests

**Method 1: Using batch script (Windows)**
```powershell
.\run_tests.bat
```

**Method 2: Using PYTHONPATH directly**
```bash
set PYTHONPATH=.
robot --outputdir results tests\login.robot
```

**Method 3: Using robot --pythonpath option**
```bash
robot --pythonpath . --outputdir results tests\login.robot
```

#### Test Commands

**Run all tests:**
```bash
robot --outputdir results tests/
```

**Run specific test file:**
```bash
robot --outputdir results tests/login.robot
```

**Run tests with tags:**
```bash
robot --outputdir results --include smoke tests/
robot --outputdir results --exclude wip tests/
```

**Run in headed mode (see browser):**
```bash
robot --outputdir results --browser headlesschrome tests/
```

**Generate reports:**
```bash
robot --outputdir results tests/
# Results saved to: results/report.html, results/log.html
```

## Contributing

See [docs/CONTRIBUTING.md](../docs/CONTRIBUTING.md) for guidelines on keeping the project clean before committing.
