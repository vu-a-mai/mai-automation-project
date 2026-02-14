# Automation Test Architecture

This document explains the folder structure and organization of test outputs for both TypeScript and Python automation frameworks.

## Folder Structure

Both TypeScript (Playwright) and Python (Robot Framework) automation use the same organized folder structure:

```
test-output/
├── 2026-02-14_10-30-00_Run_001/          <- One folder per test run
│   ├── chromium/                          <- Browser folder
│   │   ├── 01_Login_And_Add_Todo/        <- Numbered test folder
│   │   │   ├── 01_page_loaded.png
│   │   │   ├── 02_email_filled.png
│   │   │   ├── 03_password_filled.png
│   │   │   ├── 04_logged_in.png
│   │   │   ├── 05_todo_typed_...
│   │   │   ├── 06_todo_added_...
│   │   │   └── 07_todo_visible_...
│   │   ├── 02_Complete_Todo/
│   │   ├── 03_Delete_Todo/
│   │   └── ... (9 tests total)
│   ├── firefox/                          <- Firefox browser results
│   │   └── ... (same structure)
│   └── webkit/                           <- Safari/WebKit results
│       └── ... (same structure)
└── 2026-02-14_10-45-30_Run_002/          <- Next test run
    └── ...
```

## Naming Conventions

### Test Run Folders
- **Format**: `YYYY-MM-DD_HH-MM-SS_Run_XXX`
- **Example**: `2026-02-14_10-30-00_Run_001`
- **Purpose**: Groups all tests from a single execution together

### Test Folders
- **Format**: `XX_Test_Name`
- **Example**: `01_Login_And_Add_Todo`
- **Purpose**: Tests are numbered by execution order for easy reference

### Screenshot Files
- **Format**: `XX_action_name.png`
- **Example**: `01_page_loaded.png`, `02_email_filled.png`
- **Purpose**: Step-by-step screenshots with clean, readable names (no timestamps)

## Benefits

1. **Organized by Test Run**: Each execution gets its own timestamped folder
2. **Numbered Tests**: Easy to see which test ran first, second, etc.
3. **Clean Filenames**: No confusing timestamps in screenshot names
4. **Browser Separation**: Each browser has its own folder for easy comparison
5. **Step-by-Step**: Every action is captured for debugging

## Viewing Results

### For Non-Technical Users
Simply open the folder `test-output/2026-02-14_..._Run_XXX/` and navigate:
1. Choose a browser folder (chromium, firefox, webkit)
2. Choose a numbered test folder (01_, 02_, 03_, etc.)
3. View screenshots in order (01_, 02_, 03_, etc.)

### For Developers
- TypeScript: Run `npx playwright show-report` for HTML report
- Python: Open `log.html` in browser for Robot Framework report

## Running Tests

### TypeScript (Playwright)
```bash
cd automation/typescript
npx playwright test                    # Run all browsers
npx playwright test --project=chromium # Run Chrome only
```

### Python (Robot Framework)
```bash
cd automation/python/robotframework
./run_tests.sh                         # Run all tests
python -m robot tests/web/            # Run manually
```

## Comparison

| Feature | Before | After |
|---------|--------|-------|
| Folder Structure | `results/screenshots/<test>/` | `test-output/<timestamp>/<browser>/<test>/` |
| Test Run ID | None | `2026-02-14_10-30-00_Run_001` |
| Test Numbering | None | `01_`, `02_`, `03_`, etc. |
| Filenames | `01_page_20260214_103045.png` | `01_page_loaded.png` |
| Multi-browser | Single only | chromium, firefox, webkit |
