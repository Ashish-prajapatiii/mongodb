const mongoose = require("mongoose");
const regschema = mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: String,
  },
  collage: {
    type: String,
  },
  gmail: {
    type: String,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 12,
  },
  otp: {
    type: String,
  },
  r_id: {
    type: String,
  },
});

module.exports = mongoose.model("reg", regschema);
