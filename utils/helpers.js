
const jwt= require("jsonwebtoken")

exports={};

exports.getToken = async (email, newUser) =>{

    const token = jwt.sign({identifier: newUser._id},'secretsfgfs');
   return token;
}

module.exports=exports