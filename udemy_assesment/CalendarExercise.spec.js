const {test, expect} = require('@playwright/test');

test('Calendar input automation', async({page})=>{
    const month = "3"
    const day = "20"
    const year = "2024"
    const expectedDate = [month, day, year];

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator("div.react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(month)-1).click();
    await page.locator("//abbr[text()='"+day+"']").click();
    await page.pause();

    const inputs = page.locator("input.react-date-picker__inputGroup__input")
    for(let i = 0; i<expectedDate.length; i++){
        const value = await inputs.nth(i).getAttribute("value");
        expect(value).toEqual(expectedDate[i]);
    }
})