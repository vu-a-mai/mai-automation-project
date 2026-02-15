"""CustomKeywordsLibrary - Simple keywords for Todo App automation"""

import os
import re
from datetime import datetime
from playwright.sync_api import sync_playwright
from robot.api.deco import library, keyword
from robot.api import logger
from robot.libraries.BuiltIn import BuiltIn

# Global test run tracking
_global_test_run_id = None
_global_step_counters = {}  # Track steps per test


def get_test_run_id():
    """Get or create test run ID for this execution."""
    global _global_test_run_id
    
    if _global_test_run_id is None:
        now = datetime.now()
        timestamp = now.strftime("%Y-%m-%d_%H-%M-%S")
        
        # Find next run number
        test_output_dir = os.path.join(os.getcwd(), "test-output")
        run_number = 1
        
        if os.path.exists(test_output_dir):
            entries = os.listdir(test_output_dir)
            run_numbers = []
            for entry in entries:
                match = re.match(r'\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_Run_(\d+)', entry)
                if match:
                    run_numbers.append(int(match.group(1)))
            
            if run_numbers:
                run_number = max(run_numbers) + 1
        
        _global_test_run_id = f"{timestamp}_Run_{run_number:03d}"
    
    return _global_test_run_id


def get_test_index(test_name):
    """Get test index based on test order in the test file."""
    robot = BuiltIn()
    test_file = robot.get_variable_value('${SUITE SOURCE}')
    
    if not test_file or not os.path.exists(test_file):
        return 1
    
    try:
        with open(test_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all test case names - look for lines after "*** Test Cases ***"
        test_matches = []
        in_test_cases = False
        lines = content.split('\n')
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            # Check if we're entering the Test Cases section
            if stripped == '*** Test Cases ***':
                in_test_cases = True
                continue
            
            # Check if we're leaving the Test Cases section
            if stripped.startswith('***') and stripped != '*** Test Cases ***':
                in_test_cases = False
                continue
            
            # In Robot Framework, test names are lines that:
            # 1. Are in the Test Cases section
            # 2. Don't start with spaces or tabs (not indented)
            # 3. Aren't empty
            # 4. Aren't comments
            if in_test_cases and stripped and not line.startswith(' ') and not line.startswith('\t'):
                if not stripped.startswith('#') and not stripped.startswith('['):
                    test_matches.append((i, stripped))
        
        # Find index of current test
        for idx, (line_num, name) in enumerate(test_matches):
            if test_name.lower() == name.lower():
                return idx + 1
    except Exception:
        pass
    
    return 1


@library(scope="GLOBAL")
class CustomKeywordsLibrary:
    """Simple keywords for Todo app automation with improved screenshot organization."""
    
    ROBOT_LIBRARY_SCOPE = "GLOBAL"

    def __init__(self):
        self._playwright = None
        self._browser = None
        self._context = None
        self._page = None
        self._current_test_name = None
        self._test_index = None
        self._browser_name = None

    def _get_page(self):
        """Get browser page."""
        if self._browser is None:
            robot = BuiltIn()
            browser = robot.get_variable_value("${BROWSER}") or "chromium"
            headless = robot.get_variable_value("${HEADLESS}") or False
            
            if isinstance(headless, str):
                headless = headless.lower() not in ("false", "0", "no", "")
            
            self._browser_name = browser
            self._playwright = sync_playwright().start()
            
            if browser == "firefox":
                self._browser = self._playwright.firefox.launch(headless=headless)
            elif browser == "webkit":
                self._browser = self._playwright.webkit.launch(headless=headless)
            else:
                self._browser = self._playwright.chromium.launch(headless=headless)
            
            self._context = self._browser.new_context()
            self._page = self._context.new_page()
        
        return self._page

    def _get_step_counter(self, test_name):
        """Get step counter for specific test."""
        global _global_step_counters
        if test_name not in _global_step_counters:
            _global_step_counters[test_name] = 0
        return _global_step_counters[test_name]

    def _increment_step(self, test_name):
        """Increment step counter for specific test."""
        global _global_step_counters
        if test_name not in _global_step_counters:
            _global_step_counters[test_name] = 0
        _global_step_counters[test_name] += 1
        return _global_step_counters[test_name]

    def _screenshot(self, name):
        """Take screenshot with improved organization."""
        page = self._get_page()
        
        robot = BuiltIn()
        test_name = robot.get_variable_value('${TEST NAME}') or "Test"
        
        # Get test index (order in test file)
        if self._current_test_name != test_name:
            self._current_test_name = test_name
            self._test_index = get_test_index(test_name)
        
        test_index = self._test_index or 1
        step = self._increment_step(test_name)
        
        # Clean test name for folder
        clean_test_name = test_name.replace(' ', '_')
        
        # Create organized folder structure: test-output/<timestamp>/<browser>/<test>/
        test_run_id = get_test_run_id()
        screenshots_dir = os.path.join(
            os.getcwd(),
            "test-output",
            test_run_id,
            self._browser_name or "chromium",
            f"{test_index:02d}_{clean_test_name}"
        )
        
        os.makedirs(screenshots_dir, exist_ok=True)
        
        # Clean filename: 01_page_loaded.png
        filename = f"{step:02d}_{name}.png"
        filepath = os.path.join(screenshots_dir, filename)
        
        # Wait for page to be ready before screenshot (fixes CI timing issues)
        page.wait_for_load_state("domcontentloaded")
        page.wait_for_timeout(500)
        
        page.screenshot(path=filepath, full_page=True)
        
        # Log with relative path
        rel_path = os.path.relpath(filepath, os.getcwd())
        logger.info(f"Screenshot saved: {rel_path}")
        
        # Show in log
        html = f'<a href="{filepath}" target="_blank"><img src="{filepath}" width="800" style="border:3px solid #FF002B;border-radius:8px;"/></a>'
        BuiltIn().log(html, "HTML")

    @keyword("Open Browser")
    def open_browser(self, browser="chromium", headless=False):
        """Open browser."""
        logger.info(f"Opening {browser}")
        self._browser_name = browser
        
        # Log test run info
        test_run_id = get_test_run_id()
        logger.info(f"Test Run ID: {test_run_id}")

    @keyword("Close Browser")
    def close_browser(self):
        """Close browser."""
        if self._browser:
            self._browser.close()
            self._browser = None
        if self._playwright:
            self._playwright.stop()
            self._playwright = None

    @keyword("Go To Page")
    def go_to_page(self, url):
        """Navigate to URL."""
        page = self._get_page()
        page.goto(url)
        self._screenshot("page_loaded")

    @keyword("Login")
    def login(self, email, password):
        """Login with email and password."""
        page = self._get_page()
        
        page.get_by_label("Email Address").fill(email)
        self._screenshot("email_filled")
        
        page.get_by_label("Password").fill(password)
        self._screenshot("password_filled")
        
        page.get_by_role("button", name="Sign In").click()
        page.wait_for_url("**/todos", timeout=10000)
        self._screenshot("logged_in")

    @keyword("Add Todo")
    def add_todo(self, text):
        """Add a todo."""
        page = self._get_page()
        
        page.get_by_placeholder("What needs to be done?").fill(text)
        self._screenshot(f"todo_typed_{text.replace(' ', '_')}")
        
        page.get_by_role("button", name="Add").click()
        page.wait_for_timeout(500)
        self._screenshot(f"todo_added_{text.replace(' ', '_')}")

    @keyword("Complete Todo")
    def complete_todo(self, text):
        """Complete a todo."""
        page = self._get_page()
        todo = page.get_by_role("listitem").filter(has_text=text)
        checkbox = todo.locator("button[data-testid^='todo-checkbox']")
        checkbox.click()
        self._screenshot(f"todo_completed_{text.replace(' ', '_')}")

    @keyword("Delete Todo")
    def delete_todo(self, text):
        """Delete a todo."""
        page = self._get_page()
        todo = page.get_by_role("listitem").filter(has_text=text)
        delete_btn = todo.locator("button[data-testid^='delete-button']")
        delete_btn.click()
        page.wait_for_timeout(500)
        self._screenshot(f"todo_deleted_{text.replace(' ', '_')}")

    @keyword("Filter Todos")
    def filter_todos(self, status):
        """Filter todos by status: all, active, completed."""
        page = self._get_page()
        page.get_by_role("button", name=status.lower()).click()
        page.wait_for_timeout(500)
        self._screenshot(f"filtered_{status}")

    @keyword("Verify Todo Visible")
    def verify_todo_visible(self, text):
        """Check todo is visible."""
        page = self._get_page()
        todo = page.get_by_role("listitem").filter(has_text=text)
        todo.wait_for(state="attached", timeout=5000)
        self._screenshot(f"todo_visible_{text.replace(' ', '_')}")

    @keyword("Verify Todo Not Visible")
    def verify_todo_not_visible(self, text):
        """Check todo is not visible."""
        page = self._get_page()
        todo = page.get_by_role("listitem").filter(has_text=text)
        todo.wait_for(state="detached", timeout=5000)
        self._screenshot(f"todo_not_visible_{text.replace(' ', '_')}")

    @keyword("Count Todos")
    def count_todos(self):
        """Count todos."""
        page = self._get_page()
        count = page.get_by_role("listitem").count()
        return count

    @keyword("Clear All Todos")
    def clear_all_todos(self):
        """Delete all todos."""
        page = self._get_page()
        delete_buttons = page.locator("button[data-testid^='delete-button']")
        
        while delete_buttons.count() > 0:
            delete_buttons.first.click()
            page.wait_for_timeout(300)
        
        self._screenshot("all_todos_cleared")
