from playwright.sync_api import Page
from robot.api.deco import library, keyword, not_keyword
import logging

logger = logging.getLogger(__name__)
__version__ = "0.1"
__author__ = "Vu Mai"


@library(scope="GLOBAL", auto_keywords=True)
class LoginLibrary:
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

    @keyword("Navigate To Login Page")
    def navigate_to_login_page(self, url: str = "http://localhost:3000"):
        logger.debug(f"Navigating to {url}")
        self._page.goto(url)

    @keyword("Fill Email")
    def fill_email(self, email: str):
        logger.debug(f"Filling email: {email}")
        self._page.fill("#email", email)

    @keyword("Fill Password")
    def fill_password(self, password: str):
        logger.debug("Filling password")
        self._page.fill("#password", password)

    @keyword("Click Login Button")
    def click_login_button(self):
        logger.debug("Clicking login button")
        self._page.click("#login-button")

    @keyword("Login")
    def login(self, email: str = "test@test.com", password: str = "password"):
        logger.debug(f"Logging in with {email}")
        self.fill_email(email)
        self.fill_password(password)
        self.click_login_button()

    @keyword("Verify Login Successful")
    def verify_login_successful(self):
        logger.debug("Verifying login success")
        self._page.wait_for_url("**/todos", timeout=10000)

    @keyword("Verify Login Page Visible")
    def verify_login_page_visible(self):
        logger.debug("Verifying login page is visible")
        self._page.wait_for_selector("#email", timeout=5000)
