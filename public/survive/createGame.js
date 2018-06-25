var gameMap = {};
//Constants
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
//Creation funcs
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
    enemyChance: [],
    visits: 0
  };
  gameMap[locale.name] = locale;
}
function addItem(n, am, l, pc, st, d, ef, use) {
  var item = {
    name: n,
    count: am,
    chance: pc,
    stackable: st,
    equipped: false,
    desc: d,
    effect: ef,
    onUse: use
  };
  var p = false;
  var q = 99;
  for(var i = 0; i < gameMap[l].items.length; i++) {
    console.log(gameMap[l].items[i]);
    if(gameMap[l].items[i].name == item.name) {
      p = true;
      q = i;
    }
  }
  if(p) {
    gameMap[l].items[q].count += item.count;
  } else {
    gameMap[l].items.push(item);
  }
}
function addEnemy(eid, l) {
  
}
function createEnemy(eid) {
  var e = {
    display: "enemy",
    health: 1,
    attack: 1,
    speed: 1,
    abilities: []
  };
  switch(eid) {
    case 0:
      e.display = "Wolf"; e.health = randomFromSet([12, 13, 14, 15]); e.attack = 65; e.speed = 4;
      e.abilities.push(function() { normalAttack(e, 3, 8, 'bite') });
      break;
  }
  return e;
}
//Attack funcs
var normalAttack = function(enemy, mind, maxd, kind) {
  var aroll = Math.ceil(Math.random() * 100);
  if(enemy.attack > aroll) {
    var m = mind;
    var dmgs = [];
    while(m <= (maxd + 1)) {
      dmgs.push(m);
      m += 1;
    }
    var d = randomFromSet(dmgs);
    Player.health -= d;
    if(kind == 'bite') {
      appendLineR(["The " + enemy.display.toLowerCase() + " gnashes its teeth and bites you.",
      "The " + enemy.display.toLowerCase() + " sinks its teeth into your arm. You struggle free.",
      "The " + enemy.display.toLowerCase() + " bites you.",
      "The " + enemy.display.toLowerCase() + " attacks you with its ravenous bite.",
      "You wince in pain as the " + enemy.display.toLowerCase() + " bites you."]);
    }
  } else {
    if(kind == 'bite') {
      appendLineR(["The " + enemy.display.toLowerCase() + " misses its bite.",
        "The " + enemy.display.toLowerCase() + " lunges forward but misses.",
        "The " + enemy.display.toLowerCase() + "'s bite barely misses your neck.",
        "The " + enemy.display.toLowerCase() + "'s bite barely misses your leg.",
        "The " + enemy.display.toLowerCase() + "'s bite barely misses your body.",
        "The " + enemy.display.toLowerCase() + " attempts to bite you but misses."]);
    }
  }
};
//Item funcs
function useHandwarmers() {
  if(Player.temperature < 120) {
    Player.temperature += 10;
    appendLine("The handwarmers help fight the cold.");
  } else {
    appendLine("No need for those now.");
  }
  consumeItemByName('Handwarmers', 1);
}
//Generation funcs
function generateRoads() {
  var rid = 0;
  var rex = [0,0,"for_boundary","for_road1",0,0,0,0,0,0,0,0];
  var rexp = [0,0,"You travel down the road.","Against your instincts, you travel into the clearing.",0,0,0,0,0,0,0,0];
  var rtemp = 1;
  var rphr = "To the west lies a distinct line bereft of any foliage - looks unnatural.";
  var ophr = ["You stand in the center of the snow-covered dirt road.", "The road stretches seemingly endlessly to the east and west.",
    "The road stretches onward, with dark forest to the north and south.",
    "The dead trees encompass the road in a canopy.",
    "You stand in the road with the bleak sky above."];
  var rcom = ["The blanket of snow on the road lies flat with slight indentations from animal tracks.",
    "The woods to the north and south look formidable and dark.",
    "You can't shake the feeling that you're not alone.",
    "A faint, silent breeze gently sweeps the snowy road.",
    "Thistles and underbrush line the sides of the road."];
  for(var i = 0; i < 15; i++) {
    addLocale(("for_road" + rid), "Road", rex, rexp, rtemp, 2, rphr, rcom);
    //Randomize entry phase
    if(i > 0) {
      var phrroll = Math.floor(Math.random() * ophr.length);
      rphr = ophr[phrroll];
    }
    //Arrange exits
    if((i < 6) || (i > 7 && i < 14)) {
      rex[2] = "for_road" + (rid + 2);
      rex[3] = "for_road" + rid;
    } else if(i == 6) {
      rex[2] = "for_mailbox";
      rex[3] = "for_road5";
    } else if(i == 7) {
      rex[2] = "for_road8";
      rex[3] = "for_mailbox";
    } else {
      rex[2] = "for_boundary";
      rex[3] = "for_road13";
    }
    //Apply temperature dropoff
    if(i > 2 && i < 6) {
      rtemp = 2;
    } else if(i > 5 && i < 8) {
      rtemp = 3;
    } else if(i > 7 && i < 12) {
      rtemp = 2;
    } else if(i > 11) {
      rtemp = 1;
    }
    rid += 1;
  }
}
//Utility funcs
function randomFromSet(set) {
  var r = Math.floor(Math.random() * set.length);
  return set[r];
}
/**LOCATION TEMPLATE
  locale name: {
    name: <name of locale>,
    exits: <an array with 12 elements: one for each direction
            (n, s, e, w, ne, nw, se, sw, up, down, in, out)
              0 if there's nothing in that direction
              otherwise, the name of the location>
    exitPhrases: <array of 12 elements representing if a phrase and delay should occur when leaving through an exit>
    temperature: <6:"hot" / 5:"warm" / 4:"normal" / 3:"cold" / 2:"very cold" / 1:"frigid" / 0:"glacial">
    visibility: <5:"bright" / 4:"normal" / 3:"obscured" / 2:"dark" / 1:"very dark" / 0:"pitch black">
    enterPhrase,
    comments: <array of random observations that could print>
    items: <array of Item objects contained within locale>
    enemies: <array of Enemy objects contained within locale>
    [to-implement] events: <array of GameEvent objects containing scripted events and their triggers>
    visits: <count of locale entries>
  },
 MAP
--river border--
WOODS1|WOODS2|WOODS3|WOODS4|WOODS5|WOODS6|LCKGT2|000000|000000|000000|000000|000000|DOCKWE|DOCKEA|MUDPND|000000|

WOODS7|BUNKER|WOODS8|WOODS9|WOOD10|WOOD11|SERVQ1|SERVQ2|PORCH1|PORCH2|CELARD|LAWN01|COURTN|TREEHO|HEDGE1|000000|

WOOD12|WOOD13|WOOD14|WOOD15|WOOD16|WOOD17|KITCHN|HALL00|STUDYN|STAIRD|FLWRBD|COURTW|COURTC|COURTE|HEDGE2|000000|

WOOD18|WOOD19|WOOD20|WOOD21|WOOD22|WOOD23|DINING|STAIRU|STUDYS|STORAG|STEPST|LAWN02|COURTS|TOOLSH|HEDGE3|000000|

WOOD24|WOOD25|WOOD26|WOOD27|WOOD28|WOOD29|LIVNRM|FOYER0|DEN000|LADDER|LCKGT1|HEDGE4|HEDGE5|HEDGE6|HEDGE7|000000|

WOOD30|WOOD31|WOOD32|WOOD33|WOOD34|WOOD35|WOOD36|FRNTYD|FRNTGD|FYDTRE|000000|000000|000000|000000|000000|000000|

WOOD37|WOOD38|WOOD39|WOOD40|WOOD41|WOOD42|WOOD43|PATSHD|SHED00|WELL00|000000|000000|000000|000000|000000|000000|

ROAD00|ROAD01|ROAD02|ROAD03|ROAD04|ROAD05|ROAD06|CARMBX|ROAD07|ROAD08|ROAD09|ROAD10|ROAD11|ROAD12|ROAD13|ROAD14|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|

CEMGT1|CEMGT2|CEMGT3|CEMGT4|CEMGT5|CEMGT6|CEMGT7|CEMGT8|CEMGT9|CEMG10|CEMG11|CEMG12|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|CEMG13|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|CEMG14|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|CEMG15|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|CEMG16|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|CEMG17|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|000000|CEMG18|000000|000000|000000|000000|
--cornfield border-- (he who walks between the rows?)
**/
//Boundaries
addLocale("for_boundary", "Forest Bounds",
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  2, 3,
  "There is an observable line where all vegetation stops, resembling a border.",
  []
);
addLocale("corn_boundary", "Cornfield",
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  1, 1,
  "The wind completely stops. It's freezing here.",
  []
);
generateRoads();
addLocale("for_car", "Car",
  [0,0,0,0,0,0,0,0,0,0,0,"for_mailbox"],
  [0,0,0,0,0,0,0,0,0,0,0,"You open the door and step outside."],
  4, 4,
  "You sit in the driver's seat.",
  ["A gust of wind rushes against the windshield.", "It's lightly snowing outside.", "Everything is still and quiet."]
);
addItem("Handwarmers", 2, "for_car", 1, true, 'Small packets that emit heat for a few minutes - a meager relief from the cold.',
  undefined, function() { useHandwarmers(); });
addLocale("for_mailbox", "Mailbox",
  ["for_shedpath",0,"for_road7","for_road6",0,0,0,0,0,0,"for_car",0],
  ["You head down the driveway toward the mansion.",0,0,0,0,0,0,0,0,0,"You open the driver side door of your car.",0],
  3, 4,
  "You stand at the edge of a driveway running north. There's a mailbox here.",
  ["To the north stands a dark mansion shrouded by dead foliage.", "It sure is cold out here.", "You see a small shed to the north.", "Your car is collecting a light layer of snow."]
);
addLocale("for_shedpath", "Driveway",
  ["for_frontyd","for_mailbox","for_shed",0,0,0,0,0,0,0,0,0],
  ["You continue down the driveway.",0,"The heavy shed door swings open in the wind.",0,0,0,0,0,0,0,0,0],
  3, 4,
  "You are on a large driveway running north with a shed resting to the east.",
  ["Your car rests to the south by the old mailbox.", "A chill runs through the air.",
    "To the north is the overgrown front yard to an old estate.", "You can see your car resting idly to the south."],
);
addLocale("for_shed", "Shed",
  [0,0,0,"for_shedpath",0,0,0,0,0,0,0,0],
  [0,0,0,"The shoddy shed door swings open.",0,0,0,0,0,0,0,0],
  4, 4,
  "You step inside the modest tool shed.",
  ["The shoddy wooden walls aren't very good at keeping the cold out.", "The floor is merely heavily-trampled dirt.", "The gentle wind whistles through the cracks in the walls."]
);
addLocale("for_frontyd", "Front Yard",
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  3, 4,
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
Player.locale = gameMap.for_car;
