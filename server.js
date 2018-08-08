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
const userRoute = require('./routes/userRoute');

app.post('/register', welcome.register);
app.get('/', welcome.welcome);

// api routes instance
var routesApi = express.Router();

routesApi.post('/authenticate', auth.authenticate);

// route middleware to authenticate and check token
routesApi.use(function (req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('secrectKey'), function (err, decoded) {
			if (err) {
				return res.json({
					success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {

		// if there is no token return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}

});

// auth routes
routesApi.get('/', function (req, res) {
	res.json({
		message: 'Welcome to Api route'
	});
});

routesApi.get('/users',userRoute.getAllUsers);

routesApi.get('/checkToken', function (req, res) {
	res.json(req.decoded);
});

app.use('/api',routesApi);
// start the server 
app.listen(port);
console.log('Server started http://localhost:' + port);