
/*
world.loc.Plains.Nomads.Tent.events.push(new Link(
	"TESTBUTTON", function() { return DEBUG; }, true,
	function() {
		Text.Add(Text.BoldColor("DEBUG: " + "Time"));
		Text.NL();
		Text.Flush();
	},
	function() {
		//Scenes.Golem.FightPrompt();
		world.StepToHour(13, 14);
	}
));
*/

world.loc.Plains.Nomads.Tent.events.push(new Link(
	"CockSmith", function() { return DEBUG; }, true,
	function() {
		if(DEBUG) {
			Text.Newline();
			Text.AddOutput(Text.BoldColor("Mr Johnson, the cocksmith, is sitting inconspicuously in a corner."));
			Text.Newline();
		}
	},
	function() {
		Text.Clear();
		Text.AddOutput("Jolly good to see you chap, what can I do for you?");
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: This is a cheat-shop, where you can change your characters body."));
		Text.Newline();
		
		var CockSmith = function() {
			var options = new Array();
			options.push({ nameStr : "Add cock",
				func : function() {
					player.body.cock.push(new Cock());
					Text.AddOutput("You gain a cock, giving you " + player.NumCocks());
					Text.Newline();
					CockSmith();
				}, enabled : player.NumCocks() < 10
			});
			options.push({ nameStr : "Lose cock",
				func : function() {
					player.body.cock.pop();
					Text.AddOutput("You lose a cock, leaving you with " + player.NumCocks());
					Text.Newline();
					CockSmith();
				}, enabled : player.FirstCock()
			});
			options.push({ nameStr : "Cock+L",
				func : function() {
					var cocks = player.AllCocks();
					for(var i = 0; i < cocks.length; i++) {
						var cock = cocks[i];
						var inc = 30;
						if(cock.length.Get() <= 50) inc = 10;
						if(cock.length.Get() <= 20) inc = 5;
						if(cock.length.Get() <= 10) inc = 1;
						cock.length.IncreaseStat(200, inc);
					}
					Text.AddOutput("Your cock(s) grow in length, giving you " + player.MultiCockDesc());
					Text.Newline();
					CockSmith();
				}, enabled : player.FirstCock() && player.FirstCock().length.Get() < 200
			});
			options.push({ nameStr : "Cock-L",
				func : function() {
					var cocks = player.AllCocks();
					for(var i = 0; i < cocks.length; i++) {
						var cock = cocks[i];
						var inc = 30;
						if(cock.length.Get() <= 50) inc = 10;
						if(cock.length.Get() <= 20) inc = 5;
						if(cock.length.Get() <= 10) inc = 1;
						cock.length.DecreaseStat(5, inc);
					}
					Text.AddOutput("Your cock(s) shrink in length, giving you " + player.MultiCockDesc());
					Text.Newline();
					CockSmith();
				}, enabled : player.FirstCock() && player.FirstCock().length.Get() > 5
			});
			options.push({ nameStr : "Cock+T",
				func : function() {
					var cocks = player.AllCocks();
					for(var i = 0; i < cocks.length; i++) {
						var cock = cocks[i];
						var inc = 10;
						if(cock.thickness.Get() <= 25) inc = 5;
						if(cock.thickness.Get() <= 10) inc = 3;
						if(cock.thickness.Get() <= 5)  inc = 1;
						cock.thickness.IncreaseStat(50, inc);
					}
					Text.AddOutput("Your cock(s) grow in thickness, giving you " + player.MultiCockDesc());
					Text.Newline();
					CockSmith();
				}, enabled : player.FirstCock() && player.FirstCock().thickness.Get() < 50
			});
			options.push({ nameStr : "Cock-T",
				func : function() {
					var cocks = player.AllCocks();
					for(var i = 0; i < cocks.length; i++) {
						var cock = cocks[i];
						var inc = 10;
						if(cock.thickness.Get() <= 25) inc = 5;
						if(cock.thickness.Get() <= 10) inc = 3;
						if(cock.thickness.Get() <= 5) inc = 1;
						cock.thickness.DecreaseStat(1, inc);
					}
					Text.AddOutput("Your cock(s) shrink in thickness, giving you " + player.MultiCockDesc());
					Text.Newline();
					CockSmith();
				}, enabled : player.FirstCock() && player.FirstCock().thickness.Get() > 1
			});
			options.push({ nameStr : "Add vag",
				func : function() {
					player.body.vagina.push(new Vagina());
					Text.AddOutput("You gain a vagina");
					Text.Newline();
					CockSmith();
				}, enabled : !player.FirstVag()
			});
			options.push({ nameStr : "Lose vag",
				func : function() {
					player.body.vagina.pop();
					Text.AddOutput("You lose your vagina");
					Text.Newline();
					CockSmith();
				}, enabled : player.FirstVag()
			});
			options.push({ nameStr : "Add balls",
				func : function() {
					player.Balls().count.base = 2;
					Text.AddOutput("You gain balls");
					Text.Newline();
					CockSmith();
				}, enabled : !player.HasBalls()
			});
			options.push({ nameStr : "Lose balls",
				func : function() {
					player.Balls().count.base = 0;
					Text.AddOutput("You lose your balls");
					Text.Newline();
					CockSmith();
				}, enabled : player.HasBalls()
			});
			options.push({ nameStr : "Breasts+",
				func : function() {
					var inc = 30;
					if(player.FirstBreastRow().size.Get() <= 50) inc = 10;
					if(player.FirstBreastRow().size.Get() <= 20) inc = 5;
					if(player.FirstBreastRow().size.Get() <= 10) inc = 1;
					player.FirstBreastRow().size.IncreaseStat(200, inc);
					Text.AddOutput("Your breasts grow in size, giving you " + player.FirstBreastRow().Short());
					Text.Newline();
					CockSmith();
				}, enabled : player.FirstBreastRow().size.Get() < 200
			});
			options.push({ nameStr : "Breasts-",
				func : function() {
					var inc = 30;
					if(player.FirstBreastRow().size.Get() <= 50) inc = 10;
					if(player.FirstBreastRow().size.Get() <= 20) inc = 5;
					if(player.FirstBreastRow().size.Get() <= 10) inc = 1;
					player.FirstBreastRow().size.DecreaseStat(1, inc);
					Text.AddOutput("Your breasts shrink in size, giving you " + player.FirstBreastRow().Short());
					Text.Newline();
					CockSmith();
				}, enabled : player.FirstBreastRow().size.Get() > 1
			});
			options.push({ nameStr : "Reset virgin",
				func : function() {
					player.ResetVirgin();
					Text.AddOutput("You are now a virgin in all the relevant places.");
					Text.Newline();
					CockSmith();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, true, PrintDefaultOptions);
		}
		
		CockSmith();
	}
));


world.loc.Plains.Nomads.Tent.events.push(new Link(
	"ElfCalib", function() { return DEBUG; }, true,
	function() {
		if(DEBUG) {
			Text.Newline();
			Text.AddOutput(Text.BoldColor("Inra, the elf calibrator, is sitting in a corner."));
			Text.Newline();
		}
	},
	function() {
		parse = {
			name   : kiakai.name,
			hisher : function() { return kiakai.hisher(); },
			himher : function() { return kiakai.himher(); }
		};
		
		Text.Clear();
		Text.AddOutput("<i>“Need your elf recalibrated?”</i>");
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: This is a cheat-shop, where you can modify [name].", parse));
		Text.Newline();
		
		var ElfSmith = function() {
			var options = [];
			options.push({ nameStr : "Attitude",
				func : function() {
					var options = new Array();
					options.push({ nameStr : "Nice",
						func : function() {
							party.AddMember(kiakai);
							kiakai.flags["Attitude"] = Kiakai.Attitude.Nice;
							ElfSmith();
						}, enabled : true,
						tooltip : "Be nice to the elf."
					});
					options.push({ nameStr : "Naughty",
						func : function() {
							party.AddMember(kiakai);
							kiakai.flags["Attitude"] = Kiakai.Attitude.Naughty;
							ElfSmith();
						}, enabled : true,
						tooltip : "Be naughty to the elf."
					});
					options.push({ nameStr : "Dismiss",
						func : function() {
							party.RemoveMember(kiakai);
							kiakai.flags["Attitude"] = Kiakai.Attitude.Neutral;
							ElfSmith();
						}, enabled : true,
						tooltip : "Elf is gone."
					});
					Gui.SetButtonsFromList(options, true, ElfSmith);
				}, enabled : true
			});
			options.push({ nameStr : "Relation",
				func : function() {
					var options = new Array();
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
					var ElfSmithBody = function() {
						var options = new Array();
						options.push({ nameStr : "Add cock",
							func : function() {
								kiakai.body.cock.push(new Cock());
								Text.AddOutput("[name] gains a cock, giving [himher] " + kiakai.NumCocks(), parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : kiakai.NumCocks() < 10
						});
						options.push({ nameStr : "Lose cock",
							func : function() {
								kiakai.body.cock.pop();
								Text.AddOutput("[name] lose a cock, leaving [himher] with " + kiakai.NumCocks(), parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : kiakai.FirstCock()
						});
						options.push({ nameStr : "Cock+L",
							func : function() {
								var cocks = kiakai.AllCocks();
								for(var i = 0; i < cocks.length; i++) {
									var cock = cocks[i];
									var inc = 30;
									if(cock.length.Get() <= 50) inc = 10;
									if(cock.length.Get() <= 20) inc = 5;
									if(cock.length.Get() <= 10) inc = 1;
									cock.length.IncreaseStat(200, inc);
								}
								Text.AddOutput("[name]'s cock(s) grow in length, giving [himher] " + kiakai.MultiCockDesc(), parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : kiakai.FirstCock() && kiakai.FirstCock().length.Get() < 200
						});
						options.push({ nameStr : "Cock-L",
							func : function() {
								var cocks = kiakai.AllCocks();
								for(var i = 0; i < cocks.length; i++) {
									var cock = cocks[i];
									var inc = 30;
									if(cock.length.Get() <= 50) inc = 10;
									if(cock.length.Get() <= 20) inc = 5;
									if(cock.length.Get() <= 10) inc = 1;
									cock.length.DecreaseStat(5, inc);
								}
								Text.AddOutput("[name]'s cock(s) shrink in length, giving [himher] " + kiakai.MultiCockDesc(), parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : kiakai.FirstCock() && kiakai.FirstCock().length.Get() > 5
						});
						options.push({ nameStr : "Cock+T",
							func : function() {
								var cocks = kiakai.AllCocks();
								for(var i = 0; i < cocks.length; i++) {
									var cock = cocks[i];
									var inc = 10;
									if(cock.thickness.Get() <= 25) inc = 5;
									if(cock.thickness.Get() <= 10) inc = 3;
									if(cock.thickness.Get() <= 5)  inc = 1;
									cock.thickness.IncreaseStat(50, inc);
								}
								Text.AddOutput("[name]'s cock(s) grow in thickness, giving [himher] " + kiakai.MultiCockDesc(), parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : kiakai.FirstCock() && kiakai.FirstCock().thickness.Get() < 50
						});
						options.push({ nameStr : "Cock-T",
							func : function() {
								var cocks = kiakai.AllCocks();
								for(var i = 0; i < cocks.length; i++) {
									var cock = cocks[i];
									var inc = 10;
									if(cock.thickness.Get() <= 25) inc = 5;
									if(cock.thickness.Get() <= 10) inc = 3;
									if(cock.thickness.Get() <= 5) inc = 1;
									cock.thickness.DecreaseStat(1, inc);
								}
								Text.AddOutput("[name]'s cock(s) shrink in thickness, giving [himher] " + kiakai.MultiCockDesc(), parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : kiakai.FirstCock() && kiakai.FirstCock().thickness.Get() > 1
						});
						options.push({ nameStr : "Add vag",
							func : function() {
								kiakai.body.vagina.push(new Vagina());
								Text.AddOutput("[name] gain a vagina", parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : !kiakai.FirstVag()
						});
						options.push({ nameStr : "Lose vag",
							func : function() {
								kiakai.body.vagina.pop();
								Text.AddOutput("[name] lose [hisher] vagina", parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : kiakai.FirstVag()
						});
						options.push({ nameStr : "Add balls",
							func : function() {
								kiakai.Balls().count.base = 2;
								Text.AddOutput("[name] gain balls", parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : !kiakai.HasBalls()
						});
						options.push({ nameStr : "Lose balls",
							func : function() {
								kiakai.Balls().count.base = 0;
								Text.AddOutput("[name] lose [hisher] balls", parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : kiakai.HasBalls()
						});
						options.push({ nameStr : "Breasts+",
							func : function() {
								var inc = 30;
								if(kiakai.FirstBreastRow().size.Get() <= 50) inc = 10;
								if(kiakai.FirstBreastRow().size.Get() <= 20) inc = 5;
								if(kiakai.FirstBreastRow().size.Get() <= 10) inc = 1;
								kiakai.FirstBreastRow().size.IncreaseStat(200, inc);
								Text.AddOutput("[name]'s breasts grow in size, giving [himher] " + kiakai.FirstBreastRow().Short(), parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : kiakai.FirstBreastRow().size.Get() < 200
						});
						options.push({ nameStr : "Breasts-",
							func : function() {
								var inc = 30;
								if(kiakai.FirstBreastRow().size.Get() <= 50) inc = 10;
								if(kiakai.FirstBreastRow().size.Get() <= 20) inc = 5;
								if(kiakai.FirstBreastRow().size.Get() <= 10) inc = 1;
								kiakai.FirstBreastRow().size.DecreaseStat(1, inc);
								Text.AddOutput("[name]'s breasts shrink in size, giving [himher] " + kiakai.FirstBreastRow().Short(), parse);
								Text.Newline();
								ElfSmithBody();
							}, enabled : kiakai.FirstBreastRow().size.Get() > 1
						});
						options.push({ nameStr : "Reset virgin",
							func : function() {
								kiakai.ResetVirgin();
								Text.AddOutput("The elf is now a virgin in all the relevant places.");
								Text.Newline();
								ElfSmithBody();
							}, enabled : true
						});
						Gui.SetButtonsFromList(options, true, ElfSmith);
					}
					ElfSmithBody();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, true, PrintDefaultOptions);
		}
		ElfSmith();
	}
));


world.loc.Plains.Nomads.Tent.events.push(new Link(
	"ITEM", function() { return DEBUG; }, true,
	function() {
		if(DEBUG) {
			Text.Newline();
			Text.AddOutput(Text.BoldColor("A box of cheaty items."));
			Text.Newline();
		}
	},
	function() {
		Text.Clear();
		Text.AddOutput("You pick up some crap.");
		Text.Newline();
		Text.AddOutput("<b>Got a fuckton of money</b>");
		
		party.coin += 1000;
		
		Text.Newline();
		Text.AddOutput("<b>Got a fuckton of items</b>");
		
		DEBUG = false;
		
		party.inventory.AddItem(Items.HorseHair);
		party.inventory.AddItem(Items.HorseShoe);
		party.inventory.AddItem(Items.HorseCum);
		party.inventory.AddItem(Items.Equinium);
		
		party.inventory.AddItem(Items.EquiniumPlus);
		
		party.inventory.AddItem(Items.RabbitFoot);
		party.inventory.AddItem(Items.CarrotJuice);
		party.inventory.AddItem(Items.Lettuce);
		party.inventory.AddItem(Items.Leporine);
		
		party.inventory.AddItem(Items.Whiskers);
		party.inventory.AddItem(Items.HairBall);
		party.inventory.AddItem(Items.CatClaw);
		party.inventory.AddItem(Items.Felinix);
		
		party.inventory.AddItem(Items.Tigris);
		
		party.inventory.AddItem(Items.SnakeOil);
		party.inventory.AddItem(Items.LizardScale);
		party.inventory.AddItem(Items.LizardEgg);
		party.inventory.AddItem(Items.SnakeFang);
		party.inventory.AddItem(Items.SnakeSkin);
		party.inventory.AddItem(Items.Lacertium);
		
		party.inventory.AddItem(Items.Nagazm);
		party.inventory.AddItem(Items.Taurico);
		
		party.inventory.AddItem(Items.GoatMilk);
		
		party.inventory.AddItem(Items.SheepMilk);
		party.inventory.AddItem(Items.Ramshorn);
		party.inventory.AddItem(Items.FreshGrass);
		party.inventory.AddItem(Items.Ovis);
		
		party.inventory.AddItem(Items.CowMilk);
		party.inventory.AddItem(Items.CowBell);
		party.inventory.AddItem(Items.FreshGrass);
		party.inventory.AddItem(Items.Bovia);
		
		party.inventory.AddItem(Items.CanisRoot);
		party.inventory.AddItem(Items.DogBone);
		party.inventory.AddItem(Items.DogBiscuit);
		party.inventory.AddItem(Items.Canis);
		
		party.inventory.AddItem(Items.WolfFang);
		party.inventory.AddItem(Items.WolfPelt);
		party.inventory.AddItem(Items.Lobos);
		
		party.inventory.AddItem(Items.FoxBerries);
		party.inventory.AddItem(Items.Foxglove);
		party.inventory.AddItem(Items.Vulpinix);
		
		party.inventory.AddItem(Items.CorruptPlant);
		party.inventory.AddItem(Items.BlackGem);
		party.inventory.AddItem(Items.CorruptSeed);
		party.inventory.AddItem(Items.Infernum);
		
		party.inventory.AddItem(Items.InfernumPlus);
		
		party.inventory.AddItem(Items.Hummus);
		party.inventory.AddItem(Items.BloodVial);
		party.inventory.AddItem(Items.SpringWater);
		party.inventory.AddItem(Items.Homos);
		
		party.inventory.AddItem(Items.Feather);
		party.inventory.AddItem(Items.Trinket);
		party.inventory.AddItem(Items.FruitSeed);
		party.inventory.AddItem(Items.Avia);
		
		party.inventory.AddItem(Items.MAntenna);
		party.inventory.AddItem(Items.MWing);
		party.inventory.AddItem(Items.FruitSeed);
		party.inventory.AddItem(Items.Lepida);
		
		party.inventory.AddItem(Items.Stinger);
		party.inventory.AddItem(Items.SVenom);
		party.inventory.AddItem(Items.SClaw);
		party.inventory.AddItem(Items.Scorpius);
		
		party.inventory.AddItem(Items.Virilium);
		party.inventory.AddItem(Items.Fertilium);
		party.inventory.AddItem(Items.Testos);
		party.inventory.AddItem(Items.Estros);
		
		party.inventory.AddItem(Items.Toys.SmallDildo);
		party.inventory.AddItem(Items.Toys.MediumDildo);
		party.inventory.AddItem(Items.Toys.LargeDildo);
		party.inventory.AddItem(Items.Toys.ThinDildo);
		party.inventory.AddItem(Items.Toys.ButtPlug);
		party.inventory.AddItem(Items.Toys.LargeButtPlug);
		party.inventory.AddItem(Items.Toys.AnalBeads);
		party.inventory.AddItem(Items.Toys.LargeAnalBeads);
		party.inventory.AddItem(Items.Toys.EquineDildo);
		party.inventory.AddItem(Items.Toys.CanidDildo);
		party.inventory.AddItem(Items.Toys.ChimeraDildo);
		
		party.inventory.AddItem(Items.StrapOn.PlainStrapon);
		party.inventory.AddItem(Items.StrapOn.LargeStrapon);
		party.inventory.AddItem(Items.StrapOn.EquineStrapon);
		party.inventory.AddItem(Items.StrapOn.CanidStrapon);
		party.inventory.AddItem(Items.StrapOn.ChimeraStrapon);
		
		party.inventory.AddItem(Items.Combat.DecoyStick);
		
		DEBUG = true;
		
		Gui.NextPrompt();
	}
));
