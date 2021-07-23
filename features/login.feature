Feature: login
  Everybody wants to be able to login to their email

  Scenario: succeeded_login
    When I try to login with valid informations.
    Then I should be logged in.


  Scenario: non_existant_email_login
    When I try to login with non-existant email.
    Then I should be stucked on the email screen.

  Scenario: wrong_password_login
    When I try to login with wrong password.
    Then I should be stucked on the password screen.