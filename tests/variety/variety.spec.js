const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../Pageobjects/LoginPage');
const { VarietyPage } = require('../../Pageobjects/VarietyPage');
const userdata = require('../../utils/userdata.json');
const {create,editEnglish,editHindi,editTamil} = require('../../utils/varietydata.json');

test.describe('Variety Tests', () => {
  let varietyPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(280000);
    const login = new LoginPage(page);
    await login.goto();
    await login.login(userdata.username, userdata.password);
    await expect(page).toHaveURL(userdata.ExpectedUrl);
    varietyPage = new VarietyPage(page);
    await varietyPage.navigateToVariety();
  });

  test('Complete Variety Workflow - Create, View, Edit in Multiple Languages, and Delete', async () => {
   
    await varietyPage.createVariety(create);
    await varietyPage.testCase1(create);
     await varietyPage.viewVarietyDetails(create);
    await varietyPage.editVariety(create.Name,editEnglish);
    await varietyPage.updateVarietyInLanguage(editEnglish.Name, editHindi);
    await varietyPage.updateVarietyInLanguage(editEnglish.Name, editTamil);
    await varietyPage.deleteRow(editEnglish.Name);
    await varietyPage.verifyRowNotExists(editEnglish.Name);
  });
});