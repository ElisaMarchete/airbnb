// **Feature: Search Properties by Location, Date, Number of Guests, including Pet**

import { test, expect } from "@playwright/test";

let city = "São Paulo";
let country = "Brazil";
let cityCountry = city + ", " + country;
let numberOfAdults = 4;
let numberOfChildren = 5;
let numberOfInfants = 1;
let numberOfPets = 1;
let totalGuests = numberOfAdults + numberOfChildren;

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

test("Search Properties by Location, Date, Number of Guests, including Pet", async ({
  page,
}) => {
  await page.goto("/");

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  // Check if the cookie banner is visible and accept cookies if it is
  await autoAcceptCookies(page);

  // Search for Kitchener, ON
  await page.fill('input[name="query"]', cityCountry);

  // Click the calendar
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

  // Increase adults to 4
  for (let i = 0; i < numberOfAdults; i++) {
    await page.getByTestId("stepper-adults-increase-button").click();
  }

  // Increase children to 5
  for (let i = 0; i < numberOfChildren; i++) {
    await page.getByTestId("stepper-children-increase-button").click();
  }

  // Increase infants to 1
  for (let i = 0; i < numberOfInfants; i++) {
    await page.getByTestId("stepper-infants-increase-button").click();
  }

  // Increase pets to 1
  for (let i = 0; i < numberOfPets; i++) {
    await page.getByTestId("stepper-pets-increase-button").click();
  }

  // Click the search button
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  // Check if the search results contain the location name added in the search
  const searchResults = page.locator('[data-testid="stays-page-heading"]');
  await expect(searchResults).toContainText(city);

  // Check how many properties cards are displayed in the first page
  await page.waitForSelector('[data-testid="card-container"]', {
    timeout: 20000,
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
    `Location${city}`
  );

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

  // Check the Guests field result
  await expect(page.getByTestId("little-search-guests")).toHaveText(
    `Guests${totalGuests} guests`
  );
});
