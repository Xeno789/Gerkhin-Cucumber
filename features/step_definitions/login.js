const {
  When,
  Then
} = require('@cucumber/cucumber');
const login = require('../support/Test_helper');



When('I try to login with valid informations.', async function () {
  await login(this.emailAddress, this.password, this.page);
});

Then('I should be logged in.', async function () {
  const writeEmailButtonXpath = '//*[@id="app"]/div/div[2]/div[2]/div[1]/div/div/div[1]/div[1]/div[2]/div/div/button'
  await this.page.waitForXPath(writeEmailButtonXpath);
});


When('I try to login with non-existant email.', async function () {
  await this.page.goto('https://outlook.live.com/owa/');

  // Click on login button
  const firstLoginButtonXpath = "/html/body/header/div/aside/div/nav/ul/li[2]/a"
  const firstLoginButton = await this.page.waitForXPath(firstLoginButtonXpath)
  await firstLoginButton.click();

  // Input email address
  const emailAddressInputXpath = '//*[@id="lightbox"]/div[3]/div/div/div/div[2]/div[2]/div/input[1]'
  const emailAddressInput = await this.page.waitForXPath(emailAddressInputXpath);
  await emailAddressInput.type(this.targetEmail)

  // Click on Next button
  const nextButtonXpath = '//*[@id="lightbox"]/div[3]/div/div/div/div[4]/div/div/div/div/input'
  const nextButton = await this.page.waitForXPath(nextButtonXpath);
  await nextButton.click();
});


Then('I should be stucked on the email screen.', async function () {
  const nextButtonXpath = '//*[@id="lightbox"]/div[3]/div/div/div/div[4]/div/div/div/div/input'
  await this.page.waitForXPath(nextButtonXpath, {
    timeout: 5000
  });
});


When('I try to login with wrong password.', async function () {
  await login(this.emailAddress, this.wrongPassword, this.page, isSuccessfull = false)
});


Then('I should be stucked on the password screen.', async function () {
  const secondLoginButtonXpath = '//*[@id="lightbox"]/div[3]/div/div[2]/div/div[2]/div/div[2]/input'
  await this.page.waitForXPath(secondLoginButtonXpath, {
    timeout: 5000
  });
});