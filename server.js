// get the packages we need 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./app/models/user'); // get our mongoose model

// configuration 
var port = config.port // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('secrectKey', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// routes 
const welcome = require('./routes/welcome');
const auth = require('./routes/authenticate');

app.get('/setup', welcome.setup);
app.get('/', welcome.welcome);

app.post('/authenticate', auth.authenticate);



// start the server 
app.listen(port);
console.log('Server started http://localhost:' + port);