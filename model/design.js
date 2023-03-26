const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');

const DesignSchema = mongoose.Schema({
  model_id : {type: String},  
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  creator_user_id: {
    type: String,
    required: true,
  },
  design_link:{ type: String, required: true},
  price:{type: Number},
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: {type: Date, default: Date.now},
  tags: [String]
  
});

//userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Design', DesignSchema);