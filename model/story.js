const mongoose = require("mongoose");
const storyschema = mongoose.Schema({
  author_name: {
    type: String,
  },
  title: {
    type: String,
  },
  fan_name: {
    type: String,
  },
  book_name: {
    type: String,
  },
  c_id: {
    type: String,
  },
});
module.exports = mongoose.model("story", storyschema);
