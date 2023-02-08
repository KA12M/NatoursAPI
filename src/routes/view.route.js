const express = require("express");
const viewsController = require("../controllers/view.controller");
const authController = require("../controllers/auth.controller");
const bookingController = require("../controllers/booking.controller");

const router = express.Router();

router.use(viewsController.alerts);

router.get(
  "/",
  authController.isLoggedIn,
  bookingController.createBookingCheckout,
  viewsController.getOverview
);

router.get("/", authController.isLoggedIn, viewsController.getOverview);

router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/me", authController.protect, viewsController.getAccount);

router.get("/my-tours", authController.protect, viewsController.getMyTours);

router.post("/submit-user-data", authController.protect, viewsController.updateUserData);

module.exports = router;
