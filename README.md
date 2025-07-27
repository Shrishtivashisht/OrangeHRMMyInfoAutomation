# OrangeHRM MyInfo Automation – Playwright

This project automates the **"My Info"** module of the [OrangeHRM Demo App](https://opensource-demo.orangehrmlive.com/) using **Playwright** with **TypeScript**. It follows the **Page Object Model (POM)** and includes test cases for form validation, dependent management, file upload, and UI interactions.

---

## 🔧 Tech Stack

- Playwright
- TypeScript
- Node.js
- Page Object Model
- GitHub Actions (CI ready)
- HTML Reporting

---

## 📁 Project Structure

Playwright_OrangeHRM/
├── src/
│ ├── pages/ # Page Object classes
│ ├── tests/ # Test specs (TC1–TC11)
│ ├── data/ # Test data & config
│ └── utils/ # Common helper functions
├── playwright.config.ts # Playwright config
├── package.json
├── .gitignore
└── README.md


---

## ✅ Test Scenarios

- TC1: Verify "My Info" tab loads
- TC2: Validate required name field error
- TC3: Edit user name and verify update
- TC4: Ensure My Info sub-tabs have unique URLs
- TC5: Add a new dependent
- TC6: Show "Specify" only for "Other" relationship
- TC7: Edit an existing dependent
- TC8: Delete a dependent
- TC9: Upload PDF attachment
- TC11: Validate comment box length limit

---

## 🔌 Setup Instructions

```bash
# Clone the repo
git clone https://github.com/Shrishtivashisht/OrangeHRMMyInfoAutomation.git
cd OrangeHRMMyInfoAutomation/Playwright_OrangeHRM

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

🧪 Running Tests
bash
Copy
Edit
# Run all tests
npx playwright test

# Run specific test
npx playwright test src/tests/MyInfo_testcases/yaksha.spec.ts

# View HTML report
npx playwright show-report
