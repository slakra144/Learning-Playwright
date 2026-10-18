const {test, expect} = require('@playwright/test');
import { login } from '../tests/utils/LoginHelper.spec';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

function generateTestEventId() {
    const now = new Date();
    
    // Format the date parts to ensure two digits
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}${month}${day}`; // Output: 20260727
    
    // Generate a unique 4-character alphanumeric suffix
    const uniqueness = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    return `TestEvent${formattedDate}_${uniqueness}`; //TestEvent20260727_K8B9
}

test('Assignment1', async({page})=>{
    await login(page);

    await page.getByRole("button", {name: "Admin"}).click();

    await page.getByRole("link", {name: "Manage Events"}).nth(0).click();

    const title = generateTestEventId();
    await page.locator("input#event-title-input").fill(title);
    await page.getByPlaceholder("Describe the event…").fill("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam maximus sed lectus ut lacinia. Curabitur nec molestie lacus, nec lacinia dolor.");
    await page.getByLabel("City").fill("Mumbai");
    await page.getByLabel("Venue").fill("Marine Drive");

    await page.getByLabel('Event Date & Time').fill('2027-12-31T10:00'); //hint taken

    await page.getByLabel("Price ($)").fill("100");
    await page.getByLabel("Total Seats").fill("50");
    await page.locator("button#add-event-btn").click();
    await expect(page.getByText('Event created!').first()).toBeVisible();
    console.log(`Created event: "${title}"`);

    //Step 3 — Find the event card and capture seats
    await page.goto(`${BASE_URL}/events`);
    //Get all event cards (locate by data-testid="event-card")
    const eventCards = page.getByTestId('event-card');
    //Assert the first card is visible (confirms page loaded)
    await expect(eventCards.first()).toBeVisible();
    //From all cards, filter for the one that contains your event title text 
    const targetCard = eventCards.filter({hasText: `${title}`}).first();
    //Assert the matched card is visible (timeout 5 seconds)
    await expect(targetCard).toBeVisible({timeout: 5000});
    //Read the seat count text from that card (locate element containing text seat, parse integer from its inner text) — store this as seatsBeforeBooking
    // Capture seat count before booking
    const seatsBeforeBooking = parseInt(await targetCard.getByText('seat').first().innerText());
    console.log(`Seats before booking: ${seatsBeforeBooking}`);

    //Step 4 — Start booking
    // - On the matched event card, click the Book Now button (locate by data-testid="book-now-btn" inside the card)
    await targetCard.getByTestId("book-now-btn").click();

    // Step 5 — Fill booking form
    await expect(page.locator('span#ticket-count')).toHaveText('1');
    await page.getByLabel('Full Name').fill('Shashank');
    await page.locator('input#customer-email').fill('shashi123@jio.com');
    await page.getByPlaceholder('+91 98765 43210').fill('1029384756');
    await page.locator('button.confirm-booking-btn').click();

    //Step 6 — Verify booking confirmation
    const bookingRef = page.locator('.booking-ref').first();

    await expect(bookingRef).toBeVisible();
    const bookingRefVal = (await bookingRef.innerText()).trim();
    await expect(bookingRefVal.charAt(0)).toBe(title.trim().charAt(0).toUpperCase())
    

    //Step 7 — Verify in My Bookings
    await page.getByText('View My Bookings').click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`)
    const allBookingCards = page.locator('#booking-card');
    await expect(allBookingCards.first()).toBeVisible();
    const myBooking = allBookingCards.filter({hasText: `${bookingRefVal}`}).first();
    await expect(myBooking).toBeVisible();
    await expect(myBooking).toContainText(title);

    //Step 8 — Verify seat reduction
    await page.goto(`${BASE_URL}/events`);
    await expect(eventCards.first()).toBeVisible();
    await expect(targetCard).toBeVisible({timeout: 5000});
    const afterBeforeBooking = parseInt(await targetCard.getByText('seat').first().innerText());
    await expect(afterBeforeBooking === seatsBeforeBooking - 1).toBeTruthy();





})