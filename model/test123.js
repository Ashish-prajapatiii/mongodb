const mongoose = require("mongoose");

const testschema = mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: String,
  },
});
module.exports = mongoose.model("test", testschema);
