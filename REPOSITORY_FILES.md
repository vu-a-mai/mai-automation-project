# Repository Files Overview

This document lists which files are tracked in the repository and which are ignored.

## ✅ Files That ARE Tracked (Included in Repository)

### Root Project Files
- `.gitignore` - Git ignore rules
- `README.md` - Main project documentation
- `package.json` - Node.js dependencies
- `package-lock.json` - Locked dependency versions
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `components.json` - UI components configuration

### Source Code
- `src/` - Next.js application source code
  - `app/` - Next.js app router pages
  - `components/` - React components
  - `lib/` - Utility libraries

### Automation - TypeScript (Playwright)
- `automation/typescript/`
  - `README.md` - TypeScript automation documentation
  - `package.json` - Dependencies list
  - `tsconfig.json` - TypeScript configuration
  - `playwright.config.ts` - Playwright test configuration
  - `global-teardown.ts` - Test cleanup script
  - `tests/`
    - `todo-page.ts` - Page Object Model
    - `todo.spec.ts` - Test specifications
    - `screenshot-manager.ts` - Screenshot organization

### Automation - Python (Robot Framework)
- `automation/python/robotframework/`
  - `README.md` - Python automation documentation
  - `requirements.txt` - Python dependencies
  - `run_tests.sh` - Test runner script (Unix/Mac)
  - `run_tests.bat` - Test runner script (Windows)
  - `tests/web/`
    - `todo_tests.robot` - Robot Framework test cases
  - `libraries/`
    - `CustomKeywordsLibrary.py` - Custom Python keywords

### Documentation
- `automation/ARCHITECTURE.md` - Architecture documentation

---

## ❌ Files That Are IGNORED (Not in Repository)

### Dependencies (Users Install These)
- `node_modules/` - Node.js packages (install with `npm install`)
- `automation/typescript/node_modules/` - TypeScript test dependencies
- `venv/` - Python virtual environment (create with `python -m venv venv`)
- `__pycache__/` - Python cache files
- `*.pyc`, `*.pyo` - Compiled Python files

### Test Results & Outputs
- `test-output/` - Test screenshots and results (generated during test runs)
- `test-results/` - Playwright test artifacts
- `results/` - Robot Framework results
- `screenshots/` - Screenshot folders
- `playwright-report/` - Playwright HTML reports
- `output.xml` - Robot Framework output
- `log.html` - Robot Framework logs
- `report.html` - Robot Framework reports

### Build & Cache Files
- `.next/` - Next.js build output
- `/build` - Production build
- `/out/` - Static export
- `/.cache/` - Cache files
- `*.tsbuildinfo` - TypeScript build info

### IDE & System Files
- `.vscode/` - VS Code settings
- `.idea/` - IntelliJ IDEA settings
- `.DS_Store` - macOS system files
- `Thumbs.db` - Windows thumbnail cache
- `*.swp`, `*.swo` - Vim swap files

### Logs & Temporary Files
- `*.log` - Log files
- `npm-debug.log*` - NPM debug logs
- `.env*` - Environment files (may contain secrets)
- `*.tmp`, `*.temp` - Temporary files

---

## 📦 Installation Instructions

When users clone this repository, they need to install dependencies:

### 1. Main Application
```bash
cd mai-automation-project
npm install
```

### 2. TypeScript Automation
```bash
cd automation/typescript
npm install
npx playwright install
```

### 3. Python Automation
```bash
cd automation/python/robotframework
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

---

## 🎯 Why These Files Are Ignored

1. **Dependencies** - Users should install fresh copies to avoid conflicts
2. **Test Results** - Generated fresh each test run, not needed in repo
3. **Build Files** - Generated from source, not needed in repo
4. **Cache** - Temporary files, not needed for the project
5. **IDE Settings** - Personal preferences, vary by developer
6. **Environment Files** - May contain secrets, should never be committed

This keeps the repository **clean, small, and focused** on source code only!
