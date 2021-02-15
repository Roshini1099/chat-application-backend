const mongoose = require('mongoose');
const message = require('./message');


const ChatSchema = mongoose.Schema({
  chatName: {
    type: String
  },
  type: {
    type: String,
    enum: ['channel', 'directMessage'],
    default: 'directMessage'
  },
  participants: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  arrayOfMessage:{
    type: Array,
    default: []
}
});

module.exports = mongoose.model('chat', ChatSchema);
