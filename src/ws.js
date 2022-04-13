#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
var exec = require('child_process').exec;


var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            //console.log("Received: '" + message.utf8Data + "'");
            // Split text into lines and iterate over each line like this
            let lines = message.utf8Data.split('\r\n')
            lines.forEach(function(line) {
                //console.log(line)
                let word = line.split(',')
                if (word[0]=='$WIMWD'){
                    console.log(word)
                }
                if (word[0]=='$WIMWV'){
                    console.log(word)
                    direction = word[1]
                    speed = word[3]
                    sentence = " Vento da "+direction+" intensita "+speed+ " nodi"
                    console.log(sentence)
                    comando = "espeak-ng -v mb-it3 \""+sentence+"\" -s 100"
                    console.log(comando)
                    exec(comando, function callback(error, stdout, stderr) {
                        // result
                      });
                }
            })
        }
    });

   
});

client.connect('ws://localhost:3000/', 'echo-protocol');

/*

$WIMWD
 
Summary
NMEA 0183 standard Wind Direction and Speed, with respect to north.

Syntax
$WIMWD,<1>,<2>,<3>,<4>,<5>,<6>,<7>,<8>*hh<CR><LF>

Fields
<1>    Wind direction, 0.0 to 359.9 degrees True, to the nearest 0.1 degree
<2>    T = True
<3>    Wind direction, 0.0 to 359.9 degrees Magnetic, to the nearest 0.1 degree
<4>    M = Magnetic
<5>    Wind speed, knots, to the nearest 0.1 knot.
<6>    N = Knots
<7>    Wind speed, meters/second, to the nearest 0.1 m/s.
<8>    M = Meters/second


$WIMWV
 
Summary
NMEA 0183 standard Wind Speed and Angle, in relation to the vessel’s bow/centerline.

Syntax
$WIMWV,<1>,<2>,<3>,<4>,<5>*hh<CR><LF>

Fields
<1>    Wind angle, 0.0 to 359.9 degrees, in relation to the vessel’s bow/centerline, to the nearest 0.1
           degree. If the data for this field is not valid, the field will be blank.
<2>    Reference:
           R = Relative (apparent wind, as felt when standing on the moving ship)
           T = Theoretical (calculated actual wind, as though the vessel were stationary)
<3>    Wind speed, to the nearest tenth of a unit.  If the data for this field is not valid, the field will be
           blank.
<4>    Wind speed units: 
           K = km/hr M = m/s
           N = knots
           S = statute miles/hr
<5>    Status:
           A = data valid; V = data invalid

*/