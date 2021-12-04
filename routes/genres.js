const express = require("express");
const { Genre, validate } = require("../models/genres");

const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.post("/", async (req, res) => {
  try {
    await validate(req.body);

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
    await validate(req.body);

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

module.exports = router;
