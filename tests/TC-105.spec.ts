// **Feature: Search Properties by Guests**

import { test, expect } from "@playwright/test";
import { page } from "../gobal-setup.spec";

test("Search Properties by Guests", async () => {
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

  // Check if there is at least one property displayed
  const count = await page.locator('[data-testid="card-container"]').count();
  expect(count).toBeGreaterThan(0);

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
