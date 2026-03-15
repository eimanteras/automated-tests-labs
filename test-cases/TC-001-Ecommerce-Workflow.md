# TC-001: E-Commerce Workflow – Add Items Above Price Threshold

Target Application: https://demowebshop.tricentis.com/
This test case covers an end-to-end shopping workflow including dynamic item selection based on price.

**Test Case ID:** TC-001  
**Title:** E-Commerce Workflow with Dynamic Price Selection  
**Module:** Shopping Cart  
**Priority:** High  
**Author:** eimanteras 
**Version:** 1.0  
**Preconditions:** User is registered, logged in, and cart is empty  
**Postconditions:** User logs out and cart is cleaned  
**Test Data:** Email, validPassword, price threshold  
**Environment:** Latest Chrome Version Chrome version from 86 to latest  
**Expected Result:** Items above threshold are added and totals are correct  

# TC‑001: E‑Commerce Workflow – Add Items Above Price Threshold

## Test Steps (20 UI Actions)

1. Navigate to https://demowebshop.tricentis.com/.
2. Click “Log in”.
3. Enter email.
4. Enter password.
5. Click the “Log in” button.
6. Open the shopping cart.
7. Select all “Remove” checkboxes.
8. Click “Update shopping cart”.
9. Return to the homepage.
10. Open the “Books” category.
11. Click on a book that has an “Add to cart” button.
12. Click “Add to cart”.
13. Return to the Books category.
14. Click on another book that has an “Add to cart” button.
15. Click “Add to cart”.
16. Open the shopping cart again.
17. Change the quantity of the first book.
18. Click “Update shopping cart”.
19. Check the “I agree to the terms of service” checkbox.
20. Click “Checkout”. 
21. Click “Log out”.

---

## Test Step Expected Results

**1. Navigate to the home page**  
- Page loads successfully and title matches “Demo Web Shop”.

**2. Click “Log in”**  
- Login form becomes visible.

**3. Enter email**  
- Email field contains the entered value.

**4. Enter password**  
- Password field is filled and masked.

**5. Click the “Log in” button**  
- User is redirected to homepage.  
- Logged‑in username becomes visible.

**6. Open the shopping cart**  
- Shopping cart page loads.

**7. Select all “Remove” checkboxes**  
- All checkboxes become checked.

**8. Click “Update shopping cart”**  
- Cart becomes empty.

**9. Return to the homepage**  
- Homepage loads again.

**10. Open the “Books” category**  
- Books category page loads.

**11. Click on a book with “Add to cart”**  
- Book details and price are visible.

**12. Click “Add to cart”**  
- Confirmation message appears:  
  “The product has been added to your shopping cart”.

**13. Return to the Books category**  
- Books list is displayed again.

**14. Click on another book with “Add to cart”**  
- Book details and price are visible.

**15. Click “Add to cart”**  
- Confirmation message appears again.

**16. Open the shopping cart again**   
- At least one row exists.

**17. Change the quantity of the first book**  
- Quantity updates.

**18. Click “Update shopping cart”**  
- Total price changed.

**19. Check the “I agree to the terms of service” checkbox**  
- Checkbox becomes checked.

**20. Click “Checkout”**
- Checkout page loads.  

**21. Click “Log out”**
- “Log in” link is visible again.