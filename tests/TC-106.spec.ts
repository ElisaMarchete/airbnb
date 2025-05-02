// **Feature: Search Properties by Location Selecting Suggested destinations**

import { test, expect } from "@playwright/test";

let cityNameProvince = "Toronto, ON";
let cityName = cityNameProvince.split(",")[0].trim(); // Extract the city name from the full name
console.log(`City Name: ${cityName}`);

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

test("Search Properties by Location Selecting Suggested destinations", async ({
  page,
}) => {
  await page.goto("/");

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  // Check if the cookie banner is visible and accept cookies if it is
  await autoAcceptCookies(page);

  // Search by adding a location
  await page.fill('input[name="query"]', cityNameProvince);
  await page.getByRole("button", { name: "Search" }).click();

  // Navigate to the homepage again
  await page.goto("/");

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  // Click the search destinations
  await page.getByTestId("structured-search-input-field-query").click();

  await page.getByText("Suggested destinations").waitFor({ timeout: 60000 });

  // find the previous searched location in the suggested destionations dropdown list
  const location = page.locator('[role="link"]').filter({ hasText: cityName });

  await expect(location).toBeVisible({ timeout: 60000 });
  await location.click();

  // Click the search button
  await page.getByRole("button", { name: "Search" }).click();

  // Check if the search results contain the location added in the search
  const searchResults = page.locator('[data-testid="stays-page-heading"]');
  await expect(searchResults).toContainText(cityName);

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
  let searchLocation = `Location${cityName}`;
  let searchAnytime = "Check-in / CheckoutAny week";
  let searchGuests = "GuestsAdd guests";

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
