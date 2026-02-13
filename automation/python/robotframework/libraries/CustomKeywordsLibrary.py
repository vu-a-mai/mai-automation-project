"""
CustomKeywordsLibrary - Simple keywords for Todo App automation
"""

import os
from datetime import datetime
from playwright.sync_api import sync_playwright
from robot.api.deco import library, keyword
from robot.api import logger
from robot.libraries.BuiltIn import BuiltIn


@library(scope="GLOBAL")
class CustomKeywordsLibrary:
    """Simple keywords for Todo app automation."""
    
    ROBOT_LIBRARY_SCOPE = "GLOBAL"

    def __init__(self):
        self._playwright = None
        self._browser = None
        self._context = None
        self._page = None
        self._step = 0

    def _get_page(self):
        """Get browser page."""
        if self._browser is None:
            robot = BuiltIn()
            browser = robot.get_variable_value("${BROWSER}") or "chromium"
            headless = robot.get_variable_value("${HEADLESS}") or False
            
            if isinstance(headless, str):
                headless = headless.lower() not in ("false", "0", "no", "")
            
            self._playwright = sync_playwright().start()
            
            if browser == "firefox":
                self._browser = self._playwright.firefox.launch(headless=headless)
            elif browser == "webkit":
                self._browser = self._playwright.webkit.launch(headless=headless)
            else:
                self._browser = self._playwright.chromium.launch(headless=headless)
            
            self._context = self._browser.new_context()
            self._page = self._context.new_page()
            self._step = 0
        
        return self._page

    def _screenshot(self, name):
        """Take screenshot with step number."""
        page = self._get_page()
        self._step += 1
        
        robot = BuiltIn()
        test_name = robot.get_variable_value('${TEST NAME}') or "Test"
        test_name = test_name.replace(' ', '_')
        
        output_dir = robot.get_variable_value('${OUTPUT DIR}') or "results"
        screenshots_dir = os.path.join(str(output_dir), "screenshots", test_name)
        os.makedirs(screenshots_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self._step:02d}_{name}_{timestamp}.png"
        filepath = os.path.join(screenshots_dir, filename)
        
        page.screenshot(path=filepath, full_page=True)
        
        # Show in log
        html = f'<a href="{filepath}" target="_blank"><img src="{filepath}" width="800" style="border:3px solid #FF002B;border-radius:8px;"/></a>'
        BuiltIn().log(html, "HTML")

    @keyword("Open Browser")
    def open_browser(self, browser="chromium", headless=False):
        """Open browser."""
        logger.info(f"Opening {browser}")

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
