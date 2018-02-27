const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = require('./comment')

let postsSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  ask: {
    type: String,
    required: true
  },
  comments: [
    Comment.schema
  ],
  upvoters:[{
    type : Schema.Types.ObjectId,
    ref:'User'
  }],
  downvoters:[{
    type : Schema.Types.ObjectId,
    ref:'User'
  }]

}, { usePushEach:true,
  timestamps: {} })

let PostModel = mongoose.model('Post',postsSchema)
module.exports = PostModel