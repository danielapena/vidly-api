const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

async function validateGenreAsync(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return await schema.validateAsync(genre);
}

exports.Genre = Genre;
exports.validate = validateGenreAsync;
