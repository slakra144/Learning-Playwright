const {test, expect, request} = require('@playwright/test')
const {newTest} = require("../tests/utils/assignmentFixtures.js")

newTest("custom fixture test", async({authenticatedPage,createEvent})=>{
    await authenticatedPage.goto('https://eventhub.rahulshettyacademy.com/events');
    await authenticatedPage.pause();
    await expect(authenticatedPage.getByText(createEvent.title)).toBeVisible();
    
})