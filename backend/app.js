const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const dotenv = require("dotenv").config();

const HttpError = require("./models/http-error");
const usersRoutes = require("./routes/users-routs");
console.log(dotenv.parsed);
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  next(new HttpError("Could not find that route", 404));
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500).json({
    message: error.message || "A unknown error occurred! ",
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b3jzc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT);
    console.log("CONNECTED TO DB");
  })
  .catch((err) => console.log(err));
