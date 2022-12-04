const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());

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
        for(let i=0;i<result.length;i++){
            console.log(result[0].emailID,result[0].name);
        }
    });
});
app.post("/database/insert",(req,res)=>{
    res.send("Hello");
    const pEmailID = req.body.pEmailID;
    const pName = req.body.pName;
    const insert = "INSERT INTO subscribers (emailID,name) VALUES (?,?)"
    db.query(insert,[pEmailID,pName],(error,result)=>{
        console.log(error);
    });
});

app.listen(3001,()=>{
    console.log("Server running on port: 3001");
});