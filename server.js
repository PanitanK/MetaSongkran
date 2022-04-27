const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const app = express()
var name = "ผู้ใช้งาน";
const port = process.env.PORT || 8000

const urlencodedParser = bodyParser.urlencoded({extended:false})
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

var obj = {}


const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'songkran'
})

const locker = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'locker'
})





app.use(express.static('public'))

app.set('view engine' , 'ejs')


app.get("/",(req,res)=> {
    res.render("index")
    
})



app.get("/login",(req,res)=> {
    res.render("login")

})

app.get("/feeder",(req,res)=> {
    res.render("feeder")

})

app.get("/main",(req,res)=> {
    res.render("main",{name : name})


})

app.post("/main",(req,res)=> {
    name = req.body.name
    console.log(name)
    res.render("main",{name : name})

})

app.listen(port,()=>{
    console.log("Server is listening on port ",port)


})

app.get("/reg",(req,res)=> {
    locker.getConnection((err,connection)=>{
        if (err) throw err
        console.log("connected : ",connection.threadId)
    })
    res.render("reg")

})

app.post("/reg",(req,res)=> {
    username = req.body.username
    password = req.body.password
    console.log(username)
    console.log(password)
    


    locker.getConnection((err,connection)=>{
        if (err) throw err 
        console.log("connected : ",connection.threadId)
    })
    locker.query('INSERT INTO locker(`username`,`password`) VALUES ("?","?")',[username,password],(err,rows)=>{
        if (err) throw err 
        console.log("Is completed")
        res.render("main")//


    })
    
    res.render("main",{name : name})

})

//INSERT INTO `locker` (`username`, `password`) VALUES (obj.username , obj.password )
//  <% if (typeof err != "undefined") { %> 