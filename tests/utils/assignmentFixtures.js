const base = require("@playwright/test");
const {expect,request} = base;

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_BASE_URL = 'https://api.eventhub.rahulshettyacademy.com';

const loginCredentials = {
  email: "test144@gmail.com",
  password: "Test_1234"
}


exports.newTest = base.test.extend(
    {
        authenticatedPage: async({browser}, use)=>{
            
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto(`${BASE_URL}/login`);
            
            const email = page.locator("input#email");
            const pass = page.locator("input#password");
            const loginBtn = page.locator("button#login-btn");
            
            await email.fill(loginCredentials.email);
            await pass.fill(loginCredentials.password);
            await loginBtn.click();
            await page.waitForLoadState('networkidle');
            
            await use(page);

            //teardown
            await context.close();
        }, 
        // Task 2: API event-creation fixture — returns the created event's data
        createEvent: async({ playwright },use)=>{
            const apiContext = await playwright.request.newContext({baseURL: API_BASE_URL});
            const loginRes = await apiContext.post('/api/auth/login',{
                data:loginCredentials
            })
            expect(loginRes.ok()).toBeTruthy();
            const { token } = await loginRes.json();
            
            const eventDate = new Date();
            eventDate.setMonth(eventDate.getMonth() + 1);
    
            const eventPayload = {
                title: `Automation Test Event ${Date.now()}`,
                description: 'Created by an automated Playwright fixture for testing.',
                category: 'Conference',
                venue: 'Bangalore International Centre',
                city: 'Bangalore',
                eventDate: eventDate.toISOString(),
                price: 1500,
                totalSeats: 500,
                imageUrl: 'https://example.com/banner.jpg',
            };

            const createEventRes = await apiContext.post('/api/events',{
                data:eventPayload,
                headers:{
                    'Authorization': `Bearer ${token}`
                },
            })
            
            console.log(await createEventRes.text());
            expect(createEventRes.ok()).toBeTruthy();
            const {data} = await createEventRes.json();
            await use(data);


            // teardown — clean up the event after the test finishes
            await apiContext.delete(`/api/events/${data.id}`, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
            });
            await apiContext.dispose();

        }
    }
)