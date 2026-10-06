const {test, expect, request} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');

const loginPayload = {userEmail:"betty145@gmail.com",userPassword:"Test_1234"};
const orderPayload = {orders:[{country:"India",productOrderedId:"6960ea76c941646b7a8b3dd5"}]};
const fakePayloadOrder = {data:[], message:"No Orders"}

let response;


test.beforeAll(async ()=>{
    
    // API context (separate from browser context)
    const apiContext = await request.newContext();
    const api = new APIUtils(apiContext, loginPayload);
    response = await api.createOrder(orderPayload);
})

test("Place the order", async({page})=>{
    
    await page.addInitScript(value => {
        window.localStorage.setItem("token",value);
    }, response.token);
    await page.goto('https://rahulshettyacademy.com/client/');

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", async route=>{ // * refers to wildcard
        //intercepting response - API resp=>playwright mocked resp=>browser=>render data

        const response = await page.request.fetch(route.request());
        let body = JSON.stringify(fakePayloadOrder);
        route.fulfill(
          {
            response,
            body
          }  
        );//use to mock the resposne for route url
    })
    await page.locator("[routerlink*=myorders]").first().click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")
    console.log(await page.locator(".mt-4").textContent());

    
    
});