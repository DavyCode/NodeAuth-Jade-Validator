var mongoose = require('mongoose');
// var db = mongoose.connection;
var bcrypt = require('bcrypt');
//User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

// compare password
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    })
}

module.exports.getUserById = function(username, callback) {
    User.findById(id, callback);
}


module.exports.getUserByUsername = function(username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
}


module.exports.createUser = function(newUser, callback) {
    bcrypt.hash(newUser.password, 10, function(err, hash) {
        if (err) throw err;
        // Set hashed pw
        newUser.password = hash;
        // Create User 
        newUser.save(callback);
    });
}