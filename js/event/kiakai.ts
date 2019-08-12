/*
 * 
 * Define Kia/Kai
 * 
 */
import { Entity } from '../entity';
import { JobDesc, Jobs } from '../job';
import { Gender } from '../body/gender';
import { Body } from '../body/body';
import { Color } from '../body/color';
import { Race } from '../body/race';
import { Images } from '../assets';
import { Items } from '../items';
import { Text } from '../text';
import { Gui } from '../gui';
import { TimeStep, GAME, NAV } from '../GAME';
import { KiakaiFlags } from './kiakai-flags';
import { Item } from '../item';
import { RavenFlags } from './raven-flags';
import { KiakaiScenes } from './kiakai-scenes';

export class Kiakai extends Entity {
	constructor(storage? : any) {
		super();

		this.ID = "kiakai";
		// Character stats
		this.name = "Kia";
		
		this.avatar.combat     = Images.kiakai;
		
		this.abilities["Special"].name = "Healing";
		
		this.currentJob = Jobs.Acolyte;
		this.jobs["Acolyte"]   = new JobDesc(Jobs.Acolyte);
		
		this.jobs["Fighter"]   = new JobDesc(Jobs.Fighter);   this.jobs["Fighter"].mult = 5;
		this.jobs["Scholar"]   = new JobDesc(Jobs.Scholar);   this.jobs["Scholar"].mult = 3;
		this.jobs["Courtesan"] = new JobDesc(Jobs.Courtesan); this.jobs["Courtesan"].mult = 4;

		this.jobs["Mage"]      = new JobDesc(Jobs.Mage);   this.jobs["Mage"].mult = 2;
		this.jobs["Mystic"]    = new JobDesc(Jobs.Mystic); this.jobs["Mystic"].mult = 2;
		this.jobs["Healer"]    = new JobDesc(Jobs.Healer);
		
		this.jobs["Elementalist"] = new JobDesc(Jobs.Elementalist);
		//Kiai can't be Warlock
		this.jobs["Hypnotist"] = new JobDesc(Jobs.Hypnotist);
		
		this.weaponSlot   = Items.Weapons.WoodenStaff;
		this.topArmorSlot = Items.Armor.SimpleRobes;
		
		this.maxHp.base        = 80;
		this.maxSp.base        = 50;
		this.maxLust.base      = 20;
		// Main stats
		this.strength.base     = 10;
		this.stamina.base      = 11;
		this.dexterity.base    = 14;
		this.intelligence.base = 18;
		this.spirit.base       = 20;
		this.libido.base       = 13;
		this.charisma.base     = 13;
		
		this.level = 1;
		this.sexlevel = 1;
		
		// Note, since kia has no fixed gender, create body later
		this.body                  = new Body(this);
		this.body.head.hair.color  = Color.silver;
		this.body.head.hair.length.base = 15;
		this.body.head.eyes.color  = Color.purple;
		this.body.SetRace(Race.Elf);
		
		this.SetLevelBonus();
		this.RestFull();
		
		// Dialogue rotation
		this.flags["RotGeo"]        = 0;
		this.flags["RotPeople"]     = 0;
		this.flags["RotFactions"]   = 0;
		this.flags["RotElfCulture"] = 0;
		this.flags["RotElfParents"] = 0;
		this.flags["RotElfChild"]   = 0;
		this.flags["RotPrHier"]     = 0;
		this.flags["RotPrDisc"]     = 0;
		this.flags["RotPrAct"]      = 0;
		this.flags["RotPrYrissa"]   = 0;
		this.flags["RotPrAria"]     = 0;
		this.flags["RotPrMeeting"]  = 0;

		this.flags["InitialGender"] = Gender.male;
		this.flags["Attitude"]      = KiakaiFlags.Attitude.Neutral; 
		this.flags["AnalExp"]       = 0; 
		this.flags["Sexed"]         = 0;
		
		this.flags["TalkedSex"]     = 0;
		this.flags["SexPitchAnal"]  = 0;
		this.flags["SexCatchAnal"]  = 0;
		
		// First time dialogue
		this.flags["TalkedWhyLeave"]          = 0; 
		this.flags["TalkedWhyLeaveForce"]     = 0; 
		this.flags["TalkedWhyLeaveLong"]      = 0; 
		this.flags["TalkedWhyLeaveLongReact"] = 0; 
		this.flags["TalkedPriest"]            = 0; 
		this.flags["TalkedElves"]             = 0; 
		this.flags["TalkedAria"]              = 0; 
		this.flags["TalkedUru"]               = 0; 
		this.flags["TalkedUruDA"]             = 0; 
		this.flags["TalkedAlone"]             = 0;
		
		this.flags["TalkedStatue"]            = 0;
		
		if(storage) this.FromStorage(storage);
	}

	GiveAnalAllowed() {
		return this.flags["SexCatchAnal"] > 0; // TODO > 1?
	}
	TakeAnalAllowed() {
		return this.flags["SexPitchAnal"] > 0;
	}
	//TODO
	GiveVaginalAllowed() {
		return false;
	}
	//TODO
	TakeVaginalAllowed() {
		return this.FirstVag() && false;
	}
	
	ItemUsable(item : Item) {
		return true;
	}
	
	JobDesc() {
		return "acolyte";
	}
	
	ArmorDescLong() {
		if(this.Armor()) return super.ArmorDescLong();
		return "a light blue robe of soft cloth with short sleeves, ending just above the knees";
	}
	
	ArmorDesc() {
		if(this.Armor()) return super.ArmorDesc();
		return "light blue robe";
	}
	
	// Schedule
	IsAtLocation(location? : any) {
		return true;
	}
	
	InitCharacter(gender : Gender) {
		if(gender == Gender.male) {
			this.body.DefMale();
			this.body.cock[0].length.base = 8;
			
			this.name = "Kai";
			this.body.femininity.base = -0.2;
			this.Butt().buttSize.base = 2;
		}
		else {
			this.body.DefFemale();
			this.body.breasts[0].size.base = 4;
			
			this.name = "Kia";
			this.body.femininity.base = 0.2;
			this.Butt().buttSize.base = 3;
		}
		this.body.torso.hipSize.base    = 3;
		this.body.height.base      = 165;
		this.body.weigth.base      = 52;
	}
	
	// Party interaction
	Interact(switchSpot : boolean) {
		let player = GAME().player;
		let kiakai = GAME().kiakai;
	
		Text.Clear();
		var that = kiakai;
		
		var parse : any = {
			playername : player.name,
			name       : kiakai.name,
			hisher     : kiakai.hisher()
		};
		
		if(kiakai.flags["Attitude"] == KiakaiFlags.Attitude.Nice) {
			Text.Add("The elf perks up as you approach, giving you a friendly smile. <i>“What is on your mind, [playername]?”</i>", parse);
		}
		else if(kiakai.flags["Attitude"] == KiakaiFlags.Attitude.Naughty) {
			Text.Add("The elf regards your approach with a wary gaze, not sure what you are after. <i>“Yes?”</i>", parse);
		}
		else {
			Text.Add("[Error in Kiakai attitude: " + kiakai.flags["Attitude"] + "]");
		}
		Text.NL();
		
		that.PrintDescription();
		
		Text.Flush();
		
		var options = [];
		
		options.push({ nameStr: "Talk",
			func : function() {
				Text.Clear();
				Text.Add("What do you want to talk with [name] about?", parse);
				Text.Flush();
				that.TalkPrompt();
			}, enabled : true
		});
		options.push({ nameStr: "Release",
			func : function() {
				Text.Clear();
				Text.Add("[Placeholder] Kiai masturbates fiercely, cumming buckets.");
				
				TimeStep({minute : 10});
				
				that.OrgasmCum();
				
				Text.Flush();
				Gui.NextPrompt(function() {
					that.Interact(switchSpot);
				});
			}, enabled : true,
			tooltip : "Pleasure yourself."
		});
		options.push({ nameStr: "Meditate",
			func : function() {
				Text.Clear();
				Text.Add("Placeholder: [name] sits down and attempts to calm [hisher] thoughts.", parse);
				Text.Flush();
				TimeStep({minute : 30});
				
				that.AddLustFraction(-1);
				
				Gui.NextPrompt(that.Interact);
			}, enabled : true,
			tooltip : "Clean impure thoughts."
		});
		options.push({ nameStr: "Healing",
			func : KiakaiScenes.Healing, enabled : true,
			tooltip : Text.Parse("Ask [name] to heal your wounds, and perhaps comfort you in other ways.", parse)
		});
		if(kiakai.flags["Sexed"] >= 30) {
			options.push({ nameStr: "Sex",
				func : KiakaiScenes.Sex, enabled : kiakai.flags["TalkedSex"] != 1,
				tooltip : Text.Parse("Proposition to have sex with [name].", parse)
			});
		}
		//Equip, stats, job, switch
		that.InteractDefault(options, switchSpot, true, true, true, true);
		
		Gui.SetButtonsFromList(options, true, NAV().PartyInteraction);
	}
	
	TalkPrompt() {
		let player = GAME().player;
		let kiakai = GAME().kiakai;
		let ravenmother = GAME().ravenmother;
		
		var parse : any = {
			playername : player.name,
			name   : kiakai.name
		};
		parse = kiakai.ParserPronouns(parse);
		
		var options = [];
		// TALK ABOUT MAIN QUEST
		options.push({ nameStr: "Quest",
			func : KiakaiScenes.TalkQuest, enabled : true,
			tooltip : "Talk about your goals."
		});
		// TALK ABOUT ARIA
		options.push({ nameStr: "Aria",
			func : function() {
				Text.Clear();
				KiakaiScenes.TalkAria();
			}, enabled : true,
			tooltip : "Ask about Aria."
		});
		// TALK ABOUT URU
		options.push({ nameStr: "Uru",
			func : function() {
				Text.Clear();
				KiakaiScenes.TalkUru();
			}, enabled : true,
			tooltip : "Ask about Uru."
		});
		// TALK ABOUT EDEN
		options.push({ nameStr: "Eden",
			func : function() {
				Text.Clear();
				KiakaiScenes.TalkEden();
			}, enabled : true,
			tooltip : "Ask about the land of Eden and its people."
		});
		// TALK ABOUT ELVES
		options.push({ nameStr: "Elves",
			func : function() {
				Text.Clear();
				KiakaiScenes.TalkElves();
			}, enabled : true,
			tooltip : Text.Parse("Ask [name] about [hisher] childhood with the elves.", parse)
		});
		// TALK ABOUT PRIESTHOOD
		options.push({ nameStr: "Priesthood",
			func : function() {
				Text.Clear();
				KiakaiScenes.TalkPriest();
			}, enabled : true,
			tooltip : "Ask about the priests of Aria."
		});
		// TALK RAVENS
		var r = ravenmother.Ravenness();
		if(r >= RavenFlags.Stage.ravenstage2 + 2 &&
		   ravenmother.flags["Met"] == 0) {
			options.push({ nameStr : "Ravens",
				func : function() {
					KiakaiScenes.RavenDreams();
					kiakai.TalkPrompt();
				}, enabled : true,
				tooltip : Text.Parse("Ask [name] if [heshe] knows anything about the ravens that have been appearing in your dreams.", parse)
			});
		}
		/*
		options.push({nameStr : kiakai.name,
			func : function() {
				// TODO ROMANCE
				
			}, enabled : true,
			tooltip : "Talk about personal things."
		});
		*/
		
		Gui.SetButtonsFromList(options, true, kiakai.Interact);
	}	
}
