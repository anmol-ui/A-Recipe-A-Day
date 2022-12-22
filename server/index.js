const express =  require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const fs = require("fs");
const { parse } = require("csv-parse");
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');
const regions = ['US', 'UK', 'Thai', 'Spanish and Portuguese', 'Southeast Asian', 'South Amrican', 'Scandinavian', 'Rest Africa', 'Northern Africa', 'Middle Eastern', 'Mexican', 'Korean', 'Japanese', 'Italian', 'Irish', 'Indian Subcontinent', 'Greek', 'French', 'Eastern European', 'Deutschland', 'Chinese and Mongolian', 'Central American', 'Caribbean', 'Canadian', 'Belgian', 'Australian'];

function random(mn, mx) {
  return Math.random() * (mx - mn) + mn;
}
const reg = regions[Math.floor(random(26, 1))];

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Anmol123@',
    database: 'cgas_project',
});
app.get("/database/get",(req,res)=>{
    const get = "SELECT * from subscribers";
    db.query(get,(error,result)=>{
        //get all emailIDs from here
        res.send(result);
    });
});

app.listen(3001,()=>{
    console.log("Server running on port: 3001");
});

//Email verification
// Generate token
const token = jwt.sign(
    {data: 'Token Data'}, 'ourSecretKey', {expiresIn: '10m'}  
);    
//send token to emailJS
app.get("/token",(req,res)=>{
    console.log(token);
    res.send(token);
})
//get the token from client and match if both tokens are same
app.get('/verify/:token/:name/:email', (req, res)=>{
    const data = {
        "details": {
            "token":req.params.token,
            "name": req.params.name,
            "email": req.params.email
        }
    }; 
  
    // Verifying the JWT token 
    jwt.verify(data.details.token, 'ourSecretKey', function(err, decoded) {
        if (err) {
            console.log(err);
            res.send("Email verification failed, possibly the link is invalid or expired");
        }
        //if token matches, then complete verification and insert into database
        else {
            res.sendFile(path.join(__dirname,'/views/subscribed.html'));
            const insert = "INSERT INTO subscribers (emailID,name) VALUES (?,?)"
            db.query(insert,[data.details.email,data.details.name],(error,result)=>{
                console.log(error);
            });
        }
    });
});


const axios = require('axios');
const qs = require('qs');
const { json } = require("body-parser");

const data = qs.stringify({
  'client_id': 'app-ims',
  'grant_type': 'password',
  'username': 'manas',
  'password': 'manas_cosylab',
  'scope': 'openid' 
});
const config = {
  method: 'post',
  url: 'https://cosylab.iiitd.edu.in/api/auth/realms/bootadmin/protocol/openid-connect/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data : data
};

axios(config).then(function (response) {
    var bearer_tokn = JSON.stringify(response.data);
    bearer_tokn = bearer_tokn.split(":")[1].split(',"expires_in"')[0].split('"')[1];
    const c = {
        method: 'get',
        url: 'https://cosylab.iiitd.edu.in/api/recipeDB/search_region/'+reg,
        headers: { 
          'Authorization': "Bearer".concat(" ", bearer_tokn), 
        }
      };
    
      axios(c).then(function (response) {
        const recipes = (response.data); //json_val contains a list of all recipes belonging to a particular region
        //sequentially take each recipes from particular region. Start with first recipe
        var day = 0;
        const recipe_for_today = recipes[day];
        const ID = recipe_for_today['recipe_id'];
        const cf = {
            method: 'get',
            url: 'https://cosylab.iiitd.edu.in/api/instructions/' + ID,
            headers: { 'Authorization': "Bearer".concat(" ", bearer_tokn), }
          };
        
          axios(cf).then(function (response) {
            const instructions = response.data;
            app.get('/api',(req,res)=>{
                res.send({ROD:recipe_for_today,Instructions:instructions});
            });
          })
          .catch(function (error) {
            console.log(error);
          });

      }).catch(function (error) {
        console.log(error);
      });
    }).catch(function (error) {
        console.log(error);
});

const num = Math.floor(random(10, 1));
