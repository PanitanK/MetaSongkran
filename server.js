const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql');
const { load } = require('nodemon/lib/config');
const res = require('express/lib/response');
const app = express()
var name = "ผู้ใช้งาน";
const port = process.env.PORT || 8000


const urlencodedParser = bodyParser.urlencoded({extended:false})
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())
const mqtt = require('mqtt');
const { connect } = require('mqtt');
var client = mqtt.connect("mqtt://broker.hivemq.com:1883")
var obj = {}

var imglink = "https://images-ext-2.discordapp.net/external/hXOrwEsGQxd_kDpfr3BcodzsNulDCw_m6sFRJcsu14g/https/s2s.co.th/wp-content/uploads/2019/09/photo-icon-Copy-2.jpg"
var port1 = '0'
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

const device = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'device'
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
    res.render("main",{name : name})
})
app.listen(port,()=>{
    console.log("Server is listening on port ",port)
})
app.get("/reg",(req,res)=> {
    locker.getConnection((err,connection)=>{
        if (err) throw err
    })
    res.render("reg")
})
app.post("/reg",(req,res)=> {
    username = req.body.username
    password = req.body.password
    var imglink = "https://images-ext-2.discordapp.net/external/hXOrwEsGQxd_kDpfr3BcodzsNulDCw_m6sFRJcsu14g/https/s2s.co.th/wp-content/uploads/2019/09/photo-icon-Copy-2.jpg"
    locker.getConnection((err,connection)=>{
        if (err) throw err 
        locker.query('INSERT INTO locker(`username`,`password`) VALUES (?,?)',[username,password],(err,rows)=>{
            connection.release();
            if (err) throw err       
        })
    })
    profile.getConnection((err,connection)=>{
        if (err) throw err 
        profile.query('INSERT INTO `profile` (`username` , `profileimglink`) VALUES (?,?)',[username,imglink],(err,rows)=>{
            connection.release();
            if (err) throw err       
        })
    })
    device.getConnection((err,connection)=>{
        if (err) throw err 
        device.query('INSERT INTO `device` (`username`,`devorder`) VALUES (?,?)',[username,'1'],(err,rows)=>{
            connection.release();
            if (err) throw err       
        })
    })    
    res.render("profile",{username : username , imglink : imglink })
})
app.post("/login",(req,res)=> {
    username = req.body.username
    password = req.body.password
    locker.getConnection((err,connection)=>{
        if (err) throw err 
        console.log("connected : ",connection.threadId)
        locker.query(' SELECT * FROM `locker` WHERE `BIGORDER` < 1000000000 AND username = ? AND password = ?' ,[username,password],(err,rows)=>{
            connection.release();
            if (err) throw err 
  
            if (rows.length  !=  1 ) {
                res.send("กาก")
            }
            else {
                profile.getConnection((err,connection )=>{
                    if (err) throw err 
                    profile.query('SELECT profileimglink FROM profile WHERE username = ?',[username],(err,rows)=>{
                    imglink = rows[0].profileimglink
                    res.render("profile",{username : username , imglink : imglink })
                    })
                })
            }
        })
    })   
})
app.get("/profile",(req,res)=> {
    profile.getConnection((err,connection )=>{
        if (err) throw err 
        
        profile.query('SELECT profileimglink FROM profile WHERE username = ?',[username],(err,rows)=>{
        imglink = rows[0].profileimglink
        res.render("profile",{username : username , imglink : imglink })
        })
    })
})
app.get("/profile/edit",(req,res)=> {
    res.render("profileedit.ejs",{username : username , imglink : imglink })
})
app.get("/profile/assign" , (req,res) =>{
    res.render("assign")
})

app.post("/profile/assign" , (req,res) =>{
    console.log(req.body)
    devorder = req.body.devorder
    devname = req.body.devname
    port1 = req.body.port1
    port2 = req.body.port2
    device.getConnection((err,rows)=>{
        if (err) throw err 
        device.query('UPDATE device SET  devname = ? , port1 = ? , port2 = ? WHERE username = ? AND devorder = ? ',
        [  devname , port1 , port2, username , devorder   ],(err , rows)=>{
            if (err) throw err 
            console.log(rows)
        })
    })
    res.render("profile",{username : username , imglink : imglink} )
})



app.post("/profile/edit",(req,res)=> {
    imglink = req.body.imglink
    profile.getConnection((err,connection )=>{
        if (err) throw err 
        profile.query('UPDATE `profile` SET `profileimglink` = ? WHERE username = ? ',[imglink,username],(err,rows)=>{
            connection.release()
        res.render("profile",{username : username , imglink : imglink })
        })
    })
})

app.get("/profile/device1" , (req,res) =>{
 
    device.getConnection((err,connection)=> {
        if (err) throw err 
    })
    device.getConnection((err,connection) =>{
        if (err) throw err 
        device.query(' SELECT * FROM `device` WHERE `username` = ?  ', [username] , (err , rows)=> {
            connection.release()
            var devorder = rows[0].devorder
            var port1 = rows[0].port1
            var port1val = rows[0].port1val
            var port2 = rows[0].port2
            var port2val = rows[0].port2val
            var devname = rows[0].devname
           
            res.render("feeder" ,{ devname : devname , devorder : devorder , port1 : port1 , port2 : port2 , port1val ,port2val})
        })
    })
    
})

























username = 'sura'

var port1 = 'TOU'
var port2 = 'MANG'
var portlist = [port1 , port2]

client.on("connect" , function() {
    client.subscribe(portlist)
})

client.on("message" , function (portlist ,message,packet ){
    console.log(portlist)
    console.log(packet.topic)
    console.log(message.toLocaleString())
    portval = message.toLocaleString()
    porto = packet.topic
    device.getConnection((err,connection) => {
        if (err) throw err 
        device.query('UPDATE `device` SET `port1val` = ? WHERE username = ? AND port1 = ?' , [portval , username , porto])
        connection.release()
    })
    device.getConnection((err,connection) => {
        if (err) throw err 
        device.query('UPDATE `device` SET `port2val` = ? WHERE username = ? AND port2 = ?' , [portval , username , porto])
        connection.release()
    })
})


app.post("/profile/device1/OFF" , (req , res ) => {
    trig = req.body.trig 
    console.log(trig)



    device.getConnection((err,connection) => {
        if (err) throw err 
        device.query('UPDATE `device` SET `port2val` = ? WHERE username = ? AND port2 = ?' , [trig , username , port2])
        connection.release()
    })

    device.getConnection((err,connection) =>{
        if (err) throw err 
        device.query(' SELECT * FROM `device` WHERE `username` = ?  ', [username] , (err , rows)=> {
            if (err) throw err 
            connection.release()
            var devorder = rows[0].devorder
            var port1 = rows[0].port1
            var port1val = rows[0].port1val
            var port2 = rows[0].port2
            var port2val = rows[0].port2val
            var devname = rows[0].devname
            res.render("feeder" ,{ devname : devname , devorder : devorder , port1 : port1 , port2 : port2 , port1val ,port2val} ) 
        })
    }) 
    
   
})



app.post("/profile/device1/ON" , (req , res ) => {
    trig = req.body.trig 
    console.log(trig)



    device.getConnection((err,connection) => {
        if (err) throw err 
        device.query('UPDATE `device` SET `port2val` = ? WHERE username = ? AND port2 = ?' , [trig , username , port2])
        connection.release()
    })

    device.getConnection((err,connection) =>{
        if (err) throw err 
        device.query(' SELECT * FROM `device` WHERE `username` = ?  ', [username] , (err , rows)=> {
            if (err) throw err 
            connection.release()
            var devorder = rows[0].devorder
            var port1 = rows[0].port1
            var port1val = rows[0].port1val
            var port2 = rows[0].port2
            var port2val = rows[0].port2val
            var devname = rows[0].devname
            res.render("feeder" ,{ devname : devname , devorder : devorder , port1 : port1 , port2 : port2 , port1val ,port2val} ) 
        })
    }) 
    
   
})







