// **Feature: Search Properties by Location, Date, Number of Guests, including Pet**

import { test, expect } from "@playwright/test";
// import { page } from "../gobal-setup.spec";

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

test("Search Properties by Location, Date, Number of Guests, including Pet", async ({
  page,
}) => {
  await page.goto("/");

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

  await expect(page.getByTestId("stays-page-heading")).toHaveText(
    new RegExp(`places in ${city}`, "i")
  );

  // Check if there is at least one property displayed
  const count = await page.locator('[data-testid="card-container"]').count();
  expect(count).toBeGreaterThan(0);

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
