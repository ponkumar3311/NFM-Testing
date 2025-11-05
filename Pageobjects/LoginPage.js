import userdata from "../testdata/userdata.json";
class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator("input[id='email']");
        this.passwordInput = page.locator("input[id='password']");
        this.loginButton = page.locator("//*[@id='root']/div/div/div[2]/form/div[4]/button");
    }
    async goto() {
        await this.page.goto(userdata.loginUrl);
    }

    async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
}

}
module.exports = {LoginPage};