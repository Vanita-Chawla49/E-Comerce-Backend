const express = require("express");
const app = express();
const cors = require("cors");
const corsConfig = {
    origin:"*",
    credential:true,
    methods:["GET","PUT","POST","PATCH","DELETE"]
}
app.options("", cors(corsConfig))
app.use(cors(corsConfig));

const userModel = require("../db/user");

const Jwt = require("jsonwebtoken");
const jwtKey = "ecomm"

app.use(express.json());


const login=async(req,res)=>{
    let user = await userModel.findOne(req.body).select("-password");
    if(req.body.email && req.body.password){
        if(user){
            Jwt.sign({user},jwtKey, {expiresIn:"2h"},(err,token)=>{
                if(err){
                    res.send("Oops! Something went wrong.")
                }
                else{
                    res.send({user,auth:token})
                }
            })
        }
        else{
            res.send({result:"No user found!"})
        }
    }
    else{
        res.send({result:"No user found!"})
    }
}

const register=async(req,res)=>{
    let {name,email,password} = req.body;
    let user = await userModel.create({
        name:name,
        email:email,
        password:password,
        profile:req.file.path
    })

    user = user.toObject();
    delete user.password;

    Jwt.sign({user}, jwtKey,{expiresIn:"2h"},(err,token)=>{
        if(err){
            res.send("Oops! Something went wrong.")
        }
        else{
            res.send({user, auth:token})
        }
    })
}


module.exports = {login,register}