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

  // Click the search button
  let searchButton = page.getByTestId("structured-search-input-search-button");
  await searchButton.click();

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  await page.waitForTimeout(5000);

  // Navigate to the homepage again
  await page.goto("/");

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  // Accept cookies if the cookie banner appears
  await autoAcceptCookies(page);

  // Click the search destinations
  await page.getByTestId("structured-search-input-field-query").click();

  let suggestedDestinations = page.getByText("Suggested destinations").nth(0);
  await expect(suggestedDestinations).toBeVisible({ timeout: 15000 });

  // find the previous searched location in the suggested destionations dropdown list
  const location = page
    .locator('[role="link"]')
    .filter({ hasText: cityName })
    .nth(0);

  await expect(location).toBeVisible();
  await location.click();

  // Click the search button
  // await searchButton.scrollIntoViewIfNeeded();
  await expect(searchButton).toBeVisible({ timeout: 5000 });
  await expect(searchButton).toBeEnabled({ timeout: 5000 });
  await searchButton.click();

  // Check if the search results contain the location added in the search
  const searchResults = page.locator('[data-testid="stays-page-heading"]');
  await expect(searchResults).toContainText(cityName);

  // Check how many properties cards are displayed in the first page
  await page.waitForSelector('[data-testid="card-container"]', {
    timeout: 60000,
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
  let searchLocation = `LocationHomes in ${cityName}`;
  let searchAnytime = "Check-in / CheckoutAny week";
  let searchGuests = "GuestsAdd guests";

  await expect(page.getByTestId("little-search-location")).toHaveText(
    searchLocation
  );
  await expect(page.getByTestId("little-search-date")).toHaveText(
    searchAnytime
  );
  await expect(page.getByTestId("little-search-guests")).toHaveText(
    searchGuests
  );
});
