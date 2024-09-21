const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI);
mongoose.connect("mongodb://127.0.0.1:27017/recipe");


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log('connected');
});

require('./category');
require('./recipe');
require('./user');