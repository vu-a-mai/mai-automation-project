/**
 * PAGE OBJECT MODEL (POM) Pattern
 * 
 * This file defines the TodoPage class which encapsulates all interactions
 * with the Todo application page. Instead of writing raw Playwright code
 * in every test, we create reusable methods here.
 * 
 * Benefits:
 * - If the UI changes (e.g., button renamed), we only update this file
 * - Tests become more readable (login() vs fill(email).fill(password).click())
 * - Reusable across multiple test files
 * 
 * SCREENSHOT FEATURES:
 * - Organized folder structure: test-output/screenshots/<timestamp>/<browser>/<test_name>/
 * - Step-by-step screenshots with timestamps
 * - Screenshots embedded in HTML reports
 * - Note: Uses 'test-output' folder to avoid conflicts with Playwright's HTML reporter
 */

// Import types from Playwright: Page (browser page) and Locator (element finder)
import { Page, Locator, TestInfo } from '@playwright/test';
import { ScreenshotManager } from './screenshot-manager';

// Export this class so it can be imported by test files
export class TodoPage {
  // Declare properties (variables) that will hold references to page elements
  readonly page: Page;                    // The Playwright page object
  readonly emailInput: Locator;           // Email input field locator
  readonly passwordInput: Locator;        // Password input field locator
  readonly signInButton: Locator;         // Sign In button locator
  readonly todoInput: Locator;            // Todo text input field locator
  readonly addButton: Locator;            // Add button locator
  readonly filterAll: Locator;            // "all" filter button locator
  readonly filterActive: Locator;         // "active" filter button locator
  readonly filterCompleted: Locator;      // "completed" filter button locator
  
  // Screenshot manager for Robot Framework-style screenshots
  private screenshotManager: ScreenshotManager | null = null;

  /**
   * Constructor - runs when we create a new TodoPage instance
   * @param page - The Playwright Page object passed from the test
   * @param testInfo - TestInfo object for screenshot organization (optional)
   * 
   * Here we initialize all the locators by telling Playwright how to find
   * each element on the page using various strategies:
   * - getByLabel: Find by <label> text
   * - getByRole: Find by ARIA role (button, link, etc.)
   * - getByPlaceholder: Find by placeholder attribute
   */
  constructor(page: Page, testInfo?: TestInfo) {
    this.page = page;
    // Use data-testid selectors for more reliable cross-browser compatibility
    // These attributes are specifically added for automation testing
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.signInButton = page.locator('[data-testid="login-button"]');
    
    // Todo page elements - using getByPlaceholder as backup for todo input
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: 'Add' });
    
    // Filter buttons
    this.filterAll = page.getByRole('button', { name: 'all' });
    this.filterActive = page.getByRole('button', { name: 'active' });
    this.filterCompleted = page.getByRole('button', { name: 'completed' });
    
    // Initialize screenshot manager if testInfo is provided
    if (testInfo) {
      this.screenshotManager = new ScreenshotManager(page, testInfo);
    }
  }

  /**
   * Take a screenshot if screenshot manager is enabled
   * @param name - Description of the step
   */
  private async screenshot(name: string): Promise<void> {
    if (this.screenshotManager) {
      await this.screenshotManager.takeScreenshot(name);
    }
  }

  /**
   * Navigate to the application homepage
   * '/' means the root URL (http://localhost:3000/)
   */
  async goto() {
    await this.page.goto('/');
    // Wait for the login form to be present (confirms page loaded)
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.screenshot('page_loaded');
  }

  /**
   * Login to the application
   * @param email - User email (default: test@test.com)
   * @param password - User password (default: password)
   * 
   * Steps:
   * 1. Wait for login form to be ready
   * 2. Fill the email input field
   * 3. Fill the password input field
   * 4. Click the Sign In button
   * 5. Wait for URL to change to /todos (confirms login succeeded)
   */
  async login(email: string = 'test@test.com', password: string = 'password') {
    // Wait for email input to be visible before interacting (important for WebKit/Firefox)
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    
    // Clear fields first, then fill (some browsers have issues with pre-filled values)
    await this.emailInput.clear();
    await this.emailInput.fill(email);
    await this.screenshot('email_filled');
    await this.emailInput.press('Tab'); // Ensure focus moves
    
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
    await this.screenshot('password_filled');
    
    // Wait a moment for form state to update
    await this.page.waitForTimeout(500);
    
    // Click the sign in button
    await this.signInButton.click();
    
    // Wait for navigation with generous timeout
    await this.page.waitForURL('**/todos', { timeout: 15000 });
    await this.screenshot('logged_in');
  }

  /**
   * Add a new todo item
   * @param text - The todo text to add
   * 
   * Steps:
   * 1. Wait for todo input to be ready (important after page navigation)
   * 2. Type the text into the todo input field
   * 3. Click the Add button
   * 4. Wait for the todo to appear in the list
   */
  async addTodo(text: string) {
    // Wait for input to be visible before typing (handles timing issues)
    await this.todoInput.waitFor({ state: 'visible' });
    await this.todoInput.fill(text);
    await this.screenshot(`todo_typed_${text.replace(/\s+/g, '_')}`);
    await this.addButton.click();
    // Wait for the todo text to appear in the DOM instead of fixed timeout
    await this.page.getByText(text).first().waitFor({ state: 'visible', timeout: 5000 });
    await this.screenshot(`todo_added_${text.replace(/\s+/g, '_')}`);
  }

  /**
   * Mark a todo as completed by clicking its checkbox
   * @param text - The text of the todo to complete
   * 
   * Steps:
   * 1. Find the list item containing the todo text
   * 2. Within that item, find the checkbox button
   * 3. Click the checkbox
   * 4. Wait 300ms for UI update
   */
  async completeTodo(text: string) {
    const todo = this.page.getByRole('listitem').filter({ hasText: text });
    const checkbox = todo.locator('button[data-testid^="todo-checkbox"]');
    await checkbox.click();
    await this.page.waitForTimeout(300);
    await this.screenshot(`todo_completed_${text.replace(/\s+/g, '_')}`);
  }

  /**
   * Delete a todo item
   * @param text - The text of the todo to delete
   * 
   * Steps:
   * 1. Find the list item containing the todo text
   * 2. Within that item, find the delete button
   * 3. Click the delete button
   * 4. Wait 300ms for UI update
   */
  async deleteTodo(text: string) {
    const todo = this.page.getByRole('listitem').filter({ hasText: text });
    const deleteBtn = todo.locator('button[data-testid^="delete-button"]');
    await deleteBtn.click();
    await this.page.waitForTimeout(300);
    await this.screenshot(`todo_deleted_${text.replace(/\s+/g, '_')}`);
  }

  /**
   * Filter todos by status
   * @param status - Which filter to apply: 'all', 'active', or 'completed'
   * 
   * Steps:
   * 1. Click the appropriate filter button based on status parameter
   * 2. Wait 300ms for the list to update
   */
  async filterBy(status: 'all' | 'active' | 'completed') {
    if (status === 'all') await this.filterAll.click();
    else if (status === 'active') await this.filterActive.click();
    else if (status === 'completed') await this.filterCompleted.click();
    await this.page.waitForTimeout(300);
    await this.screenshot(`filtered_${status}`);
  }

  /**
   * Get the total count of todo items currently visible
   * @returns Promise<number> - The count of list items
   * 
   * Used to verify how many todos are shown after filtering or operations
   */
  async getTodoCount(): Promise<number> {
    return await this.page.getByRole('listitem').count();
  }

  /**
   * Check if a todo with specific text exists (is visible on screen)
   * @param text - The todo text to search for
   * @returns Promise<boolean> - true if visible, false if not found or hidden
   * 
   * Uses .catch() to return false if the element isn't found (instead of throwing error)
   */
  async todoExists(text: string): Promise<boolean> {
    const todo = this.page.getByRole('listitem').filter({ hasText: text });
    const exists = await todo.isVisible().catch(() => false);
    await this.screenshot(`todo_check_${text.replace(/\s+/g, '_')}_${exists ? 'visible' : 'not_visible'}`);
    return exists;
  }

  /**
   * Delete all todos - useful for cleanup between tests
   * 
   * Steps:
   * 1. Find all delete buttons on the page
   * 2. Keep clicking the first one until no more exist
   * 3. Wait 300ms between each deletion for UI to update
   */
  async clearAllTodos() {
    const deleteButtons = this.page.locator('button[data-testid^="delete-button"]');
    while (await deleteButtons.count() > 0) {
      await deleteButtons.first().click();
      await this.page.waitForTimeout(300);
    }
    await this.screenshot('all_todos_cleared');
  }
}
