const {test, expect} = require('@playwright/test');
class CartPage{
    constructor(page){
        this.page = page;
        this.cartList = page.locator("div li");
        this.checkOutBtn = page.locator("text=Checkout");
    }

    async validateIsItemAdded(productName){
        await this.cartList.first().waitFor();
        const checkAvail = await this.getProductLocator(productName).isVisible(); // important psuedo class    
        expect(checkAvail).toBeTruthy();

    }

    getProductLocator(productName){
        return this.page.locator("h3:has-text('"+productName+"')")
    }

    async navigateToCheckoutPage(){
        await this.checkOutBtn.click();
    }
}

module.exports={
    CartPage
}