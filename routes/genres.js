const express = require("express");
const Joi = require("joi");

const router = express.Router();

let genres = [
  {
    id: 1,
    name: "Action",
  },
  {
    id: 2,
    name: "Comedy",
  },
  {
    id: 3,
    name: "Drama",
  },
];

router.get("", (req, res) => {
  res.send(genres);
});

router.post("", async (req, res) => {
  try {
    await validateGenreAsync(req.body);

    const genre = {
      id: genres.length + 1,
      name: req.body.name,
    };
    genres.push(genre);

    res.send(genre);
  } catch (error) {
    res.status(400).send(error.details.map((e) => e.message) || error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    await validateGenreAsync(req.body);
    const id = parseInt(req.params.id);

    const genre = genres.find((g) => g.id === id);

    if (!genre) {
      return res.status(404).send("The Genre was not found");
    }

    genre.name = req.body.name;

    res.send(genre);
  } catch (error) {
    res.status(400).send(error.details.map((e) => e.message) || error);
  }
});

router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const genre = genres.find((g) => g.id === id);

  if (!genre) {
    return res.status(404).send("The Genre was not found");
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

async function validateGenreAsync(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return await schema.validateAsync(course);
}

module.exports = router;
