import { Page, Locator } from "@playwright/test";
import { test, expect } from "@playwright/test";
import { TestData } from "../Data/TestData";

export class DependentsPage {
  readonly page: Page;
  readonly infoPage: Locator;
  readonly dependentsTab: Locator;
  readonly addBtn: Locator;
  readonly nameInput: Locator;
  readonly relationshipDropdown: Locator;
  readonly specifyInput: Locator;
  readonly saveBtn: Locator;
  readonly rows: Locator;
  readonly AddFile: Locator;
  readonly Browse: Locator;
  readonly CommentBox: Locator;
  readonly myinfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.infoPage = page.locator('a:has-text("My Info")');
    this.dependentsTab = page.locator('a[href*="viewDependents"]');
    this.addBtn = page.getByRole("button", { name: /add/i }).first();
    this.nameInput = page.getByRole("textbox").nth(1);
    this.relationshipDropdown = page.locator(".oxd-select-text");
    this.saveBtn = page.getByRole("button", { name: /save/i });
    this.rows = page.locator(".orangehrm-horizontal-padding .oxd-table-row");
    this.specifyInput = page.getByRole("textbox").nth(2);
    this.AddFile = page.getByRole("button", { name: /add/i }).nth(1);
    this.Browse = page.getByText("Browse");
    this.CommentBox = page.getByRole("textbox", { name: "Type comment here" });
    this.myinfo = page.locator('a:has-text("My Info")');
  }

  async openTab() {
    await this.dependentsTab.click();
    await this.page.waitForTimeout(500);
  }

  // async countDependents(): Promise<number> {
  //   return await this.rows.count();
  // }
  async areMyInfoSubTabHrefsUnique(): Promise<boolean> {
    await this.page.waitForLoadState();
    await this.myinfo.click();
    await this.dependentsTab.click();

    const hrefElements = await this.page
      .locator("a.oxd-topbar-body-nav-tab-link")
      .all();
    const hrefs: string[] = [];

    for (const element of hrefElements) {
      const href = await element.getAttribute("href");
      if (href) {
        hrefs.push(href);
      }
    }
    const uniqueHrefs = new Set(hrefs);
    return uniqueHrefs.size === hrefs.length;
  }

  async addDependent(name: string, relation: string, otherSpecify?: string) {
    await this.myinfo.click();
    await this.dependentsTab.click();
    await this.addBtn.click();
    await this.nameInput.first().fill(name);
    await this.relationshipDropdown.click();
    await this.page
      .locator(`.oxd-select-dropdown div:has-text("${relation}")`)
      .click();
    if (relation === "Other" && otherSpecify) {
      await this.specifyInput.fill(otherSpecify);
    }
    await this.saveBtn.click();
  }

  async isSpecifyInputVisible(): Promise<boolean> {
    return await this.specifyInput.isVisible();
  }

  async selectOtherAndCheckSpecifyField(): Promise<boolean> {
    await this.infoPage.click();
    await this.dependentsTab.click();
    await this.addBtn.click();
    await this.relationshipDropdown.click();
    await this.page
      .locator(
        `.oxd-select-dropdown div:has-text("${TestData.specifyRelation}")`
      )
      .click();

    const isVisible = await this.isSpecifyInputVisible();

    if (isVisible) {
      console.log(
        '"Please specify" input field is visible when "Other" is selected'
      );
    } else {
      console.log('"Please specify" input field is NOT visible!');
    }

    return isVisible;
  }

  async editDependentNameFlow(): Promise<void> {
    const originalName = `Child_${Date.now()}`;

    await this.infoPage.click();
    await this.openTab();

    await this.addDependent(originalName, TestData.defaultDependentRelation);
    await this.page.waitForTimeout(3000);

    const editIcons = this.page.getByRole("button", { name: "" });
    const count = await editIcons.count();
    await editIcons.nth(count - 1).click();

    const updatedName = `UpdatedChild_${Date.now()}`;
    await this.updateDependentName(updatedName);
  }
  async isDependentNameVisible(name: string): Promise<boolean> {
    const nameCell = this.page.locator(`.oxd-table-cell:has-text("${name}")`);
    return await nameCell.isVisible();
  }

  async updateDependentName(newName: string) {
    await this.nameInput.first().fill("");
    await this.nameInput.first().fill(newName);
    await this.saveBtn.click();
  }

  async deleteDependentFlow() {
    await this.infoPage.click();
    await this.openTab();

    const nameToDelete = `DeleteChild_${Date.now()}`;
    await this.addDependent(nameToDelete, TestData.defaultDependentRelation);
    await this.page.waitForTimeout(2000); // Optional: wait for UI update

    const deleteIcons = this.page.getByRole("button", { name: /delete/i });
    const count = await deleteIcons.count();
    const isVisible = await this.isDependentNameVisible(nameToDelete);
    expect(isVisible).toBeFalsy();
  }

  async UploadAttachmentInDependent(filePath: string) {
    await this.infoPage.click();
    await this.openTab();
    await this.AddFile.click();
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    await this.page.getByRole("button", { name: /save/i }).click();
  }

  async CommentBarInputLimit() {
    await this.infoPage.click();
    await this.openTab();
    await this.AddFile.click();
    const longText = "A".repeat(250);
    await this.CommentBox.fill(longText);

    const inputValue = await this.CommentBox.inputValue();
    console.log(`Entered characters: ${inputValue.length}`);
    const errorMessage = this.page.locator(
      "span.oxd-input-field-error-message"
    );
    await expect(errorMessage).toHaveText("Should not exceed 200 characters");

    console.log("Error message 'Should not exceed 200 characters' is visible.");
  }
}
