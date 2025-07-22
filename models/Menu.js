const mongoose = require("mongoose")

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
})

module.exports = mongoose.model("Menu", menuSchema)
