
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

module.exports = function() {

    mongoose.connect(uri);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', function() {
        console.log('Connected to database.');
    });

}
