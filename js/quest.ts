import * as _ from "lodash";

import { GetDEBUG } from "../app";
import { AscheTasksScenes } from "./event/asche-tasks";
import { GlobalScenes } from "./event/global";
import { CaleFlags } from "./event/nomads/cale-flags";
import { VaughnFlags } from "./event/outlaws/vaughn-flags";
import { VaughnTasksScenes } from "./event/outlaws/vaughn-tasks";
import { LeiFlags } from "./event/royals/lei-flags";
import { LeiTaskScenes } from "./event/royals/lei-tasks";
import { TwinsFlags } from "./event/royals/twins-flags";
import { TerryFlags } from "./event/terry-flags";
import { GAME } from "./GAME";
import { Gui } from "./gui";
import { AlchemyItems } from "./items/alchemy";
import { QuestItems } from "./items/quest";
import { IChoice } from "./link";
import { Burrows } from "./loc/burrows";
import { BurrowsFlags } from "./loc/burrows-flags";
import { DryadGladeFlags } from "./loc/glade-flags";
import { RigardFlags } from "./loc/rigard/rigard-flags";
import { Text } from "./text";

let curType: Quests.Type;

export class Quest {
	public name: () => string;
	public desc: () => string;
	public active: (a: Quest) => Quests.Type;
	public list: QuestItem[];

	constructor(opts: any = {}) {
		this.name   = opts.name   || "FAIL";
		this.desc   = opts.desc   || "NO DESC";
		const defActive = () => Quests.Type.NotStarted;
		this.active = opts.active || defActive;
		this.list   = opts.list   || [];
	}

	public Print() {
		const name = _.isFunction(this.name) ? this.name() : this.name;
		Text.Add("<b>" + name + "</b>");
		Text.NL();
		const desc = _.isFunction(this.desc) ? this.desc() : this.desc;
		Text.Add(desc);
		Text.NL();
		const list = this.list;
		if (list.length > 0) {
			Text.Add("<ul>");
			for (const item of list) {
				item.Print();
			}
			Text.Add("</ul>");
		}
	}
	public Active() {
		return this.active(this) & curType;
	}

}

export class QuestItem {
	public desc: () => string;
	public active: () => Quests.Type;
	constructor(opts: any = {}) {
		this.desc   = opts.desc   || "NO DESC";
		this.active = opts.active;
	}

	public Print() {
		const active = this.Active();
		if ((active & Quests.Type.Visible) || GetDEBUG()) {
			Text.Add("<li>");
			if (active & Quests.Type.Completed) {
				Text.Add("<del>");
			}
			if (active & Quests.Type.Failed) {
				Text.Add("<font color ='red'><del>");
			}

			const desc = _.isFunction(this.desc) ? this.desc() : this.desc;
			if (_.isFunction(desc)) {
				desc();
			} else {
				Text.Add(desc);
			}

			if (active & Quests.Type.Completed) {
				Text.Add("</del>");
			}
			if (active & Quests.Type.Failed) {
				Text.Add("</del></font>");
			}
			Text.Add("</li>");
		}
	}
	public Active() {
		return this.active ? this.active() : Quests.Type.Visible;
	}
}

export namespace Quests {
	export enum Type {
		NotStarted = 0,
		Visible    = 1,
		Completed  = 2,
		All        = 3,
		Failed     = 4,
	}
	curType = Type.Visible;

	export const quests: Quest[]  = [];

	export function Print(SetExploreButtons: CallableFunction) {
		let numQs = 0;
		for (const q of Quests.quests) {
			const active = q.Active();
			if (active || GetDEBUG()) {
				numQs++;
				Text.Add("<hr>");
				if (!active) {
					Text.Add("<font color ='gray'>");
				}

				q.Print();

				if (!active) {
					Text.Add("</font>");
				}
			}
		}
		if (numQs > 0) {
			Text.Add("<hr>");
		} else {
			Text.Add("No active quests.", undefined, "bold");
		}
		Text.Flush();

		const options: IChoice[] = [];
		options.push({ nameStr : "Active",
			func() {
				Text.Clear();
				curType = Quests.Type.Visible;
				Quests.Print(SetExploreButtons);
			}, enabled : curType !== Quests.Type.Visible,
		});
		options.push({ nameStr : "Completed",
			func() {
				Text.Clear();
				curType = Quests.Type.Completed;
				Quests.Print(SetExploreButtons);
			}, enabled : curType !== Quests.Type.Completed,
		});
		options.push({ nameStr : "All",
			func() {
				Text.Clear();
				curType = Quests.Type.All;
				Quests.Print(SetExploreButtons);
			}, enabled : curType !== Quests.Type.All,
		});
		Gui.SetButtonsFromList(options, false, undefined);

		SetExploreButtons();
	}

	/*************************
	 * Actual list of quests *
	 *************************/

	// MAIN QUESTS

	quests.push(new Quest({
		name: "Dark Agenda",
		desc() {
			return "Prepare Eden against the coming of Uru.";
		},
		active() {
			let status = Quests.Type.NotStarted;
			status |= Quests.Type.Visible;
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					if ((GAME().rosalin.flags.Met === 0 ||
						GlobalScenes.MagicStage1()) &&
						GAME().jeanne.flags.Met === 0) {
						return "Find someone to help you figure out what the gem does.";
					} else {
						return "Talk with the court magician about the gem and figure out what it does.";
					}
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().jeanne.flags.Met !== 0) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Seek the aid of Mother Tree in the Dryad's Glade, deep within the forest.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					if (GAME().jeanne.flags.Met !== 0) {
						status |= Quests.Type.Visible;
					}
					if (GAME().glade.flags.Visit >= DryadGladeFlags.Visit.DefeatedOrchid) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Meet Jeanne at the mound near the Crossroads in order to activate the gem.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					if (GAME().glade.flags.Visit >= DryadGladeFlags.Visit.DefeatedOrchid) {
						status |= Quests.Type.Visible;
					}
					// TODO
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "The Nomads";
		},
		desc() {
			return "Explore the nomads' camp and talk to it's inhabitants.";
		},
		active(quest: Quest) {
			let complete = true;
			for (const q of quest.list) {
				complete = complete && (q.Active() & Quests.Type.Completed) !== 0;
			}
			let status = Quests.Type.NotStarted;
			if (complete) {
				status |= Quests.Type.Completed;
			} else {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					return "Talk to the leader of the nomads.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().chief.flags.Met !== 0) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Approach the strange alchemist.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().rosalin.flags.Met !== 0) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Perhaps you should check up on that wolf again...";
				},
				active() {
					let status = Quests.Type.NotStarted;
					if (GAME().rosalin.flags.Met !== 0) {
						status |= Quests.Type.Visible;
					}
					if (GAME().cale.flags.Met2 !== CaleFlags.Met2.NotMet) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Approach the hunter.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().estevan.flags.Met !== 0) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Approach the magician.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().magnus.flags.Met !== 0) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			/*, //TODO Patchwork
			new QuestItem({
				desc: function() {
					return "Approach shopkeeper.";
				},
				active: function() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if(GAME().patchwork.flags["Met"] !== 0)
						status |= Quests.Type.Completed;
					return status;
				}
			})
			*/
		],
	}));

	quests.push(new Quest({
		name: "Big City",
		desc() {
			if (GAME().rigard.Access()) {
				return "Get access to the royal grounds.";
			} else {
				return "Find a way inside the city of Rigard. You'll need to get a pass to enter... only question is how to get one.";
			}
		},
		active() {
			const rigard = GAME().rigard;
			let status = Quests.Type.NotStarted;
			if (rigard.RoyalAccess()) {
				status |= Quests.Type.Completed;
			} else if (GlobalScenes.VisitedRigardGates()) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					if (GAME().rigard.Access()) {
						return "Get inside the outer walls.";
					} else {
						return "Get a pass to the city. You could probably get one by gaining the trust of one of the farmers of the plains. Miranda, the guardswoman, is probably also able to help you get one. If all else fails, you've heard that the outlaws in the forest have infiltrated the city... there must be some sort of secret entrance.";
					}
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().rigard.Access()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Find a way to get past the inner walls.";
				},
				active() {
					const rigard = GAME().rigard;
					let status = Quests.Type.NotStarted;
					if (rigard.Access()) {
						status |= Quests.Type.Visible;
					}
					if (rigard.RoyalAccess()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "Seeking Favor";
		},
		desc() {
			return "Investigate the noble couple you saw sneaking out of the inner district. You probably ought to figure out why they were followed.";
		},
		active() {
			const rigard = GAME().rigard;
			let status = Quests.Type.NotStarted;
			if (rigard.RoyalAccess()) {
				status |= Quests.Type.Completed;
			} else if (rigard.flags.RoyalAccessTalk >= 1) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					return "Investigate what became of the noble couple and their stalker. Perhaps seek them at the inn?";
				},
				active() {
					let status = Quests.Type.NotStarted;
					if (GAME().twins.flags.Met >= TwinsFlags.Met.Met) {
						status |= Quests.Type.Completed;
					}
					status |= Quests.Type.Visible;
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Heed the noble couple's request by humiliating Lord Krawitz.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					if (GAME().twins.flags.Met >= TwinsFlags.Met.Met) {
						status |= Quests.Type.Visible;
					}
					if (GAME().rigard.RoyalAccess()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "Shifting the Blame";
		},
		desc() {
			return "Crap, they are on to you. If you don't want to spend the rest of your short life in a cell, you'd better help Miranda catch the thief called the 'Masked Fox'. Before you do, you're not likely to get out of Rigard.";
		},
		active() {
			const rigard = GAME().rigard;
			let status = Quests.Type.NotStarted;
			if (rigard.Krawitz.Q >= RigardFlags.KrawitzQ.CaughtTerry) {
				status |= Quests.Type.Completed;
			} else if (rigard.Krawitz.Q === RigardFlags.KrawitzQ.HuntingTerry) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					return "Find the thief.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().terry.flags.Met >= TerryFlags.Met.Found) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Catch the thief.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().terry.flags.Met >= TerryFlags.Met.Caught) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	// SIDE QUESTS

	quests.push(new Quest({
		name() {
			return "A Guilty Conscience";
		},
		desc() {
			return "You are feeling a bit guilty about the fox currently imprisoned due to your actions. Who knows, he could end up being executed over this, given how the Royal Guard regards morphs in Rigard.";
		},
		active() {
			let status = Quests.Type.NotStarted;
			if (GAME().terry.flags.Saved >= TerryFlags.Saved.Saved) {
				status |= Quests.Type.Completed;
			} else if (GAME().rigard.Krawitz.Q >= RigardFlags.KrawitzQ.CaughtTerry) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					return "Ask around about what's happened to the thief. Who'd have the authority to release him from custody?";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().terry.flags.Saved >= TerryFlags.Saved.TalkedTwins1) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Return to the twins after they have made their arrangements.";
				},
				active() {
					const terry = GAME().terry;
					let status = Quests.Type.NotStarted;
					if (terry.flags.Saved >= TerryFlags.Saved.TalkedTwins1) {
						status |= Quests.Type.Visible;
					}
					if (terry.flags.Saved >= TerryFlags.Saved.TalkedTwins2) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Take custody of the thief from the jail in the royal grounds. It'll be quite interesting to see what effects the collar has...";
				},
				active() {
					const terry = GAME().terry;
					let status = Quests.Type.NotStarted;
					if (terry.flags.Saved >= TerryFlags.Saved.TalkedTwins2) {
						status |= Quests.Type.Visible;
					}
					if (terry.flags.Saved >= TerryFlags.Saved.Saved) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "Mixin' it up!";
		},
		desc() {
			return "Learn about alchemy from Rosalin.";
		},
		active() {
			const rosalin = GAME().rosalin;
			let status = Quests.Type.NotStarted;
			if (rosalin.flags.AlQuest >= 2) {
				status |= Quests.Type.Completed;
			} else if (rosalin.flags.Met !== 0) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					const parse = GAME().rosalin.ParserPronouns();
					return Text.Parse("Ask Rosalin if [heshe] could teach you the secrets of [hisher] trade.", parse);
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().rosalin.flags.AlQuest >= 1) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Retrieve the items that Rosalin requested. You should be able to find them from the lagomorphs near the crossroads. The alchemist asked for <b>lettuce, carrot juice and a rabbit foot charm.</b>";
				},
				active() {
					const item = AlchemyItems.Leporine;
					let enabled = true;
					for (const component of item.recipe) {
						enabled = enabled && (GAME().party.inventory.QueryNum(component.it) >= (component.num || 1));
					}

					const rosalin = GAME().rosalin;
					let status = Quests.Type.NotStarted;
					if (rosalin.flags.AlQuest >= 1) {
						status |= Quests.Type.Visible;
					}
					if (rosalin.flags.AlQuest >= 2 || enabled) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Return the items to Rosalin and learn how to do alchemy.";
				},
				active() {
					const rosalin = GAME().rosalin;
					let status = Quests.Type.NotStarted;
					if (rosalin.flags.AlQuest >= 1) {
						status |= Quests.Type.Visible;
					}
					if (rosalin.flags.AlQuest >= 2) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "Breeding Bunnies";
		},
		desc() {
			return "Help Ophelia with her alchemical experiments in the Burrows. You are not sure this is really a good idea, but Lagon promised to pay you handsomely for your services.";
		},
		active() {
			const burrows: Burrows = GAME().burrows;
			let status = Quests.Type.NotStarted;
			if (burrows.flags.Access >= BurrowsFlags.AccessFlags.Stage3) {
				status |= Quests.Type.Completed;
			} else if (burrows.flags.Access >= BurrowsFlags.AccessFlags.Visited) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					let num = GAME().party.Inv().QueryNum(QuestItems.Cactoid);
					num = num || 0;
					if (GAME().burrows.BruteActive()) {
						return "Bring Ophelia cactoids from the desert: 3/3.";
					} else {
						return Text.Parse("Bring Ophelia cactoids from the desert: [num]/3.", { num });
					}
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().burrows.BruteActive()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					let num = GAME().party.Inv().QueryNum(QuestItems.GolHusk);
					num = num || 0;
					if (GAME().burrows.HermActive()) {
						return "Bring Ophelia Gol husks from the forest: 3/3.";
					} else {
						return Text.Parse("Bring Ophelia Gol husks from the forest: [num]/3.", { num });
					}
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().burrows.HermActive()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					let num = GAME().party.Inv().QueryNum(QuestItems.RedAlgae);
					num = num || 0;
					if (GAME().burrows.BrainyActive()) {
						return "Bring Ophelia red algae from the lake: 3/3.";
					} else {
						return Text.Parse("Bring Ophelia red algae from the lake: [num]/3.", { num });
					}
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().burrows.BrainyActive()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "Search for the Scepter";
		},
		desc() {
			return "Ophelia has asked you to search for Lagon's scepter, possibly the only thing that can help her mother.";
		},
		active() {
			const burrows: Burrows = GAME().burrows;
			let status = Quests.Type.NotStarted;
			if (burrows.flags.Access >= BurrowsFlags.AccessFlags.QuestlineComplete) {
				status |= Quests.Type.Completed;
			} else if (burrows.flags.Access >= BurrowsFlags.AccessFlags.Stage3) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() { // TODO Roa met flag
					return "Find Ophelia's brother, Roa. Your best lead seems to be looking for whorehouses...";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().burrows.flags.Access >= BurrowsFlags.AccessFlags.Stage4) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return GAME().rigard.flags.Scepter === 0 ? "Follow the merchant lead, trail the caravan along the King's Road." : "Follow the merchant lead, probably best to check the merchant street.";
				},
				active() {
					const burrows: Burrows = GAME().burrows;
					let status = Quests.Type.NotStarted;
					if (burrows.flags.Access >= BurrowsFlags.AccessFlags.Stage4) {
						status |= Quests.Type.Visible;
					}
					if (burrows.flags.Access >= BurrowsFlags.AccessFlags.Stage5) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Return the scepter to the Burrows.";
				},
				active() {
					const burrows: Burrows = GAME().burrows;
					let status = Quests.Type.NotStarted;
					if (burrows.flags.Access >= BurrowsFlags.AccessFlags.Stage5) {
						status |= Quests.Type.Visible;
					}
					if (burrows.flags.Access >= BurrowsFlags.AccessFlags.QuestlineComplete) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "Helping Aquilius";
		},
		desc() {
			return "Help Aquilius gather herbs from the forest.";
		},
		active() {
			let status = Quests.Type.NotStarted;
			if (GAME().aquilius.OnHerbsQuest()) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					return "Gather herbs from the forest for Aquilius. You should be able to find them pretty close to the Outlaws’ camp.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().aquilius.OnHerbsQuestFinished()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					const aquilius = GAME().aquilius;
					const item = aquilius.herbIngredient ? aquilius.herbIngredient.sDesc() : "<b>ERROR</b>";
					return "In addition, Aquilius asked for some " + item + ". While not strictly necessary, you’re sure the old surgeon would appreciate you getting that as well.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().party.Inv().QueryNum(GAME().aquilius.herbIngredient)) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Return the herbs to Aquilius in the infirmary.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "Fresh Ginseng";
		},
		desc() {
			return "Help Asche find some fresh Ginseng.";
		},
		active() {
			let status = Quests.Type.NotStarted;
			if (AscheTasksScenes.Ginseng.IsCompleted()) {
				if (AscheTasksScenes.Ginseng.IsSuccess()) {
					status |= Quests.Type.Completed;
				} else if (AscheTasksScenes.Ginseng.IsFail()) {
					status |= Quests.Type.Failed;
				}
			} else if (AscheTasksScenes.Ginseng.IsOn()) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					return "Go to the Highlands on the other side of the plains and search for fresh Ginseng.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (AscheTasksScenes.Ginseng.IsSuccess()) {
						status |= Quests.Type.Completed;
					} else if (AscheTasksScenes.Ginseng.IsFail()) {
						status |= Quests.Type.Failed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Return to Asche in her shop in Rigard.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (AscheTasksScenes.Ginseng.IsCompleted()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "Nightshade";
		},
		desc() {
			return "Help Asche find some nightshade.";
		},
		active() {
			let status = Quests.Type.NotStarted;
			if (AscheTasksScenes.Nightshade.IsCompleted()) {
				status |= Quests.Type.Completed;
			} else if (AscheTasksScenes.Nightshade.IsOn()) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					return "Maybe find someone knowledgeable of forest herbs and ask them where one could find nightshade?";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (AscheTasksScenes.Nightshade.HasHelpFromAquilius()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Go to the Forest and find some nightshade.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (AscheTasksScenes.Nightshade.IsSuccess()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Return to Asche in her shop in Rigard.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (AscheTasksScenes.Nightshade.IsCompleted()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "Spring Time For Asche";
		},
		desc() {
			return "Asche would like you to investigate a highland spring and collect some water for her.";
		},
		active() {
			let status = Quests.Type.NotStarted;
			if (AscheTasksScenes.Spring.IsCompleted()) {
				status |= Quests.Type.Completed;
			} else if (AscheTasksScenes.Spring.IsOn()) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					return "Find the spring in the highlands and collect a sample of its waters.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (AscheTasksScenes.Spring.IsSuccess()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Return to Asche in Rigard with the vial.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (AscheTasksScenes.Spring.IsCompleted()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "Tools of the Trade";
		},
		desc() {
			return "Deliver thieves' tools to Elodie, the outlaw contact in Rigard.";
		},
		active() {
			let status = Quests.Type.NotStarted;
			if (VaughnTasksScenes.Lockpicks.Completed()) {
				status |= Quests.Type.Completed;
			} else if (GAME().vaughn.flags.Met >= VaughnFlags.Met.OnTaskLockpicks) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					return "Meet with Elodie in the castle grounds and deliver Vaughn's tools to her.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().vaughn.flags.Met >= VaughnFlags.Met.LockpicksElodie) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Return to Vaughn and report.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (VaughnTasksScenes.Lockpicks.Completed()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "The Snitch";
		},
		desc() {
			return "Deal with the crooked guardsman that has been giving the outlaws trouble.";
		},
		active() {
			let status = Quests.Type.NotStarted;
			if (VaughnTasksScenes.Snitch.Completed()) {
				status |= Quests.Type.Completed;
			} else if (GAME().vaughn.flags.Met >= VaughnFlags.Met.OnTaskSnitch) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					return "Find a way to deal with the crooked guardsman, Terrell. Vaughn has given you some incriminating evidence that he wants you to plant in the City Watch barracks in Rigard.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().vaughn.flags.Met >= VaughnFlags.Met.SnitchMirandaSuccess) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Return to Vaughn and report.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (VaughnTasksScenes.Snitch.Completed()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "The Lady is Indisposed";
		},
		desc() {
			return "Make sure the Lady Heydrich doesn't appear in court.";
		},
		active() {
			const vaughn = GAME().vaughn;
			let status = Quests.Type.NotStarted;

			if (VaughnTasksScenes.Poisoning.Completed() && !(vaughn.flags.T3 & VaughnFlags.Poisoning.Success)) {
				status |= Quests.Type.Failed;
			} else if (VaughnTasksScenes.Poisoning.Completed()) {
				status |= Quests.Type.Completed;
			} else if (vaughn.flags.Met >= VaughnFlags.Met.OnTaskPoisoning) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					const poison = GAME().vaughn.flags.T3 & VaughnFlags.Poisoning.Aphrodisiac ? "aphrodisiac" : "poison";
					return "Somehow feed Lady Heydrich the " + poison + ". She can be found in the Lady's Blessing inn in Rigard.";
				},
				active() {
					const vaughn = GAME().vaughn;
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if ((vaughn.flags.Met >= VaughnFlags.Met.PoisoningFail) && !(vaughn.flags.T3 & VaughnFlags.Poisoning.Success)) {
						status |= Quests.Type.Failed;
					} else if (vaughn.flags.Met >= VaughnFlags.Met.PoisoningFail) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Return to Vaughn and report.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (VaughnTasksScenes.Poisoning.Completed()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	quests.push(new Quest({
		name() {
			return "Escort Service";
		},
		desc() {
			return "Follow Lei's directions and perform a job for Ventor Orellos.";
		},
		active() {
			let status = Quests.Type.NotStarted;
			if (LeiTaskScenes.Escort.Completed()) {
				status |= Quests.Type.Completed;
			} else if (GAME().lei.flags.Met >= LeiFlags.Met.OnTaskEscort) {
				status |= Quests.Type.Visible;
			}
			return status;
		},
		list: [
			new QuestItem({
				desc() {
					return "Meet with Ventor Orellos at his mansion near the Plaza in Rigard between ten and seventeen. According to Lei, he has a job for you.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (GAME().lei.flags.Met >= LeiFlags.Met.EscortFinished) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
			new QuestItem({
				desc() {
					return "Return to Lei and report.";
				},
				active() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if (LeiTaskScenes.Escort.Completed()) {
						status |= Quests.Type.Completed;
					}
					return status;
				},
			}),
		],
	}));

	// TODO Krawitz(?), Burrows, Gwendy

	/*
	* :

	quests.push(new Quest({
		name: function() {
			return "Seeking favor";
		},
		desc: function() {
			return "Investigate the noble couple you saw sneaking out of the inner district. You probably ought to figure out why they were followed.";
		},
		active: function() {
			let rigard = GAME().rigard;
			let status = Quests.Type.NotStarted;
			if(rigard.RoyalAccess())
				status |= Quests.Type.Completed;
			else if(rigard.flags["RoyalAccessTalk"] >= 1)
				status |= Quests.Type.Visible;
			return status;
		},
		list: [
			new QuestItem({
				desc: function() {
					if(GAME().rigard.Access())
						return "";
					else
						return "";
				},
				active: function() {
					let status = Quests.Type.NotStarted;
					status |= Quests.Type.Visible;
					if(GAME().rigard.Access())
						status |= Quests.Type.Completed;
					return status;
				}
			})
		]
	}));

	*/
}
