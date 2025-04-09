import test, {
  chromium,
  Browser,
  Page,
  BrowserContext,
} from "@playwright/test";

let browser: Browser;
let page: Page;
let context: BrowserContext;

test.beforeAll(async () => {
  console.log("*** Launching Browser and Navigating to Airbnb ***");

  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();

  await page.goto("https://www.airbnb.ca/");

  // Accept cookies if the popup shows up
  const acceptButton = page.locator('button:has-text("Accept")');
  if (await acceptButton.isVisible()) {
    await acceptButton.click();
  }
});

test.afterAll(async () => {
  console.log("*** Closing Browser After All Tests ***");
  await browser.close();
});

// Export the page to be used in your tests
export { page };
