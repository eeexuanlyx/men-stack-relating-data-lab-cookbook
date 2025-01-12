const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const isSignedIn = require("./middleware/is-signed-in.js");
const session = require("express-session");
const authRouter = require("./routers/auth.js");
const foodsRouter = require("./routers/food.js");
const Food = require("./models/Food.js");
const User = require("./models/user.js");
const authController = require("./controllers/auth.js");
const path = require("path");

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});

app.get("/user/food", (req, res) => {
  res.render("user/form.ejs");
});

app.get("/user/pantry", async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) {
    return res.status(404).send("User not found");
  }

  res.render("user/pantry", { pantry: user.pantry });
});

app.use("/auth", authController);

app.use("/auth", authRouter);
app.use(isSignedIn);
app.use("/users/foods", foodsRouter);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
