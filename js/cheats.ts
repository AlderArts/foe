import * as _ from 'lodash';

import { Link } from './event';
import { Cock } from './body/cock';
import { Vagina } from './body/vagina';
import { Item } from './item';
import { GetDEBUG, SetDEBUG } from '../app';
import { Text } from './text';
import { Gui } from './gui';
import { GAME, WORLD } from './GAME';
import { KiakaiFlags } from './event/kiakai-flags';
import { IngredientItems } from './items/ingredients';
import { AlchemyItems } from './items/alchemy';
import { AlchemySpecial } from './items/alchemyspecial';
import { ToysItems } from './items/toys';
import { StrapOnItems } from './items/strapon';
import { CombatItems } from './items/combatitems';

export function InitCheats() {
	let world = WORLD();
	/*
	world.loc.Plains.Nomads.Tent.events.push(new Link(
		"TESTBUTTON", function() { return GetDEBUG(); }, true,
		function() {
			Text.Add(Text.Bold("DEBUG: " + "Time"));
			Text.NL();
			Text.Flush();
		},
		function() {
			//Scenes.Golem.FightPrompt();
			StepToHour(13, 14);
		}
	));
	*/

	world.loc.Plains.Nomads.Tent.events.push(new Link(
		"CockSmith", function() { return GetDEBUG(); }, true,
		function() {
			if(GetDEBUG()) {
				Text.NL();
				Text.Add(Text.Bold("Mr. Johnson, the cocksmith, is sitting inconspicuously in a corner."));
				Text.NL();
			}
		},
		function() {
			Text.Clear();
			Text.Add("Jolly good to see you chap, what can I do for you?");
			Text.NL();
			Text.Add(Text.Bold("DEBUG: This is a cheat-shop, where you can change your characters body."));
			Text.NL();
			
			let CockSmith = function() {
				Text.Flush();
				let options = new Array();
				options.push({ nameStr : "Add cock",
					func : function() {
						GAME().player.body.cock.push(new Cock());
						Text.Add("You gain a cock, giving you " + GAME().player.NumCocks());
						Text.NL();
						CockSmith();
					}, enabled : GAME().player.NumCocks() < 10
				});
				options.push({ nameStr : "Lose cock",
					func : function() {
						GAME().player.body.cock.pop();
						Text.Add("You lose a cock, leaving you with " + GAME().player.NumCocks());
						Text.NL();
						CockSmith();
					}, enabled : GAME().player.FirstCock()
				});
				options.push({ nameStr : "Cock+L",
					func : function() {
						let cocks = GAME().player.AllCocks();
						for(let i = 0; i < cocks.length; i++) {
							let cock = cocks[i];
							let inc = 30;
							if(cock.length.Get() <= 50) inc = 10;
							if(cock.length.Get() <= 20) inc = 5;
							if(cock.length.Get() <= 10) inc = 1;
							cock.length.IncreaseStat(200, inc);
						}
						Text.Add("Your cock(s) grow in length, giving you " + GAME().player.MultiCockDesc());
						Text.NL();
						CockSmith();
					}, enabled : GAME().player.FirstCock() && GAME().player.FirstCock().length.Get() < 200
				});
				options.push({ nameStr : "Cock-L",
					func : function() {
						let cocks = GAME().player.AllCocks();
						for(let i = 0; i < cocks.length; i++) {
							let cock = cocks[i];
							let inc = 30;
							if(cock.length.Get() <= 50) inc = 10;
							if(cock.length.Get() <= 20) inc = 5;
							if(cock.length.Get() <= 10) inc = 1;
							cock.length.DecreaseStat(5, inc);
						}
						Text.Add("Your cock(s) shrink in length, giving you " + GAME().player.MultiCockDesc());
						Text.NL();
						CockSmith();
					}, enabled : GAME().player.FirstCock() && GAME().player.FirstCock().length.Get() > 5
				});
				options.push({ nameStr : "Cock+T",
					func : function() {
						let cocks = GAME().player.AllCocks();
						for(let i = 0; i < cocks.length; i++) {
							let cock = cocks[i];
							let inc = 10;
							if(cock.thickness.Get() <= 25) inc = 5;
							if(cock.thickness.Get() <= 10) inc = 3;
							if(cock.thickness.Get() <= 5)  inc = 1;
							cock.thickness.IncreaseStat(50, inc);
						}
						Text.Add("Your cock(s) grow in thickness, giving you " + GAME().player.MultiCockDesc());
						Text.NL();
						CockSmith();
					}, enabled : GAME().player.FirstCock() && GAME().player.FirstCock().thickness.Get() < 50
				});
				options.push({ nameStr : "Cock-T",
					func : function() {
						let cocks = GAME().player.AllCocks();
						for(let i = 0; i < cocks.length; i++) {
							let cock = cocks[i];
							let inc = 10;
							if(cock.thickness.Get() <= 25) inc = 5;
							if(cock.thickness.Get() <= 10) inc = 3;
							if(cock.thickness.Get() <= 5) inc = 1;
							cock.thickness.DecreaseStat(1, inc);
						}
						Text.Add("Your cock(s) shrink in thickness, giving you " + GAME().player.MultiCockDesc());
						Text.NL();
						CockSmith();
					}, enabled : GAME().player.FirstCock() && GAME().player.FirstCock().thickness.Get() > 1
				});
				options.push({ nameStr : "Add vag",
					func : function() {
						GAME().player.body.vagina.push(new Vagina());
						Text.Add("You gain a vagina");
						Text.NL();
						CockSmith();
					}, enabled : !GAME().player.FirstVag()
				});
				options.push({ nameStr : "Lose vag",
					func : function() {
						GAME().player.body.vagina.pop();
						Text.Add("You lose your vagina");
						Text.NL();
						CockSmith();
					}, enabled : GAME().player.FirstVag()
				});
				options.push({ nameStr : "Add balls",
					func : function() {
						GAME().player.Balls().count.base = 2;
						Text.Add("You gain balls");
						Text.NL();
						CockSmith();
					}, enabled : !GAME().player.HasBalls()
				});
				options.push({ nameStr : "Lose balls",
					func : function() {
						GAME().player.Balls().count.base = 0;
						Text.Add("You lose your balls");
						Text.NL();
						CockSmith();
					}, enabled : GAME().player.HasBalls()
				});
				options.push({ nameStr : "Breasts+",
					func : function() {
						let inc = 30;
						if(GAME().player.FirstBreastRow().size.Get() <= 50) inc = 10;
						if(GAME().player.FirstBreastRow().size.Get() <= 20) inc = 5;
						if(GAME().player.FirstBreastRow().size.Get() <= 10) inc = 1;
						GAME().player.FirstBreastRow().size.IncreaseStat(200, inc);
						Text.Add("Your breasts grow in size, giving you " + GAME().player.FirstBreastRow().Short());
						Text.NL();
						CockSmith();
					}, enabled : GAME().player.FirstBreastRow().size.Get() < 200
				});
				options.push({ nameStr : "Breasts-",
					func : function() {
						let inc = 30;
						if(GAME().player.FirstBreastRow().size.Get() <= 50) inc = 10;
						if(GAME().player.FirstBreastRow().size.Get() <= 20) inc = 5;
						if(GAME().player.FirstBreastRow().size.Get() <= 10) inc = 1;
						GAME().player.FirstBreastRow().size.DecreaseStat(1, inc);
						Text.Add("Your breasts shrink in size, giving you " + GAME().player.FirstBreastRow().Short());
						Text.NL();
						CockSmith();
					}, enabled : GAME().player.FirstBreastRow().size.Get() > 1
				});
				options.push({ nameStr : "Reset virgin",
					func : function() {
						GAME().player.ResetVirgin();
						Text.Add("You are now a virgin in all the relevant places.");
						Text.NL();
						CockSmith();
					}, enabled : true
				});
				options.push({ nameStr : "Dom+10",
					func : function() {
						GAME().player.subDom.IncreaseStat(100, 10);
					}, enabled : true
				});
				options.push({ nameStr : "Dom-10",
					func : function() {
						GAME().player.subDom.DecreaseStat(-100, 10);
					}, enabled : true
				});
				options.push({ nameStr : "Slut+10",
					func : function() {
						GAME().player.slut.IncreaseStat(100, 10);
					}, enabled : true
				});
				options.push({ nameStr : "Slut-10",
					func : function() {
						GAME().player.slut.DecreaseStat(-100, 10);
					}, enabled : true
				});
				
				Gui.SetButtonsFromList(options, true, Gui.PrintDefaultOptions);
			}
			
			CockSmith();
		}
	));


	world.loc.Plains.Nomads.Tent.events.push(new Link(
		"ElfCalib", function() { return GetDEBUG(); }, true,
		function() {
			if(GetDEBUG()) {
				Text.NL();
				Text.Add(Text.Bold("Inra, the elf calibrator, is sitting in a corner."));
				Text.NL();
			}
		},
		function() {
			let kiakai = GAME().kiakai;
			let parse : any = {
				name   : kiakai.name,
				hisher : function() { return kiakai.hisher(); },
				himher : function() { return kiakai.himher(); }
			};
			
			Text.Clear();
			Text.Add("<i>“Need your elf recalibrated?”</i>");
			Text.NL();
			Text.Add("DEBUG: This is a cheat-shop, where you can modify [name].", parse, "bold");
			Text.NL();
			
			let ElfSmith = function() {
				Text.Flush();
				let options = [];
				options.push({ nameStr : "Attitude",
					func : function() {
						let options = new Array();
						options.push({ nameStr : "Nice",
							func : function() {
								GAME().party.SwitchIn(kiakai);
								kiakai.flags["Attitude"] = KiakaiFlags.Attitude.Nice;
								ElfSmith();
							}, enabled : true,
							tooltip : "Be nice to the elf."
						});
						options.push({ nameStr : "Naughty",
							func : function() {
								GAME().party.SwitchIn(kiakai);
								kiakai.flags["Attitude"] = KiakaiFlags.Attitude.Naughty;
								ElfSmith();
							}, enabled : true,
							tooltip : "Be naughty to the elf."
						});
						options.push({ nameStr : "Dismiss",
							func : function() {
								GAME().party.RemoveMember(kiakai);
								kiakai.flags["Attitude"] = KiakaiFlags.Attitude.Neutral;
								ElfSmith();
							}, enabled : true,
							tooltip : "Elf is gone."
						});
						Gui.SetButtonsFromList(options, true, ElfSmith);
					}, enabled : true
				});
				options.push({ nameStr : "Relation",
					func : function() {
						let options = new Array();
						options.push({ nameStr : "Rel+10",
							func : function() {
								kiakai.relation.IncreaseStat(100, 10);
							}, enabled : true
						});
						options.push({ nameStr : "Rel-10",
							func : function() {
								kiakai.relation.DecreaseStat(-100, 10);
							}, enabled : true
						});
						options.push({ nameStr : "Dom+10",
							func : function() {
								kiakai.subDom.IncreaseStat(100, 10);
							}, enabled : true
						});
						options.push({ nameStr : "Dom-10",
							func : function() {
								kiakai.subDom.DecreaseStat(-100, 10);
							}, enabled : true
						});
						options.push({ nameStr : "Slut+10",
							func : function() {
								kiakai.slut.IncreaseStat(100, 10);
							}, enabled : true
						});
						options.push({ nameStr : "Slut-10",
							func : function() {
								kiakai.slut.DecreaseStat(-100, 10);
							}, enabled : true
						});
						Gui.SetButtonsFromList(options, true, ElfSmith);
					}, enabled : true
				});
				options.push({ nameStr : "Body mods",
					func : function() {
						let ElfSmithBody = function() {
							Text.Flush();
							let options = new Array();
							options.push({ nameStr : "Add cock",
								func : function() {
									kiakai.body.cock.push(new Cock());
									Text.Add("[name] gains a cock, giving [himher] " + kiakai.NumCocks(), parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.NumCocks() < 10
							});
							options.push({ nameStr : "Lose cock",
								func : function() {
									kiakai.body.cock.pop();
									Text.Add("[name] lose a cock, leaving [himher] with " + kiakai.NumCocks(), parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstCock()
							});
							options.push({ nameStr : "Cock+L",
								func : function() {
									let cocks = kiakai.AllCocks();
									for(let i = 0; i < cocks.length; i++) {
										let cock = cocks[i];
										let inc = 30;
										if(cock.length.Get() <= 50) inc = 10;
										if(cock.length.Get() <= 20) inc = 5;
										if(cock.length.Get() <= 10) inc = 1;
										cock.length.IncreaseStat(200, inc);
									}
									Text.Add("[name]'s cock(s) grow in length, giving [himher] " + kiakai.MultiCockDesc(), parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstCock() && kiakai.FirstCock().length.Get() < 200
							});
							options.push({ nameStr : "Cock-L",
								func : function() {
									let cocks = kiakai.AllCocks();
									for(let i = 0; i < cocks.length; i++) {
										let cock = cocks[i];
										let inc = 30;
										if(cock.length.Get() <= 50) inc = 10;
										if(cock.length.Get() <= 20) inc = 5;
										if(cock.length.Get() <= 10) inc = 1;
										cock.length.DecreaseStat(5, inc);
									}
									Text.Add("[name]'s cock(s) shrink in length, giving [himher] " + kiakai.MultiCockDesc(), parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstCock() && kiakai.FirstCock().length.Get() > 5
							});
							options.push({ nameStr : "Cock+T",
								func : function() {
									let cocks = kiakai.AllCocks();
									for(let i = 0; i < cocks.length; i++) {
										let cock = cocks[i];
										let inc = 10;
										if(cock.thickness.Get() <= 25) inc = 5;
										if(cock.thickness.Get() <= 10) inc = 3;
										if(cock.thickness.Get() <= 5)  inc = 1;
										cock.thickness.IncreaseStat(50, inc);
									}
									Text.Add("[name]'s cock(s) grow in thickness, giving [himher] " + kiakai.MultiCockDesc(), parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstCock() && kiakai.FirstCock().thickness.Get() < 50
							});
							options.push({ nameStr : "Cock-T",
								func : function() {
									let cocks = kiakai.AllCocks();
									for(let i = 0; i < cocks.length; i++) {
										let cock = cocks[i];
										let inc = 10;
										if(cock.thickness.Get() <= 25) inc = 5;
										if(cock.thickness.Get() <= 10) inc = 3;
										if(cock.thickness.Get() <= 5) inc = 1;
										cock.thickness.DecreaseStat(1, inc);
									}
									Text.Add("[name]'s cock(s) shrink in thickness, giving [himher] " + kiakai.MultiCockDesc(), parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstCock() && kiakai.FirstCock().thickness.Get() > 1
							});
							options.push({ nameStr : "Add vag",
								func : function() {
									kiakai.body.vagina.push(new Vagina());
									Text.Add("[name] gain a vagina", parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : !kiakai.FirstVag()
							});
							options.push({ nameStr : "Lose vag",
								func : function() {
									kiakai.body.vagina.pop();
									Text.Add("[name] lose [hisher] vagina", parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstVag()
							});
							options.push({ nameStr : "Add balls",
								func : function() {
									kiakai.Balls().count.base = 2;
									Text.Add("[name] gain balls", parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : !kiakai.HasBalls()
							});
							options.push({ nameStr : "Lose balls",
								func : function() {
									kiakai.Balls().count.base = 0;
									Text.Add("[name] lose [hisher] balls", parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.HasBalls()
							});
							options.push({ nameStr : "Breasts+",
								func : function() {
									let inc = 30;
									if(kiakai.FirstBreastRow().size.Get() <= 50) inc = 10;
									if(kiakai.FirstBreastRow().size.Get() <= 20) inc = 5;
									if(kiakai.FirstBreastRow().size.Get() <= 10) inc = 1;
									kiakai.FirstBreastRow().size.IncreaseStat(200, inc);
									Text.Add("[name]'s breasts grow in size, giving [himher] " + kiakai.FirstBreastRow().Short(), parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstBreastRow().size.Get() < 200
							});
							options.push({ nameStr : "Breasts-",
								func : function() {
									let inc = 30;
									if(kiakai.FirstBreastRow().size.Get() <= 50) inc = 10;
									if(kiakai.FirstBreastRow().size.Get() <= 20) inc = 5;
									if(kiakai.FirstBreastRow().size.Get() <= 10) inc = 1;
									kiakai.FirstBreastRow().size.DecreaseStat(1, inc);
									Text.Add("[name]'s breasts shrink in size, giving [himher] " + kiakai.FirstBreastRow().Short(), parse);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstBreastRow().size.Get() > 1
							});
							options.push({ nameStr : "Reset virgin",
								func : function() {
									kiakai.ResetVirgin();
									Text.Add("The elf is now a virgin in all the relevant places.");
									Text.NL();
									ElfSmithBody();
								}, enabled : true
							});
							Gui.SetButtonsFromList(options, true, ElfSmith);
						}
						ElfSmithBody();
					}, enabled : true
				});
				Gui.SetButtonsFromList(options, true, Gui.PrintDefaultOptions);
			}
			ElfSmith();
		}
	));


	world.loc.Plains.Nomads.Tent.events.push(new Link(
		"ITEM", function() { return GetDEBUG(); }, true,
		function() {
			if(GetDEBUG()) {
				Text.NL();
				Text.Add(Text.Bold("A box of cheaty items."));
				Text.NL();
			}
		},
		function() {
			Text.Clear();
			Text.Add("You pick up some crap.");
			Text.NL();
			Text.Add("<b>Got a fuckton of money</b>");
			
			GAME().party.coin += 1000;
			
			Text.NL();
			Text.Add("<b>Got a fuckton of items</b>");
			
			SetDEBUG(false);

			_(IngredientItems).pickBy(function(item) {
				return item instanceof Item
			}).forOwn(function(item) {
				GAME().party.inventory.AddItem(item, 10);
			});

			_(AlchemyItems).pickBy(function(item) {
				return item instanceof Item
			}).forOwn(function(item) {
				GAME().party.inventory.AddItem(item, 10);
			});

			_(AlchemySpecial).pickBy(function(item) {
				return item instanceof Item
			}).forOwn(function(item) {
				GAME().party.inventory.AddItem(item, 10);
			});

			_(ToysItems).pickBy(function(item) {
				return item instanceof Item
			}).forOwn(function(item) {
				GAME().party.inventory.AddItem(item, 10);
			});

			_(StrapOnItems).pickBy(function(item) {
				return item instanceof Item
			}).forOwn(function(item) {
				GAME().party.inventory.AddItem(item, 10);
			});

			_(CombatItems).pickBy(function(item) {
				return item instanceof Item
			}).forOwn(function(item) {
				GAME().party.inventory.AddItem(item, 10);
			});
			
			SetDEBUG(true);
			
			Text.Flush();
			Gui.NextPrompt();
		}
	));
}