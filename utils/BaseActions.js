const { expect } = require('@playwright/test');

class BaseActions {
  constructor(page) {
    this.page = page;
  }

  async checkerrorMessage(locator, expectedMessage) {
    const errorEl = this.page.locator(locator);
    await expect(errorEl).toBeVisible({ timeout: 8000 });
    await expect(errorEl).toHaveText(expectedMessage);
  }

  async fillAndVerify(locator, value) {
    await locator.click();
    await locator.fill(value);
    await expect(locator).toHaveValue(value);
  }

  async fillOrVerify(locator, value, mode) {
    if (mode === 'create' || mode === 'edit') {
      await locator.click();
      await locator.fill(value);
      await expect(locator).toHaveValue(value);
    } else {
      await expect(locator).toHaveValue(value);
    }
  }
  async addTags(inputSelector, tags) {
  const input = this.page.locator(inputSelector);
  
  for (const tag of tags) {
    await input.fill(tag);
    await input.press('Enter');
    await this.page.waitForTimeout(300);
  }
}
async removeTag(tagText) {
  // Click the X button next to the tag
  await this.page.locator(`text=${tagText} >> .. >> button`).first().click();
  await this.page.waitForTimeout(300);
}
async verifyTagExists(tagText) {
  await expect(this.page.locator(`text=${tagText}`).first()).toBeVisible();
}

  async selectOrVerifyDropdown1(label, value, mode = 'create', index = 0) {
   
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(500);
    
    
    const allComboboxes = this.page.getByRole('combobox');
    const matchingComboboxes = allComboboxes.filter({ hasText: label });
    
    
    const dropdown = matchingComboboxes.nth(index);
    await dropdown.waitFor({ state: 'visible', timeout: 15000 });
    
   
    const selectedValue = dropdown.locator('[data-slot="select-value"]').first();
    
    if (mode === 'create' || mode === 'edit') {
      
      await dropdown.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(300);
      
      await dropdown.click({ force: true });
      await this.page.waitForTimeout(800);
      await this.page.waitForSelector('[role="option"]', { state: 'visible', timeout: 10000 });

      const option = this.page.getByRole('option', { name: value, exact: true });
      await option.waitFor({ state: 'visible', timeout: 5000 });
      await option.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(200);
      await option.click();
      await this.page.waitForTimeout(500);
      
     
    } else {
      
      await expect(selectedValue).toHaveText(value, { timeout: 5000 });
    }
  }

  async selectDropdownOption(filterText, optionText) {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(500);
    
    const dropdown = this.page.getByRole('combobox').filter({ hasText: filterText }).first();
    await dropdown.waitFor({ state: 'visible', timeout: 10000 });
    await dropdown.scrollIntoViewIfNeeded();
    await dropdown.click({ force: true });
    await this.page.waitForTimeout(800);
    
    const option = this.page.getByRole('option', { name: optionText });
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.scrollIntoViewIfNeeded();
    await option.click();
    await this.page.waitForTimeout(500);
  }

  async clickButtonByText(buttonText) {
    const button = this.page.getByRole('button', { name: buttonText });
    //await button.waitFor(1000);
    //await button.scrollIntoViewIfNeeded();
    await button.click();
  }

  async switchLanguage(language) {
  try {
    const currentLangButton = this.page.getByRole('button', { name: /Language/ });
    await currentLangButton.click({ timeout: 10000 });
    await this.page.waitForSelector('[role="menuitem"]', { state: 'visible', timeout: 10000 });
    await this.page.getByRole('menuitem', { name: new RegExp(language) }).click();
    await this.page.waitForTimeout(1000);
  } catch (error) {
    console.error(`Failed to switch to ${language}:`, error.message);
    throw error;
  }
}

  async verifyRowVisible(text, timeout = 30000) {
    await expect(this.page.locator('tbody tr').filter({ hasText: text })).toBeVisible({ timeout });
  }

  async verifyRowNotExists(text) {
    await expect(this.page.locator('tbody tr').filter({ hasText: text })).toHaveCount(0);
  }

  async editRow(searchText) {
    const row = this.page.locator('tbody tr').filter({ hasText: searchText });
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await row.locator('button:has(svg.lucide-pencil)').click();
    await this.page.waitForTimeout(500);
  }
 async back() {
  await this.page.locator('button:has(svg.lucide-arrow-left)').click();
  await this.page.waitForTimeout(500);
}
async checkdupmsg(error, forclick) {
    const duplicateDialog = this.page.getByText(error);

   if (await duplicateDialog.isVisible()) {
   await this.page.getByRole('button', { name: forclick }).click();
   await this.page.waitForTimeout(500);
  } 
   }
async deleteRows(searchText, timeout = 30000) {
  let rows = this.page.locator('tbody tr').filter({ hasText: searchText });
   await this.page.waitForTimeout(500)

 
  while (await rows.count() > 0) {
    const firstRow = rows.first();

    await firstRow.waitFor({ state: 'visible', timeout });
    await firstRow.locator('button:has(svg.lucide-ban)').click({ timeout });
    await this.page.waitForTimeout(1000);

    await this.clickButtonByText('Delete');
    await this.page.waitForTimeout(1000);

    
    rows = this.page.locator('tbody tr').filter({ hasText: searchText });
  }
}


  async viewRow(searchText, timeout = 30000) {
    const row = this.page.locator('tbody tr').filter({ hasText: searchText });
    await row.waitFor({ state: 'visible', timeout });
    await row.locator('button:has(svg.lucide-eye)').click({ timeout });
    await this.page.waitForTimeout(500);
  }

  async selectOrVerifyDropdown(label, value, mode = 'create', index = 0) {
  
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForTimeout(500);
  
  let dropdown;
  
  
  const allComboboxes = this.page.getByRole('combobox');
  const matchingComboboxes = allComboboxes.filter({ hasText: label });
  const count = await matchingComboboxes.count();
  
  if (count > 0) {
    
    dropdown = matchingComboboxes.nth(index);
  } else {
   
    const xpath = `(//select[@role='combobox'] | //button[@role='combobox'] | //*[@role='combobox'])[
      preceding::label[contains(text(), '${label}')] or 
      @aria-label='${label}' or 
      ancestor::div[.//label[contains(text(), '${label}')]]
    ][${index + 1}]`;
    
    dropdown = this.page.locator(xpath).first();
  }
  
 
  await dropdown.waitFor({ state: 'visible', timeout: 15000 });
  

  const selectedValue = dropdown.locator('[data-slot="select-value"]').first();
  
  if (mode === 'create' || mode === 'edit') {
    
    await dropdown.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    
    
    await dropdown.click({ force: true });
    await this.page.waitForTimeout(800);
    
   
    await this.page.waitForSelector('[role="option"]', { state: 'visible', timeout: 10000 });
    
    
    const option = this.page.getByRole('option', { name: value, exact: true });
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(200);
    await option.click();
    await this.page.waitForTimeout(500);
    
  
  } else {
    
    await expect(selectedValue).toHaveText(value, { timeout: 5000 });
  }
}


async selectOrVerifyDropdownByXPath(xpath, value, mode = 'create') {
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForTimeout(500);
  
  const dropdown = this.page.locator(xpath);
  await dropdown.waitFor({ state: 'visible', timeout: 15000 });
  
  const selectedValue = dropdown.locator('[data-slot="select-value"]').first();
  
  if (mode === 'create' || mode === 'edit') {
    await dropdown.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    await dropdown.click({ force: true });
    await this.page.waitForTimeout(800);
    
    await this.page.waitForSelector('[role="option"]', { state: 'visible', timeout: 10000 });
    
    const option = this.page.getByRole('option', { name: value, exact: true });
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(200);
    await option.click();
    await this.page.waitForTimeout(500);
  } else {
    await expect(selectedValue).toHaveText(value, { timeout: 5000 });
  }
}
}

module.exports = { BaseActions };