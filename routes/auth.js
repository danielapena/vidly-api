const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const { User } = require("../models/user");

router.post("/", async (req, res) => {
  try {
    await validate(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send(token);
});

async function validate(auth) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return await schema.validateAsync(auth);
}

module.exports = router;
