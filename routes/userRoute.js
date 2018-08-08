let mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var User = require('../app/models/user'); // get our mongoose model

function getAllUsers (req, res) {
	User.find({}, function (err, users) {
		res.json(users);
	});
}

module.exports = {getAllUsers};