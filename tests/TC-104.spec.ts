// **Feature: Search Properties by Date**

import { test, expect } from "@playwright/test";

const formatDate = (daysFromToday: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);

  // Get the exact date in the required format
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" }); // Get the weekday name
  const month = date.toLocaleDateString("en-US", { month: "long" }); // Get the month name
  const year = date.getFullYear(); // Get the full year

  return `${date.getDate()}, ${weekday}, ${month} ${year}`; // output: "23, Sunday, March 2025"
};

// Use formatDate to get the desired check-in and check-out dates
const checkInDate = formatDate(15); // Add 15 days
const checkOutDate = formatDate(20); // Add 20 days

test("Search Properties by Date", async ({ page }) => {
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
  // await expect(
  //   page.getByRole("link", { name: "Airbnb homepage" })
  // ).toBeVisible();

  // Select the check-in date
  await page.getByTestId("structured-search-input-field-split-dates-0").click();

  // wait for the calendar to be visible
  await page.waitForSelector(
    '[data-testid="structured-search-input-field-split-dates-0"]',
    {
      state: "visible",
    }
  );

  // Click on the check-in date
  await page.getByRole("button", { name: `${checkInDate}` }).click();

  // Select the check-out date
  await page.getByRole("button", { name: `${checkOutDate}` }).click();

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

  // Check the date field result
  // Extract day and month
  const splitCheckin = checkInDate.split(", "); // ["23", "Sunday", "March 2025"]
  const day = splitCheckin[0]; // "23"
  const month = splitCheckin[2].split(" ")[0].slice(0, 3); // "March" → "Mar"
  const resultCheckInDate = `${month} ${day}`;

  // Extract day and month
  const splitCheckout = checkOutDate.split(", "); // ["23", "Sunday", "March 2025"]
  const day2 = splitCheckout[0]; // "23"
  const month2 = splitCheckout[2].split(" ")[0].slice(0, 3); // "March" → "Mar"
  const resultCheckOutDate = `${month2} ${day2}`;

  // If same month, only display the month once + checkin day - checkout day  (Mar 23 - 28)
  if (month === month2) {
    await expect(page.getByTestId("little-search-anytime")).toHaveText(
      `Check-in / Checkout${resultCheckInDate}–${day2}`
    );
  }
  // If different month, display both months + checkin day - checkout day  (Mar 23 - Apr 28)
  else {
    await expect(page.getByTestId("little-search-anytime")).toHaveText(
      `Check-in / Checkout${resultCheckInDate}–${resultCheckOutDate}`
    );
  }

  await expect(page.getByTestId("little-search-guests")).toHaveText(
    "GuestsAdd guests"
  );
});
