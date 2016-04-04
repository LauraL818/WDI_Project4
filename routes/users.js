var
  express = require('express'),
  userRouter = express.Router(),
  userCtrl = require('../controllers/user.js')

userRouter.get('/users', userCtrl.index)

module.exports = userRouter
