const {test, expect, request} = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL  = 'https://api.eventhub.rahulshettyacademy.com/api';
const YAHOO_UNAME = 'test144@yahoo.com';
const YAHOO_PASS = 'Test_12345';

const UNAME = 'test144@gmail.com';
const PASS = 'Test_1234';

async function login(page, username, pass){
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder("you@email.com").fill(username); //Fill email field (locate by placeholder you@email.com)
    await page.getByLabel("Password").fill(pass); //Fill password field (locate by label Password)
    await page.locator("button#login-btn").click(); // Click the login button (locate by id #login-btn)
    await expect(page.getByText('Browse Events').first()).toBeVisible();
    await page.locator("a#nav-events").click();
}


test('test: Cross-User Booking Access Denied', async({page, request})=>{

    // Step 1 — Login as Yahoo user via API
    const yahooLogin = await request.post(`${API_URL}/auth/login`,{
        data:{
                email: YAHOO_UNAME,
                password: YAHOO_PASS
            }
    });
    expect(yahooLogin.ok()).toBeTruthy();
    // console.log(await yahooLogin.json());
    const { token } = await yahooLogin.json();
    // console.log(token);


    // ── Step 2: Fetch events via API to get a valid event ID
    const allevents = await request.get(`${API_URL}/events`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    expect(allevents.ok()).toBeTruthy();
    const eventsData = await allevents.json();
    const eventId = eventsData.data[0].id;
    
    // Step 3 — Create a booking via API as Yahoo user
    const bookEvent = await request.post(`${API_URL}/bookings`,{
        headers:{
            Authorization: `Bearer ${token}`
        },
        data:{
        "eventId": eventId,
        "customerName": "Priya Sharma",
        "customerEmail": "priya.sharma@email.com",
        "customerPhone": "+91-9876543210",
        "quantity": 1
        }
    })

    expect(bookEvent.ok()).toBeTruthy();
    const eventBooking = await bookEvent.json();
    const yahooBookingId = eventBooking.data.id;
    console.log(yahooBookingId);

    //Step 4 — Login as Gmail user via browser UI
    await login(page, UNAME, PASS);

    //Step 5 — Navigate to Yahoo's booking URL as Gmail user
    await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, { waitUntil: 'networkidle' });// Pass { waitUntil: 'networkidle' } as the navigation option so the page fully resolves before asserting
    
    // Step 6 — Validate Access Denied
    await expect(page.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
    await expect(page.getByText('You are not authorized to')).toBeVisible();
    
})