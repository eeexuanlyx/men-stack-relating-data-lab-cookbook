const express = require("express");
const { postFood } = require("../controllers/food");
const isSignedIn = require("../middleware/is-signed-in");
const router = express.Router();

router.post("/", isSignedIn, postFood);

module.exports = router;
