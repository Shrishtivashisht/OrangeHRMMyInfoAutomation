import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { MyInfoPage } from "../../pages/MyInfoPage";
import { DependentsPage } from "../../pages/DependentsPage";
import { TestData } from "../../Data/Config";

test.describe("Yaksha", () => {
  let loginPage: LoginPage;
  let myinfoPage: MyInfoPage;
  let dependentsPage: DependentsPage;

  test.beforeEach(async ({ page }) => {
    await page.goto(TestData.loginURL);
    loginPage = new LoginPage(page);
    myinfoPage = new MyInfoPage(page);
    dependentsPage = new DependentsPage(page);
    await loginPage.performLogin();
  });

  // Verify the 'My Info' tab Loads Successfully
  // Steps:
  //   1. Login using valid credentials
  // 2. Click on "My Info" tab
  // Expected Result:
  // Verify the My Info tab loads successfully
  // test("TC1 - Verify My Info tab Loads", async () => {
  //   await myinfoPage.clickMyInfoTab();
  //   await expect(
  //     myinfoPage.page.getByRole("link", { name: "My Info" })
  //   ).toBeVisible();
  // });
  test("TC1 - Verify My Info tab Loads", async () => {
    await myinfoPage.clickMyInfoTab();
    const tab = myinfoPage.page.getByRole("link", { name: "My Info" });
    await expect(tab).toBeVisible();
  });

  //   Verify the 'Required' field error Message is displayed on leaving name field blank
  //   Steps:
  //   1. Login using valid credentials
  // 2. Click on "My Info" tab
  // 3. Clear the name present in the name inputbar
  //   Expected:
  //   Required' field error message should be displayed
  test("TC2 - Verify required field error on blank name", async () => {
    const nameValue = await myinfoPage.clearAndEnterName("");
    expect(nameValue).toBe("");
  });

  //   Verify the name gets edited successfully
  //   Steps:
  //   1. Login using valid credentials
  // 2. Click on "My Info" tab
  // 3. Clear the name present in the name inputbar
  // 4. Enter the new name and hit save button
  // 5. Hit refresh
  //   Expected:
  //   Verify the name gets updated in the top right corner
  test("TC3 - Verify name gets edited", async () => {
    await myinfoPage.updateUniqueNAmeAndVerifyName();
    const updatedName = await myinfoPage.updateUniqueNAmeAndVerifyName();
    expect(updatedName).toContain("TestUser_");
  });

  //   Verify the 'My Info' tab's subtabs have unique URL
  //   Steps:
  //   1. Login using valid credentials
  // 2. Click on "My Info" tab
  // 3. Click on top 3 items from the sidebar('personal details',contact details,emergency contact')
  // Expected:
  //   Veriffy the url from the three is unique
  test("TC4 - Verify all My Info sub-tabs have unique hrefs", async () => {
    const areUnique = await dependentsPage.areMyInfoSubTabHrefsUnique();
    expect(areUnique).toBeTruthy();
  });

  //   Verify new Dependant could be added to the list
  //   Steps:
  //   1. Login using valid credentials
  // 2. Click on "My Info" tab
  // 3. Navigate to 'Dependents' subtab
  // 4. Fill name ,select 'child' from relationship and hit save button
  //   Expected:
  //   Verify the presence of the child in the list
  test("TC5 - Add a new dependent", async () => {
    const name = `Child_${Date.now()}`;
    await dependentsPage.addDependent(name, TestData.defaultDependentRelation);
    const dependentEntry = dependentsPage.page.locator(
      `.orangehrm-container:has-text("${name}")`
    );
    await expect(dependentEntry).toBeVisible();
  });

  //   Verify new Dependant 'Specify' inputbar only displays when 'Other' option is selected from the relationship dropdown
  //   Steps:
  //   1. Login using valid credentials
  // 2. Click on "My Info" tab
  // 3. Navigate to 'Dependents' subtab
  // 4. Fill name ,select 'other' from relationship
  // 5. enter the name of other relationship
  //   Expected:
  //   Verify the specify inputbar is not prsent before entering the other in relationship inputbar
  test("TC6 - Show 'Specify' field only when 'Other' is selected", async () => {
    const isSpecifyVisible =
      await dependentsPage.selectOtherAndCheckSpecifyField();
    expect(isSpecifyVisible).toBeTruthy();
  });

  //   Verify the dependants could be edited from the list
  //   Steps:
  //   1. Login using valid credentials
  // 2. Click on "My Info" tab
  // 3. Navigate to 'Dependents' subtab
  // 4. Create a new dependant using porevious steps
  // 5. click the edit icon and change the name of the
  //   Expected:
  //   Verify the dependant details get updated
  test("TC7 - Edit existing dependent name", async () => {
    await dependentsPage.editDependentNameFlow();
  });

  // Verify the dependants could be deleted from the list
  //   Steps:
  //   1. Login using valid credentials
  // 2. Click on "My Info" tab
  // 3. Navigate to 'Dependents' subtab
  // 4. Create a new dependant using porevious steps
  // 5. click the delete icon and verify the candidate gets deleted from the list
  //   Expected:
  //   Verify the dependant details get deleted
  test("TC8 - Delete existing dependent", async () => {
    await dependentsPage.deleteDependentFlow();
  });

  //   Verify the sample pdf file could be uploaded in the attachments
  //   Steps:
  //   1. Login using valid credentials
  // 2. Click on "My Info" tab
  // 3. Navigate to 'Dependents' subtab
  // 4. Click on 'Add' Attachments button
  // 5. Browse the pdf from the device
  // 6. Click save button
  //   Expected:
  //   Verify the pdf gets uploaded
  test("TC9 - Upload dependent attachment", async () => {
    await dependentsPage.UploadAttachmentInDependent(TestData.fileToUpload);
  });

  //   Verify the Comment inputbar has limit on length
  //   Steps:
  //   1. Login using valid credentials
  // 2. Click on "My Info" tab
  // 3. Navigate to 'Dependents' subtab
  // 4. Click on 'Add' Attachments button
  // 5. Click Comments inputbar and add really long text
  //   Expected:
  //   verify the 'Should not exceed 200 characters' is displayed
  test("TC11 - Verify comment box shows 'Should not exceed 200 characters' when input is too long", async () => {
    await dependentsPage.CommentBarInputLimit();
  });
});
