const {test, expect, request} = require('@playwright/test')
const {customeTest} = require("../tests/utils/fixtures.js")

customeTest("fixtures Demo", async({authenthicatedPage, createOrder, testData})=>{
    await authenthicatedPage.goto("https://rahulshettyacademy.com/client");
    //login to application/create order and verify if the order is created from history page
    await authenthicatedPage.locator("[routerlink*=myorders]").first().click();
    const orders = authenthicatedPage.locator(".table .ng-star-inserted");
    await authenthicatedPage.locator(".table .ng-star-inserted").first().waitFor(); 
    await expect(authenthicatedPage.getByText(createOrder.orderID)).toBeVisible();
    console.log(testData.productName);
});