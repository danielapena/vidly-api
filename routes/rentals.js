const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const Fawn = require("fawn");

const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");

const router = express.Router();

Fawn.init(config.get("dbConnection")); // TODO: Fix this, it's breaking when calling mongoose from require import Fawn.init(mongoose)

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-rentedOn");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  try {
    await validate(req.body);

    const movie = await Movie.findById(req.body.movieId);

    if (!movie) {
      return res.status(404).send("Invalid Movie");
    }

    const customer = await Customer.findById(req.body.customerId);

    if (!customer) {
      return res.status(404).send("Invalid Customer");
    }

    if (movie.numberInStock === 0) {
      return res.status(400).send("Movie not in stock");
    }

    const rental = new Rental({
      customer: {
        _id: customer.id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie.id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
      daysRented: req.body.daysRented,
      totalAmount: req.body.daysRented * movie.dailyRentalRate,
    });

    try {
      new Fawn.Task()
        .save("rentals", rental)
        .update(
          "movies",
          { _id: movie._id },
          {
            $inc: { numberInStock: -1 },
          }
        )
        .run();
    } catch (error) {
      res.status(500).send("Something failed");
    }

    res.send(rental);
  } catch (error) {
    res
      .status(400)
      .send(
        (error &&
          error.details &&
          error.details.map((error) => error.message)) ||
          error
      );
  }
});

module.exports = router;
