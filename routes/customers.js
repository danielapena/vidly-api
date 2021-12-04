const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const router = express.Router();

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.post("/", async (req, res) => {
  try {
    await validateCustomerAsync(req.body);

    const customer = new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    });

    const result = await customer.save();
    res.send(result);
  } catch (error) {
    res.status(400).send(error.details.map((e) => e.message) || error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).send("The customer was not found");
    }

    res.send(customer);
  } catch (error) {
    res.status(400).send(error.details?.map((e) => e.message) || error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    await validateCustomerAsync(req.body);

    const id = req.params.id;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).send("The customer was not found");
    }

    customer.set({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    });
    const result = await customer.save();

    res.send(result);
  } catch (error) {
    res.status(400).send(error.details?.map((e) => e.message) || error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await Customer.findByIdAndRemove(id);

    if (!customer) {
      return res.status(404).send("The customer was not found");
    }

    res.send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

async function validateCustomerAsync(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(3).required(),
    isGold: Joi.boolean(),
  });

  return await schema.validateAsync(customer);
}

module.exports = router;
