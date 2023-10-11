const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require ('./models/User')
const authRoutes = require ('./routes/auth')
const cors = require("cors")
const songRoutes= require('./routes/song')
const playlistRoutes= require('./routes/playlist')
const passport= require("passport")
require("dotenv").config();
const app = express();
const port =process.env.port || 8000;

app.use(cors());
app.use(express.json());  //converts the data into json format


//connect mongodb to our node app
//mongoose.connect takes 2 arguemnets 1. url of the db 2. options for the connections

mongoose.connect(
    "mongodb+srv://adityayadav3589:" + process.env.MONGO_PASSWORD + "@cluster0.sxj5f3u.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true,
   useUnifiedTopology: true,
   }
).then((x)=>{
  
    console.log("connected to Mongo!");
}
).catch((err)=>{
     console.log("error", err);
});

app.get("/", (req, res) => {
  res.send("hello world");
});



//setup passport-jwt
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secretsfgfs';
passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
  const user= await  User.findOne({_id: jwt_payload.identifier});
  console.log(user)
 return done(null,user);
}));

app.use("/auth",authRoutes);
app.use("/song",songRoutes);
app.use("/playlist",playlistRoutes);

app.listen(port, () => {
  console.log("app is running " + port);
});
