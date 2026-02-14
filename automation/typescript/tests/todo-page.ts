import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly todoInput: Locator;
  readonly addButton: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email Address');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.filterAll = page.getByRole('button', { name: 'all' });
    this.filterActive = page.getByRole('button', { name: 'active' });
    this.filterCompleted = page.getByRole('button', { name: 'completed' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(email: string = 'test@test.com', password: string = 'password') {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await this.page.waitForURL('**/todos');
  }

  async addTodo(text: string) {
    await this.todoInput.fill(text);
    await this.addButton.click();
    await this.page.waitForTimeout(500);
  }

  async completeTodo(text: string) {
    const todo = this.page.getByRole('listitem').filter({ hasText: text });
    const checkbox = todo.locator('button[data-testid^="todo-checkbox"]');
    await checkbox.click();
    await this.page.waitForTimeout(300);
  }

  async deleteTodo(text: string) {
    const todo = this.page.getByRole('listitem').filter({ hasText: text });
    const deleteBtn = todo.locator('button[data-testid^="delete-button"]');
    await deleteBtn.click();
    await this.page.waitForTimeout(300);
  }

  async filterBy(status: 'all' | 'active' | 'completed') {
    if (status === 'all') await this.filterAll.click();
    else if (status === 'active') await this.filterActive.click();
    else if (status === 'completed') await this.filterCompleted.click();
    await this.page.waitForTimeout(300);
  }

  async getTodoCount(): Promise<number> {
    return await this.page.getByRole('listitem').count();
  }

  async todoExists(text: string): Promise<boolean> {
    const todo = this.page.getByRole('listitem').filter({ hasText: text });
    return await todo.isVisible().catch(() => false);
  }

  async clearAllTodos() {
    const deleteButtons = this.page.locator('button[data-testid^="delete-button"]');
    while (await deleteButtons.count() > 0) {
      await deleteButtons.first().click();
      await this.page.waitForTimeout(300);
    }
  }
}
