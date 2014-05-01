var diskspace = require('diskspace');
diskspace.check('C', function (total, free, status)
{
	var n=1024*1024*1024
	console.log(n)
	console.log(Math.round(total/n*100)/100);
	console.log(Math.round(free/n*100)/100);
		console.log(status);
});