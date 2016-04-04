var
  express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  path = require('path'),
  userRoutes = require('./routes/users.js'),
  movieRoutes = require('./routes/movies.js')

  var db = 'mongodb://localhost/moviesapp'

  mongoose.connect(db, function(err){
  if (err) return console.log(err)
  console.log('Connected to database ' + db)
})

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Static Files
app.use(express.static(path.join(__dirname,'public')))

// User Routes
app.use('/', userRoutes)

// Movie Routes
app.use('/', movieRoutes)

// Root Path -- if you go to any route besides /teams it'll send index.html File
app.get('*', function(req,res){
  res.sendFile(__dirname + 'public/index.html')
})

var PORT = process.env.PORT || 3000
app.listen(PORT, function(){
  console.log('Server is listening on Port ' + PORT)
})
