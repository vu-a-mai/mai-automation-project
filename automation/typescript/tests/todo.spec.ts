/**
 * TEST FILE - todo.spec.ts
 * 
 * This file contains the actual test cases (scenarios) for the Todo application.
 * It uses the TodoPage class from todo-page.ts to interact with the UI.
 * 
 * Playwright Test Concepts:
 * - test.describe(): Groups related tests together (like a test suite)
 * - test(): Defines a single test case with a name and async function
 * - async ({ page }): Playwright provides a 'page' object for browser interaction
 * - expect(): Assertion library to verify expected outcomes
 * 
 * SCREENSHOT FEATURES:
 * - Organized folder structure: results/screenshots/<browser>/<test_name>/
 * - Step-by-step screenshots with timestamps
 * - Screenshots embedded in HTML reports
 */

// Import test runner and assertion library from Playwright
import { test, expect } from '@playwright/test';
// Import our custom TodoPage class
import { TodoPage } from './todo-page';

// Group all todo-related tests together under "Todo App Tests"
test.describe('Todo App Tests', () => {
  
  /**
   * TEST 1: Login and add a todo
   * 
   * Scenario: User logs in and successfully adds a todo item
   * 
   * Steps:
   * 1. Navigate to the app
   * 2. Login with default credentials
   * 3. Add a new todo
   * 4. Verify the todo exists (is visible on screen)
   */
  test('Login and add todo', async ({ page }, testInfo) => {
    // Create instance of our Page Object, passing the Playwright page and testInfo for screenshots
    const todoPage = new TodoPage(page, testInfo);
    
    await todoPage.goto();  // Navigate to homepage
    await todoPage.login(); // Login with default credentials
    await todoPage.addTodo('Learn TypeScript with Playwright');  // Add a todo
    
    // Assertion: Verify the todo exists (returns true if visible)
    expect(await todoPage.todoExists('Learn TypeScript with Playwright')).toBe(true);
  });

  /**
   * TEST 2: Complete a todo
   * 
   * Scenario: User marks a todo as completed
   * 
   * Steps:
   * 1. Login and add a todo
   * 2. Complete the todo by clicking its checkbox
   * 3. Switch to "completed" filter
   * 4. Verify the todo appears in completed list
   */
  test('Complete todo', async ({ page }, testInfo) => {
    const todoPage = new TodoPage(page, testInfo);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.addTodo('Complete this task');
    await todoPage.completeTodo('Complete this task');
    
    // Verify it's completed by checking it appears in "completed" filter
    await todoPage.filterBy('completed');
    expect(await todoPage.todoExists('Complete this task')).toBe(true);
  });

  /**
   * TEST 3: Delete a todo
   * 
   * Scenario: User removes a todo from the list
   * 
   * Steps:
   * 1. Login and add a todo
   * 2. Delete the todo by clicking its delete button
   * 3. Verify the todo no longer exists (is not visible)
   */
  test('Delete todo', async ({ page }, testInfo) => {
    const todoPage = new TodoPage(page, testInfo);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.addTodo('Delete me');
    await todoPage.deleteTodo('Delete me');
    
    // Assertion: todo should no longer be visible
    expect(await todoPage.todoExists('Delete me')).toBe(false);
  });

  /**
   * TEST 4: Filter active todos
   * 
   * Scenario: User filters to see only incomplete todos
   * 
   * Steps:
   * 1. Login and clear any existing todos
   * 2. Add two new todos
   * 3. Complete one of them
   * 4. Switch to "active" filter
   * 5. Verify only 1 todo is shown (the incomplete one)
   */
  test('Filter active todos', async ({ page }, testInfo) => {
    const todoPage = new TodoPage(page, testInfo);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.clearAllTodos();  // Clean slate
    
    await todoPage.addTodo('Active Task 1');
    await todoPage.addTodo('Active Task 2');
    await todoPage.completeTodo('Active Task 1');  // Complete first one
    
    await todoPage.filterBy('active');  // Show only active (incomplete)
    const count = await todoPage.getTodoCount();
    expect(count).toBe(1);  // Only "Active Task 2" should be visible
  });

  /**
   * TEST 5: Filter completed todos
   * 
   * Scenario: User filters to see only completed todos
   * 
   * Steps:
   * 1. Login and clear existing todos
   * 2. Add two todos
   * 3. Complete one of them
   * 4. Switch to "completed" filter
   * 5. Verify only 1 todo is shown (the completed one)
   */
  test('Filter completed todos', async ({ page }, testInfo) => {
    const todoPage = new TodoPage(page, testInfo);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.clearAllTodos();
    
    await todoPage.addTodo('Task One');
    await todoPage.addTodo('Task Two');
    await todoPage.completeTodo('Task One');
    
    await todoPage.filterBy('completed');  // Show only completed
    const count = await todoPage.getTodoCount();
    expect(count).toBe(1);  // Only "Task One" should be visible
  });

  /**
   * TEST 6: Add multiple todos
   * 
   * Scenario: User adds several todos at once
   * 
   * Steps:
   * 1. Login and clear existing todos
   * 2. Add three different todos
   * 3. Verify all 3 are visible by counting them
   */
  test('Add multiple todos', async ({ page }, testInfo) => {
    const todoPage = new TodoPage(page, testInfo);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.clearAllTodos();
    
    await todoPage.addTodo('First Todo');
    await todoPage.addTodo('Second Todo');
    await todoPage.addTodo('Third Todo');
    
    const count = await todoPage.getTodoCount();
    expect(count).toBe(3);  // All three should be present
  });

  /**
   * TEST 7: Complete all todos
   * 
   * Scenario: User marks all todos as completed
   * 
   * Steps:
   * 1. Login and clear existing todos
   * 2. Add three todos
   * 3. Complete all three one by one
   * 4. Switch to "completed" filter
   * 5. Verify all 3 appear in completed list
   */
  test('Complete all todos', async ({ page }, testInfo) => {
    const todoPage = new TodoPage(page, testInfo);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.clearAllTodos();
    
    await todoPage.addTodo('Todo 1');
    await todoPage.addTodo('Todo 2');
    await todoPage.addTodo('Todo 3');
    
    // Complete all three todos
    await todoPage.completeTodo('Todo 1');
    await todoPage.completeTodo('Todo 2');
    await todoPage.completeTodo('Todo 3');
    
    await todoPage.filterBy('completed');
    const count = await todoPage.getTodoCount();
    expect(count).toBe(3);  // All three should be in completed filter
  });

  /**
   * TEST 8: Delete all todos
   * 
   * Scenario: User removes all todos at once
   * 
   * Steps:
   * 1. Login
   * 2. Add two temporary todos
   * 3. Use clearAllTodos() to delete all
   * 4. Verify count is 0 (no todos remain)
   */
  test('Delete all todos', async ({ page }, testInfo) => {
    const todoPage = new TodoPage(page, testInfo);
    
    await todoPage.goto();
    await todoPage.login();
    
    await todoPage.addTodo('Temp Todo 1');
    await todoPage.addTodo('Temp Todo 2');
    await todoPage.clearAllTodos();  // Delete all todos
    
    const count = await todoPage.getTodoCount();
    expect(count).toBe(0);  // List should be empty
  });

  /**
   * TEST 9: Switch between filters
   * 
   * Scenario: User switches between all filter views
   * 
   * Steps:
   * 1. Login and clear todos
   * 2. Add two todos
   * 3. Complete one todo
   * 4. Check "active" filter shows incomplete todo
   * 5. Check "completed" filter shows completed todo
   * 6. Check "all" filter shows both todos (count = 2)
   */
  test('Switch between filters', async ({ page }, testInfo) => {
    const todoPage = new TodoPage(page, testInfo);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.clearAllTodos();
    
    await todoPage.addTodo('Mixed Todo 1');
    await todoPage.addTodo('Mixed Todo 2');
    await todoPage.completeTodo('Mixed Todo 1');  // Complete first, leave second active
    
    // Check active filter - should show "Mixed Todo 2" (incomplete)
    await todoPage.filterBy('active');
    expect(await todoPage.todoExists('Mixed Todo 2')).toBe(true);
    
    // Check completed filter - should show "Mixed Todo 1" (completed)
    await todoPage.filterBy('completed');
    expect(await todoPage.todoExists('Mixed Todo 1')).toBe(true);
    
    // Check all filter - should show both todos (count = 2)
    await todoPage.filterBy('all');
    const count = await todoPage.getTodoCount();
    expect(count).toBe(2);
  });
});
