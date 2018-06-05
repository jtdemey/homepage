/** MAP
--river border--
000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|SERVQ1|SERVQ2|PORCH1|PORCH2|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|KITCHN|HALL00|STUDYN|STAIRD|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|DINING|STAIRU|STUDYS|STORAG|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|LIVNRM|FOYER0|DEN000|LADDER|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|FRNTYD|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|PATSHD|SHED00|000000|000000|000000|000000|000000|000000|000000|

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
--cornfield border-- (he who walks between the rows?)
**/
var gameMap = {};
  /**LOCATION TEMPLATE
  locale name: {
    name: <name of locale>,
    exits: <an array with 12 elements: one for each direction
            (n, s, e, w, ne, nw, se, sw, up, down, in, out)
              0 if there's nothing in that direction
              otherwise, the name of the location>
    exitPhrases: <array of 12 elements representing if a phrase and delay should occur when leaving through an exit>
    temperature: <"hot" / "warm" / "normal" / "cold" / "very cold" / "frigid" / "glacial">
    visibility: <"bright" / "normal" / "obscured" / "dark" / "very dark" / "pitch black">
    enterPhrase,
    comments: <array of random observations that could print>
    items: <array of Item objects contained within locale>
    enemies: <array of Enemy objects contained within locale>
    [to-implement] events: <array of GameEvent objects containing scripted events and their triggers>
    visits: <count of locale entries>
  },
  **/
function addLocale(n, d, e, ep, t, v, en, c) {
  var locale = {
    name: n,
    display: d,
    exits: e,
    exitPhrases: ep,
    temperature: t,
    visibility: v,
    enterPhrase: en,
    comments: c,
    items: [],
    enemies: [],
    visits: 0
  };
  gameMap[locale.name] = locale;
}

function addItem(n, l, pc, st, ef, use) {
  var item = {
    name: n,
    pcchance: pc,
    stackable: st,
    effect: ef,
    onUse: use
  };
  gameMap.l.items.push(item);
}

function addItems(n, l, pc, st, ef, use, am) {
  var item = {
    name: n,
    pcchance: pc,
    stackable: st,
    effect: ef,
    onUse: use
  };
  for(var i = 0; i < am; i++) {
    gameMap.l.items.push(item);
  }
}

//function addEnemy(h, )

addLocale("loc_car", "Car",
  [0,0,0,0,0,0,0,0,0,0,0,"loc_mailbox"],
  [0,0,0,0,0,0,0,0,0,0,0,"You open the door and step outside."],
  "normal", "normal",
  "You sit in the driver's seat.",
  ["A gust of wind rushes against the windshield.", "It's lightly snowing outside.", "Everything is still and quiet."]
);
addLocale("loc_mailbox", "Mailbox",
  ["loc_shedpath",0,0,0,0,0,0,0,0,0,"loc_car",0],
  ["You head down the driveway toward the mansion.",0,0,0,0,0,0,0,0,0,"You open the driver side door of your car.",0],
  "cold", "normal",
  "You stand at the edge of a driveway running north. There's a mailbox here.",
  ["To the north stands a dark mansion shrouded by dead foliage.", "It sure is cold out here.", "You see a small shed to the north.", "Your car is collecting a light layer of snow."]
);
addLocale("loc_shedpath", "Driveway",
  ["loc_frontyd","loc_mailbox","loc_shed",0,0,0,0,0,0,0,0,0],
  ["You continue down the driveway.",0,0,0,0,0,0,0,0,0,"The heavy shed door swings open in the wind.",0],
  "cold", "normal",
  "You are on a large driveway running north with a shed resting to the east.",
  ["Your car rests to the south by the old mailbox.", "A chill runs through the air.",
    "To the north is the overgrown front yard to an old estate.", "You can see your car resting idly to the south."],
);
addLocale("loc_shed", "Shed",
  [0,0,0,"loc_shedpath",0,0,0,0,0,0,0,0],
  [0,0,0,"The shoddy shed door swings open.",0,0,0,0,0,0,0,0],
  "normal", "normal",
  "You step inside the cold, dark shed "
);
addLocale("loc_frontyd", "Front Yard",
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  "cold", "normal",
  "Dense, dead overgrowth covers the mansion to the north. A shoddy cobblestone well stands to the west.",
  ["A thick layer of dead ivy and vines encompasses the western half of the mansion's face."]
);

for(var l in gameMap) {
  if(gameMap.hasOwnProperty(l)) {
    loc = gameMap[l];
    loc.onTick = function(tick) {
      //Roll comments
      if((tick % 16 == 0) && (Player.locale.comments.length > 0)) {
        var croll = Math.floor(Math.random() * 3);
        if(croll == 0) {
          var cind = Math.floor(Math.random() * (Player.locale.comments.length));
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
};

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
};

Player.locale = gameMap.loc_car;
