// **Feature: Search Properties by Location**

import { test, expect } from "@playwright/test";

let city = "Kitchener";
let province = "ON";
let cityProvince = city + ", " + province;
let searchLocation = "LocationKitchener";
let searchAnytime = "Check-in / CheckoutAny week";
let searchGuests = "GuestsAdd guests";

test("Search Properties by Location", async ({ page }) => {
  await page.goto("/");

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

  // Check if there is the text "airbnb" in the page
  await expect(
    page.getByRole("link", { name: "Airbnb homepage" })
  ).toBeVisible();

  // Search for Kitchener, ON
  await page.fill('input[name="query"]', cityProvince);

  // Click the search button
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for the page to load completely
  // await page.waitForLoadState("load");
  await page.waitForLoadState("networkidle");

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
    new RegExp(`places in ${city}`)
  );

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
