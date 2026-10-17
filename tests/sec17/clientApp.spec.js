const {test, expect} = require('@playwright/test');
const {POManager} = require("../../pageobjects/POManager");
const {customDDT} = require("../../test-data/test-data-fixture");

//Json => String => JS Object 
const dataset = JSON.parse(JSON.stringify(require("../../test-data/placeOrderTestData.json")));

for(const data of dataset){
    test(`Client App Place Order ${data.productName}`, async ({page})=>{ //need to parameterize testname otherwise will throw error
        //js file- Login js, DashboardPage
        const keyword = "ind"
        const country = "India"

        const base = new POManager(page);


        const loginPage = base.getLoginPage();
        await loginPage.goTo();
        await loginPage.validLogin(data.username,data.password);

        const dashboardPage = base.getDashboardPage();
        await dashboardPage.addProductToCart(data.productName);
        await dashboardPage.navigateToCartPage();

        const cartPage = base.getCartPage();
        await cartPage.validateIsItemAdded(data.productName);
        await cartPage.navigateToCheckoutPage();

        const checkoutPage = base.getCheckoutPage();
        await checkoutPage.selectShippingCountry(keyword,country);
        await checkoutPage.validateShippingEmail(data.username);
        const orderId = await checkoutPage.SubmitAndGetOrderId();
        console.log(orderId);
        await dashboardPage.navigateToOrders();

        const ordersHistoryPage = base.getOrdersHistoryPage();
        await ordersHistoryPage.searchOrderAndSelect(orderId);
        expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
        
    })
}

customDDT(`Client App Place Order`, async ({page,testDataForOrder})=>{         
        const base = new POManager(page);

        const loginPage = base.getLoginPage();
        await loginPage.goTo();
        await loginPage.validLogin(testDataForOrder.username,testDataForOrder.password);

        const dashboardPage = base.getDashboardPage();
        await dashboardPage.addProductToCart(testDataForOrder.productName);
        await dashboardPage.navigateToCartPage();

        const cartPage = base.getCartPage();
        await cartPage.validateIsItemAdded(testDataForOrder.productName);
        await cartPage.navigateToCheckoutPage();
})
