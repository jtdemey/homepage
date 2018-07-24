$(document).ready(function() {
//DEPENDENCIES
$.getScript('/survive/Parser.js').done(function(script, textStatus) {
  $.getScript('/survive/Player.js').done(function(script, textStatus) {
    $.getScript('/survive/createGame.js').done(function(script, textStatus) {
      runSurvive();
    });
  });
});
/*
	GAME NOTES
  //APP IDEA: Bluetooth positional beacons giving contextual inventory searches of stores
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
  function runSurvive() {
    //GLOBALS
    var tick = 0;
    var paused = false;
    var gameview = 1;
    var linescroll = 0;
    var scrollConsoleUp = undefined;
    var scrollConsoleCD = false;
    var gameTime = new Date(1987, 11, 13, 2, 44, 0, 0);
    var displayTime = "Dec 13, 1987 2:44";
    var gameWidth = $('.survive-content').width();
    var tabHeight = $('.nav-tabs').height();
    $('.tickdisplay').text(displayTime).hide();
    $('.mainconsole').show();
    $('.linebox').css({"width": ((gameWidth / 4 * 3) + "px")});
    $('.nav-badge').css('backgroundColor', '#990000');
    //console.log($('.cl-area').offset().top);
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
    $('.line-area').on('mousedown touchstart', function(e) {
      if(!scrollConsoleCD) {
        paused = true;
        scrollConsoleUp = setInterval(function() {
          if(linescroll < 101) {
            $('.linebox').css({bottom: '-=4px'});
            linescroll += 1;
            console.log(linescroll);
          }
        }, 40);
      }
    }).on('mouseout touchend', function() {
      paused = false;
      clearInterval(scrollConsoleUp);
      scrollConsoleCD = true;
      $('.linebox').stop().animate({bottom: ('+=' + (linescroll * 4) + 'px')}, 200);
      linescroll = 0;
      setTimeout(function() {
        scrollConsoleCD = false;
      }, 1500);
    });
    //INITIATE
    Player.locale = gameMap.for_car;
    adjustTabs();
    setTimeout(function() {
      startClock();
      refreshConsoleExits();
    }, 6500);
    //I/O
    $('.commandline').on('keydown', function(e) {
      if(e.keyCode == 13) {
        if(linescroll > 0) {
          resetLineScroll();
        }
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
    $('.combat-input').on('keydown', function(e) {
      if(e.keyCode == 13) {
        var rawinput = $('.combat-input').val();
        rawinput = rawinput.trim();
        $(this).val('');
        combatParse(rawinput);
      }
    });
    //GAME
    async function updateGame() {
      if(!paused) {
        if(tick % 8 == 0) {
          iterateTime();
          $('.tickdisplay').text(displayTime);
        }
        refreshConsoleStats();
        if(Player.inCombat == false) {
          Player.onTick(tick);
          Player.locale.onTick(tick);
        } else {
          combatTick(tick);
        }
      }
    }
    //CORE FUNCTIONS
    async function startClock() {
      appendLine('The engine stalls.');
      setTimeout(function() {
        appendLine('Your car comes to a stop.');
      }, 1000);
      while(tick < 999999999) {
        updateGame();
        tick = tick + 1;
        if(tick > 999999998) { tick = 0; }
        await sleep(800);
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
    executeCommand = function(comm) {
      switch(comm[0]) {
        case "GO":
          var dir = comm[1];
          changeLocale(dir);
          break;
        case "EXAMINE":
          break;      
      }
    }
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    //OPENING
    var openingRoll = $(function() {
      var subtitles = ['A dirt backroad.', 'Caledonia County, Vermont.', 'December 13th, 1987. 2:44AM.'];
      openingSubFade(subtitles[0], 0);
      openingSubFade(subtitles[1], 1);
      openingSubFade(subtitles[2], 2);
      setTimeout(openingTitleFade, 3500);
    });
    function openingSubFade(sub, i) {
      var q = $.map(sub.split(''), function(l) {
        return $('<span>' + l + '</span>');
      });
      var d = $('#splash-sub' + i);
      var ind = 0;
      var f = setInterval(function() {
        q[ind].appendTo(d).hide().fadeIn(80);
        ind += 1;
        if(ind >= q.length) {
          clearInterval(f);
          ind = 0;
        }
      }, 80);
      setTimeout(function() {
        $('.splash-subtitle').fadeOut(400);
      }, 3300);
    }
    var openingTitleFade = function() {
      var title = 'Survive.';
      var q = $.map(title.split(''), function(l) {
        return $('<span>' + l + '</span>');
      });
      var d = $('.splash-title');
      var ind = 0;
      var f = setInterval(function() {
        q[ind].appendTo(d).hide().fadeIn(180);
        ind += 1;
        if(ind >= q.length) {
          clearInterval(f);
          ind = 0;
        }
      }, 180);
      setTimeout(function() {
        $('.splash-screen').fadeOut();
        $('.tickdisplay').fadeIn(1200);
        updateItems();
      }, 3200);
    };
    //RESPONSIVENESS
    function adjustTabs() {
      var fw = $('.nav-tabs').width();
      var fh = $('.nav-tabs').height();
      $('.nav-tab').css({"width": ((fw / 4 - 3) + "px"), "height": (fh + "px")});
      //$('.tab-img').css({"margin-top": ((fh / 2 - 50) + "px")});
    }
    function checkLinePos() {
      if($('.linebox').first().offset().top > $('.cl-area').offset().top) {
        console.log('oh');
        $('.line').css({'bottom': '60px'});
      }
    }
    function resetLineScroll() {
      var ldist = 50 * linescroll;
      $('.linebox').stop().animate({bottom: ('+=' + ldist + 'px')});
      linescroll = 0;
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
      if(tab == 1) {
        $('.commandline').focus();
      }
      /**$('#gameview' + gameview).fadeOut({queue: false, duration: 400}).animate({left: "100px"}, 400, function() {
        gameview = tab;
        $('#gameview' + gameview).fadeIn({queue: false, duration: 400}).animate({right: "100px"}, 400);
      });**/
    }
    //MODALS
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
    function decrementItemCounter(event) {
      var item = Player.items[event.data.itemid];
      var itct = parseInt($('.item-count').html());
      if(itct > 0) {
        var newct = itct - 1;
        $('.item-count').text(newct);
      }
    }
    function incrementItemCounter(event) {
      var item = Player.items[event.data.itemid];
      var itct = parseInt($('.item-count').html());
      if(itct < item.count) {
        $('.item-count').html(itct + 1);
      }
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
    //DISPLAY REFRESHES
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
    function refreshConsoleStats() {
      $('.hp-amt').text(Player.health);
      $('.temp-amt').text(Player.temperature);
      $('.sanity-amt').text(Player.sanity);
    }
    //PLAYER MOVEMENT
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
    function localeSwitch(dir) {
      Player.lastLocale = Player.locale;
      Player.locale = gameMap[Player.locale.exits[dir]];
      Player.locale.visits += 1;
      appendLine(Player.locale.enterPhrase);
      refreshConsoleExits();
      if(Player.locale.enemies.length > 0) {
        rollEnemySpawns(Player.locale.enemies);
      }
      if(Player.locale.loot.length > 0) {
        rollLootTables(Player.locale.loot);
      }
      updateItems();
      $('.locale-title').text(Player.locale.display.toUpperCase());
    }
    //ITEMS
    function addItemListeners() {
      $('.loc-container').on('click', function() {
        var cid = $(this).attr('id');
        var container = Player.locale.containers[cid.substr(cid.length - 1)];
        console.log(container);
        if(container.locked) {
          appendLineR(["It won't open.", "It's locked.", "It appears to be locked.", "It's sealed shut with a lock."]);
          return false;
        } else {
          if(container.loot.length > 0) {
            rollLootTables(container.loot);
          }
          if(container.contains.length > 0) {
            for(var i = 0; i < container.contains.length; i++) {
              addItem(container.contains[i][0], container.contains[i][1], Player.locale.name);
            }
          }
          container.contains = [];
          var emptylbl = $('<span class="container-empty">(empty)</span>');
          $(this).append(emptylbl);
          appendLineR(["You find something inside.", "There's something inside.", "You've found something."]);
          updateItems();
        }
      });
      $('.loc-li').off().on('click', function() {
        var itemid = $(this).attr('id');
        pickUpItem(itemid.substr(itemid.length - 1));
      });
      $('.inv-li').off().on('click', function() {
        openInfoModal('item', $(this).attr('id').substr($(this).attr('id').length - 1));
      });
    }
    function addItemUses() {
      for(var i = 0; i < Player.items.length; i++) {
        var item = Player.items[i];
        switch(item.name) {
          case "Handwarmers":
            item.onUse = function() { useHandwarmers(); }; break;
          case "Flashlight":
            item.onUse = function() { useFlashlight(); }; break;
          case "Batteries":
            item.onUse = function() { useBatteries(); }; break;
          case "Tinder":
            item.onUse = function() { startSmallFire(); }; break;
        }
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
        addItem(item.name, item.count, Player.locale.name);
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
        addItem(item.name, itct, Player.locale.name);
        Player.items.splice(event.data.itemid, 1);
      } else {
        Player.items[event.data.itemid].count -= itct;
        addItem(item.name, itct, Player.locale.name);
      }
      updateItems();
      addItemListeners();
      $('.info-modal-bg').fadeOut(100);
      $('.drop-counter').remove();
      appendLine('You drop the ' + item.name.toLowerCase() + '.');
    }
    function hasItem(itemname) {
      for(var i = 0; i < Player.items.length; i++) {
        if(Player.items[i].name == itemname) {
          return true;
        }
      }
      return false;
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
        $('#loc-item' + itemid).slideUp(110, function() {
          appendLine('You pick up the ' + i.name.toLowerCase() + '.');
          Player.locale.items.splice(itemid, 1);
          updateItems();
        });
      }
    }
    function startSmallFire() {
      return;
    }
    function updateItems() {
      var icount = Player.locale.items.length;
      for(var h = 0; h < Player.locale.containers.length; h++) {
        if(Player.locale.containers[h].contains.length > 0) {
          icount += 1;
        }
      }
      if(icount > 0 && gameview != 2) {
        $('.inv-badge').text(icount);
      } else {
        $('.inv-badge').text('');
      }
      $('.igv-li').remove();
      for(var j = 0; j < Player.locale.containers.length; j++) {
        var container = Player.locale.containers[j];
        var ctag = $('<li class="igv-li loc-container" id="loc-container' + j + '">' + container.name + '</li>');
        if(container.contains.length == 0) {
          var emptyspan = $('<span class="container-empty">(empty)</span>');
          ctag.append(emptyspan);
        }
        $('.locale-list').append(ctag);
      }
      for(var i = 0; i < Player.locale.items.length; i++) {
        var item = Player.locale.items[i];
        if(item.count > 1) {
          var itag = $('<li class="igv-li loc-li" id="loc-item' + i + '" style="display:none;">' + item.name + ' (' + item.count + ')' + '</li>');
        } else {
          var itag = $('<li class="igv-li loc-li" id="loc-item' + i + '" style="display:none;">' + item.name + '</li>');
        }
        $('.locale-list').append(itag);
        itag.slideDown(110);
      }
      for(var k = 0; k < Player.items.length; k++) {
        console.log(Player.items.length);
        var it = Player.items[k];
        if(it.count > 1) {
          var itag = $('<li class="igv-li inv-li" id="inv-item' + k + '" style="display:none;">' + it.name + ' (' + it.count + ')' + '</li>');
        } else {
          var itag = $('<li class="igv-li inv-li" id="inv-item' + k + '" style="display:none;">' + it.name + '</li>');
        }
        $('.inventory-list').append(itag);
        $('.igv-li').fadeIn();
      }
      addItemListeners();
      addItemUses();
    }
    function useHandwarmers() {
      if(Player.temperature < 120) {
        Player.temperature += 10;
        appendLine("The handwarmers help fight the cold.");
      } else {
        appendLine("No need for those now.");
      }
      consumeItemByName('Handwarmers', 1);
    }
    function useFlashlight() {
      if(Player.locale.name.substring(0, 2) == "for") {
        
      }
    }
    //COMBAT
    function appendCombatLine(line) {
      var linediv = $('<div class="combat-linebox"></div>');
      var newline = $('<p class="combat-line"></p>').text(line);
      linediv.append(newline);
      $('.combat-log').append(linediv);
      $('.combat-linebox').animate({
        bottom: '+=28px',
        opacity: '-=0.12'
      }, 100);
      if($('.combat-linebox').position().top < ($('.combat-enemystats').position().top + $('.combat-enemystats').outerHeight(true))) {
        $('.combat-linebox').first().remove();
      }
    }
    function appendCombatLineR(lines) {
      var chosen = Math.floor(Math.random() * lines.length);
      appendCombatLine(lines[chosen]);
    }
    function combatParse(raw) {
      
    }
    function combatTick(gametick) {
      if(Player.currentEnemy.health < 1) {
        Player.inCombat = false;
        Player.currentEnemy = undefined;
        console.log('combat end');
        $('.combat-modal-bg').fadeOut(100);
        return;
      }
      console.log(Player.currentEnemy.health);
      if(Player.currentEnemy.cd < 1) {
        var aroll = Math.floor(Math.random() * Player.currentEnemy.abilities.length);
        console.log(Player.currentEnemy.abilities);
        console.log(aroll);
        var acode = Player.currentEnemy.abilities[aroll];
        switch(acode[0]) {
          case 'normal':
            normalAttack(Player.currentEnemy, acode[1], acode[2], acode[3]);
            break;
        }
      } else {
        Player.currentEnemy.cd -= 1;
      }
    }
    startCombat = function(enemy) {
      Player.inCombat = true;
      Player.lastCombat = tick;
      Player.currentEnemy = enemy;
      $('.combat-modal-bg').fadeIn(100);
      $('.combat-input').focus();
    }
    normalAttack = function(enemy, mind, maxd, kind) {
      enemy.cd = enemy.speed;
      var aroll = Math.floor(Math.random() * 100);
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
          appendCombatLineR(["The " + enemy.display.toLowerCase() + " gnashes its teeth and bites you.",
          "The " + enemy.display.toLowerCase() + " sinks its teeth into your arm.",
          "The " + enemy.display.toLowerCase() + " bites you.",
          "The " + enemy.display.toLowerCase() + " attacks you with its ravenous bite.",
          "You wince in pain as the " + enemy.display.toLowerCase() + " bites you."]);
        }
      } else {
        if(kind == 'bite') {
          appendCombatLineR(["The " + enemy.display.toLowerCase() + " misses its bite.",
            "The " + enemy.display.toLowerCase() + " lunges forward but misses.",
            "The " + enemy.display.toLowerCase() + "'s bite barely misses your neck.",
            "The " + enemy.display.toLowerCase() + "'s bite barely misses your leg.",
            "The " + enemy.display.toLowerCase() + "'s bite barely misses your body.",
            "The " + enemy.display.toLowerCase() + " attempts to bite you but misses."]);
        }
      }
      $('.combat-enemy-cd').css({width: '100%'}).stop().animate({width: '0%'}, (Player.currentEnemy.cd + 1) * 800);
    };
  }
});