const {test, expect} = require('@playwright/test');

test("Screenshot & visual validation", async({page})=>{
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')
    
    await page.locator('#displayed-text').screenshot({path:'partialScr.png'});
    await expect(page.locator('#displayed-text')).toBeVisible();
    await page.locator('#hide-textbox').click();
    await expect(page.locator('#displayed-text')).toBeHidden();
    await page.screenshot({path:'screenhsot.png'});
});

test.only('visual testing', async({page})=>{
    await page.goto('https://google.com/',{waitUntil:'networkidle'});
    expect(await page.screenshot()).toMatchSnapshot('landing.png');
})