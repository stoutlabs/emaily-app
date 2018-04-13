# Emaily - A React/Redux Email Survey App

This somewhat complex app was built for an online course taught by Stephen Grider: _Node with React: Fullstack Web Development_

---

**Description:**

The app flow is as follows:

1.  A user wants to send out a mass email to get feedback for their company's service/product. They visit the app URL.
2.  The visitor authenticates via a Google Auth page, and is returned to the app as a new user.
3.  The user adds tokens/credits to their account by clicking the 'add credits' button. A stripe payment pop-up collects money from the user.
4.  Once the payment processes (in a few seconds), the user is immediately credited to their account.
5.  User clicks the big '+' button to create a new survey. (This was kept basic for this app, but could easily be expanded. _e.g. mass import of email addresses via CSV file_)
6.  The survey details are confirmed, and then sent out via SendGrid's API. A credit is removed from the user's account.
7.  A webhook is running to catch event notifications from SendGrid. Clicks to the survey replies are stored in the (MongoDB) database for the appropriate survey and recipient. (Other info could also be tracked, such as bounces and opens.)
8.  The creator of the survey can view response tallies for their survey(s) at any time via the app dashboard.

---

**Features:**

* Node.js / Express.js backend
* React / Redux frontend
* Google OAuth authentication
* Stripe API payments
* MongoDB data storage
* SendGrid API for mass emails and click tracking
* "Wizard" style form for creating surveys
* Basic stying via Materialize CSS

---

**Notes:**

I definitely learned a TON from this course! My overall React/Redux comfort increased dramatically. I'm looking forward to taking this knowledge elsewhere, to build some interesting things in the near future!
