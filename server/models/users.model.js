const mongoose = require('mongoose');
const { Schema, model } = mongoose;



const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "El nombre es requerido"],
    trim: true,
    validate: {
      validator: function(password) {
        return password.length >= 3 && password.length <= 30;
      },
      message: "El username debe contener entre 6 y 30 caracteres!!"
    },
    unique: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    index: {
      unique: true
    },
    required: [true, "El email es requerido"],
    maxLength: 50,
    match: /.+\@.+\..+/
  },
  password: {
    type: String,
    trim: true,
    required: [true, "El password es requerido"]
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


userSchema.methods.longPassword = function(password) {
  return password.length >= 6;
}

userSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

module.exports = model("User", userSchema)