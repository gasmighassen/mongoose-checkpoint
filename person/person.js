const mongoose = require("mongoose");
const { Schema } = mongoose;

const personSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  favoriteFoods: { type: [String] },
});

module.exports = mongoose.model("person", personSchema);
