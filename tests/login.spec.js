const { LoginPage } = require('../Pageobjects/LoginPage');
const userdata = require('../utils/userdata.json');
const { test, expect } = require('@playwright/test');

test('login form', async ({ page }) => {
   const login = new LoginPage(page);
    await login.goto();
    await login.login(userdata.username, userdata.password);
    await expect(page).toHaveURL(userdata.ExpectedUrl);
});