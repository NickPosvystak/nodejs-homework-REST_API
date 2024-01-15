const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contactsRouter");
const authRouter = require("./routes/api/authRouter");
const { authenticateToken, authMiddleware } = require("./middleware");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(express.static("public"));


app.use("/api/users", authRouter);

app.use(authenticateToken, authMiddleware.protect)

app.use("/api/contacts", contactsRouter);

app.use((err, req, res, next) => {
  res.status(404).json({ message: "Nooooot found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Check if the error is an HttpError
  if (err instanceof HttpError) {
    // Send the error status and message as a response
    return res.status(err.status).json({ error: err.message });
  }

  // If it's not an HttpError, continue to the next middleware
  next(err);
});

module.exports = app;
