const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookierParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize"); 

// class error exception
const AppError = require("./src/utils/appError");

const app = express();

// setting view engine
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "pug");

// * 1) GLOBAL Middleware
// Set Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Development logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: { status: "fail", message: "Too many requests from IP, Please try again in an hour!" },
});
app.use("/", limiter);

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookierParser());

// Data sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(require("cors")());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use("/", require("./src/routes/view.route"));
app.use("/api/tours", require("./src/routes/tour.route"));
app.use("/api/users", require("./src/routes/user.route"));
app.use("/api/reviews", require("./src/routes/review.route"));
app.use("/api/bookings", require("./src/routes/booking.route")); 

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(require("./src/controllers/error.controller"));

module.exports = app;
