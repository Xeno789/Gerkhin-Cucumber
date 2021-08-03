const assert = require('assert');
const {
  When,
  Then,
  setDefaultTimeout
} = require('@cucumber/cucumber');

setDefaultTimeout(30 * 1000);
var subject = ""

When('I try to send an email.', async function () {
  // Click on write email button
  const writeEmailButtonXpath = '//*[@id="app"]/div/div[2]/div[2]/div[1]/div/div/div[1]/div[1]/div[2]/div/div/button'
  const writeEmailButton = await this.page.waitForXPath(writeEmailButtonXpath);
  await writeEmailButton.click();

  // Type in email address of Recipient
  const recipientInputXpath = '//*[@id="ReadingPaneContainerId"]/div/div/div/div[1]/div[1]/div[1]/div/div[1]/div/div[1]/div/div/div[2]/div[2]/input';
  const recipientInput = await this.page.waitForXPath(recipientInputXpath);
  await recipientInput.type(this.targetEmail);
  await this.page.keyboard.press("Enter")

  // Type in subject
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++) {
    subject += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  const subjectInputXpath = '//*[@id="ReadingPaneContainerId"]/div/div/div/div[1]/div[1]/div[3]/div[2]/div/div/div/input';
  const subjectInput = await this.page.waitForXPath(subjectInputXpath);
  await subjectInput.type(subject);

  // Press send email button
  const sendMailButtonXpath = '//*[@id="ReadingPaneContainerId"]/div/div/div/div[1]/div[3]/div[2]/div[1]/div/span/button[1]'
  const sendMailButton = await this.page.waitForXPath(sendMailButtonXpath);
  await sendMailButton.click();
});

Then('It should appear in sent emails.', async function () {
  // Click on Sent messages tab.
  const sentMessagesButtonXpath = '//*[@id="app"]/div/div[2]/div[2]/div[1]/div/div/div[1]/div[2]/div/div[1]/div/div[2]/div[5]/div/span[1]'
  const sentMessagesButton = await this.page.waitForXPath(sentMessagesButtonXpath);
  // Delay of 5000ms should solve the problem of clicking on sent mails before outlook actually sends the mail.
  await sentMessagesButton.click({
    delay: 5000
  });

  // Check if there are any email in the list and if so then check if its the last sent one and then delete all.

  const lastSentEmailSubjectXpath = '//*[@id="app"]/div/div[2]/div[2]/div[1]/div/div/div[3]/div[2]/div/div[1]/div[2]/div/div/div/div/div/div[2]/div/div/div/div/div[2]/div/div[1]/span'
  const lastSentEmailSubject = await this.page.waitForXPath(lastSentEmailSubjectXpath, {
    timeout: 5000
  });
  const potentialSubject = await this.page.evaluate(async span => await span.innerText, lastSentEmailSubject);
  assert.strictEqual(potentialSubject, subject);

  // Click on the dump folder button and confirm it
  const dumpFolderButtonXpath = '//*[@id="app"]/div/div[2]/div[2]/div[1]/div/div/div[3]/div[1]/div/div/div/div/div/div[1]/div[1]/button';
  const dumpFolderButton = await this.page.waitForXPath(dumpFolderButtonXpath)
  await dumpFolderButton.click({
    delay: 1000
  });

  const confirmButtonXpath = '/html/body/div[12]/div/div/div/div[2]/div[2]/div/div[2]/div[2]/div/span[1]/button';
  const confirmButton = await this.page.waitForXPath(confirmButtonXpath)
  await confirmButton.click({
    delay: 1000
  });

  // Wait for deleting messages
  const noSentMessagesXpath = '//*[@id="app"]/div/div[2]/div[2]/div[1]/div/div/div[3]/div[2]/div/div[1]/div[2]/div/div/img'
  await this.page.waitForXPath(noSentMessagesXpath);
});