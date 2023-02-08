require("dotenv").config();
const mongoose = require("mongoose"); 

const logger = require("./src/utils/logger");

// const mongoConnectionString = process.env.DATABASE.replace(
//   "<USER>:<PASSWORD>",
//   `${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}`
// );
const mongoConnectionString = process.env.DATABASE_LOCAL;

mongoose
  .connect(mongoConnectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => logger.info("Database connection successfully!"));

const app = require("./app");

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.clear();
  logger.info("listening on port: " + PORT);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shuting down..");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shuting down..");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
