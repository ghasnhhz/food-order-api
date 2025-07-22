const connectDB = require("../db/connect")
const Menu = require("../models/Menu")

async function getMenu(req, res) {
  try {
    await connectDB()

    const { name } = req.query
  
    if (name) {
      const foods = await Menu.find({ name })

      if (foods.length === 0) {
        return res.status(200).json({message: "No foods found with that name"})
      }

      res.status(200).json(foods)
    } else {
      const menu = await Menu.find({}, {__v: 0})
    
      if (menu.length === 0) {
        return res.status(200).json({message: "No foods are available yet"})
      }

      res.status(200).json(menu)
    }
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

async function getFoodById(req, res) {
  try {
    await connectDB()

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Invalid Id"})
    }

    const food = await Menu.findById(id)
    
    if (!food) {
      res.status(404).json({message: "No food found"})
    }

    res.status(200).json(food)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

async function addFood(req, res) {
  try {
    await connectDB()
  
    const newFood = req.body

    const result = await Menu.create(newFood)

    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

async function editFood(req, res) {
  try {
    await connectDB()

    const { id } = req.params
    const editedFood = req.body
    
    const updatedFood = await Menu.findByIdAndUpdate(id, editedFood, { new: true })
    
    res.status(200).json({message: "Food is updated successfully", updatedFood})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

async function deleteFood(req, res) {
  try {
    await connectDB()

    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Invalid Id"})
    }

    const deletedFood = await Menu.findById(id)

    await Menu.findByIdAndDelete(id)

    res.status(200).json({message: "Food successfully deleted", deletedFood})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

module.exports = {getMenu, getFoodById, addFood, editFood, deleteFood}