const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   name: { type: String },
   age: { type: String },
   email: { type: String },
});

const model = mongoose.model('user', schema);

module.exports = model;
