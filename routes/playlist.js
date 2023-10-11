const express = require("express");
const passport = require("passport");
const router= express.Router()
const Playlist =require("../models/Playlist");
const User = require("../models/User");
const Song =require("../models/Shong")

router.post("/create", passport.authenticate("jwt", {session:false}), async (req, res)=>{
    const currentUser= req.user;
    const {name, thumbnail, songs}= req.body;
    if(!name || !thumbnail || !songs)
    {
        return res.status(301).json({err:"Insufficient Data!"})
    }
    const playlistData= {name, thumbnail, songs, owner:currentUser._id, collaborators:[]};
    const playlist = await Playlist.create(playlistData);
    return res.status(200).json(playlist);
});


//Get a playlist by playlistId
//we will get the playlist id as a route parameter and return the playlist having the same Id

//If we are doing /playlist/get/:playlistId that means playlistId is now a variable now (:)
router.get("/get/playlist/:playlistId", passport.authenticate("jwt", {session:false}), async (req, res)=>{
    const playlistId= req.params.playlistId;
    const playlist= await Playlist.findOne({_id:playlistId}).populate({
        path:"songs",
        populate:{
            path:"artist",
        },
    });
    if(!playlist){
        return res.status(301).json({err:"Invalid ID"})
    }
    return res.status(200).json(playlist);

});

//get playlist made by me

router.get("/get/me", passport.authenticate("jwt", {session:false}), async (req, res)=>{
    const artistId = req.user._id;


    const playlists = await Playlist.find({owner:artistId}).populate("owner");
    return res.status(200).json({data:playlists});

});



//Get the playlist by artist 
router.get("/get/artist/:artistId", passport.authenticate("jwt", {session:false}), async (req, res)=>{
    const artistId = req.params.artistId;

    //check if the artist Id is valid
    const artist = await User.findOne({_id:artistId})
    if(!artist){
        return res.status(304).json({err:"Invalid Aritst ID"})
    }

    const playlists = await Playlist.find({owner:artistId});
    return res.status(200).json({data:playlists});

});

//add a song to the playlist
router.post("/add/song", passport.authenticate("jwt", {session:false}), async (req, res)=>{
    const currentUser= req.user;
    const {playlistId, songId}= req.body;
    const playlist = await Playlist.findOne({_id:playlistId})
    if(!playlist){
        return res.status(304).json({err:"Playlist not found!"})
    }

    //STEP1: if the currentuser owns the playlist or is  a collaborator
    if(!playlist.owner.equals(currentUser._id) && !playlist.collaborators.includes(currentUser._id))
    {
        return res.status(404).json({err:"Not allowed!"})
    }

    //STEP 2: check if the song is a valid song
    const song = await Song.findOne({_id:songId});
    if(!song){
        return res.status(304).json({err:"Song does not exist!"})
    }

    //Now add the song to the playlist

    playlist.songs.push(songId);

    await playlist.save();

    return res.status(200).json(playlist);
})


module.exports=router;