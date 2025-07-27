import { Page, expect, Locator } from "@playwright/test";

export class MyInfoPage {
  readonly page: Page;
  readonly myInfoTab: Locator;
  readonly nameField: Locator;
  readonly saveButton: Locator;
  readonly profileDropdown: Locator;
  readonly subTabLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myInfoTab = page.locator('a:has-text("My Info")');
    this.nameField = page.locator('input[name="firstName"]');
    this.saveButton = page.locator("form:has-text('Employee') button").first();
    this.profileDropdown = page.locator(".oxd-userdropdown-name");
    this.subTabLinks = page.locator(".orangehrm-tabs > div > a");
  }

  async clickMyInfoTab() {
    await this.myInfoTab.click();
  }

  async clearAndEnterName(name: string): Promise<string> {
    await this.clickMyInfoTab();
    await this.nameField.click();
    await this.nameField.clear();
    await this.nameField.fill("");
    return await this.nameField.inputValue();
  }

  async updateUniqueNAmeAndVerifyName(): Promise<string> {
    await this.clickMyInfoTab();
    await this.nameField.click();
    await this.nameField.clear();
    await this.nameField.fill("");
    const newName = `TestUser_${Math.floor(Math.random() * 10000)}`;
    await this.nameField.fill(newName);
    await this.saveButton.click();
    await this.page.reload();

    const displayedProfileName = await this.getDisplayedProfileName();
    return displayedProfileName;
  }

  async getDisplayedProfileName(): Promise<string> {
    return await this.profileDropdown.innerText();
  }

  async getSubTabHrefs(): Promise<string[]> {
    const count = await this.subTabLinks.count();
    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await this.subTabLinks.nth(i).getAttribute("href");
      if (href) hrefs.push(href);
    }
    return hrefs;
  }
}
