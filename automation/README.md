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
│       ├── keywords/     # Python keyword libraries (KEY FEATURE)
│       │   ├── __init__.py
│       │   ├── login_keywords.py
│       │   └── todo_keywords.py
│       ├── resources/    # Robot resource files
│       ├── tests/        # *.robot test files
│       │   ├── login.robot
│       │   └── todo.robot
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
This is a hybrid approach: create custom Python keyword libraries and use them in Robot Framework test suites.

**How It Works:**
1. Create Python classes with Playwright methods in `keywords/` directory
2. Export classes in `__init__.py`
3. Import and use keywords in `*.robot` test files

**Example Python Keyword:**
```python
# keywords/login_keywords.py
from playwright.sync_api import Page

class LoginKeywords:
    def __init__(self, page: Page):
        self.page = page

    def login(self, email: str, password: str):
        self.page.fill("#email", email)
        self.page.fill("#password", password)
        self.page.click("#login-button")
```

**Example Robot Test:**
```robot
*** Settings ***
Library    keywords.LoginKeywords

*** Test Cases ***
Login Test
    Login    test@test.com    password
```

**Benefits:**
- Write Python keywords once, use in pytest AND Robot Framework
- Human-readable test cases with Robot syntax
- Built-in HTML reports with screenshots
- Tags for selective test execution
- Full Python power for complex logic

**Resources:**
- **Robot Framework:** https://robotframework.org
- **Robot Framework Browser:** https://marketsquare.github.io/robotframework-playwright/
- **User Guide:** https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html

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
