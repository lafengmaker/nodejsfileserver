/** list root file and folder */
var fs=require("fs"),
 path = require('path');
exports.listfile = function(req, res){
	var app = require('../app');
	var filename=req.query.name;
	if(!filename){
		filename=app.get('fileroot');
	}
	console.log(filename+"=====");
	fs.exists(filename,function(exists ){
		if(exists){		
			var stat=fs.statSync(filename);
			console.log(filename+"====="+stat.isDirectory);
			if(stat.isDirectory(filename)){
				fs.readdir(filename,function(errors,files){
				var li=convertfiletoMyFile(filename,files)
				res.render('filelist', { title:'文件列表','myfiles':li});
			});
			}else{
				//res.send('This is a file'+filename);
				fs.readfile(filename.function(error,data){
				
				res.render('read', { title:filename,'data':data});
				});
				
			}
			
		}else{
			console.log('file not exists');
			res.send('file not exists !');
		}
	})
	//console.log(app.get('fileroot'));
	
	
};

function convertfiletoMyFile(parent,files){
	var length=files.length;
	var list= new Array(length);
	var myFile=require('./myFile.js');
	files.forEach(function(val,index){		
		var stat=fs.statSync(path.join(parent,val));
		if(stat.isDirectory(val)){
			val=path.basename(val)+"/";
		}else{
			val=path.basename(val);
		}
		href=path.join(parent,val);
		var myf=new myFile(val,href,stat["size"]);
		list[index]=myf;
	});
	return list;
}