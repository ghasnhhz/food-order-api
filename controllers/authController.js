const jwt = require("jsonwebtoken")
const User = require("../models/User")
const RefreshToken = require("../models/RefreshToken")

async function register(req, res, next) {
  try {
    const { username, password } = req.body
  
    if (!username || !password) {
      const error = new Error("username and password are required")
      error.statusCode = 400
      
      next(error)
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      const error = new Error("Username is already taken")
      error.statusCode = 409
      
      next(error)
    }

    await User.create({ username, password })
    
    res.status(201).json({message: "User registered successfully"})
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body
  
    if (!username || !password) {
      const error = new Error("username and password are required")
      error.statusCode = 400

      next(error)
    }

    const user = await User.findOne({ username })

    if (!user) {
      const error = new Error("Invalid credentials")
      error.statusCode = 401

      next(error)
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      const error = new Error("Invalid credentials")
      error.statusCode = 401

      next(error)
    }

    const accessToken = jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' })
    const refreshToken = jwt.sign({ id: user._id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id
    })

    res.status(200).json({
      message: "Successful login",
      token: accessToken,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role 
      }
    })
  } catch (err) {
    next(err)
  }
}


module.exports = {register, login}