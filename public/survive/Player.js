var Player = {
  //100-75: healthy, 74-50: hurt, 49-25: injured, 24-5: wounded, 4-1: crippled, 0: game over
  health: 100,
  get getHealth() {
    return this.health;
  },
  //100-75: sane, 74-50: afraid, 49-25: panicked, 24-10: insane, 9-1: delusional, 0: irrational
  sanity: 100,
  isDelusional: false,
  isIrrational: false,
  //150-125: heat exhausted, 124-101: overheated, 100-75: normal, 74-50: chilly, 49-25: cold, 24-10: shivering, 9-1: freezing, 0: game over
  temperature: 100,
  isHeatExhausted: false,
  isShivering: false,
  isFreezing: false,
  //100-75: high, 74-50: normal, 49-25: tired, 24-10: fatigued, 9-1: exhausted, 0: immobile
  energy: 100,
  isExhausted: false,
  isImmobile: false,
  locale: undefined,
  lastLocale: undefined,
  visited: new Array(),
  inCombat: false,
  lastCombat: 0,
  currentEnemy: undefined,
  items: [],
  equipped: [],
  onTick: function(tick) {
    //Temp check
    if(tick % 5 == 0) {
      switch(this.locale.temperature) {
        case 7:
          if(this.temperature < 150) {
            this.temperature = this.temperature + 3;
          } else {
            if(this.isHeatExhausted == false) {
              this.isHeatExhausted = true;
              appendLineC("You are heat exhausted.","#ff3300");
            }
          }
          unfreezeCheck();
          unshiverCheck();
          break;
        case 6:
          if(this.temperature < 120) {
            this.temperature = this.temperature + 2;
          } else if(this.temperature > 125) {
            this.temperature = this.temperature - 1;
          }
          unfreezeCheck();
          unshiverCheck();
          break;
        case 5:
          unheatCheck();
          unfreezeCheck();
          unshiverCheck();
          if(this.temperature < 95) {
            this.temperature = this.temperature + 1;
          } else if(this.temperature > 120) {
            this.temperature = this.temperature - 2;
          } else if(this.temperature > 100) {
            this.temperature = this.temperature - 1;
          }
          break;
        case 4:
          unheatCheck();
          if(this.temperature > 50) {
            this.temperature = this.temperature - 1;
          }
          break;
        case 3:
          unheatCheck();
          if(this.temperature > 23) {
            this.temperature = this.temperature - 2;
          }
          if(this.temperature < 24) {
            if(this.isShivering == false) {
              this.isShivering = true;
              appendLineRC(["You are starting to shiver uncontrollably.", "You have started to shiver.", "Your teeth chatter and your body shivers noticeably.",
                            "It's very cold - you have started to shiver.", "You're shivering; you should get to warmth soon.", "You are shaking from the cold."], "#2c5987");
            }
            if(this.temperature > 16) {
              this.temperature = this.temperature - 1;
            }
          }
          break;
        case 2:
          unheatCheck();
          if(this.temperature > 23) {
            this.temperature = this.temperature - 3;
          }
          if(this.temperature < 24 && this.temperature > 9) {
            if(this.isShivering == false) {
              this.isShivering = true;
              appendLineRC(["You are starting to shiver uncontrollably.", "You have started to shiver.", "Your teeth chatter and your body shivers noticeably.",
                            "It's very cold - you have started to shiver.", "You're shivering; you should get to warmth soon.", "You are shaking from the cold."], "#2c5987");
            }
            this.temperature = this.temperature - 2;
          }
          if(this.temperature < 10) {
            this.freezeCheck("freezing");
          }
          break;
        case 1:
          unheatCheck();
          if(this.temperature > 23) {
            this.temperature = this.temperature - 4;
          }
          if(this.temperature < 24 && this.temperature > 9) {
            if(this.isShivering == false) {
              this.isShivering = true;
              appendLineRC(["You are starting to shiver uncontrollably.", "You have started to shiver.", "Your teeth chatter and your body shivers noticeably.",
                            "It's very cold - you have started to shiver.", "You're shivering; you should get to warmth soon.", "You are shaking from the cold."], "#2c5987");
            }
            this.temperature = this.temperature - 3;
          }
          if(this.temperature < 10) {
            this.freezeCheck("frigid");
          }
          break;
        case 0:
          unheatCheck();
          if(this.temperature > 23) {
            this.temperature = this.temperature - 5;
          }
          if(this.temperature < 24 && this.temperature > 9) {
            if(this.isShivering == false) {
              this.isShivering = true;
              appendLineRC(["You are starting to shiver uncontrollably.", "You have started to shiver.", "Your teeth chatter and your body shivers noticeably.",
                            "It's very cold - you have started to shiver.", "You're shivering; you should get to warmth soon.", "You are shaking from the cold."], "#2c5987");
            }
            this.temperature = this.temperature - 4;
          }
          if(this.temperature < 10) {
            this.freezeCheck("glacial");
          }
          break;
      }
    }
  },
  freezeCheck: function(templvl) {
    if(this.temperature < 10 && this.temperature > 0) {
      var tempHit = 1;
      switch(templvl) {
        case "freezing":
          tempHit = 1;
          break;
        case "frigid":
          tempHit = 2;
          break;
        case "glacial":
          tempHit = 3;
          break;
      }
      var hpHit = 1;
      switch(templvl) {
        case "freezing":
          hpHit = 1;
          break;
        case "frigid":
          hpHit = 3;
          break;
        case "glacial":
          hpHit = 5;
          break;
      }
      if(this.isFreezing == false) {
        appendLineRC(["You are freezing. You need warmth.", "The cold is getting intense.", "Your skin is numb - you are freezing."], "#000099");
        this.isFreezing = true;
      }
      var tempRoll = Math.floor(Math.random() * 2);
      if(tempRoll == 0) {
        this.temperature = this.temperature - tempHit;
      }
      var hpRoll = Math.floor(Math.random() * 2);
      if(hpRoll == 0) {
        this.health = this.health - hpHit;
      }
      if(this.temperature < 5) {
        if(this.coldWarns[0] == false) {
          appendLineC("Your hands and feet are completely numb.", "#193167");
          this.coldWarns[0] = true;
        }
      }
      if(this.temperature < 3) {
        if(this.coldWarns[1] == false) {
          appendLineC("You can feel blood leaving your arms and legs.", "#0f1e3e");
          this.coldWarns[1] = true;
        }
      }
      if(this.temperature < 1) {
        if(this.coldWarns[2] == false) {
          appendLineC("Sight is fading.", "#050a15");
          this.coldWarns[2] = true;
        }
      }
      if(this.temperature < 1) {
        appendLineC("Game over.", "red");
      }
    }
  },
  coldWarns: [false, false, false]
};

function unfreezeCheck() {
  if(Player.isFreezing == true) {
    Player.temperature = v.temperature + 8;
    if(Player.temperature > 9) {
      Player.isFreezing = false;
      Player.coldWarns[0] = false;
      Player.coldWarns[1] = false;
      Player.coldWarns[2] = false;
      appendLineC("The warmth brings relief.", "#ff6600");
    }
  }
}

function unshiverCheck() {
  if(Player.isShivering == true) {
    if(Player.temperature < 25) {
      Player.temperature = Player.temperature + 5;
    } else if(Player.temperature > 24) {
      Player.isShivering = false;
      appendLineRC(["You are no longer shivering.", "Your body steadies."], "#cc5200");
    }
  }
}

function unheatCheck() {
  if(Player.isHeatExhausted == true) {
    if(Player.temperature > 125) {
      Player.temperature = Player.temperature - 7;
    } else if(Player.temperature < 125) {
      Player.isHeatExhausted = false;
      appendLineC("You have cooled down - feeling much better now.","#3399ff");
    }
  }
}