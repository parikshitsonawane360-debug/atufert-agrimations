# ATUFERT Products Store Page

## What will change
- Add a separate **Products** page that opens from “Our Products”, “Product”, “View Product”, and product arrow buttons.
- Show all 9 supplied product cans in a clean store-style grid, using each product’s matching image, name, category, and pack size.
- Make each product card selectable so the chosen product opens in a larger product view on the same Products page.
- Replace the small leaf marks in the top and bottom areas with the supplied **ATUFERT Agrimations Equipments** logo at a compact size.
- Keep the current home page look and About section intact while updating its product links to the new page.

## Page structure
- `/` — existing home page with updated logo and working Products links.
- `/products` — dedicated product catalogue with header, category filters, product grid, enlarged selected-product view, and footer.

## Technical details
- Reuse the existing CDN product images and logo already stored in the project.
- Use TanStack Router links for navigation and add unique metadata for the Products page.
- Share the product catalogue data between the home page and Products page to keep names and images consistent.
- Verify desktop and mobile layouts, every Products link, and product selection behavior in the live preview.
