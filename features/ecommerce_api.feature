Feature: E-commerce API Testing
  As a developer
  I want to test the e-commerce API endpoints
  So that I can ensure the online store functions correctly

  Background:
    Given the API is available

  @api @smoke @products
  Scenario: Get all products
    When I request all products
    Then I should receive a list of products
    And each product should have required fields

  @api @smoke @products
  Scenario: Get a specific product by ID
    Given a product exists with ID 1
    When I request product with ID 1
    Then I should receive the product details
    And the product should have a valid price

  @api @regression @products
  Scenario: Search products by category
    When I search for products in category "electronics"
    Then I should receive products in electronics category
    And all returned products should belong to electronics

  @api @smoke @cart
  Scenario: Add product to cart
    Given I have an empty cart
    When I add product ID 1 to the cart
    Then the cart should contain 1 item
    And the cart total should be updated

  @api @regression @cart @validation
  Scenario: Add invalid product to cart
    Given I have an empty cart
    When I try to add product ID 99999 to the cart
    Then I should receive an error message
    And the cart should remain empty

  @api @regression @orders
  Scenario Outline: Create order with different quantities
    Given I have a cart with product ID 1
    When I create an order with quantity <quantity>
    Then the order should be created successfully
    And the order total should be <expected_total>

    Examples:
      | quantity | expected_total |
      | 1        | 109.95        |
      | 2        | 219.90        |
      | 5        | 549.75        |

  @api @security @auth
  Scenario: Access protected endpoint without authentication
    When I try to access my order history without authentication
    Then I should receive an unauthorized error
    And the response should suggest authentication

  @api @performance @products
  Scenario: Product API response time
    When I request all products
    Then the response should be received within 2 seconds
    And the response should contain at least 10 products