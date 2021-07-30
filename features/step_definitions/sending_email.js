const assert = require('assert');
const { When, Then,setDefaultTimeout} = require('@cucumber/cucumber');

setDefaultTimeout(30*1000);
var subject = ""

When('I try to send an email.', async function () {
  // Click on Write email button
  const writeEmailSelector = '[role="region"] > div > div:nth-child(2) > div > div  > button'
  await this.page.waitForSelector(writeEmailSelector);
  await this.page.click(writeEmailSelector);

  // Type in email address of Recipient
  const recipientSelector = '[role="complementary"]:nth-child(2) > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > input';
  await this.page.waitForSelector(recipientSelector);
  await this.page.type(recipientSelector, 'echorus78@gmail.com');
  await this.page.keyboard.press("Enter");

  // Type in subject
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  subject = ""
  for (var i=0; i < 5;i++){
      subject += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  await this.page.waitForSelector(".ms-TextField-field");
  await this.page.type(".ms-TextField-field",subject);

  // Press ctrl+enter to send email.
  await this.page.keyboard.down("Control");
  await this.page.keyboard.press("Enter");
  await this.page.keyboard.up("Control");
});

Then('It should appear in sent emails.', async function () {
  // Click on Sent messages tab.
  const sentMessagesSelector = '[role="tree"]:nth-child(3) > div:nth-child(5)'
  await this.page.waitForSelector(sentMessagesSelector);
  
  // Delay of 5000ms should solve the problem of clicking on sent mails before outlook actually sends the mail.
  await this.page.click(sentMessagesSelector ,{delay: 5000});

  // Check if there are any email in the list and if so then check if its the last sent one and then delete all.
  await this.page.waitForSelector('[data-convid]',{timeout:5000});
  const sentEmailsSelector = '[data-convid] > div > div > div > div > div:nth-child(2) > div > div'
  await this.page.waitForSelector(sentEmailsSelector);
  const potentialSubject = await this.page.$eval((sentEmailsSelector), div => div.textContent);
  assert.strictEqual(potentialSubject,subject);

  // Click on the dump folder button and confirm it
  await this.page.click('[role="menuitem"]', {delay: 1000});
  await this.page.waitForSelector('#ok-1');
  await this.page.click('#ok-1', {delay: 1000});
  
  const noSentMessagesSelector = "#app > div > div:last-child > div:nth-child(2) > div > div > div > div:nth-child(3) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > img"
  await this.page.waitForSelector(noSentMessagesSelector)

  });