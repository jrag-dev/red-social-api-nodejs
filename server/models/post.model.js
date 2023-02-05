const mongoose = require('mongoose');
const { Schema, model } = mongoose;



const postSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  desc: {
    type: String,
    max: 500,
  },
  img: {
    type: String
  },
  likes: {
    type: Array,
    default: []
  }
},
{
  timestamps: true
})


module.exports = model("Post", postSchema)