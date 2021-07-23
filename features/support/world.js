const { Before, After} = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
require("dotenv").config();
Before(async function() {
    const world = this;
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
    });
    world.browser = browser;
    world.page = page;
});

Before({tags: "@sending_email"},async function() {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    await this.page.goto('https://outlook.live.com/owa/');
    // Click on login button
    const firstLoginButtonSelector = 'body > header > div > aside > div > nav > ul > li:nth-child(2) > a'
    await this.page.waitForSelector(firstLoginButtonSelector);
    await this.page.click(firstLoginButtonSelector);
    // Input email address
    const emailAddressSelector = '#lightbox > div:nth-child(3) > div > div > div > div.row > div.form-group.col-md-24 > div > input.form-control.ltr_override.input.ext-input.text-box.ext-text-box'
    await this.page.waitForSelector(emailAddressSelector);
    await this.page.type(emailAddressSelector, email);
    // Click on Next button
    const nextButtonSelector = "#lightbox > div:nth-child(3) > div > div > div > div.win-button-pin-bottom > div > div > div > div > input"
    await this.page.waitForSelector(nextButtonSelector);
    await this.page.click(nextButtonSelector)
    // Input password
    const passwordSelector = "#lightbox > div:nth-child(3) > div > div.pagination-view.animate.has-identity-banner.slide-in-next > div > div:nth-child(11) > div > div.placeholderContainer > input"
    await this.page.waitForSelector(passwordSelector);
    await this.page.type(passwordSelector, password);
    // Click on login button
    const secondLoginSelector = "#lightbox > div:nth-child(3) > div > div.pagination-view.animate.has-identity-banner.slide-in-next > div > div.position-buttons > div.win-button-pin-bottom > div > div > div > div > input"
    await this.page.waitForSelector(secondLoginSelector);
    await this.page.click(secondLoginSelector);
});

After(function(){
    return this.browser.close();
})