let config = require('../config');

function setup (req, res) {

    // create a sample user
    var record = new User({
        name: 'vikask',
        password: '12345678',
        admin: true
    });
    record.save(function (err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({
            success: true
        });
    });
}

function welcome (req, res) {
    res.send(`server is running at http://localhost: ${ config.port }/api`);
}

module.exports = {setup,welcome}