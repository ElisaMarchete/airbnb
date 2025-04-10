import test, {
  chromium,
  Browser,
  Page,
  BrowserContext,
  FullConfig,
} from "@playwright/test";

// let browser: Browser;
// let page: Page;
// let context: BrowserContext;

async function globalSetup(config: FullConfig) {
  console.log("*** Launching Browser and Navigating to Airbnb ***");

  // const browser = await chromium.launch();
  // const page = await browser.newPage();

  // await page.goto("/");

  // // Accept cookies if the popup shows up
  // const acceptButton = page.locator('button:has-text("Accept")');
  // if (await acceptButton.isVisible()) {
  //   await acceptButton.click();
  // }
}

export default globalSetup;

// test.afterAll(async () => {
//   console.log("*** Closing Browser After All Tests ***");
//   await browser.close();
// });

// export { page };
