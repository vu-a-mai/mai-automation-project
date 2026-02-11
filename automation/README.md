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
│       │   ├── LoginLibrary.py
│       │   └── TodoLibrary.py
│       ├── resources/    # Robot resource files
│       ├── tests/        # *.robot test files
│       │   └── login.robot
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
# keywords/LoginLibrary.py
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
```bash
cd automation/python/robotframework
pip install -r requirements.txt
robot --outputdir results tests/
```

## Contributing

See [docs/CONTRIBUTING.md](../docs/CONTRIBUTING.md) for guidelines on keeping the project clean before committing.
