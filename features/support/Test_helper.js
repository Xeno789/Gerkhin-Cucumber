const { Before, After} = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
require("dotenv").config();

Before(async function() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
    });
    this.browser = browser;
    this.page = page;
});

Before({tags: "@sending_email"},async function() {
    await login(process.env.EMAIL, process.env.PASSWORD, this)
});

After(function(){
    return this.browser.close();
})

async function login(email, password, browser){
    await browser.page.goto('https://outlook.live.com/owa/');
    // Click on login button
    const firstLoginButtonSelector = 'body > header > div > aside > div > nav > ul > li:nth-child(2) > a'
    await browser.page.waitForSelector(firstLoginButtonSelector);
    await browser.page.click(firstLoginButtonSelector);
    // Input email address
    const emailAddressSelector = '#lightbox > div:nth-child(3) > div > div > div > div.row > div.form-group.col-md-24 > div > input.form-control.ltr_override.input.ext-input.text-box.ext-text-box'
    await browser.page.waitForSelector(emailAddressSelector);
    await browser.page.type(emailAddressSelector, email);
    // Click on Next button
    const nextButtonSelector = "#lightbox > div:nth-child(3) > div > div > div > div.win-button-pin-bottom > div > div > div > div > input"
    await browser.page.waitForSelector(nextButtonSelector);
    await browser.page.click(nextButtonSelector)
    // Input password
    const passwordSelector = "#lightbox > div:nth-child(3) > div > div.pagination-view.animate.has-identity-banner.slide-in-next > div > div:nth-child(11) > div > div.placeholderContainer > input"
    await browser.page.waitForSelector(passwordSelector);
    await browser.page.type(passwordSelector, password);
    // Click on login button
    const secondLoginSelector = "#lightbox > div:nth-child(3) > div > div.pagination-view.animate.has-identity-banner.slide-in-next > div > div.position-buttons > div.win-button-pin-bottom > div > div > div > div > input"
    await browser.page.waitForSelector(secondLoginSelector);
    await browser.page.click(secondLoginSelector);
}

module.exports = login;