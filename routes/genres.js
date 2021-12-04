const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const router = express.Router();

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.post("/", async (req, res) => {
  try {
    await validateGenreAsync(req.body);

    const genre = new Genre({
      name: req.body.name,
    });

    const result = await genre.save();
    res.send(result);
  } catch (error) {
    res.status(400).send(error.details.map((e) => e.message) || error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const genre = await Genre.findById(id);

    if (!genre) {
      return res.status(404).send("The Genre was not found");
    }

    res.send(genre);
  } catch (error) {
    res.status(400).send(error.details?.map((e) => e.message) || error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    await validateGenreAsync(req.body);

    const id = req.params.id;
    const genre = await Genre.findById(id);

    if (!genre) {
      return res.status(404).send("The Genre was not found");
    }

    genre.set({ name: req.body.name });
    const result = await genre.save();

    res.send(result);
  } catch (error) {
    res.status(400).send(error.details?.map((e) => e.message) || error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const genre = await Genre.findByIdAndRemove(id);

    if (!genre) {
      return res.status(404).send("The Genre was not found");
    }

    res.send(genre);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

async function validateGenreAsync(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return await schema.validateAsync(course);
}

module.exports = router;
