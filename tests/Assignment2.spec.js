const {test, expect} = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const UNAME = 'betty145@gmail.com';
const PASS = 'Test_1234';

async function login(page){
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder("you@email.com").fill(UNAME); //Fill email field (locate by placeholder you@email.com)
    await page.getByLabel("Password").fill(PASS); //Fill password field (locate by label Password)
    await page.locator("button#login-btn").click(); // Click the login button (locate by id #login-btn)
    await expect(page.getByText('Browse Events').first()).toBeVisible();
}

test('TC-01 Single ticket booking is eligible for refund', async({page})=>{

    //Step 1 — Login
    await login(page);

    //Step 2 — Book first event with 1 ticket (default)

    //Navigate to /events
    await page.goto(`${BASE_URL}/events`);
    //Click Book Now on the very first event card (locate data-testid="event-card" → first → data-testid="book-now-btn")
    const event_cards = page.getByTestId('event-card');
    await expect(event_cards.first()).toBeVisible();
    await event_cards.first().getByTestId('book-now-btn').click();
    //Fill Full Name, Email (your email), Phone
    await page.getByLabel('Full Name').fill('shashank');
    await page.getByLabel('Email').fill('abc@jio.com');
    await page.getByLabel('Phone Number').fill('1029384756');
    //Click confirm button (.confirm-booking-btn)
    await page.locator('#confirm-booking').click();

    //Step 3 — Navigate to booking detail
    const ref = page.locator('.booking-ref').first();;
    await expect(ref).toBeVisible();
    //Click View My Bookings link
    await page.getByText('View My Bookings').click();
    //Assert URL is /bookings
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);
    //Click the first View Details link
    const my_bookings = page.locator('#booking-card');
    await expect(my_bookings.first()).toBeVisible();
    await my_bookings.first().click();
    //Assert: text Booking Information is visible on the page
    await page.getByRole('link', { name: 'View Details' }).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    //Step 4 — Validate booking ref

    //Read booking ref from page
    const refFromPage = await page.locator('.text-indigo-600.bg-indigo-50.text-sm.font-mono.font-bold').textContent();

    //Read event title from h1
    const refFromH1 = await page.locator('.text-sm.font-medium.text-gray-900.text-right').nth(0).textContent();

    expect(refFromPage.charAt(0)).toBe(refFromH1.charAt(0));

    //Step 5 — Check refund eligibility

    //- Click the Check Refund Eligibility button
    await page.getByTestId('check-refund-btn').click()
    const checkElegibilitySpinner = page.locator('div#refund-spinner');
    //- Assert: spinner element (#refund-spinner) is immediately visible
    await expect(checkElegibilitySpinner).toBeVisible();
    // Wait for spinner to disappear after 4s
    await expect(checkElegibilitySpinner).not.toBeVisible({ timeout: 6000 });

    //Step 6 — Validate result
    const result = page.locator('#refund-result');

    //Assert it is visible
    await expect(result).toBeVisible();
    //Assert it contains text Eligible for refund
    await expect(result).toContainText('Eligible for refund');
    //Assert it contains text Single-ticket bookings qualify for a full refund
    await expect(result).toContainText('Single-ticket bookings qualify for a full refund');

})

test('TC-02 Group ticket booking is NOT eligible for refund', async({page})=>{

    //Step 1 — Login
    await login(page);

    //Step 2 — Book first event with 1 ticket (default)

    //Navigate to /events
    await page.goto(`${BASE_URL}/events`);
    //Click Book Now on the very first event card (locate data-testid="event-card" → first → data-testid="book-now-btn")
    const event_cards = page.getByTestId('event-card');
    await expect(event_cards.first()).toBeVisible();
    await event_cards.first().getByTestId('book-now-btn').click();
    //Fill Full Name, Email (your email), Phone
    //Locate the increment button with button:has-text("+") and click it twice
    await page.locator("button:has-text('+')").click({clickCount:2});
    await page.getByLabel('Full Name').fill('test2');
    await page.getByLabel('Email').fill('test2@jio.com');
    await page.getByLabel('Phone Number').fill('0987654321');
    //Click confirm button (.confirm-booking-btn)
    await page.locator('#confirm-booking').click();

    //Step 3 — Navigate to booking detail
    const ref = page.locator('.booking-ref').first();;
    await expect(ref).toBeVisible();
    //Click View My Bookings link
    await page.getByText('View My Bookings').click();
    //Assert URL is /bookings
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);
    //Click the first View Details link
    const my_bookings = page.locator('#booking-card');
    await expect(my_bookings.first()).toBeVisible();
    await my_bookings.first().click();
    //Assert: text Booking Information is visible on the page
    await page.getByRole('link', { name: 'View Details' }).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    //Step 4 — Validate booking ref

    //Read booking ref from page
    const refFromPage = await page.locator('.text-indigo-600.bg-indigo-50.text-sm.font-mono.font-bold').textContent();

    //Read event title from h1
    const refFromH1 = await page.locator('.text-sm.font-medium.text-gray-900.text-right').nth(0).textContent();

    expect(refFromPage.charAt(0)).toBe(refFromH1.charAt(0));

    //Step 5 — Check refund eligibility

    //- Click the Check Refund Eligibility button
    await page.getByTestId('check-refund-btn').click()
    const checkElegibilitySpinner = page.locator('div#refund-spinner');
    //- Assert: spinner element (#refund-spinner) is immediately visible
    await expect(checkElegibilitySpinner).toBeVisible();
    // Wait for spinner to disappear after 4s
    await expect(checkElegibilitySpinner).not.toBeVisible({ timeout: 6000 });

    //Step 6 — Validate result
    const result = page.locator('#refund-result');

    //Assert it is visible
    await expect(result).toBeVisible();
    //Assert it contains text Eligible for refund
    await expect(result).toContainText('Not eligible for refund');
    //Assert it contains text Single-ticket bookings qualify for a full refund
    await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');

})
