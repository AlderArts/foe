/*
 *
 * Define Cassidy
 *
 */

import { Abilities } from "../abilities";
import { Images } from "../assets";
import { Race } from "../body/race";
import { Element } from "../damagetype";
import { EncounterTable } from "../encountertable";
import { Entity, ICombatEncounter, ICombatOrder } from "../entity";
import { GAME } from "../GAME";
import { IStorage } from "../istorage";
import { Item } from "../item";
import { ArmorItems } from "../items/armor";
import { WeaponsItems } from "../items/weapons";
import { Shop } from "../shop";
import { Text } from "../text";
import { ITime, Time } from "../time";
import { CassidyFlags } from "./cassidy-flags";
import { GlobalScenes } from "./global";

export class Cassidy extends Entity {
	public orderTimer: Time;
	public femTimer: Time;
	public shop: Shop;
	public shopItems: Item[];

	constructor(storage?: IStorage) {
		super();

		this.ID = "cassidy";

		// Character stats
		this.name = "Cassidy";

		this.body.DefFemale();
		this.FirstBreastRow().size.base = 2;
		this.body.SetRace(Race.Salamander);

		this.FirstVag().capacity.base = 10;
		this.FirstVag().virgin = false;
		this.Butt().capacity.base = 20;
		this.Butt().virgin = false;

		this.flags.Met   = CassidyFlags.Met.NotMet;
		this.flags.Talk  = 0; // Bitmask
		this.flags.SparL = 0; // Times lost
		this.flags.Order = CassidyFlags.Order.None;
		this.orderTimer = new Time();
		// Use for feminize
		this.femTimer   = new Time();

		// Shop stuff
		this.shop = CreateShop(this);
		this.flags.shop     = 0;
		this.shopItems = [];

		this.shopItems.push(WeaponsItems.Dagger);
		this.shopItems.push(WeaponsItems.Rapier);
		this.shopItems.push(WeaponsItems.WoodenStaff);
		this.shopItems.push(WeaponsItems.ShortSword);
		this.shopItems.push(WeaponsItems.GreatSword);
		this.shopItems.push(WeaponsItems.OakSpear);
		this.shopItems.push(WeaponsItems.Halberd);
		this.shopItems.push(WeaponsItems.HeavyFlail);
		this.shopItems.push(WeaponsItems.WarHammer);

		if (storage) { this.FromStorage(storage); }
	}

	public Update(step: ITime) {
		super.Update(step);

		this.orderTimer.Dec(step);
		this.femTimer.Dec(step);
	}

	public FromStorage(storage: any) {
		this.Butt().virgin     = parseInt(storage.avirgin, 10) === 1;
		this.FirstVag().virgin = parseInt(storage.virgin, 10)  === 1;

		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
		this.LoadSexFlags(storage);

		this.orderTimer.FromStorage(storage.oTime);
		this.femTimer.FromStorage(storage.fTime);
	}

	public ToStorage() {
		const storage: any = {
			avirgin : this.Butt().virgin ? 1 : 0,
			virgin  : this.FirstVag().virgin ? 1 : 0,
		};

		this.SavePersonalityStats(storage);

		this.SaveFlags(storage);
		this.SaveSexFlags(storage);

		storage.oTime = this.orderTimer.ToStorage();
		storage.fTime = this.femTimer.ToStorage();

		return storage;
	}

	// Pronoun stuff
	public KnowGender() {
		return this.flags.Met >= CassidyFlags.Met.KnowGender;
	}
	public Feminized() {
		return this.flags.Met >= CassidyFlags.Met.Feminized;
	}

	public heshe() {
		if (this.KnowGender()) { return "she"; } else { return "he"; }
	}
	public HeShe() {
		if (this.KnowGender()) { return "She"; } else { return "He"; }
	}
	public himher() {
		if (this.KnowGender()) { return "her"; } else { return "him"; }
	}
	public HimHer() {
		if (this.KnowGender()) { return "Her"; } else { return "Him"; }
	}
	public hisher() {
		if (this.KnowGender()) { return "her"; } else { return "his"; }
	}
	public HisHer() {
		if (this.KnowGender()) { return "Her"; } else { return "His"; }
	}
	public hishers() {
		if (this.KnowGender()) { return "hers"; } else { return "his"; }
	}
	public mfPronoun(male: any, female: any) {
		if (this.KnowGender()) { return female; } else { return male; }
	}
}

// SPARRING
export class CassidySpar extends Entity {
	public reflexFlag: boolean;

	constructor() {
		super();

		const cassidy: Cassidy = GAME().cassidy;

		this.ID = "cassidyspar";

		// Character stats
		this.name = "Cassidy";

		this.avatar.combat = Images.cassidy;

		this.maxHp.base        = 300; this.maxHp.growth       = 15;
		this.maxSp.base        = 90; this.maxSp.growth        = 8;
		this.maxLust.base      = 50; this.maxLust.growth      = 6;
		// Main stats
		this.strength.base     = 26; this.strength.growth     = 2;
		this.stamina.base      = 24; this.stamina.growth      = 2;
		this.dexterity.base    = 19; this.dexterity.growth    = 1.6;
		this.intelligence.base = 18; this.intelligence.growth = 1.6;
		this.spirit.base       = 13; this.spirit.growth       = 1.2;
		this.libido.base       = 17; this.libido.growth       = 1.2;
		this.charisma.base     = 14; this.charisma.growth     = 1.2;

		let levelLimit = 6 + cassidy.flags.SparL * 2;
		// In act 1, max out at level 14
		if (!GlobalScenes.PortalsOpen()) {
			levelLimit = Math.min(levelLimit, 14);
		}

		const level = Math.min(levelLimit, GAME().player.level);

		this.level    = level;
		this.sexlevel = 3;

		this.elementDef.dmg[Element.mFire]  = 1;
		this.elementDef.dmg[Element.mIce]   = -0.5;
		this.elementDef.dmg[Element.mWater] = -0.5;

		this.body.DefFemale();
		this.FirstBreastRow().size.base = 2;
		this.body.SetRace(Race.Salamander);

		this.FirstVag().capacity.base = 10;
		this.FirstVag().virgin = false;
		this.Butt().capacity.base = 20;
		this.Butt().virgin = false;

		this.weaponSlot   = WeaponsItems.WarHammer;
		this.topArmorSlot = ArmorItems.BronzeChest;
		this.botArmorSlot = ArmorItems.BronzeLeggings;

		this.Equip();
		this.SetLevelBonus();
		this.RestFull();
	}

	public Act(encounter: ICombatEncounter, activeChar: ICombatOrder) {
		const that = this;
		// TODO: Very TEMP
		Text.Add(this.name + " acts! Rawr!");
		Text.NL();
		Text.Flush();

		// Pick a random target
		const t = this.GetSingleTarget(encounter, activeChar);

		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Abilities.Attack.Use(encounter, that, t);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Abilities.Physical.Bash.Use(encounter, that, t);
		}, 1.0, () => Abilities.Physical.Bash.enabledCondition(encounter, that));
		scenes.AddEnc(() => {
			Abilities.Physical.DAttack.Use(encounter, that, t);
		}, 1.0, () => Abilities.Physical.DAttack.enabledCondition(encounter, that));
		scenes.AddEnc(() => {
			Abilities.EnemySkill.Cassidy.TailSlap.Use(encounter, that, t);
		}, 1.0, () => Abilities.EnemySkill.Cassidy.TailSlap.enabledCondition(encounter, that));
		scenes.AddEnc(() => {
			Abilities.EnemySkill.Cassidy.Smoke.Use(encounter, that, t);
		}, 1.0, () => Abilities.EnemySkill.Cassidy.Smoke.enabledCondition(encounter, that));
		scenes.AddEnc(() => {
			Abilities.Seduction.Tease.Use(encounter, that, t);
		}, 1.0, () => true);

		// Conditional abilities (only available at higher Cass levels)

		if (that.level >= 10) {
			if (!that.reflexFlag) {
				scenes.AddEnc(() => {
					Abilities.EnemySkill.Cassidy.Reflex.Use(encounter, that, t);
				}, 1.0, () => Abilities.EnemySkill.Cassidy.Reflex.enabledCondition(encounter, that));
			}
		}

		if (that.level >= 14) {
			scenes.AddEnc(() => {
				Abilities.EnemySkill.Cassidy.Impact.Use(encounter, that, t);
			}, 1.0, () => Abilities.EnemySkill.Cassidy.Impact.enabledCondition(encounter, that));
		}

		scenes.Get();
	}

	public PhysDmgHP(encounter: any, caster: Entity, val: number) {
		const parse: any = {};

		if (this.reflexFlag) {
			Text.Add("Before your attack connects, Cassidy dances out of the way so quickly that the salamander smith is practically a blur. Your wasted attack goes wide, and she gives you one of her trademark shit-eating grins.", parse);
			Text.NL();
			Text.Add("Hey!", parse);
			Text.NL();
			Text.Add("<i>“What?”</i> Cassidy snickers. <i>“You thought I was just gonna stand there and take it like a champ?”</i>", parse);
			Text.Flush();

			this.reflexFlag = false;

			return false;
		} else {
			return super.PhysDmgHP(encounter, caster, val);
		}
	}
}

const CreateShop = (cassidy: Cassidy) => {
	return new Shop({
		buyPromptFunc(item: Item, cost: number, bought: boolean) {
			const coin = Text.NumToText(cost);
			let parse: any = {
				item : item.sDesc(),
				coin,
			};
			parse = cassidy.ParserPronouns(parse);
			if (!bought) {
				Text.Clear();
				Text.Add("Right. Stepping up to Cassidy, you inquire about buying the [item] for yourself, if it’s not too much of a bother. ", parse);

				const scenes = new EncounterTable();
				scenes.AddEnc(() => {
					Text.Add("<i>“Nah, it’s no bother - always happy to serve a reasonable customer. For you, that’ll be [coin] coins.”</i>", parse);
					Text.NL();
					Text.Add("For you? Why, you feel so special and treasured!", parse);
					Text.NL();
					Text.Add("Cass shows you [hisher] teeth. <i>“Thing about you, ace? Sometimes, I can’t tell if you’re serious or kidding. But yeah, [coin] coins, them’s the breaks. You want it?”</i>", parse);
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Add("<i>“Oh, that’s a good choice you have there,”</i> Cass replies, studying you up and down as if you were a really tasty morsel. <i>“Really fits you - you look braver just holding it. How about [coin] coins?”</i>", parse);
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Add("Cassidy frowns. <i>“That one? I didn’t think - well, if you want to… [coin] coins if you wanna take that baby of mine home, I guess.”</i>", parse);
					Text.NL();
					Text.Add("Hey, why the sudden reluctance? This is a shop, isn’t it?", parse);
					Text.NL();
					Text.Add("The salamander grins weakly and looks away, unable to meet your eyes. <i>“Yeah, I get that. Problem is, well, it’s sometimes hard to see them go… look, if you want her, just pay up and you can have her.”</i>", parse);
				}, 1.0, () => true);
				scenes.Get();
				Text.NL();
			}
		},
		buySuccessFunc(item: Item, cost: number, num: number) {
			let parse: any = {
				num : num > 1 ? "them" : "it",
				her : num > 1 ? "them" : "her",
				y   : num > 1 ? "ies" : "y",
			};
			parse = cassidy.ParserPronouns(parse);

			Text.Clear();
			Text.Add("<i>“Gotcha. Give me a moment, and I’ll have [num] ready for you.”</i>", parse);
			Text.NL();
			Text.Add("As you watch, Cass nips over to the racks behind the counter and draws out what you selected from [hisher] stock, holding [num] up for your inspection.", parse);
			Text.NL();
			Text.Add("<i>“You wanna make sure there’s nothing wrong with [her] before I wrap [her] up?”</i>", parse);
			Text.NL();
			Text.Add("Nah, it’s fine. You’ll trust [himher].", parse);
			Text.NL();
			Text.Add("<i>“All right then, ace! You take good care of my bab[y], you hear?”</i> Before too long, Cass passes you a small bundle wrapped in oilcloth. <i>“Hope you have a good time together!”</i>", parse);
			Text.NL();
			Text.Add("<i>“Right! You want anything else?”</i>", parse);
			Text.NL();

			cassidy.relation.IncreaseStat(30, 2);
		},
		buyFailFunc(item: Item, cost: number, bought: boolean) {
			let parse: any = {

			};
			parse = cassidy.ParserPronouns(parse);

			Text.Clear();
			Text.Add("Hmm. On second thought, maybe not.", parse);
			Text.NL();
			Text.Add("<i>“Changed your mind?”</i> Cass’ tail seems a little warmer and more agitated than normal - its tip twitches to and fro on the ground. <i>“Anything wrong with it?”</i>", parse);
			Text.NL();
			Text.Add("No, no, there’s nothing wrong with [hisher] workmanship. You just thought better of it, that’s all.", parse);
			Text.NL();
			Text.Add("<i>“Oh, all right then. If you say so.”</i> Cass still looks worried and unsure, but you guess that just shows how seriously [heshe] takes [hisher] work. <i>“You still interested in something?”</i>", parse);
			Text.NL();
		},
		sellPromptFunc(item: Item, cost: number, sold: boolean) {
			const coin = Text.NumToText(cost);
			let parse: any = {
				item : item.sDesc(),
				coin,
			};
			parse = cassidy.ParserPronouns(parse);

			if (!sold) {
				Text.Clear();
				const scenes = new EncounterTable();
				scenes.AddEnc(() => {
					Text.Add("Cass throws your proffered item a quick glance of [hisher] expert eye. <i>“Yeah, ace. For that, I’ll do [coin] coins, perfectly reasonable price to me. Sound good to you?”</i>", parse);
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Add("Cass makes a show of examining your proffered item, then grins and snaps [hisher] fingers with an audible click of [hisher] claws. <i>“Okay, here’s my offer: [coin] coins. Deal, or no deal?”</i>", parse);
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Add("Cass looks down at your offering. <i>“Hmm. Hmmmmmmm.”</i>", parse);
					Text.NL();
					Text.Add("Hmm?", parse);
					Text.NL();
					Text.Add("<i>“Hmm.”</i> [HeShe] looks up at you. <i>“I guess I can do [coin] coins, if you’d like. Scrap value isn’t usually worth a lot.”</i>", parse);
				}, 1.0, () => true);
				scenes.Get();

				Text.NL();
			}
		},
		sellSuccessFunc(item: Item, cost: number, num: number) {
			let parse: any = {

			};
			parse = cassidy.ParserPronouns(parse);

			Text.Clear();
			Text.Add("Sure, some price is better than no price, after all. You pass your offering over to Cass, who lazily grabs it with [hisher] tail and tosses into the scrap heap with a bunch all the other waste waiting to be reforged.", parse);
			Text.NL();
			Text.Add("<i>“That’ll do, that’ll do… damn, I really hate bookkeeping…”</i> the salamander mutters as [heshe] scribbles in a ledger, then slams it shut and counts out your money. <i>“Okay, there I go, and here you are. Enjoy!”</i> ", parse);
			Text.NL();
		},
		sellFailFunc(item: Item, cost: number, sold: boolean) {
			let parse: any = {
				item : item.sDesc(),
			};
			parse = cassidy.ParserPronouns(parse);

			Text.Clear();
			Text.Add("<i>“Eh? Suit yourself,”</i> Cass replies with a shrug. <i>“I guess it’s a better fate than being taken apart and melted down for scrap...there’s still some use out of it, really. You want to sell anything else?”</i>", parse);
			Text.NL();
		},
	});
};
