import { FullConfig } from '@playwright/test';
import { createTestRunReport } from './tests/screenshot-manager';

/**
 * Global teardown - runs after all tests complete
 * Generates the visual HTML report for easy viewing
 */
async function globalTeardown(config: FullConfig) {
  console.log('\n📊 Generating test run report...');
  createTestRunReport();
  console.log('✅ Report generation complete!\n');
}

export default globalTeardown;
