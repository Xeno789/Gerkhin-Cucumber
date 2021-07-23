Feature: sending_email
  Everybody wants to be able to send an email

  @sending_email
  Scenario: sending_email
    When I try to send an email.
    Then It should appear in sent emails.