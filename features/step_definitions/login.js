const { When, Then,setDefaultTimeout} = require('@cucumber/cucumber');
const login = require('../support/Test_helper');
require("dotenv").config();

setDefaultTimeout(30*1000);

When('I try to login with valid informations.', async function () {
  await login(process.env.EMAIL, process.env.PASSWORD, this.page);
});

Then('I should be logged in.', async function () {
  const writeEmailSelector = '[role="region"] > div > div:nth-child(2) > div > div  > button'
  await this.page.waitForSelector(writeEmailSelector, {timeout: 10000});
});


When('I try to login with non-existant email.', async function () {
  await this.page.goto('https://outlook.live.com/owa/');

  // Click on login button
  const firstLoginButtonSelector = 'body > header > div > aside > div > nav > ul > li:nth-child(2) > a'
  await this.page.waitForSelector(firstLoginButtonSelector);
  await this.page.click(firstLoginButtonSelector);

  // Input email address
  const emailAddressSelector = '#lightbox > div:nth-child(3) > div > div > div > div.row > div.form-group.col-md-24 > div > input.form-control.ltr_override.input.ext-input.text-box.ext-text-box'
  await this.page.waitForSelector(emailAddressSelector);
  await this.page.type(emailAddressSelector, process.env.NONEXISTANTEMAIL);
  
  // Click on Next button
  const nextButtonSelector = "#lightbox > div:nth-child(3) > div > div > div > div.win-button-pin-bottom > div > div > div > div > input"
  await this.page.waitForSelector(nextButtonSelector);
  await this.page.click(nextButtonSelector)
});


Then('I should be stucked on the email screen.', async function () {
  const nextButtonSelector = "#lightbox > div:nth-child(3) > div > div > div > div.win-button-pin-bottom > div > div > div > div > input"
  await this.page.waitForSelector(nextButtonSelector, {timeout: 5000});
});


When('I try to login with wrong password.', async function () {
  await login(process.env.EMAIL, process.env.WRONGPASSWORD, this.page)
});


Then('I should be stucked on the password screen.', async function () {
  const secondLoginSelector = "#lightbox > div:nth-child(3) > div > div.pagination-view.has-identity-banner > div > div.position-buttons > div.win-button-pin-bottom > div > div > div > div > input"
  await this.page.waitForSelector(secondLoginSelector, {timeout: 5000});
});