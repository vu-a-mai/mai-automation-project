# tests-python/playwright/conftest.py
"""
Pytest configuration for Playwright tests
"""

import os
from datetime import datetime
from pathlib import Path

import pytest
from playwright.sync_api import Page


TEST_OUTPUT_DIR = None


def pytest_configure(config):
    """Create test output directory with timestamp."""
    global TEST_OUTPUT_DIR
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    TEST_OUTPUT_DIR = Path("test-output") / f"Run_{timestamp}"
    TEST_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\n📁 Test output directory: {TEST_OUTPUT_DIR}")


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configure browser context."""
    return {
        **browser_context_args,
        "viewport": {"width": 1280, "height": 720},
    }


@pytest.fixture(scope="function")
def screenshot_page(page: Page, request: pytest.FixtureRequest):
    """Fixture that provides screenshot functionality for tests."""
    global TEST_OUTPUT_DIR
    test_name = request.node.name
    test_dir = TEST_OUTPUT_DIR / test_name
    test_dir.mkdir(parents=True, exist_ok=True)
    
    step = {"count": 0}
    page_obj = page
    
    def take_screenshot(name: str):
        step["count"] += 1
        filename = f"{step['count']:02d}_{name}.png"
        filepath = test_dir / filename
        page_obj.screenshot(full_page=True, path=str(filepath))
        print(f"  📸 Step {step['count']}: {name}")
    
    request.node.screenshot = take_screenshot
    yield page


def pytest_runtest_makereport(item, call):
    """Take screenshot on test failure."""
    global TEST_OUTPUT_DIR
    if call.when == "call" and call.excinfo is not None:
        page = item.funcargs.get("page")
        if page and TEST_OUTPUT_DIR:
            test_name = item.name
            failure_dir = TEST_OUTPUT_DIR / "failures"
            failure_dir.mkdir(parents=True, exist_ok=True)
            
            screenshot_path = failure_dir / f"{test_name}_failure.png"
            page.screenshot(full_page=True, path=str(screenshot_path))
            print(f"\n📸 Failure screenshot saved: {screenshot_path}")


def pytest_sessionfinish(session, exitstatus):
    """Generate HTML report after all tests complete."""
    global TEST_OUTPUT_DIR
    if not TEST_OUTPUT_DIR or not TEST_OUTPUT_DIR.exists():
        return
    
    report_path = TEST_OUTPUT_DIR / "index.html"
    
    tests = []
    for test_dir in TEST_OUTPUT_DIR.iterdir():
        if test_dir.is_dir() and test_dir.name not in ("failures", "videos"):
            screenshots = list(test_dir.glob("*.png"))
            tests.append({
                "name": test_dir.name,
                "screenshot_count": len(screenshots),
                "has_screenshots": len(screenshots) > 0,
                "first_screenshot": screenshots[0].name if screenshots else None
            })
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Run Report - {TEST_OUTPUT_DIR.name}</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{ 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }}
        .header {{ 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }}
        .header h1 {{ font-size: 2em; margin-bottom: 10px; }}
        .test-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
        }}
        .test-card {{
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            background: #fafafa;
            transition: transform 0.2s;
        }}
        .test-card:hover {{
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }}
        .test-title {{
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }}
        .screenshot-count {{
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 3px 10px;
            border-radius: 15px;
            font-size: 0.8em;
        }}
        .view-btn {{
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 10px;
            font-size: 0.9em;
        }}
        .view-btn:hover {{ background: #45a049; }}
        .summary {{
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        .summary h2 {{ margin-bottom: 15px; color: #333; }}
        .summary-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }}
        .summary-item {{
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }}
        .summary-number {{
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }}
        .summary-label {{
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Test Automation Report</h1>
        <p>Run ID: <strong>{TEST_OUTPUT_DIR.name}</strong></p>
        <p>Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
    </div>
    
    <div class="summary">
        <h2>📊 Summary</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-number">{len(tests)}</div>
                <div class="summary-label">Total Tests</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">{sum(t['screenshot_count'] for t in tests)}</div>
                <div class="summary-label">Screenshots</div>
            </div>
        </div>
    </div>
    
    <div class="test-grid">
"""
    
    for test in tests:
        screenshot_link = f"./{test['name']}/{test['first_screenshot']}" if test['has_screenshots'] else "#"
        html += f"""
        <div class="test-card">
            <div class="test-title">{test['name']}</div>
            <span class="screenshot-count">{test['screenshot_count']} screenshots</span>
            <br>
            <a href="{screenshot_link}" class="view-btn" target="_blank">View Screenshots</a>
        </div>
"""
    
    html += """
    </div>
</body>
</html>"""
    
    with open(report_path, "w") as f:
        f.write(html)
    
    print(f"\n📊 Test report created: {report_path}")
    print(f"🌐 Open in browser: file://{report_path}")
