const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const httpStatusText = require("./utils/httpStatusText");
const path = require("path");

// Import All Applications Routers
const coursesRouter = require("./routes/coursesRoutes");
const UsersRouter = require("./routes/usersRoutes");

// Initialize The App:
const app = express();
require("dotenv").config();

// Using Mongoose to Connect to MongoDB
const mongoose = require("mongoose");
// Remote Database Server
const url = process.env.MONGODB_URL;
// Local Database Server
// const url = "mongodb://localhost:27017/";
mongoose.connect(url).then(() => {
  console.log(`Connected To Database Successfully`);
});

/*
To Disconnect With The Database:
mongoose.disconnect().then(() => {
  console.log(`Disconnected From Database Successfully`);
});
*/

// Apply All MiddleWares:
app.use(cors());
app.use(bodyParser.json()); // OR: app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "images")));

// Mount All Application Routers
app.use("/api/courses", coursesRouter);
app.use("/api/users", UsersRouter);

app.get("/", (req, res) => {
  res.json({
    status: httpStatusText.SUCCESS,
    message: "HELLO WORLD FROM EXPRESS PROJECT",
  });
});

// Global Middleware To Handle Undefined Routes:
app.use((req, res) => {
  res.status(404).json({
    status: httpStatusText.ERROR,
    message: `Route ${req.originalUrl} Not Found !!`,
  });
});

// Global Error Handler Middleware:
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message || "Internal Server Error",
  });
});

// Start The Server
app.listen(process.env.PORT || 3000, () => {
  console.log(`App Started on Port: ${process.env.PORT}`);
});
