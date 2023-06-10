const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
});

const ChatSchema = new mongoose.Schema({
  name: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [MessageSchema],
});

module.exports = mongoose.model('Chat', ChatSchema);
