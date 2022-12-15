const express =  require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const fs = require("fs");
const { parse } = require("csv-parse");
const app = express();

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
        res.send(result);
    });
});
app.post("/database/insert",(req,res)=>{
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

let recipe;

//creating mailing structure
const parser = parse({columns: true}, function (err, records) {
    recipe = records[Math.floor(Math.random()*records.length)];
    var str="YOUR RECIPE OF THE DAY IS!\n\n";
    str+=recipe["Name"]+"\n\nIngredients Used: ";
    str+=recipe["Ingredients"]+"\n\nHow to prepare?\n";
    str+=recipe["Instructions"]+"\n\nPreparation Time: ";
    str+=recipe["PreparationTime"]+"\n\nServings: ";
    str+=recipe["Servings"];
    console.log(str);
});
fs.createReadStream("./final_data.csv").pipe(parser);

// app.get("/api/get",(req,res)=>{
//     res.send(string);
// });
