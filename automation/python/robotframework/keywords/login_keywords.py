from playwright.sync_api import Page


class LoginKeywords:
    def __init__(self, page: Page):
        self.page = page

    def navigate_to_login_page(self, url: str = "http://localhost:3000"):
        self.page.goto(url)

    def fill_email(self, email: str):
        self.page.fill("#email", email)

    def fill_password(self, password: str):
        self.page.fill("#password", password)

    def click_login_button(self):
        self.page.click("#login-button")

    def login(self, email: str = "test@test.com", password: str = "password"):
        self.fill_email(email)
        self.fill_password(password)
        self.click_login_button()

    def verify_login_successful(self):
        self.page.wait_for_url("**/todos", timeout=10000)

    def verify_login_page_visible(self):
        self.page.wait_for_selector("#email", timeout=5000)
