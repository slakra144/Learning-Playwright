class LoginPage{
    constructor(page)
    {
        this.page = page
        this.signInBtn = page.locator("[value='Login']");
        this.email = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
    }

    async goTo(){
        await this.page.goto("https://rahulshettyacademy.com/client");
    }

    async validLogin(email, password){
        await this.email.fill(email);
        await this.password.type(password);
        await this.signInBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports={
    LoginPage
};