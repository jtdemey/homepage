//Need to declare these first
function appendLine(line) {
  var linediv = $('<div class="linebox"></div>');
  var newline = $('<p class="line" align="center"></p>').text(line);
  linediv.append(newline);
  $('.line-area').append(linediv);
  $('.linebox').animate({
    bottom: '+=50px',
    opacity: '-=0.06'
  });
}

/**Line color categories:
Debug/console: #009999
Emergency: red
Urgent: #ff6600

**/
var coloredLineIndex = 1;
function appendLineC(line, color) {
  var linediv = $('<div class="linebox"></div>');
  var newline = $('<p class="line colored-line' + coloredLineIndex + '" align="center"></p>').text(line);
  linediv.append(newline);
  $('.line-area').append(linediv);
  $('.linebox').animate({
    bottom: '+=50px',
    opacity: '-=0.06'
  });
  $('.colored-line' + coloredLineIndex).css({"color": color});
  coloredLineIndex = coloredLineIndex + 1;
  if(coloredLineIndex > 999) {
    coloredLineIndex = 1;
  }
}

function appendLineR(lines) {
  var chosen = Math.floor(Math.random() * lines.length);
  appendLine(lines[chosen]);
}

function appendLineRC(lines, color) {
  var chosen = Math.floor(Math.random() * lines.length);
  appendLineC(lines[chosen], color);
}

//PARSER
var Parser = {
  // commlist: [
  //   //REFERENCE -> 0-0
  //   "HELP",
  //   //GO -> 1-10
  //   "GO","MOVE","WALK","RUN","TRAVEL","PROCEED","ADVANCE","PROGRESS","FLEE","SPRINT",
  //   //DIRECTIONAL GO -> 11-43
  //   "NORTH","N","SOUTH","S","EAST","E","WEST","W","NORTHEAST","NE","SOUTHEAST","SE","NORTHWEST","NW","SOUTHWEST","SW","UP","ASCEND","ELEVATE","CLIMB",
  //   "DOWN","DESCEND","INSIDE","ENTER","OUT","OUTSIDE","LEAVE","EXIT","EVACUATE","FLEE","RETURN","RETREAT"
  // ],
  parse: function(rawinput) {
    rawinput = rawinput.trim();
    var inputsp = rawinput.split(" ");
    var commAmt = inputsp.length;
    switch(commAmt) {
      case 0:
        break;
      case 1:
        switch(inputsp[0].toLowerCase()) {
          case "help": case "?":
            appendLineC("No help for you, pal.", "#009999");
            break;
          case "go": case "move": case "walk": case "run": case "travel":
          case "proceed": case "advance": case "progress": case "flee": case "sprint":
            appendLineC("Specify a direction in which to go.", "#009999");
            break;
          case "north": case "n": case "nort": case "northward": case "northwards":
            executeCommand(["GO","N"]);
            break;
          case "south": case "s": case "sout": case "southward": case "southwards":
            executeCommand(["GO", "S"]);
            break;
          case "west": case "w": case "wes": case "westward": case "westwards":
            executeCommand(["GO", "W"]);
            break;
          case "east": case "e": case "eas": case "eastward": case "eastwards":
            executeCommand(["GO", "E"]);
            break;
          case "northeast": case "ne": case "northeas": case "northeastward": case "northeastwards":
            executeCommand(["GO", "NE"]);
            break;
          case "northwest": case "nw": case "northwes": case "northwestward": case "northwestwards":
            executeCommand(["GO", "NW"]);
            break;
          case "southeast": case "se": case "southeas": case "southeastward": case "southeastwards":
            executeCommand(["GO", "SE"]);
            break;
          case "southwest": case "sw": case "southwes": case "southwestward": case "southwestwards":
            executeCommand(["GO", "SW"]);
            break;
          case "up": case "u": case "upward": case "upwards": case "ascend": case "climb": case "escalate": case "rise":
            executeCommand(["GO", "U"]);
            break;
          case "down": case "d": case "downward": case "downwards": case "descend": case "lower": case "fall":
            executeCommand(["GO", "D"]);
            break;
          case "in": case "inside": case "enter": case "goin":
            executeCommand(["GO", "I"]);
            break;
          case "out": case "outside": case "leave": case "exit": case "evacuate": case "escape": case "getout": case "ou":
            executeCommand(["GO", "O"]);
            break;
          default:
            appendLineRC(["I can't understand that.", "Invalid input. Try 'help'.", "Input not understood.", "Try 'help' for a list of basic commands.",
              "Couldn't understand that - try 'help'."], "#009999");
            break;
        }
        break;
      default:
        appendLineRC(["That's too many words, hoss.", "I can understand commands, not essays.", "Let's try that again but with less words."], "#009999");
        break;
    }
  },
  oldparse: function(rawinput) {
    var commexists = 0;
    var commindex = undefined;
    rawinput = rawinput.trim();
    if(rawinput.includes(" ")) {
      var splitinput = rawinput.split(" ");
      rawinput = splitinput[0];
    }
    for(i=0; i<this.commlist.length; i++) {
      if(rawinput.toUpperCase() == this.commlist[i]) {
        commexists = 1;
        commindex = i;
      }
    }
    if(commexists == 0) {
      if(rawinput.trim().length > 24) {
        appendLineR(["Do you expect me to understand that?", "That's a whole lotta letters right there.", "I'm only a computer. Try 'help'."]);
      } else {
        appendLineR(["I can't understand that.", "Invalid input. Try 'help'.", "Input not understood.", "Try 'help' for a list of basic commands.",
                    "Couldn't understand that - try 'help'."]);
      }
      return;
    }
    //ONE WORD COMMAND
    if(!splitinput) {
      //REFERENCE
      if(commindex == 0) {
        appendLine("No help yet lol.");
        return;
      }
    //GO
      if(commindex > 0 && commindex < 11) {
        appendLine("Specify a direction in which to go.");
        return;
      }
    }
      //COMPOUND COMMAND
      else {
        //REFERENCE
        if(commindex == 0) {
          appendLine("No help yet lol.");
          return;
        }
        //GO
        if(commindex > 0 && commindex < 11) {
          var intendeddir = splitinput[1];

          var realdir = null;
          switch(intendeddir.toLowerCase()) {
            case "n": case "north":
              realdir = 0;
              break;
            case "s": case "south":
              realdir = 1;
              break;
            case "e": case "east":
              realdir = 2;
              break;
            case "w": case "west":
              realdir = 3;
              break;
            case "ne": case "northeast":
              realdir = 4;
              break;
            case "nw": case "northwest":
              realdir = 5;
              break;
            case "se": case "southeast":
              realdir = 6;
              break;
            case "sw": case "southwest":
              realdir = 7;
              break;
            case "up": case "upward": case "upwards": case "above":
              realdir = 8;
              break;
            case "down": case "downward": case "downwards": case "below":
              realdir = 9;
              break;
            case "in": case "inside": case "inward": case "inwards":
              realdir = 10;
              break;
            case "out": case "outside": case "outward": case "outwards":
              realdir = 11;
              break;
          }

          if(realdir == null) {
            appendLine("Invalid direction. Try cardinal direction names.");
            return;
          }

          Player.lastLocale = Player.locale;

          for(var i = 0; i < localeList.length; i++) {
            if(localeList[i].name == Player.locale.exits[realdir]) {
              Player.locale = localeList[i];
              appendLine(Player.locale.enterPhrase);
              return;
            }
          }
          appendLine("There's nothing in that direction.");
          return;
        }
      }
    }
  }
