const { Customer, validate } = require("../models/customer");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.post("/", async (req, res) => {
  try {
    await validate(req.body);

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
    await validate(req.body);

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
    await customer.save();

    res.send(customer);
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

module.exports = router;
