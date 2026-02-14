import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  
  // Generate visual report after all tests complete
  globalTeardown: require.resolve('./global-teardown'),
  
  // Global timeout for each test
  timeout: 90000,
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'on',
    // Increase action timeout for slower browsers
    actionTimeout: 20000,
    navigationTimeout: 20000,
    // Ensure page is fully loaded before interactions
    launchOptions: {
      slowMo: 100, // Small delay between actions for stability
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Chromium is fastest, no extra delays needed
        launchOptions: { slowMo: 0 },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: { slowMo: 100 },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        launchOptions: { slowMo: 300 },
      },
    },
  ],
});
