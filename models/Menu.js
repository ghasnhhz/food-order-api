const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
  district: {
    type: String,
  },
  street: {
    type: String,
    lowercase: true,
  },
  apartmentNo: {
    type: Number,
    min: 0
  }, 
  telNo: {
    type: Number,
    min: 9,
  }
})

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: String,
  count: {
    type: Number,
  },
  totalCost: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  address: addressSchema,
  
})

module.exports = mongoose.model("menu", menuSchema)
