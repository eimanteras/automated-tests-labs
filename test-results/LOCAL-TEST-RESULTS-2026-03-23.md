# Local Automated Test Results

- Date: 2026-03-23
- Project: `automated-tests-labs`
- Command: `npm run test:all`
- Framework: Playwright

## Summary
- Total: 8
- Passed: 8
- Failed: 0
- Duration: ~37.3s

## Passed Tests
1. `tests/home-page.spec.ts` - Home page opens
2. `tests/ecommerce.spec.ts` - TC-001: Add items above price threshold to cart
3. `tests/Task2.1.spec.ts` - TC-001: Add items above price threshold to cart
4. `tests/Task2.2.spec.ts` - Automate Web Tables page
5. `tests/Task3.1.spec.ts` - Progress Bar Synchronization Test
6. `tests/Task3.2.spec.ts` - Dynamic Properties Test
7. `tests/Task4.1.spec.ts` - Add "Computing and Internet" (qty 1) for eimanteras+demo@gmail.com
8. `tests/Task4.1.spec.ts` - Add "14.1-inch Laptop" (qty 1) for eimanteras+demo2@gmail.com

## Notes
- `ecommerce` test stabilized by explicit product price parsing and add-to-cart success validation.
- No fixed sleeps remain in synchronization-critical tests.
