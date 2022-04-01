
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatDetailsSchema = new Schema({
  name: { type: String },
  message: { type: String },
});

var ChatSchema = new Schema({
  interaction: { type: String },
  time_stamp: { type: Date },
  chat_details: ChatDetailsSchema
}, { versionKey: false });


const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;

