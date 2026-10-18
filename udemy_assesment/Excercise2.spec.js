const {test, expect} = require('@playwright/test');


test('E2E add to card with other locator types', async({page})=>{
    const email = page.getByPlaceholder("email@example.com");
    const pass = page.getByPlaceholder("enter your passsword");
    const homepageLoginBtn = page.getByRole("button",{name: "login"});

    const emailId = "betty145@gmail.com";
    const passStr = "Test_1234";

    const productName = 'ZARA COAT 3';
    
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    
    await email.fill(emailId);
    await pass.fill(passStr);
    await homepageLoginBtn.click();
    await page.waitForLoadState('networkidle');
    await page.locator("div.card-body b").first().waitFor();
            
    await page.locator('div.card-body').filter({hasText: "ZARA COAT 3"}).getByRole("button", {name: "Add To Cart"}).click();

    await page.getByRole("listitem").getByRole("button", {name: "Cart"}).click(); 

    await page.locator("div li").first().waitFor();
    
    await expect(page.getByText("ZARA COAT 3")).toBeVisible();

    await page.getByRole("button", {name: "Checkout"}).click();

    await page.getByPlaceholder("Select Country").pressSequentially("ind",{delay:150});

    await page.getByRole("button", {name: "India"}).nth(1).click();
    
    await page.getByText("PLACE ORDER").click();

    await expect(page.getByText("Thankyou for the order.")).toBeVisible();
    

    // const orders = page.locator(".table .ng-star-inserted");
    // await page.locator(".table .ng-star-inserted").first().waitFor();
    // const orderCount = await orders.count();
    // console.log(orderCount)
    // for(let i = 0; i< orderCount; i++){
    //     const currOrderId = await orders.nth(i).locator("th").textContent();
    //     if(orderID.includes(currOrderId)){
    //         console.log(currOrderId + " is found");
    //         await orders.nth(i).locator("button").first().click();
    //         break;
    //     }
    // }
    await page.pause();
});