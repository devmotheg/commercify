# Commercify

Very basic implementation of an E-Commerce store, take your time testing it :^)

## Table of contents

- [Features](#features)
- [TODOS](#todos)
- [Author](#author)

## Features

- Log in & register functionality for users.
- Users can buy products then review them.
- Users can sell their own products after creating them and see the analytics for them.
- Automatic cart synchronisation between UI, LS, & DB.
- Integrated payment gateway (Stripe).
- Image presisting (storing them on Cloudinary cloud instead of relying on Heroku's dyno file system).

## TODOS

1. Add more filters (sorts, ranges, advanced search, etc...) to home page.
2. Send emails (SendGrid or Mailgun).
3. Map analytics for seller.
4. Integrate a dummy shipping API to add orders history with tracking.
5. Allow users to pick their location by using a map when filling shipping details (Mapbox or Goolge Maps).
6. Currency conversion.
7. When user hovers on rating, expand it and show more details (like Amazon).
8. Add breadcrumbs.
9. Either allow HTML (WATCHOUT FROM XSS) or markdown for product description!
10. Add images to reviews.
11. Ability to mark reviews as helpful.
12. Advanced filtering & sorting for reviews.
13. Redirect you to wherever you signed in from instead of home page (after signing in).
14. Ease navigation (e.g. if you're the seller you can navigate to product managing page from product page and vice versa).
15. Increase review's comment length & add a "Read More" button if the comment is too long.
16. Add an indicator for user mutations (edits, deletes, etc...).
17. Tabs under product, one for reviews, the other is for FAQs (questions by customers, answers by seller).
18. Add more date details (e.g. when displaying products/reviews, show when it was created/modified).
19. Have meaningful messages in API responses.
20. Make cart page windowed? (For when I expand the capacity to 1k, more like never; lol!)
21. Complete the product variations flow (e.g. sizes, colors, etc...).
22. Add buy now functionality. (Again... like Amazon.)
23. Improve the cart update before browser close logic!
24. Add more analytics such (e.g. amount of carting, product clicks, etc...).
25. Make analytics page more flexible/customizable.
26. Add more useful notifications/alerts (e.g. when the product is created, review is registered, etc...).
27. Delete images from Cloudinary when their corresponding product is deleted. (Automatic clean up!)

## Author

See more projects - [@devmotheg](https://github.com/devmotheg?tab=repositories)
