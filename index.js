// Imports
const express = require("express");
const app = express();
const ejs = require("ejs");
const connectDB = require("./database");
const session = require("express-session");
const flash = require("express-flash");
const MongoDBStore = require("connect-mongodb-session")(session);
const webRoutes = require("./routes/web");

require("dotenv").config();
// initialize connections
connectDB();
// session store
var store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: "sessions",
});
// Middlewares
app.set("view engine", "ejs");
app.use(express.static("./views")); //for specifying the location of css,js files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    store: store,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.message = req.flash();
  res.locals.req = req;
  next();
});

// env variables
const HOST = "127.0.0.1";
const PORT = process.env.PORT || 5000; // set PORT=8000  (for setting the port), set PORT  (for getting the port)
// Routes
app.use(webRoutes.userRoutes);
app.use(webRoutes.profileRoutes);
app.use(webRoutes.postRoutes);
// Serve
app.listen(PORT, HOST, () => {
  console.log(`Server started at http://${HOST}:${PORT}`);
});

// ,"type": "module"
