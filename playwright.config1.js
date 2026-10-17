// @ts-check
import { defineConfig, devices, firefox } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout:30 * 1000,//in ms
  expect:{
    timeout: 5 * 1000,
  },
  reporter:'html',
  projects:[
    {
      name:"safari",
      use: {
        browserName:'webkit',// i.e safari
        headless:false,
        screenshot:'off',
        trace:'on',
        ...devices["iPhone 12"],
        video:"retain-on-failure"
      }
    },
    {
      name:"chrome",
      use: {
        browserName:'chromium',
        headless:false,
        screenshot:'off',
        trace:'off',
        ignoreHTTPSErrors:true, // allow website with expired ssl certificates
        permissions:["geolocation"] // enables playwright to hadnle "ask for location" permissions

      }
    }
  ]

});

