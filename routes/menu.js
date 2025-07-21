const express = require("express")
const {getMenu, getSingleFood, addFood, editFood, deleteFood} = require("../controllers/menuController")
const router = express.Router()

router.get("/", getMenu)
router.get("/:id", getSingleFood)
router.post("/", addFood)
router.put("/:id", editFood)
router.delete("/:id", deleteFood)

module.exports = router