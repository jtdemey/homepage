var gameMap = {};
//Constants
//Lee's landing marina
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
function addContainer(n, l, lk, c, lt) {
  var container = {
    name: n,
    locked: lk,
    contains: c,
    loot: lt
  };
  gameMap[l].containers.push(container);
}
function addEnemy(eid, l, w) {
  gameMap[l].enemies.push([eid, w]);
}
function addFeature(n, l, vt, ex) {
  var feature = {
    name: n,
    threshold: vt,
    onExamine: ex
  };
  gameMap[l].features.push(feature);
}
function addItem(n, am, l) {
  var item = createItem(n, am);
  var p = false;
  var q = 99;
  for(var i = 0; i < gameMap[l].items.length; i++) {
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
    loot: [],
    containers: [],
    features: [],
    enemies: [[null, 50]],
    visits: 0
  };
  gameMap[locale.name] = locale;
}
function addLoot(n, l, w, c) {
  var loots = [n, w, c];
  gameMap[l].loot.push(loots);
}
function createEnemy(eid) {
  var e = {
    display: "enemy",
    health: 1,
    attack: 1,
    speed: 1,
    cd: 0,
    abilities: []
  };
  switch(eid) {
    case 0:
      e.enemyID = eid; e.display = "Wolf"; e.health = randomFromSet([12, 13, 14, 15]); e.maxHealth = parseInt(e.health); e.attack = 65; e.speed = 4;
      e.abilities.push(['normal', 7, 13, 'bite']);
      e.abilities.push(['intimidate', 1, 5, 'growl']);
      break;
  }
  return e;
}
function createItem(n, am) {
  var item = {
    name: n,
    count: am,
    stackable: false,
    equipped: false,
    desc: '<none>',
    effect: undefined,
    onUse: undefined
  };
  switch(n) {
    case "Handwarmers":
      item.stackable = true;
      item.desc = 'Small packets that emit heat for a few minutes - a meager relief from the cold.';
      break;
    case "Flashlight":
      item.desc = 'A small portable torch that uses batteries - using it makes it easier to navigate and spot things.';
      break;
    case "Batteries":
      item.stackable = true;
      item.desc = 'A pair of AA batteries that can power simple devices such as a flashlight.';
      break;
    case "Tinder":
      item.stackable = true;
      item.desc = 'A small bundle of dry foliage - perfect for starting small fires.';
      break;
  }
  return item;
}
//Attack funcs
var normalAttack, drainAttack, multiHitAttack, healAttack, intimidateAttack = function() { return; };
//Generation funcs
function generateRoads() {
  var rid = 0;
  var rex = [0,0,"for_road1","for_boundary",0,0,0,0,0,0,0,0];
  var rexp = [0,0,"You travel eastward down the road.","You travel westward down the road.",0,0,0,0,0,0,0,0];
  var rtemp = 1;
  var rphr = "To the west lies a distinct line bereft of any foliage - looks unnatural.";
  var ophr = ["You stand in the center of the snow-covered dirt road.", "The road stretches seemingly endlessly to the east and west.",
    "The road stretches onward, with dark forest to the north and south.",
    "The dead trees encompass the road in a canopy.",
    "You stand in the road with the bleak sky above."];
  var rcom = ["The snow on the road lies flat with slight indentations from animals.",
    "The woods to the north and south look formidable and dark.",
    "You can't shake the feeling that you're not alone.",
    "A faint, silent breeze gently sweeps the snowy road.",
    "Thistles and underbrush line the sides of the road."];
  for(var i = 0; i < 15; i++) {
    addLocale(("for_road" + rid), "Road", rex, rexp, rtemp, 2, rphr, rcom);
    //Randomize entry phase
    if(i > 0 && i < 14) {
      var phrroll = Math.floor(Math.random() * ophr.length);
      rphr = ophr[phrroll];
    } else {
      rphr = "To the east lies a distinct line bereft of any foliage - looks unnatural.";
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
  gameMap["for_road1"].exits = [0,0,"for_road2","for_road0",0,0,0,0,0,0,0,0];
  gameMap["for_road2"].exits = [0,0,"for_road3","for_road1",0,0,0,0,0,0,0,0];
  gameMap["for_road3"].exits = [0,0,"for_road4","for_road2",0,0,0,0,0,0,0,0];
  gameMap["for_road4"].exits = [0,0,"for_road5","for_road3",0,0,0,0,0,0,0,0];
  gameMap["for_road5"].exits = [0,0,"for_road6","for_road4",0,0,0,0,0,0,0,0];
  gameMap["for_road6"].exits = [0,0,"for_mailbox","for_road5",0,0,0,0,0,0,0,0];
  gameMap["for_road7"].exits = [0,0,"for_road8","for_mailbox",0,0,0,0,0,0,0,0];
  gameMap["for_road8"].exits = [0,0,"for_road9","for_road7",0,0,0,0,0,0,0,0];
  gameMap["for_road9"].exits = [0,0,"for_road10","for_road8",0,0,0,0,0,0,0,0];
  gameMap["for_road10"].exits = [0,0,"for_road11","for_road9",0,0,0,0,0,0,0,0];
  gameMap["for_road11"].exits = [0,0,"for_road12","for_road10",0,0,0,0,0,0,0,0];
  gameMap["for_road12"].exits = [0,0,"for_road13","for_road11",0,0,0,0,0,0,0,0];
  gameMap["for_road13"].exits = [0,0,"for_road14","for_road12",0,0,0,0,0,0,0,0];
  gameMap["for_road14"].exits = [0,0,"for_boundary","for_road13",0,0,0,0,0,0,0,0];
}
//Utility funcs
function randomFromSet(set) {
  var r = Math.floor(Math.random() * set.length);
  return set[r];
}
function rollLootTables(items) {
  var sum = 0;
  for(var i = 0; i < items.length; i++) {
    sum += items[i][1];
  }
  var roll = Math.ceil(Math.random() * sum);
  var rangebuffer = 0;
  for(var j = 0; j < items.length; j++) {
    if(roll > rangebuffer && roll <= (rangebuffer + items[j][1])) {
      if(items[j][0] == 'none') {
        return;
      } else {
        var item = createItem(items[j][0], items[j][2]);
        addItem(items[j][0], items[j][2], Player.locale.name);
      }
    }
    rangebuffer += items[j][1];
  }
}
function rollEnemySpawns(enemies) {
  var sum = 0;
  for(var i = 0; i < enemies.length; i++) {
    sum += enemies[i][1];
  }
  var roll = Math.ceil(Math.random() * sum);
  var rangebuffer = 0;
  for(var j = 0; j < enemies.length; j++) {
    if(roll > rangebuffer && roll <= (rangebuffer + enemies[j][1])) {
      if(enemies[j][0] == 'none') {
        return;
      } else {
        var enemy = createEnemy(enemies[j][0]);
        startCombat(enemy);
      }
    }
    rangebuffer += enemies[j][1];
  }
}
/**
  -LOCATION TEMPLATE
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
    loot: <array of loot tables -> [<item name>, <item chance>, <item amount>]>
    features: <containers and examinables>
    enemies: <array of Enemy objects contained within locale>
    [to-implement] events: <array of GameEvent objects containing scripted events and their triggers>
    visits: <count of locale entries>
  },
  -MAP
--river border--
WOODS1|WOODS2|WOODS3|WOODS4|WOODS5|WOODS6|LCKGT2|000000|000000|000000|000000|000000|DOCKWE|DOCKEA|MUDPND|000000|

WOODS7|BUNKER|WOODS8|WOODS9|WOOD10|WOOD11|SERVQ1|SERVQ2|PORCH1|PORCH2|CELARD|LAWN01|COURTN|TREEHO|HEDGE1|000000|

WOOD12|WOOD13|WOOD14|WOOD15|WOOD16|WOOD17|KITCHN|HALL00|STUDYN|STAIRD|FLWRBD|COURTW|COURTC|COURTE|HEDGE2|000000|

WOOD18|WOOD19|WOOD20|WOOD21|WOOD22|WOOD23|DINING|STAIRU|STUDYS|STORAG|STEPST|LAWN02|COURTS|TOOLSH|HEDGE3|000000|

WOOD24|WOOD25|WOOD26|WOOD27|WOOD28|WOOD29|LIVNRM|FOYER0|DEN000|LADDER|LCKGT1|HEDGE4|HEDGE5|HEDGE6|HEDGE7|000000|

WOOD30|WOOD31|WOOD32|WOOD33|WOOD34|WOOD35|WOOD36|FRNTYD|FRNTGD|FYDTRE|000000|000000|000000|000000|000000|000000|

WOOD37|WOOD38|WOOD39|WOOD40|WOOD41|WOOD42|WOOD43|PATSHD|SHED00|WELL00|000000|000000|000000|000000|000000|000000|

ROAD00|ROAD01|ROAD02|ROAD03|ROAD04|ROAD05|ROAD06|CARMBX|ROAD07|ROAD08|ROAD09|ROAD10|ROAD11|ROAD12|ROAD13|ROAD14|

000000|000000|CEMPT1|000000|000000|000000|000000|000000|000000|CEMPT3|000000|000000|000000|000000|000000|000000|

000000|000000|CEMPT2|000000|000000|000000|000000|000000|000000|CEMPT4|000000|000000|000000|WTCTWR|000000|000000|

CEMGT1|CEMGT2|CEMGT3|CEMGT4|CEMGT5|CEMGT6|CEMGT7|CEMGT8|CEMGT9|CEMG10|CEMG11|CEMG12|000000|000000|000000|000000|

000000|000000|000000|000000|000000|000000|000000|GRAVE1|GRAVE2|GRAVE3|GRAVE4|CEMG13|000000|POND01|POND02|000000|

000000|000000|000000|000000|000000|000000|000000|GRAVE5|GRAVE6|GRAVE7|GRAVE8|CEMG14|000000|POND03|PNDDCK|000000|

000000|000000|000000|000000|CHRSUP|CHRCH1|CHRCH2|GRAVE9|GRAV10|GRAV11|GRAV12|CEMG15|000000|POND04|POND05|000000|

000000|000000|000000|000000|ALTAR_|CHRCH3|CHRCH4|GRAV13|GRAV14|GRAV15|GRAV16|CEMG16|000000|000000|000000|000000|

000000|000000|000000|000000|PASTRQ|CHRCH5|CHRCH6|GRAV17|GRAV18|GRAV19|GRAV20|CEMG17|000000|STABL1|STABL2|000000|

000000|000000|000000|000000|000000|000000|000000|GRAV21|GRAV22|GRAV23|GRAV24|CEMG18|000000|000000|000000|000000|
--cornfield border-- (he who walks between the rows?)
**/
/***LOCALES***********************************************************************************************************************/
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
//Road
generateRoads();
addLocale("for_car", "Car",
  [0,0,0,0,0,0,0,0,0,0,0,"for_mailbox"],
  [0,0,0,0,0,0,0,0,0,0,0,"You open the door and step outside."],
  4, 4,
  "You sit in the driver's seat.",
  ["A gust of wind rushes against the windshield.", "It's lightly snowing outside.", "Everything is still and quiet."]
);
addLocale("for_mailbox", "Mailbox",
  ["for_shedpath",0,"for_road7","for_road6",0,0,0,0,0,0,"for_car",0],
  ["You head down the driveway toward the mansion.",0,"You travel down the road.","You troad along the snow-padded road.",0,0,0,0,0,0,"You open the driver side door of your car.",0],
  3, 4,
  "You stand at the edge of a driveway running north. There's a mailbox here.",
  ["To the north stands a dark mansion shrouded by dead foliage.", "It sure is cold out here.", "You see a small shed to the north.", "Your car is collecting a light layer of snow."]
);
//Yard region
addLocale("for_shedpath", "Driveway",
  ["for_frontyd","for_mailbox","for_shed",0,0,0,0,0,0,0,"for_shed",0],
  ["You continue down the driveway.","You step towards the snowy roadside.","The heavy shed door swings open in the wind.",0,0,0,0,0,0,0,0,0],
  3, 4,
  "You are on a large driveway running north with a shed resting to the east.",
  ["Your car rests to the south by the old mailbox.", "A chill runs through the air.",
    "To the north is the overgrown front yard to an old estate.", "You can see your car resting idly to the south."],
);
addLocale("for_shed", "Shed",
  [0,0,0,"for_shedpath",0,0,0,0,0,0,0,"for_shedpath"],
  [0,0,0,"The shoddy shed door swings open.",0,0,0,0,0,0,0,0],
  4, 4,
  "You step inside the modest tool shed.",
  ["The shoddy wooden walls aren't very good at keeping the cold out.", "The floor is merely heavily-trampled dirt.", "The gentle wind whistles through the cracks in the walls."]
);
addLocale("for_frontyd", "Front Yard",
  [0,"for_shedpath","for_frontgarden",0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  3, 4,
  "Dense, dead overgrowth covers the mansion to the north. A shoddy cobblestone well stands to the west.",
  ["A thick layer of dead ivy and vines encompasses the western half of the mansion's face."]
);
/***ITEMS**************************************************************************************************************************/
addItem("Handwarmers", 2, "for_car");
/***LOOT***************************************************************************************************************************/
addLoot("Tinder", "for_mailbox", 50, 1);
addLoot("none", "for_mailbox", 10, 1);
/***CONTAINERS*********************************************************************************************************************/
addContainer("Glovebox", "for_car", false, [["Handwarmers", 1], ["Flashlight", 1], ["Batteries", 2]], []);
addContainer("Car Trunk", "for_mailbox", false, [["Crowbar", 1]], [["Jumper Cables", 2]]);
/***FEATURES***********************************************************************************************************************/
addFeature("Rearview Mirror", "for_car", 1, ["The mirror reflects nothing.", "Must be a new moon."]);
addFeature("Side Mirror", "for_car", 1, ["The road behind you stretches on seemingly endlessly."]);
addFeature("Windshield", "for_car", 1, ["The inside of the windshield is coated with a spotty fog."]);
/***ENEMIES************************************************************************************************************************/
addEnemy(0, "for_mailbox", 5000);
/***SPAWNS*************************************************************************************************************************/

for(var l in gameMap) {
  if(gameMap.hasOwnProperty(l)) {
    loc = gameMap[l];
    loc.onTick = function(tick) {
      //Roll comments
      if((tick % 16 == 0) && (Player.locale.comments.length > 0)) {
        var croll = Math.floor(Math.random() * 4);
        if(croll == 0) {
          var cind = Math.floor(Math.random() * (Player.locale.comments.length));
          appendLine(Player.locale.comments[cind]);
          Player.locale.comments.splice(cind, 1);
        }
      }
    }
  }
}
