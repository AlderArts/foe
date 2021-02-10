import * as _ from "lodash";

import { GetDEBUG, SetDEBUG } from "../app";
import { Kiakai } from "./content/event/kiakai";
import { KiakaiFlags } from "./content/event/kiakai-flags";
import { Player } from "./content/event/player";
import { Cock } from "./engine/entity/body/cock";
import { Vagina } from "./engine/entity/body/vagina";
import { GAME, WORLD } from "./engine/GAME";
import { Item } from "./engine/inventory/item";
import { AlchemyItems } from "./engine/inventory/items/alchemy";
import { AlchemySpecial } from "./engine/inventory/items/alchemyspecial";
import { CombatItems } from "./engine/inventory/items/combatitems";
import { IngredientItems } from "./engine/inventory/items/ingredients";
import { StrapOnItems } from "./engine/inventory/items/strapon";
import { ToysItems } from "./engine/inventory/items/toys";
import { IChoice, Link } from "./engine/navigation/link";
import { Text } from "./engine/parser/text";
import { Gui } from "./gui/gui";

export function InitCheats() {
	const world = WORLD();
	/*
	world.loc.Plains.Nomads.Tent.events.push(new Link(
		"TESTBUTTON", () => GetDEBUG(), true,
		() => {
			Text.Add(Text.Bold("DEBUG: " + "Time"));
			Text.NL();
			Text.Flush();
		},
		() => {
			//Scenes.Golem.FightPrompt();
			StepToHour(13, 14);
		}
	));
	*/

	world.loc.Plains.Nomads.Tent.events.push(new Link(
		"CockSmith", () => GetDEBUG(), true,
		() => {
			if (GetDEBUG()) {
				Text.NL();
				Text.Add(Text.Bold("Mr. Johnson, the cocksmith, is sitting inconspicuously in a corner."));
				Text.NL();
			}
		},
		() => {
			Text.Clear();
			Text.Add("Jolly good to see you chap, what can I do for you?");
			Text.NL();
			Text.Add(Text.Bold("DEBUG: This is a cheat-shop, where you can change your characters body."));
			Text.NL();

			const CockSmith = () => {
				Text.Flush();
				const player: Player = GAME().player;
				const options: IChoice[] = [];
				options.push({ nameStr : "Add cock",
					func() {
						player.body.cock.push(new Cock());
						Text.Add("You gain a cock, giving you " + player.NumCocks());
						Text.NL();
						CockSmith();
					}, enabled : player.NumCocks() < 10,
				});
				options.push({ nameStr : "Lose cock",
					func() {
						player.body.cock.pop();
						Text.Add("You lose a cock, leaving you with " + player.NumCocks());
						Text.NL();
						CockSmith();
					}, enabled : player.NumCocks() >= 0,
				});
				options.push({ nameStr : "Cock+L",
					func() {
						const cocks = player.AllCocks();
						for (const cock of cocks) {
							let inc = 30;
							if (cock.length.Get() <= 50) { inc = 10; }
							if (cock.length.Get() <= 20) { inc = 5; }
							if (cock.length.Get() <= 10) { inc = 1; }
							cock.length.IncreaseStat(200, inc);
						}
						Text.Add("Your cock(s) grow in length, giving you " + player.MultiCockDesc());
						Text.NL();
						CockSmith();
					}, enabled : player.FirstCock() && player.FirstCock().length.Get() < 200,
				});
				options.push({ nameStr : "Cock-L",
					func() {
						const cocks = player.AllCocks();
						for (const cock of cocks) {
							let inc = 30;
							if (cock.length.Get() <= 50) { inc = 10; }
							if (cock.length.Get() <= 20) { inc = 5; }
							if (cock.length.Get() <= 10) { inc = 1; }
							cock.length.DecreaseStat(5, inc);
						}
						Text.Add("Your cock(s) shrink in length, giving you " + player.MultiCockDesc());
						Text.NL();
						CockSmith();
					}, enabled : player.FirstCock() && player.FirstCock().length.Get() > 5,
				});
				options.push({ nameStr : "Cock+T",
					func() {
						const cocks = player.AllCocks();
						for (const cock of cocks) {
							let inc = 10;
							if (cock.thickness.Get() <= 25) { inc = 5; }
							if (cock.thickness.Get() <= 10) { inc = 3; }
							if (cock.thickness.Get() <= 5) {  inc = 1; }
							cock.thickness.IncreaseStat(50, inc);
						}
						Text.Add("Your cock(s) grow in thickness, giving you " + player.MultiCockDesc());
						Text.NL();
						CockSmith();
					}, enabled : player.FirstCock() && player.FirstCock().thickness.Get() < 50,
				});
				options.push({ nameStr : "Cock-T",
					func() {
						const cocks = player.AllCocks();
						for (const cock of cocks) {
							let inc = 10;
							if (cock.thickness.Get() <= 25) { inc = 5; }
							if (cock.thickness.Get() <= 10) { inc = 3; }
							if (cock.thickness.Get() <= 5) { inc = 1; }
							cock.thickness.DecreaseStat(1, inc);
						}
						Text.Add("Your cock(s) shrink in thickness, giving you " + player.MultiCockDesc());
						Text.NL();
						CockSmith();
					}, enabled : player.FirstCock() && player.FirstCock().thickness.Get() > 1,
				});
				options.push({ nameStr : "Add vag",
					func() {
						player.body.vagina.push(new Vagina());
						Text.Add("You gain a vagina");
						Text.NL();
						CockSmith();
					}, enabled : !player.FirstVag(),
				});
				options.push({ nameStr : "Lose vag",
					func() {
						player.body.vagina.pop();
						Text.Add("You lose your vagina");
						Text.NL();
						CockSmith();
					}, enabled : player.FirstVag() !== null,
				});
				options.push({ nameStr : "Add balls",
					func() {
						player.Balls().count.base = 2;
						Text.Add("You gain balls");
						Text.NL();
						CockSmith();
					}, enabled : !player.HasBalls(),
				});
				options.push({ nameStr : "Lose balls",
					func() {
						player.Balls().count.base = 0;
						Text.Add("You lose your balls");
						Text.NL();
						CockSmith();
					}, enabled : player.HasBalls(),
				});
				options.push({ nameStr : "Breasts+",
					func() {
						let inc = 30;
						if (player.FirstBreastRow().size.Get() <= 50) { inc = 10; }
						if (player.FirstBreastRow().size.Get() <= 20) { inc = 5; }
						if (player.FirstBreastRow().size.Get() <= 10) { inc = 1; }
						player.FirstBreastRow().size.IncreaseStat(200, inc);
						Text.Add("Your breasts grow in size, giving you " + player.FirstBreastRow().Short());
						Text.NL();
						CockSmith();
					}, enabled : player.FirstBreastRow().size.Get() < 200,
				});
				options.push({ nameStr : "Breasts-",
					func() {
						let inc = 30;
						if (player.FirstBreastRow().size.Get() <= 50) { inc = 10; }
						if (player.FirstBreastRow().size.Get() <= 20) { inc = 5; }
						if (player.FirstBreastRow().size.Get() <= 10) { inc = 1; }
						player.FirstBreastRow().size.DecreaseStat(1, inc);
						Text.Add("Your breasts shrink in size, giving you " + player.FirstBreastRow().Short());
						Text.NL();
						CockSmith();
					}, enabled : player.FirstBreastRow().size.Get() > 1,
				});
				options.push({ nameStr : "Reset virgin",
					func() {
						player.ResetVirgin();
						Text.Add("You are now a virgin in all the relevant places.");
						Text.NL();
						CockSmith();
					}, enabled : true,
				});
				options.push({ nameStr : "Dom+10",
					func() {
						player.subDom.IncreaseStat(100, 10);
					}, enabled : true,
				});
				options.push({ nameStr : "Dom-10",
					func() {
						player.subDom.DecreaseStat(-100, 10);
					}, enabled : true,
				});
				options.push({ nameStr : "Slut+10",
					func() {
						player.slut.IncreaseStat(100, 10);
					}, enabled : true,
				});
				options.push({ nameStr : "Slut-10",
					func() {
						player.slut.DecreaseStat(-100, 10);
					}, enabled : true,
				});

				Gui.SetButtonsFromList(options, true, Gui.PrintDefaultOptions);
			};

			CockSmith();
		},
	));

	world.loc.Plains.Nomads.Tent.events.push(new Link(
		"ElfCalib", () => GetDEBUG(), true,
		() => {
			if (GetDEBUG()) {
				Text.NL();
				Text.Add(Text.Bold("Inra, the elf calibrator, is sitting in a corner."));
				Text.NL();
			}
		},
		() => {
			const kiakai: Kiakai = GAME().kiakai;
			const k = kiakai.Parser;

			Text.Clear();
			Text.Out(`“Need your elf recalibrated?”

			DEBUG: This is a cheat-shop, where you can modify ${k.name}.

			`);

			const ElfSmith = () => {
				Text.Flush();
				const options: IChoice[] = [];
				options.push({ nameStr : "Attitude",
					func() {
						const options: IChoice[] = [];
						options.push({ nameStr : "Nice",
							func() {
								GAME().party.SwitchIn(kiakai);
								kiakai.flags.Attitude = KiakaiFlags.Attitude.Nice;
								ElfSmith();
							}, enabled : true,
							tooltip : "Be nice to the elf.",
						});
						options.push({ nameStr : "Naughty",
							func() {
								GAME().party.SwitchIn(kiakai);
								kiakai.flags.Attitude = KiakaiFlags.Attitude.Naughty;
								ElfSmith();
							}, enabled : true,
							tooltip : "Be naughty to the elf.",
						});
						options.push({ nameStr : "Dismiss",
							func() {
								GAME().party.RemoveMember(kiakai);
								kiakai.flags.Attitude = KiakaiFlags.Attitude.Neutral;
								ElfSmith();
							}, enabled : true,
							tooltip : "Elf is gone.",
						});
						Gui.SetButtonsFromList(options, true, ElfSmith);
					}, enabled : true,
				});
				options.push({ nameStr : "Relation",
					func() {
						const options: IChoice[] = [];
						options.push({ nameStr : "Rel+10",
							func() {
								kiakai.relation.IncreaseStat(100, 10);
							}, enabled : true,
						});
						options.push({ nameStr : "Rel-10",
							func() {
								kiakai.relation.DecreaseStat(-100, 10);
							}, enabled : true,
						});
						options.push({ nameStr : "Dom+10",
							func() {
								kiakai.subDom.IncreaseStat(100, 10);
							}, enabled : true,
						});
						options.push({ nameStr : "Dom-10",
							func() {
								kiakai.subDom.DecreaseStat(-100, 10);
							}, enabled : true,
						});
						options.push({ nameStr : "Slut+10",
							func() {
								kiakai.slut.IncreaseStat(100, 10);
							}, enabled : true,
						});
						options.push({ nameStr : "Slut-10",
							func() {
								kiakai.slut.DecreaseStat(-100, 10);
							}, enabled : true,
						});
						Gui.SetButtonsFromList(options, true, ElfSmith);
					}, enabled : true,
				});
				options.push({ nameStr : "Body mods",
					func() {
						const ElfSmithBody = () => {
							Text.Flush();
							const options: IChoice[] = [];
							options.push({ nameStr : "Add cock",
								func() {
									kiakai.body.cock.push(new Cock());
									Text.Out(`${k.name} gains a cock, giving ${k.himher} ${kiakai.NumCocks()}.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.NumCocks() < 10,
							});
							options.push({ nameStr : "Lose cock",
								func() {
									kiakai.body.cock.pop();
									Text.Out(`${k.name} lose a cock, leaving ${k.himher} with ${kiakai.NumCocks()}.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstCock() !== undefined,
							});
							options.push({ nameStr : "Cock+L",
								func() {
									const cocks = kiakai.AllCocks();
									for (const cock of cocks) {
										let inc = 30;
										if (cock.length.Get() <= 50) { inc = 10; }
										if (cock.length.Get() <= 20) { inc = 5; }
										if (cock.length.Get() <= 10) { inc = 1; }
										cock.length.IncreaseStat(200, inc);
									}
									Text.Out(`${k.name}'s cock(s) grow in length, giving ${k.himher} ${k.cocks}.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstCock() && kiakai.FirstCock().length.Get() < 200,
							});
							options.push({ nameStr : "Cock-L",
								func() {
									const cocks = kiakai.AllCocks();
									for (const cock of cocks) {
										let inc = 30;
										if (cock.length.Get() <= 50) { inc = 10; }
										if (cock.length.Get() <= 20) { inc = 5; }
										if (cock.length.Get() <= 10) { inc = 1; }
										cock.length.DecreaseStat(5, inc);
									}
									Text.Out(`${k.name}'s cock(s) shrink in length, giving ${k.himher} ${k.cocks}.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstCock() && kiakai.FirstCock().length.Get() > 5,
							});
							options.push({ nameStr : "Cock+T",
								func() {
									const cocks = kiakai.AllCocks();
									for (const cock of cocks) {
										let inc = 10;
										if (cock.thickness.Get() <= 25) { inc = 5; }
										if (cock.thickness.Get() <= 10) { inc = 3; }
										if (cock.thickness.Get() <= 5) {  inc = 1; }
										cock.thickness.IncreaseStat(50, inc);
									}
									Text.Out(`${k.name}'s cock(s) grow in thickness, giving ${k.himher} ${k.cocks}.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstCock() && kiakai.FirstCock().thickness.Get() < 50,
							});
							options.push({ nameStr : "Cock-T",
								func() {
									const cocks = kiakai.AllCocks();
									for (const cock of cocks) {
										let inc = 10;
										if (cock.thickness.Get() <= 25) { inc = 5; }
										if (cock.thickness.Get() <= 10) { inc = 3; }
										if (cock.thickness.Get() <= 5) { inc = 1; }
										cock.thickness.DecreaseStat(1, inc);
									}
									Text.Out(`${k.name}'s cock(s) shrink in thickness, giving ${k.himher} ${k.cocks}.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstCock() && kiakai.FirstCock().thickness.Get() > 1,
							});
							options.push({ nameStr : "Add vag",
								func() {
									kiakai.body.vagina.push(new Vagina());
									Text.Out(`${k.name} gain a vagina.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : !kiakai.FirstVag(),
							});
							options.push({ nameStr : "Lose vag",
								func() {
									kiakai.body.vagina.pop();
									Text.Out(`${k.name} lose ${k.hisher} vagina.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstVag() !== undefined,
							});
							options.push({ nameStr : "Add balls",
								func() {
									kiakai.Balls().count.base = 2;
									Text.Out(`${k.name} gain balls.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : !kiakai.HasBalls(),
							});
							options.push({ nameStr : "Lose balls",
								func() {
									kiakai.Balls().count.base = 0;
									Text.Out(`${k.name} lose ${k.hisher} balls.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.HasBalls(),
							});
							options.push({ nameStr : "Breasts+",
								func() {
									let inc = 30;
									if (kiakai.FirstBreastRow().size.Get() <= 50) { inc = 10; }
									if (kiakai.FirstBreastRow().size.Get() <= 20) { inc = 5; }
									if (kiakai.FirstBreastRow().size.Get() <= 10) { inc = 1; }
									kiakai.FirstBreastRow().size.IncreaseStat(200, inc);
									Text.Out(`${k.name}'s breasts grow in size, giving ${k.himher} ${kiakai.FirstBreastRow().Short()}.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstBreastRow().size.Get() < 200,
							});
							options.push({ nameStr : "Breasts-",
								func() {
									let inc = 30;
									if (kiakai.FirstBreastRow().size.Get() <= 50) { inc = 10; }
									if (kiakai.FirstBreastRow().size.Get() <= 20) { inc = 5; }
									if (kiakai.FirstBreastRow().size.Get() <= 10) { inc = 1; }
									kiakai.FirstBreastRow().size.DecreaseStat(1, inc);
									Text.Out(`${k.name}'s breasts shrink in size, giving ${k.himher} ${kiakai.FirstBreastRow().Short()}.`);
									Text.NL();
									ElfSmithBody();
								}, enabled : kiakai.FirstBreastRow().size.Get() > 1,
							});
							options.push({ nameStr : "Reset virgin",
								func() {
									kiakai.ResetVirgin();
									Text.Add("The elf is now a virgin in all the relevant places.");
									Text.NL();
									ElfSmithBody();
								}, enabled : true,
							});
							Gui.SetButtonsFromList(options, true, ElfSmith);
						};
						ElfSmithBody();
					}, enabled : true,
				});
				Gui.SetButtonsFromList(options, true, Gui.PrintDefaultOptions);
			};
			ElfSmith();
		},
	));

	world.loc.Plains.Nomads.Tent.events.push(new Link(
		"ITEM", () => GetDEBUG(), true,
		() => {
			if (GetDEBUG()) {
				Text.NL();
				Text.Add(Text.Bold("A box of cheaty items."));
				Text.NL();
			}
		},
		() => {
			Text.Clear();
			Text.Add("You pick up some crap.");
			Text.NL();
			Text.Add("<b>Got a fuckton of money</b>");

			GAME().party.coin += 1000;

			Text.NL();
			Text.Add("<b>Got a fuckton of items</b>");

			SetDEBUG(false);

			_(IngredientItems).pickBy((item) => {
				return item instanceof Item;
			}).forOwn((item) => {
				GAME().party.inventory.AddItem(item, 10);
			});

			_(AlchemyItems).pickBy((item) => {
				return item instanceof Item;
			}).forOwn((item) => {
				GAME().party.inventory.AddItem(item, 10);
			});

			_(AlchemySpecial).pickBy((item) => {
				return item instanceof Item;
			}).forOwn((item) => {
				GAME().party.inventory.AddItem(item, 10);
			});

			_(ToysItems).pickBy((item) => {
				return item instanceof Item;
			}).forOwn((item) => {
				GAME().party.inventory.AddItem(item, 10);
			});

			_(StrapOnItems).pickBy((item) => {
				return item instanceof Item;
			}).forOwn((item) => {
				GAME().party.inventory.AddItem(item, 10);
			});

			_(CombatItems).pickBy((item) => {
				return item instanceof Item;
			}).forOwn((item) => {
				GAME().party.inventory.AddItem(item, 10);
			});

			SetDEBUG(true);

			Text.Flush();
			Gui.NextPrompt();
		},
	));
}
