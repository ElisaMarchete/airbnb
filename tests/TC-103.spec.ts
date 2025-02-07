// **Feature: Search Properties by Location**

import { test, expect } from "@playwright/test";

let city = "Kitchener";
let province = "ON";
let cityProvince = city + ", " + province;
let searchLocation = "LocationKitchener";
let searchAnytime = "Check-in / CheckoutAny week";
let searchGuests = "Guests1 guest";

test("Search Properties by Location", async ({ page }) => {
  await page.goto("https://www.airbnb.ca/");

  // Check if there is the text "airbnb" in the page
  await expect(
    page.getByRole("link", { name: "Airbnb homepage" })
  ).toBeVisible();

  // Search for Kitchener, ON
  await page.fill('input[name="query"]', cityProvince);

  // Click the search button
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  //Check if there is at least one result displayed
  const results = await page.locator('[data-testid="search-results"]').count();
  console.log(`Number of results: ${results}`);

  // Check if the page contains the text "places in Kitchener"
  await expect(page.getByTestId("stays-page-heading")).toHaveText(
    new RegExp(`places in ${city}`)
  );

  // Close the cookie banner by clicking the "Accept all" button
  await page.getByRole("button", { name: "Accept all" }).click();

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  // Check if there is at least one property displayed
  const count = await page.locator('[data-testid="card-container"]').count();
  expect(count).toBeGreaterThan(0);

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
