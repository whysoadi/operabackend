const express= require("express")
const router =express.Router(); 
const bcrypt= require("bcrypt")
const {getToken} =require("../utils/helpers")
const User = require("../models/User");



//POST route helps user to register
router.post("/register", async (req, res)=>{
    // this code will run when the register API called

    //req.body fromat: {email, password, username, firstname, lastname}
    const {email, password, username, firstname, lastname}= req.body;
     
       //checking is the user exists with the email
      const user= await User.findOne({email:email});
      if(user){
        console.log(firstname)
        return res.status(403).json({error:"User already exists"});
      }
       
      //if the user dosen't exist then create a new user
      //the password is converted into hashedpassword
      //the hash depends on 2 parameters
      //keeping the both hash parameters same

      const hashedPassword =await bcrypt.hash(password, 10)
      const newUserData={email, password:hashedPassword, UserName:username, firstName:firstname,  lastName:lastname}
      const newUser = await User.create(newUserData);

      //We want to create token to return to the user
     const token = await getToken(email, newUser)
     console.log(token)
     // return the result to the user

     const userToReturn = {...newUser.toJSON(), token};
     console.log(userToReturn);
     delete userToReturn.password;
     return res.status(200).json(userToReturn);
    });

     router.post("/login", async (req, res)=>{
      //STEP1:Get the email and password of the user from req.body
      
      const{email, password}=req.body;
      // const hashedPassword =await bcrypt.hash(password, 10)
      //STEP2: check if the user with the given credentials exists or not.
        const user = await User.findOne({email:email});
        console.log(user);
        // if(!user){
        //   return res.status(403).json({error:"Invalid Credentials"});
        // }
     //STEP3: if the user exists check is the password is correct.
     //tricky step as the password is hashed
     //comparing the hashed password
     // brcypt.await comapres the password with the hashed password
     const isPasswordValid= await bcrypt.compare(password, user.password);
     if(!isPasswordValid){
      // console.log(user.password)
      // console.log(hashedPassword)
      // console.log(isPasswordValid)
      // return res.status(403).json({error:"Inavalid Credentials"});
     }
    bcrypt.compare(password, user.password, (err, data) => {
      //if error than throw error
      if (err) throw err

      //if both match than you can do anything
      // if (data) {
      //     return res.status(200).json({ msg: "Login success" })
      // } 
      // else {
      //     return res.status(403).json({ msg: "Invalid credentials" })
      // }

  })
       
     //If the credentials are correct then return the token
      
     const token = await getToken(user.email, user);
     console.log(token)
     const usertoReturn = {...user.toJSON(), token} 
     delete usertoReturn.password;
     return res.status(200).json(usertoReturn)
     });



module.exports= router