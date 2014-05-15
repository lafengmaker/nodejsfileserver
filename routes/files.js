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
				//fs.readdir(filename,function(errors,files){
				var files = fs.readdirSync(filename).map(function(v) {
					return { name:v, time:fs.statSync(path.join(filename,v)).mtime.getTime()}; 
               					}).sort(function(a, b) { return a.time - b.time; }).map(function(v) { 
					return v.name;
				 });
				var showType=req.params.showType;
				if('img'==showType){
					//files=files.filter(function(file){
					//	var ext=path.extname(file);
					//	if('.jpg'==ext||'.jpeg'==ext||'.gif'==ext||'.png'==ext){
					//		return file;
				//		}
				//	});
				//	files=converImg(filename,files,fileroot);
				//	if(files && files.length>6){
				//		var sublist= new Array(6);
				//		var sessionlist= new Array(files.length-6);
				//		console.log(files.length-6);
				//		for(var index=0;index< files.length;index ++ ){
				//			if(index<6){
				//				sublist[index]=files[index];
				//			}else{
				//				sessionlist[index-6]=files[index].toJson();
				//			}
				//		}
				//		files=sublist;
				//		req.session.slist=sessionlist;
				//	}
					//res.render('images',{'title':'照片墙','myfiles':files});
					res.render('images',{'title':'照片墙'});
				}else{
					var li=convertfiletoMyFile(filename,files,fileroot);
					res.render('filelist', { title:'文件列表','myfiles':li});
				}
				
			}else{
				//res.send('This is a file'+filename);
				fs.readFile(filename,function(error,data){
					var contenttype=mime.lookupExtension(path.extname(filename));
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
exports.ajaxfiles=function(req, res){
	var app = require('../app');
	var index=req.query.page;
	var filename=req.body.filename;
	if(!filename){
		filename="";
	}
	var fileroot=app.get('fileroot');
	filename=path.join(fileroot,filename);
	if(!sessionfile){
	var files = fs.readdirSync(filename).map(function(v) {
					return { name:v, time:fs.statSync(path.join(filename,v)).mtime.getTime()}; 
               					}).sort(function(a, b) { return a.time - b.time; }).map(function(v) { 
					return v.name;
				 }).filter(function(file){
						var ext=path.extname(file);
						if('.jpg'==ext||'.jpeg'==ext||'.gif'==ext||'.png'==ext){
							return file;
						}
				 });
	 files=converImg(filename,files,fileroot);
         if(files && files.length>0){
		var jsons=new Array(files.length);
		files.forEach(function(f,index){
			jsons[index]=f.toJson();
		});
		
	}
         req.session.slist=jsons;	
	}

	var sessionfile=req.session.slist;
	console.log(index);
	if(!index){
		index=1;
	}
	var html=""
	var end=index*10;
	var start=end-10;
	
	console.log(start+"----------------------"+end);
	if(end<sessionfile.length){
		for(var j=start;sessionfile.length;j++){
			if(j<end){
				html+="<div class='item'> <img src='/"+sessionfile[j].image+"' width='"+sessionfile[j].width+"' height='"+sessionfile[j].height+"'> </div>";
				console.log(html);
			}else{
				break;
			}
		}
	}
	res.send(html);
        res.end;

}
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
		var sizeOf=require('image-size');
		var dimensions=sizeOf(path.join(parent,val));
		var num=dimensions.width/192;
		
		var myf=new myFile(val,href,stat["size"],192,(dimensions.height/num));
		list[index]=myf;
	});
	return list;
}
function converImg(parent,files,fileroot){
	var length=files.length;
	var list= new Array(length);
	var myFile=require('./myFile.js');
	files.forEach(function(val,index){
		href=path.relative(fileroot,path.join(parent,val));
		var sizeOf=require('image-size');
		var dimensions=sizeOf(path.join(parent,val));
		var num=dimensions.width/192;		
		var myf=new myFile(val,href,0,192,(dimensions.height/num));
		list[index]=myf;		
	});
	return list;
}




