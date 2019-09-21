/*
 *
 * Define Terry
 *
 */

import { GetDEBUG } from "../../app";
import { Abilities } from "../abilities";
import { Images } from "../assets";
import { Cock } from "../body/cock";
import { Color } from "../body/color";
import { Gender } from "../body/gender";
import { Race } from "../body/race";
import { Vagina } from "../body/vagina";
import { Entity, ICombatEncounter, ICombatOrder } from "../entity";
import { GAME } from "../GAME";
import { Gui } from "../gui";
import { Item } from "../item";
import { CombatItems } from "../items/combatitems";
import { WeaponsItems } from "../items/weapons";
import { JobDesc, Jobs } from "../job";
import { RigardLoc } from "../loc/rigard/rigard-scenes";
import { Text } from "../text";
import { TerryFlags } from "./terry-flags";
import { TerryScenes } from "./terry-scenes";

export class Terry extends Entity {
	public sbombs: number;
	public hidingSpot: any;
	public turnCounter: number;

	constructor(storage?: any) {
		super();

		this.ID = "terry";

		// Character stats
		this.name = "Thief";
		this.monsterName = "the thief";
		this.MonsterName = "The thief";

		this.avatar.combat = Images.terry;

		this.currentJob = Jobs.Rogue;
		this.jobs.Fighter   = new JobDesc(Jobs.Fighter);
		this.jobs.Fighter.level = 3;
		this.jobs.Fighter.mult  = 2;
		this.jobs.Rogue     = new JobDesc(Jobs.Rogue);
		this.jobs.Ranger    = new JobDesc(Jobs.Ranger);    this.jobs.Ranger.mult    = 2;
		this.jobs.Scholar   = new JobDesc(Jobs.Scholar);   this.jobs.Scholar.mult   = 3;
		this.jobs.Courtesan = new JobDesc(Jobs.Courtesan); this.jobs.Courtesan.mult = 2;

		this.jobs.Mage      = new JobDesc(Jobs.Mage);   this.jobs.Mage.mult   = 2;
		this.jobs.Mystic    = new JobDesc(Jobs.Mystic); this.jobs.Mystic.mult = 2;
		this.jobs.Healer    = new JobDesc(Jobs.Healer); this.jobs.Healer.mult = 2;

		this.jobs.Hypnotist = new JobDesc(Jobs.Hypnotist);

		this.maxHp.base        = 50;
		this.maxSp.base        = 60; this.maxSp.growth        = 6;
		this.maxLust.base      = 50;
		// Main stats
		this.strength.base     = 13;
		this.stamina.base      = 10;
		this.dexterity.base    = 24; this.dexterity.growth    = 1.5;
		this.intelligence.base = 15; this.intelligence.growth = 1.2;
		this.spirit.base       = 13;
		this.libido.base       = 15; this.libido.growth       = 1.1;
		this.charisma.base     = 20; this.charisma.growth     = 1.3;

		this.level    = 5;
		this.sexlevel = 1;
		this.SetExpToLevel();

		this.body.DefMale();
		this.body.muscleTone.base = 0.1;
		this.body.femininity.base = 0.9;
		this.Butt().buttSize.base = 3;
		this.SetSkinColor(Color.gold);
		this.SetHairColor(Color.red);
		this.SetEyeColor(Color.blue);
		this.body.SetRace(Race.Fox);
		this.body.height.base      = 157;
		this.body.weigth.base      = 45;

		this.weaponSlot   = WeaponsItems.Dagger;

		this.Equip();
		this.SetLevelBonus();
		this.RecallAbilities();
		this.RestFull();

		this.flags.Met   = 0;
		this.flags.Saved = 0;
		this.flags.PrefGender = Gender.male;
		this.flags.Skin = 0;
		this.flags.BM = 0;
		this.flags.pQ = 0;
		this.flags.xLick = 0; // lick butt in buttfuck
		this.flags.Rogue = 0;
		this.flags.TF = TerryFlags.TF.NotTried;
		this.flags.TFd = 0;
		this.flags.xLact = 0;
		this.flags.maxPast = 0;
		this.flags.rotPast = 0;
		this.flags.vFirst = 0;
		this.flags.caFirst = 0; // Catch anal (terry pitching)
		this.flags.vengeance = TerryFlags.Vengeance.NotTriggered;
		// TF state
		this.flags.breasts = TerryFlags.Breasts.Flat;
		this.flags.lact = 0;
		this.flags.vag  = TerryFlags.Pussy.None;
		this.flags.cock = TerryFlags.Cock.Regular;

		this.sbombs = 3;
		this.hidingSpot = RigardLoc.ShopStreet.Street;

		if (storage) { this.FromStorage(storage); }

		this.SetBreasts();
		this.SetLactation();
		this.SetCock();
	}

	public Changed() {
		return this.flags.breasts !== 0 ||
			this.flags.vag     !== 0 ||
			this.flags.cock    !== 0;
	}

	public Recruited() {
		return this.flags.Saved >= TerryFlags.Saved.Saved;
	}

	public FromStorage(storage: any) {
		this.body.FromStorage(storage.body);
		this.LoadLactation(storage);
		this.LoadPregnancy(storage);

		// Load flags
		this.LoadFlags(storage);
		this.LoadSexFlags(storage);
		this.LoadCombatStats(storage);
		this.LoadPersonalityStats(storage);

		this.LoadJobs(storage);
		this.LoadEquipment(storage);

		this.RecallAbilities();
		this.SetLevelBonus();
		this.Equip();

		if (this.flags.Met >= TerryFlags.Met.Caught || this.Recruited()) {
			this.name = "Terry";
			this.avatar.combat = Images.terry_c;
			this.monsterName = undefined;
			this.MonsterName = undefined;
		}
	}

	public ToStorage() {
		const storage: any = {};
		this.SaveBodyPartial(storage, {ass: true, vag: true, balls: true});
		this.SaveLactation(storage);
		this.SavePregnancy(storage);

		// Save flags
		this.SaveFlags(storage);
		this.SaveSexFlags(storage);
		this.SaveCombatStats(storage);
		this.SavePersonalityStats(storage);

		this.SaveJobs(storage);
		this.SaveEquipment(storage);

		return storage;
	}

	public SetBreasts() {
		switch (this.flags.breasts) {
			default:
			case TerryFlags.Breasts.Flat:
				this.FirstBreastRow().size.base = 1;
				break;
			case TerryFlags.Breasts.Acup:
				this.FirstBreastRow().size.base = 3;
				break;
			case TerryFlags.Breasts.Bcup:
				this.FirstBreastRow().size.base = 5;
				break;
			case TerryFlags.Breasts.Ccup:
				this.FirstBreastRow().size.base = 7.5;
				break;
			case TerryFlags.Breasts.Dcup:
				this.FirstBreastRow().size.base = 10;
				break;
		}
	}
	public SetLactation() {
		if (this.flags.lact !== 0) {
			this.lactHandler.milkProduction.base = 3;
			this.lactHandler.lactationRate.base = 1;
			this.lactHandler.lactating = true;
		} else {
			this.lactHandler.milkProduction.base = 0;
			this.lactHandler.lactationRate.base = 0;
			this.lactHandler.lactating = false;
		}
	}
	public Lactation() {
		return this.flags.lact !== 0;
	}
	public SetPussy() {
		const vag = this.flags.vag;
		if (vag === TerryFlags.Pussy.None) {
			if (this.FirstVag()) {
				this.body.vagina = [];
			}
		} else if (this.NumVags() === 0) {
			this.body.vagina.push(new Vagina());
			if (vag === TerryFlags.Pussy.Used) {
				this.FirstVag().virgin = false;
			}
		}
	}
	public SetCock() {
		this.body.cock = [];
		if (this.flags.cock === TerryFlags.Cock.Regular) {
			this.body.cock.push(new Cock());
			this.FirstCock().length.base = 8;
			this.FirstCock().thickness.base = 2;
			this.FirstCock().race = Race.Fox;
			this.FirstCock().knot = 1;
			this.Balls().cumCap.base = 5;
			this.Balls().size.base  = 2;
			this.Balls().count.base = 2;
		} else if (this.flags.cock === TerryFlags.Cock.Horse) {
			this.body.cock.push(new Cock());
			this.FirstCock().length.base = 28;
			this.FirstCock().thickness.base = 6;
			this.FirstCock().race = Race.Horse;
			this.FirstCock().knot = 1;
			this.Balls().cumCap.base = 10;
			this.Balls().size.base  = 5;
			this.Balls().count.base = 2;
		} else { // None
			this.Balls().count.base = 0;
		}
	}

	public PronounGender() {
		return this.flags.PrefGender;
	}

	public heshe() {
		const gender = this.flags.PrefGender;
		if (gender === Gender.male) { return "he"; } else { return "she"; }
	}
	public HeShe() {
		const gender = this.flags.PrefGender;
		if (gender === Gender.male) { return "He"; } else { return "She"; }
	}
	public himher() {
		const gender = this.flags.PrefGender;
		if (gender === Gender.male) { return "him"; } else { return "her"; }
	}
	public HimHer() {
		const gender = this.flags.PrefGender;
		if (gender === Gender.male) { return "Him"; } else { return "Her"; }
	}
	public hisher() {
		const gender = this.flags.PrefGender;
		if (gender === Gender.male) { return "his"; } else { return "her"; }
	}
	public HisHer() {
		const gender = this.flags.PrefGender;
		if (gender === Gender.male) { return "His"; } else { return "Her"; }
	}
	public hishers() {
		const gender = this.flags.PrefGender;
		if (gender === Gender.male) { return "his"; } else { return "hers"; }
	}
	public mfPronoun(male: any, female: any) {
		const gender = this.flags.PrefGender;
		if (gender === Gender.male) { return male; } else { return female; }
	}

	public HorseCock() {
		return (this.FirstCock() && this.FirstCock().race.isRace(Race.Horse));
	}
	public Cup() {
		return this.flags.breasts;
	}

	public FuckVag(vag: Vagina, cock: Cock, expMult: number) {
		this.flags.vag = TerryFlags.Pussy.Used;
		super.FuckVag(vag, cock, expMult);
	}

	public PussyVirgin() {
		return this.flags.vFirst === 0;
	}

	// Party interaction
	public Interact(switchSpot: boolean) {
		const terry: Terry = GAME().terry;

		const parse: any = {
			foxvixen : terry.mfPronoun("fox", "vixen"),
			HeShe   : terry.HeShe(),
			heshe   : terry.heshe(),
			HisHer  : terry.HisHer(),
			hisher  : terry.hisher(),
			himher  : terry.himher(),
			hishers : terry.hishers(),
			truegender : Gender.Desc(terry.Gender()),
			armordesc() { return terry.ArmorDescLong(); },
			weapondesc() { return terry.WeaponDescLong(); },
		};

		Text.Clear();
		Text.Add("Terry is a [truegender] fox-morph follower you 'recruited' from Rigard’s Jail; [heshe]’s currently wearing [armordesc] and wielding [weapondesc].", parse);
		Text.NL();
		if (terry.Relation() < 30) {
			Text.Add("[HeShe] occasionally scratches [hisher] neck, around the enchanted collar you gave [himher] to ensure [heshe]’s kept under control. Sometimes, [heshe] gives you an irritated glance when [heshe] thinks you’re not looking.", parse);
		} else if (terry.Relation() < 60) {
			Text.Add("Around [hisher] neck is an enchanted collar that prevents [himher] from leaving you or otherwise disobeying you. It was the only way you could take the petite [foxvixen] away from the death row. It’s probably a good thing [heshe]’s wearing it too; considering [hisher] thieving past, there’s no guarantee [heshe] won’t get in trouble again. When [heshe] spots you looking, [heshe] quickly nods in acknowledgement at you.", parse);
		} else if (terry.flags.pQ >= TerryFlags.PersonalQuest.Completed) {
			Text.Add("The [foxvixen] is always wearing that enchanted collar you gave [himher] when you bailed [himher] out of jail, even though [heshe] technically doesn’t have to wear it anymore. You didn’t think the crafty [foxvixen] would find a way out of it, but [heshe] did. Even so, [heshe] insists on wearing it: “As proof of ownership,” you quote. You didn’t think [heshe] would take to [hisher] station so well, nor that you’d grow this close as you travelled together. When your eyes meet, [heshe] smiles warmly at you.", parse);
		} else {
			Text.Add("[HeShe]’s grown quite close to you as you spent time together, and you gotta admit, the [foxvixen] is not so bad once you get to know [himher]. You’ve found [himher] to be quite amorous when [heshe] wants to, and even a bit clingy at times… but nevertheless, you’re glad to have the company of the pretty [foxvixen]. When your eyes meet, [heshe] smiles warmly at you.", parse);
		}

		if (GetDEBUG()) {
			Text.NL();
			Text.Add("DEBUG: relation: " + terry.Relation(), undefined, "bold");
			Text.NL();
			Text.Add("DEBUG: slut: " + terry.Slut(), undefined, "bold");
		}
		Text.Flush();

		TerryScenes.Prompt();
	}

	public Act(encounter: ICombatEncounter, activeChar: ICombatOrder) {
		// TODO: AI!
		Text.Add("The thief hops around nimbly.");
		Text.NL();

		// Pick a random target
		const t = this.GetSingleTarget(encounter, activeChar);

		const first = this.turnCounter === 0;
		this.turnCounter++;

		if (first) {
			CombatItems.DecoyStick.combat.Use(encounter, this);
			return;
		}

		const choice = Math.random();

		if (this.turnCounter > 4 && this.sbombs > 0) {
			CombatItems.SmokeBomb.combat.Use(encounter, this);
		} else if (Abilities.Physical.Backstab.enabledCondition(encounter, this) && Abilities.Physical.Backstab.enabledTargetCondition(encounter, this, t)) {
			Abilities.Physical.Backstab.Use(encounter, this, t);
		} else if (choice < 0.2 && Abilities.Physical.Kicksand.enabledCondition(encounter, this)) {
			Abilities.Physical.Kicksand.Use(encounter, this, t);
		} else if (choice < 0.4 && Abilities.Physical.Swift.enabledCondition(encounter, this)) {
			Abilities.Physical.Swift.Use(encounter, this, this);
		} else if (choice < 0.6) {
			CombatItems.PoisonDart.combat.Use(encounter, this, t);
		} else if (choice < 0.8) {
			CombatItems.LustDart.combat.Use(encounter, this, t);
		} else if (Abilities.Physical.DirtyBlow.enabledCondition(encounter, this)) {
			Abilities.Physical.DirtyBlow.Use(encounter, this, t);
 		} else {
			Abilities.Attack.Use(encounter, this, t);
 		}
	}

	// TODO ITEMS

	public ItemUsable(item: Item) {
		return true;
	}

	public ItemUse(item: Item, backPrompt: any) {
		const terry: Terry = GAME().terry;

		if (item.isTF) {
			let parse: any = {
				item : item.sDesc(),
				aItem : item.lDesc(),
				foxvixen : terry.mfPronoun("fox", "vixen"),
			};
			parse = terry.ParserPronouns(parse);

			if (terry.flags.TF & TerryFlags.TF.TriedItem) {
				Text.Add("Terry does as ordered and takes the [item]. [HisHer] collar glows for a moment, but nothing else happens.", parse);
			} else {
				Text.Add("You hand Terry [aItem] and tell [himher] to try it. [HeShe] examines the [item] for a moment, before shrugging and moving to take it.", parse);
				Text.NL();
				Text.Add("[HeShe] swallows and you observe a faint, pinkish glow emanating from [hisher] collar, however it quickly fades. After a while, the [foxvixen] shrugs. <i>“So… that was it? I don’t feel any different.”</i>", parse);
				Text.NL();
				Text.Add("Considering what you’ve seen, you can only assume that this has something to do with that collar of [hishers]. It seems like it just isn't going to let you just transform [himher] like that. You'll need to see a specialist about this...", parse);
				Text.NL();
				if (GAME().jeanne.flags.Met !== 0) {
					Text.Add("It'd probably be best if you talked to Jeanne; she most likely made the collar, so she should be able to explain what's going on.", parse);
				} else {
					Text.Add("Given you got this collar from the heirs of the throne in Rigard, the creator of it is probably the Rigard court wizard; talking to him or her may help answer why this just happened.", parse);
				}
			}

			terry.flags.TF |= TerryFlags.TF.TriedItem;

			Text.Flush();
			Gui.NextPrompt(backPrompt);

			return {grab : true, consume : true};
		} else {
			return {grab : false, consume : true};
		}
	}
}
