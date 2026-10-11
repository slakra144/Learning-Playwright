const {test, expect} = require('@playwright/test');
class CheckoutPage{
    constructor(page){
        this.page = page;
        this.shippingInfoCountry = page.locator("[placeholder*='Country']");
        this.shippingInfoCountryDropdownOptions = page.locator('section.ta-results');
        this.shippingInfoEmail = page.locator(".user__name [type='text']");
        this.placeOrder = page.locator(".action__submit")
        this.orderConfirmationText = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
    }

    async selectShippingCountry(keyword, country){
        await this.shippingInfoCountry.pressSequentially(keyword,{delay:150});
        const dropdown = this.shippingInfoCountryDropdownOptions
        await dropdown.waitFor();
        const optionsCount = await dropdown.locator("button").count();
        for(let i = 0; i<optionsCount; i++){
            const text = await dropdown.locator("button").nth(i).textContent();
            if(text.trim() === country){
                await dropdown.locator("button").nth(i).click();
                break;
            }
        }
    }

    async validateShippingEmail(email){
        await expect(this.shippingInfoEmail.first()).toHaveText(email);
    }


    async SubmitAndGetOrderId()
    {
        await this.placeOrder.click();
        await expect(this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
        return await this.orderId.textContent();
    }
}

module.exports = {
    CheckoutPage
}