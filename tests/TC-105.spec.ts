// **Feature: Search Properties by Guests**

import { test, expect } from "@playwright/test";

// Function to automatically accept cookies if the button is visible
async function autoAcceptCookies(page) {
  const button = page.getByRole("button", { name: "Accept all" });

  for (let i = 0; i < 10; i++) {
    try {
      if (await button.isVisible()) {
        await button.click();
        break;
      }
    } catch {
      // Safe to ignore errors
    }
    await page.waitForTimeout(1000);
  }
}

test("Search Properties by Guests", async ({ page }) => {
  await page.goto("/");

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  // Check if the cookie banner is visible and accept cookies if it is
  await autoAcceptCookies(page);

  // Click on the Who (Add Guests) field
  await page.click(
    '[data-testid="structured-search-input-field-guests-button"]'
  );

  await expect(
    page.getByTestId("search-block-filter-stepper-row-adults")
  ).toBeVisible();

  await expect(
    page.getByTestId("search-block-filter-stepper-row-children")
  ).toBeVisible();

  await expect(
    page.getByTestId("search-block-filter-stepper-row-infants")
  ).toBeVisible();

  await expect(
    page.getByTestId("search-block-filter-stepper-row-pets")
  ).toBeVisible();

  await expect(
    page.getByTestId("search-block-filter-stepper-row-pets")
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Bringing a service animal?" })
  ).toBeVisible();

  // Click the search button to add 10 adults

  let numberOfAdults = 10;

  for (let i = 0; i < numberOfAdults; i++) {
    await page.getByTestId("stepper-adults-increase-button").click();
  }

  // Click the search button
  const searchButton = page.getByTestId(
    "structured-search-input-search-button"
  );
  await expect(searchButton).toBeVisible();
  await expect(searchButton).toBeEnabled();
  await searchButton.click();

  // await page.getByTestId("structured-search-input-search-button").click();

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  // Check how many properties cards are displayed in the first page
  await page.waitForSelector('[data-testid="card-container"]', {
    timeout: 20000,
  });
  const propertiesCards = await page
    .locator('[data-testid="card-container"]')
    .count();
  expect(propertiesCards).toBeGreaterThan(0);
  console.log(
    `properties cards displayed in the first page: ${propertiesCards}`
  );

  // Check if the map is NOT visible
  await expect(page.locator('[data-testid="map/GoogleMap"]')).not.toBeVisible();

  // Assertion for the search result: location, date and guests

  // Check the location field result
  await expect(
    page.getByTestId("structured-search-input-field-query")
  ).toHaveText("");

  // Check the Check-in date field result
  await expect(
    page.getByTestId("structured-search-input-field-split-dates-0")
  ).toHaveText("Check inAdd dates");

  // Check the Check-out date field result
  await expect(
    page.getByTestId("structured-search-input-field-split-dates-1")
  ).toHaveText("Check outAdd dates");

  // Check the Guests field result
  await expect(
    page.getByTestId("structured-search-input-field-guests-button")
  ).toHaveText("Who10 guests");
});
