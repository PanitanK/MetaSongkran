const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql');
const { load } = require('nodemon/lib/config');
const app = express()
var name = "ผู้ใช้งาน";
const port = process.env.PORT || 8000


const urlencodedParser = bodyParser.urlencoded({extended:false})
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

var obj = {}

var imglink = "https://images-ext-2.discordapp.net/external/hXOrwEsGQxd_kDpfr3BcodzsNulDCw_m6sFRJcsu14g/https/s2s.co.th/wp-content/uploads/2019/09/photo-icon-Copy-2.jpg"

const locker = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'locker'
})

const profile = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'profile'
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
    var imglink = "https://images-ext-2.discordapp.net/external/hXOrwEsGQxd_kDpfr3BcodzsNulDCw_m6sFRJcsu14g/https/s2s.co.th/wp-content/uploads/2019/09/photo-icon-Copy-2.jpg"
    console.log(username)
    console.log(password)
    
    


    locker.getConnection((err,connection)=>{
        if (err) throw err 
        console.log("connected : ",connection.threadId)
        locker.query('INSERT INTO locker(`username`,`password`) VALUES (?,?)',[username,password],(err,rows)=>{
            connection.release();
            if (err) throw err 
            console.log("connected : ",connection.threadId)
            console.log("Is completed")
            
        })
    })

    profile.getConnection((err,connection)=>{
        if (err) throw err 
        console.log("connected : ",connection.threadId)
        profile.query('INSERT INTO `profile` (`username` , `profileimglink`) VALUES (?,?)',[username,imglink],(err,rows)=>{
            connection.release();
            if (err) throw err 
            console.log("connected : ",connection.threadId)
            console.log("Is completed")
            
        })
    })
    
    res.render("profile",{username : username , imglink : imglink })
})



app.post("/login",(req,res)=> {
    username = req.body.username
    password = req.body.password
    console.log(username)
    console.log(password)
    
    


    locker.getConnection((err,connection)=>{
        if (err) throw err 
        console.log("connected : ",connection.threadId)
        locker.query(' SELECT * FROM `locker` WHERE `BIGORDER` < 1000000000 AND username = ? AND password = ?' ,[username,password],(err,rows)=>{
            connection.release();
            if (err) throw err 
            console.log("connected : ",connection.threadId)
            console.log("Is completed")
            console.log(rows)
            console.log(rows.length)
            if (rows.length  !=  1 ) {
                res.send("กาก")
            }
            else {

                
                profile.getConnection((err,connection )=>{
                    if (err) throw err 
                    console.log("profile connected : " ,username , connection.threadId)
                    profile.query('SELECT profileimglink FROM profile WHERE username = ?',[username],(err,rows)=>{
                    imglink = rows[0].profileimglink
                    res.render("profile",{username : username , imglink : imglink })
                    })
                })
             
                


            }
        })
    })
    
    
})

//INSERT INTO `locker` (`username`, `password`) VALUES (obj.username , obj.password )
//  <% if (typeof err != "undefined") { %> 

app.get("/profile",(req,res)=> {
    profile.getConnection((err,connection )=>{
        if (err) throw err 
        console.log("profile connected : " ,username , connection.threadId)
        profile.query('SELECT profileimglink FROM profile WHERE username = ?',[username],(err,rows)=>{
        imglink = rows[0].profileimglink
        res.render("profile",{username : username , imglink : imglink })
        })
    })
})

app.get("/profile/edit",(req,res)=> {
    res.render("profileedit.ejs",{username : username , imglink : imglink })
})

app.post("/profile/edit",(req,res)=> {
    imglink = req.body.imglink
    profile.getConnection((err,connection )=>{
        if (err) throw err 
        console.log("profile connected : " ,username , connection.threadId)
        profile.query('UPDATE `profile` SET `profileimglink` = ? WHERE username = ? ',[imglink,username],(err,rows)=>{
        res.render("profile",{username : username , imglink : imglink })
        })
    })
})



// ' UPDATE `profile` SET `profileimglink` = ? WHERE `profile`.`ORDERNO` = 3 '






















