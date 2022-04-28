const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        min: 5,
        max: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
      },
      phone: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
      },
    }),
    required: true,
  },
  rentedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  returnedOn: {
    type: Date,
  },
  daysRented: {
    type: Number,
    min: 0,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

const validateRentalAsync = async (rental) => {
  const schema = Joi.object({
    movieId: Joi.string().required(),
    customerId: Joi.string().required(),
    daysRented: Joi.number().min(1).required(),
  });

  return await schema.validateAsync(rental);
};

exports.validate = validateRentalAsync;
exports.Rental = Rental;
