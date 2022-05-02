var mqtt = require('mqtt')

var options = {
    host: 'aa9506f823bd43d2b47bd488387efcdf.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'songkran',
    password: 'Songkran123'
}

var val = 1
//initialize the MQTT client
var client = mqtt.connect(options);

//setup the callbacks
client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    //Called each time a message is received
    console.log('Received message:', topic, message.toString());
});

// subscribe to topic 'my/test/topic'
client.subscribe('my/test/topic');

// publish message 'Hello' to topic 'my/test/topic'
client.publish('my/test/topic', val.toString());