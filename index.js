const debug = require("debug")("app:startup");
const Joi = require("joi");
const logger = require("./logger");
const morgan = require("morgan");
const express = require("express");
const helmet = require("helmet");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

app.use(logger);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

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

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.post("/api/genres", async (req, res) => {
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

app.put("/api/genres/:id", async (req, res) => {
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

app.delete("/api/genres/:id", (req, res) => {
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
