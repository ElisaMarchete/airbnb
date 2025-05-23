# 🏡 Non-Official Customer Airbnb Testing Repository

This repository showcases my **QA software testing skills** through **manual and automated testing** of Airbnb's search functionality. It includes:

✅ **Manual Testing on BrowserStack** – A test plan is created with clear test cases, and the test run is documented with the results.  
✅ **Bug Reporting in GitHub Issues** – Bug logged for failed test, including issue description, reproduction steps, the expected outcome, details about the testing environment and application version, and screenshot for visual reference.  
✅ **Automated Testing with Playwright** – Automated scripts to validate the search functionality.

## 📂 Repository Structure

### 1️⃣ Manual Testing on BrowserStack

🔹 **Test Run** – **👉 [Click to View Test Run](https://test-management.browserstack.com/projects/1510499/test-runs/TR-17?public_token=46dff9857a2a955d07d36534835abc8c1da7ceaf647dae9a97fd2d24152bace1d846da46f62c5ada0d9c3fb8d9f91ed8f04110a9849ddc73d00319246d4f0099&public_token_id=3144)**

![Test Run](./img/TestRunReport.PNG)

### 2️⃣ Bug Reports

📌 **Bug logged for failed test (TC-110)** – **👉 [Click to View GitHub Issue](https://github.com/ElisaMarchete/airbnb/issues/1)**

![Bug Report](./img/Bug.PNG)

### 3️⃣ Automated Testing with Playwright

💻 Playwright test scripts for automated functional and visual validation to ensure the application's search functionality works correctly and looks as expected.

![Playwright](./img/Playwright.PNG)

## 🎥 Portfolio Playwright Demo

## Test Status (as of May 2025)

The tests are passing in May 2025. Refer to the videos below for a visual reference.

> **Note:** Test results may vary if Airbnb’s interface has been updated since this recording.

🎬 **Airbnb Search | Playwright Automation Test Execution (TC-100, TC-101, TC-106, Headed Mode) – May 2025**  
**👉 [Click to View Demo](https://www.loom.com/share/b35e76e236e94ddea759d78490a86d3c?sid=1be6f47f-873f-4d9b-bd77-af5680e3d2bf)**

🎬 **Airbnb Search | Playwright Automation Test Execution (All Tests, Headless Mode) – May 2025**  
**👉 [Click to View Demo](https://www.loom.com/share/2b272fca72974e9a80e29a32d3eeed34?sid=aee39523-a4b1-4aa6-901a-ae1383cf0608)**  


## 🚀 Running Playwright Tests

### Prerequisites

Ensure you have **Node.js (LTS version)** installed. You can download it from [nodejs.org](https://nodejs.org/).

1️⃣ **Clone this repository and navigate to test folder:**

```bash
git clone <https://github.com/ElisaMarchete/airbnb.git>
```

```bash
cd airbnb
```

2️⃣ **Install dependencies:**

```bash
npm install
```

```bash
npx playwright install
```

3️⃣ **Run Playwright tests:**

```bash
npx playwright test
```

4️⃣ **View the Report:**

```bash
npx playwright show-report
```

## 🎯 About This Project

This project is part of my QA portfolio, demonstrating my ability to perform end-to-end testing, report defects, and implement test automation.
