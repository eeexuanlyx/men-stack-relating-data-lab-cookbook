const User = require("../models/user");

const postFood = async (req, res) => {
  try {
    const user = await User.findById(req.decoded.id);

    if (!user) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }

    const food = { name: req.body.name };

    user.pantry.push(food);
    await user.save();

    res.json({ status: "ok", msg: "Food added to user's pantry" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", msg: "An error occurred while adding food" });
  }
};

module.exports = { postFood };
