const isUserAdmin = (req, res, next) => {
  if(req.user.isAdmin) {
    next()
  } else {
    res.status(403).json({
      status: 'FAILED',
      message: 'You do not have permission to access this page'
    })
  }
}

module.exports = isUserAdmin;