const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../Pageobjects/LoginPage');
const { CategoryPage } = require('../../Pageobjects/CategoryPage');
const userdata = require('../../utils/userdata.json');
const {create,editEnglish,editHindi,editTamil}= require('../../utils/category.json');

test.describe('Category Tests', () => {
  let categoryPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000);
    const login = new LoginPage(page);
    await login.goto();
    await login.login(userdata.username, userdata.password);
    await expect(page).toHaveURL(userdata.ExpectedUrl);
    categoryPage = new CategoryPage(page);
    await categoryPage.navigateToCategory();
  });

  test('Complete Category Workflow - Create, View, Edit in Multiple Languages, and Delete', async () => {

    await categoryPage.create(create);
    await categoryPage.testCase1(create);
    //await categoryPage.view(create);
    await categoryPage.edit(create.Name,editEnglish);
    //await categoryPage.view(editEnglish);
    await categoryPage.updateInLanguage(editEnglish.Name,editHindi);
    await categoryPage.updateInLanguage(editEnglish.Name,editTamil);
    await categoryPage.findduplicatemessage(editEnglish,editHindi,editTamil);
    await categoryPage.deleteRows(editEnglish.Name);
    await categoryPage.verifyRowNotExists(editEnglish.Name);

  });
});
