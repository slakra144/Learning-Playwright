const base = require("@playwright/test");
const {APIUtils} = require('./APIUtils.js');
const {request} = require('@playwright/test');

const loginPayload = {userEmail:"betty145@gmail.com",userPassword:"Test_1234"};
const orderPayload = {orders:[{country:"Pakistan",productOrderedId:"6960eac0c941646b7a8b3e68"}]};

exports.customeTest = base.test.extend(
    {
        authenthicatedPage: async({browser}, use)=>{
            const emailId = "betty145@gmail.com";
            const passStr = "Test_1234";
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
            
            const email = page.locator("input#userEmail");
            const pass = page.locator("input#userPassword");
            const homepageLoginBtn = page.locator("input#login");
            
            await email.fill(emailId);
            await pass.fill(passStr);
            await homepageLoginBtn.click();
            await page.waitForLoadState('networkidle');
            await use(page);

            //teardown
            await context.close();
        },
        createOrder: async({}, use)=>{
            const apiContext = await request.newContext();
            const api = new APIUtils(apiContext, loginPayload);
            const response = await api.createOrder(orderPayload);
            await use(response);

            //teardown
            await apiContext.dispose();
        },
        testData:{
            productName: "Test123"
        }
    }
)