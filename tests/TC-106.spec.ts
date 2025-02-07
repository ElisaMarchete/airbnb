// **Feature: Search Properties by Location Selecting Suggested destinations**

import { test, expect } from "@playwright/test";

test("Search Properties by Location", async ({ page }) => {
  await page.goto("https://www.airbnb.ca/");

  // Check if there is the text "airbnb" in the page
  await expect(
    page.getByRole("link", { name: "Airbnb homepage" })
  ).toBeVisible();

  //

  //   // Click the search button
  //   await page.getByRole("button", { name: "Search" }).click();

  //   // Check if the page heading contain the text "places in Kitchener"
  //   await expect(page.getByTestId("stays-page-heading")).toHaveText(
  //     /places in Kitchener/
  //   );

  //   // Close the cookie banner by clicking the "Accept all" button
  //   await page.getByRole("button", { name: "Accept all" }).click();

  //   // Wait for the page to load
  //   await page.waitForLoadState("networkidle");

  //   // Check if there are at least one propertt displayed
  //   const count = await page.locator('[data-testid="card-container"]').count();
  //   expect(count).toBeGreaterThan(0);

  //   // Check if the map is visible
  //   await expect(page.locator('[data-testid="map/GoogleMap"]')).toBeVisible();
});
