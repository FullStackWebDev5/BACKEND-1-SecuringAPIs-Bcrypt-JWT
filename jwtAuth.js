const jwt = require('jsonwebtoken')

const isLoggedIn = (req, res, next) => {
  try {
    const { token } = req.headers
    const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({
      status: 'FAILED',
      message: 'You are not logged in. Please login again'
    })
  }
}

module.exports = isLoggedIn