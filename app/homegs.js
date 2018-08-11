/* _/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_ */
/******************************************************************************************************/
//Global configuration
var DB_ENABLED = false;
//0: desktop, 1: laptop
const pathmode = 0;
//Setup
console.log("Loading...");
const express = require('express');
//const expressSession = require('express-session');
const site = express();
const serv = require('http').Server(site);
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const mysql = require('mysql');
var DB_ENABLED = false;
site.use(bodyParser.urlencoded({ extended: false }));
site.use(bodyParser.json());
site.use(express.static(__dirname + '/../public'));
//Db start
var dbauth = 'none';
fs.readFile('D:/Misc/auth/wegotdb.txt', 'utf8', function(err, data) {
  if(err) {
    console.log('!!! Error in retrieving database authentication info. !!!');
  }
  dbauth = data;
});
var connectBot = undefined;
setTimeout(function() {
  connectBot = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'connectBot',
    password : dbauth,
    database : 'jdhomepage',
    debug    :  false
  });
  //Test query
  connectBot.getConnection(function(err, connection) {
    if(err) {
      console.log("Error in establishing database connection.");
      console.log(err);
      return;
    } else {
      console.log("DB connection established.");
      DB_ENABLED = true;
    }
    connection.release();
    connection.on('error', function(err) {
      console.log("Error in establishing database connection.");
      console.log(err);
      return;
    });
  });
}, 2000);
//Email protocols
var mailkey = 'none';
var transporter;
fs.readFile('D:/Misc/auth/verify.txt', 'utf8', function(err, data) {
  if(err) {
    console.log('!!! Error in retrieving email info. Email services are unavailable. !!!');
  }
  mailkey = data;
});
setTimeout(function() {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thesoapypenguin@gmail.com',
      pass: mailkey
    }
  });
  console.log("Email services operational.");
}, 4000);
/**site.use(expressSession({
  secret: 'thisisbutatest',
  cookie: {
    maxAge: 60000
  }
}));**/
var idle = 1;
var tick = undefined;
const PORT_NUM = 5260;
/******************************************************************************************************/
//Root page
site.get('/', function(req, res) {
  logConnection(req);
	if(req.url == "/look.css") {
		res.set("Content-Type", "text/css");
		if(pathmode == 0) {
			res.sendFile(path.resolve('D:/Servers/homepage/public/css/look.css'));
		} else {
			res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/css/look.css'));
		}
	} else {
		res.set("Content-Type", "text/html");
		if(pathmode == 0) {
			res.sendFile(path.resolve('D:/Servers/homepage/public/html/home.html'));
		} else {
			res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/html/home.html'));
		}
	}
});

//Survival text game
site.get('/survive', function(req, res) {
	if(req.url == "/survive/survive.css") {
		res.set("Content-Type", "text/css");
		if(pathmode == 0) {
			res.sendFile(path.resolve('D:/Servers/homepage/public/css/silver.css'));
		} else {
			res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/css/silver.css'));
		}
	} else {
		res.set("Content-Type", "text/html");
		if(pathmode == 0) {
			res.sendFile(path.resolve('D:/Servers/homepage/public/html/survive.html'));
		} else {
			res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/html/survive.html'));
		}
	}
});

site.get('/gamesuite', function(req, res) {
  if(pathmode == 0) {
    res.sendFile(path.resolve('D:/Servers/homepage/public/html/lobby.html'));
  } else if(pathmode == 1) {
    res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/html/lobby.html'));
  }
});

//Game pages
site.get('/tweetlord/:gameCode', function(req, res) {
  if(req.url == "/tweetlord/neon.css") {
    res.set("Content-Type", "text/css");
    if(pathmode == 0) {
      res.sendFile(path.resolve('D:/Servers/homepage/public/css/neon.css'));
    } else if(pathmode == 1) {
      res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/css/neon.css'));
    }
  } else {
    res.set("Content-Type", "text/html");
    if(pathmode == 0) {
      res.sendFile(path.resolve('D:/Servers/homepage/public/html/tweetlord.html'));
    } else if(pathmode == 1) {
      res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/html/tweetlord.html'));
    }
  }
});

site.get('/imposter/:gameCode', function(req, res) {
  if(req.url == "/imposter/iridium.css") {
    res.set("Content-Type", "text/css");
    if(pathmode == 0) {
      res.sendFile(path.resolve('D:/Servers/homepage/public/css/iridium.css'));
    } else if(pathmode == 1) {
      res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/css/iridium.css'));
    }
  } else {
    res.set("Content-Type", "text/html");
    if(pathmode == 0) {
      res.sendFile(path.resolve('D:/Servers/homepage/public/html/imposter.html'));
    } else if(pathmode == 1) {
      res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/html/imposter.html'));
    }
  }
});

site.get('/pistolwhip', function(req, res) {
    if(req.url == "/pistolwhip/platinum.css") {
    res.set("Content-Type", "text/css");
    if(pathmode == 0) {
      res.sendFile(path.resolve('D:/Servers/homepage/public/css/platinum.css'));
    } else if(pathmode == 1) {
      res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/css/platinum.css'));
    }
  } else {
    res.set("Content-Type", "text/html");
    if(pathmode == 0) {
      res.sendFile(path.resolve('D:/Servers/homepage/public/html/pistolwhip.html'));
    } else if(pathmode == 1) {
      res.sendFile(path.resolve('/home/hydra/Apps/homepage/public/html/pistolwhip.html'));
    }
  }
});

site.get('/roleroller', function(req, res) {
  res.sendFile(path.resolve('D:/Servers/homepage/public/html/roleroller.html'));
});
/* _/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_/-\_ */
/*******************************************************************************************************************************/
//Game constructor
function startGame(gameName) {
    if(gameName == "tweetlord") {
        var gameState = {
            title: "tweetlord",
            inProgress: false,
            joinable: true,
            code: generateGC(),
            players: {1:"",2:"",3:"",4:"",5:"",6:""},
            playerct: 0,
            points: {1:0,2:0,3:0,4:0,5:0,6:0},
            timers: {0:60,1:60,2:30,3:15,4:10,5:60},
            tweeters: {1:0,2:0,3:0,4:0,5:0,6:0},
            prompts: {1:0,2:0,3:0,4:0,5:0,6:0},
            tweets: {1:"",2:"",3:"",4:"",5:"",6:""},
            round: 0,
            phase: 0,
            starttime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            endtime: undefined,
            postpones: 0,
            currentTweeter: 0,
            hasTweeted: []
        }
        console.log("New Tweetlord gameState created");
        return gameState;
    } else if(gameName == "imposter") {
        var gameState = {
            title: "imposter",
            inProgress: false,
            joinable: true,
            code: generateGC(),
            players: {1:"",2:"",3:"",4:"",5:"",6:"",7:"",8:"",9:"",10:""},
            playerct: 0,
            timers: {0:60,1:360},
            round: 0,
            phase: 0,
            starttime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            endtime: undefined,
            postpones: 0,
            scenario: "undefined",
            roles: {1:99,2:99,3:99,4:99,5:99,6:99,7:99,8:99,9:99,10:99},
            votes: {}
        }
        gameState = imposter.assignRoles(gameState);
        console.log("New Imposter gameState created");
        return gameState;
    } else {
        console.log("Error in call to startGame");
        return null;
    }
}
var GAMELIST = {};
var SOCKETLIST = {};
var PLAYERLIST = {};
/*******************************************************************************************************************************/
//Imposter functions
var imposter = require('./imposterFuncs.js');
/*******************************************************************************************************************************/
//Lobby forms
site.post('/scripts/makeGame', function(req, res) {
  //Make game
  var gameTitle = req.body.gameTitle;
	if(gameTitle == "pistolwhip") {
		res.writeHead(301, { Location: '/' + gameTitle });
		res.end();
		return;
	}
  var newGame = startGame(gameTitle);
      newGame.players[1] = req.body.namepromptM;
      newGame.playerct += 1;
      newGame.inProgress = true;
  //req.session.gc = newGame.code;
  GAMELIST[newGame.code] = newGame;
  //Make player
  var playerid = Object.keys(PLAYERLIST).length + 1;
  var player = {
      id: playerid,
      slot: 1,
      name: req.body.namepromptM,
      gameTitle: req.body.gameTitle,
      gc: newGame.code
  }
  PLAYERLIST[player.id] = player;
  console.log("Player " + player.id + " created");
  res.writeHead(301, { Location: '/' + gameTitle + '/' + newGame.code });
  res.end();
});

site.post('/scripts/joinGame', function(req, res) {
    var cgc = req.body.gameprompt;
    var gameTitle = req.body.gameTitle;
    var myGame = getGame(cgc);
    if(myGame == "GameNotFound") {
        res.status(500).send("No game exists with that game code");
        res.end();
        return;
    }
    if(myGame.joinable == false) {
        res.status(500).send("That game is currently in progress");
        res.end();
        return;
    }
    //Check if full
    var isFull = true;
    for(var p in myGame.players) {
        var pname = myGame.players[p];
        if(pname == "") {
            isFull = false;
            break;
        }
    }
    if(isFull) {
        res.status(500).send("Sorry, that game is full");
        res.end();
        return;
    }
    //Add name
    try {
        for(var i = 0; i < 6; i++) {
            //Be original
            if(myGame.players[i] == req.body.namepromptJ) {
                req.body.namepromptJ = "Other " + req.body.namepromptJ;
            }
            if(myGame.players[i] == "") {
                myGame.players[i] = req.body.namepromptJ;
                myGame.playerct += 1;
                var playerid = Object.keys(PLAYERLIST).length + 1;
                var player = {
                    id: playerid,
                    slot: i,
                    name: req.body.namepromptJ,
                    gameTitle: req.body.gameTitle,
                    gc: myGame.code
                }
                PLAYERLIST[player.id] = player;
                console.log("Player " + player.id + " created");
                break;
            }
        }
    } catch(err) {
        res.status(500).send("Internal error in joining game");
        res.end();
        return;
    }
    //req.session.gc = myGame.code;
    res.writeHead(301, { Location: '/' + gameTitle + '/' + cgc });
    res.end();
});

//Contact form
site.post('/scripts/contact', function(req, res) {
  var name = htmlEncode(req.body.contactName);
  var text = htmlEncode(req.body.contactText);
  if(DB_ENABLED == true) {
    connectBot.getConnection(function(err, connection) {
      if(err) {
        console.log('Error in storing contact request.');
        console.log('From: ' + name);
        console.log('Message: ' + text);
        return;
      }
      connection.query("INSERT INTO contactRequests (requestName, requestBody) VALUES ('" + name + "', '" + text + "')", function(err, result, fields) {
        connection.release();
        if(err) {
          console.log('Error in saving contact request to db');
          console.log(name + ' ' + text);
          console.log(err);
          return;
        }
        console.log('Contact request saved to db.');
      });
      connection.on('error', function(err) {
        console.log('Error in storing contact request.');
        console.log('From: ' + name);
        console.log('Message: ' + text);
        return;
      });
    });
  } else {
    console.log('Contact request received, but database interaction is disabled.');
    console.log('From: ' + name);
    console.log('Body: ' + text);
  }
});
/*******************************************************************************************************************************/
//Sockets
const io = require('socket.io')(serv);
io.on('connection', function(socket) {
    //Connection
    var slen = Object.keys(SOCKETLIST).length;
    socket.id = slen + 1;
    socket.player = PLAYERLIST[socket.id];
    socket.gameState = null;
    socket.ip = socket.request.connection.remoteAddress;
    SOCKETLIST[socket.id] = socket;
    console.log("Socket connection initialized: socket " + socket.id + " (" + socket.ip + ")");

    //Test ===========================================================
    socket.on('sockettest', function(data) {
        console.log(data.welcome);
    });
    //----------------------------------------------------------------

    //Setup ==========================================================
    socket.emit('setup', {
        socketId: socket.id
    });

    socket.on('sendGC', function(data) {
        //Fetch and assign gamestate
        socket.gc = data.gc;
        socket.gameState = getGame(socket.gc);
        console.log("Socket " + socket.id + " has joined game " + socket.gc);
        socket.emit('playerJoin', {
            gameState: socket.gameState,
            player: socket.player
        });
        emitToGame('refreshPlayers', socket.gameState.code);
        if(socket.gameState.phase == 0) {
            if(socket.gameState.title == "imposter") {
                var ph0data = {
                    gameState: socket.gameState,
                    scenarios: imposter.getScenarios()
                };
            } else {
                var ph0data = { gameState: socket.gameState };
            }
            socket.emit('setupPh0', ph0data);
        }
    });
    //----------------------------------------------------------------

    //Disconnection ==================================================
    socket.on('disconnect', function() {
        //Remove player
        socket.gameState.players[socket.id] = "";
        socket.gameState.playerct -= 1;
        //Move players down
        if(socket.gameState.players[socket.id + 1] != "") {
            for(var i = (socket.id + 1); i < 7; i++) {
                if(socket.gameState.title == "imposter") {
                    socket.gameState.players[i - 1] = socket.gameState.players[i];
                    socket.gameState.players[i] = "";
                    socket.gameState.roles[i - 1] = socket.gameState.roles[i];
                    socket.gameState.roles[i] = "";
                }
            }
        }
        //Remove game if no players left
        var isEmpty = true;
        for(var i = 1; i < 11; i++) {
            if(socket.gameState.players[i] != "") {
                isEmpty = false;
            }
        }
        if(isEmpty == true) {
            console.log("Game " + socket.gameState.code + " abandoned: removing...");
            delete GAMELIST[socket.gameState.code];
        }
        emitToGame('refreshPlayers', socket.gameState.code);
        //Remove socket/player
        delete SOCKETLIST[socket.id];
        delete PLAYERLIST[socket.id];
        console.log("Socket " + socket.id + " disconnected");
    });
    //----------------------------------------------------------------
    
    //Buttons ========================================================
    socket.on('postpone', function() {
        if(socket.gameState.postpones > 4) {
            socket.emit('tooManyPostpones');
            return;
        } else {
            socket.gameState.postpones = socket.gameState.postpones + 1;
            socket.gameState.timers[0] = socket.gameState.timers[0] + 15;
        }
    });
    
    socket.on('impatience', function() {
        socket.gameState.timers[0] = socket.gameState.timers[0] - 10;
    });
    //----------------------------------------------------------------

    //Pausing ========================================================
    socket.on('pause', function() {
        socket.gameState.inProgress = false;
        console.log("Game paused (" + socket.id);
    });

    socket.on('unpause', function() {
        socket.gameState.inProgress = true;
        console.log("Game resumed");
    });
    //----------------------------------------------------------------

    //Events =========================================================
    //~~~ Imposter ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    socket.on('imposterVictory', function() {
        socket.gameState.phase = 3;
        emitToGame('setupPh3', socket.gameState.code);
    });

    socket.on('imposterFailure', function() {
        socket.gameState.phase = 4;
        emitToGame('setupPh4', socket.gameState.code);
    });

    socket.on('callRestartVote', function(data) {
        if(!('restart' in socket.gameState.votes)) {
            var rvote = {
                caller: socket.id,
                callerslot: data.slot,
                time: 10,
                agree: 1,
                agreed: []
            }
            rvote.agreed.push(data.slot);
            socket.gameState.votes['restart'] = rvote;
            console.log("###IMPOSTER### Vote for restart called by S" + socket.id + " for " + socket.gameState.code);
            emitToGame('restartVote', socket.gameState.code);
        }
    });

    socket.on('voteForRestart', function() {
        if('restart' in socket.gameState.votes && socket.gameState.votes['restart'].agreed.indexOf(socket.player.slot) == -1) {
            socket.gameState.votes['restart'].agree += 1;
            if(socket.gameState.votes.restart.agree >= Math.round(socket.gameState.playerct * .75)) {
                console.log("###IMPOSTER### [" + socket.gameState.code + "] Restart vote successful, restarting game...");
                socket.gameState.joinable = true;
                socket.gameState.timers[0] = 60;
                socket.gameState.timers[1] = 360;
                socket.gameState.phase = 0;
                socket.gameState = imposter.assignRoles(socket.gameState);
                emitToGame('restartGame', socket.gameState.code);
                setTimeout(function() {
                    emitToGame('setup', socket.gameState.code);
                    emitToGame('setupPh0', socket.gameState.code);
                }, 800);
            }
        }
        emitToGame('updateVotes', socket.gameState.code);
    });

    socket.on('callReplayVote', function(data) {
        if(!('replay' in socket.gameState.votes)) {
            var rvote = {
                caller: socket.id,
                callerslot: data.slot,
                time: 10,
                agree: 1,
                agreed: []
            }
            rvote.agreed.push(data.slot);
            socket.gameState.votes['replay'] = rvote;
            console.log("###IMPOSTER### Vote for replay called by S" + socket.id + " for " + socket.gameState.code);
            emitToGame('replayVote', socket.gameState.code);
        }
    });

    socket.on('voteForReplay', function() {
        if('replay' in socket.gameState.votes && socket.gameState.votes['replay'].agreed.indexOf(socket.player.slot) == -1) {
            socket.gameState.votes['replay'].agree += 1;
            if(socket.gameState.votes.replay.agree >= Math.round(socket.gameState.playerct * .75)) {
                console.log("###IMPOSTER### [" + socket.gameState.code + "] Replay vote successful, resetting scenarios...");
                socket.gameState.timers[0] = 60;
                socket.gameState.timers[1] = 360;
                socket.gameState.phase = 1;
                socket.gameState = imposter.assignRoles(socket.gameState);
                socket.gameState = imposter.chooseImposter(socket.gameState);
                emitToGame('replayGame', socket.gameState.code);
                setTimeout(function() {
                    emitToGame('setupPh1', socket.gameState.code);
                }, 800);
            }
        }
        emitToGame('updateVotes', socket.gameState.code);
    });
    //----------------------------------------------------------------
});
io.listen(serv);
/******************************************************************************************************************************/
//Clock
function idlePoll() {
    if(idle) {
        var idlepoll = setInterval(function() {
            if(Object.keys(GAMELIST).length > 0) {
                console.log("Booting up!");
                startClock();
                clearInterval(idlepoll);
            }
        }, 2000);
    }
}
idlePoll();
function startClock() {
    tick = setInterval(function() {
        if(Object.keys(GAMELIST).length == 0) {
            console.log("No games in progress, going idle...");
            idle = true;
            clearInterval(tick);
            idlePoll();
        } else {
            idle = false;
        }
        for(var game in GAMELIST) {
            g = GAMELIST[game];
            /**IMPOSTER
                ph0: lobby
                ph1: game
                ph2: vote call (time run out)
                ph3: imposter victory
                ph4: bystander victory (imposter messed up)
            **/
            if(g.title == "imposter" && g.inProgress == true) {
                if(g.phase == 0) {
                    g.timers[0] -= 1;
                    emitToGame('tickPh0', g.code);
                    if(g.timers[0] < 1) {
                        g.phase = 1;
                        g.joinable = false;
                        g = imposter.chooseImposter(g);
                        emitToGame('setupPh1', g.code);
                    }
                } else if(g.phase == 1) {
                    g.timers[1] -= 1;
                    emitToGame('tickPh1', g.code);
                    if(g.timers[1] < 1) {
                        g.phase = 2;
                        emitToGame('setupPh2', g.code);
                    }
                    if(!isEmpty(g.votes)) {
                        for(v in g.votes) {
                            vote = g.votes[v];
                            if(vote.time < 0) {
                                delete(g.votes[v]);
                            } else {
                                vote.time -= 1;
                            }
                        }
                        emitToGame('voteTick', g.code);
                    }
                }
            }
        }
    }, 1000);
}
/*******************************************************************************************************************************/
//Utility functions
function contactEmail(req, res) {
  var name = htmlEncode(req.body.contactName);
  var text = htmlEncode(req.body.contactText);
  var mail = {
    from: 'thesoapypenguin@gmail.com',
    to: 'johntdemey@live.com',
    subject: ('SITE CONTACT REQUEST: ' + name),
    html: ('New request received from ' + name + '     Request: ' + text)
  }
  if(transporter == 'none') {
    console.log('New request received, but email services are unavailable.')
    console.log('NAME: ' + name);
    console.log('REQUEST: ' + text);
  } else {
    transporter.sendMail(mail, function(error, info) {
      if(error) {
        console.log('!!! Error in sending request email !!!');
        console.log(mail);
      } else {
        console.log('Request email deployed: ' + info.response);
      }
    });
  }
  res.render('form', {req: req.body});
  res.end();
}

function emitToGame(event, gc) {
    if(Object.keys(GAMELIST).length == 0) {
      console.log("No games in progress, going idle...");
      idle = true;
	  if(tick) {
		clearInterval(tick);
	  }
      idlePoll();
    }
    var found = false;
    for(var s in SOCKETLIST) {
        var socket = SOCKETLIST[s];
        if(socket.gc == gc) {
            found = true;
            socket.emit(event, {
                gameState: getGame(gc)
            });
        }
    }
    if(found == false) {
        console.log("Error in emitToGame(" + event + "): unable to find game " + gc);
    }
}

function emitToGameC(event, gc, data) {
    if(Object.keys(GAMELIST).length == 0) {
      console.log("No games in progress, going idle...");
      idle = true;
      clearInterval(tick);
      idlePoll();
    }
    var found = false;
    for(var s in SOCKETLIST) {
        var socket = SOCKETLIST[s];
        if(socket.gc == gc) {
            found = true;
            socket.emit(event, data);
        }
    }
    if(found == false) {
        console.log("Error in emitToGameC(" + event + "): unable to find game " + gc);
    }
}

function generateGC() {
    var gcchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var gc = "";
    for(var i = 0; i < 4; i++) {
        var rc = gcchars.charAt(Math.floor(Math.random() * 26));
        gc = gc + rc;
    }
    if(GAMELIST.hasOwnProperty(gc)) {
        generateGC();
        return;
    }
    return gc;
}

function generateSessionID() {
  var sesschars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  var sessid = '';
  for(var i = 0; i < 32; i++) {
    var rc = sesschars.charAt(Math.floor(Math.random() * 62));
    sessid = sessid + rc;
  }
  return sessid;
}

function getGame(gc) {
    var found = 0;
    var keys = Object.keys(GAMELIST);
    for(var i=0; i<keys.length; i++) {
        var g = GAMELIST[keys[i]];
        if(g.code == gc) {
            found = 1;
            return g;
        }
    }
    if(found == 0) {
        return "GameNotFound";
    }
}

function htmlEncode(str) {
  var el = document.createElement("div");
  el.innerText = el.textContent = str;
  str = el.innerHTML;
  return str;
}

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

function logConnection(req) {
  var visitaddr = null;
  var visitproxy = null;
  if(req.headers['via']) {
    visitaddr = req.headers['x-forwarded-for'];
    visitproxy = req.headers['via'];
  } else {
    visitaddr = req.connection.remoteAddress;
    visitproxy = 'none';
  }
  if(DB_ENABLED == true) {
    connectBot.getConnection(function(err, connection) {
      if(err) {
        console.log('Error logging client connection ' + visitaddr + ' /// ' + visitproxy);
        console.log(err);
      } else {
        connection.query("INSERT INTO visits (clientIP, clientProxy) VALUES ('" + visitaddr + "', '" + visitproxy + "')", function(err, result, fields) {
          connection.release();
          if(err) {
            console.log('Error in logging connection.');
            console.log(err);
            return;
          } else {
            console.log('Client ' + visitaddr + ' connected with proxy = ' + visitproxy);
          }
        });
      }
      connection.on('error', function(err) {
        console.log('Error in logging client connection ' + visitaddr + ' /// ' + visitproxy);
        console.log(err);
      });
    });
  } else {
    console.log('Client ' + visitaddr + ' connected with proxy = ' + visitproxy + ', but database interaction is disabled.');
  }
}
/*******************************************************************************************************************************/
serv.listen(PORT_NUM, function() {
	console.log("      ,',                                   ,',");
	console.log("     ', ,'                                 ', ,'");
	console.log("   ,----'--------------------------.     ,----'--------------------------.");
	console.log("  ('''|```|```|```|```|```|```|``|` |   ('''|```|```|```|```|```|```|``|``|");
	console.log("  |---'---'---'---'---'---'---'--'--|   |---'---'---'---'---'---'---'--'--|");
	console.log("__,_    ______  -SITE-   ______     |___,_    ______  -LIVE!-  ______     |__ ");
	console.log("  '---'(O)(O)'---------'(O)(O)'---'     '---'(O)(O)'---------'(O)(O)'---'");
	console.log("=================================================================================");
});
/*******************************************************************************************************************************/
