const mongoose = require('mongoose')
const Schema = mongoose.Schema


let userSchema = new Schema({
  email: String,
  password: String
}, { timestamps: {} })

let userModel = mongoose.model('User',userSchema)

module.exports = userModel