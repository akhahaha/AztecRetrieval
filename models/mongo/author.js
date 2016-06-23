var mongoose = require('mongoose');

var authorSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String
});

module.exports = mongoose.model('Author', authorSchema);
