const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  userId : {type: String},  
  username: { 
    type: String, 
    required: [true, 'Please enter username!'],
    unique: [true,'username should be unique' ],
  },
  email: {
    type: String,
    required: [true, 'Please enter email!'],
    unique: [true,'email should be unique' ],
    match: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
  },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  dateCreated: { type: Date, default: Date.now },
});

//userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);