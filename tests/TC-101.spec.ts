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
const checkOutDate = formatDate(25); // Add 25 days

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

async function checkInSelectDate(page, checkInDate) {
  try {
    await page
      .getByRole("button", { name: "Check in Add dates" })
      .click({ timeout: 2000 });
    const checkInDateButton = page.getByRole("button", {
      name: new RegExp(`${checkInDate}`, "i"),
    });
    await checkInDateButton.click();
  } catch {
    // Reopen the calendar
    await page.getByTestId("little-search-date").click();

    let clicked = false;
    for (let i = 0; i < 5; i++) {
      try {
        // Open the check-in calendar
        const checkInCalendar = page.getByRole("button", {
          name: "Check in Add dates",
        });
        await checkInCalendar.click();

        // Ensure calendar UI is visible before proceeding
        await page
          .getByRole("application", { name: "Calendar" })
          .waitFor({ state: "visible", timeout: 5000 });

        // Locate the check-in date button
        const checkInDateButton = page.getByRole("button", {
          name: new RegExp(`${checkInDate}`, "i"),
        });

        // Wait to allow the date to render
        await page.waitForTimeout(1000);

        if (await checkInDateButton.isVisible({ timeout: 2000 })) {
          await checkInDateButton.click();
          clicked = true;
          break;
        }
      } catch {
        // Wait before retrying
        await page.waitForTimeout(500);
      }
    }

    if (!clicked) {
      throw new Error(`Failed to click check-in date: ${checkInDate}`);
    }
  }
}

async function checkoutSelectDate(page, checkOutDate) {
  try {
    await page
      .getByRole("button", { name: new RegExp(`${checkOutDate}`, "i") })
      .click({ timeout: 2000 });
  } catch {
    // Reopen the calendar
    await page.getByTestId("little-search-date").click();

    let clicked = false;
    for (let i = 0; i < 5; i++) {
      try {
        // Open the checkout calendar
        const checkOutCalendar = page.getByRole("button", {
          name: "Check out Add dates",
        });
        await checkOutCalendar.click();

        // Ensure calendar UI is visible before proceeding
        await page
          .getByRole("application", { name: "Calendar" })
          .waitFor({ state: "visible", timeout: 5000 });

        // Locate the checkout date button
        const checkoutDateButton = page.getByRole("button", {
          name: new RegExp(`${checkOutDate}`, "i"),
        });

        // Wait to allow the date to render
        await page.waitForTimeout(1000);

        if (await checkoutDateButton.isVisible({ timeout: 2000 })) {
          await checkoutDateButton.click();
          clicked = true;
          break;
        }
      } catch {
        // Wait before retrying
        await page.waitForTimeout(500);
      }
    }

    if (!clicked) {
      throw new Error(`Failed to click checkout date: ${checkOutDate}`);
    }
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

  // Select Check-in and Check-out dates in the calendar
  await checkInSelectDate(page, checkInDate);
  await checkoutSelectDate(page, checkOutDate);

  // Click on the Who (Add Guests) field
  let guestsButton = page.getByRole("button", { name: "Who Add guests" });
  await guestsButton.click();

  let adultsButton = page
    .getByTestId("search-block-filter-stepper-row-adults")
    .first();
  await expect(adultsButton).toBeVisible();

  let childrenButton = page
    .getByTestId("search-block-filter-stepper-row-children")
    .first();
  await expect(childrenButton).toBeVisible();

  let infantsButton = page
    .getByTestId("search-block-filter-stepper-row-infants")
    .first();
  await expect(infantsButton).toBeVisible();

  let petsButton = page
    .getByTestId("search-block-filter-stepper-row-pets")
    .first();
  await expect(petsButton).toBeVisible();

  let serviceAnimalButton = page.getByRole("button", {
    name: "Bringing a service animal?",
  });
  await expect(serviceAnimalButton).toBeVisible();

  // Increase adults to 4
  let addAdultButton = page
    .getByTestId("stepper-adults-increase-button")
    .first();
  for (let i = 0; i < numberOfAdults; i++) {
    await addAdultButton.click();
    await page.waitForTimeout(200);
  }

  // Increase children to 5
  let addChildrenButton = page
    .getByTestId("stepper-children-increase-button")
    .first();
  for (let i = 0; i < numberOfChildren; i++) {
    await addChildrenButton.click();
    await page.waitForTimeout(200);
  }

  // Increase infants to 1
  let addInfantsButton = page
    .getByTestId("stepper-infants-increase-button")
    .first();
  for (let i = 0; i < numberOfInfants; i++) {
    await addInfantsButton.click();
  }

  // Increase pets to 1
  let addPetsButton = page.getByTestId("stepper-pets-increase-button").first();
  for (let i = 0; i < numberOfPets; i++) {
    await addPetsButton.click();
  }

  // click search button
  let searchButton = page.getByTestId("structured-search-input-search-button");
  // await searchButton.scrollIntoViewIfNeeded();
  await searchButton.click();

  // Wait for the page DOM to load completely
  await page.waitForLoadState("domcontentloaded");

  // Accept cookies if the cookie banner appears
  await autoAcceptCookies(page);

  // Check if the search results contain the location name added in the search
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
    `Guests${totalGuests} guests`
  );
});
