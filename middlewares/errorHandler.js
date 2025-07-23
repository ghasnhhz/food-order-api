const errorHandler = (err, req, res, next) => {
  console.log(err.stack)
  
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal server error"
  res.status(statusCode).json({
    message
  })
}

module.exports = errorHandler