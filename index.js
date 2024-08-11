const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
    origin: "https://e-comerce-frontend-six.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

require("./db/config");
const webhook = require("./webhook");
const bodyParser = require("body-parser")

const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("./db/cloudinaryConfig");
const path = require("path")

const stripe = require('stripe')('sk_test_51NqbIGBttcRVBy3MYXkus2GMikCglZ1BBtZqOMortgPVkIiKT5ldSWRDGwTo4Vl7c0ondXjlamokmYAezlxlQBAy00Exf37gl4');

const Jwt = require("jsonwebtoken");
const jwtKey = "ecomm";

const auth_routes = require("./routers/auth");

// app.use(express.json());
// app.use(cors());

app.use(express.static(path.join(__dirname, "public")))

app.use((req,res,next)=>{
    if(req.originalUrl === "/stripe_webhooks"){
        next()
    }
    else{
        express.json()(req,res,next);
    }
})

app.post("/stripe_webhooks", bodyParser.raw({type:"application/json"}), webhook )

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
    folder: "eccom/images",
    format: async (req, file) => "png", 
    public_id: (req, file) => Date.now() + "_" + file.originalname,
    }
})


const upload = multer({
    storage:storage
})

app.use("/auth",upload.single("profile") ,auth_routes);


function verifyToken(){
    let token = req.headers["authorization"];
    if(token){
        token = token.split(" ")[1];

        Jwt.verify(token,jwtKey, (err,valid)=>{
            if(err){
                res.status(401).send({result: "Please provide valid token"})
            }
            else{
                next();
            }
        })
    }
    else{
        res.status(403).send({result: "Please provide token with header"})
    }
}



app.post("/",async(req,res)=>{
    let line_items = req.body;

    const session = await stripe.checkout.sessions.create({
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        line_items:line_items,
        mode: 'payment',
      });

  
      return res.status(200).json({session})
})




app.get("/",(req,res)=>{
    res.send("home page")
})


app.listen("5000");