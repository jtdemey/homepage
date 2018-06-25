$(document).ready(function() {
/*
	GAME NOTES
	-Day cycle represented by darkness of border?
	-Areas
		-Forest
			-Constant temp drain
			-Wabbajack-like predator (Hulking Horror)
				-Drawn to fire/light
				-Fast
				-Telegraphs: howls (far), rustling (medium range), growl (close), roar (adjacent map cell)
			-Day cycle
				-Night = increased difficulty
		-Mansion
			-Deranged hunter (The Hunter)
				-Stays upstairs in locked room until player enters basement
				-Slow
				-Telegraph: heavy footsteps
				-Wields rifle and hunting machete
				-Hard to escape; can use traps
		-Cemetery
			-Weeping wraith (Weeping Demon)
      -Territorial ghoul
	-Character
		-Nameless
		-Inventory
			-Flashlight + some batteries
			-Lighter
		    -Can light fires with tinder
	-Enemies
		-3 difficulties for day 1, 2, and 3+ (more realistic -> more terrifying)
		-Woods
      -Difficulty 1: wolf, owl, dog, snake, wolverine, husk, blue slime, green slime, giant rat, badger
      -Difficulty 2: cougar, mangy bear, zombie, ghoul, red slime, purple slime, hag
      -Difficulty 3: chupacabra, grizzly bear, dire wolf, werewolf, werebear, basilisk
    -Mansion
      -Difficulty 1: giant rat, snake, owl, badger
      -Difficulty 2: bandit, addict, roamer, hound
      -Difficulty 3: ghoul, hell-hound, rogue, spectre, abomination
    -Cemetery
      -Difficulty 1: ghost, ghoul, husk, owl, lost soul, skeleton
      -Difficulty 2: spectre, wraith, zombie, lesser demon, vampire
      -Difficulty 3: greater demon, abomination, tormented soul, chupacabra, werewolf
  -Items
    -Handwarmers: +10 temperature
    -Tinder: randomly-spawned in woods, can be used for fires
      -Fires produce warmth and reveal extra items but attract the Hulking Horror
    -Flashlight: reveals items and examinables, depletes batteries
    -Batteries: Lasts for certain amount of ticks
  -Weapons
    -Level 1
      -Fists
      -Crowbar (car trunk)
      -Shovel (shed)
      -Hatchet
      -Bat
      -Stick
      -Rake
      -Decorative Rifle (mansion)
      -Jumper Cables
    -Level 2
      -Sabre
      -Axe
      -Scythe
      -Sword
      -Dagger
      -Knife
      -Spiked Bat
      -Sickle
    -Level 3
      -Revolver (.357 rounds)
      -Pistol (9mm rounds)
      -Flare Gun (flares)
      -Throwing Knives
      -Battleaxe
      -Silver Sword (Lesser effect on living things)
      -Crossbow (bolts)
      -Bow (arrows)
*/
  //GLOBALS
  var tick = 0;
  var gameview = 1;
  var linescroll = 0;
  var dragging = false;
  var gameTime = new Date(1987, 11, 13, 2, 44, 0, 0);
  var displayTime = "Dec 13, 1987 2:44";
  var gameWidth = $('.survive-content').width();
  var tabHeight = $('.nav-tabs').height();
  $('.tickdisplay').text(displayTime).hide();
  $('.mainconsole').show();
  $('.linebox').css({"width": ((gameWidth / 4 * 3) + "px")});
  $('.nav-badge').css('backgroundColor', '#990000');
  //DYNAMISM
  $(window).resize(adjustTabs);
  //LISTENERS
  $('.nav-tab').on('mouseenter', function() {
    $(this).stop().animate({backgroundColor: "#330000"}, 300);
  }).on('mouseleave', function() {
    $(this).stop().animate({backgroundColor: "#595959"}, 400);
  }).on('click', function() {
    var tid = $(this).attr("id");
    switchGameview(parseInt(tid.substr(tid.length - 1)));
  });
  $('.modal-bg').on('click', function() {
    if($(this).hasClass('info-modal-bg')) {
      $('.info-modal-bg').hide();
    }
    $('.drop-counter').remove();
  }).children().on('click', function(e) {
    return false;
  });
  $('.line-area').on('mousedown', function() {
    dragging = false;
  }).on('mousemove', function(e) {
    dragging = true;
  }).on('mouseup', function() {
    var dragged = dragging;
    dragging = false;
    
  });
  //INITIATE
  startClock();
  adjustTabs();
  refreshConsoleExits();
  //I/O
  $('.commandline').on('keydown',function(e) {
    if(e.keyCode == 13) {
      var rawinput = $('.commandline').val();
      rawinput = rawinput.trim();
      $('.commandline').val('');
      var commcode = Parser.parse(rawinput);
    }
  });
  document.addEventListener('addConsoleNotify', function() {
    if(gameview != 1) {
      if($('.home-badge').text() == '') {
        $('.home-badge').text('1');
      } else {
        $('.home-badge').text(parseInt($('.home-badge').text()) + 1);
      }
    }
  });
  //GAME
  async function updateGame() {
    if(tick < 12) {
      openingRoll(tick);
    } else {
      if(tick % 10 == 0) {
        iterateTime();
        $('.tickdisplay').text(displayTime);
      }
      refreshConsoleStats();
      Player.onTick(tick);
      Player.locale.onTick(tick);
    }
  }
  //CORE FUNCTIONS
  async function startClock() {
    while(tick < 999999) {
      updateGame();
      tick = tick + 1;
      await sleep(1000);
      //Cleanup
      var highest = $('p:first').css('bottom');
      if(parseInt(highest) > 1000) {
        $('p:first').remove();
      }
    }
  } 
  async function iterateTime() {
    gameTime.setMinutes(gameTime.getMinutes() + 1);
    switch(gameTime.getMonth()) {
  	  case 0: displayTime = "Jan"; break;
      case 1: displayTime = "Feb"; break;
      case 2: displayTime = "Mar"; break;
      case 3: displayTime = "Apr"; break;
      case 4: displayTime = "May"; break;
      case 5: displayTime = "Jun"; break;
      case 6: displayTime = "Jul"; break;
      case 7: displayTime = "Aug"; break;
      case 8: displayTime = "Sep"; break;
      case 9: displayTime = "Oct"; break;
      case 10: displayTime = "Nov"; break;
      case 11: displayTime = "Dec"; break;
    }
    displayTime = displayTime + " " + gameTime.getDate() + ", " + gameTime.getFullYear() + " " + gameTime.getHours() + ":" + gameTime.getMinutes();
  }
  //UTILITIES
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  function switchGameview(tab) {
    if(gameview == tab) { return; }
    $('#gameview' + tab).css({"right": "800px"});
    if($('.nav-badge' + tab).text() != '' && tab != 2) {
      $('.nav-badge' + tab).text('');
    }
    $('#gameview' + gameview).fadeOut({queue: false, duration: 150}).animate({left: "800px"}, 100, function() {
      $('#gameview' + gameview).css({"left": "0px"});
      $('#gameview' + tab).fadeIn({queue: false, duration: 150}).animate({right: "800px"});
      gameview = tab;
    });
    /**$('#gameview' + gameview).fadeOut({queue: false, duration: 400}).animate({left: "100px"}, 400, function() {
      gameview = tab;
      $('#gameview' + gameview).fadeIn({queue: false, duration: 400}).animate({right: "100px"}, 400);
    });**/
  }
});
function addInfoModalBtn(txt, press, prms) {
  var modtxt = $('<div class="modal-btn-text">' + txt + '</div>');
  var modbtn = $('<div class="modal-btn info-modal-btn" id="modal-btn' + ($('.info-modal-btn').length + 1) + '"></div>');
  if(prms === null) {
    modbtn.on('click', press);
  } else {
    modbtn.on('click', prms, press);
  }
  modbtn.append(modtxt);
  $('.info-modal-btns').append(modbtn).css({ 'grid-template-columns': ('repeat(' + $('.info-modal-btn').length + ', 1fr)')});
}
function addItemListeners() {
  $('.loc-li').off().on('click', function() {
    var itemid = $(this).attr('id');
    pickUpItem(itemid.substr(itemid.length - 1));
  });
  $('.inv-li').off().on('click', function() {
    openInfoModal('item', $(this).attr('id').substr($(this).attr('id').length - 1));
  });
}
function adjustTabs() {
  var fw = $('.nav-tabs').width();
  var fh = $('.nav-tabs').height();
  $('.nav-tab').css({"width": ((fw / 4 - 3) + "px"), "height": (fh + "px")});
  //$('.tab-img').css({"margin-top": ((fh / 2 - 50) + "px")});
}
function changeLocale(dir) {
  console.log(dir);
  if(Player.locale.exits[dir] != 0) {
    if(Player.locale.exitPhrases[dir] != 0) {
      appendLine(Player.locale.exitPhrases[dir]);
      setTimeout(function() { localeSwitch(dir); }, 1500);
    } else {
      localeSwitch(dir);
    }
  } else {
    appendLineR(["You can't go that way.", "There's nothing in that direction.", "There's something in the way."]);
  }
}
function consumeItemByName(n, amt) {
  for(var i = 0; i < Player.items.length; i++) {
    if(Player.items[i].name == n) {
      if(Player.items[i].count > 1) {
        Player.items[i].count -= 1;
      } else {
        Player.items.splice(i, 1);
      }
    }
  }
  updateItems();
}
function decrementItemCounter(event) {
  var item = Player.items[event.data.itemid];
  var itct = parseInt($('.item-count').html());
  if(itct > 0) {
    var newct = itct - 1;
    $('.item-count').text(newct);
  }
}
function dropItem(itemid) {
  var item = Player.items[itemid];
  if(item.count > 1) {
    $('.modal-text').text('How many?');
    var dropcounter = $('<div class="drop-counter"></div>');
    var larrow = $('<div class="left-arrow"></div>').on('click', { itemid: itemid }, decrementItemCounter);
    var ict = $('<div class="item-count">' + item.count + '</div>');
    var rarrow = $('<div class="right-arrow"></div>').on('click', { itemid: itemid }, incrementItemCounter);
    dropcounter.append(larrow).append(ict).append(rarrow);
    $('.modal-stuff').append(dropcounter);
    $('.info-modal-btns').empty();
    addInfoModalBtn('Drop', dropItemCount, { itemid: itemid });
  } else {
    Player.items.splice(itemid, 1);
    addItem(item.name, item.count, Player.locale.name, item.chance, item.stackable, item.desc, item.effect, item.onUse);
    $('.info-modal-bg').fadeOut(100);
    updateItems();
    appendLine('You drop the ' + item.name.toLowerCase() + '.');
  }
}
function dropItemCount(event) {
  var item = Player.items[event.data.itemid];
  var itct = parseInt($('.item-count').html());
  if(itct < 1) {
    $('.info-modal-bg').fadeOut(100);
    $('.drop-counter').remove();
    return;
  } else if(itct == item.count) {
    addItem(item.name, itct, Player.locale.name, item.chance, item.stackable, item.desc, item.effect, item.onUse);
    Player.items.splice(event.data.itemid, 1);
  } else {
    Player.items[event.data.itemid].count -= itct;
    addItem(item.name, itct, Player.locale.name, item.chance, item.stackable, item.desc, item.effect, item.onUse);
  }
  updateItems();
  addItemListeners();
  $('.info-modal-bg').fadeOut(100);
  $('.drop-counter').remove();
  appendLine('You drop the ' + item.name.toLowerCase() + '.');
}
function executeCommand(comm) {
  switch(comm[0]) {
    case "GO":
      var dir = comm[1];
      changeLocale(dir);
      break;
    case "EXAMINE":
      break;
  }
}
function hasItem(itemname) {
  for(var i = 0; i < Player.items.length; i++) {
    if(Player.items[i].name == itemname) {
      return true;
    }
  }
  return false;
}
function incrementItemCounter(event) {
  var item = Player.items[event.data.itemid];
  var itct = parseInt($('.item-count').html());
  if(itct < item.count) {
    $('.item-count').html(itct + 1);
  }
}
function localeSwitch(dir) {
  Player.lastLocale = Player.locale;
  Player.locale = gameMap[Player.locale.exits[dir]];
  Player.locale.visits += 1;
  appendLine(Player.locale.enterPhrase);
  refreshConsoleExits();
  $('.locale-title').text(Player.locale.display.toUpperCase());
}
function openInfoModal(mode, id) {
  $('.info-modal-btns').empty();
  if(mode == 'item') {
    var item = Player.items[id];
    if(item.onUse != undefined) {
      addInfoModalBtn('Use', function() {
        item.onUse();
        $('.info-modal-bg').fadeOut(100);
      }, null);
    }
    addInfoModalBtn('Drop', function() {
      dropItem(id);
    }, null);
    $('.modal-text').text(item.desc);
  }
  $('.info-modal-bg').fadeIn(150);
}
function openingRoll(tick) {
  if(tick == 2) { appendLine("A dirt backroad."); }
  if(tick == 3) { appendLine("Caledonia County, Vermont."); }
  if(tick == 4) { appendLine("December 13th, 1987. 2:44AM."); }
  if(tick == 6) { appendLineC("Survive.", "red"); }
  if(tick == 9) { appendLine("The engine stalls."); }
  if(tick == 11) {
    appendLine("Your car comes to a stop.");
    $('.tickdisplay').fadeIn({queue: false, duration: "slow"}).animate({fontSize: "1em"}, 1000);
    updateItems();
  }
}
function pickUpItem(itemid) {
  var i = Player.locale.items[itemid];
  if(hasItem(i.name) && i.stackable == true) {
    for(var j = 0; j < Player.items.length; j++) {
      if(Player.items[j].name == i.name) {
        Player.items[j].count += i.count;
      }
    }
    Player.locale.items.splice(itemid, 1);
    updateItems();
  } else {
    Player.items.push(i);
    $('#loc-item' + itemid).slideUp(180, function() {
      appendLine('You pick up the ' + i.name.toLowerCase() + '.');
      Player.locale.items.splice(itemid, 1);
      updateItems();
    });
  }
}
function refreshConsoleStats() {
  $('.hp-amt').text(Player.health);
  $('.temp-amt').text(Player.temperature);
  $('.sanity-amt').text(Player.sanity);
}
function refreshConsoleExits() {
	$('.console-exits li').remove();
	for(var i = 0; i < Player.locale.exits.length; i++) {
		if(Player.locale.exits[i] != 0) {
			var dirn = CARDINAL_FULL[i];
			var nameElement = $('<strong><li class="console-exit-dir">' + dirn + '</li></strong>');
			var exitLocale = $('<li class="console-exit-name">' + gameMap[Player.locale.exits[i]].display + '</li>');
			$('.console-exits').append(nameElement).append(exitLocale);
		}
	}
}
function updateItems() {
  if(Player.locale.items.length > 0) {
    $('.inv-badge').text(Player.locale.items.length);
  } else {
    $('.inv-badge').text('');
  }
  $('.igv-li').remove();
  for(var i = 0; i < Player.locale.items.length; i++) {
    var item = Player.locale.items[i];
    if(item.count > 1) {
      var itag = $('<li class="igv-li loc-li" id="loc-item' + i + '">' + item.name + ' (' + item.count + ')' + '</li>');
    } else {
      var itag = $('<li class="igv-li loc-li" id="loc-item' + i + '">' + item.name + '</li>');
    }
    $('.locale-list').append(itag);
  }
  for(var j = 0; j < Player.items.length; j++) {
    var it = Player.items[j];
    if(it.count > 1) {
      var itag = $('<li class="igv-li inv-li" id="inv-item' + j + '" style="display:none;">' + it.name + ' (' + it.count + ')' + '</li>');
    } else {
      var itag = $('<li class="igv-li inv-li" id="inv-item' + j + '" style="display:none;">' + it.name + '</li>');
    }
    $('.inventory-list').append(itag);
    $('.igv-li').fadeIn();
  }
  addItemListeners();
}