const mongoose = require('mongoose');

// To create a model 

// STEP 1 : require mongoose 
// STEP2: create a mongoose schema n
// STEP3: create a model

const User = new mongoose.Schema({
    firstName:{
      type: String,
      required: true
    }, 

    password:{
      type : String,
      required: true,
      private: true
    },
    
    lastName:{
        type: String,
        required: false
      }, 
      email:{
        type: String,
        required: true
      }, 
      UserName:{
        type: String,
        required: true
      }, 
      likedSongs:{
        //later change to array
        type: String,
        dafault:""
      },
      likedPlaylists:{
        type : String,
        default: "",

      }, 
      subscribedArtists:{
            type: String,
            default: ""
      },
})

const UserModel = mongoose.model("User", User)

module.exports= UserModel