// **Feature: Search Properties by Location and Date**

import { test, expect } from "@playwright/test";

let city = "São Paulo";
let country = "Brazil";
let cityCountry = city + ", " + country;

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
const checkOutDate = formatDate(30); // Add 30 days

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

test("Search Properties by Location and Date", async ({ page }) => {
  await page.goto("/");

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");
  // If the cookie banner appears, accept cookies automatically
  await autoAcceptCookies(page);

  // Search adding a location
  await page.fill('input[name="query"]', cityCountry);

  // Click calendar check-in
  const checkInCalendar = page.getByRole("button", {
    name: "Check in Add dates",
  });
  await checkInCalendar.click();

  await page
    .getByRole("button", { name: new RegExp(`${checkInDate}`, "i") })
    .click();

  // Try to click check-out directly
  try {
    await page
      .getByRole("button", { name: new RegExp(`${checkOutDate}`, "i") })
      .click({ timeout: 2000 });
  } catch {
    // Reopen the calendar
    await page.getByTestId("little-search-date").click();

    // Ensure calendar UI is visible before proceeding
    await page
      .getByRole("application", { name: "Calendar" })
      .waitFor({ state: "visible", timeout: 5000 });

    // Click the checkout calendar button (to avoid overwriting check-in)
    const checkOutCalendar = page.getByRole("button", {
      name: "Check out Add dates",
    });
    await checkOutCalendar.click();

    // Click the check-out date
    await page
      .getByRole("button", { name: new RegExp(`${checkOutDate}`, "i") })
      .click();
  }

  // click search button
  let searchButton = page.getByTestId("structured-search-input-search-button");
  await searchButton.scrollIntoViewIfNeeded();
  await searchButton.click();

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  // Accept cookies if the cookie banner appears
  await autoAcceptCookies(page);

  // Check if the search results contain the Location name added in the search
  const searchResults = page.locator('[data-testid="stays-page-heading"]');
  await expect(searchResults).toContainText(city);

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

  // Check the place field result
  await expect(page.getByTestId("little-search-location")).toHaveText(
    `LocationHomes in ${city}`
  );

  // Check the date field result
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
    await expect(page.getByTestId("little-search-date")).toHaveText(
      `Check-in / Checkout${resultCheckInDate}–${day2}`
    );
  }
  // If different month, display both months + checkin day - checkout day  (Mar 23 - Apr 28)
  else {
    await expect(page.getByTestId("little-search-date")).toHaveText(
      `Check-in / Checkout${resultCheckInDate}–${resultCheckOutDate}`
    );
  }

  // Check the Guests field result
  await expect(page.getByTestId("little-search-guests")).toHaveText(
    "GuestsAdd guests"
  );
});
