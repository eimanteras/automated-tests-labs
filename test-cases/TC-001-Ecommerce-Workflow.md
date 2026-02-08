# TC-001: E-Commerce Workflow – Add Items Above Price Threshold

Target Application: https://demowebshop.tricentis.com/
This test case covers an end-to-end shopping workflow including dynamic item selection based on price.

**Test Case ID:** TC-001  
**Title:** E-Commerce Workflow with Dynamic Price Selection  
**Module:** Shopping Cart  
**Priority:** High  
**Author:** Your Name  
**Version:** 1.0  
**Preconditions:** User is registered, logged in, and cart is empty  
**Postconditions:** User logs out and cart is cleaned  
**Test Data:** Email, password, price threshold  
**Environment:** Playwright + Chromium  
**Expected Result:** Items above threshold are added and totals are correct  

## Test Steps

1. Open browser.
2. Navigate to https://demowebshop.tricentis.com/.
3. Verify homepage title.
4. Click “Log in”.
5. Enter email.
6. Enter password.
7. Click “Log in” button.
8. Verify login success.
9. Open shopping cart.
10. Remove all items if present.
11. Return to homepage.
12. Navigate to category (e.g., Books).
13. Read all product tiles.
14. Extract price of each product.
15. Identify products above threshold.
16. Add first qualifying product to cart.
17. Add second qualifying product to cart.
18. Open shopping cart.
19. Verify at least 2 items present.
20. Verify each item price > threshold.
21. Verify arithmetic total.
22. Update quantity of one item.
23. Verify updated total.
24. Proceed to checkout.
25. Verify checkout page loads.
26. Log out.
27. Verify logout success.
