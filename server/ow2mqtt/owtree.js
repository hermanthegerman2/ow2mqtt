var path = require('path')
var fs = require('fs')

function getlist(owdir) {
	var startDir = owdir.substr(-1)=="/" ? owdir:owdir+"/";
	function dirTree(filename) {
		var stats = fs.lstatSync(filename),
		info = {
			id: filename,
			text: path.basename(filename),
			type: "d"
		};
		if (stats.isDirectory()) {
			info.children = fs.readdirSync(filename).map(function (child) {

				return dirTree(path.join(filename, child));
			});
		} else {
			info.icon = "jstree-file";
			info.type = "f";
		}
		return info;
	}
	var result = [{ id: startDir, text: "Onwire devices", type: 'd', children: [] }];
	try {
		list = fs.readdirSync(startDir);
		list.forEach(function (file) {
			file = path.resolve(startDir, file);
			var stat = fs.statSync(file)
			if (stat && stat.isDirectory()) {
				if (file.substr(startDir.length + 2, 1) == '.') result[0].children.push(dirTree(file))
			}
		})
	} catch (err) { };
	return (result);
}
module.exports.list = function(dir) { return JSON.stringify(getlist(dir));};
