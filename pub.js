const mqtt = require('mqtt')
var client = mqtt.connect("mqtt://broker.hivemq.com:1883")

client.on("connect" , function() {
    var mesg = "I LOVE BIGGER THING GROWTH MINDSET "
    client.publish("testhome" , mesg)
    console.log("Sent : " , mesg)
    
})
