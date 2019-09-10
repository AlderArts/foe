import * as _ from "lodash";

import { EncounterTable } from "../../encountertable";
import { Entity } from "../../entity";
import { Event, Link } from "../../event";
import { DreamsScenes } from "../../event/dreams";
import { VaughnTasksScenes } from "../../event/outlaws/vaughn-tasks";
import { Room69Scenes } from "../../event/room69";
import { Room69Flags } from "../../event/room69-flags";
import { LeiFlags } from "../../event/royals/lei-flags";
import { LeiScenes } from "../../event/royals/lei-scenes";
import { TwinsScenes } from "../../event/royals/twins";
import { TwinsFlags } from "../../event/royals/twins-flags";
import { GAME, MoveToLocation, TimeStep, WORLD, WorldTime } from "../../GAME";
import { GameState, SetGameState } from "../../gamestate";
import { Gui } from "../../gui";
import { ILocRigardInn } from "../../location";
import { Party } from "../../party";
import { Status } from "../../statuseffect";
import { Text } from "../../text";
import { Season, Time } from "../../time";
import { RigardFlags } from "./rigard-flags";

export function InitLB() {
	const world = WORLD();
	world.SaveSpots.LB = InnLoc.Room;
	world.SaveSpots.LB2 = InnLoc.Penthouse;
}

let efriaction: string;

const InnLoc: ILocRigardInn = {
	Common    : new Event("Lady's Blessing"),
	Backroom  : new Event("Back room"),
	Cellar    : new Event("Cellar"),
	Room      : new Event(() => {
		const rigard = GAME().rigard;
		return "Room " + rigard.LB.RoomNr;
	}),
	Room69    : new Event("Room 369"),
	Penthouse : new Event("Penthouse"),
};

//
// Bar
//
InnLoc.Common.description = () => {
	Text.Add("You are in the Lady's Blessing's main room.");
	Text.NL();
	Text.Flush();
};

InnLoc.Common.links.push(new Link(
	"Outside", true, true,
	undefined,
	() => {
		MoveToLocation(WORLD().loc.Rigard.Plaza);
	},
));

InnLoc.Common.links.push(new Link(
	"Penthouse", () => {
		const twins = GAME().twins;
		return twins.flags.Met >= TwinsFlags.Met.Access;
	}, true,
	undefined,
	() => {
		MoveToLocation(InnLoc.Penthouse, {minute: 5});
	},
));

// Twins' room
InnLoc.Penthouse.SaveSpot = "LB2";
InnLoc.Penthouse.safe = () => true;
InnLoc.Penthouse.description = () => {
	Text.Add("You are in the Lady's Blessing's penthouse.");
	Text.NL();
	Text.Flush();
};
InnLoc.Penthouse.links.push(new Link(
	"Downstairs", true, true,
	undefined,
	() => {
		MoveToLocation(InnLoc.Common, {minute: 5});
	},
));
InnLoc.Penthouse.events.push(new Link(
	"Twins", true, true,
	undefined,
	() => {
		TwinsScenes.Interact();
	},
));

/* TODO: Keep?
InnLoc.common.links.push(new Link(
	"Backroom", true, false,
	() => {
		Text.Add("Go backroom?<br>");
	},
	() => {
		MoveToLocation(InnLoc.backroom);
	}
));
InnLoc.common.links.push(new Link(
	"Cellar", true, false,
	() => {
		Text.Add("Go cellar?<br>");
	},
	() => {
		MoveToLocation(InnLoc.cellar);
	}
));
*/

InnLoc.Common.endDescription = () => {
	const rigard = GAME().rigard;
	const player = GAME().player;

	if (rigard.Krawitz.Q < RigardFlags.KrawitzQ.HeistDone) {
		Text.Add("You see the daintily attractive vixen-morph hard at work cleaning up the various dishes and tankards left behind by previous customers. She scurries ceaselessly back and forth, gathering dirty kitchenware and conveying it to the kitchens, only to return for a fresh load.");
		if (player.Int() > 30) {
			Text.NL();
			Text.Add("Your keen eyes spot that, though she feigns politely ignoring the people around her as one would expect of a maid, her ears visibly yet stealthily prick up whenever she approaches or passes by a group of patrons talking. She's definitely listening in on the people around her. Perhaps there is more to this vixen than meets the eye...");
		}
	}
	Text.Flush();

	if (VaughnTasksScenes.Poisoning.InnAvailable()) {
		VaughnTasksScenes.Poisoning.ArrivalAtInn(true);
	}
};

// TODO: Companion reactions?
InnLoc.Common.DrunkHandler = () => {
	const parse: any = {};
	const busy = RigardFlags.LB.Busy();
	parse.busy = busy === RigardFlags.LB.BusyState.busy ? "few places" : "spot";
	Text.Clear();
	Text.Add("You open your eyes with some effort and find yourself in the Lady’s Blessing recovery room. The air smells of pine, and you see a [busy] where the floor looks to have been recently scrubbed. ‘Recovery Room’ written on one of the walls.", parse);
	Text.NL();
	Text.Add("You gingerly get to your feet, and make your way toward the door, careful to keep your motions slow to avoid provoking your headache. Some of the decisions that led you to this state were probably not the best. Still, there’s a dark whisper in your mind asking if perhaps you’d feel better if you had just one more drink...", parse);
	Text.Flush();
	Gui.NextPrompt();
};

InnLoc.Common.onEntry = (preventClear: boolean, oldLocation: any) => {
	const rigard = GAME().rigard;
	const player = GAME().player;
	const party: Party = GAME().party;

	if (VaughnTasksScenes.Poisoning.InnAvailable()) {
		VaughnTasksScenes.Poisoning.ArrivalAtInn(false, oldLocation);
		return;
	}

	Text.Clear();
	const busy = RigardFlags.LB.Busy();
	const first = rigard.LB.Visit === 0;
	if (first) {
		rigard.LB.Visit = 1;

		Text.Add("You head over to the Lady’s Blessing inn. It is a large, four-story building, with a clean, blue-and-orange facade, painted to suggest the rays of a setting sun over some body of water. Large windows of tinted blue glass face the street, ");
		if (WorldTime().hour >= 6 && WorldTime().hour < 20) {
			Text.Add("letting light flood in, lending the chamber a bright cheerful appearance.");
		} else {
			Text.Add("letting copious candlelight spill out into the dark street.");
		}
		Text.NL();
		Text.Add("Before its entrance hangs a sign showing a scantily dressed woman, who you assume is supposed to be Aria, her hands spread in a welcoming gesture. Apparently, it being one of the nicer inns in town doesn’t stop it from relying on sex appeal.");
		Text.NL();

	}
	Text.Add("As you push open the door and enter, ");
	if (busy === RigardFlags.LB.BusyState.busy) {
		Text.Add("you hear music and snatches of song coming from a group of minstrels playing in the corner, almost lost under the chatter of people in the busy bar. The large room is filled nearly to capacity with easily a hundred patrons sitting, eating, drinking, and playing.");
	} else if (busy === RigardFlags.LB.BusyState.midbusy) {
		Text.Add("you see that the bar is not very busy right now. The large room seems almost empty with so few people, although there must still be at least a score of patrons eating, drinking, and chatting together.");
	} else {
		Text.Add("you see that the bar is nearly abandoned. Most of the candles are out, and there are only a few patrons scattered around the room eating cold food at this hour.");
	}
	Text.NL();
	Text.Add("At the left side of the common room, you see stairs leading up to the rooms on the next floor. Assorted tables are scattered around the room. Most are sized to seat only a few people so that they may enjoy a meal on their own, but a few are large enough for bigger groups, perhaps meant for gaming.");
	Text.NL();
	Text.Add("The room as a whole is pristine, kept perfectly clean despite the daily spills of drink and dropped food that are an inevitable occurrence in such a busy bar.");

	if (first) {
		const parse: any = {
			sir : player.mfFem("sir", "ma’am"),
		};
		Text.NL();
		Text.Add("A petite vixen wearing a maid’s uniform approaches you. She stands at about five foot five, her fur an orange-tinted gold with predominant white marking. Though her uniform does a nice job of preserving her modesty and hiding her curves, you can see she’s rounded in all the right places. She has a pair of soft-looking cushions adorning her bosom, and she walks with just a slight sway in her gait. Her cute triangular ears turn this way and that before focusing on you.", parse);
		Text.NL();
		Text.Add("<i>“Welcome to the Lady’s Blessing, [sir],”</i> she greets you with a bow and a collected smile. ", parse);
		if (party.NumTotal() === 1) {
			parse.comp = "";
		} else if (party.NumTotal() === 1) {
			parse.comp = " and your friend";
		} else {
			parse.comp = " and your friends";
		}
		if (busy === RigardFlags.LB.BusyState.busy) {
			Text.Add("<i>“We’re a bit crowded right now, but if you[comp] would accompany me, I’ll have you seated momentarily,”</i> she bows.", parse);
			Text.NL();
			Text.Add("You thank her for the hospitality and follow her as she leads you through a maze of tables and busy waiters, finally finding an empty table to sit you down. As you do so, she picks up a cloth, wiping the table clean of any lingering dirt from the previous patrons.", parse);
		} else if (busy === RigardFlags.LB.BusyState.midbusy) {
			Text.Add("<i>“We have plenty tables to accommodate you[comp]. Please, follow me,”</i> she bows.", parse);
			Text.NL();
			Text.Add("You thank her for the hospitality and follow her as she leads you past a few tables and the occasional busy waiter. Once you’re seated, she picks up a cloth and wipes the table clean of any lingering dirt left by the previous patrons.", parse);
		} else {
			Text.Add("<i>“Please follow me and I’ll have you[comp] seated momentarily,”</i> she bows.", parse);
			Text.NL();
			Text.Add("You thank her for the hospitality, following her to an empty table nearby. Once you’ve been seated, she takes a cloth and wipes the table clean of any lingering dirt left by the previous patrons.", parse);
		}
		Text.NL();
		parse.selfSelves = party.NumTotal() > 1 ? "selves" : "self";
		Text.Add("<i>“Make your[selfSelves] at home. If you would like to order food, just wave one of the waiters over, and if you’re looking for drinks or a room, you can talk to my boss over at the bar. Enjoy your stay,”</i> she bows with a smile before leaving you to clean up after a couple guests.", parse);
	}

	Text.NL();
	if (busy === RigardFlags.LB.BusyState.busy) {
		Text.Add("With some difficulty, you manage to find an empty table, and sit down");
	} else {
		Text.Add("You pick out a table by the bar, and sit down");
	}
	if (party.Two()) {
		Text.Add(" together with [p1name].", {p1name : party.Get(1).name});
	} else if (!party.Alone()) {
		Text.Add(" together with your companions.");
	} else {
		Text.Add(".");
	}
	Text.NL();
	Text.Flush();

	Gui.PrintDefaultOptions(true);
};

// SCENES
export namespace LBScenes {

	export function OrderFood() {
		const rigard = GAME().rigard;
		const player = GAME().player;
		const party: Party = GAME().party;

		const parse: any = {
			sirmadam : player.mfFem("sir", "madam"),
			dname : rigard.LB.Efri === 0 ? "the girl" : "Efri",
		};
		const randW = Math.random() * 5;
		if (randW < 1) {
			parse.waiterDesc = "Your waitress is a tall pretty, but strong-looking, woman with long auburn hair, and a decorative silver necklace around her neck.";
			parse.HeShe = "She";
			parse.heshe = "she";
		} else if (randW < 2) {
			parse.waiterDesc = "Your waiter is a stocky, but kind-looking, middle aged man, who smiles cheerfully at all around him.";
			parse.HeShe = "He";
			parse.heshe = "he";
		} else if (randW < 3) {
			parse.waiterDesc = "Your waitress is a petite woman with short black hair, and a stoic expression on her face.";
			parse.HeShe = "She";
			parse.heshe = "she";
		} else if (randW < 4) {
			parse.waiterDesc = "Your waitress is a matronly woman with graying hair and slightly stooped posture. Smile wrinkles adorn the corners of her mouth, and she looks at the customers beneficently.";
			parse.HeShe = "She";
			parse.heshe = "she";
		} else {
			parse.waiterDesc = "Your waiter is a tall elegant man, who exudes politeness and style, hiding any feelings he might have behind an expressionless mask.";
			parse.HeShe = "He";
			parse.heshe = "he";
		}

		const busy = RigardFlags.LB.Busy();

		const p1 = party.Get(1);
		if (p1) {
			parse.p1name   = p1.name;
			parse.p1himher = p1.himher();
		}

		Text.Clear();

		// Nighttime
		if (busy === RigardFlags.LB.BusyState.notbusy) {
			Text.Add("You approach [dname] at the bar and ask if you can get some food.", parse);
			Text.NL();
			Text.Add("“The kitchen’s closed at this hour, so we can only offer you leftovers,” she explains. “They’re pretty delicious leftovers, though.”", parse);
			Text.NL();
			if (party.NumTotal() === 2) {
				parse.comp  = " and " + p1.name;
				parse.comp2 = " and " + p1.possessive();
			} else if (party.NumTotal() > 2) {
				parse.comp  = " and your companions";
				parse.comp2 = " and your companions’";
			} else {
				parse.comp  = "";
				parse.comp2 = "";
			}
			Text.Add("You nod your acceptance, and she sends the waiter to get you[comp] something, as she counts your[comp2] coins.", parse);
			Text.NL();
			Text.Add("The waiter quickly returns with your meal. It’s cold potatoes, rice, meat, and vegetables from the day’s cooking piled high on a plate. The temperature is a bit unappetizing, but once you start eating you find that the high quality of the cooking more than makes up for it. And you get more than you usually would for the price besides.", parse);
			Text.NL();
			Text.Add("You finish the meal gladly, and set the dishes aside. That was quite filling, but, still, it is time to be on your way.", parse);

			Text.Flush();
			TimeStep({minute: 35});
			party.coin -= RigardFlags.LB.MealCost();
			Gui.NextPrompt();
			return;
		}

		if (busy === RigardFlags.LB.BusyState.busy) {
			Text.Add("You catch the attention of one of the busy waiters as [heshe]’s passing by, and [heshe] approaches your table.", parse);
		} else {
			Text.Add("You wave at the idly chatting waiters, and one of them walks over to you.", parse);
		}
		Text.Add(" [waiterDesc]", parse);
		Text.NL();
		Text.Add("[HeShe]’s wearing a pristine black-and-white uniform with subtle frills along the cuffs, and a small picture of Aria embroidered on the lapel.", parse);
		Text.NL();
		Text.Add("<i>“What can I do for you today, [sirmadam]?”</i> [heshe] asks. [HeShe] mentions some of the dishes and drinks they are serving today, and you feel your mouth watering slightly at the delicious offerings.", parse);
		Text.NL();

		LBScenes.FoodGet();

		Text.Add(" Still, you have other things to get back to. Reluctantly setting the dishes aside, you pay for your meal", parse);
		if (party.Two()) {
			Text.Add(", and, after [p1name] pays for [p1himher]self", parse);
		} else if (!party.Alone()) {
			Text.Add(", and, after your companions pay for themselves", parse);
		}
		Text.Add(", get ready to go on your way.", parse);

		Text.NL();
		Text.Add("You feel full. The good food makes you think you can better focus on learning new things.", parse, "bold");

		_.each(party.members, (ent) => {
			Status.Full(ent, {hours: 12, exp: 1.1});
		});

		Text.Flush();
		TimeStep({minute: 35});
		party.coin -= RigardFlags.LB.MealCost();

		Gui.NextPrompt();
	}

	export function FoodGet() {
		const party: Party = GAME().party;

		const parse: any = {};
		if (party.Two()) {
			const p1 = party.Get(1);
			parse.p1name = p1.name;
			parse.p1himher = p1.himher();
		}
		parse.foodName = () => {
			const locs = [
			"Highlands",
			"Orsineau",
			"Rirvale",
			"Oasis",
			"Royal",
			];
			const styles = [
			"sauteed",
			"baked",
			"poached",
			"steamed",
			"stewed",
			"broiled",
			"grilled",
			"fried",
			"deep fried",
			"stir fried",
			"roasted",
			"smoked",
			];
			const mainFoods = [
			"porcino mushrooms",
			"chicken breasts",
			"chicken wings",
			"chicken legs",
			"brisket beef",
			"topside beef",
			"rump beef",
			"sirloin pork",
			"pork cutlets",
			"shoulder blade ham",
			"vegetable mix",
			"eggplant",
			"fish filet",
			"salmon",
			];
			const sides = [
			"potato puree",
			"baked potatoes",
			"fried potatoes",
			"white rice",
			"fried rice",
			"cauliflower rice",
			"pan-fried noodles",
			"spaghetti and cheese",
			"steamed string beans",
			"spaghetti squash",
			"fried onions and vegetables",
			];
			const loc = locs[Math.floor(Math.random() * locs.length)];
			const style    = styles[Math.floor(Math.random() * styles.length)];
			const mainFood = mainFoods[Math.floor(Math.random() * mainFoods.length)];
			const side     = sides[Math.floor(Math.random() * sides.length)];

			return loc + " " + style + " " + mainFood + " with a side of " + side;
		};

		Text.Add("Thinking about it for a few moments, you settle on [foodName]", parse);
		if (party.Two()) {
			Text.Add(", and [p1name] makes an order for [p1himher]self", parse);
		} else if (!party.Alone()) {
			Text.Add(", and your companions make orders for themselves", parse);
	}
		Text.Add(". You are relieved to find that you do not have to wait long, as the food arrives after only a few minutes. The dish smells - and tastes - delicious, and you happily indulge in the meal,", parse);

		if (!party.Alone()) {
			Text.Add(" making only light conversation with [comp],", {comp() { return party.Two() ? parse.p1name : "your companions"; }});
		}

		Text.Add(" delighted by the high quality.", parse);
		Text.NL();
		Text.Add("When you are done, you find yourself both remarkably sated and wishing for more of the great cooking.");
	}

	export function OrvinPrompt() {
		const rigard = GAME().rigard;
		const player = GAME().player;
		const party: Party = GAME().party;

		const parse: any = {
			sirmadam : player.mfFem("sir", "madam"),
			roomPrice : Text.NumToText(RigardFlags.LB.RoomCost()),
			IkName   : !RigardFlags.LB.KnowsOrvin() ? "The innkeeper" : "Orvin",
			ikname   : !RigardFlags.LB.KnowsOrvin() ? "the innkeeper" : "Orvin",
		};

		const busy = RigardFlags.LB.Busy();

		Text.Clear();
		if (busy === RigardFlags.LB.BusyState.busy) {
			Text.Add("[IkName] masterfully pours and mixes differently colored liquids, passing them to waiting staff, who deliver them around the room. Even with the inn filled to the brim with customers, he seems to be effortlessly keeping up with demand, and occasionally chats with customers while distributing drinks.", parse);
			Text.NL();
			Text.Add("You decide he probably wouldn’t mind if you went over and talked to him.", parse);
		} else {
			Text.Add("[IkName] sits on a stool behind the counter, looking bored. You decide he might welcome the distraction if you went over and talked to him.", parse);
		}
		Text.NL();
		parse.busyText = (busy === RigardFlags.LB.BusyState.busy) ? "the drinks dancing through his hands" : "handling the drinks he so often mixes";
		Text.Add("You can’t quite tell the man’s age, but he seems to be well within his prime. There are a few streaks of gray in his dark brown hair, but his face is unlined, and his gaze attentive as he surveys the room. He’s wearing a black vest over a white shirt, which somehow remains spotless despite [busyText].", parse);
		Text.NL();
		Text.Add("<i>“What can I do for you, [sirmadam]?”</i> he asks, his voice low and gravelly, turning toward you at your approach.", parse);
		Text.Flush();

		const innPrompt = () => {
			const options = new Array();
			options.push({ nameStr : "Talk",
				func() {
					Text.Clear();
					if (!RigardFlags.LB.KnowsOrvin()) {
						Text.Add("You tell him that you’d like to get to know a bit more about him and the inn.", parse);
						Text.NL();
						Text.Add("<i>“How polite of you,”</i> he remarks. <i>“I am Orvin, the proprietor of this inn, and there is not much more to tell. My great-grandmother built the original establishment, and it’s been in my family ever since, although we’ve remodelled the building a few times over the generations. I’ve been dealing with the management of the inn ever since I was little, so I know my way around.”</i>", parse);
						Text.NL();
						Text.Add("<i>“But you don’t look like the type to make idle conversation. Did you want to ask about something specific?”</i>", parse);

						rigard.LB.Orvin = 1;
					} else {
						Text.Add("You tell him that you’d like to talk to him.", parse);
						Text.NL();
						Text.Add("<i>“I have a few minutes to spare,”</i> Orvin says. <i>“Did you want to ask something specific?”</i>", parse);
					}
					Text.Flush();

					LBScenes.OrvinTalkPrompt(innPrompt);
				}, enabled : true,
				tooltip : "Chat with the innkeeper.",
			});
			options.push({ nameStr : "Room",
				func() {
					Text.Clear();

					/*
					// TODO: #if broke door and have not made up with 69
					Text.Add("<i>“Look, I told you,”</i> [ikname] tells you, looking surly, <i>“until you’ve apologized to Sixtynine, I’m not letting you a room. No amount of talk with me will change that.”</i>", parse);
					Text.NL();
					*/

					Text.Add("You ask [ikname] what it would cost to stay here for a day.", parse);
					Text.NL();
					if (WorldTime().hour >= 9 && WorldTime().hour < 12) {
						Text.Add("<i>“Sorry, our staff are cleaning the rooms right now. We start letting rooms at noon, and let them for the full day and night until noon of the following day.", parse);
					} else {
						Text.Add("<i>“We let rooms until noon of the following day.", parse);
					}
					Text.Add(" The daily rate is [roomPrice] coins, and includes a complimentary meal.”</i>", parse);
					if (party.NumTotal() > 4) {
						Text.NL();
						Text.Add("You glance over at your companions, and they nod, agreeing to chip in for additional rooms if you decide to book one.", parse);
					} else if (party.NumTotal() > 2) {
						Text.NL();
						Text.Add("You glance over at your companions, and they nod, agreeing to chip in for a second room if you decide to book one.", parse);
					}
					Text.Flush();

					if (WorldTime().hour >= 9 && WorldTime().hour < 12) {
						Gui.NextPrompt();
					} else {
						const options = new Array();
						options.push({ nameStr : "Rent room",
							func() {
								Text.Clear();

								let roomNumber = (Math.floor(Math.random() * 3) + 2) * 100;
								if (roomNumber === 400) {
									roomNumber += Math.floor(Math.random() * 8);
								} else {
									roomNumber += Math.floor(Math.random() * 16);
								}
								rigard.LB.RoomNr = roomNumber;

								parse.randomnumber = roomNumber;

								Text.Add("You agree to the price, and hand over [roomPrice] coins. ", parse);
								if (party.NumTotal() > 4) {
									Text.Add("Your companions chip in and rent additional rooms close to yours. ", parse);
								} else if (party.NumTotal() > 2) {
									Text.Add("Your companions chip in and rent a second room close to yours. ", parse);
								}
								Text.Add("[IkName] hands you the key to room [randomnumber] and gives you directions to finding the chamber.", parse);
								Text.NL();
								Text.Add("You decide to eat the meal right away. ", parse);

								LBScenes.FoodGet();

								Text.Add(" You set the dishes aside reluctantly, and get ready to go on your way.", parse);
								Text.NL();
								const date = new Time();
								date.Inc(WorldTime());
								date.Inc({hour : 24});
								parse.Date = date.DateStringShort();
								parse.Time = date.hour + ":00";
								Text.Add("Your room will be available until [Time] on [Date].", parse);

								rigard.LBroomTimer = new Time();
								rigard.LBroomTimer.Inc({hour: 24});

								party.coin -= RigardFlags.LB.RoomCost();
								Text.Flush();
								Gui.NextPrompt();
							}, enabled : party.coin >= RigardFlags.LB.RoomCost(),
							tooltip : "Rent a room for " + RigardFlags.LB.RoomCost() + " coins.",
						});
						options.push({ nameStr : "Don't",
							func() {
								Text.Clear();
								Text.Add("You thank [ikname] for the information and tell him that perhaps you’ll need a room some other time.", parse);
								Text.NL();
								Text.Flush();
								Gui.NextPrompt();
							}, enabled : true,
							tooltip : "Don’t rent a room.",
						});
						Gui.SetButtonsFromList(options);
					}
				}, enabled : rigard.LBroomTimer.Expired(),
				tooltip : Text.Parse("Ask [ikname] about the pricing for rooms.", parse),
			});
			options.push({ nameStr : "Drink",
				func() {
					Text.Clear();
					parse.todaytonight = WorldTime().hour >= 17 || WorldTime().hour < 4 ? "tonight" : "today";
					Text.Add("You ask [ikname] what drinks he has on offer [todaytonight].", parse);
					Text.NL();
					Text.Add("<i>“We have a lot in stock,”</i> he explains, <i>“but I try to only have a few things on tap at a time. Makes it neater. Let’s see, for today, it’s...”</i>", parse);

					LBScenes.DrinksPrompt(innPrompt);

					Text.NL();
					Text.Add("<i>“And that’s it. Anything to your taste?”</i>", parse);
					Text.Flush();
				}, enabled : true,
				tooltip : Text.Parse("Ask [ikname] what drinks he has on offer.", parse),
			});

			/*
			options.push({ nameStr : "Nah",
				func : () => {
					Text.Clear();
					Text.Add("", parse);
					Text.NL();
					Text.Flush();
				}, enabled : true,
				tooltip : ""
			});
			*/

			Gui.SetButtonsFromList(options, true);
		};
		innPrompt();
	}

	export function OrvinTalkPrompt(innPrompt: CallableFunction) {
		const rigard = GAME().rigard;
		const terry = GAME().terry;
		const room69 = GAME().room69;
		const lei = GAME().lei;
		const party: Party = GAME().party;

		let parse: any = {

		};

		const busy = RigardFlags.LB.Busy();

		const options = new Array();
		// Various info about the inn
		options.push({ nameStr : "Inn",
			func() {
				Text.Clear();

				Text.Add("You ask Orvin to tell you a little more about the inn.");
				Text.NL();

				const scenes = [];

				// Long
				scenes.push(() => {
					Text.Add("<i>“When I was young, my great-grandmother told me the story of how she came to found this inn. She said that one year, when she was only fifteen, there was a particularly bad harvest at her family’s farm. They tallied up their stocks and saw there was not be enough food for them all to make it through the winter.”</i>", parse);
					Text.NL();
					Text.Add("<i>“She decided then that she would leave the farmstead to give her family a better chance. Not knowing where to go, she decided to make her way to the shrine of Lady Aria and ask for their help. They had no more room for novices at the time, but they let her stay on to help with cooking and cleaning.”</i>", parse);
					Text.NL();
					Text.Add("<i>“They paid her well and took care of her, and she, in turn, loved them for the saving her when she needed help. After working hard for four years, she had some money saved up, and, though she liked working at the shrine, she knew she wanted much more from her life. She wanted to see the city and make an inn, to provide for those who, however briefly, were without a home of their own. She thought it would take her many more years to get enough money together, but she was determined to achieve her goal.”</i>", parse);
					Text.NL();
					Text.Add("<i>“It turned out, however, that she had come to the attention of the high priestess thanks to her hard work and dedication. As a special sign of gratitude, the priestess lent my great-grandmother the sum she needed to purchase the land and begin the construction.”</i>", parse);
					Text.NL();
					Text.Add("<i>“In thanks for everything the priesthood had done for her, my great-grandmother named the inn ‘Lady’s Blessing’.”</i>", parse);
				});
				// Long
				scenes.push(() => {
					Text.Add("<i>“My father came up with the idea of adding the gaming tables,”</i> he explains. <i>“They don’t bring us any revenue directly, but they draw gamblers, and they’re always happy to order drink. Best of all, if someone wins big, they order everyone a round, which makes for quite a neat little profit.”</i> He smiles broadly, making a joke of the mercantile remark.", parse);
					Text.NL();
					Text.Add("<i>“I don’t really care what they play over there, but most of them seem to have settled on Cavalcade. It’s a pretty simple game - you get two cards in hand, while three are put down and shared on the table. Whoever can make the best combo wins. Most people here play for small stakes, but I hear there are some more serious games going on in the city, if you’re interested.”</i>", parse);
				});
				// Long
				scenes.push(() => {
					if (WorldTime().hour >= 17) {
						Text.Add("<i>“We’ve had music here ", parse);
					} else {
						Text.Add("<i>“We have music every day here in the evenings. Had it ", parse);
					}
					Text.Add("ever since the very beginning. Used to just invite traveling bards in whenever they were reasonable about the price. Or so I’m told,”</i> he clarifies, smiling. <i>“Back when my father was still young, however, we started hiring performers to play here full-time.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Sometimes they find something better and move on, other times they stay for decades. The latest group has been here for, oh, almost four years now, and they seem to be doing pretty well. You should go over and listen to them if you have the time.”</i>", parse);
				});
				// Long
				scenes.push(() => {
					Text.Add("<i>“The job of running the inn has stayed in the family ever since the beginning - I do think it’s in our blood. It hasn’t always been passed on to to the eldest child, or the most talented, but to the one that has the most determination to succeed and the most passion for running Lady’s Blessing.”</i>", parse);
					Text.NL();
					Text.Add("<i>“The task passed from great-grandmother, to grandfather, to father, and then to me almost twenty years ago. It hasn’t always been easy. There have been high times and there have been low...”</i>", parse);
					Text.NL();
					Text.Add("<i>“My wife passed away eleven years ago, so now there’s only my daughter Efri to succeed me.”</i> Orvin keeps his voice steady, but you see his face sink with lasting sadness. <i>“Fortunately, she’s a good girl! She works hard, and I’m sure she’ll do a better job than I’ve ever managed!”</i>", parse);
				});
				// Long
				scenes.push(() => {
					Text.Add("<i>“We have some decent wines on Eden, but all the really superb ones used to come from off-world. We just don’t have the best weather for cultivation, and not very many people are interested either, compared to some of the other worlds out there...”</i> Orvin looks dejected explaining this.", parse);
					Text.NL();
					Text.Add("<i>“There are still some off-world wines left around, but their prices have climbed and climbed. Only the nobles and the very well-off merchants can afford them, and it doesn’t pay for me to serve them outside of special occasions. Still, the local stuff isn’t <b>so</b> bad. At least if it’s served unwatered, as it is here.”</i>", parse);
				});

				let sceneId = rigard.RotOrvinInnTalk;
				if (sceneId >= scenes.length) { sceneId = 0; }

				rigard.RotOrvinInnTalk = sceneId + 1;

				// Play scene
				scenes[sceneId]();

				Text.Flush();

				LBScenes.OrvinTalkPrompt(innPrompt);
			}, enabled : true,
			tooltip : "Ask him about the inn.",
		});
		if (rigard.LB.CityTalk === 0) {
			options.push({ nameStr : "City",
				func() {
					Text.Clear();
					Text.Add("You tell Orvin you’re new to the city and ask if there’s anything he can tell you about it.", parse);
					Text.NL();
					Text.Add("<i>“I work and live in the inn, so I don’t get to see it all that often in person,”</i> he says. <i>“My customers and staff do talk, however, and I hear all sorts of interesting things.”</i>", parse);
					Text.NL();
					Text.Add("<i>“In my youth, many thought the city unsafe, and then there was the war... Compared to that, things have been much more relaxed recently. Well, for everyone who comes to drink here, at least. Rigard has grown safer and quieter over the decades, so far as I can tell.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Though in the last year or two it’s been going downhill again, I’m afraid to say. Merchants are grumbling that their caravans vanish outside the city, nobles that the king is demanding more and more from them, supposedly to fight the outlaws, and the common people that the Royal Guard abuses them. Well, they all grumble about more than that, as men ever do, but these things I hear again and again.”</i>", parse);
					Text.Flush();

					rigard.LB.CityTalk = 1;
					LBScenes.OrvinTalkPrompt(innPrompt);
				}, enabled : true,
				tooltip : "Ask him about Rigard.",
			});
		} else {
			options.push({ nameStr : "Caravans",
				func() {
					Text.Clear();
					Text.Add("You ask Orvin what’s going on with the caravans.", parse);
					Text.NL();
					Text.Add("<i>“No one really knows for sure, truth be told,”</i> he replies. <i>“Caravans have always gone missing - the desert is a dangerous, unforgiving place - but of late they seem to go missing much more often. Oh, the vast majority still go through well enough, but you used to hear about one disappearing once or twice a year, and now it seems more like once every month or two.”</i>", parse);
					Text.NL();
					Text.Add("He scratches his chin in puzzlement. <i>“Some survivors from the caravans wander in to the farms or the oasis, but it seems like it’s much too few for the numbers missing. And from many caravans, no one makes it at all. So, since there is no real information, everyone has their own theory as to what’s going on.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Some are saying that the sand storms have been coming more often and more suddenly since the gates have disappeared, which has caught more caravans,”</i> he shakes his head skeptically. <i>“Many merchants blame the lizards, and shady traders from the oasis. They think they have taken to raiding the caravans and killing everyone to hide the evidence. Some even want to get together a small army and go clear them out.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Commoners, on the other hand, are saying that the merchants are just diverting caravans to stockpile goods, and use their disappearance as an excuse to drive up prices.”</i> Orvin shakes his head. <i>“I don’t think it’d make commercial sense, myself, but they need someone to blame, I suppose.”</i>", parse);
					Text.NL();
					Text.Add("<i>“An annoying piece of business, whatever the cause may be. I really hope someone gets to the bottom of it sooner rather than later.”</i>", parse);
					Text.Flush();
					LBScenes.OrvinTalkPrompt(innPrompt);
				}, enabled : true,
				tooltip : "Ask him about the missing caravans.",
			});
			options.push({ nameStr : "Outlaws",
				func() {
					Text.Clear();
					Text.Add("You ask Orvin what the situation with the outlaws is.", parse);
					Text.NL();
					Text.Add("<i>“I don’t rightly know, to be honest,”</i> he tells you, <i>“the king has proclaimed that they are a serious and imminent threat. He is gathering forces, and the nobles are gearing up as well. What’s actually going on is harder to tell.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Rumors are flying. Some say that the outlaws are nothing more than a small band of poachers, and the king is simply using them as an excuse to raise taxes. Others, that their encampment is double the size of Rigard, and that they have thoroughly infiltrated the city. Still others, that they are dragons come back from the dead, wearing the skins of men, out for revenge.”</i> A deep laugh rumbles from him at the notion.", parse);
					Text.NL();
					Text.Add("<i>“What the reality of the situation is no one seems to know. But I expect we’ll find out soon enough,”</i> he concludes, looking grim.", parse);
					Text.Flush();
					LBScenes.OrvinTalkPrompt(innPrompt);
				}, enabled : true,
				tooltip : "Ask him about the outlaws.",
			});
			options.push({ nameStr : "Royal guards",
				func() {
					Text.Clear();
					Text.Add("You ask Orvin what the Royal Guards are doing.", parse);
					Text.NL();
					Text.Add("<i>“The Royal Guards have always been just that - royal. Their place is supposed to be by the king and in his pavilion. Technically, that is the extent of their jurisdiction. Lately, however, they have become more and more full of themselves,”</i> he tells you, frowning.", parse);
					Text.NL();
					Text.Add("<i>“It’s the new commander they got a couple years ago - it seems like he forgets the ‘guard’ part of ‘Royal Guard’ half the time. He’s the second son of the one of the ministers. Seems to think that blood is what makes a man, maybe because it’s the only thing he has going for him.”</i> You’re not sure why, but Orvin looks angrier than you would’ve expected.", parse);
					Text.NL();
					Text.Add("<i>“People call him Preston the Shining - I hear that when the nickname reached him, he took it as acknowledgement of his exalted moral character. I suspect no one’s been brave enough to tell him he earned it for the garish silvery armor he always wears. Apparently, he forces his servants to burnish it for hours each day.”</i>", parse);
					Text.NL();
					Text.Add("<i>“With him in charge, the Royal Guard has taken to venturing out into the city at large, and has had more and more conflicts with the City Watch over authority. They do their best to get the nobles, and anyone else with the coin to pay them off, out of any trouble they land in.”</i>  Orvin wrinkles his nose in disgust. <i>“They offer discounts if the other party’s a morph - half of them seem to think that morphs shouldn’t exist at all, while the other only wants them out of the city.”</i>", parse);
					Text.NL();
					Text.Add("<i>“It’s said some of them take money from nobles to beat up any commoner they’re asked to. Someone in the lower districts had both his arms broken and had to stay in bed for three months to recover. If this keeps up, someone’s bound to end up dead.”</i> He shakes his head in disappointment.", parse);
					Text.Flush();
					LBScenes.OrvinTalkPrompt(innPrompt);
				}, enabled : true,
				tooltip : "Ask him about the Royal Guards.",
			});
		}

		const leiPresent = lei.IsAtLocation(InnLoc.Common);

		if (lei.flags.Met < LeiFlags.Met.KnowName) {
			options.push({ nameStr : "Stranger",
				func() {
					Text.Clear();
					Text.Add("You ask Orvin if he knows anything about the cloaked stranger [sit] alone by the wall.", {sit : leiPresent ? "sitting" : "who sits"});
					Text.NL();
					Text.Add("<i>“I don’t make it a habit of talking about my customers, but, between you and me, he really does look suspicious,”</i> he says, leaning in toward you.", parse);
					Text.NL();
					Text.Add("<i>“He comes around here almost every evening, sometimes other times too, and sits there as you [see]. I think he’s been following a young red-headed couple around, but since they’re mostly here late in the day, it’s hard to tell with the crowds.”</i>", {see: leiPresent ? "see him" : "probably saw him"});
					Text.NL();
					Text.Add("<i>“Other than that, I can’t tell you much. He gets a beer, and drinks it slowly. Always pays right away, and doesn’t bother the staff, so I take his money and don’t bother him.”</i> He frowns, thinking. <i>“I’m just afraid that one of these days he’ll do something. I can’t say why, but that’s the feeling I get from him.”</i>", parse);
					Text.Flush();
					LBScenes.OrvinTalkPrompt(innPrompt);
				}, enabled : true,
				tooltip : Text.Parse("Ask him about the stranger [saw]sitting by the wall.", { saw : leiPresent ? "" : "you saw "}),
			});
		} else {
			options.push({ nameStr : "Lei",
				func() {
					Text.Clear();
					Text.Add("You ask Orvin if he can tell you anything about Lei", parse);
					if (lei.flags.ToldOrvin === 0) {
						Text.Add(", the cloaked man who often sits by the wall.", parse);
						Text.NL();
						Text.Add("<i>“Lei?”</i> Orvin sounds incredulous. <i>“That man is Lei? Even more dangerous than I could’ve guessed...”</i> He trails off before recovering himself with a shake. <i>“But safer too!”</i>", parse);
						lei.flags.ToldOrvin = 1;
					} else {
						Text.Add(".", parse);
					}
					Text.NL();
					Text.Add("<i>“Don’t know if you somehow haven’t heard of him or just want a fresh opinion, but the man is famous. Lei, the Blade’s Pact, as he is titled, is the foremost swordsman in the kingdom, if not all Eden. And when I say ‘foremost’, I mean by a large margin. He accepts all challengers, and no one has seen a duel that even looked close.”</i> Orvin shakes his head.", parse);
					Text.NL();
					Text.Add("<i>“The reason he’s called ‘the Blade’s Pact’, though, is that no one has ever heard him speak an untruth, no matter how slight. When he takes a contract, he follows it to the letter, no matter what happens.”</i>", parse);
					Text.NL();
					Text.Add("<i>“There’s a story that years ago he made an agreement to bring a caravan safely across the desert from Rigard to the Oasis for a merchant. When they were halfway there, a large group of bandits attacked suddenly, and the guards were overwhelmed. All of them, that is, but Lei. He stood his ground, one against thirty, and, as they attacked, he took slew them all, until only three remained. These, seeing what befell their comrades, begged him for mercy.”</i>", parse);
					Text.NL();
					Text.Add("<i>“He disarmed them and tied them up, but left them their lives. In exchange, they told him that it was the caravan master who had hired them. He had wanted the goods to be ‘lost’ so that he could have them for himself without sharing profits with his partners.”</i>", parse);
					Text.NL();
					Text.Add("<i>“So, Lei tied him up too, and alone drove an entire caravan across the plains and the desert, with only the tied up merchant and three bandits for company, or so they say, until he delivered all of them safely to the Oasis. There, he relayed what happened and handed his captives over to the council. They deal harshly with such crimes out there, so they were all promptly executed.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Lei was offered a large bonus for the heroics, but he refused, taking only the small agreed-to amount. He said all he did was fulfill his contract, so there was no need for additional pay.”</i>", parse);
					Text.NL();
					Text.Add("<i>“That’s the kind of man they say he is, so we <b>should</b> be safe enough. At least so long as we don’t get in the way of his current mission, whatever it is.”</i>", parse);
					Text.NL();
					Text.Add("Orvin looks rather worried, despite his words.", parse);

					Text.Flush();
					LBScenes.OrvinTalkPrompt(innPrompt);
				}, enabled : true,
				tooltip : "Ask him if he knows anything about Lei.",
			});
		}
		// SixtyNine
		if (room69.flags.Rel !== Room69Flags.RelFlags.NotMet) {
			options.push({ nameStr : "Sixtynine",
				func() {
					Text.Clear();
					if (room69.flags.Rel === Room69Flags.RelFlags.BrokeDoor || room69.flags.Rel === Room69Flags.RelFlags.BadTerms) {
						Text.Add("Orvin looks you up and down in response to your question. <i>“Well, I suppose I should tell you, even if you aren’t exactly friendly with it.”</i>", parse);
						Text.NL();
						Text.Add("<i>“The room used to be the same as any other room at first, but just about eighty years ago, from what I understand, strange things started happening there. Objects would move in the night. Visitors would complain of something whispering to them when they were alone...”</i>", parse);
						Text.NL();
						Text.Add("<i>“So, great-grandmother decided to just seal the room off, and make do without it until something could be figured out. It was barred and locked tight, and in the bustle of business passed out of everyone’s minds for years.”</i>", parse);
						Text.NL();
						Text.Add("<i>“One day, however, my grandfather, just sixteen at the time, found a strange key while going about his chores. He had thought he knew every key in the inn by sight, so suddenly finding a strange one surprised him. He went around trying it on different locks, until finally it opened the sealed room.”</i>", parse);
						Text.NL();
						Text.Add("<i>“When he went inside, Sixtynine was much as you met it.”</i> He pauses, scratching his chin in thought. <i>“And that’s about it. We’ve been a bit more lenient with it since then, and it’s been kind to us. In some ways, it’s almost a member of the family.”</i>", parse);
						Text.NL();
						Text.Add("You sense there’s more he’s not telling you, but you’ll probably have to show him that Sixtynine trusts you before he’s willing to share more personal details with you.", parse);
						rigard.LB.Orvin69 = 1;
					} else { // Good terms
						if (rigard.LB.Orvin69 !== 0) {
							Text.Add("<i>“I’m glad to see you’ve made up with Sixtynine,”</i> Orvin says, smiling. <i>“I suppose it wouldn’t hurt to tell you a little more, since your intentions seem to good enough.”</i>", parse);
							Text.NL();
							Text.Add("<i>“So, I think I told you last time how the room was sealed off because the objects in it moved on their own, and how my grandfather then unsealed it, and first met Sixtynine. Well, I admit, I skipped the part where it had much the same desires as it does now,”</i> he tells you, laughing.", parse);
						} else {
							Text.Add("Orvin smiles at your question. <i>“You seem to be getting along well with Sixtynine, so I don’t mind telling you.”</i>", parse);
							Text.NL();
							Text.Add("<i>“The room used to be the same as any other room at first, but just about eighty years ago, from what I understand, strange things started happening there. Objects would move in the night. Visitors would complain of something whispering to them when they were alone...”</i>", parse);
							Text.NL();
							Text.Add("<i>“So, great-grandmother decided to just seal the room off, and make do without it until something could be figured out. It was barred and locked tight, and in the bustle of business passed out of everyone’s minds for years.”</i>", parse);
							Text.NL();
							Text.Add("<i>“One day, however, my grandfather, just sixteen at the time, found a strange key while going about his chores. He had thought he knew every key in the inn by sight, so suddenly finding a strange one surprised him. He went around trying it on different locks, until finally it opened the sealed room.”</i>", parse);
							Text.NL();
							Text.Add("<i>“When he went inside, Sixtynine was much as you met it. And it had much the same desires too,”</i> Orvin tells you, laughing.", parse);
						}
						Text.NL();
						Text.Add("<i>“So - and I admit father didn’t exactly tell it to me straight out - grandfather must have had quite the eye-opening experience! He was apparently even in love with it for a year or two, before the fascination passed and he met grandmother.”</i>", parse);
						Text.NL();
						Text.Add("<i>“It’s been like that with most everyone in the family since then, be they boy or girl, man or woman. Sixtynine is a family friend, a confidante... an occasional lover.”</i> He blushes a little at this last.", parse);
						if (room69.flags.BadStart === Room69Flags.RelFlags.BrokeDoor) {
							Text.Add(" <i>“So you can see why I was upset that you hurt her. Hurt it.”</i>", parse);
						}
					}
					Text.Flush();
					LBScenes.OrvinTalkPrompt(innPrompt);
				}, enabled : true,
				tooltip : "Ask about the apparently sentient room 369.",
			});
		}

		options.push({ nameStr : "Rumors",
			func() {
				Text.Clear();
				Text.Add("You ask Orvin if he’s heard any interesting rumors recently.", parse);
				Text.NL();

				const scenes = [];

				// Long
				if (WorldTime().season === Season.Spring) {
					scenes.push(() => {
						Text.Add("<i>“The winds have always been strongest in the spring, but I heard that this year they are especially bad. The desert is crawling toward the plains, the dunes shifting, taking a little bit of ground every day.”</i>", parse);
						Text.NL();
						Text.Add("<i>“It’s not as bad in other seasons. During the summer, some plants even begin to encroach on the desert, reclaiming land. It is a war of plants and wind, and usually no one is quite sure which side is winning.”</i>", parse);
						Text.NL();
						Text.Add("<i>“This year, however, the wind seems ahead. Farmers are complaining of dust storms blowing in from the desert, ruining the soil and destroying crops. Might be a small harvest this autumn.”</i>", parse);
					});
				}
				// Long
				scenes.push(() => {
					Text.Add("<i>“Rumor has it that the king and queen had another fight. Some say that Rhylla brought in a morph servant without telling Rewyn. Others, that Rewyn ordered that the twins remain in the capital, though they are accustomed to going with Rhylla to her family estates during the harvest celebrations.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Be that as it may, apparently they’ve refused to speak to each other this past week. The servants route them around each other when they walk through the castle, and Rhylla keeps finding excuses to skip out on official functions.”</i> Orvin looks disappointed.", parse);
					Text.NL();
					Text.Add("<i>“It troubles everyone when the two rulers of the land quarrel. Still, I suppose nothing bad has come of it in all the years they have been arguing so far.”</i>", parse);
				});
				// Long
				scenes.push(() => {
					Text.Add("<i>“In my grandfather’s time, the gates still opened regularly, I am told. There was one world that had an abundance of gemstones, while Eden has almost none. So, practically all the precious stones in the world came from there.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Since the portals have stopped opening, the supply has dried up, and prices have been slowly rising up for decades. Just recently, however, they shot up all at once!”</i>", parse);
					Text.NL();
					Text.Add("<i>“People are saying that a few traders have been hoarding them, planning to corner the market.”</i> Orvin sounds disgusted with the practice. <i>“Well, fortunately it’s mainly affecting nobles and the richer merchants, so they can just sort it out among themselves.”</i>", parse);
				});
				// Long
				if (party.InParty(lei)) {
					scenes.push(() => {
						Text.Add("<i>“I heard Lei hasn’t been in the city as much recently. It used to be, he’d have a showmatch just about every week, but no one’s seen him at it for some time.”</i>", parse);
						Text.NL();
						Text.Add("<i>“Rumor has it he got a job that’s taking up his time. Some say the kingdom hired him to go fight the outlaws, others that merchants hired him to help out at the Oasis, and yet others have it that he was hired to support an expedition to the dragon graveyard.”</i>", parse);
						Text.NL();
						Text.Add("<i>“Well, whatever it is, I liked it a bit better when he put on spectacles. It got people excited and wanting a drink. I guess him having fewer fights is good for the health of the populace, though.”</i>", parse);
					});
				}
				// TODO: More rumors
				/*
				scenes.push(() => {
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
				});
				*/

				let sceneId = rigard.LB.RotRumor;
				if (sceneId >= scenes.length) { sceneId = 0; }

				rigard.LB.RotRumor = sceneId + 1;

				// Play scene
				scenes[sceneId]();

				Text.Flush();
				LBScenes.OrvinTalkPrompt(innPrompt);
			}, enabled : true,
			tooltip : "Ask him if there are any interesting rumors going around.",
		});
		options.push({ nameStr : "Vixen",
			func() {
				Text.Clear();

				parse.foxvixen = terry.mfPronoun("fox", "vixen");
				parse = terry.ParserPronouns(parse);

				if (rigard.LB.OTerry !== 0) {
					if (party.InParty(terry)) {
						Text.Add("<i>“It’s hard to trust you again, but it's a tough world out there. Take care of yourself, Terry.”</i> Orvin gives a gruff nod to the [foxvixen].", parse);
						Text.NL();
						Text.Add("<i>“Thanks, and I’m really sorry about tricking you...”</i> Terry replies, bowing [hisher] head in shame.", parse);
						Text.NL();
						Text.Add("Orvin merely inclines his head again, but you can see the hint of a smile on his lips.", parse);
					} else {
						Text.Add("<i>“Yeah, that was a bit of a shock. Who’d think that she was actually a he? And a thief to boot? Guess sometimes you do what you have to to get by,”</i> he sighs.", parse);
					}
				} else if (party.InParty(terry)) {
					Text.Add("<i>“Ah, don’t bring that up again,”</i> Orvin shakes his head. <i>“I can’t believe I was fooled by his...”</i> He trails off as he sees Terry peeking out from behind you. <i>“You!”</i> he exclaims.", parse);
					Text.NL();
					Text.Add("<i>“Umm… hello?”</i> Terry waves nervously, [hisher] ears drooping guiltily.", parse);
					Text.NL();
					Text.Add("You hurriedly tell him the terms of Terry’s release, assuring the innkeeper that all is in order. Orvin listens to your explanation, frowning as you explain the workings of the collar around Terry’s neck.", parse);
					Text.NL();
					Text.Add("<i>“I’m sorry for lying to you, I really did enjoy working here,”</i> Terry quickly adds, bowing [hisher] head apologetically.", parse);
					Text.NL();
					Text.Add("<i>“Ah… well,”</i> Orvin clears his throat, the apology clearly catching him off-guard. <i>“I wish you had just told me...”</i>", parse);
					Text.NL();
					Text.Add("<i>“You were really nice to me. I didn’t expect that from this shithole of a city. And I didn’t want to involve you in my little outing,”</i> Terry explains, ears flat against [hisher] skull.", parse);
					Text.NL();
					Text.Add("<i>“Well, if you feel like doing honest work again some time, I could use another hand, I suppose,”</i> Orvin finishes gruffly, going back to cleaning glasses.", parse);
					Text.NL();
					Text.Add("<i>“Thanks, that means a lot to me.”</i> The [foxvixen] smiles as [hisher] tail begins wagging.", parse);

					rigard.LB.OTerry = 1;
				} else if (rigard.Krawitz.Q >= RigardFlags.KrawitzQ.CaughtTerry) {
					Text.Add("<i>“Yep, I heard all about it. Who’d think that she was actually a he? And a thief to boot? Shows that you can never fully trust anyone,”</i> he sighs.", parse);
				} else if (rigard.Krawitz.Q >= RigardFlags.KrawitzQ.HeistDone) {
					Text.Add("<i>“She left not too long ago. Said she was done with her business in this city, so she’d be going back home. She’s a good girl, so I wouldn’t mind offering her a place to stay if she ever comes back,”</i> he notes.", parse);
				} else {
					Text.Add("<i>“Her? She’s rather pretty, isn’t she? Her kind isn’t exactly my cup of tea, but I’ll give credit where credit is due. This place has been a bit more lively since she showed up,”</i> he explains. <i>“Apparently she’s here to take care of some family business. Poor girl had nowhere to stay and didn’t have any money when she got here, so I offered to let her stay as a waitress.”</i>", parse);
				}
				Text.Flush();
				LBScenes.OrvinTalkPrompt(innPrompt);
			}, enabled : true,
			tooltip : Text.Parse("Ask him about the vixen who work[sed] at the inn.", {sed: rigard.Krawitz.Q < RigardFlags.KrawitzQ.CaughtTerry ? "s" : "ed"}),
		});

		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("You are talking to the innkeeper of Lady's Blessing.");
			Text.Flush();
			innPrompt();
		});
	}

	export function EfriPrompt() {
		const parse: any = {

		};

		// TODO
		Text.Clear();
		Text.Add("PLACEHOLDER", parse);
		Text.Flush();
		Gui.NextPrompt();
		return;

		const task = efriaction;

		Text.Clear();
		Text.Add("", parse);
		Text.NL();
		Text.Flush();

		// [Sure][Nah]
		const options = new Array();
		options.push({ nameStr : "Sure",
			func() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : "",
		});
		options.push({ nameStr : "Nah",
			func() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : "",
		});
		Gui.SetButtonsFromList(options, true);
	}

	export function DrinksPrompt(innPrompt: CallableFunction) {
		const rigard = GAME().rigard;
		const player = GAME().player;
		const kiakai = GAME().kiakai;
		const party: Party = GAME().party;

		const parse: any = {
			playername : player.name,
			IkName   : !RigardFlags.LB.KnowsOrvin() ? "The innkeeper" : "Orvin",
			ikname   : !RigardFlags.LB.KnowsOrvin() ? "the innkeeper" : "Orvin",
		};

		const options = [];

		const beers = [];
		const wines = [];
		const nonalcoholic = [];
		const exotic = [];

		// Beers
		beers.push({ nameStr : "Local brew",
			func() {
				Text.Clear();
				Text.Add("You ask him for the local brew, and he pours it for you into a wide glass, careful to avoid having the head get too tall.", parse);
				Text.NL();
				Text.Add("The beer has a refreshing hops smell, and a light, thin as water, consistency. You sip it and find that the taste is about the same. Very plain, filtered, with no hint of additives, and a moderate punch of spirits to round it off. Not too bad, but nothing to get excited over either.", parse);
				Text.NL();
				Text.Add("By the time you finish the glass, you feel the alcohol hitting you. You feel a little more confident in yourself socially, and everyone around you looks just a tad prettier in your eyes.", parse);
				Text.Flush();
				player.Drink(0.4);
				party.coin -= 4;
				Gui.NextPrompt();
			}, enabled : party.coin >= 4,
			tooltip : "Order a glass of the local brew for 4 coins.",
			text() {
				Text.NL();
				Text.Add("<i>“I’m trying out a keg of a local brew I picked up a week ago. It’s light, and a little plain, but not too bad overall. Really cheap, too.”</i>", parse);
			},
		});
		beers.push({ nameStr : "Stout",
			func() {
				Text.Clear();
				Text.Add("You ask him for the Tricker’s stout, and he pours it for you into a wide glass, careful to avoid having the head get too tall.", parse);
				Text.NL();
				Text.Add("You sip slowly, the thick liquid flowing into your mouth and enveloping your tongue. The taste is sweet, just short of being overwhelming, with just a hint of bitterness to set it off.", parse);
				Text.NL();
				Text.Add("True to [ikname]’s description, you can’t detect even a hint of alcohol as you drink the glass, and are left to enjoy the smooth taste.", parse);
				Text.NL();
				Text.Add("By the time you finish the glass, however, you feel the spirits kick in, and find yourself gaining social confidence, while everyone around you seems a bit more attractive.", parse);
				Text.Flush();
				const drunk = player.Drink(0.5);
				party.coin -= 8;
				if (drunk) { return; }
				Gui.NextPrompt();
			}, enabled : party.coin >= 8,
			tooltip : "Order a glass of Trickster’s stout for 8 coins.",
			text() {
				Text.NL();
				Text.Add("<i>“I’ve got a keg of Trickster’s stout. Made according to Riorbane’s own recipe,”</i> he says, smiling, <i>“or so the brewer claims, anyway. The ‘trick’ is that the smooth malty flavor masks the strong kick of spirits it packs. Eight coins a glass.”</i>", parse);
			},
		});
		beers.push({ nameStr : "Ale",
			func() {
				Text.Clear();
				Text.Add("You ask him for the Highlander ale, and he pours it for you into a wide glass, careful to avoid having the head get too tall.", parse);
				Text.NL();
				Text.Add("The ale is a murky orange color, with particles floating in the liquid. The smell more than makes up for the questionable appearance as your nose is flooded with a heady aroma of hops, mixed with a variety of fruits you struggle to place. Somehow, oranges, blackberries, grapefruit, and the fresh smell of pine all strike your senses.", parse);
				Text.NL();
				Text.Add("Sipping, the taste delivers all that the smell promised - hops, fruit, and a touch of smooth sweetness to round out the mixture. You notice just a hint of alcohol, which accentuates the other flavors, reminding you that this is, after all, a strong brew. After you look regretfully at the empty glass, an aftertaste of fruit and pine freshness is left in your mouth.", parse);
				Text.NL();
				Text.Add("After drinking the ale, you feel as smooth as it was, a perfect social operator, while all around you are worthy targets for your attention.", parse);
				Text.Flush();
				const drunk = player.Drink(0.6);
				party.coin -= 11;
				if (drunk) { return; }
				Gui.NextPrompt();
			}, enabled : party.coin >= 11,
			tooltip : "Order a glass of the Highlander ale for 11 coins.",
			text() {
				Text.NL();
				Text.Add("<i>“I’ve cracked open a keg of Highlander ale. They send only a few wagons to the city, so I’m pretty happy I managed to get my hands on some. The appearance is a little odd, but, trust me, the smell and the taste are the best thing you’ll find on this world. Well worth eleven coins.”</i>", parse);
			},
		});

		// Wines
		wines.push({ nameStr : "Local wine",
			func() {
				Text.Clear();
				Text.Add("You ask for the local wine. You pay him, and drink in slow sips. It’s not so bad, but the taste of spirits is much too sharp underneath its fruity raspberry flavor.", parse);
				Text.NL();
				Text.Add("After drinking it, you feel a little invigorated, ready to go and get something done.", parse);
				Text.Flush();
				const drunk = player.Drink(0.6);
				party.coin -= 6;
				if (drunk) { return; }
				Gui.NextPrompt();
			}, enabled : party.coin >= 6,
			tooltip : "Order a glass of the local wine for 6 coins.",
			text() {
				Text.NL();
				Text.Add("<i>“I’ve opened up a barrel of red wine I bought from a farmer last month. It’s nothing exceptional, but quite drinkable. Has a nice fruity flavor with just a touch of sweetness, and it’s only six coins a glass.”</i>", parse);
			},
		});
		wines.push({ nameStr : "West Rirvale",
			func() {
				Text.Clear();
				Text.Add("You ask for the West Rirvale wine. Paying him, you drink in slow sips. It really is quite a nice taste - the different flavors mesh well together, while still being distinguishable.", parse);
				Text.NL();
				Text.Add("The taste reminds you of honey, grapes, and a hint of lime, although you are sure nothing but grapes went into this. Just a hint of alcohol serves to underscore the combination. Unfortunately, it leaves an overly bitter aftertaste, but overall it is quite good.", parse);
				Text.NL();
				Text.Add("Drinking it, you feel rather invigorated, like you are ready to take on almost anything.", parse);
				Text.Flush();
				const drunk = player.Drink(0.5);
				party.coin -= 10;
				if (drunk) { return; }
				Gui.NextPrompt();
			}, enabled : party.coin >= 10,
			tooltip : "Order a glass of the West Rirvale wine for 10 coins.",
			text() {
				Text.NL();
				Text.Add("<i>“For tonight I’ve got a barrel of West Rirvale white from the 887 vintage. Just ten coins a glass. It’s quite a good winery, and that year was especially good as well. It’s a harmonious yet complex taste. A little on the dry side, but nice overall. For a local wine.”</i>", parse);
			},
		});
		wines.push({ nameStr : "Orsineau",
			func() {
				Text.Clear();
				Text.Add("You ask him for the <i>“Royal”</i> wine. Paying him, you drink the red in slow sips. It is an impressively rich harmonious taste. You feel yourself notice one flavor after another, your mind drawn along with each one. It is a rather sweet wine, but instead of being cloying, it somehow gives you more energy and determination.", parse);
				Text.NL();
				Text.Add("You drink slowly, careful to savor the smell and flavor as long as possible, but all too soon the glass is empty, and you return it to one of the waiting staff. You decide that was definitely well worth the coins.", parse);
				Text.NL();
				Text.Add("After drinking the glass, you feel confident, and almost unstoppable, ready to go out and take on anything.", parse);
				Text.Flush();
				const drunk = player.Drink(0.6);
				party.coin -= 15;
				if (drunk) { return; }
				Gui.NextPrompt();
			}, enabled : party.coin >= 15,
			tooltip : "Order a glass of the 882 Orsineau for 15 coins.",
			text() {
				Text.NL();
				Text.Add("<i>“Ah, for tonight I’ve opened a barrel of the 882 Orsineau. It’s fifteen coins a glass, but well worth it, I promise you. It’s a mediocre vintage, but the Orsineau winery has been operating for over three centuries now, and it’s probably the best Eden wine you’ll find.”</i>", parse);
				Text.NL();
				Text.Add("<i>“The queen’s ancestors decided to start a winery on their estates, and, ever since then, her family has been refining cultivation methods, striving for an ever better taste. The climate is against them, so they still cannot compete with other worlds, but here they are the undisputed best.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Since Rhylla has ascended the throne, some have taken to calling it Royal wine. Those that like her, at least.”</i>", parse);
			},
		});

		// Non-alcoholic
		nonalcoholic.push({ nameStr : "Water",
			func() {
				Text.Clear();
				Text.Add("You ask him for the water, and drink it down after paying. It’s cool and pure, and you find yourself refreshed after drinking it. Maybe it was worth the coins after all.", parse);
				Text.Flush();
				party.coin -= 2;
				Gui.NextPrompt();
			}, enabled : party.coin >= 2,
			tooltip : "Order a glass of water for 2 coins.",
			text() {
				Text.NL();
				Text.Add("<i>“Clear well water - just two coins for a glass.”</i> You stare incredulously at the price. <i>“Oh, don’t look at me that way! There’s not enough wells to supply the entire city, so some have to drink river water. You don’t want to try that.”</i>", parse);
			},
		});
		nonalcoholic.push({ nameStr : "Lemonade",
			func() {
				Text.Clear();
				Text.Add("You ask him for a glass of lemonade, and drink it after paying. It is just the right shade of sour, sending a slight tingle along your tongue, without being unpleasant. You feel a little more alert and energetic after drinking the beverage.", parse);
				Text.Flush();
				party.coin -= 6;
				Gui.NextPrompt();
			}, enabled : party.coin >= 6,
			tooltip : "Order a glass of lemonade for 6 coins.",
			text() {
				Text.NL();
				Text.Add("<i>“We’re serving lemonade today, for just six coins. The lemons are brought in from farms close to the desert, and freshly squeezed in our own kitchen. And we add plenty of sugar, don’t worry,”</i> he adds, winking at you.", parse);
			},
		});
		nonalcoholic.push({ nameStr : "Tea",
			func() {
				Text.Clear();
				if (rigard.LB.Tea === 0) {
					Text.Add("You’re a little wary of the blob-like organic machine that’s supposed to make your tea, but decide to give it a chance.", parse);
				} else {
					Text.Add("Last time the machine made you tea turned out well, so you decide to go for another cup.", parse);
				}
				Text.NL();
				Text.Add("You hand [ikname] the coins and he turns to the machine to make your beverage. He stretches open something that resembles a toothless mouth at the top and puts in a spoonful of tea leaves. He pets the creature at its crown, and it extends a thin appendage into a barrel of clean water in response. You hear a quiet slurping noise as the machine begins to suck it up.", parse);
				Text.NL();
				if (rigard.LB.Tea === 0) {
					Text.Add("<i>“Perfectly safe, don’t you worry,”</i> [ikname] reassures you.", parse);
				} else {
					Text.Add("<i>“There’s a good girl,”</i> [ikname] purrs to the organic device.", parse);
				}
				Text.NL();
				Text.Add("With the water in, nothing seems to happen for a few moments, but before even a minute has passed, you see tiny holes open up around the creature’s top, and steam pour out of them in long thin jets. The innkeeper holds a pretty white tea mug below the creature’s appendage and pets it again. A thick stream of brown tea flows out and fills the cup.", parse);
				Text.NL();
				if (rigard.LB.Tea === 0) {
					Text.Add("<i>“It’s even better than it looks, trust me. Just give it a try - I promise you’ll like it,”</i> he tells you, passing you the steaming drink.", parse);
					Text.NL();
					Text.Add("You look at it a little skeptically, but the tea looks perfectly ordinary, so you carefully blow on it", parse);
				} else if (rigard.LB.Tea === 1) {
					Text.Add("<i>“I told you you’d like it, didn’t I?”</i> he tells you, passing you the steaming drink.", parse);
					Text.NL();
					Text.Add("You smile and nod at him, taking the tea. You blow on it carefully", parse);
				} else {
					Text.Add("<i>“Here you are! It’s as good as usual,”</i> he tells you, smiling, and passing you the steaming drink.", parse);
					Text.NL();
					Text.Add("You accept it, nodding at him gratefully. It’s just what you need to relax. You blow at the tea carefully", parse);
				}
				Text.Add(" and take a sip.", parse);
				Text.NL();
				Text.Add("The hot, just slightly bitter, liquid surrounds your tongue. Somehow, the warmth seems to relax you, while the taste makes you more alert at the same time. You sigh contentedly, nursing the cup as you let your thoughts drift.", parse);
				Text.NL();
				if (rigard.LB.Tea === 0) {
					Text.Add("That was surprisingly good. You decide you should get another cup some time.", parse);
				} else if (rigard.LB.Tea === 1) {
					Text.Add("That was as good as you remembered. You could get used to this.", parse);
	} else {
					Text.Add("That was delicious as always. You wonder when you’ll be able to grab another cup.", parse);
	}
				Text.Flush();
				party.coin -= 7;
				rigard.LB.Tea++;
				Gui.NextPrompt();
			}, enabled : party.coin >= 7,
			tooltip : "Order a cup of tea for 7 coins.",
			text() {
				Text.NL();
				Text.Add("<i>“We’re serving tea. Just seven coins if you’d like some. It’s freshly brewed for every customer.”</i> He motions at an odd organic-looking machine behind him. <i>“The machine was made by the court alchemist - it’s fast, effective, and gets the brewing just right. The only problem is we have to feed it twice a day, but it’s worth it.”</i>", parse);
			},
		});

		exotic.push({ nameStr : "Firebrandy",
			func() {
				Text.Clear();
				if (rigard.LB.Lizan === 0) {
					Text.Add("You pay [ikname] and look at your drink skeptically. The liquid is an orange red, and seems to swirl even while you hold the cup still. You can definitely see how it got its name.", parse);
				} else {
					Text.Add("You pay [ikname] and take the cup of fiery-looking liquid. Just looking at it sends a burning sensation down your throat as you remember last time.", parse);
				}
				Text.NL();
				Text.Add("Steeling yourself, you firmly grasp the small clay cup, and, before your courage has a chance to desert you, down it in one swallow.", parse);
				Text.NL();
				if (rigard.LB.Lizan === 0) {
					Text.Add("The first thing you feel is an intense burning on your tongue, as if you just poured a scalding liquid into your mouth, despite the drink being barely warm. The heat ", parse);
				} else {
					Text.Add("Heat ", parse);
				}
				Text.Add("radiates from the spot where the firebrandy briefly touched your tongue and spreads rapidly, until your entire mouth feels on fire.", parse);
				Text.NL();
				Text.Add("At the same time, another wave of heat rises from your stomach, your entire chest feeling suffused with flame. The two waves meet in your throat, and, as you take desperate breaths to try to cool off, you feel them collide. You cough slightly, and you swear you see a small puff of smoke emerge from your mouth.", parse);
				Text.NL();
				Text.Add("After a few minutes of desperately huffing air to stifle the raging inferno inside you, it quiets down to something more like a large campfire in your mouth, and you are able to go about your day.", parse);

				// TODO: Lizard/dragon TF?

				Text.Flush();
				const drunk = player.Drink(1);
				party.coin -= 20;
				rigard.LB.Lizan++;
				if (drunk) { return; }
				Gui.NextPrompt();
			}, enabled : party.coin >= 20,
			tooltip : "Order a cup of Lizan firebrandy for 20 coins.",
			text() {
				Text.Add("Lizan firebrandy!”</i>", parse);
				Text.NL();
				Text.Add("<i>“We’ve got a few jugs stored and I’ve taken one out for tonight, at just twenty coins a cup. They say that a sip of this will make you feel like a dragon, and a cup like a dragon is trying to crawl down your throat. They pack the stuff full of the hottest spices, and the kick of spirits is quite something too.”</i>", parse);
			},
		});
		exotic.push({ nameStr : "Nectar",
			func() {
				parse.name   = kiakai.name;
				parse.heshe  = kiakai.heshe();
				parse.HeShe  = kiakai.HeShe();
				parse.himher = kiakai.himher();
				parse.hisher = kiakai.hisher();
				parse.HisHer = kiakai.HisHer();

				Text.Clear();
				if (rigard.LB.Elven === 0) {
					Text.Add("You pay [ikname] and receive a flat wide cup, full of the nectar. It is a viscous, mostly opaque liquid, the color of spring leaves. Despite its thick texture, it seems to almost pulse with life, its surface stirring in wide ripples.", parse);
					Text.NL();
					if (party.InParty(kiakai)) {
						Text.Add("<i>“Ooh, nectar!”</i> [name] exclaims, looking intently at the liquid. <i>“I have not had any since I was little! Even then, it was a drink we received but rarely. Seeing it again really brings back memories... I think I shall order a cup for myself as well.”</i>", parse);
						Text.NL();
						Text.Add("Paying the innkeeper, [heshe] receives a drink of [hisher] own and turns expectantly to you. Taking one last look at the syrupy liquid, you decide there’s no use delaying further and drink ", parse);
					} else {
						Text.Add("You wonder why it is pulsing so oddly, but decide that many people must have drunk it already, so it’s probably safe enough. You raise the cup to your lips and drink ", parse);
					}
				} else {
					if (party.InParty(kiakai)) {
						Text.Add("<i>“Ooh, are we having nectar again?”</i> [name] asks happily, buying a cup for [himher]self. <i>“It is always such a treat.”</i>", parse);
						Text.NL();
						Text.Add("You find yourself agreeing with [himher] and raise the cup to your lips, drinking ", parse);
					} else {
						Text.Add("Remembering the pleasant taste from last time, you raise the cup to your lips and drink ", parse);
					}
				}
				Text.Add("in measured swallows.", parse);
				Text.NL();
				Text.Add("Despite its thickness, the liquid seem to flow smoothly, somehow cheerfully, from the cup, and you catch yourself having the odd thought that it is eager to become part of your body. It is sweet, almost incredibly so, but, as [ikname] said, somehow, instead of being oppressive, the sweetness is energizing.", parse);
				Text.NL();
				Text.Add("You feel warmth flowing from your stomach into your limbs, and energy suffuse your entire body.", parse);
				if (player.HPLevel() < 1) {
					Text.Add(" Even your scrapes and bruises seem to be mending under the drink’s influence.", parse);
				}
				Text.NL();
				if (party.InParty(kiakai)) {
					Text.Add("<i>“Ah, that was really the best, wasn’t it [playername]?”</i> [name] says, finishing [hisher] drink. <i>“Human drinks are nice enough, but there is nothing quite like nectar to remind you of the beauty of living things in the world.”</i> [HeShe] looks wistful, gazing into a distance beyond the inn’s walls.", parse);
					Text.NL();

					if (rigard.LB.Elven === 0) {
						kiakai.relation.IncreaseStat(50, 5);
					} else {
						kiakai.relation.IncreaseStat(50, 1);
					}
				}
				parse.k = party.InParty(kiakai) ? " from your cup as well" : "";
				Text.Add("Finally, to your disappointment, the last of it is gone[k], and you are forced to return the empty cup to one of the staff. Still, you feel the nectar’s essence already beating inside your body, and are ready to go out and resume your adventures.", parse);

				party.RestFull();

				// TODO: Elf TF?

				Text.Flush();
				party.coin -= 24;
				rigard.LB.Elven++;
				Gui.NextPrompt();
			}, enabled : party.coin >= 24,
			tooltip : "Order a cup of elvish nectar for 24 coins. ",
			text() {
				Text.Add("Elvish nectar!”</i>", parse);
				Text.NL();
				Text.Add("<i>“They bring it out of the forest themselves, carrying it in bags made of leaves. Damned inconvenient things, but I tried pouring the nectar over into barrels once, and it spoiled within a day. A waste. It’s like liquid honey, but instead of being overwhelming, the sweetness is just amazing,”</i> he tells you. <i>“I don’t know how to describe it any better than that. The elves do not part with it easily, and they are the only ones who make it, so it is twenty-four coins a cup.”</i>", parse);
			},
		});
		exotic.push({ nameStr : "Green Fairy",
			func() {
				Text.Clear();
				if (rigard.LB.Fairy === 0) {
					Text.Add("You find yourself a little curious about just how much alcohol you can handle, and pay [ikname] for a glass of the green fairy.", parse);
					if (rigard.LB.Red !== 0) {
						Text.Add(" You’ve already survived drinking Red River whisky, but gulp nervously, suspecting that this might be even worse.", parse);
					}
				} else {
					Text.Add("You aren’t quite sure what draws you back to the brutal drink, but you find yourself again asking [ikname] for a glass of the green fairy.", parse);
				}
				Text.NL();
				parse.know = rigard.LB.Fairy === 0 ? "somehow you suspect" : "you know from experience";
				Text.Add("The drink is a nearly transparent pale green in a small glass, barely more than a shot. There’s really not very much of it, but [know] that this is probably as much as anyone can really handle. A light smell of pine comes from the drink, almost completely obscured by an overwhelming odor of alcohol.", parse);
				Text.NL();
				Text.Add("You steel yourself, and take a small gulp, nearly choking as the liquid hits your tongue and you force it down your throat. There is a hint of pine and citrus in there, but it does nothing to soothe the burning sensation covering your tongue and running down your throat.", parse);
				Text.NL();
				Text.Add("Somehow, you force yourself to take the second gulp, and the third, and the glass stands blessedly empty before you. Your tongue and throat feel like they have been stripped raw, and you feel a skeptical rumbling in your stomach at the liquid you just poured into it.", parse);
				Text.NL();
				Text.Add("Still, you can’t help but feel almost proud of yourself for having gotten that down, and if you might feel woozy for a little while, it is a small price to pay for the interesting experience.", parse);

				// TODO: Fairy TF? No?

				Text.Flush();
				const drunk = player.Drink(2);
				party.coin -= 10;
				rigard.LB.Fairy++;
				if (drunk) { return; }
				Gui.NextPrompt();
			}, enabled : party.coin >= 10,
			tooltip : "Order a glass of the green fairy for 10 coins.",
			text() {
				Text.Add("the green fairy!”</i>", parse);
				Text.NL();
				Text.Add("<i>“It’s not actually related to the rumored forest creatures, but I have heard many customers say they saw those and many stranger things after having a sip of this. There is some tree sap in it to lend it that nice green tint, but the main ingredient is just raw spirits. It’s distilled by some villagers near the forest, so it isn’t too expensive, at ten coins a glass.”</i>", parse);
			},
		});
		exotic.push({ nameStr : "Red River",
			func() {
				Text.Clear();
				if (rigard.LB.Red === 0) {
					parse.fairy = rigard.LB.Fairy !== 0 ? "You’ve already braved the green fairy, and are quite sure this can’t be nearly as bad. " : "";
					Text.Add("You find yourself a little curious, and order a glass of the drink. [fairy]It is a dark orange color, and looks a little murky. It smells sweet, but also has a touch of forest scents in it, and over it all is the pungent sting of alcohol.", parse);
					Text.NL();
					Text.Add("Steeling yourself, you raise the glass to your lips and take a sip of the drink. It burns your mouth, and brings a hint of tears to your eyes, but the taste is not too bad. It is all that the smell promised - a little woody, sweet, and strong.", parse);
					Text.NL();
					Text.Add("The drink burns your throat on the way down, but the feeling is not unpleasant. You find yourself drawn to sip after sip, until the glass stands empty before you.", parse);
				} else {
					if (rigard.LB.Red === 1) {
						parse.before = ", even though you’ve only had it once before";
					} else if (rigard.LB.Red > 1) {
						parse.before = ", even though you’ve only had it a few times before";
					} else {
						parse.before = "";
					}
					Text.Add("You ask for a drink of the Red River whiskey again, and gratefully accept the glass of murky orange liquid from [ikname]. Looking at it, somehow it feels like you’re greeting an old friend[before].", parse);
					Text.NL();
					Text.Add("You drink it slowly, savoring the sweet, woody flavor, almost welcoming the sting of alcohol as the liquid kisses your mouth and flows down your throat. In short order, your thirst is somewhat slaked and the glass stands empty before you.", parse);
				}
				Text.Add(" Perhaps the clan that made this really did gain power from the drink, because you certainly feel stronger and ready to take on anything.", parse);
				Text.Flush();

				// TODO: #some effect - permanent small str bonus? manliness gain? I dunno.

				const drunk = player.Drink(1.3);
				party.coin -= 25;
				rigard.LB.Red++;
				if (drunk) { return; }
				Gui.NextPrompt();
			}, enabled : party.coin >= 25,
			tooltip : "Order a glass of Red River whiskey for 25 coins.",
			text() {
				Text.Add("Red River whiskey!”</i>", parse);
				Text.NL();
				Text.Add("<i>“It is the traditional drink of a fearsome warrior clan from the west. Most fear to approach them, but fortunately they are not fools, and have trading days on which barrels of the stuff can be purchased, at a rather steep price. It has an unusual taste, a little bit of oak from the barrels, a little smoky flavor. Most of all, though, it is quite the burn going down. You can see if this is what makes them so fearsome for twenty-five coins a glass.”</i>", parse);
			},
		});
		exotic.push({ nameStr : "Chocolate milk",
			func() {
				Text.Clear();
				Text.Add("With some bemusement, you hand over the coins to [ikname], and receive your glass of chocolate milk. The liquid is a smooth light brown color, and, to no one’s surprise, smells of a combination of chocolate and milk.", parse);
				Text.NL();
				Text.Add("Taking a swallow, you find that it tastes of chocolate and milk as well. The milk is creamy and smooth - refreshing, and free from the unpleasant aftertastes you’ve had the frequent misfortune of encountering. The chocolate adds a delightful cocoa flavor, and an engaging sweetness to the drink.", parse);
				Text.NL();
				Text.Add("Before too long, you find that the glass stands empty before you, and are a little disappointed that you finished it so quickly. Still, you feel a little happier having drunk that, and a little energized as well.", parse);
				Text.Flush();
				party.coin -= 14;
				Gui.NextPrompt();
			}, enabled : party.coin >= 14,
			tooltip : "Order a glass of chocolate milk for 14 coins.",
			text() {
				Text.Add("chocolate milk!”</i>", parse);
				Text.NL();
				Text.Add("<i>“You may have seen chocolate for sale in the marketplace, lying in view for exorbitant prices. It is made from the nuts of a tree that can only grow in a few places on Eden. Here we have a rare delicacy - chocolate flavored milk. It is sweet and refreshing, and affordable too at only fourteen coins a glass. Go ahead, give it a go.”</i>", parse);
			},
		});

		/*
		exotic.push({ nameStr : "Sure",
			func : () => {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
				var drunk = player.Drink(0.4);
				party.coin -= 4;
				if(drunk) return;
				Gui.NextPrompt();
			}, enabled : party.coin >= 4,
			tooltip : "",
			text : () => {
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
			}
		});
		*/

		const beer = beers[WorldTime().day % beers.length];
		const wine = wines[WorldTime().day % wines.length];
		const non  = nonalcoholic[WorldTime().day % nonalcoholic.length];
		const ex1  = exotic[WorldTime().day % exotic.length];
		const ex2  = exotic[(WorldTime().day + 2) % exotic.length];

		beer.text();
		wine.text();
		non.text();
		Text.NL();
		Text.Add("<i>“We’re also serving two more exotic drinks tonight!”</i> [ikname] exclaims, beaming. <i>“The first is ", parse);
		ex1.text();
		Text.NL();
		Text.Add("<i>“And for the second, we have ", parse);
		ex2.text();

		options.push(beer);
		options.push(wine);
		options.push(non);
		options.push(ex1);
		options.push(ex2);

		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("You are talking to the innkeeper of Lady's Blessing.");
			Text.Flush();
			innPrompt();
		});
	}

	export function GotoRoom() {
		const rigard = GAME().rigard;
		const player = GAME().player;
		const kiakai = GAME().kiakai;
		const lei = GAME().lei;
		const gwendy = GAME().gwendy;
		const miranda = GAME().miranda;
		const party: Party = GAME().party;

		const parse: any = {
			playername : player.name,
		};

		if (RigardFlags.LB.OrvinIsInnkeeper()) {
			parse.IkName = !RigardFlags.LB.KnowsOrvin() ? "The innkeeper" : "Orvin";
			parse.ikname = !RigardFlags.LB.KnowsOrvin() ? "the innkeeper" : "Orvin";
		} else {
			parse.IkName = rigard.LB.Efri === 0 ? "The girl" : "Efri";
			parse.ikname = rigard.LB.Efri === 0 ? "the girl" : "Efri";
		}

		const roomNr = rigard.LB.RoomNr;
		parse.floor = Text.Ordinal(roomNr / 100);

		Text.Clear();
		Text.Add("You decide to head to your room. You take the stairs at the side of the common room, heading up to the residential floors.", parse);

		// TODO: Drunk function
		if (player.Drunk() < 0.5) {
			Text.NL();
			Text.Add("You follow [ikname]’s directions and find your room on the [floor] floor", parse);

			if (party.Num() === 1) {
				Text.Add(" and head inside.", parse);
				Text.Flush();
				LBScenes.RegularRoom();
			} else if (party.Num() === 2) {
				const p1 = party.Get(1);
				parse.comp = p1.name;
				Text.Add(" and lead [comp] inside.", parse);
				Text.Flush();
				LBScenes.RegularRoom(p1);
			} else { // Party > 2
				parse.s = party.Num() > 3 ? "s" : "";
				Text.Add(", with the extra room for your companion[s] right beside it. Your room only has enough space for two, so you have to decide who will be staying with you.", parse);
				Text.Flush();

				// [Party]
				const options = new Array();
				for (let i = 1; i < party.Num(); i++) {
					const comp = party.Get(i);
					parse.comp    = comp.name;
					options.push({ nameStr : comp.name,
						func(obj: Entity) {
							Text.NL();
							Text.Add("You decide that [comp] can share your room, and lead [chimher] inside.", { comp : obj.name, chimher : obj.himher() });
							Text.Flush();
							LBScenes.RegularRoom(obj);
						}, enabled : true,
						obj : comp,
						tooltip : Text.Parse("Have [comp] stay with you tonight.", parse),
					});
				}
				options.push({ nameStr : "No one",
					func() {
						Text.NL();
						Text.Add("You decide you’ll just take this room for yourself, and head inside.", parse);
						Text.Flush();
						LBScenes.RegularRoom();
					}, enabled : true,
					tooltip : "Have your companions share the other room.",
				});
				Gui.SetButtonsFromList(options);
			}
		} else {
			const randomfloor1 = 2 + Math.floor(Math.random() * 4);
			let randomfloor2 = 2 + Math.floor(Math.random() * 4);
			if (randomfloor1 === randomfloor2) {
				randomfloor2++;
			}
			if (randomfloor2 >= 6) { randomfloor2 = 2; }

			parse.randomfloor1 = Text.Ordinal(randomfloor1);
			parse.randomfloor2 = Text.Ordinal(randomfloor2);

			// DRUNK
			Text.Add("The drinks you had earlier are getting to you as you stumble up the stairs from the common room. You glance around, unable to quite recall what room was supposed to be yours. Was it on the [randomfloor1] floor, or maybe the [randomfloor2] one?", parse);
			Text.NL();

			if (party.NumTotal() > 1) {
				let comp: Entity;

				const scenes = new EncounterTable();
				if (party.InParty(kiakai)) {
					scenes.AddEnc(() => {
						parse.name = kiakai.name;
						Text.Add("<i>“I believe you are inebriated, [playername],”</i> [name] says, blushing slightly. <i>“Please, allow me help you get to the room.”</i>", parse);
						comp = kiakai;
					}, 1.0, () => true);
				}
				if (party.InParty(lei)) {
					scenes.AddEnc(() => {
						Text.Add("<i>“You are drunk,”</i> Lei says, stating the obvious. <i>“Would you like my help getting to the room?”</i>", parse);
						comp = lei;
					}, 1.0, () => true);
				}
				if (party.InParty(gwendy)) {
					scenes.AddEnc(() => {
						Text.Add("<i>“You’re drunk blind!”</i> Gwendy exclaims, amused. <i>“I can drag you over to the room if you’d like.”</i>", parse);
						comp = gwendy;
					}, 1.0, () => true);
				}
				if (party.InParty(miranda)) {
					scenes.AddEnc(() => {
						parse.hisher = player.mfFem("his", "her");
						Text.Add("<i>“Looks like the mighty hero can’t handle [hisher] booze!”</i> Miranda guaffs, reeling slightly herself. <i>“Why don’t I show you to your room, [playername]?”</i> She has a rather dangerous look in her eyes.", parse);
						comp = miranda;
					}, 1.0, () => true);
				}

				if (scenes.Num() === 0) {
					for (let i = 1; i < party.NumTotal(); i++) {
						const randcomp = party.Get(i);
						scenes.AddEnc((obj: Entity) => {
							parse.comp = obj.name;
							Text.Add("<i>“Do you need a hand getting to the room?”</i> [comp] asks, looking mildly concerned.", parse);
							comp = obj;
						}, 1.0, () => true, randcomp);
					}
				}
				scenes.Get();

				parse.comp   = comp.name;
				parse.HeShe  = comp.HeShe();
				parse.heshe  = comp.heshe();
				parse.hisher = comp.hisher();
				parse.himher = comp.himher();

				// [Sure][Nah]
				const options = new Array();
				options.push({ nameStr : "Accept",
					func() {
						Text.Clear();
						Text.Add("You nod, accepting the offer a little sheepishly. You probably do need a little help here.", parse);
						Text.NL();
						Text.Add("With [comp]’s sure steps leading the way, you find your way to the room without incident.", parse);
						Text.Flush();

						LBScenes.RegularRoom(comp);
					}, enabled : true,
					tooltip : Text.Parse("Accept [comp]’s help in getting to your room.", parse),
				});
				options.push({ nameStr : "Decline",
					func() {
						Text.Clear();
						Text.Add("You wave [comp] aside, and stalk off ahead of [himher], trying to seem confident. Behind you, you hear [himher] trailing after you, even [hisher] steps sounding doubtful. Well, you’ll show [himher].", parse);
						Text.NL();
						Text.Add("It takes you a while, but after wandering around the halls and going up and down stairs a few times, you finally reach a room that you’re sure is the one the innkeeper gave you.");
						Text.Flush();

						LBScenes.RandomRoom(comp);
					}, enabled : true,
					tooltip : "You can find the way to your room on your own. Probably.",
				});
				Gui.SetButtonsFromList(options);
			} else { // No companions
				Text.Add("Pushing aside your uncertainty, you press onward. You’re sure you’ll find it somehow. ");
				Text.Add("It takes you a while, but after wandering around the halls and going up and down stairs a few times, you finally reach a room that you’re sure is the one the innkeeper gave you.");

				LBScenes.RandomRoom();
			}

			Text.Flush();
		}
	}

	export function RandomRoom(companion?: Entity) {
		const rigard = GAME().rigard;
		const room69 = GAME().room69;

		const parse: any = {
			roomNr : rigard.LB.RoomNr,
		};
		Text.NL();
		if (Math.random() < 0.5) { // actual room
			parse.c = companion ? Text.Parse(", [comp] behind you", {comp: companion.name}) : "";
			Text.Add("Room [roomNr] - perfect. You shuffle inside[c], happy with your accomplishment.", parse);
			Text.Flush();
			LBScenes.RegularRoom(companion);
		} else if (room69.flags.Rel === Room69Flags.RelFlags.NotMet) {
			// First time
			Text.Add("Room 369 - perfect. You shove open the door, a little surprised to find it unlocked, and push through, stumbling slightly.", parse);
			Text.NL();
			if (companion) {
				Text.Add("Behind you, you hear [comp]’s alarmed voice, as the door slams shut, seemingly of its own volition. Confused and a little startled, you stumble toward the bed, grabbing on to one of the bedposts for balance.", {comp: companion.name});
			} else {
				Text.Add("As you reach the bed and grab onto a bedpost for balance, you hear the door slam shut behind you.", parse);
			}
			Text.Flush();

			Gui.NextPrompt(Room69Scenes.Discovering69);
		} else {
			// TODO: Adjust arriving at 69 for repeat scenes. For now. Finds the regular room
			// COPIED
			parse.c = companion ? Text.Parse(", [comp] behind you", {comp: companion.name}) : "";
			Text.Add("Room [roomNr] - perfect. You shuffle inside[c], happy with your accomplishment.", parse);
			Text.Flush();
			LBScenes.RegularRoom(companion);
		}
	}

	export function RegularRoom(companion?: Entity) {
		const rigard = GAME().rigard;
		const party: Party = GAME().party;
		const room = InnLoc.Room;
		rigard.LB.RoomComp = party.GetSlot(companion);
		MoveToLocation(room, {minute : 5});
	}

}

InnLoc.Room.SaveSpot = "LB";
InnLoc.Room.safe = () => true;
InnLoc.Room.description = () => {
	Text.Add("A pair of large beds stand at opposite walls, with a small table, four chairs, and a cabinet between them. The room is spotless, not a single spec of dust anywhere, and the furniture is decorated with tasteful ironwork and carvings. Approaching a bed, you find that the sheets have a light lemony scent about them. You touch a pillow, and your finger sinks gently into its downy softness. Sleeping here would probably be incredibly refreshing and comfortable. Or you could also do something else.");
	Text.NL();
	Text.Flush();
};
InnLoc.Room.events.push(new Link(
	() => {
		const rigard = GAME().rigard;
		const party: Party = GAME().party;
		const companion = party.Get(rigard.LB.RoomComp);
		if (companion) { return companion.name; }
	}, () => GAME().rigard.LB.RoomComp >= 1, true,
	() => {
		const rigard = GAME().rigard;
		const party: Party = GAME().party;
		const companion = party.Get(rigard.LB.RoomComp);
		if (companion) {
			const parse: any = {
				name   : companion.name,
				hisher : companion.hisher(),
			};
			Text.Add("[name] is sitting on [hisher] bed, watching you. ", parse);
		}
	},
	() => {
		const rigard = GAME().rigard;
		const party: Party = GAME().party;
		const companion = party.Get(rigard.LB.RoomComp);
		if (companion) {
			companion.InnPrompt();
		}
	},
));
InnLoc.Room.SleepFunc = () => {
	const rigard = GAME().rigard;
	const player = GAME().player;
	const party: Party = GAME().party;
	const comp = party.Get(rigard.LB.RoomComp);
	const parse: any = {

	};
	if (comp) {
		parse.comp    = comp.name;
		parse.HeShe   = comp.HeShe();
		parse.heshe   = comp.heshe();
		parse.hishers = comp.hishers();
	}
	SetGameState(GameState.Event, Gui);
	Text.Clear();
	if (player.Drunk() < 0.5) {
		Text.Add("You undress and climb into bed,");
		if (comp) {
			Text.Add(" wishing [comp] good dreams as [heshe] climbs into [hishers],", parse);
		}
		Text.Add(" and let the softness envelop you. Feeling completely safe and comfortable in the wonderful bed, you quickly drift off to sleep.", parse);
	} else {
		parse.light = WorldTime().LightStr("close the shutters", "blow out the candles");
		Text.Add("You clumsily strip off your clothes before collapsing onto the bed. Somehow, you manage to remember to down the glass of water on the nightstand before you pass out into a deep sleep, without even bothering to [light].", parse);
	}
	Text.Flush();

	const func = (dream: boolean) => {
		TimeStep({hour: 8});
		party.Sleep();

		if (!dream) {
			Text.Add("You wake up well rested and feeling completely refreshed. You’re are a bit reluctant to climb out of the bed, but you do so and get dressed, feeling energized, and knowing there is much you can still accomplish today.");
		}
		Text.NL();

		if (rigard.LBroomTimer.Expired()) {
			if (RigardFlags.LB.OrvinIsInnkeeper()) {
				parse.ikname = !RigardFlags.LB.KnowsOrvin() ? "the innkeeper" : "Orvin";
			} else {
				parse.ikname = rigard.LB.Efri === 0 ? "the girl" : "Efri";
			}

			Text.Add("You notice that it's rather late, and you were actually supposed to leave the room already. You decide that overstaying a little can't hurt much as you pack your things and head back downstairs. Entering the common room, you notice [ikname] frowning slightly in your direction.", parse);
			Text.NL();
			party.location = InnLoc.Common;
		}

		Text.Flush();
		Gui.PrintDefaultOptions(true);
	};
	Gui.NextPrompt(() => {
		Text.Clear();

		DreamsScenes.Entry(func);
	});
};

InnLoc.Room.links.push(new Link(
	"Leave", true, true,
	() => {
		Text.Add("You could head back downstairs. ");
	},
	() => {
		MoveToLocation(InnLoc.Common, {minute: 5});
	},
));

// SET UP EVENTS/LINKS
InnLoc.Common.events.push(new Link(
	"Order food",
	true, () => {
		const party: Party = GAME().party;
		return party.coin >= RigardFlags.LB.MealCost();
	},
	() => {
		const parse: any = {
			mealcost : RigardFlags.LB.MealCost(),
		};
		const busy = RigardFlags.LB.Busy();
		if (busy === RigardFlags.LB.BusyState.busy) {
			Text.Add("A large number of waiters and waitresses walk the floor, taking orders and delivering food and drinks from the back. They’re very busy, but the staff still look energetic and professional. You could wave one of them over and order a meal - you suspect it would cost around [mealcost] coins here.", parse);
		} else {
			Text.Add("You see a man and a woman in prim waiters’ uniforms standing and chatting by the front counter. Looks like they’re not too busy right now. You could call one of them over and order a meal - you suspect it would cost around [mealcost] coins here.", parse);
		}
		Text.NL();
		Text.Flush();
	},
	LBScenes.OrderFood,
));

InnLoc.Common.events.push(new Link(
	() => {
		const rigard = GAME().rigard;
		if (RigardFlags.LB.OrvinIsInnkeeper()) {
			return !RigardFlags.LB.KnowsOrvin() ? "Innkeeper" : "Orvin";
		} else {
			return rigard.LB.Efri === 0 ? "Girl" : "Efri";
		}
	},
	true, true,
	() => {
		const rigard = GAME().rigard;
		const parse: any = {};
		const busy = RigardFlags.LB.Busy();

		if (RigardFlags.LB.OrvinIsInnkeeper()) {
			if (!RigardFlags.LB.KnowsOrvin()) {
				Text.Add("At the bar stands a serious-looking man, dressed more like a wealthy merchant than a purveyor of alcoholic beverages.");
			} else  { // Know
				Text.Add("Orvin stands at the bar, looking serious, as always. He’s dressed more like a wealthy merchant than a purveyor of alcoholic beverages.");
			}

			if (busy === RigardFlags.LB.BusyState.busy) {
				Text.Add(" He listens to orders and dispenses drinks with remarkable agility, while also helping out the staff whenever they come to him for assistance.");
			} else {
				Text.Add(" He looks a little bored, cleaning glasses idly, while he waits for an order to come in.");
			}
		} else {
			if (rigard.LB.Efri === 0) {
				Text.Add("A pretty black-haired girl wearing a beret is sitting on a high stool at the bar. She looks about twenty - younger than the waiter helping her out. You wonder why someone like her is watching the inn.");
			} else  { // Know
				const tasks = [
				"idly spinning a coin",
				"reading a book by candlelight",
				"tapping out a quiet tune on the countertop",
				"looking off disinterestedly into the distance",
				"playing some sort of game with a string between her fingers",
				"idly looking over the drinks on tap",
				];
				efriaction = tasks[Math.floor(Math.random() * tasks.length)];
				parse.task = efriaction;
				Text.Add("Efri is at her post, minding the inn. She’s [task], but glances up when she hears you come in.", parse);
			}
		}
		Text.NL();
		Text.Flush();
	},
	() => {
		if (RigardFlags.LB.OrvinIsInnkeeper()) {
			LBScenes.OrvinPrompt();
		} else {
			LBScenes.EfriPrompt();
		}
	},
));

InnLoc.Common.events.push(new Link(
	() => {
		const lei = GAME().lei;
		return lei.flags.Met >= LeiFlags.Met.KnowName ? "Lei" : "Stranger";
	},
	() => GAME().lei.IsAtLocation(InnLoc.Common), () => {
		const rigard = GAME().rigard;
		return rigard.flags.RoyalAccessTalk > 0;
	},
	() => { LeiScenes.Desc(); },
	() => { LeiScenes.Interact(); },
));

InnLoc.Common.events.push(new Link(
	"Room", RigardFlags.LB.HasRentedRoom, true,
	() => {
		if (RigardFlags.LB.HasRentedRoom()) {
			Text.Add("You’ve rented a room at the Lady’s Blessing until the next noon, so you can head up there if you want.");
			Text.NL();
			Text.Flush();
		}
	},
	LBScenes.GotoRoom,
));

InnLoc.Common.events.push(new Link(
	"Room 369", () => {
		const room69 = GAME().room69;
		return room69.flags.Rel !== Room69Flags.RelFlags.NotMet;
	}, true,
	() => {
		const room69 = GAME().room69;
		if (room69.flags.Rel !== Room69Flags.RelFlags.NotMet) {
			Text.Add("You could head up to the sentient room Sixtynine.");
			Text.NL();
			Text.Flush();
		}
	},
	() => {
		const room69 = GAME().room69;
		if (room69.flags.Rel === Room69Flags.RelFlags.BadTerms) {
			Room69Scenes.ApologizeTo69ForBeingMean();
		} else if (room69.flags.Rel === Room69Flags.RelFlags.BrokeDoor) {
			Room69Scenes.ApologizeTo69ForBreakingDoor();
		} else { // TODO: Additional options?
			Room69Scenes.Normal69();
		}
	},
));

export { InnLoc };
