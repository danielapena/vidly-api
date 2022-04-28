const Joi = require("joi");
const mongoose = require("mongoose");

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

async function validateCustomerAsync(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(3).required(),
    isGold: Joi.boolean(),
  });

  return await schema.validateAsync(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomerAsync;
