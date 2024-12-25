if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();
const path = require("path");

const recipeRouter = require("./routes/recipe");
const ingredientRouter = require("./routes/ingredients");
const InstractionRouter = require("./routes/instractions");

const mongoose = require("mongoose");
const cors = require("cors");
const Instraction = require("./models/instractionsModel");

app.set("views", path.join(__dirname, "views"));
router.use(express.static(path.join(__dirname, "./web/dist")));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// app.use(
//   cors({
//     origin: [
//       "https://image-frontend-amber.vercel.app",
//       "https://melodious-cannoli-496acf.netlify.app",
//       "http://localhost:5173",
//     ],
//     methods: ["POST", "GET", "DELETE", "PUT"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(
  cors({
    origin: "*",
  })
);

router.get("/", (req, res) => {
  res.send("App is running1..");
});

main()
  .then(() => {
    console.log("connection is done");
  })
  .catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("server connection is successful");
  } catch (err) {
    console.log("server connection is failed", err);
  }
}

router.use("/recipes", recipeRouter);
// app.param("id", (req, res, next, id) => {
//   req.recipeId = id;
//   next();
// });

router.use("/recipes", ingredientRouter);
router.use("/recipes/:id/ingredients", ingredientRouter);
router.use("/recipes/:id/instraction", InstractionRouter);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
