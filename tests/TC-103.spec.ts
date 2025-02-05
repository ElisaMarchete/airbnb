import { test, expect } from "@playwright/test";

test("Search Properties by Location", async ({ page }) => {
  await page.goto("https://www.airbnb.ca/");

  // Check if there is the text "airbnb" in the page
  await expect(
    page.getByRole("link", { name: "Airbnb homepage" })
  ).toBeVisible();

  await page.fill('input[name="query"]', "Kitchener, ON");

  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByTestId("stays-page-heading")).toHaveText(
    /places in Kitchener/
  );

  await page.getByRole("button", { name: "Accept all" }).click();

  await page.waitForLoadState("networkidle");

  const count = await page.locator('[data-testid="card-container"]').count();
  expect(count).toBeGreaterThan(0);

  await expect(page.locator('[data-testid="map/GoogleMap"]')).toBeVisible();
});
