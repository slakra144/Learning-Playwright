const {test, expect, request} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');

const loginPayload = {userEmail:"betty145@gmail.com",userPassword:"Test_1234"};
const orderPayload = {orders:[{country:"India",productOrderedId:"6960ea76c941646b7a8b3dd5"}]};

let response;


test.beforeAll(async ()=>{
    
    // API context (separate from browser context)
    const apiContext = await request.newContext();
    const api = new APIUtils(apiContext, loginPayload);
    response = await api.createOrder(orderPayload);
})

test("Place the order", async({page})=>{
    // const email = page.getByPlaceholder("email@example.com");
    // const pass = page.getByPlaceholder("enter your passsword");
    // const homepageLoginBtn = page.getByRole("button",{name: "login"});

    // const emailId = "betty145@gmail.com";
    // const passStr = "Test_1234";

    // const productName = 'ZARA COAT 3';
    
    // await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    
    // await email.fill(emailId);
    // await pass.fill(passStr);
    // await homepageLoginBtn.click();
    // await page.waitForLoadState('networkidle');

    await page.addInitScript(value => {
        window.localStorage.setItem("token",value);
    }, response.token);
    await page.goto('https://rahulshettyacademy.com/client/');


    await page.locator("[routerlink*=myorders]").first().click();

    const orders = page.locator(".table .ng-star-inserted");
    await page.locator(".table .ng-star-inserted").first().waitFor();
    const orderCount = await orders.count();
    console.log(orderCount)
    for(let i = 0; i< orderCount; i++){
        const currOrderId = await orders.nth(i).locator("th").textContent();
        if(response.orderID.includes(currOrderId)){
            console.log(currOrderId + " is found");
            await orders.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderDetails = await page.locator('div.col-text').textContent();
    await page.pause();
    expect(orderDetails.includes(response.orderID)).toBeTruthy();
});