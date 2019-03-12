process.title="ow2mqtt-web";
var web = require("web-server");
var path = require('path')
var mime = require('mime-types');
var fs = require('fs')
dtab = require("./table.js")
var owtree = require("./owtree");

port = 8087;
defaulthtml = "/index.html";
wwwdir = __dirname + '/www';

table = {
	owdir : "/mnt/1wire",
	data : []
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

dtab.file("data/", "devs.json").load(table);
//console.log("Table: ",sortByKey(dtab.table.data,'id'));

dtab.watch(function (event, filename) {
    //console.log('event is: ' + event + ", filename: " + filename);
	dtab.load(table);
	sendtab();
});

sendtab = function() {
	io.sockets.emit("table",JSON.stringify(dtab.table));
}

sendOwTree = function(socket) {
    socket.emit("owtree", owtree.list(dtab.table.owdir));
}

var server = web.create(defaulthtml, wwwdir, port, function() {
    console.log('Now Listening on port ' + port);
});

io = require("socket.io").listen(server);

io.on('connection', function (socket) {
	sendOwTree(socket);
    sendtab(socket);
    socket.on("owtree", function (data) {
		sendOwTree(socket);
    })
	socket.on("gettable", function(data) {
	})
    socket.on("updatetable", function (data) {
		dtab.table = JSON.parse(data);
		sortByKey(dtab.table.data,'id');
		sendtab();
		dtab.save();
    })
});

sendtab();


