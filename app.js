const express = require('express')
const cons = require('consolidate');
const session = require('express-session')
const path = require('path')
const { v4 : uuidv4} = require('uuid')
const sqlite3 = require('sqlite3')
require('dotenv').config({path : 'variables.env'})
let app = express()
app.engine('html', cons.swig)
app.set("views", path.join(__dirname, 'src'))
app.set("view engine", "html")
app.use(express.static(path.join(__dirname, 'dist')))

app.use(session({
    genid: function(req){
        uuidv4()
    },
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
}))


let db = new sqlite3.Database(process.env.DATABASE, (err) => {
    if(err){
        console.log(err)
    }
    console.log("connected to test database")
})

// if the user makes a search which matches nothing, we remove the last string character
// and search again
const checkClosestName = (req,res,next,value) => {
    var newString = value.split("").slice(0,value.length - 1)
    var finalString = newString.join("")
    console.log(finalString)
    var array = []
    db.all(`SELECT name,latitude,longitude FROM locations WHERE name LIKE ?`, [`%${finalString}%`], (err, rows) => {
        if (err) {
          next(err)
        }
        else if(rows.length === 0) {
            array.push(["no results found", uuidv4()])
            res.send(array)
        }
        else{
            rows.forEach((row) => {
                array.push([row.name, row.latitude, row.longitude, uuidv4()])
              });
              var data = {
                  value: true,
                  results: array
              }
              res.send(data)
        }
      });
}

app.get("/locations", function(req,res,next){
    var value = req.query
    var test = value.search.split("")
    var testString = ""
    var testArray = []
    if(test.indexOf(' ') !== -1){

        // here we account for a name with two parts
        testString =`SELECT name,latitude,longitude FROM locations WHERE name LIKE ? AND name LIKE ?`
        var number = test.indexOf(' ')
        var value1 = test.slice(0,number)
        var value2 = test.slice(number + 1)
        testArray = [`%${value1.join("")}%`,`%${value2.join("")}%`]
    }
    else{
        testString =`SELECT name,latitude,longitude FROM locations WHERE name LIKE ?`
        testArray.push(`%${value.search}%`)
    }
    var array = []
   db.all(testString,testArray, (err, rows) => {
        if (err) {
          next(err)
        }
        else if(rows.length === 0 ){
            checkClosestName(req,res,next,value.search)
        }
        else{
            rows.forEach((row) => {
                array.push([row.name, row.latitude, row.longitude, uuidv4()])
              });
              res.send(array)
        }
      });
})

app.get("/", function(req,res,next){
        res.render("index")
})

app.use(function(err,req,res,next){
    console.log(err)
    if(err.code === "SQLITE_ERROR"){
        res.sendStatus(500)
    }
    else{
        res.status(500)
        res.render("error")
    }
})

module.exports = app