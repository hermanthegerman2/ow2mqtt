//	Tabel module 

fs = require("fs");


module.exports.file = function(_dirname, _filename) {
	obj = this;
	var filename = _filename;
	var dirname = _dirname;
	this.table = {};
	if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);
	this.save = function() {
		console.log("Saving");
		fs.writeFileSync(dirname+filename, JSON.stringify(obj.table), 'binary', { flag: 'w' });
		return obj;
	};
	this.load = function(_table) {
		try {
			obj.table = JSON.parse(fs.readFileSync(dirname+filename, 'binary'));
		} catch(err) { 
			obj.table = _table;
			obj.save();
		}
		return obj;
	};
	this.watch = function(watchfunction) {
		fs.watch(dirname, function (event, _filename) {
			if (filename == _filename) {
				watchfunction(event, _filename);
			}
		});
		return obj;
	}
	return this;
}

table = {
	owdir : "/mnt/1wire",
	data : []
}

function file(_dirname, _filename) {
	filename = _filename;
	dirname = _dirname;
}

function load() {
	return true;
}


