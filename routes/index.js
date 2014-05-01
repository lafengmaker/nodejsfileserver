/* GET home page. */

exports.index = function(req, res){
	var diskspace = require('diskspace');	
	diskspace.check('C', function(total, free, status){
		var contentper=getRound(total-free,total);
		var n=1024*1024*1024;
		total=getRound(total,n);
		free=getRound(free,n)
		console.log(total);
		console.log(free);
		console.log()
		res.render('index', { total: total,free:free,title:'文件服务器',contentper:contentper});
	});
};
exports.download = function(req, res){
	 var path = require("path");
	 var pathname=req.query.name;
	 //var realPath = path.join("assert",pathname );
	 pathname='assert/'+pathname;
	 //console.log(realPath);
	 res.download(pathname);
};
function getRound( num,dvidenum){
return Math.round((num*100/dvidenum))/100;
}
exports.mime = {
    "html" : "text/html",
    "css"  : "text/css",
    "js"   : "text/javascript",
    "json" : "application/json",
    "ico"  : "image/x-icon",
    "gif"  : "image/gif",
    "jpeg" : "image/jpeg",
    "jpg"  : "image/jpeg",
    "png"  : "image/png",
    "pdf"  : "application/pdf",
    "svg"  : "image/svg+xml",
    "swf"  : "application/x-shockwave-flash",
    "tiff" : "image/tiff",
    "txt"  : "text/plain",
    "wav"  : "audio/x-wav",
    "wma"  : "audio/x-ms-wma",
    "wmv"  : "video/x-ms-wmv",
    "xml"  : "text/xml"
};