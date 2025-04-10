// **Feature: Search Properties by Location Selecting Suggested destinations**

import { test, expect } from "@playwright/test";
import { page } from "../gobal-setup.spec";

test("Search Properties by Location Selecting Suggested destinations", async () => {
  await expect(async () => {
    await expect(
      page.getByRole("link", { name: "Airbnb homepage" })
    ).toBeVisible({ timeout: 60000 });
  }).toPass();

  // Wait for the cookie banner to appear, but do not fail if it doesn't show up
  const cookieBannerSelector = '[data-testid="main-cookies-banner-container"]';
  const acceptButton = page.getByRole("button", { name: "Accept all" });

  try {
    await page.waitForSelector(cookieBannerSelector, { timeout: 5000 }); // Wait up to 5s
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
    }
  } catch (error) {
    console.log("Cookie banner did not appear, continuing test...");
  }

  // Check if there is the text "airbnb" in the page
  // await expect(page.getByRole("link", { name: "Airbnb homepage" })).toBeVisible(
  //   { timeout: 60000 }
  // );

  // First search for a location
  await page.fill('input[name="query"]', "Toronto, ON");
  await page.getByRole("button", { name: "Search" }).click();
  await page.goto("https://www.airbnb.ca/");

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

  // Wait for the page to load completely
  await page.waitForLoadState("load");

  try {
    await page.waitForSelector(cookieBannerSelector, { timeout: 5000 }); // Wait up to 5s
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
