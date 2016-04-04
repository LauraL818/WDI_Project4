var
  express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  path = require('path'),
  userRoutes = require('./routes/users.js'),
  movieRoutes = require('./routes/movies.js'),
  authRoutes = require('./routes/auth.js'),
  jwt = require('jsonwebtoken'),
  config = require('./config.js'),
  User = require('./models/User.js')

  var db = config.database

  mongoose.connect(db, function(err){
  if (err) return console.log(err)
  console.log('Connected to database ' + db)
})

app.set('superSecret', config.secret); // secret variable

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// Static Files
app.use(express.static(path.join(__dirname,'public')))

// Movie Routes
app.use('/movies', movieRoutes)

// User Routes
app.use('/auth', authRoutes)

// route middleware to verify token
app.use(function(req, res, next){
  // check header or url parameters or post parameters for a token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token){
    res.json({
      success: false,
      message: 'you need a token to play at ChuckeCheese'});
  } else {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err){
        return res.json({
          success: false,
          message: 'That token is not legit'
        });
      } else {
        // everything is good with the token, then save it to the req in other routes
        req.decoded = decoded;
        next();
      }
    });
  }
});

// User Routes
app.use('/users', userRoutes)

// Root Path -- if you go to any route besides / it'll send index.html File
app.get('*', function(req,res){
  res.sendFile(__dirname + '/public/index.html')
})


var PORT = process.env.PORT || 3000
app.listen(PORT, function(){
  console.log('Server is listening on Port ' + PORT)
})
