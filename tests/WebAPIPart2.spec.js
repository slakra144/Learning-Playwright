const {test, expect} = require('@playwright/test');

let webContext;
const emailId = "betty145@gmail.com";
const passStr = "Test_1234";
test.beforeAll(async ({browser})=>{

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
    await context.storageState({path:'state.json'});
    webContext = await browser.newContext({storageState: 'state.json'});

})

test('E2E add to card', async()=>{
    const page = await webContext.newPage();    
    await page.goto('https://rahulshettyacademy.com/client');
    const productName = 'ZARA COAT 3';
    const products = page.locator('div.card-body')
    await page.locator("div.card-body b").first().waitFor();

    const count = await products.count();
    for(let i = 0; i<count; ++i){
        const title = await products.nth(i).locator("b").textContent();
        console.log(title)
        if (title === productName){
            //add to cart
            console.log('Clicking on add to cart')
            await products.nth(i).locator("text= Add To Cart").click(); // to find based on exacct text matching 
            break;
        }
    }
    await page.locator("button[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const checkAvail = await page.locator("h3:has-text('ZARA COAT 3')").isVisible(); // important psuedo class    
    expect(checkAvail).toBeTruthy;
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").pressSequentially("ind",{delay:150});
    const dropdown = page.locator('section.ta-results')
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for(let i = 0; i<optionsCount; i++){
        const text = await dropdown.locator("button").nth(i).textContent();
        if(text === " India"){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    await expect(page.locator(".user__name [type='text']").first()).toHaveText(emailId);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ")
    const orderID = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderID);
    await page.locator("[routerlink*=myorders]").first().click();

    const orders = page.locator(".table .ng-star-inserted");
    await page.locator(".table .ng-star-inserted").first().waitFor();
    const orderCount = await orders.count();
    console.log(orderCount)
    for(let i = 0; i< orderCount; i++){
        const currOrderId = await orders.nth(i).locator("th").textContent();
        if(orderID.includes(currOrderId)){
            console.log(currOrderId + " is found");
            await orders.nth(i).locator("button").first().click();
            break;
        }
    }
    // await page.pause();
});

test('Get all titles of Product', async()=>{
    const page = await webContext.newPage();    
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator("div.card-body b").first().waitFor();
    const titles = await page.locator("div.card-body b").allTextContents();
    console.log(titles);
})