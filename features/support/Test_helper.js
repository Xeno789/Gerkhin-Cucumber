const {
  Before,
  After
} = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
require("dotenv").config();

Before(async function () {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
  });
  this.browser = browser;
  this.page = page;
  
  this.emailAddress = process.env.EMAIL;
  this.nonExistantEmail = process.env.NONEXISTANTEMAIL;
  this.targetEmail = process.env.TARGET_EMAIL;
  this.password = process.env.PASSWORD;
  this.wrongPassword = process.env.WRONGPASSWORD;
});

Before({
  tags: "@sending_email"
}, async function () {
  await login(process.env.EMAIL, process.env.PASSWORD, this.page)
});

After(function () {
  return this.browser.close();
})

async function login(email, password, page, isSuccessfull = true) {
  await page.goto('https://outlook.live.com/owa/');

  // Click on login button
  const firstLoginButtonXpath = "/html/body/header/div/aside/div/nav/ul/li[2]/a"
  const firstLoginButton = await page.waitForXPath(firstLoginButtonXpath)
  await firstLoginButton.click();

  // Input email address
  const emailAddressInputXpath = '//*[@id="lightbox"]/div[3]/div/div/div/div[2]/div[2]/div/input[1]'
  const emailAddressInput = await page.waitForXPath(emailAddressInputXpath);
  await emailAddressInput.type(email)

  // Click on Next button
  const nextButtonXpath = '//*[@id="lightbox"]/div[3]/div/div/div/div[4]/div/div/div/div/input'
  const nextButton = await page.waitForXPath(nextButtonXpath);
  await nextButton.click();

  // Input password
  const passwordInputXpath = '//*[@id="lightbox"]/div[3]/div/div[2]/div/div[2]/div/div[2]/input'
  const passwordInput = await page.waitForXPath(passwordInputXpath);
  await passwordInput.type(password);

  // Click on login button
  const secondLoginButtonXpath = '//*[@id="lightbox"]/div[3]/div/div[2]/div/div[3]/div[2]/div/div/div/div/input'
  const secondLoginButton = await page.waitForXPath(secondLoginButtonXpath);
  await secondLoginButton.click();

  // Time by Time Outlook asks if you want to stay signed in, if thats the case, this clicks no.
  if (isSuccessfull) {
    try {
      const doNotStaySignedInButtonXpath = '/html/body/div/form/div/div/div[1]/div[2]/div/div[2]/div/div[3]/div[2]/div/div/div[1]/input'
      const doNotStaySignedInButton = await page.waitForXPath(doNotStaySignedInButtonXpath);
      await doNotStaySignedInButton.click();
    } catch {
      console.log("Outlook didnt ask if I want to stay signed in.")
    }
  }
}

module.exports = login;