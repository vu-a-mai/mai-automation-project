import { test, expect } from '@playwright/test';
import { TodoPage } from './todo-page';

test.describe('Todo App Tests', () => {
  test('Login and add todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.addTodo('Learn TypeScript with Playwright');
    
    expect(await todoPage.todoExists('Learn TypeScript with Playwright')).toBe(true);
  });

  test('Complete todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.addTodo('Complete this task');
    await todoPage.completeTodo('Complete this task');
    
    // Verify it's completed by checking filter
    await todoPage.filterBy('completed');
    expect(await todoPage.todoExists('Complete this task')).toBe(true);
  });

  test('Delete todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.addTodo('Delete me');
    await todoPage.deleteTodo('Delete me');
    
    expect(await todoPage.todoExists('Delete me')).toBe(false);
  });

  test('Filter active todos', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.clearAllTodos();
    
    await todoPage.addTodo('Active Task 1');
    await todoPage.addTodo('Active Task 2');
    await todoPage.completeTodo('Active Task 1');
    
    await todoPage.filterBy('active');
    const count = await todoPage.getTodoCount();
    expect(count).toBe(1);
  });

  test('Filter completed todos', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.clearAllTodos();
    
    await todoPage.addTodo('Task One');
    await todoPage.addTodo('Task Two');
    await todoPage.completeTodo('Task One');
    
    await todoPage.filterBy('completed');
    const count = await todoPage.getTodoCount();
    expect(count).toBe(1);
  });

  test('Add multiple todos', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.clearAllTodos();
    
    await todoPage.addTodo('First Todo');
    await todoPage.addTodo('Second Todo');
    await todoPage.addTodo('Third Todo');
    
    const count = await todoPage.getTodoCount();
    expect(count).toBe(3);
  });

  test('Complete all todos', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.clearAllTodos();
    
    await todoPage.addTodo('Todo 1');
    await todoPage.addTodo('Todo 2');
    await todoPage.addTodo('Todo 3');
    
    await todoPage.completeTodo('Todo 1');
    await todoPage.completeTodo('Todo 2');
    await todoPage.completeTodo('Todo 3');
    
    await todoPage.filterBy('completed');
    const count = await todoPage.getTodoCount();
    expect(count).toBe(3);
  });

  test('Delete all todos', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    await todoPage.goto();
    await todoPage.login();
    
    await todoPage.addTodo('Temp Todo 1');
    await todoPage.addTodo('Temp Todo 2');
    await todoPage.clearAllTodos();
    
    const count = await todoPage.getTodoCount();
    expect(count).toBe(0);
  });

  test('Switch between filters', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    await todoPage.goto();
    await todoPage.login();
    await todoPage.clearAllTodos();
    
    await todoPage.addTodo('Mixed Todo 1');
    await todoPage.addTodo('Mixed Todo 2');
    await todoPage.completeTodo('Mixed Todo 1');
    
    // Check active filter
    await todoPage.filterBy('active');
    expect(await todoPage.todoExists('Mixed Todo 2')).toBe(true);
    
    // Check completed filter
    await todoPage.filterBy('completed');
    expect(await todoPage.todoExists('Mixed Todo 1')).toBe(true);
    
    // Check all filter
    await todoPage.filterBy('all');
    const count = await todoPage.getTodoCount();
    expect(count).toBe(2);
  });
});
