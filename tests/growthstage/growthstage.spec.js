const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../Pageobjects/LoginPage');
const { GrowthStagePage } = require('../../Pageobjects/GrowthStagePage');
const userdata = require('../../utils/userdata.json');
const {create,editEnglish,editHindi,editTamil}= require('../../utils/cropgrowthstage.json');

test.describe('Growth Stage Tests', () => {
  let growthStagePage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000);
    const login = new LoginPage(page);
    await login.goto();
    await login.login(userdata.username, userdata.password);
    await expect(page).toHaveURL(userdata.ExpectedUrl);
    growthStagePage = new GrowthStagePage(page);
    await growthStagePage.navigateToGrowthStage();
  });

  test('Complete Growth Stage Workflow - Create, View, Edit in Multiple Languages, and Delete', async () => {
    
    await growthStagePage.create(create);
    await growthStagePage.testCase1(create);
    await growthStagePage.view(create);
    await growthStagePage.edit(create.Name,editEnglish);
    await growthStagePage.view(editEnglish);
    await growthStagePage.updateInLanguage(editEnglish.Name,editHindi);
    await growthStagePage.updateInLanguage(editEnglish.Name,editTamil);
    await growthStagePage.findduplicatemessage(editEnglish,editHindi,editTamil);
    await growthStagePage.deleteRows(editEnglish.Name);
    await growthStagePage.verifyRowNotExists(editEnglish.Name);

  });
});
