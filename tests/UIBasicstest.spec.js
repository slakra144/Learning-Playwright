const {test, expect} = require('@playwright/test');

test('tc01',async ({browser})=>{
    //playwright code
    
    const context = await browser.newContext();
    const page = await context.newPage();

    //locators
    const uname = page.locator('input#username');
    const signIn = page.locator("input.btn.btn-info.btn-md");
    const cardTitle = page.locator(".card-title a");

    //open page
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    // css or xpath
    await uname.fill("rahulshettyacademy1234");
    await page.locator("input[type='password']").fill("Learning@830$3mK2");
    await signIn.click();
    // console.log(await page.locator("div[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    await uname.fill("");
    await uname.fill("rahulshettyacademy")
    await signIn.click();
    // console.log(await page.locator(".card-title a").first.textContent()); //return 1st element out multiple elements
    // console.log(await cardTitle.nth(0).textContent());
    const allTitle = await cardTitle.allTextContents();
    console.log(allTitle);

})

test('tc01a', async ({page})=>{
    await page.goto('https://google.com');
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
})

test('UI Controls', async({page})=>{
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const uname = page.locator('input#username');
    const pass = page.locator('input#password');
    const dropdown = page.locator('select.form-control');
    const documentLink = page.locator("a[href*='documents-request']");
    dropdown.selectOption('consult');
    await page.locator('span.radiotextsty').last().click();
    await page.locator('button#okayBtn').click();
    console.log(await page.locator('span.radiotextsty').last().isChecked());
    await expect(page.locator('span.radiotextsty').last()).toBeChecked(); //action performed outside {}
    await page.locator('#terms').click();
    await expect(page.locator('#terms')).toBeChecked();
    await page.locator('#terms').uncheck();
    expect(await page.locator('#terms').isChecked()).toBeFalsy(); //action performed inside {}
    await expect(documentLink).toHaveAttribute('class','blinkingTexts');
    await page.pause();
})

test('Child Windows handle', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const documentLink = page.locator("a[href*='documents-request']");
    const uname = page.locator('input#username');
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),// listen for any new page pending, rejected or fulfilled State
        documentLink.click()
    ]);
    let text = await newPage.locator('p.red').textContent();// it only returns text from locator where the text is attached to DOM
    const arrText = text.split('@')
    const email = arrText[1].split(" ")[0]
    // console.log(email);
    await uname.fill(email);
    console.log(await uname.inputValue())
    
})