Feature: User Authentication
  As a user of the application
  I want to be able to login with my credentials
  So that I can access my account and use the application features

  Background:
    Given I am on the login page

  @smoke @web @login
  Scenario: Successful login with valid credentials
    Given I have valid user credentials
    When I enter my email address
    And I enter my password
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message

  @regression @validation @login
  Scenario: Login with empty email
    When I leave the email field empty
    And I enter a valid password
    And I click the login button
    Then I should see an "Email is required" error message
    And I should remain on the login page

  @regression @validation @login
  Scenario: Login with invalid email format
    When I enter an invalid email format "invalid-email"
    And I enter a valid password
    And I click the login button
    Then I should see an "Please enter a valid email" error message
    And I should remain on the login page

  @regression @validation @login
  Scenario: Login with empty password
    When I enter a valid email address
    And I leave the password field empty
    And I click the login button
    Then I should see a "Password is required" error message
    And I should remain on the login page

  @regression @security @login
  Scenario: Login with invalid credentials
    When I enter an invalid email address
    And I enter an invalid password
    And I click the login button
    Then I should see an "Invalid credentials" error message
    And I should remain on the login page

  @regression @feature @login
  Scenario: Remember me functionality
    Given I have valid user credentials
    When I enter my email address
    And I enter my password
    And I check the "Remember me" checkbox
    And I click the login button
    Then I should be redirected to the dashboard
    When I logout and return to the login page
    Then my email should be pre-filled

  @regression @feature @login
  Scenario: Forgot password functionality
    When I click the "Forgot Password" link
    Then I should be redirected to the password reset page
    And I should see password reset instructions

  @mobile @login
  Scenario: Mobile login functionality
    Given I am using a mobile device
    When I enter valid credentials
    And I tap the login button
    Then I should successfully login
    And the mobile interface should be responsive

  @accessibility @login
  Scenario: Login form accessibility
    Then the login form should have proper labels
    And form fields should have appropriate ARIA attributes
    And the form should be keyboard navigable
    And touch targets should meet minimum size requirements

  @performance @login
  Scenario: Login performance
    Given I have valid user credentials
    When I complete the login process
    Then the login should complete within 3 seconds
    And the dashboard should load within 5 seconds

  @security @login
  Scenario Outline: Multiple failed login attempts
    When I attempt to login with invalid credentials <attempts> times
    Then the account should be temporarily locked
    And I should see a security warning message

    Examples:
      | attempts |
      | 3        |
      | 5        |

  @data-driven @login
  Scenario Outline: Data-driven login testing
    When I login with email "<email>" and password "<password>"
    Then I should see the result "<expectedResult>"

    Examples:
      | email                    | password      | expectedResult      |
      | valid@example.com        | ValidPass123! | success            |
      | invalid@example.com      | WrongPass123  | invalid_credentials |
      | test@example.com         |               | password_required   |
      |                          | ValidPass123! | email_required      |
      | invalid-email-format     | ValidPass123! | invalid_email       |