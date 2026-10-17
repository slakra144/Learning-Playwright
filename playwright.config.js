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
  timeout:60 * 1000,//in ms
  expect:{
    timeout: 5 * 1000,
  },
  reporter:'html',
  use: {
   browserName:'firefox',
   headless:false,
   screenshot:'off',
   trace:'off'
  },

});

