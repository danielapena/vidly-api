const bcrypt = require("bcrypt");
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const router = express.Router();

const { User, validate } = require("../models/user");

router.post("/", async (req, res) => {
  try {
    await validate(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send("Email is already in use");

  user = new User(_.pick(req.body, ["email", "name", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.send(_.pick(user, ["name", "email", "_id"]));
});

module.exports = router;