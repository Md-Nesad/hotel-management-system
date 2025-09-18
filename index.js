const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // import cors package
const blogHandler = require("./routes/blogHandler");
const userHandler = require("./routes/userHandler");
const bookingRoute = require("./routes/bookingRoute");
// express app initialization
const app = express();
dotenv.config()
app.use(express.json());


// Enable CORS for all routes
app.use(cors());  
// database connection with mongoose
mongoose
  .connect("mongodb://localhost/webApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

// application routes
 app.use("/blog", blogHandler);
 app.use("/user", userHandler);
 app.use("/api", bookingRoute);

// default error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.use(errorHandler);

app.listen(5000, () => {
  console.log("app listening at port 5000");
});
