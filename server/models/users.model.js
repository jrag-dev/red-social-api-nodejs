const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "El nombre es requerido"],
    min: 3,
    max: 30,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El email es requerido"],
    max: 50
  },
  password: {
    type: String,
    required: [true, "El password es requerido"],
    min: 6
  },
  profilePicture: {
    type: String,
    default: "",
  },
  coverPicture: {
    type: String,
    default: ""
  },
  followers: {
    type: Array,
    default: []
  },
  followins: {
    type: Array,
    default: []
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
})

module.exports = model("User", userSchema)