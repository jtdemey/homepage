//Output
function appendLine(line) {
  var linediv = $('<div class="linebox"></div>');
  var newline = $('<p class="line"></p>').text(line);
  linediv.append(newline);
  $('.line-area').append(linediv);
  $('.linebox').animate({
    bottom: '+=50px',
    opacity: '-=0.06'
  });
  var badgeEvent = new CustomEvent('addConsoleNotify', {'detail': 'Notify user of event in console if in a different gameview'});
  document.dispatchEvent(badgeEvent);
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
  var badgeEvent = new CustomEvent('addConsoleNotify', {'detail': 'Notify user of event in console if in a different gameview'});
  document.dispatchEvent(badgeEvent);
}

function appendLineR(lines) {
  var chosen = Math.floor(Math.random() * lines.length);
  appendLine(lines[chosen]);
}

function appendLineRC(lines, color) {
  var chosen = Math.floor(Math.random() * lines.length);
  appendLineC(lines[chosen], color);
}

//Parser funcs
function parseDir(dir) {
  switch(dir) {
    case "north": case "n": case "nort": case "northward": case "northwards":
      executeCommand(["GO", 0]);
      break;
    case "south": case "s": case "sout": case "southward": case "southwards":
      executeCommand(["GO", 1]);
      break;
    case "west": case "w": case "wes": case "westward": case "westwards":
      executeCommand(["GO", 2]);
      break;
    case "east": case "e": case "eas": case "eastward": case "eastwards":
      executeCommand(["GO", 3]);
      break;
    case "northeast": case "ne": case "northeas": case "northeastward": case "northeastwards":
      executeCommand(["GO", 4]);
      break;
    case "northwest": case "nw": case "northwes": case "northwestward": case "northwestwards":
      executeCommand(["GO", 5]);
      break;
    case "southeast": case "se": case "southeas": case "southeastward": case "southeastwards":
      executeCommand(["GO", 6]);
      break;
    case "southwest": case "sw": case "southwes": case "southwestward": case "southwestwards":
      executeCommand(["GO", 7]);
      break;
    case "up": case "u": case "upward": case "upwards": case "ascend": case "climb": case "escalate": case "rise":
      executeCommand(["GO", 8]);
      break;
    case "down": case "d": case "downward": case "downwards": case "descend": case "lower": case "fall":
      executeCommand(["GO", 9]);
      break;
    case "in": case "inside": case "enter": case "goin":
      executeCommand(["GO", 10]);
      break;
    case "out": case "outside": case "leave": case "exit": case "evacuate": case "escape": case "getout": case "ou":
      executeCommand(["GO", 11]);
      break;
    default:
      return false;
  }
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
        if(parseDir(inputsp[0].toLowerCase()) == false) {
          switch(inputsp[0].toLowerCase()) {
            case "help": case "halp": case "?":
              appendLineC("No help for you, pal.", "#009999");
              break;
            case "go": case "move": case "walk": case "run": case "travel":
            case "proceed": case "advance": case "progress": case "flee": case "sprint":
              appendLineC("Specify a direction in which to go.", "#009999");
              break;
            default:
              appendLineRC(["I can't understand that.", "Invalid input. Try 'help'.", "Input not understood.", "Try 'help' for a list of basic commands.",
                "Couldn't understand that - try 'help'."], "#009999");
              break;
          }
        }
        break;
	  case 2:
	    switch(inputsp[0].toLowerCase()) {
        case "help": case "halp": case "?":
          appendLineC("No help for you, pal.", "#009999");
          break;
        case "go": case "move": case "walk": case "run": case "travel":
        case "proceed": case "advance": case "progress": case "flee": case "sprint":
          parseDir(inputsp[1].toLowerCase());
          break;
      }
    }
  }
}
