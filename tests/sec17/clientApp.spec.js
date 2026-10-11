const {test, expect} = require('@playwright/test');
const {POManager} = require("../../pageobjects/POManager");

test('Client App login', async ({page})=>{
    //js file- Login js, DashboardPage
    const email = "betty145@gmail.com";
    const password = "Test_1234";
    const productName = 'iphone 13 pro'; //dont change it randomly
    const keyword = "ind"
    const country = "India"

    const base = new POManager(page);


    const loginPage = base.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(email,password);

    const dashboardPage = base.getDashboardPage();
    await dashboardPage.addProductToCart(productName);
    await dashboardPage.navigateToCartPage();

    const cartPage = base.getCartPage();
    await cartPage.validateIsItemAdded(productName);
    await cartPage.navigateToCheckoutPage();

    const checkoutPage = base.getCheckoutPage();
    await checkoutPage.selectShippingCountry(keyword,country);
    await checkoutPage.validateShippingEmail(email);
    const orderId = await checkoutPage.SubmitAndGetOrderId();
    console.log(orderId);
    await dashboardPage.navigateToOrders();

    const ordersHistoryPage = base.getOrdersHistoryPage();
    await ordersHistoryPage.searchOrderAndSelect(orderId);
    expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
    
})


