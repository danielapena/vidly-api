const express = require("express");

const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.post("/", async (req, res) => {
  try {
    await validate(req.body);

    const genreId = req.body.genreId;
    const genre = await Genre.findById(genreId);

    if (!genre) {
      return res.status(400).send("Invalid Genre");
    }

    let movie = new Movie({
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
    });

    movie = await movie.save();
    res.send(movie);
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

router.put("/:id", async (req, res) => {
  try {
    await validate(req.body);

    const id = req.params.id;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).send("The Movie was not found");
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
      return res.status(404).send("The Genre was not found");
    }

    movie.set({
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
    });

    const result = await movie.save();
    res.send(result);
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

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await Movie.findByIdAndRemove(id);

    if (!movie) {
      res.status(404).send("The Movie was not found");
    }

    res.send(movie);
  } catch (error) {
    res.status(400).send((error && error.message) || error);
  }
});

module.exports = router;
