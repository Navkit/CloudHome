
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    
    imageUrl: String,

    isEmailVerified: {
        type: Boolean,
        default: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
        type: String,
        required: true,
      },
  
    password: {
      type: String,
      required: true,
    },
  
    createdAt: {
      type: Date,
      default: Date.now,
    },
    
  });


  userSchema.methods.verifyPassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  }


  userSchema.pre('save', async function (next) {

    if(this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    }

    else {
        next()
    }

  })
  
  const UserModel = mongoose.model('User', userSchema);
  
  module.exports = UserModel
