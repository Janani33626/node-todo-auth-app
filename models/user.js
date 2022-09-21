const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    unique: true,
  },
  password: { type: String, required: true, minlenth: 7, maxlength: 1024 },
});

const User = mongoose.model("User", userSchema);

exports.User = User;
