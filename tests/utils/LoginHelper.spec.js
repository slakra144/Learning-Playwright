import { expect } from '@playwright/test';

export async function login(page){

    // Navigate to /login
    await page.goto('https://eventhub.rahulshettyacademy.com');

    const uname = 'betty145@gmail.com';
    const pass = 'Test_1234';

    await page.getByPlaceholder("you@email.com").fill(uname); //Fill email field (locate by placeholder you@email.com)

    await page.getByLabel("Password").fill(pass); //Fill password field (locate by label Password)

    await page.locator("button#login-btn").click(); // Click the login button (locate by id #login-btn)

    await expect(page.getByText('Browse Events').first()).toBeVisible();


}