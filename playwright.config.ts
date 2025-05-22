import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 120000,
  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  // Retry
  retries: process.env.CI ? 0 : 0,
  // Run 3 tests in parallel
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["list"], ["html"], ["json", { outputFile: "test-results.json" }]],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: false, // Run tests in headed mode so you can SEE the browser
    video: "off", //Record a video for each test
    screenshot: "only-on-failure", // (Optional) Take a screenshot if a test fails
    trace: "retain-on-failure",
    contextOptions: {
      storageState: undefined, // no shared cookies or sessions
    },
    viewport: { width: 1280, height: 720 },
    actionTimeout: 80000, // Increase to 20 seconds for actions (click, fill, etc.)
    navigationTimeout: 80000, // Increase to 30 seconds for page loads

    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://www.airbnb.ca",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
      retries: 0,
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
      retries: 0,
    },
    // {
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //   },
    //   retries: 0,
    // },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
