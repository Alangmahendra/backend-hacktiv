const mongoose = require('mongoose')
const Schema = mongoose.Schema

let commentSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String
  },
  upvoters:[{
    type : Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvoters:[{
    type : Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: {} })

let commentModel = mongoose.model('Comment',commentSchema)

module.exports = commentModel