/** list root file and folder */
var fs=require("fs"),
 mime=require('./mime').mime,
 path = require('path');
exports.listfile = function(req, res){
	var app = require('../app');
	var filename=req.query.name;
	//var filename=req.params.fname;
	if(!filename){
		filename="";
	}
	var fileroot=app.get('fileroot');
	filename=path.join(fileroot,filename);
	console.log(filename);	
	fs.exists(filename,function(exists ){
		if(exists){		
			var stat=fs.statSync(filename);
			if(stat.isDirectory(filename)){
				fs.readdir(filename,function(errors,files){
				var li=convertfiletoMyFile(filename,files,fileroot)
				res.render('filelist', { title:'文件列表','myfiles':li});
			});
			}else{
				//res.send('This is a file'+filename);
				fs.readFile(filename,function(error,data){
					var contenttype=mime.lookupExtension(path.extname(filename));
					console.log(contenttype);
					if('text/plain'==contenttype || !contenttype){
						filename=path.basename(filename);	
						res.render('read', { 'title':filename,'data':data});
					}else{
						var statf=fs.statSync(filename);
						res.writeHead(200,{'content-Type':contenttype,
								'Content-Length':statf["size"],
								'Server':'NodeJs('+process.version+')'});
						res.write(data,'binary');
						res.end;
					}
								
					
				});
				
			}
			
		}else{
			console.log('file not exists');
			res.send('file not exists !');
		}
	})
	//console.log(app.get('fileroot'));
	
	
};

function convertfiletoMyFile(parent,files,fileroot){
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
		href=path.relative(fileroot,path.join(parent,val));
		console.log(href)
		var myf=new myFile(val,href,stat["size"]);
		list[index]=myf;
	});
	return list;
}
