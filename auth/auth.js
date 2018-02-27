const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
  isLogin(req, res, next) {
    jwt.verify(req.headers.authorization, process.env.SECRETKEY, (err, decoded) => {
      if (!err) {
        req.user = decoded
        next()
      } else {
        res.status(500).json({ message: err })
      }
    })
  }
}