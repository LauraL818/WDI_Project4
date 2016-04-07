  try {
    require('dotenv').config()
  } catch(ex){
    handleErr(ex)
  }

var
  express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  path = require('path'),
  logger = require('morgan'),
  userRoutes = require('./routes/users.js'),
  movieRoutes = require('./routes/movies.js'),
  authRoutes = require('./routes/auth.js'),
  jwt = require('jsonwebtoken'),
  config = require('./config.js'),
  User = require('./models/User.js')
  // dotenv = require('dotenv').load({silent:true})
// process.env.MLAB_DB_URL ||
var db =  config.database

mongoose.connect(db, function(err){
  if (err) return console.log(err)
  console.log('Connected to database ' + db)
})

app.set('superSecret', config.secret);

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(logger('dev'))
// Static Files
app.use(express.static(path.join(__dirname,'public')))

// Movie Routes
app.use('/movies', movieRoutes)

// User Routes
app.use('/auth', authRoutes)

// route middleware to verify token
app.use(function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token']
  if (!token){
    res.json({
      success: false,
      message: 'You need a token to enter'})
  } else {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err){
        return res.json({
          success: false,
          message: 'Incorrect Token'
        })
      } else {
        req.decoded = decoded;
        next()
      }
    })
  }
})

// User Routes
app.use('/users', userRoutes)

// Root Path
app.get('*', function(req,res){
  res.sendFile(__dirname + '/public/index.html')
})

var PORT = process.env.PORT || 3000
app.listen(PORT, function(){
  console.log('Server is listening on Port ' + PORT)
})
