require("../models/Menu")
const mongoose = require("mongoose")
const connectDB = require("../db/connect")
const Orders = require("../models/Order")

async function getOrders(req, res) {
  try {
    await connectDB()

    const orders = await Orders.find()
      .select("-__v -createdAt -updatedAt")
      .populate({
        path: "menuItem",
        select: "-__v -createdAt -updatedAt"
      })
    if (orders.length === 0) {
      return res.status(200).json({message: "No orders found"})
    }

    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

async function getOrderById(req, res) {
  try {
    await connectDB()

    const { id } = req.params
   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Invalid Id"})
    }

    const order = await Orders.findById(id)
      .select("-__v -createdAt -updatedAt")
      .populate({
      path: "menuItem",
      select: "_id name price"
    })

    res.status(200).json(order)
  } catch (err) {
    res.status(500).json({error: err.message})
  }
}

async function addOrder(req, res) {
  try {
    await connectDB()

    const order = req.body

    if (!order) {
      return res.status(400).json({message: "Nothing is ordered"})
    }

    const result = await Orders.create(order)
    res.status(201).json({
      message: "Your food is successfully added to the orders queue.",
      orderId: result.insertedId
    })
  } catch (err) {
    res.status(500).json({error: err.message})
  }
}

async function editOrder(req, res) {
  try {
    await connectDB()

    const { id } = req.params
    const editedOrder = req.body
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Invalid Id"})
    }

    const updatedOrder = await Orders.findByIdAndUpdate(id, editedOrder, { new: true })
    
    res.status(200).json({message: "Order successfully updated", updatedOrder})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

async function deleteOrder(req, res) {
  try {
    await connectDB()

    const { id } = req.params
    console.log(id)
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Invalid Id"})
    }

    const deletedOrder = await Orders.findById(id)

    await Orders.findByIdAndDelete(id)

    res.status(200).json({message: "Order successfully deleted", deletedOrder})
  } catch (err) {
    res.status(500).json({error: "Interval server error"})
  }
}
module.exports = {getOrders, getOrderById, addOrder, editOrder, deleteOrder}