const mongoose = require("mongoose");
const studentschema = mongoose.Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  profile: {
    type: String,
  },
  email: {
    type: String,
  },
});
module.exports = mongoose.model("student", studentschema);
