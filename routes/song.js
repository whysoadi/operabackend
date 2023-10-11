const express =require("express");
const passport = require("passport");
const router=express.Router();
const Song =require("../models/Shong")
const User= require("../models/User")

router.post("/create", passport.authenticate('jwt', {session:false}),async (req, res)=>{

    //req.user gets the user as the passport.authenticate executes
   
    const{name, thumbnail, track}=req.body;
    if(!name || !thumbnail || !track )
    {
        return res.status(301).json({error:"Insufficient details to create song!"})
    }
    const artist= req.user._id;
    const songDetails= {name:name, thumbnail:thumbnail, track:track, artist};
    const createdSong = await Song.create(songDetails);
    return res.status(200).json(createdSong);
    
    //Get route to get all songs I have published.

    
});

router.get("/get/mysongs", passport.authenticate("jwt",{session:false}), async (req, res)=>{
  
    // We need to get all the songs where artist id=user._id
    
    const songs = await Song.find({artist: req.user._id}).populate("artist");
    return res.status(200).json({data:songs});

});


//Get route to get all the songs published by an artist
// router.get("/get/artist/:artistId", passport.authenticate("jwt",{session:false}), async (req, res)=>{
//     const {artistId}= req.params;

//     //we check if the artist exists
//     const artist =  await User.find({_id:artistId});
//    if(!artist){
//     return res.status(301).json({err:"Artist does not exist"})
//    }

//     const songs = await Song.find({artist :artistId})
//     return res.status(200).json({data:songs});
// })

//Get route by song name
router.get("/get/songname/:songName", passport.authenticate("jwt", {session:false}), async (req, res)=>{
    const {songName}= req.params;
    const songs = await Song.find({name:songName}).populate("artist")
    return res.status(200).json({data:songs});
})
module.exports=router;