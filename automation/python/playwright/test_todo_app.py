# tests-python/playwright/test_todo_app.py
"""
Python + Playwright tests for the Todo App
Run locally with: pytest test_todo_app.py -v
"""

import os
import pytest
from playwright.sync_api import Page, expect

# Test data
TEST_EMAIL = "test@test.com"
TEST_PASSWORD = "password"
BASE_URL = os.environ.get("BASE_URL", "https://mai-automation-project.vercel.app").rstrip("/") + "/"


@pytest.fixture(scope="function")
def page(page: Page):
    """Setup: Navigate to the app before each test"""
    page.goto(BASE_URL)
    yield page


class TestLogin:
    """Test the login functionality"""
    
    def test_login_page_loads(self, page: Page):
        """Verify login page loads correctly"""
        # Check title
        expect(page.get_by_test_id("login-title")).to_be_visible()
        expect(page.get_by_test_id("login-title")).to_contain_text("Todo App")
        
        # Check form elements exist
        expect(page.get_by_test_id("email-input")).to_be_visible()
        expect(page.get_by_test_id("password-input")).to_be_visible()
        expect(page.get_by_test_id("login-button")).to_be_visible()
    
    def test_login_with_valid_credentials(self, page: Page):
        """Test successful login"""
        # Fill in credentials
        page.get_by_test_id("email-input").fill(TEST_EMAIL)
        page.get_by_test_id("password-input").fill(TEST_PASSWORD)
        
        # Click login
        page.get_by_test_id("login-button").click()
        
        # Should redirect to todos page
        expect(page.get_by_test_id("todos-title")).to_be_visible()
        expect(page).to_have_url(f"{BASE_URL}todos", timeout=10000)
    
    def test_login_with_invalid_credentials(self, page: Page):
        """Test login with wrong password shows error"""
        # Fill in wrong credentials
        page.get_by_test_id("email-input").fill(TEST_EMAIL)
        page.get_by_test_id("password-input").fill("wrongpassword")
        
        # Click login
        page.get_by_test_id("login-button").click()
        
        # Should show error message
        expect(page.get_by_test_id("login-error")).to_be_visible()
        expect(page.get_by_test_id("login-error")).to_contain_text("Invalid")
        
        # Should stay on login page (not redirect to todos)
        expect(page).not_to_have_url(f"{BASE_URL.rstrip('/')}todos")


class TestTodos:
    """Test the todo functionality"""
    
    @pytest.fixture(autouse=True)
    def login_first(self, page: Page):
        """Login before each todo test"""
        page.get_by_test_id("email-input").fill(TEST_EMAIL)
        page.get_by_test_id("password-input").fill(TEST_PASSWORD)
        page.get_by_test_id("login-button").click()
        expect(page.get_by_test_id("todos-title")).to_be_visible()
    
    def test_todos_page_loads(self, page: Page):
        """Verify todos page loads with initial data"""
        # Check title
        expect(page.get_by_test_id("todos-title")).to_be_visible()
        
        # Check stats
        expect(page.get_by_test_id("total-count")).to_be_visible()
        expect(page.get_by_test_id("active-count")).to_be_visible()
        expect(page.get_by_test_id("completed-count")).to_be_visible()
        
        # Should have 3 initial todos
        expect(page.get_by_test_id("total-count")).to_contain_text("3")
    
    def test_add_new_todo(self, page: Page):
        """Test adding a new todo"""
        initial_count = page.get_by_test_id("total-count").text_content()
        
        # Add new todo
        page.get_by_test_id("new-todo-input").fill("Test new todo item")
        page.get_by_test_id("add-todo-button").click()
        
        # Check count increased
        expect(page.get_by_test_id("total-count")).to_contain_text(str(int(initial_count) + 1))
        
        # Check todo appears in list
        expect(page.get_by_text("Test new todo item")).to_be_visible()
    
    def test_mark_todo_complete(self, page: Page):
        """Test marking a todo as complete"""
        # Get first todo checkbox
        first_checkbox = page.get_by_test_id("todo-checkbox-1")
        
        # Check initial state
        initial_completed = page.get_by_test_id("completed-count").text_content()
        
        # Click to complete
        first_checkbox.click()
        
        # Verify completed count increased
        expect(page.get_by_test_id("completed-count")).to_contain_text(str(int(initial_completed) + 1))
    
    def test_delete_todo(self, page: Page):
        """Test deleting a todo"""
        initial_count = page.get_by_test_id("total-count").text_content()
        
        # Delete first todo
        page.get_by_test_id("delete-button-1").click()
        
        # Check count decreased
        expect(page.get_by_test_id("total-count")).to_contain_text(str(int(initial_count) - 1))
    
    def test_edit_todo(self, page: Page):
        """Test editing a todo"""
        # Click edit on first todo
        page.get_by_test_id("edit-button-1").click()
        
        # Clear and type new text
        page.get_by_test_id("edit-input-1").fill("Updated todo text")
        
        # Save
        page.get_by_test_id("save-edit-1").click()
        
        # Verify text changed
        expect(page.get_by_test_id("todo-text-1")).to_contain_text("Updated todo text")
    
    def test_filter_todos(self, page: Page):
        """Test filtering todos"""
        # Click filter active
        page.get_by_test_id("filter-active").click()
        
        # Should show only active todos
        # (Active count from stats should match visible todos)
        
        # Click filter completed
        page.get_by_test_id("filter-completed").click()
        
        # Click filter all
        page.get_by_test_id("filter-all").click()
        
        # Should show all todos again
        expect(page.get_by_test_id("todo-item-1")).to_be_visible()
    
    def test_logout(self, page: Page):
        """Test logout functionality"""
        # Click logout
        page.get_by_test_id("logout-button").click()
        
        # Should redirect to login
        expect(page.get_by_test_id("login-title")).to_be_visible()
        expect(page).to_have_url(BASE_URL)


class TestTodoValidation:
    """Test form validation and edge cases"""
    
    @pytest.fixture(autouse=True)
    def login_first(self, page: Page):
        """Login before each test"""
        page.get_by_test_id("email-input").fill(TEST_EMAIL)
        page.get_by_test_id("password-input").fill(TEST_PASSWORD)
        page.get_by_test_id("login-button").click()
        expect(page.get_by_test_id("todos-title")).to_be_visible()
    
    def test_cannot_add_empty_todo(self, page: Page):
        """Test that empty todos are not added"""
        initial_count = page.get_by_test_id("total-count").text_content()
        
        # Try to add empty todo
        page.get_by_test_id("new-todo-input").fill("   ")
        page.get_by_test_id("add-todo-button").click()
        
        # Count should not change
        expect(page.get_by_test_id("total-count")).to_contain_text(initial_count)
    
    def test_cancel_edit_todo(self, page: Page):
        """Test canceling an edit"""
        # Get original text
        original_text = page.get_by_test_id("todo-text-1").text_content()
        
        # Click edit
        page.get_by_test_id("edit-button-1").click()
        
        # Type something different
        page.get_by_test_id("edit-input-1").fill("This should not be saved")
        
        # Click cancel
        page.get_by_test_id("cancel-edit-1").click()
        
        # Original text should remain
        expect(page.get_by_test_id("todo-text-1")).to_contain_text(original_text)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
