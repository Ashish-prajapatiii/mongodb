const mongoose = require("mongoose");
const schemaproduct = mongoose.Schema({
  product_name: {
    type: "string",
  },

  product_name: {
    type: "string",
  },
  product_price: {
    type: "string",
  },
  product_details: {
    type: "string",
  },
});
module.exports = mongoose.model("product", schemaproduct);
