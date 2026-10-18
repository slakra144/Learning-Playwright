const {test, expect} = require('@playwright/test');
const {writeExcelTest} = require("./excelDemo.js");
test('upload download excel validation',async({page})=>{
    const searchText = "Mango";
    const updateValue = 350;
    //https://rahulshettyacademy.com/upload-download-test/index.html
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
    const downloadPromise = page.waitForEvent('download');
    // await page.getByRole('button',{name: 'Download'}).click();
    await page.locator("#downloadButton").click();
    await page.pause();
    const download = await downloadPromise; // wait until download promise is fully resolved
    await download.saveAs('/Users/slakr/Downloads/' + download.suggestedFilename());
    writeExcelTest(searchText, updateValue, {row:0,col:2},"/Users/slakr/Downloads/download.xlsx")
    await page.locator("#fileinput").click();
    await page.locator("#fileinput").setInputFiles("/Users/slakr/Downloads/download.xlsx"); // only applicable if <input type="file"/>
    await page.pause();
    const textLocator = page.getByText(searchText);
    const desiredRow = page.getByRole("row").filter({has:textLocator});
    await expect( desiredRow.getByText(updateValue)).toBeVisible();
})