const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
// const favicon = require("serve-favicon");
// const hbs = require("hbs");
const mongoose = require("mongoose");
const morgan = require("morgan");
// const path = require("path");
const cors = require("cors");
const expressValidator = require("express-validator");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect("mongodb://localhost/zambic-backend", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

// const app_name = require("./package.json").name;
// const debug = require("debug")(
//   `${app_name}:${path.basename(__filename).split(".")[0]}`
// );

const app = express();

// Middleware Setup

app.use(morgan("dev")); // does the same as having morgan -> const logger = require("morgan");
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());

// Express View engine setup

// app.use(
//   require("node-sass-middleware")({
//     src: path.join(__dirname, "public"),
//     dest: path.join(__dirname, "public"),
//     sourceMap: true
//   })
// );

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "hbs");
// app.use(express.static(path.join(__dirname, "public")));
// app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// CORS

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"] // <== this will be the URL of our React app (it will be running on port 3000)
  })
);

// Post route

app.use("/feed", require("./routes/post-route"));

// Auth route

app.use("/", require("./routes/volunteer-auth-route"));

// volunteer route

app.use("/", require("./routes/volunteers-route"));

// apiDoc
app.get("/", (req, res) => {
  fs.readFile("doc/apiDoc.json", (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }
    const doc = JSON.parse(data);
    res.json(doc);
  });
});

// Unauthorization to see certain route if not logged in
// It's pretty much error handling a bit better!

app.use(function(req, res, err, next) {
  if (err.name == "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized!" });
  }
});


// const port = process.env.PORT || 4000;
// app.listen(port, () => {
//   console.log(`API is listening on port:${port}`)
// })


module.exports = app;
