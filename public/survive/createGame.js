/** MAP

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|KITCHN|HALL00|STUDYN|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|DINING|STAIR0|STUDYS|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|LIVNRM|FOYER0|DEN000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|FRNTYD|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|PATSHD|000000|000000|000000|000000|000000|000000|000000|000000|

ROAD00|ROAD01|ROAD02|ROAD03|ROAD04|ROAD05|ROAD06|CARMBX|ROAD07|ROAD08|ROAD09|ROAD10|ROAD11|ROAD12|ROAD13|ROAD14|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

**/
var gameMap = {
  /**LOCATION TEMPLATE
  locale name: {
    name: <name of locale>,
    exits: <an array with 12 elements: one for each direction
            (n, s, e, w, ne, nw, se, sw, up, down, in, out)
              0 if there's nothing in that direction
              otherwise, the name of the location>
    temperature: <"hot" / "warm" / "normal" / "cold" / "very cold" / "frigid" / "glacial">
    visibility: <"bright" / "normal" / "obscured" / "dark" / "very dark" / "pitch black">
  },
  **/
  loc_car: {
    name: "loc_car",
    display: "Car",
    exits: [0,0,0,0,0,0,0,0,0,0,0,"loc_mailbox"],
    exitPhrases: [0,0,0,0,0,0,0,0,0,0,0,"You open the door and step outside."],
    temperature: "warm",
    visibility: "normal",
    enterPhrase: "You sit in the driver's seat.",
    comments: ["A gust of wind rushes against the windshield.", "It's lightly snowing outside.", "Everything is still and quiet."],
    visits: 0
  },
  loc_mailbox: {
    name: "loc_mailbox",
    display: "Mailbox",
    exits: ["loc_shedpath",0,0,0,0,0,0,0,0,0,"loc_car",0],
    exitPhrases: ["You head down the driveway toward the mansion.",0,0,0,0,0,0,0,0,0,"You open the driver side door of your car.",0],
    temperature: "cold",
    visibility: "normal",
    enterPhrase: "You stand at the edge of a driveway running north. There's a mailbox here.",
    comments: ["To the north stands a dark mansion shrouded by dead foliage.", "It sure is cold out here.",
              "You see a small shed to the north.", "Your car is collecting a light layer of snow."],
    visits: 0
  },
  loc_shedpath: {
    name: "loc_shedpath",
    display: "Driveway",
    exits: ["loc_frontyd","loc_mailbox",0,0,0,0,0,0,0,0,"loc_shed",0],
    exitPhrases: ["You continue down the driveway.",0,0,0,0,0,0,0,0,0,"The heavy shed door swings open in the wind.",0],
    temperature: "cold",
    visibility: "normal",
    enterPhrase: "You stand on a large driveway running north with a shed resting nearby.",
    comments: ["Your car rests to the south by the old mailbox.", "A chill runs through the air.",
              "To the north is the overgrown front yard to an old estate.", "You can see your car resting idly to the south."],
    visits: 0
  },
  loc_frontyd: {
    name: "loc_frontyd",
    display: "Front Yard",
    exits: ["loc_foyer",0,0,0,0,0,0,0,0,0,0,0],
    exitPhrases: ["The large, ornate door swings open with little resistance.",0,0,0,0,0,0,0,0,0,0,0],
    temperature: "warm",
    visibility: "normal",
    enterPhrase: "You sit in the driver's seat.",
    comments: ["A gust of wind rushes against the windshield.", "It's lightly snowing outside.", "Everything is still and quiet."],
    visits: 0
  }
}

for(var l in gameMap) {
  if(gameMap.hasOwnProperty(l)) {
    loc = gameMap[l];
    loc.onTick = function(tick) {
      if((tick % 16 == 0) && (Player.locale.comments.length > 0)) {
        var croll = Math.floor(Math.random() * 3);
        if(croll == 0) {
          var cind = Math.floor(Math.random() * (Player.locale.comments.length + 1));
          appendLine(Player.locale.comments[cind]);
          Player.locale.comments.splice(cind, 1);
        }
      }
    }
  }
}

const CARDINAL_DIRS = {
  "N": 0,
  "S": 1,
  "E": 2,
  "W": 3,
  "NE": 4,
  "NW": 5,
  "SE": 6,
  "SW": 7,
  "U": 8,
  "D": 9,
  "I": 10,
  "O": 11
}

const CARDINAL_FULL = {
	0: "NORTH",
	1: "SOUTH",
	2: "EAST",
	3: "WEST",
	4: "NORTHEAST",
	5: "NORTHWEST",
	6: "SOUTHEAST",
	7: "SOUTHWEST",
	8: "UP",
	9: "DOWN",
	10: "IN",
	11: "OUT"
}

var localeList = [gameMap.loc_car, gameMap.loc_mailbox];
Player.locale = gameMap.loc_car;
