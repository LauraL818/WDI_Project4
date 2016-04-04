var
  express = require('express'),
  authRouter = express.Router(),
  userCtrl = require('../controllers/user.js')

authRouter.route('/register')
  .post(userCtrl.create)

authRouter.route('/authenticate')
  .post(userCtrl.authenticate)

module.exports = authRouter
