// **Feature: Search Properties by Location Selecting Suggested destinations**

import { test, expect } from "@playwright/test";

test("Search Properties by Location", async ({ page }) => {
  await page.goto("https://www.airbnb.ca/");

  // Check if there is the text "airbnb" in the page
  await expect(
    page.getByRole("link", { name: "Airbnb homepage" })
  ).toBeVisible();

  // Click the search destinations
  await page.getByTestId("structured-search-input-field-query").click();

  // find text in the dropdown Suggested destinations
  await page.getByText("Suggested destinations").waitFor({ timeout: 60000 });

  // Select the second option from the dropdown dynamically
  const firstOption = page.locator('[role="link"]').nth(1);
  await firstOption.click();

  // Get the full text of the first option
  const fullText = await firstOption.textContent();

  // Extract only the city name (first word before a comma)
  const cityName = fullText.split(",")[0].trim();

  console.log(`Selected city: ${cityName}`);

  // Click the search button
  await page.getByRole("button", { name: "Search" }).click();

  //Check if there is at least one result displayed
  const results = await page.locator('[data-testid="search-results"]').count();
  console.log(`Number of results: ${results}`);

  // Check if the page contains the text "places in Kitchener"
  await expect(page.getByTestId("stays-page-heading")).toHaveText(
    new RegExp(`places in ${cityName}`)
  );

  // Close the cookie banner by clicking the "Accept all" button
  await page.getByRole("button", { name: "Accept all" }).click();

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
