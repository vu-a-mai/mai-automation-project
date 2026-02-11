from playwright.sync_api import Page


class TodoKeywords:
    def __init__(self, page: Page):
        self.page = page

    def add_todo(self, title: str):
        self.page.fill("#todo-input", title)
        self.page.click("#add-todo-button")

    def complete_todo(self, title: str):
        checkbox = self.page.locator(f"text={title}").locator("..").locator('input[type="checkbox"]')
        checkbox.check()

    def delete_todo(self, title: str):
        delete_btn = self.page.locator(f"text={title}").locator("..").locator(".delete-btn")
        delete_btn.click()

    def edit_todo(self, old_title: str, new_title: str):
        edit_btn = self.page.locator(f"text={old_title}").locator("..").locator(".edit-btn")
        edit_btn.click()
        self.page.fill(".edit-input", new_title)
        self.page.click(".save-btn")

    def filter_by_status(self, status: str):
        if status.lower() == "active":
            self.page.click("text=Active")
        elif status.lower() == "completed":
            self.page.click("text=Completed")
        else:
            self.page.click("text=All")

    def get_todo_count(self) -> int:
        todos = self.page.locator(".todo-item")
        return todos.count()

    def verify_todo_exists(self, title: str):
        self.page.locator(f"text={title}").wait_for(state="attached")

    def verify_todo_not_exists(self, title: str):
        self.page.locator(f"text={title}").wait_for(state="detached")
