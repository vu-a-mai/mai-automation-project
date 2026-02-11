from playwright.sync_api import Page
from robot.api.deco import library, keyword, not_keyword
import logging

logger = logging.getLogger(__name__)
__version__ = "0.1"
__author__ = "Vu Mai"


@library(scope="GLOBAL", auto_keywords=True)
class TodoLibrary:
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

    @keyword("Add Todo")
    def add_todo(self, title: str):
        logger.debug(f"Adding todo: {title}")
        self._page.fill("#todo-input", title)
        self._page.click("#add-todo-button")

    @keyword("Complete Todo")
    def complete_todo(self, title: str):
        logger.debug(f"Completing todo: {title}")
        checkbox = self._page.locator(f"text={title}").locator("..").locator('input[type="checkbox"]')
        checkbox.check()

    @keyword("Delete Todo")
    def delete_todo(self, title: str):
        logger.debug(f"Deleting todo: {title}")
        delete_btn = self._page.locator(f"text={title}").locator("..").locator(".delete-btn")
        delete_btn.click()

    @keyword("Edit Todo")
    def edit_todo(self, old_title: str, new_title: str):
        logger.debug(f"Editing todo: {old_title} -> {new_title}")
        edit_btn = self._page.locator(f"text={old_title}").locator("..").locator(".edit-btn")
        edit_btn.click()
        self._page.fill(".edit-input", new_title)
        self._page.click(".save-btn")

    @keyword("Filter By Status")
    def filter_by_status(self, status: str):
        logger.debug(f"Filtering by status: {status}")
        if status.lower() == "active":
            self._page.click("text=Active")
        elif status.lower() == "completed":
            self._page.click("text=Completed")
        else:
            self._page.click("text=All")

    @keyword("Get Todo Count")
    def get_todo_count(self) -> int:
        todos = self._page.locator(".todo-item")
        return todos.count()

    @keyword("Verify Todo Exists")
    def verify_todo_exists(self, title: str):
        logger.debug(f"Verifying todo exists: {title}")
        self._page.locator(f"text={title}").wait_for(state="attached")

    @keyword("Verify Todo Not Exists")
    def verify_todo_not_exists(self, title: str):
        logger.debug(f"Verifying todo not exists: {title}")
        self._page.locator(f"text={title}").wait_for(state="detached")
