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
  let guestsButton = page.getByRole("button", { name: "Who Add guests" });
  await guestsButton.click();

  let adultsButton = page
    .getByTestId("search-block-filter-stepper-row-adults")
    .first();
  await expect(adultsButton).toBeVisible();

  let childrenButton = page
    .getByTestId("search-block-filter-stepper-row-children")
    .first();
  await expect(childrenButton).toBeVisible();

  let infantsButton = page
    .getByTestId("search-block-filter-stepper-row-infants")
    .first();
  await expect(infantsButton).toBeVisible();

  let petsButton = page
    .getByTestId("search-block-filter-stepper-row-pets")
    .first();
  await expect(petsButton).toBeVisible();

  let serviceAnimalButton = page.getByRole("button", {
    name: "Bringing a service animal?",
  });
  await expect(serviceAnimalButton).toBeVisible();

  // Increase adults to 10
  let numberOfAdults = 10;

  let addAdultButton = page
    .getByTestId("stepper-adults-increase-button")
    .first();
  for (let i = 0; i < numberOfAdults; i++) {
    await addAdultButton.click();
    await page.waitForTimeout(200);
  }

  // Click the search button
  const searchButton = page.getByTestId(
    "structured-search-input-search-button"
  );
  await searchButton.scrollIntoViewIfNeeded();
  await searchButton.click();

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

  // Check if the map is visible
  await expect(page.locator('[data-testid="map/GoogleMap"]')).toBeVisible();

  // Assertion for the search result: location, date and guests

  // Check the location field result
  await expect(page.getByTestId("little-search-location")).toHaveText(
    "LocationHomes nearby"
  );

  // Check the Check-in date field result
  await expect(page.getByTestId("little-search-date")).toHaveText(
    "Check-in / CheckoutAny week"
  );

  // Check the Guests field result
  await expect(page.getByTestId("little-search-guests")).toHaveText(
    `Guests${numberOfAdults} guests`
  );
});
