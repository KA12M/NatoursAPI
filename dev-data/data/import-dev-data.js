require("dotenv").config({ path: __dirname + "/../../.env" });

const fs = require("fs");
const mongoose = require("mongoose");

const mongoConnectionString = process.env.DATABASE.replace(
  "<USER>:<PASSWORD>",
  `${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}`
);
// const mongoConnectionString = process.env.DATABASE_LOCAL;

mongoose
  .connect(mongoConnectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log("Database connection successfully!"));

const Tour = require(__dirname + "/../../src/models/tour.model");
const User = require(__dirname + "/../../src/models/user.model");
const Review = require(__dirname + "/../../src/models/review.model");

const tours = JSON.parse(fs.readFileSync(__dirname + "/tours.json", "utf-8"));
const users = JSON.parse(fs.readFileSync(__dirname + "/users.json", "utf-8"));
const reviews = JSON.parse(fs.readFileSync(__dirname + "/reviews.json", "utf-8"));

// * IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// * DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const key = "--import";

switch (process.argv[2] || key) {
  case "--import":
    importData();
    break;
  case "--delete":
    deleteData();
    break;
  default:
    console.log("not command..");
    process.exit();
}
