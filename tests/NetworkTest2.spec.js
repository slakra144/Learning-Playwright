const {test, expect} = require('@playwright/test');

test('@QW Security test request intercept', async({page})=>{
    const email = page.locator("input#userEmail");
    const pass = page.locator("input#userPassword");
    const homepageLoginBtn = page.locator("input#login");
    const emailId = "betty145@gmail.com";
    const passStr = "Test_1234";


    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

    await email.fill(emailId);
    await pass.fill(passStr);
    await homepageLoginBtn.click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();
    await page.locator("[routerlink*=myorders]").first().click();

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6' }))
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
   
})

test('abort network call',async ({browser})=>{
    //playwright code
    
    const context = await browser.newContext();
    const page = await context.newPage();

    
    //locators
    const uname = page.locator('input#username');
    const signIn = page.locator("input.btn.btn-info.btn-md");
    const cardTitle = page.locator(".card-title a");
    
    page.route('**/*.{jpg,png,jpeg}', req=>req.abort())
    // page.on('request', req => console.log(req.url()));
    // page.on('response', res => console.log(res.url()+" "+res.status()))
    //open page
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    // css or xpath
    await uname.fill("rahulshettyacademy");
    await page.locator("input[type='password']").fill("Learning@830$3mK2");
    await signIn.click();
    
    const allTitle = await cardTitle.allTextContents();
    console.log(allTitle);
    // await page.pause()

})