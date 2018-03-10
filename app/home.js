/* _/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_ */
/******************************************************************************************************/
//zaOr4f37yTRvvVsTSVjkAmyu
//Setup
console.log("Loading...");
var express = require('express');
var site = express();
var serv = require('http').Server(site);
var path = require('path');
var url = require('url');
var bodyParser = require('body-parser');
site.use(bodyParser.urlencoded({ extended: false }));
site.use(bodyParser.json());
site.use(express.static(__dirname + '/../public'));
//0: desktop, 1: laptop
var pathmode = 1;
/******************************************************************************************************/
//Root page
site.get('/', function(req, res) {
	if(req.url == "/look.css") {
		res.set("Content-Type", "text/css");
		if(pathmode == 0) {
			res.sendFile(path.resolve('D:/Servers/homepage/public/look.css'));
		} else {
			res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/look.css'));
			res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/look_mobile.css'));
		}
	} else {
		res.set("Content-Type", "text/html");
		if(pathmode == 0) {
			res.sendFile(path.resolve('D:/Servers/homepage/public/home.html'));
		} else {
			res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/home.html'));
		}
	}
});

//Survival text game
site.get('/survive', function(req, res) {
	if(req.url == "/survive/survive.css") {
		res.set("Content-Type", "text/css");
		if(pathmode == 0) {
			res.sendFile(path.resolve('D:/Servers/homepage/public/survive_look.css'));
		} else {
			res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/survive_look.css'));
		}
	} else {
		res.set("Content-Type", "text/html");
		if(pathmode == 0) {
			res.sendFile(path.resolve('D:/Servers/homepage/public/survive.html'));
		} else {
			res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/survive.html'));
		}
	}
});
/******************************************************************************************************/
serv.listen(4242, function() {
	console.log("      ,',                                   ,',");
	console.log("     ', ,'                                 ', ,'");
	console.log("   ,----'--------------------------.     ,----'--------------------------.");
	console.log("  ('''|```|```|```|```|```|```|``|` |   ('''|```|```|```|```|```|```|``|``|");
	console.log("  |---'---'---'---'---'---'---'--'--|   |---'---'---'---'---'---'---'--'--|");
	console.log("__,_    ______  -SITE-   ______     |___,_    ______  -LIVE!-  ______     |__ ");
	console.log("  '---'(O)(O)'---------'(O)(O)'---'     '---'(O)(O)'---------'(O)(O)'---'");
	console.log("=================================================================================");
});
/******************************************************************************************************/
/* _/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_ */