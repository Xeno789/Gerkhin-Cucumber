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
    await login(process.env.EMAIL, process.env.PASSWORD, this.page)
});

After(function(){
    return this.browser.close();
})

async function login(email, password, page){
    await page.goto('https://outlook.live.com/owa/');

    // Click on login button
    const firstLoginButtonSelector = 'body > header > div > aside > div > nav > ul > li:nth-child(2) > a'
    await page.waitForSelector(firstLoginButtonSelector);
    await page.click(firstLoginButtonSelector);

    // Input email address
    const emailAddressSelector = '#lightbox > div:nth-child(3) > div > div > div > div.row > div.form-group.col-md-24 > div > input.form-control.ltr_override.input.ext-input.text-box.ext-text-box'
    await page.waitForSelector(emailAddressSelector);
    await page.type(emailAddressSelector, email);

    // Click on Next button
    const nextButtonSelector = "#lightbox > div:nth-child(3) > div > div > div > div.win-button-pin-bottom > div > div > div > div > input"
    await page.waitForSelector(nextButtonSelector);
    await page.click(nextButtonSelector)

    // Input password
    const passwordSelector = "#lightbox > div:nth-child(3) > div > div.pagination-view.animate.has-identity-banner.slide-in-next > div > div:nth-child(11) > div > div.placeholderContainer > input"
    await page.waitForSelector(passwordSelector);
    await page.type(passwordSelector, password);
    
    // Click on login button
    const secondLoginSelector = "#lightbox > div:nth-child(3) > div > div.pagination-view.animate.has-identity-banner.slide-in-next > div > div.position-buttons > div.win-button-pin-bottom > div > div > div > div > input"
    await page.waitForSelector(secondLoginSelector);
    await page.click(secondLoginSelector);

    // Time by Time Outlook asks if you want to stay signed in, if thats the case, this clicks no.
    try{
        const doNotStaySignedInSelector = "#idBtn_Back"
        await page.waitForSelector(doNotStaySignedInSelector,{timeout: 3000});
        await page.click(doNotStaySignedInSelector);
    }catch{
        console.log("Outlook didnt ask if I want to stay signed in.")
    }
}

module.exports = login;