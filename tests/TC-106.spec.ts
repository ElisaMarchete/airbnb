// **Feature: Search Properties by Location Selecting Suggested destinations**

import { test, expect } from "@playwright/test";

let cityNameProvince = "Toronto, ON";
let cityName = cityNameProvince.split(",")[0].trim(); // Extract the city name from the full name
console.log(`City Name: ${cityName}`);

test("Search Properties by Location Selecting Suggested destinations", async ({
  page,
}) => {
  await page.goto("/");

  // Wait for the page to load completely
  await page.waitForLoadState("load");

  // Wait for the cookie banner to appear, but do not fail if it doesn't show up
  const cookieBannerSelector = '[data-testid="main-cookies-banner-container"]';
  const acceptButton = page.getByRole("button", { name: "Accept all" });

  try {
    await page.waitForSelector(cookieBannerSelector, { timeout: 7000 }); // Wait up to 7s
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
    }
  } catch (error) {
    console.log("Cookie banner did not appear, continuing test...");
  }

  // First search for a location
  await page.fill('input[name="query"]', cityNameProvince);
  await page.getByRole("button", { name: "Search" }).click();
  await page.goto("/");

  try {
    await page.waitForSelector(cookieBannerSelector, { timeout: 7000 }); // Wait up to 7s
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
    }
  } catch (error) {
    console.log("Cookie banner did not appear, continuing test...");
  }

  // Click the search destinations
  await page.getByTestId("structured-search-input-field-query").click();

  // find text in the dropdown Suggested destinations
  await page.getByText("Suggested destinations").waitFor({ timeout: 60000 });

  // Select the second option from the dropdown dynamically
  const firstOption = page.locator('[role="link"]').nth(1);
  await expect(firstOption).toBeVisible({ timeout: 60000 });
  await firstOption.click();

  // Click the search button
  await page.getByRole("button", { name: "Search" }).click();

  try {
    await page.waitForSelector(cookieBannerSelector, { timeout: 7000 }); // Wait up to 7s
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
    }
  } catch (error) {
    console.log("Cookie banner did not appear, continuing test...");
  }

  //Check if there is at least one result displayed
  const results = await page.locator('[data-testid="search-results"]').count();
  console.log(`Number of results: ${results}`);

  // Check if the page contains the text "places in Kitchener"
  await expect(page.getByTestId("stays-page-heading")).toHaveText(
    new RegExp(`places in ${cityName}`)
  );

  // Check if there is at least one property displayed
  const count = await page.locator('[data-testid="card-container"]').count();
  expect(count).toBeGreaterThan(0);

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
