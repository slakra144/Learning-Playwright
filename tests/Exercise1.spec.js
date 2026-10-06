const {test, expect} = require('@playwright/test');

test('ex01a', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();

    const homePageregisterBtn = page.locator("a.btn1");
    const firstName = page.locator("input#firstName");
    const lastName = page.locator("input#lastName");
    const email = page.locator("input#userEmail");
    const mobileNo = page.locator("input#userMobile");
    const occupationDropdown = page.locator("select[formcontrolname='occupation']");
    const maleBtn = page.locator("input[value='Male']");
    const femaleBtn = page.locator("input[value='Female']");
    const pass = page.locator("input#userPassword");
    const confirmPass = page.locator("input#confirmPassword");
    const imAdultChkBox = page.locator("input[type='checkbox']");
    const registerBtn = page.locator("input#login");
    const successPopup = page.locator("div.login-wrapper.my-auto.p-5.ng-star-inserted h1");
    const loginBtn = page.locator("div.login-wrapper.my-auto.p-5.ng-star-inserted button");

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await homePageregisterBtn.click();
    await firstName.fill("betty");
    await lastName.fill("cooper");
    await email.fill("betty145@gmail.com");
    await mobileNo.fill("1029384756");
    await occupationDropdown.selectOption({ label: 'Engineer' }); 
    await maleBtn.check();
    await pass.fill("Test_1234");
    await confirmPass.fill("Test_1234");
    await imAdultChkBox.check();
    await registerBtn.click();
    await expect(successPopup).toContainText('Account Created Successfully');
    await loginBtn.click();
})

test('ex01b', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();

    const email = page.locator("input#userEmail");
    const pass = page.locator("input#userPassword");
    const homepageLoginBtn = page.locator("input#login");
    const productCardTitle = page.locator("div.card-body b");
    const signOutBtn = page.locator("button.btn-custom:has(i.fa-sign-out)");

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await email.fill("betty145@gmail.com");
    await pass.fill("Test_1234");
    await homepageLoginBtn.click();
    await page.waitForLoadState('networkidle');// or alt
    // await productCardTitle.first().waitFor() // only applicable if only one element is being located
    const titles = await productCardTitle.allTextContents();
    // console.log(titles[0]);
    console.log(titles)
    await signOutBtn.click();
})

test('E2E add to card', async({page})=>{
    const email = page.locator("input#userEmail");
    const pass = page.locator("input#userPassword");
    const homepageLoginBtn = page.locator("input#login");

    const emailId = "betty145@gmail.com";
    const passStr = "Test_1234";

    const productName = 'ZARA COAT 3';
    const products = page.locator('div.card-body')

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

    await email.fill(emailId);
    await pass.fill(passStr);
    await homepageLoginBtn.click();
    await page.waitForLoadState('networkidle');
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
    await page.pause();
});