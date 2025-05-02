// **Feature: Search Properties by Location**

import { test, expect } from "@playwright/test";

let city = "Kitchener";
let province = "ON";
let cityProvince = city + ", " + province;
let searchLocation = "LocationKitchener";
let searchAnytime = "Check-in / CheckoutAny week";
let searchGuests = "GuestsAdd guests";

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

test("Search Properties by Location", async ({ page }) => {
  await page.goto("/");

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  // Check if the cookie banner is visible and accept cookies if it is
  await autoAcceptCookies(page);

  // Check if there is the text "airbnb" in the page
  await expect(
    page.getByRole("link", { name: "Airbnb homepage" })
  ).toBeVisible();

  // Search for Kitchener, ON
  await page.fill('input[name="query"]', cityProvince);

  // Click the search button
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  // Check if the search results contain the text "places in Toronto"
  const searchResults = page.locator('[data-testid="stays-page-heading"]');
  await expect(searchResults).toContainText(city);

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
  await expect(page.getByTestId("little-search-location")).toHaveText(
    searchLocation
  );

  await expect(page.getByTestId("little-search-anytime")).toHaveText(
    searchAnytime
  );

  await expect(page.getByTestId("little-search-guests")).toHaveText(
    searchGuests
  );
});
