const auth = require("../controllers/auth.controller");
const authController = require("../controllers/auth.controller");
const bookingController = require("../controllers/booking.controller");
const viewController = require("../controllers/view.controller");

const routeFeatures = require("../utils/routeFeatures");

const router = require("express").Router();

const useRoute = new routeFeatures(__dirname);

if (process.env.NODE_ENV === "development") {
  useRoute.writeDocsAPI();
  useRoute.mapToSwagger();
}

Array.from(useRoute.Routes).forEach((route) => {
  // * 1) Check and manage middleware
  if (!route.middleware) route.middleware = [];
  // * 2) Check permissions isused
  if (route.authPermissions && route.authPermissions.length > 0)
    route.middleware = [auth.restrictTo(...route.authPermissions), ...route.middleware];
  // * 3) Check isused authorize
  if (route.auth) route.middleware = [auth.protect, ...route.middleware];
  router[route.method](route.route, ...route.middleware, (req, res, next) => {
    try {
      route.controller(req, res, next);
    } catch (err) {
      next(err);
    }
  });
});

router.get(
  "/booking",
  authController.isLoggedIn,
  bookingController.createBookingCheckout,
  viewController.getOverview
); 

module.exports = router;

module.exports.useRoute = useRoute;
