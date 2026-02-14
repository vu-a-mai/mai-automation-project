import { Page, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global test run ID - shared across all tests in a single run
 * This ensures all tests in one run share the same timestamp
 */
let globalTestRunId: string | null = null;
let globalRunNumber: number = 1;
const RUN_ID_FILE = path.join(process.cwd(), 'test-output', '.current-run');

/**
 * Get or create a test run ID for this execution
 * Uses a file to share the run ID across parallel test workers
 */
function getTestRunId(): string {
  // First check if we already have it in memory
  if (globalTestRunId) {
    return globalTestRunId;
  }
  
  // Check if another worker already created the run ID
  if (fs.existsSync(RUN_ID_FILE)) {
    try {
      globalTestRunId = fs.readFileSync(RUN_ID_FILE, 'utf8').trim();
      if (globalTestRunId) {
        return globalTestRunId;
      }
    } catch {
      // File might be locked, continue to create new
    }
  }
  
  // Create new run ID
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  
  // Find the next run number
  const testOutputDir = path.join(process.cwd(), 'test-output');
  if (!fs.existsSync(testOutputDir)) {
    fs.mkdirSync(testOutputDir, { recursive: true });
  }
  
  const entries = fs.readdirSync(testOutputDir);
  const runNumbers = entries
    .filter(entry => entry.match(/^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_Run_(\d+)$/))
    .map(entry => {
      const match = entry.match(/Run_(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    });
  
  if (runNumbers.length > 0) {
    globalRunNumber = Math.max(...runNumbers) + 1;
  }
  
  globalTestRunId = `${timestamp}_Run_${String(globalRunNumber).padStart(3, '0')}`;
  
  // Save to file for other workers
  try {
    fs.writeFileSync(RUN_ID_FILE, globalTestRunId);
  } catch {
    // Ignore write errors
  }
  
  return globalTestRunId;
}

/**
 * ScreenshotManager - Manages screenshot organization for test runs
 * See ARCHITECTURE.md for folder structure details
 */
export class ScreenshotManager {
  private page: Page;
  private testInfo: TestInfo;
  private step: number = 0;
  private screenshotsDir: string;
  private browserName: string;
  private testRunId: string;
  private testIndex: number;
  private testName: string;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.browserName = testInfo.project.name || 'unknown';
    this.testRunId = getTestRunId();
    
    // Clean test name
    this.testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Calculate test index based on test order
    this.testIndex = this.getTestIndex();
    
    // Create organized folder structure: test-output/<run-id>/<browser>/<test-index>_<test-name>/
    this.screenshotsDir = path.join(
      process.cwd(),
      'test-output',
      this.testRunId,
      this.browserName,
      `${String(this.testIndex).padStart(2, '0')}_${this.testName}`
    );
    
    // Ensure directory exists
    fs.mkdirSync(this.screenshotsDir, { recursive: true });
    
    console.log(`\n📁 Screenshot directory: ${this.screenshotsDir}`);
  }

  /**
   * Calculate test index based on test order in the file
   */
  private getTestIndex(): number {
    // Get all tests from the spec file
    const testFile = this.testInfo.file;
    const testTitle = this.testInfo.title;
    
    // Read the test file to find test order
    try {
      const content = fs.readFileSync(testFile, 'utf8');
      const testMatches = Array.from(content.matchAll(/test\(['"]([^'"]+)['"]/g));
      const index = testMatches.findIndex(match => match[1] === testTitle);
      return index >= 0 ? index + 1 : 1;
    } catch {
      return 1;
    }
  }

  /**
   * Take a screenshot with organized naming
   * @param name - Description of the step/action
   */
  async takeScreenshot(name: string): Promise<void> {
    this.step++;
    
    // Simple filename: 01_page_loaded.png (clean and readable)
    const filename = `${String(this.step).padStart(2, '0')}_${name}.png`;
    const filepath = path.join(this.screenshotsDir, filename);
    
    // Take full page screenshot
    await this.page.screenshot({ 
      path: filepath,
      fullPage: true 
    });
    
    // Attach to Playwright report
    await this.testInfo.attach(`Step ${this.step}: ${name}`, {
      path: filepath,
      contentType: 'image/png'
    });
    
    console.log(`  📸 Step ${this.step}: ${name}`);
  }

  /**
   * Get the screenshots directory path
   */
  getScreenshotsDir(): string {
    return this.screenshotsDir;
  }

  /**
   * Get current step number
   */
  getCurrentStep(): number {
    return this.step;
  }

  /**
   * Get test run ID
   */
  getTestRunId(): string {
    return this.testRunId;
  }
}

/**
 * Create a visual HTML report for the test run
 * Call this after all tests complete
 */
export function createTestRunReport(): void {
  if (!globalTestRunId) return;
  
  const runDir = path.join(process.cwd(), 'test-output', globalTestRunId);
  const reportPath = path.join(runDir, 'index.html');
  
  // Get all browser folders
  const browsers = fs.readdirSync(runDir).filter(f => 
    fs.statSync(path.join(runDir, f)).isDirectory()
  );
  
  // Generate HTML report
  let html = generateReportHTML(globalTestRunId, browsers, runDir);
  
  fs.writeFileSync(reportPath, html);
  
  // Create/update latest symlink
  const latestLink = path.join(process.cwd(), 'test-output', 'latest');
  try {
    if (fs.existsSync(latestLink)) {
      fs.unlinkSync(latestLink);
    }
    fs.symlinkSync(runDir, latestLink, 'junction');
  } catch {
    // Symlink might fail on Windows, that's ok
  }
  
  console.log(`\n📊 Test report created: ${reportPath}`);
  console.log(`🌐 Open in browser: file://${reportPath}`);
}

function generateReportHTML(runId: string, browsers: string[], runDir: string): string {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Run Report - ${runId}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .header h1 { font-size: 2em; margin-bottom: 10px; }
        .header p { opacity: 0.9; }
        .browser-section { 
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .browser-header { 
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #eee;
        }
        .browser-icon { font-size: 1.5em; }
        .browser-name { font-size: 1.3em; font-weight: bold; }
        .test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
        }
        .test-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            background: #fafafa;
            transition: transform 0.2s;
        }
        .test-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .test-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .test-meta {
            font-size: 0.85em;
            color: #666;
            margin-bottom: 10px;
        }
        .screenshot-count {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 3px 10px;
            border-radius: 15px;
            font-size: 0.8em;
        }
        .view-btn {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 10px;
            font-size: 0.9em;
        }
        .view-btn:hover { background: #45a049; }
        .summary {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .summary h2 { margin-bottom: 15px; color: #333; }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        .summary-item {
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .summary-number {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        .summary-label {
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Test Automation Report</h1>
        <p>Run ID: <strong>${runId}</strong></p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="summary">
        <h2>📊 Summary</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-number">${browsers.length}</div>
                <div class="summary-label">Browsers Tested</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">${countTests(runDir, browsers)}</div>
                <div class="summary-label">Total Tests</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">${countScreenshots(runDir, browsers)}</div>
                <div class="summary-label">Screenshots</div>
            </div>
        </div>
    </div>`;

  // Add sections for each browser
  browsers.forEach(browser => {
    html += generateBrowserSection(browser, runDir);
  });

  html += `
</body>
</html>`;
  
  return html;
}

function generateBrowserSection(browser: string, runDir: string): string {
  const browserDir = path.join(runDir, browser);
  const tests = fs.readdirSync(browserDir).filter(f => 
    fs.statSync(path.join(browserDir, f)).isDirectory()
  ).sort();
  
  const browserIcons: { [key: string]: string } = {
    'chromium': '🌐',
    'firefox': '🦊',
    'webkit': '🧭'
  };
  
  let section = `
    <div class="browser-section">
        <div class="browser-header">
            <span class="browser-icon">${browserIcons[browser] || '🌐'}</span>
            <span class="browser-name">${browser.charAt(0).toUpperCase() + browser.slice(1)}</span>
        </div>
        <div class="test-grid">`;

  tests.forEach(test => {
    const testDir = path.join(browserDir, test);
    const screenshots = fs.readdirSync(testDir).filter(f => f.endsWith('.png')).length;
    const testName = test.replace(/^\d+_/, '').replace(/_/g, ' ');
    
    section += `
            <div class="test-card">
                <div class="test-title">${testName}</div>
                <div class="test-meta">
                    <span class="screenshot-count">${screenshots} screenshots</span>
                </div>
                <a href="./${browser}/${test}/01_page_loaded.png" class="view-btn" target="_blank">View Screenshots</a>
            </div>`;
  });

  section += `
        </div>
    </div>`;
  
  return section;
}

function countTests(runDir: string, browsers: string[]): number {
  let count = 0;
  browsers.forEach(browser => {
    const browserDir = path.join(runDir, browser);
    if (fs.existsSync(browserDir)) {
      count += fs.readdirSync(browserDir).filter(f => 
        fs.statSync(path.join(browserDir, f)).isDirectory()
      ).length;
    }
  });
  return count;
}

function countScreenshots(runDir: string, browsers: string[]): number {
  let count = 0;
  browsers.forEach(browser => {
    const browserDir = path.join(runDir, browser);
    if (fs.existsSync(browserDir)) {
      const tests = fs.readdirSync(browserDir).filter(f => 
        fs.statSync(path.join(browserDir, f)).isDirectory()
      );
      tests.forEach(test => {
        const testDir = path.join(browserDir, test);
        count += fs.readdirSync(testDir).filter(f => f.endsWith('.png')).length;
      });
    }
  });
  return count;
}
