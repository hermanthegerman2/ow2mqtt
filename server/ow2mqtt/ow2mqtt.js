process.title = "ow2mqtt";
var fs = require('fs');
var onewireFolder = "/mnt/1wire";
var mqtturl = "mqtt://localhost";
var mqttstatus = false;
var tabstatus = false;
var devdir = "data";
var devfile = devdir + "/devs";

//var devs = [];

table = {
	owdir : "/mnt/1wire",
	data : []
}

dtab = require("./table.js");
dtab.file("data/", "devs.json").load(table);

dtab.watch(function (event, filename) {
    //console.log('event is: ' + event + ", filename: " + filename);
	tabstatus = false;
});

mqtt = {
	mqttClient: require("mqtt").connect(mqtturl).on('connect', function () {
		console.log("Connected to MQTT", mqtturl)
		mqttstatus = true;
		mqtt.add()
	}).on('disconnect', function() {
		console.log("Disconnected from MQTT");
		mqttstatus = false;
	}).on('message', function (_topic, _value) {
		var topic = _topic.toString();
		var value = _value.toString();
		for (x in dtab.table.data) {
			if ((dtab.table.data[x].topic + "/cmd") == _topic.toString()) {
				//console.log("receive:",dtab.table.data[x].topic + "/cmd", value.toString())
				fs.writeFileSync(onewireFolder+"/"+dtab.table.data[x].id, parseInt(_value));
			}
		}
	}),
	remove: function () {
		mqtt.mqttClient.unsubscribe("owfs1/#")
	},
	add: function () {
		console.log("Subscribe:", "owfs1/#")
		mqtt.mqttClient.subscribe("owfs1/#")
	},
	publish: function(topic, value) {
		//console.log("publish:", topic, value);
		this.mqttClient.publish(topic, value.toString());
	}
}

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day + ":" + hour + ":" + min;
}

var lastDateTime;

function loop() {
	var m = new Date().getMinutes();
	if (lastDateTime != m) {
		lastDateTime = m;
		if (mqttstatus) mqtt.publish("ow2mqtt/ping/state",m);
	}
	if (!tabstatus) {
		try {
			dtab.load();
			console.log("Table loaded");
			tabstatus = true;
		} catch(err) { console.log(err);}
	} else if (mqttstatus) for (i in dtab.table.data) {
		try {
		var val = fs.readFileSync(onewireFolder+"/"+dtab.table.data[i].id, 'utf8');
		val = (Math.round(parseInt(val*dtab.table.data[i].divisor))/dtab.table.data[i].divisor).toString();
		if (val != dtab.table.data[i].val) {
			dtab.table.data[i].val = val;
			if (val != "NaN") mqtt.publish(dtab.table.data[i].topic+"/state", val);
		}
		} catch(err) { 
			//console.log(err);
		}
	}
	setTimeout(loop, 200);
}

loop();
