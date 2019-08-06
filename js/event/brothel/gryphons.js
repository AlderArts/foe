
import { Entity } from '../../entity';
import { Gender } from '../../body/gender';
import { Gui } from '../../gui';
import { Text } from '../../text';

let GryphonsScenes = {};

function Gryphons(storage) {
	Entity.call(this);
	
	this.flags["State"] = Gryphons.State.NotViewed;
	
	if(storage) this.FromStorage(storage);
}
Gryphons.prototype = new Entity();
Gryphons.prototype.constructor = Gryphons;

Gryphons.State = {
	NotViewed : 0,
	S1WorldsEdge : 1,
	S2Pasts : 2,
	S3Building : 3,
	S4NewLife : 4
};

Gryphons.prototype.Cost = function() {
	return 200;
}
Gryphons.prototype.First = function() {
	return this.flags["State"] == Gryphons.State.NotViewed;
}


Gryphons.prototype.FromStorage = function(storage) {
	// Load flags
	this.LoadFlags(storage);
}

Gryphons.prototype.ToStorage = function() {
	var storage = {};
	
	this.SaveFlags(storage);
	
	return storage;
}


GryphonsScenes.IntroEntryPoint = function() {
	let player = GAME().player;
	let gryphons = GAME().gryphons;
	var parse = {
		armor : player.ArmorDesc(),
		skin : player.SkinDesc()
	};
	
	var choice = 0;
	var gender = Gender.male;
	
	var func = function(c, gen) {
		return function() {
			choice = c;
			gender = gen;
			Text.Clear();
			Gui.PrintDefaultOptions();
		}
	};
	
	Gui.Callstack.push(function() {
		Text.Add("Stripping out of your [armor], you secure it on the hook on the door, then turn your attention to the magic circle on the floor. Made to look as if it’d been gouged out of a stone slab by the claws of some powerful beast, it shimmers faintly as you step over the runes and into its center. Giving your naked form one last look-over, you close your eyes, steady yourself, and say <i>enter</i> as instructed.", parse);
		Text.NL();
		Text.Add("Your [skin] feels fluid and oily for a moment, oddly pliable…", parse);
		Text.NL();
		Text.Add("When you reopen your eyes, reflected in the mirror before you is the spitting image of a gryphon-morph.", parse);
		Text.NL();
		/*
		 * TODO ? 
#if PC is already a full gryphon-morph
Not that it changes too much about you, since you were already one, but the finer details of your body have changed a little to suit the fantasy.

		Text.Add("", parse);
		Text.NL();
#converge
		 */
		if(gender == Gender.male) {
			Text.Add("You are a male gryphon-morph, standing tall and proud; the tops of most people’s heads would barely reach your shoulders. While your body above your chest is covered in feathers of a dun brown color, your groin and legs bear the tawny golden fur of your leonine half, the two colors highlighted by the white streaks that run across your feathers. Hard, narrow eyes gaze back at you in the mirror, their irises such a dark brown that they’re almost black; a scar across your right eye completes your grim visage. A mane of deep brown hair falls from your head and ends between your white-tipped wings, slightly wild and unkempt, and you click your short, cruel beak in satisfaction.", parse);
			Text.NL();
			Text.Add("Battle, hunger and survival have turned your body hard and rugged, the muscles more for use rather than show; save for the bulging pecs needed to power your wide wings, your body is more lean than large. Your arms and hands are human-like, save for the small claws that cap each finger, while your feet are digitigrade feline paws with talons that click on hard surfaces. Extending from your tailbone is a long, leonine tail, the tufted end swaying to and fro idly.", parse);
			Text.NL();
			Text.Add("On your groin is a sheath that hides your cock, jet black and somewhere between ten and eleven inches long and two and a half inches thick - not counting the knot that lies near its base. Held tightly against your body by your scrotum are a pair of fist-sized testicles, and between your hard asscheeks, you have a virgin anus.", parse);
			Text.NL();
			Text.Add("All in all, you look hard, grim, commanding - perfectly suited for the role that you’re supposed to be playing out in this fantasy. There’s nothing left for it, now - taking a bold stride forward, you pass through the mirror’s surface, which accepts you with but a few ripples along its silvery surface.", parse);
		}
		else {
			Text.Add("You are a female gryphon-morph, sleek and swift; standing tall on your digitigrade stance, you’re perhaps a half-head taller than the average person on the streets of Rigard. Covered from chest to legs in luxurious silvery-grey fur, your head and shoulders are clothed in soft, white feathers and down; fur and feathers alike sport small dark speckles evenly interspersed amidst your fine coat. Your hair falls between your scythe-shaped wings and down your back, tickling the base of your leonine tail and causing your tufted tail-tip to twitch of its own accord.", parse);
			Text.NL();
			Text.Add("Gazing at yourself in the mirror, you note that your eyes are wide with dark pupils, gleaming orbs that drink in the world about them with a curious innocence. The beak that sits under them is short, hard and graced with a sharp tip, made for killing prey and tearing meat. With the talons that protrude from your feline feet and small claws that tip your human-like hands, your entire body is a weapon in and of itself - equally suited to destruction as it is to creation.", parse);
			Text.NL();
			Text.Add("Sitting on your chest, on the border of fur and feathers, is a pair of generous breasts, perhaps a large C-cup. Held high and firm by the underlying flight muscles, they look just made to be filled with warm goodness. While your nipples aren’t blatant enough to jut through your fur, there are two tiny peaks betraying their presence to all who would look closely. Past your sleek waist, you sport a set of motherly hips and a generous ass - but as inviting as they are, they can’t compare to the glimpse of your pussy between your thighs and just under your fur, its heat and puffiness advertising your prodigious fertility.", parse);
			Text.NL();
			Text.Add("All in all, you are as dangerous as you are alluring, perfectly suited for the role you’re intended to play in this chapter of the fantasy. Placing a hand on the mirror’s surface and watching the silvered glass ripple, you steady yourself and step through before you have second thoughts.", parse);
		}
		Text.NL();
		if(lucille.ThemeroomFirst()) {
			Text.Add("It’s a strange feeling stepping through the mirror. Like entering a pool, but without getting wet.", parse);
		}
		else {
			Text.Add("You’ll never get used to the feeling of stepping through the mirror…", parse);
		}
		lucille.flags["Theme"] |= Lucille.Themeroom.Gryphons;
		Text.Flush();
		
		Gui.NextPrompt(function() {
			GryphonsScenes.SceneSelect(choice);
		});
	});
	
	Text.Clear();
	
	//TODO
	var options = new Array();
	options.push({ nameStr : "World's Edge",
		tooltip : "",
		func : func(Gryphons.State.S1WorldsEdge, Gender.male), enabled : true
	});
	if(gryphons.flags["State"] >= Gryphons.State.S1WorldsEdge) {
		options.push({ nameStr : "Pasts",
			tooltip : "",
			func : func(Gryphons.State.S2Pasts, Gender.female), enabled : true
		});
	}
	if(gryphons.flags["State"] >= Gryphons.State.S2Pasts) {
		options.push({ nameStr : "Building",
			tooltip : "",
			func : func(Gryphons.State.S3Building, Gender.male), enabled : true
		});
	}
	if(gryphons.flags["State"] >= Gryphons.State.S3Building) {
		options.push({ nameStr : "New life",
			tooltip : "",
			func : func(Gryphons.State.S4NewLife, Gender.female), enabled : true
		});
	}
	
	if(gryphons.First()) {
		Text.Add("Carefully closing and latching the door behind you, you take a moment to examine the room you’ve stepped into. It’s not very large - perhaps the size of two combined broom closets - and various pictures of mountain vistas and rolling valleys have been hung on the walls. In what is perhaps an attempt to try and fit the room’s theme, someone’s dragged in a small boulder for you to sit on if need be.", parse);
		Text.NL();
		Text.Add("The rest of the room is sparsely furnished; a hook on the door on which to hang your possessions, a full-body mirror, an elaborate magic circle set into the floor, and just beside the mirror’s frame, a small dial that appears to have various settings listed at an equal number of positions. Attempts to turn the dial fail - seems like you’re going to have to play out this story from the beginning.", parse);
		Text.NL();
		choice = Gryphons.State.S1WorldsEdge;
		
		Gui.PrintDefaultOptions();
	}
	else {
		Text.Add("The confines of this particular theme room are a familiar sight to you by now, and you know what to do once the door is closed and latched. The only choice you really need to make is which chapter to play.", parse);
		Text.Flush();
		Gui.SetButtonsFromList(options, false, null);
	}
}

GryphonsScenes.SceneSelect = function(choice) {
	let gryphons = GAME().gryphons;
	
	Gui.Callstack.push(function() {
		if(gryphons.flags["State"] < choice)
			gryphons.flags["State"] = choice;
		Gui.PrintDefaultOptions();
	});
	
	switch(choice) {
		default:
		case Gryphons.State.S1WorldsEdge: GryphonsScenes.WorldsEdge(); break;
		case Gryphons.State.S2Pasts: GryphonsScenes.Pasts(); break;
		case Gryphons.State.S3Building: GryphonsScenes.Building(); break;
		case Gryphons.State.S4NewLife: GryphonsScenes.NewLife(); break;
		//TODO new scenes
	}
}

GryphonsScenes.Outro = function(gender, preg) {
	let player = GAME().player;
	let gryphons = GAME().gryphons;
	var parse = {
		
	};
	
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	var TFapplied = false;
	
	Text.Clear();
	Text.Add("As the illusion fades, you feel… odd, your gem pulsing with a strange light. A quick examination of yourself reveals that you have indeed changed, perhaps some effect of the mirror’s magic.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	
	var incompleteGryphonCockTF = function() {
		if(!player.FirstCock()) return false;
		if(!player.Genitalia().Sheath()) return true;
		var change = false;
		_.each(player.AllCocks(), function(c) {
			if(!c.Knot()) change = true;
			if(!c.race.isRace(Race.Gryphon)) change = true;
			if(change) return false; //break
		});
		return change;
	}
	
	var incompleteGryphonFaceTF = function() {
		if(!player.Ears().race.isRace(Race.Gryphon)) return true;
		if(!player.Eyes().race.isRace(Race.Gryphon)) return true;
		if(player.HasAntenna()) return true;
		if(player.HasHorns()) return true;
		if(!player.Face().race.isRace(Race.Gryphon)) return true;
		return false;
	};
	
	var incompleteGryphonTF = function() {
		var wings = player.HasWings();
		var tail = player.HasTail();
		if(!wings || (wings && !wings.race.isRace(Race.Gryphon))) return true;
		if(tail && !tail.race.isRace(Race.Lion)) return true;
		if(!player.Race().isRace(Race.Gryphon)) return true;
		if(!player.Arms().race.isRace(Race.Lion)) return true;
		if(!player.Legs().race.isRace(Race.Gryphon)) return true;
		if(incompleteGryphonCockTF()) return true;
		if(incompleteGryphonFaceTF()) return true;
		return false;
	};
	
	var func = function(obj) {
		scenes.AddEnc(function() {
			TFapplied = true;
			return _.isFunction(obj.tf) ? obj.tf() : "";
		}, obj.odds || 1, obj.cond);
	};
	
	func({
		tf: function() {
			var wings = player.HasWings();
			var tail = player.HasTail();
			if(!wings || (wings && !wings.race.isRace(Race.Gryphon))) {
				var t = "You feel a strange new weight on your back, a sensation of heaviness and resistance, and to your surprise, you find you’ve grown a pair of wide, powerful wings tipped with white feathers.";
				if(wings) {
					t = Text.Parse("A strange sensation between your shoulders has you turning your head. It looks like your wings have changed while you were out in the fantasy - becoming broad, powerful and vaguely scythe-shaped, made for soaring.", parse);
					wings.race = Race.Gryphon;
					wings.color = Color.gold;
				}
				else {
					TF.SetAppendage(player.Back(), AppendageType.wing, Race.Gryphon, Color.gold, 2);
				}
				player.Ears().race = Race.Feline;
				return t;
			}
			else if(tail && !tail.race.isRace(Race.Lion)) {
				var t = "A new weight at your tailbone has you turning around to investigate. Seems like you’ve managed to acquire a tail, long and leonine with a furry tuft on the end. It’s slightly prehensile, but not enough to be useful.";
				if(tail) {
					t = Text.Parse("Your tail feels different. A cursory glance behind you reveals that it’s turned long and slender, capped by a furry tuft - just like the gryphon in the fantasy.", parse);
					tail.race = Race.Lion;
					tail.color = Color.gold;
				}
				else {
					TF.SetAppendage(player.Back(), AppendageType.tail, Race.Gryphon, Color.gold);
				}
				return t;
			}
			else if(!player.Race().isRace(Race.Gryphon)) {
				player.body.torso.race = Race.Gryphon;
				return "Your skin feels different. Warmer… heavier… oh. You’ve grown a coat of tawny golden fur <i>and</i> dark brown feathers - the former covers your body from the chest down, while the latter coats your chest, shoulders, and arms. ";
			}
			else if(!player.Arms().race.isRace(Race.Lion)) {
				var t = Text.Parse("Your [hand]s and arms have changed - while still human-like, your fingers are now tipped with a small set of claws. They’re not sharp enough to be useful as a weapon, but nevertheless are still a curiosity.", {hand: player.HandDesc()});
				player.Arms().race = Race.Lion;
				return t;
			}
			else if(!player.Legs().race.isRace(Race.Gryphon)) {
				var t = Text.Parse("You look down and find that your lower body has changed completely - you now sport a pair of leonine and digitigrade legs and feet, capped with hooked talons. Rippling with muscle, they’re suited for both slow stalking and quick pouncing.", parse);
				if(player.HasLegs())
					t = Text.Parse("Your stance seems to be carrying your weight a little differently, and when you look down you realize that your legs and feet have changed. They’re now leonine, digitigrade and capped with talons, rippling with muscle and suited for both slow stalking and quick movement.", parse);
				player.Legs().race = Race.Gryphon;
				player.Legs().count = 2;
				return t;
			}
			else if(incompleteGryphonCockTF()) {
				var parse2 = {};
				parse2 = Text.ParserPlural(parse2, player.NumCocks() > 1);
				var cscenes = new EncounterTable();
				_.each(player.AllCocks(), function(c) {
					parse2["cock"] = c.Short();
					
					if(!c.Knot()) {
						cscenes.AddEnc(function() {
							c.knot = 1;
							return Text.Parse("A faint throbbing at the base of[oneof] your cock[s] has you grasping at it in surprise. You’ve grown a thick knot at the base of your [cock]!", parse2);
						}, 1.0, function() { return true; });
					}
					if(!c.race.isRace(Race.Gryphon)) {
						cscenes.AddEnc(function() {
							c.race = Race.Gryphon;
							c.color = Color.black;
							return Text.Parse("With a shudder that runs through your groin and up your spine, you notice a dark patch spreading out from the base of[oneof] your cock[s]. Within moments, your [cock] resembles the one you had in the illusion...", parse2);
						}, 1.0, function() { return true; });
					}
				});
				if(!player.Genitalia().Sheath()) {
					cscenes.AddEnc(function() {
						player.Genitalia().SetCover(Genitalia.Cover.Sheath);
						return Text.Parse("A faint sucking sound at your groin heralds the development of a sheath in which to hide your [cock]. Rubbing it brings out your man-meat well enough, so there’s no real concern for worry, but it still feels… different.", parse2);
					}, 1.0, function() { return true; });
				}
				
				return cscenes.Get();
			}
			else if(incompleteGryphonFaceTF()) {
				player.Face().race = Race.Gryphon;
				player.Eyes().race = Race.Gryphon;
				player.Ears().race = Race.Gryphon;
				TF.ItemEffects.RemAntenna(player, {count: 2});
				TF.ItemEffects.RemHorn(player, {count: 2});
				return "To top it off, staring back at you in the mirror is a gryphon’s face, eyes, beak and all.";
			}
		},
		odds: 3,
		cond: function() { return incompleteGryphonTF(); }
	});
	
	if(gender == Gender.male && player.FirstCock()) {
		var parse2 = {};
		parse2 = Text.ParserPlural(parse2, player.NumCocks() > 1);
		
		var incompleteCockSizeOne = function(c) {
			if(c.Len() < 28) return true;
			if(c.Thickness() < 5) return true;
			return false;
		};
		var incompleteCockSize = function() {
			var changed = false;
			_.each(player.AllCocks(), function(c) {
				changed = incompleteCockSizeOne(c);
				if(changed) return false; //break
			});
			return changed;
		};
	
		func({
			tf: function() {
				var scenes = new EncounterTable();
				_.each(player.AllCocks(), function(c) {
					scenes.AddEnc(function() {
						if(c.Len() < 28)
							c.length.IncreaseStat(28, 4);
						if(c.Thickness() < 5)
							c.thickness.IncreaseStat(5, 1);
						
						return "Tingles of pleasure run up the length of[oneof] your shaft[s], and when you examine it, your [cock] has definitely grown a bit bigger.";
					}, 1.0, incompleteCockSizeOne(c));
				});
				return scenes.Get();
			},
			odds: 1,
			cond: function() { return incompleteCockSize(); }
		});
		func({
			tf: function() {
				player.Balls().size.IncreaseStat(7, 1);
				return "Your scrotum feels heavier and a little tighter, and examination reveals that your balls have grown a little in size.";
			},
			odds: 1,
			cond: function() { return player.HasBalls() && player.Balls().BallSize() < 7; }
		});
		func({
			tf: function() {
				player.Balls().count.base = 2;
				player.Balls().size.IncreaseStat(5, 100);
				return "There’s an extra, slightly dangly weight between your legs. Seems like you’ve grown a nice set of balls when you were out.";
			},
			odds: 1,
			cond: function() { return !player.HasBalls(); }
		});
		func({
			tf: function() {
				player.Balls().cumCap.IncreaseStat(30, 2);
				player.Balls().cumProduction.IncreaseStat(4, .75, true);
				return "A gentle wave of pleasure runs through your balls and up into your groin. While it’s over just as quickly as it began, you can feel your balls churning with increased production.";
			},
			odds: 1,
			cond: function() { return player.HasBalls() && player.Balls().cumProduction.Get() < 4 && player.Balls().cumCap.Get() < 30; }
		});
		func({
			tf: function() {
				player.Balls().fertility.IncreaseStat(.9, .2);
				return "You feel a strange tingling in your balls. While they don’t look any different, somehow you know that your seed has grown more powerful, more apt at taking root.";
			},
			odds: 1,
			cond: function() { return player.HasBalls() && player.Balls().fertility.Get() < .9; }
		});
	}
	else if(gender == Gender.female && player.FirstVag()) { //female
		var parse2 = {
			breasts : player.FirstBreastRow().Short()
		};
		var incompleteVagSize = function() {
			var changed = false;
			_.each(player.AllVags(), function(v) {
				if(v.capacity.Get() < 10) changed = true;
				if(v.minStretch.Get() < Capacity.loose) changed = true;
				if(changed) return false; //break
			});
			return changed;
		};
		var incompleteBreastSize = function() {
			var changed = false;
			_.each(player.AllBreastRows(), function(b) {
				if(b.size.Get() < 10) changed = true;
				if(changed) return false; //break
			});
			return changed;
		};
		var incompleteNipSize = function() {
			var changed = false;
			_.each(player.AllBreastRows(), function(b) {
				if(b.nippleThickness.Get() < 2) changed = true;
				if(b.nippleLength.Get() < 2) changed = true;
				if(changed) return false; //break
			});
			return changed;
		};
		
		func({
			tf: function() {
				_.each(player.AllVags(), function(v) {
					v.capacity.IncreaseStat(10, 2);
					v.minStretch.IncreaseStat(Capacity.loose, 1);
				});
				return "Feeling the last of the tingles fade in your groin, you examine yourself. While there is no outward change, a discreet check reveals that your snatch has deepened, becoming more elastic and better able to stretch.";
			},
			odds: 1,
			cond: function() { return incompleteVagSize(); }
		});
		func({
			tf: function() {
				player.body.torso.hipSize.IncreaseStat(14, 3);
				return "Your stance… it’s shifted. The change is slight but perceptible, changing your figure to be more motherly, giving you some much-needed room to fit things between your legs, regardless of whether they’re going in or coming out.";
			},
			odds: 1,
			cond: function() { return player.body.torso.hipSize.Get() < 14; }
		});
		func({
			tf: function() {
				_.each(player.AllBreastRows(), function(b) {
					if(b.Size() < 2) {
						b.size.IncreaseStat(4, 100);
						return "A new weight on your chest draws your attention, and you swallow hard. Two small mounds sit upon your chest, the beginning of full, grand breasts…";
					}
					else {
						b.size.IncreaseStat(10, 2);
						return Text.Parse("An increased weight on your chest prompts you to peer down at your [breasts]. They’ve gotten fuller, firmer, more shapely - just like you had in the fantasy…", parse2);
					}
				});
			},
			odds: 1,
			cond: function() { return incompleteBreastSize(); }
		});
		func({
			tf: function() {
				_.each(player.AllBreastRows(), function(b) {
					player.FirstBreastRow().nippleThickness.IncreaseStat(2, .5);
					player.FirstBreastRow().nippleLength.IncreaseStat(2, .5);
				});
				return "Your nipples tingle, stiff and erect - no, they’re not stiff, but instead have gotten bigger and perkier. Not by much, perhaps, but still all the better for suckling, tweaking and teasing.";
			},
			odds: 1,
			cond: function() { return incompleteNipSize(); }
		});
		func({
			tf: function() {
				var ret = player.Lactation();
				player.lactHandler.lactating = true;
				player.lactHandler.FillMilk(1);
				player.lactHandler.milkProduction.IncreaseStat(5, 1);
				player.lactHandler.lactationRate.IncreaseStat(10, 1);
				
				if(ret) {
					return Text.Parse("Your milky [breasts] feel fuller and heavier than before, more tender to the touch as they increase in both production and capacity.", parse2);
				}
				else {
					return Text.Parse("Your [breasts] tingle, a delicate sensation that starts from just behind your nipples. Prodding gently as you examine them, you blink in surprise as a bead of milk wells up on one nipple. Seems like you’ve started lactating.", parse2);
				}
			},
			odds: 1,
			cond: function() { return true; }
		});
		func({
			tf: function() {
				player.pregHandler.fertility.IncreaseStat(.9, .2, true);
				return "You squirm, trying to hold back the sudden desire for cum that flares up inside you. More receptive to seed than before, your womb makes it known that it wants to be nice and full with a growing child to occupy it.";
			},
			odds: 1,
			cond: function() { return true; }
		});
		func({
			tf: function() {
				if(player.PregHandler().IsPregnant({slot: PregnancyHandler.Slot.Vag})) {
					player.PregHandler().Womb({slot: PregnancyHandler.Slot.Vag}).litterSize++;
					return "Your baby bump is considerably bigger than it was before, the extra weight in your womb noticeable. In fact, it looks like you could fit another child in there!";
				}
				else {
					player.PregHandler().Impregnate({
						slot: PregnancyHandler.Slot.Vag,
						mother: player,
						father: gryphons,
						race: Race.Gryphon,
						num: 3,
						time: 25*24,
						force: true
					});
					return "As you examine your midriff, a palpable wave of warmth and contentment ripples through your lower belly, spreading out into the rest of your body. There’s no apparent change, but you have an uneasy feeling…";
				}
			},
			odds: preg*2,
			cond: function() { return !incompleteGryphonTF() && preg > 0; }
		});
	}
	
	var text = [];
	_.times(_.random(1, 4), function() {
		text.push(scenes.Get());
	});
	
	if(TFapplied) {
		_.each(text, function(t) {
			if(t) {
				Text.Add(t, parse);
				Text.NL();
			}
		});
	}
	else {
		Text.Add("Huh. You thought you’d changed, but after a thorough examination, it seems like you’re still your old self. It must be the disorienting effect of the mirror magic playing tricks on your mind…", parse);
		Text.NL();
	}
	
	Text.Add("Stretching your stiff limbs, you work the kinks out of your joints until you feel like you’re ready to head out into the real world once more. While you can’t have been out there for more than half an hour, it feels like much, much longer. Dressing yourself, you push open the door and leave the closet.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		TimeStep({hour: 3});
		Scenes.Lucille.WhoreAftermath(null, gryphons.Cost());
	});
}

//Chapter one - World’s Edge
GryphonsScenes.WorldsEdge = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("The first thing that strikes you about your new surroundings is the air, crisp and fresh in your lungs, chilly and heavy as it runs through your fur and feathers. Gone are the stuffy confines of the room; instead, a vast expanse lies before you, land and sky stretching out in all directions. Mighty cliffs and crags thrust themselves out of the ground, snow-capped peaks rising up against the greenery of the lowlands.", parse);
	Text.NL();
	Text.Add("And before you, the valley. Lush and fertile, its abundance is laid out for you to see. From your perch, you can smell the distant tang of ripe fruit and fat game, of dark soil and gushing water. This is a good, unsullied place, and although there are other such valleys less than a day’s flight from this place, this particular one is the best.", parse);
	Text.NL();
	Text.Add("You know why you’ve come to this place, flown across plains and rode the winds through storm and lightning to get here. First, to escape the wyverns, those cruel raiders who have incessantly attacked your people. Though as quarrelsome amongst themselves as gryphons are, their love of plunder unites them in their raids on your mountainside homes. Where there is no plunder, they come anyway; they love to kill and eat as much as they love to steal. The tribes should have united against them, but getting two gryphon tribes to agree on anything is like herding cats; divided as they were, each one stood no chance against the marauding scaled hordes.", parse);
	Text.NL();
	Text.Add("There are not many of your kind left. The fact that the wyverns are likely to eventually turn on each other gives you little comfort, when you know they will only do so when the last gryphon is gone.", parse);
	Text.NL();
	Text.Add("A month ago, they came for your tribe. You fought as well as you could with spear, beak and claw - you have the scars to prove it - but it was scarcely enough. Where are the rest of your people, your aunts, uncles, cousins? They may live still, but to you, they are as good as dead. But here, across the strait, past the mountains, here is a place where the wyverns will not follow. Refuge, no matter how temporary it is, is welcomed by your weary body.", parse);
	Text.NL();
	Text.Add("The tribes fell because each one was small and divided. No… another attempt to unite the tribes by politics and negotiation would be folly; it has been tried time and time again, only to dissolve in dissent and squabbling. It is time to try a new approach.", parse);
	Text.NL();
	Text.Add("If no existing gryphon tribe is big enough to withstand the wyvern raiders, perhaps it would serve to <i>create</i> one. And since tribes are strictly familial… that brings you to the second reason why you are here in this valley:", parse);
	Text.NL();
	Text.Add("A mate.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("It has been four days since you caught her scent in the wind, two since you determined the direction of its origin. As you once stalked raiders, now you stalk your prey; you have yet to lay eyes on her, but the sweet, musky scent tells you all you need to know. Young, fertile, and most importantly, unclaimed by another male. The hows and whys are anyone’s guess - although there are now many more lone gryphons since the fall of the tribes - but the fact that she exists is enough to drive you on with a dogged single-mindedness.", parse);
		Text.NL();
		Text.Add("With that in mind, you descend to the valley floor, a short glide on your wings through the canopy and onto the forest undergrowth. The air is hot and muggy with moisture trapped in the valley; you stop a while to pick a fruit off a low bough and eat, doing your best to soothe your tired muscles and pick up the trail once more. If fortune smiles upon you, you’ll need all your strength soon. A more primal part of you rebels against making a meal of something as mundane as fruit and seeds. You should be hunting game - even though you no longer have so much as a loincloth to your name, a gryphon’s talons and beak should be enough to make a kill with.", parse);
		Text.NL();
		Text.Add("You silence that part of you with a snort. You control your instincts, not the other way around; the only time when they will run free is when you <i>let</i> them. There will be time enough for hunting and feasting later.", parse);
		Text.NL();
		Text.Add("Bit by bit, the fruit’s soft, sweet flesh and hard seeds disappear and you carefully bury the rind in the soft soil, not wishing to risk drawing undue attention. While the aches in your wings and limbs persist, you feel somewhat revitalized and press on. Even if you cannot sight your prey today, you still want to make good time before sundown.", parse);
		Text.NL();
		Text.Add("It doesn’t take you long to pick up the scent once more. It has teased and tormented you, invaded your dreams and fantasies with fancies of what its owner might look like… three nights ago, you woke to find your cock out of its sheath and your knot swollen, a large puddle of cum dampening your fur and feathers. You don’t remember the dream you had, but it must have been good.", parse);
		Text.NL();
		Text.Add("Over roots and under branches. Through the trees and out by the river. As the sun begins to sink towards the horizon, numerous glowbugs emerge from their hiding places near the water’s edge, lighting your way; your fatigue is forgotten as you follow the mysterious musk, blown downstream by the river’s movements. Hanging vines and woody lianas block your path, but they are a minor nuisance compared to your recent tribulations. Nevertheless, you offer up a short murmured prayer to the Sky Mother. The patron spirit of your kind is notoriously silent, but it can’t hurt to hope that she’s actually listening at the moment.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("How long have you traveled now? The sky is dark, the sun’s brilliance replaced by the moon’s softer light, and the river is beginning to narrow as one approaches the end of the valley. Your feet begin to ache, and you’re tempted to make camp for the night and get some much-needed rest.", parse);
			Text.NL();
			Text.Add("Your man-meat, though, has other ideas. With your elusive quarry so close - the lascivious scent of potential sex filling your nostrils and egging you on - you daren’t take the risk of letting her slip away. How much longer can this valley stretch?", parse);
			Text.NL();
			Text.Add("Just as you’re about to call it a day, you’re greeted by the roar of running water. A waterfall? Indeed, the jungle parts into a clearing occupied by a large, clear pool that feeds the valley river, in turn fed by a high waterfall that carries fresh snowmelt down from the high peaks. Glow bugs and luminescent water plants light up the pool with an unearthly yellowish-green light, and there, <i>there</i> by the foam and froth of the plunge pool, she sits.", parse);
			Text.NL();
			Text.Add("Even knowing that the only females you have ever seen are your mother, aunts and cousins, as well as the rare outsider from another tribe, you should have expected your quarry to be different. Nevertheless, nothing could have prepared you for the exotic beauty that bathes in the pool before your very eyes. Her fur and feathers are a silvery gray and pale white respectively, flecked with spots of deep black; her silvery-gray hair flowing like water as she washes it in the roaring waterfall. Her beak is short, solid and hook-tipped for tearing flesh, her eyes wide, bright and alert. This one is definitely a soarer, judging by the long, scythed shape of her wings; the way her muscles shift under her wet fur make your breath catch in your throat.", parse);
			Text.NL();
			Text.Add("You remember your mother’s words on the most important traits to look for in a potential mate: generous breasts for nourishing young, a narrow waist for quick conceiving, and wide hips for easy laying. She doesn’t merely meet those expectations, but surpasses them in all aspects - truly a solid foundation on which you will seed your new designs, a mother of a new people.", parse);
			Text.NL();
			Text.Add("The only way this one could have remained unclaimed is if there were no males around to do the honor.", parse);
			Text.NL();
			Text.Add("As if meaning to betray you, your cock stirs in its sheath, wanting to take this wondrous beauty here and now. Squeezing your eyes shut, you focus and push those lustful thoughts from your mind - you can entertain them <i>after</i> you’ve caught your prey. You may be a predator, but so is she; her lithe form and sharp beak and talons are enough proof of that. Seven wyvern horns you have taken in your name, but those trophies of battle are probably splinters and dust now, trampled underfoot by the raiders who took your tribe in turn. No, your past is nothing now; it is time to start anew.", parse);
			Text.NL();
			Text.Add("It seems almost a shame, to have to despoil such a beautiful figure of femininity, yet you cannot risk her not yielding to you. Does this make you any better than the wyvern raiders? Desperate times call for desperate measures; you are willing to bear this burden of sin if it will yield the promise of a future for your people.", parse);
			Text.NL();
			Text.Add("So be it. If necessary, you will give the accounting of your life to the Sky Mother at its end, and only she may judge you. Thusly resolved, you decide on the best approach to move in for the kill.", parse);
			Text.Flush();
			
			//[Undergrowth][Waterfall][Sky]
			var options = new Array();
			options.push({ nameStr : "Undergrowth",
				tooltip : "Move from the cover of vegetation, and strike when the time is right.",
				func : function() {
					Text.Clear();
					Text.Add("Yes… yes. That could work. The undergrowth is thick and will cover your approach; even after you leave the tree-line, reeds and rushes grow tall and thick, more than enough to hide your person. With the waterfall masking your scent, you will remain hidden so long as she does not catch sight of you.", parse);
					Text.NL();
					Text.Add("There is no time to lose, then. Sinking down to all fours like a primal beast, you tuck your wings in close to your body and slink through the grass and fallen leaves. Each step, each movement is carefully measured and soundless, your gaze fixed on your goal with a burning intensity. The cover of darkness wraps about you like a cloak as you pad forward, taking care to avoid the glowing plants and insects.", parse);
					Text.NL();
					Text.Add("All of a sudden, your quarry looks up from her bath, eyes wide and alert with worry. What have you done? Freezing in place, your breath no more than the slightest gasp, you eye her as she twists her head this way and that. No… you have done nothing. She is startled, her instincts trying to tell her something, but she cannot see, hear or scent you. Perhaps it is the intensity of your gaze, of your will, that has done this…", parse);
					Text.NL();
					Text.Add("Choosing to trust her senses over her instincts, your quarry calms down and returns to bathing herself, although she’s far more jumpy than before. Nevertheless, it gives you just enough time to slide noiselessly through the long reeds and get within range to pounce.", parse);
					Text.NL();
					Text.Add("She should have trusted her instincts. By the time she notices you, it is far too late - you have your hands on your prey’s shoulders and are pressing down on her with your weight.", parse);
					Text.NL();
					GryphonsScenes.WorldsEdgeCaught();
				}, enabled : true
			});
			options.push({ nameStr : "Waterfall",
				tooltip : "Circle around to the water’s source and take the initiative from high ground.",
				func : function() {
					Text.Clear();
					Text.Add("You decide that a frontal approach is too risky and that it would be better to strike from where she thinks it’s safe. The cliff that the waterfall careens down may be high, but that means little to one capable of flight. Withdrawing from the water’s edge, you skirt around the clearing, making for the rise in the land; you don’t have to get up very high, just high enough to avoid notice. Ignoring the protests of your aching muscles, you dig your talons into the limestone wall and begin to climb.", parse);
					Text.NL();
					Text.Add("A quick glance down at your prey reveals that she’s still engrossed in cleaning herself; in an act of surprising flexibility, she’s stretched one of her wingtips up to her face such that she can preen the long, stiff flight feathers with her beak. As you watch, she finishes up with her wing and moves onto those powerful legs of hers, giving you just a glimpse of her snatch in the process.", parse);
					Text.NL();
					Text.Add("You shudder, and have to restrain yourself to avoid losing grip on your handhold. Clenching your beak tight, you press on upward with rekindled determination. After seeing that display, there is <i>no way</i> you’re not going to have it all for yourself and knot yourself well and deep inside her. Your cock twitches inside its sheath in agreement, and you shake your head to clear it before continuing your ascent. Finally, you spy a small perch by the water’s fall - a perfect place to spy on without being spied yourself. Easing yourself onto the ledge with precise balance, you squat and consider what you have to do next. Taking a deep breath to calm your thoughts and blood, you remind yourself that this time your aim is not to kill, but to merely subdue. She is not a meal or an enemy, but hope, and you do not wish to crush her… you need her mind and body whole and healthy for your aims.", parse);
					Text.NL();
					Text.Add("With that in mind, you leap, wings half-spread to slow your fall.", parse);
					Text.NL();
					Text.Add("Droplets of water spatter against your body as you cross the stream, become one with the roar of froth and foam in your descent. She notices the sudden thinning of the water’s flow, looks up wide-eyed - but it is far too late for her to escape. Already, you’ve turned your landing into a roll, roughly hooking one arm about her waist and throwing her off-balance, pinning her down with weight and muscle alike.", parse);
					Text.NL();
					GryphonsScenes.WorldsEdgeCaught();
				}, enabled : true
			});
			options.push({ nameStr : "Sky",
				tooltip : "Soar high and dive for the pool, making the most of speed and surprise.",
				func : function() {
					Text.Clear();
					Text.Add("Looking around, you can’t find a path to your prey that you feel would adequately conceal your approach. While it is true that you are experienced in stalking and stealth, it will never do to underestimate your quarry, not when the crux of your plans hinges on your success here. If you fail here, who knows if you will ever be allowed a second chance, let alone one as wondrous as this…", parse);
					Text.NL();
					Text.Add("No, stealth is not going to be your chosen approach this time around. You have one more option: to strike hard and fast from the darkness, making up for lack of surprise with swiftness. Slowly, you withdraw to a safe distance from the water’s edge, then find the tallest tree you can to take flight from, leaping from bough to bough with agile grace.", parse);
					Text.NL();
					Text.Add("Taking off from a standing start is much, much harder than it would be had you a cliff to dive off or at least a running start, but mere flesh is not going to stop your burning resolve here. Though you're already fatigued, wings and chest crying out at being mistreated in such a manner, you will yourself aloft, rising above the treetops and into the night sky, with only the stars and moon as your companions.", parse);
					Text.NL();
					Text.Add("You wonder if the Sky Mother is watching you, and if so, what she must be thinking.", parse);
					Text.NL();
					Text.Add("The pool is still there, and so is your quarry, a faint speck of light far below. The winds tug at your feathers, caress your fur, and you take a split second to listen to what they have to say -", parse);
					Text.NL();
					Text.Add("- then pull yourself into a straight stoop. The air shrieks, gusts tear at your face, and you have to keep on reminding yourself, you do not intend to kill as you would do on an ordinary hunt, that this is no gazelle to end up spitted and roasted -", parse);
					Text.NL();
					Text.Add("You are screaming, you are howling, you are -", parse);
					Text.NL();
					Text.Add("- The winds -", parse);
					Text.NL();
					Text.Add("- The air -", parse);
					Text.NL();
					Text.Add("- The light -", parse);
					Text.NL();
					Text.Add("- Slowing just enough to catch her from under her arms and carry her aloft, letting your combined weight slow your landing. She shrieks in surprise and anger, a spray of cool water rising from the impact, the two of you skim the water’s surface before coming to an undignified stop amongst the lakeshore reeds. Before she can recover, you are upon her, pressing down upon her form with yours.", parse);
					Text.NL();
					GryphonsScenes.WorldsEdgeCaught();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		});
	});
}

GryphonsScenes.WorldsEdgeCaught = function() {
	var parse = {
		
	};
	
	Text.Add("Her gaze meets yours, and her eyes narrow in fury; she parts her beak to screech, and her enraged cry is beautiful death.", parse);
	Text.NL();
	Text.Add("You care for none of that.", parse);
	Text.NL();
	Text.Add("In a way, it is good that she has fight in her; now you know your sons and daughters will not be weak-willed cowards. The scent of a nubile, unclaimed female such as this one… it is beyond compare. Your body draws on wells of strength you never knew you had, your chest heaving and breath heavy, spilling from your beak and onto her face as the two of you struggle like beasts. She is sharp, her body well-formed and powerfully muscled, but she has not the knowledge nor the experience to wield it as you do; you’d wager that she’s never fought anything more than perhaps the occasional predatory beast that wandered into the valley. The finest spear in the hands of a child may as well be kindling.", parse);
	Text.NL();
	Text.Add("Still, she fights, biting with her beak, lashing out with her talons, hoping to catch you unawares. Pinned with her back to the ground, she nevertheless flaps her wings desperately, beating them against the ground as if trying to take flight. You do your best to restrain her without hurting her, subduing her thrashing limbs with your own.", parse);
	Text.NL();
	Text.Add("So close to you… warm flesh in your hands, pressed against your knees and shins. With every breath, her exotic scent fills your nostrils and lungs, and you can feel your man-meat pressing insistently against the insides of your sheath…", parse);
	Text.NL();
	Text.Add("You have to end this fast.", parse);
	Text.NL();
	Text.Add("<i>“Submit,”</i> you say.", parse);
	Text.NL();
	Text.Add("Perhaps she does not understand the meaning of the word, but she recognizes the tone with which it is said. Screaming defiance, she lashes out and catches you momentarily off-guard, claws raking the side of your head and drawing blood. In a flash, you have the offending hand seized with your own and pinned against the ground like the rest of her.", parse);
	Text.NL();
	Text.Add("<i>“Submit.”</i> Blood seeps into your feathers, drips down your beak; you test the warm liquid with your tongue, no stranger to the salty, coppery tang. Your eyes meet hers once more, an immovable stone cliff against a maelstrom of emotions. The winds batter and howl, lightning flashes and storm swirls, but your face remains cold and resolute. You have not tracked her this far, fought so hard, to be put off by a mere temper tantrum.", parse);
	Text.NL();
	Text.Add("Slowly, you spread your wings, casting a deep shadow over her.", parse);
	Text.NL();
	Text.Add("<i>“Submit,”</i> you say for the third and last time.", parse);
	Text.NL();
	Text.Add("Her eyes meet yours, but you do not move your gaze. Blood wells up on your chin, your feathers soaked with that rich, dark fluid, and begins to drip onto her chest between her generous breasts, creating a spreading rust-red patch on her white feathers.", parse);
	Text.NL();
	Text.Add("Something breaks behind those wide eyes, and she lets out a frightened chirp. Her body is still poised to fight, but is that so different from being ready to mate? Her eyes dart this way and that, seeking escape, but you keep a firm grip on her.", parse);
	Text.NL();
	Text.Add("<i>“S-submit,”</i> she mewls. Your quarry has been caught.", parse);
	Text.NL();
	Text.Add("Remembering the dirty tricks of wyverns, your body reflexively expects a surprise attack after you loosen your hold on her wrists, but no such thing comes. If your thoughts had been any clearer, perhaps you would have felt ashamed for expecting such from one of your kind, but here and now, all the beast in your mind wants is to claim your hard-fought prize.", parse);
	Text.NL();
	Text.Add("Already halfway out of its sheath, your cock throbs and twitches in anticipation; a hard thrust of your hips and its glistening length is fully extruded, glans, knot and all. Your body screams its desire to take her here and now on the bed of stone and mud, to fuck her senseless and fill her womb with your seed, but your father has trained you to be better than that. You’ll want to leave a good first impression, after all, if you’re going to make her want to stick around.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("A predatory - and perhaps lewd - gleam enters your eye as you inch up her body to straddle her waist with your legs, letting your raging, pre-oozing erection wave in her face, the tip of your glans just above her beak. You lean back a little to present it better to her, then reach down with both hands to gently knead her firm breasts. The full orbs fill your palms and then some; it’s a delight to finally have all that full, warm flesh in your hands and beneath your fingers.", parse);
		Text.NL();
		Text.Add("The effect is immediate. She has tormented you day and night with that alluring scent of hers; it’s now time for you to turn the tables. A needy wail escapes her beak as she takes in the entirety of your pulsing man-meat with wide, innocent eyes; has she never seen a cock before? No time for that; the first wail is soon joined by a second, far more urgent one as your fingers work their way up to her nipples, feeling them swell and stiffen while her body grows hot under yours. Wings beating, she squirms under your weight, her rich, feminine musk only intensifying; whether she understands it or not, her body knows what it wants and is preparing itself accordingly.", parse);
		Text.NL();
		Text.Add("Not that yours isn’t doing much the same, either. You can <i>feel</i> your balls churning in preparation for their inevitable release, growing slightly bigger even as the dribble of pre lubricating the length of your shaft grows into a trickle. Her breath grows heavy, her breasts heaving and jiggling slightly in your hands; deep breaths, deep breaths, taking in the scent of your cock, of sex…", parse);
		Text.NL();
		Text.Add("Father always swore by this; according to him, it’s how he convinced your mother to conceive you. Well, you’ve seen how well it works for yourself.", parse);
		Text.NL();
		Text.Add("A strangled squawk rises from her throat as her body convulses under yours, and she reaches up to give the length of your cock an experimental nip, a pinprick of sensation on your sensitive member. The ensuing rush of pressure within your member is intense, thick rough veins bulging against skin as it tries in vain to get even fuller than it already is.", parse);
		Text.NL();
		Text.Add("You can’t take much more of this, and by the looks of her vacant expression and pink, swollen pussy, slick and dripping with girl-cum, neither can she. It takes all your presence of mind to get up, pry her off her back, and force her on her hands and knees doggy-style, brushing aside her tufted tail to get a good view of her snatch from this angle. Without further ado, you grab hold of her hips - it’s easy to get ahold of them, they’re so wide and pleasant - rumble in satisfaction, and thrust.", parse);
		Text.NL();
		Text.Add("Here, by the roar of the waterfall, in the light of the moon and stars alike, you claim your first mate, your queen, the first step of your grand plan for the future of your people.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("She whimpers in pain as you take her virginity, then cries out once more as your knot slips past her entrance; the difference between the two only makes hilting her all the more satisfying. With a savage pull of the sort usually reserved for retrieving spearheads from wyvern corpses, you withdraw, then ram into her again, your balls slapping against her delightful asscheeks. Rough and undignified, perhaps, but you’ve never had a mate yourself either, not with all your cousins spoken for. There had been talk of an exchange between tribes, but… no, that is all past. Forget it.", parse);
			Text.NL();
			Text.Add("Here and now… fuck. Fuck, yes. You can <i>feel</i> your knot bulging, swelling; it takes more and more effort to pull out each time, until you can’t do it anymore, tied well and deep inside your new mate. That doesn’t stop you from pounding away like a frenzied rutting beast, releasing all the pent-up aggression and frustration that you’ve accumulated over the last few days in one fell swoop. The fur about your thighs and groin is sodden - sweat, cum, who cares - and you have to dig your fingers into her waist, seeking better purchase for your more… vigorous efforts.", parse);
			Text.NL();
			Text.Add("On her part, she responds with as much energy as you give. Her body knows what it wants, even if she doesn’t; she bucks her hips against you in rhythm with your thrusts, trying to take as much of you as she can inside of herself. Panting, her tongue lolling out of her beak and wings drooping, breasts swaying back and forth under her with her motions, your new mate has been greater heights.", parse);
			Text.NL();
			Text.Add("Growling, you push yourself further until you can feel your sheath grind against her wet lips, the tip of your cock pushing insistently against the entrance to her womb. Slowly, you coax her cervix into loosening, dilating just enough to admit your glans so you can spread your seed directly reduced to as much of a rutting animal as you are. Her inner walls, slick and slippery, press tightly against your cock, a snug and warm sleeve that only serves to spur your arousal to where it’s going to take root. The act is enough to send her over the edge, screaming and screeching breathlessly, claws and talons scrabbling against the ground for purchase even as her feminine honey seeps out onto the base of your shaft in great gouts.", parse);
			Text.NL();
			Text.Add("There isn’t much time left - you can feel an insistent pressure gathering at the base of your shaft, your balls churning and throbbing as they prepare to fill your new mate with your virile load. Shuddering, tingles rushing across your skin and through your muscles, you steady yourself against her and ram yourself one last time inside her with everything you’ve got.", parse);
			Text.NL();
			Text.Add("A final act to consummate the hunt.", parse);
			Text.NL();
			Text.Add("Still reeling from her last orgasm, she squawks weakly, a mixture of pleasure and protest. Fire flashes through your veins, ensuring that your body is ready - and then at last, sweet, sweet release. You breed your new mate and breed her good; spurt after spurt of your thick, gooey seed erupts from your shaft to settle into her thoroughly plowed fields. Your body’s clearly been saving up for this, for the flow of baby batter keeps on coming and coming, seemingly without end; each rope of cum that emerges from you is accompanied by a savage grunt or growl, your body doing its best to ensure the best chances of your seed taking hold in your new mate.", parse);
			Text.NL();
			Text.Add("For a moment, you worry that your cum is going to escape - considering the fullness of the load that’s being expelled - but your knot does its job and plugs her snatch nicely, preventing any of your virile treasure from escaping. Slowly, your new mate’s womb begins to swell and distend from all the baby batter that’s going into it, rounding out gently as if she were already pregnant and beginning to show.", parse);
			Text.NL();
			Text.Add("At last, it’s nearly over. With a final shudder that sends you to shaking all over, you squeeze a final rope of seed out of your shaft, and the flow ceases. Panting, shivering as the heat rises from your body, the mind-fogging haze of lust that obscures you from your fatigue and aches slowly begins to lift. As for her, you’ve quite literally fucked her senseless - though her ass and tail are still high in the air where you’ve knotted her, she’s practically collapsed in front, head on her feathered hands, unable to hold her arms straight. She pants and chirps weakly and deliriously; the moment your knot subsides enough to allow an exit, she slides off your slowly softening shaft and collapses to the ground with a whimper, a trickle of cum running down her thighs.", parse);
			Text.NL();
			Text.Add("She smells different now; although traces of her maiden musk still linger, they will soon blow away with the wind and be washed clean by the rain. Another male catching her new scent will know that he’ll have to get through you if he wants to claim her.", parse);
			Text.NL();
			Text.Add("Though you want little more than to join your mate in rapidly approaching slumber, with your new position come new responsibilities. The pool and its surroundings look safe enough; the light from the glowing water plants should dissuade any threats from harassing the both of you. Reaching down for some of the clear water, you splash it on yourself and your receding shaft in a bid to clean off the worst of the sticky mess that coats your fur and feathers; the cold snowmelt bites into your aches and pains, making them a little more bearable, but what you need is rest.", parse);
			Text.NL();
			Text.Add("At last, you’re satisfied that you’re relatively safe for now. With the waterfall’s roar to soothe your thoughts, you curl up with your new mate and wrap your feathered hands about her belly; she murmurs and wriggles in your grasp, but a gentle nip on her collarbone soon calms her. She feels so soft and warm, especially when contrasted with the cold clarity of the pool, and you rumble happily at the thought of being able to hold this exquisite, exotic beauty every night from now on.", parse);
			Text.NL();
			Text.Add("There will be tomorrow to deal with, but that can wait.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("Daylight beckons.", parse);
				Text.NL();
				Text.Add("A shaft of sunlight falls from the heavens, and the rainbow created by its passage through the waterfall’s mists is the first sight to meet your bleary eyes. Come to think of it, grandmother once told you that rainbows were supposed to be a sign of good luck, but you don’t think that this was the kind of rainbow she meant. Still, you’ll need all the luck you can get, and offer up a quick, silent prayer of thanks to the Sky Mother. First, for the previous night, and now for the sleek, warm shape that lies in your grasp.", parse);
				Text.NL();
				Text.Add("She’s awake, if not quite completely so; those dark, wide eyes of hers peer back at you from her half-turned head as she lies beside you, watching your every movement. The fact that she hasn’t tried to escape or kill you while you slept is probably a good sign, but she isn’t watching you with fear or anger, but rather… curiosity?", parse);
				Text.NL();
				Text.Add("Stretching the stiffness from your chest and wings, you release her and sit up, slowly sliding your hands free by running them through her silvery-grey fur. You note with a little satisfaction that it’s still splattered with patches of dried and drying cum from last night’s breeding, and wonder if the mating took. It doesn’t seem to bother her, but perhaps you should clean up the both of you in a bit.", parse);
				Text.NL();
				Text.Add("Well, time to try and introduce yourself properly…", parse);
				Text.Flush();
				
				GryphonsScenes.WorldsEdgeQuestions({});
			});
		});
	});
}

GryphonsScenes.WorldsEdgeQuestions = function(opts) {
	var parse = {
		
	};
	
	//[Name][Others][Land]
	var options = new Array();
	if(!opts.Name) {
		options.push({ nameStr : "Name",
			tooltip : "What’s her name?",
			func : function() {
				opts.Name = true;
				
				Text.Clear();
				Text.Add("She looks up blankly at your question, eyes as wide and inquiring as before, but makes no sound. You repeat your question again, slower this time, but she remains as silent as before.", parse);
				Text.NL();
				Text.Add("Does she have no name? That’s not right… does she even understand what a name is?", parse);
				Text.Flush();
				
				GryphonsScenes.WorldsEdgeQuestions(opts);
			}, enabled : true
		});
	}
	if(!opts.Others) {
		options.push({ nameStr : "Others",
			tooltip : "Are there any other gryphons in this valley?",
			func : function() {
				opts.Others = true;
				
				Text.Clear();
				Text.Add("She furrows her brow at your question, then shakes her head. What’s that supposed to mean? That there aren’t any others of your kind here in the valley, or that she doesn’t understand your words?", parse);
				Text.Flush();
				
				GryphonsScenes.WorldsEdgeQuestions(opts);
			}, enabled : true
		});
	}
	if(!opts.Land) {
		options.push({ nameStr : "Land",
			tooltip : "Is this her land? Her territory?",
			func : function() {
				opts.Land = true;
				
				Text.Clear();
				Text.Add("This seems to spark some recognition in her at least. She nods, then spreads an arm towards the pool and trees before lowering the gesture and gazing at you curiously. It’s more than you expected, perhaps, but still awfully vague. Why the reluctance to say anything?", parse);
				Text.Flush();
				
				GryphonsScenes.WorldsEdgeQuestions(opts);
			}, enabled : true
		});
	}
	if(options.length > 0)
		Gui.SetButtonsFromList(options, false, null);
	else {
		Gui.NextPrompt(GryphonsScenes.WorldsEdgeSexytimes);
	}
}

GryphonsScenes.WorldsEdgeSexytimes = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("A cold knot forms in the pit of your stomach. If she’s so perfectly formed in every way, yet at the very last turns out to be a blank simpleton… doing your best not to let your panic show, you gently take hold of your new mate’s shoulders and ask if she can even speak. She can, right? You <i>heard</i> her last night!", parse);
	Text.NL();
	Text.Add("<i>“Speak… yes, can speak.”</i>", parse);
	Text.NL();
	Text.Add("You suppress the urge to heave a sigh of relief. Who taught her?", parse);
	Text.NL();
	Text.Add("<i>“Mother.”</i>", parse);
	Text.NL();
	Text.Add("And where is her mother?", parse);
	Text.NL();
	Text.Add("She flinches and turns away, unable to meet your stony gaze. <i>“Mother… go. Not come back. Long time.”</i>", parse);
	Text.NL();
	Text.Add("Well, that would explain her poor diction. It’s probably not the best idea to press her on the finer points of her past right now, but going a long time without anyone to talk to and perhaps not having learned to speak very well before her mother vanished… well. She’s not stupid; you’ll just have to add teaching her to talk properly on the list of things to do.", parse);
	Text.NL();
	Text.Add("Back to the point. You soften your tone a little, tousle her hair. If she doesn’t grasp the meaning of a name, then what did her mother call her?", parse);
	Text.NL();
	Text.Add("<i>“Mother calls…”</i> her brow furrows in concentration. <i>“Aurora. Name?”</i>", parse);
	Text.NL();
	Text.Add("Yes, that’s her name, you explain to her, taking care to emphasize each word; a name is what others call you. It isn’t one that’s familiar to you, though, neither your tribe nor the nearby ones used such a name.", parse);
	Text.NL();
	Text.Add("<i>“Name?”</i> she asks, pointing at you.", parse);
	Text.NL();
	Text.Add("You tell her. It was your grandfather’s name, and while it may be hard on the beak and tongue, you’re still proud of it.", parse);
	Text.NL();
	Text.Add("<i>“Et-hel-berd.”</i> She says it hesitantly, trying to enunciate the strange sounds with care. Aurora looks blank for a moment, clearly trying to marshal her thoughts. It makes her look so childlike, the way her thoughts are written on her face so unguardedly… <i>“Name.”</i>", parse);
	Text.NL();
	Text.Add("Yes, that’s your name; it’s what others call you. A twinge runs up your back, and you’re reminded of how sore you are. That and you’re not exactly clean yourself, either - the roar of the waterfall invades your consciousness, and your eyes wander over to foam and spray, a reminder that you really ought to wash the both of you. After that, you should really see to getting food -", parse);
	Text.NL();
	Text.Add("Something tickles the inside of your thigh, and you turn back to find Aurora on all fours and sniffing at your crotch, her beak almost touching your sheath. You can’t scent it yourself, no more than she can sense her own feminine musk, but her intentions - and curiosity - are clear. Firmly, and perhaps a little more roughly than strictly necessary, you cup her chin in your palm and lift her head out of there. Sure, you’re more than willing to give it to her if she likes it so much, but now’s not the time for that.", parse);
	Text.NL();
	Text.Add("<i>“Thing. Not there?”</i>", parse);
	Text.NL();
	Text.Add("Hah. Fine. <i>Maybe</i> you’ll indulge her just a little, as a reward for being such an obedient girl thus far. Reaching down with two fingers, you spread your sheath just far enough for her to glimpse the tip of your shaft nestled inside, then shake your head and sigh as her gaze travels between your cock and balls. You know the answer - it’s painfully obvious, if the only other of her kind she’s known is her mother - but the question still has to be asked. Letting go of your sheath, you lean in close enough to Aurora so that she can’t evade your gaze, and ask her if you’re the first male she’s ever seen, or if she even understands what a male is.", parse);
	Text.NL();
	Text.Add("She squirms uncomfortably at the intensity of your presence, and yet the desperation to understand and anger at her ignorance is written not just in her eyes, but the sudden change in the way she carries herself. Deciding to spare her the agony of asking, you think back to all the talks both your father and mother had with you about the importance of choosing a proper wife and begin…", parse);
	Text.NL();
	Text.Add("…By the time you’re done, Aurora is staring at you. Now that’s a curious look, and seeing it plastered all over her face without any attempt at restraint is more than a little amusing. You’re not sure that she’s grasped all of what you’ve tried to convey, but she’s certainly understood enough to be bashful about it.", parse);
	Text.NL();
	Text.Add("<i>“What mate?”</i>", parse);
	Text.NL();
	Text.Add("You explain that it was what you did to her last night. It was something that all creatures know, although some need a little more help than others. Did she like it?", parse);
	Text.NL();
	Text.Add("<i>“Yes. Yes. It is like… learning to fly. Pain at first. And then…”</i> Aurora’s gaze turns dreamy as her voice trails off.", parse);
	Text.NL();
	Text.Add("Well, you note to yourself with a little amusement, that’s probably why she didn’t try to sneak off or kill you in your sleep. Now that the formalities are done with, it’s time to get cleaned up before the sun gets too high.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("The water is colder than you remember it being, gushing down the cliff and over the rocks before crashing down into the pool. Snowmelt brought in from the peaks, far different from the muddy watering holes of your ancestral lands - the pool is deep, clear and refreshing.", parse);
		Text.NL();
		Text.Add("Aurora has no problem with the water’s chill, and looking at the way her wet fur and feathers stick to her curves, her nipples stiff with the cold, and most importantly, the gentle bulge on her once-flat belly where your freshly spent seed resides - come to think of it, you suddenly don’t feel that cold anymore. She glides gracefully into the water, dunking her head under the surface, and comes up again with a loud gasp.", parse);
		Text.NL();
		Text.Add("What a delightfully wild little thing. You’re content to lean back and soak for a moment, watching her scrub away the worst of last night’s excess from her body, noting the muscles in her arms and back flex and shift with sinuous grace. The flowing water runs through your fur and feathers, carrying away the dirt and weariness of travel and leaving you calm and refreshed.", parse);
		Text.NL();
		Text.Add("Almost as if your body’s taken on a life of its own, you find yourself wading out from the shallows towards her, into the mist and spray of the waterfall. Aurora’s eyes flick open when your arm snakes around her midriff, but soon sink closed with a gentle chirp as your free hand reaches for that spot between her wings and begins to scrub away. Nothing blatant, nothing overtly sexual, just a good washing in those hard-to-reach areas which make one very grateful that someone else is around to help. After all, you’ll have to show her how it’s done if you want her to reciprocate the favor.", parse);
		Text.NL();
		Text.Add("Well, you linger a little longer than strictly necessary about her inner thighs, but don’t go any further.", parse);
		Text.NL();
		Text.Add("Her shoulders, her back, the thin layer of fat just under her skin and on her muscle - compared to last night’s savage mating, this is slow, soothing, subtle. She reaches for your legs, but you gently slap her hands away - she can wait until you’re done if she wants a go.", parse);
		Text.NL();
		Text.Add("Lowering your voice to a whisper, you ask if it isn’t very nice to have someone else to wash your back for you. She hums in the back of her throat, a soft, joyous sound, and that’s all the answer you need. You run your claws run through Aurora’s fur and feathers, loosening tangles and savoring the touch of warm flesh contrasted against cold water.", parse);
		Text.NL();
		Text.Add("Eventually, you’re done, and help her up onto a rock jutting out from the water’s surface. Yes, she cleans up pretty, but you already knew that.", parse);
		Text.NL();
		Text.Add("<i>“Clean?”</i> Aurora asks, wide-eyed and eager to please.", parse);
		Text.NL();
		Text.Add("Stretching out face-down in the rocky shallows, you give her question a half-hearted, dismissive wave of a hand, and she begins, getting down on all fours to better clean you. Aurora’s claws dig a little too deeply into your back as she scrubs away and grooms your fur, but you can tell that she’s doing her best to imitate your motions. Half-wild as she is, you can’t expect her to get it right on her first try, can you? Folding your wings against your back, tail swishing about in the shallows, you recline in as dignified a position as you can and settle down to enjoy the sensation of letting her wash you. It’s endearing, the way she tests the firmness of your muscles with her fingertips or tries to get a better handle on your scent when she thinks you’re not paying attention.", parse);
		Text.NL();
		Text.Add("The next time she gently pinches your shoulder, you reach out and grab her thumb and forefinger with your own. Not enough to cause discomfort, but just enough to inform her that you know. Aurora chirps, the undertones of her voice betraying her embarrassment at being caught out, and you sit up and give her a pat on the head.", parse);
		Text.NL();
		Text.Add("Even if she can’t speak well, it doesn’t matter. No words were needed, anyway.", parse);
		Text.NL();
		Text.Add("She slinks around you, and a gentle nibble at your wings draws your attention - Aurora is preening your wings, the tip of her beak searching amidst long flight feathers and setting right the misplaced ones. The pinpricks of touch at her gentle nibbling on sensitive skin and bone sends shivers running along the length of your spine; there’s a reason why flying is considered such an enjoyable activity, and another as to why only mates and mothers preen wings this way. You’d hoped to take this a little slow, to gradually introduce her to your expectations, but it seems her instincts have led her thus far.", parse);
		Text.NL();
		Text.Add("Still, you feign disinterest at Aurora’s tender ministrations, acting as if what she’s doing is only expected of her and no more; it takes a considerable effort to not focus on how satisfying it feels to have another of your kind by your side, let alone to bathe with. It’s been too long…", parse);
		Text.NL();
		Text.Add("How long has it been, exactly? More than two months, less than a season. The days and nights blended together, first out of rage, later from determination, then at the very last, from lust.", parse);
		Text.NL();
		Text.Add("And now…", parse);
		Text.NL();
		Text.Add("Tail swishing lazily, you ease yourself onto your feet and announce that you’re done, striding past Aurora with renewed strength and determination. With a leap, you dive into the pool and are barreling through the water as if you were flying, schools of tiny fish scattering from the ferocity of your passage. The sudden chill tears at your feathers, your skin, and the air is exquisite when you come up for breath.", parse);
		Text.NL();
		Text.Add("Emerging from the pool, water cascading off your naked form, you stretch your entire body from head to toe, fully aware that Aurora is watching you intently. The aches have dissolved, the hurts - both within and without - gone. For the first time in a long while, you feel… feel… what’s the word for it?", parse);
		Text.NL();
		Text.Add("Hopeful? Happy? Powerful? No, those fail to capture the fullness of what you’re feeling right now. You feel like you could face an onslaught of marauding wyverns and emerge victorious on a mountain of their corpses, you could soar to the stars and bring them down with a flick of your wrist, could level mountains and fill in valleys. Who cares about words? Your new mate seems to have survived well enough without needing to articulate her every thought. The fact that you feel, and more importantly, <i>know</i> it is enough; the next step is to channel that energy towards reshaping the world around you and making it more to your liking.", parse);
		Text.NL();
		Text.Add("Gently but firmly, you catch Aurora by the arm and help her to her feet, water dripping from her legs and hindquarters as she rises from the pool. Your blood still hasn’t washed off her chest feathers yet, leaving a rust-brown stain on the snowy white, but maybe it’ll do her some good to have that mark for a little longer. In any case, this valley is a good place. Together, the two of you will build a home.", parse);
		Text.NL();
		Text.Add("She looks confused by your words. <i>“Home? Already live here.”</i>", parse);
		Text.NL();
		Text.Add("You laugh, a loud, screeching sound that echoes off the waterfall cliff. No, not home. <i>A</i> home. She’ll understand in due time.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			GryphonsScenes.Outro(Gender.male);
		});
	});
}

// Chapter two - Pasts
GryphonsScenes.Pasts = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("In your dream, he is everywhere.", parse);
	Text.NL();
	Text.Add("You cannot see, hear, nor scent him, but you can nevertheless feel his presence. Its sheer intensity does not merely reside in the darkness outside your little pool, but <i>is</i> the darkness itself, pressing against you from all directions, leaving you unable to breathe.", parse);
	Text.NL();
	Text.Add("You would be confused, perhaps even frightened, but the knowledge that he does not mean to kill you makes all the difference. With the survival instinct quelled, other desires come to mind, ones that you sensed but did not know how to fulfill until his arrival. He speaks, his voice directed at you, but you do not understand his words.", parse);
	Text.NL();
	Text.Add("You know how to speak, too. There is still a dim, hazy memory of Mother speaking to you, and you have talked to yourself ever since she… left, but you do not know many words. Perhaps Mother had intended to teach you more at some point, but she is long gone. Your speech is slow and clumsy compared to his, and that fact leaves you ashamed, inadequate.", parse);
	Text.NL();
	Text.Add("<i>“All creatures know,”</i> he says, the first words you hear clearly and truly understand. His voice is strong and clear, cold winter wind and warm spring breeze in one, and you shudder. Half of you wants to flee, while the other half desires nothing more than to throw yourself at him.", parse);
	Text.NL();
	Text.Add("You try to tell him that no, you don’t, but your words come out as a mess of unintelligible squawks and chirps, much to your shame. He seems to sense your distress and steps towards you, breaking into the small circle of light that is your world.", parse);
	Text.NL();
	Text.Add("<i>“I will help you.”</i>", parse);
	Text.NL();
	Text.Add("He draws closer and closer, moving with the grace that only comes with restrained power. You can’t help but notice the flowing of his muscles beneath tawny golden fur, nor can you tear your eyes away from the perfect flexing of his limbs and joints. You can do nothing but sit helplessly and wait for him to come to you; and he sweeps you from your seat with a single deft movement of an arm, lifting you just high enough for you to nibble at the base of his beak. He rumbles gently at the touch, acknowledging your actions, but does not stop you.", parse);
	Text.NL();
	Text.Add("<i>“Let me show you.”</i>", parse);
	Text.NL();
	Text.Add("With that, he carries you into the darkness. You pool of light shrinks, growing smaller as he carries you further and further away, and then there is only his touch, his breath, and his scent. One is enough to quicken your pulse; all three combined together…", parse);
	Text.NL();
	Text.Add("What happens next is a whirl of confusion and ecstasy. There is pain and blood, you remember that, but there are also strange, intense sensations that you cannot put words or even ideas to. His body is different from yours, and he uses it to the fullest, the effect of his strong, slightly spicy scent making you flush with heat…", parse);
	Text.NL();
	Text.Add("…You feel so full, so heavy…", parse);
	Text.NL();
	Text.Add("…Crooning, whimpering, growling with a strange almost-aggression…", parse);
	Text.NL();
	Text.Add("…Sweat and stickiness, you want it, you want it all in you…", parse);
	Text.NL();
	Text.Add("…This is what you were made for…", parse);
	Text.NL();
	Text.Add("…And you are afraid no more.", parse);
	Text.NL();
	Text.Add("<i>“What is your name?”</i> he asks you, and though your mind is addled with the pleasures that he is inflicting on your person, you still hear him clearly. You do not remember what you say, but can sense his satisfaction at your answer.", parse);
	Text.NL();
	Text.Add("You, too, remember his name - and what’s more, you remember it well.", parse);
	Text.NL();
	Text.Add("Ethelberd.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("You awake to a warm stickiness between your thighs, sweat-soaked fur, and a clear puddle on the ground - this wouldn’t have been so embarrassing if the two of you’d mated the night before, but that isn’t the case. You’ll have to clean it up… and when you get the chance, yourself as well, else he’ll tease you mercilessly over it.", parse);
		Text.NL();
		Text.Add("There’s an empty spot beside you where he should be, though. The smooth stone of the raised shelf that serves as your bed is cool to the touch; he’s been gone for some time, then. Blinking, you chase away the last vestiges of sleep and look up. It’s barely dawn outside, the dull red of the rising sun beginning to chase off the darkness of night, but it’s more than enough to see by. He’s not amongst the numerous odds and ends that lie stacked against each other by the cave entrance, either -", parse);
		Text.NL();
		Text.Add("All of a sudden, you feel light-headed and lean against the nearest wall, wings fluttering for balance.", parse);
		Text.NL();
		Text.Add("There it is again, the strange sensation of queasiness that wells up in your lower belly. It was mild at first, but today’s bout is strong enough that you have to sit down on the ground until it passes.", parse);
		Text.NL();
		Text.Add("Are you ill? You recall the last few times you were ill; chills from the wind, a bout of bad food when you were younger and didn’t know your home as well as you do today - you couldn’t hunt, and even the usually sweet pomegranates were tasteless… the more you didn’t want to eat, the sicker you got, and…", parse);
		Text.NL();
		Text.Add("…Maybe now that you have a mate, he will care for you if you are ever ill again. A few more deep breaths, and you feel well enough to stand; rubbing your face to clear your thoughts, you step out of the cave and into fresh air. The moon, though faint, is still visible in the sky, soon to be eclipsed by the sun’s brilliance. It was not there on the night he came, and now it lies full and round, marking the turning of the seasons.", parse);
		Text.NL();
		Text.Add("He hasn’t been with you for that long, not even for one moon, and yet it feels like he’s been around forever. Is your mind playing tricks on you? No, ever since he came, he’s been busy making little improvements about your home; smoothing your bed, taking the rough edges off the walls and leaving them pleasantly smooth to the touch. You don’t really understand <i>how</i> he does it, but it’s something that you wish to learn someday.", parse);
		Text.NL();
		Text.Add("Enough daydreaming. You’re getting hungry, and food isn’t going to find itself. Spreading your wings, you leap off the cliff’s edge in one fluid motion, and soar in search of your mate.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("It’s not hard to catch his scent and let your sense of smell lead you to him. He sits in the stream that flows out from your pool, a glittering ribbon of clear water that stretches away from the waterfall and winds its way through a series of rocky rapids before joining the river proper. You spot the thing he calls a “spear” lying on the stream’s bank - instead of using it to fish, he’s opted to go with nothing but his bare hands; placing his weight on his haunches as he crouches, wings folded flat against his body, he advances on his prey, arms elbow-deep in the shallows.", parse);
			Text.NL();
			Text.Add("You know better than to call out to him, and settle down by the water’s edge to watch. He’s simply so <i>intense</i> when he’s concentrating like this…", parse);
			Text.NL();
			Text.Add("Moments pass, and by and large, you become aware of your own breathing. His eyes are half-lidded, his gaze fixed on the water - and then, he has a large trout by the tail, the creature thrashing about in his grasp frenziedly. It’s only then that he acknowledges your presence, a calm nod that’s followed by a questioning glance when he notices the matted fur between your thighs. Oh. You’d <i>really</i> meant to clean yourself up, but it sort of slipped your mind while you were watching him…", parse);
			Text.NL();
			Text.Add("He notices your embarrassment, then rolls his shoulders and clicks his beak at you, his demeanor instantly melting into something that’s far more easygoing and playful. <i>“Wash yourself, Aurora; it simply won’t do for you to be going around like that. Let me handle the food.”</i>", parse);
			Text.Flush();
			
			//[Wash][Help Out]
			var options = new Array();
			options.push({ nameStr : "Wash",
				tooltip : "Well, if he’s willing to do all the work, you’ll just enjoy a little soak.",
				func : function() {
					Text.Clear();
					Text.Add("Well, if he’s sure he can handle it by himself, you’ll just stay out of his way and watch.", parse);
					Text.NL();
					Text.Add("He smirks, flicking his tail. <i>“Smart girl.”</i>", parse);
					Text.NL();
					Text.Add("You don’t know if that’s supposed to be a compliment or tease, but don’t want to pout in front of him. He steps over to you and rubs you on the back between your wings before giving you a gentle nudge towards the stream.", parse);
					Text.NL();
					Text.Add("<i>“Get yourself cleaned up, then. I’ll have our meal ready in no time. You must be hungry.”</i>", parse);
					Text.NL();
					Text.Add("The water is swift and cool; he might find it cold, but you’re used to it. Hugging the bank a little way downstream, you submerge yourself to the neck in the shallows and watch him return to fishing with his bare hands.", parse);
					Text.NL();
					Text.Add("Concentrating, you try and project your presence the way he does, to make him notice you. How does he do it, anyway? You stare at the back of his neck intently, willing him to feel your gaze, but he doesn’t so much as stir, save for the tiny movements as he carefully stalks his prey.", parse);
					Text.NL();
					Text.Add("Can he teach you to do that, too? To draw others to you? Like… like the way he’s teaching you to talk better?", parse);
					Text.NL();
					Text.Add("Now that you’re thinking of him, though… idly, you let your mind wander, imagining him stalking not fish, but you instead… slowly closing in with his prey unaware, silent and unseen until the moment he pounces…", parse);
					Text.NL();
					Text.Add("A shiver runs across your skin, and it has nothing to do with the water’s temperature. No, this isn’t helping.", parse);
					Text.NL();
					Text.Add("He’s a blur of motion when he moves, droplets of water cascading through the air and glinting in the early morning light as he holds up his latest catch. He tosses it on the bank with a flick of his hand, then strides over to you with a few easy steps and hauls you still dripping out of the water.", parse);
					Text.NL();
					GryphonsScenes.PastsWashed();
				}, enabled : true
			});
			options.push({ nameStr : "Help Out",
				tooltip : "It’s not right that he does all the work, and you’re far from helpless. You should see what you can do to help out.",
				func : function() {
					Text.Clear();
					Text.Add("It’s not right that he does all the work, you point out. You can work a little way downstream from him and get cleaned up at the same time. Besides, since you’ve been eating more lately, it’s probably best that the both of you bring in as much as you can, lest you devour it all.", parse);
					Text.NL();
					Text.Add("He only looks more amused by your answer, letting out a small chirrup of laughter as he tosses the trout onto the bank next to his spear. <i>“Suit yourself.”</i>", parse);
					Text.NL();
					Text.Add("He can be so… <i>dismissive</i> sometimes. Still, you don’t want to pout in front of him, and ease yourself into the water a little ways downstream from him, where the water froths and spray rises as the current crashes into rocks. Amidst them are those small, delightful anchovies that while not exactly a meal in and of themselves, always make a good accompaniment to one with their sweet taste. The quick little things are impossible to catch when out in schools amidst the fast-flowing rapids, but it’s another matter when they come to rest amongst the rocks.", parse);
					Text.NL();
					Text.Add("You know how to do it by heart: reach in, close your hand in slowly, seize. Much easier said than done, but you’ve been doing this ever since you were much younger. The concentration the task requires, as well as the swift, cool water pressing against your skin quickly calms your thoughts, and it’s not long before you’ve managed to nab two fistfuls of the slender little fish, still wriggling on the grassy bank.", parse);
					Text.NL();
					Text.Add("He calls out to you, and you see him approaching with his catch - three large trout, each about as long as your forearm. The nod of approval he gives you sets your heart racing, and you haul yourself out of the water to meet him.", parse);
					Text.NL();
					GryphonsScenes.PastsWashed();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		});
	});
}

GryphonsScenes.PastsWashed = function() {
	var parse = {
		
	};
	
	Text.Add("<i>“Come on,”</i> he says, shaking water out of his fur and feathers and gathering his spear. <i>“Let’s eat.”</i>", parse);
	Text.NL();
	Text.Add("The two of you set yourselves down on the grassy bank a little further inland and set out the catch - one for you, one for him, and the third trout in between the both of you. The taste of fresh blood is always welcome, and it blossoms on your tongue as you rip the head off with a strong, savage twist. The head is always the best part, with fewer scales than the rest of the fish itself. Definitely better than the tail, and the bones have the most delightful texture when you crush them in your beak. Almost as soon as it was in your hands, it’s gone, and you settle down to the rest of the meal at a more leisurely pace.", parse);
	Text.NL();
	Text.Add("On his part, he eats carefully like he always does, making sure no scrap of flesh is wasted, then gathering the bones and scales before grinding them in his beak. It’s slow, but he does hate to see things go to waste, especially food. Yes, he’s told you that he often went hungry while wandering, but he must have been horribly so for him to end up like this… you try to imagine what it must be like to not have food for that long, to go days without anything to eat and then gorge yourself into a stupor when you do have something to eat.", parse);
	Text.NL();
	Text.Add("You can’t. The valley has been kind to you, but you’ve never really known just how kind until now; the thought of going more than a day or two without anything to eat just doesn’t sit right in your mind. Berries in the spring and summer, small animals and other game throughout the year, and sweet fruits of all kinds in the autumn, when they swell and sweeten on the bough. During the mild winters, it’s not too hard to break the thin ice in the waterfall pool and fish that way, or simply head for one of the numerous streams that run through the valley…", parse);
	Text.NL();
	Text.Add("A gentle restraint on your wrist draws you out of your thoughts, and you look down to discover that you’ve reached for the last trout without thinking. His touch is light against your skin, but carries the promise that it can get a lot harder if need be.", parse);
	Text.NL();
	Text.Add("He tilts his head and chirps wryly. <i>“You want the head, don’t you?”</i>", parse);
	Text.NL();
	Text.Add("Yes, you do.", parse);
	Text.NL();
	Text.Add("<i>“You’ll have to ask for it.”</i>", parse);
	Text.NL();
	Text.Add("You look between the glistening prize on the grass, then at him. Back, and forth. Back, and forth. He’s not going to budge on this, is he?", parse);
	Text.NL();
	Text.Add("You hesitate a moment, then lower your gaze. <i>“May have?”</i>", parse);
	Text.NL();
	Text.Add("<i>”May I have it, please?”</i> he corrects you gently. <i>“Also, it’s alright to look people in the eye when you speak to them. Not all of the time, but most of it. You’ll need to figure out when, but social graces can wait for later.”</i>", parse);
	Text.NL();
	Text.Add("Social graces. Those are new words; you’ll have to ask him what they mean later. For now, you take a moment to line up your thoughts. <i>“Ma-y I have it?”</i>", parse);
	Text.NL();
	Text.Add("<i>“May I have it, <b>please</b>?”</i>", parse);
	Text.NL();
	Text.Add("<i>“M-may I ha-ve it, please?”</i> You speak even slower than he does, and wrapping your tongue around the unfamiliar syllables is enough for you to fall silent for a few seconds, exhausted from the effort.", parse);
	Text.NL();
	Text.Add("<i>“And what do you say afterwards?”</i>", parse);
	Text.NL();
	Text.Add("Oh. You’d nearly forgotten. <i>“Th-ank you.”</i>", parse);
	Text.NL();
	Text.Add("He beams, and your heart misses a beat. You sense that this was important, but can’t put the feeling into words. <i>“You remembered. That’s a good girl.”</i> He releases your wrist with a small flourish, then picks up the trout. A flex of his muscles, a sharp grunt of effort, and now he’s holding one half in each hand, meat juices dripping from his wrists.", parse);
	Text.NL();
	Text.Add("<i>“Here.”</i> He tosses you the fish head, and you aren’t going to allow such a treasure to fall to the ground. <i>“Nice catch.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Th-ank you.”</i> Yes, the words are easier on you now. One day, you’ll be able to speak like he does; you just have to practice with him. You start on the head, he starts on the tail, and between the two of you there’s nothing left, not even a single scale or bone. The meal done, you lounge for a bit, sated, while he heads down to the stream to drink and wash his hands, crouching and lowering his head to the water’s surface to take sips of clear snowmelt before returning.", parse);
	Text.NL();
	Text.Add("<i>“So, what shall we do today? I believe you still had somewhere to show me, or have we been through the entirety of our territory?”</i>", parse);
	Text.NL();
	Text.Add("You run through the places you’ve shown him since his arrival: the rapids, the canyon that leads out of the valley, the gullies which lie on the slopes, carved out by the wind, open fields filled with melon vines that are exquisite at the right time of the year. That should be all of it…", parse);
	Text.NL();
	Text.Add("Well, there is one more place. You’d been putting it off for as long as possible, afraid of what he’d say, but you can’t keep on dragging your feet, nor can you lie to him. He can <i>smell</i> lies - you don’t know how, but you’re pretty sure of that.", parse);
	Text.NL();
	Text.Add("There is still the grove, and you tell him as much.", parse);
	Text.NL();
	Text.Add("He nods and picks up his spear. <i>“Well, then. Let’s wait a little while for your stomach to settle, then head off.”</i>", parse);
	Text.NL();
	Text.Add("It’s all right, you tell him. You don’t feel unwell at the moment. He studies you for a moment, then pulls you to your feet with a sweeping motion, not too unlike the one he used in your dream. <i>“Lead the way, then.”</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("You don’t go to the grove often. Not because it’s hard to get to - your wings carry you up the sheer cliff to the plateau well enough - but because… you just don’t want to. This high up, without the valley walls to keep moisture in, the air is drier and the grass thinner, waving in the gentle breeze that sweeps in from the clear, cloudless sky.", parse);
		Text.NL();
		Text.Add("He lands beside you, wings flapping, knees and toes cushioning the impact of meeting the earth. Dropping into an easy crouch, he gets to his feet, using the shaft of his spear as a walking stick of sorts, then surveys his surroundings.", parse);
		Text.NL();
		Text.Add("<i>“Hmm.”</i> He kneels down and inspects the dirt, letting a pinch run through his feathered fingers. <i>“Hmm. Interesting place you have here. Shall we have a closer look?”</i>", parse);
		Text.NL();
		Text.Add("The trees stand in a circle, huddled against each other for protection from the wind. They aren’t as tall or straight as those of their kind down in the valley, rougher and more gnarled, but the snow-white blossoms that adorn their branches are just as beautiful anywhere. It’ll take some moons yet before they bear ripe fruit, good to eat, but you lost your appetite for these particular fruits a long time ago.", parse);
		Text.NL();
		Text.Add("<i>“Aurora. Is something wrong?”</i>", parse);
		Text.NL();
		Text.Add("He must have noticed your silence, your listlessness. You don’t want to answer the question, but neither do you want to lie to him, so you simply remain silent, waiting, hoping that he won’t press the question.", parse);
		Text.NL();
		Text.Add("He may be teasing at times, but he’s not cruel. He doesn’t press.", parse);
		Text.NL();
		Text.Add("The two of you step into the circle of trees, passing through momentary shade and back out into bright noon sunshine. Amidst the dandelions and grass, in the middle of the circle, there is one last tree, its roots thick and wide, but otherwise no different from those which form the circle.", parse);
		Text.NL();
		Text.Add("<i>“It’s peaceful here,”</i> he says, treading the soft ground beneath his feet. <i>“Comforting. Looks like a good place to take a nap.”</i>", parse);
		Text.NL();
		Text.Add("You nod, still silent.", parse);
		Text.NL();
		Text.Add("<i>“What’s the matter?”</i>", parse);
		Text.NL();
		Text.Add("Words have never been easy at the best of times, let alone now; all you can manage is a strangled noise in the back of your throat as a tight, cold ring grasps your neck. His gaze and stance shifts ever so slightly, suddenly alert and dangerous as he reaches for you with his free hand and shakes you by the shoulder. His grip is hard enough to hurt, and you whimper.", parse);
		Text.NL();
		Text.Add("<i>“Answer me! Are we in danger?”</i>", parse);
		Text.NL();
		Text.Add("You manage a no, although it doesn’t sound like a word even to you.", parse);
		Text.NL();
		Text.Add("<i>“Then what’s the problem?”</i>", parse);
		Text.NL();
		Text.Add("His gaze follows your finger as you point at the lone tree in the middle of the circle.", parse);
		Text.NL();
		Text.Add("Mother.", parse);
		Text.NL();
		Text.Add("<i>“In it?”</i>", parse);
		Text.NL();
		Text.Add("No, not in it, under it.", parse);
		Text.NL();
		Text.Add("He turns his gaze inwards, taking in the tree’s rough bark, its broad crown and thick roots. Features softening slightly, he lets go of your shoulder - it still stings - and approaches the tree, standing in its shade before bowing his head.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("The plateau was one of those places where the earth met the sky. It was a boundary, neither the lush verdancy of the valley nor the barren beauty of the peaks, sheltered from the north wind by the crags that lay in that direction, but open to the air otherwise.", parse);
			Text.NL();
			Text.Add("When Mother did not return that night, you slept fitfully. When she did not reappear the next day, you ignored her cautions to not leave the nest and sought her out, hunger and concern driving caution to the winds. It was not too difficult to pick up her scent, and you followed it to this place.", parse);
			Text.NL();
			Text.Add("You remember… it was here that you found her bloodied body, sightless eyes staring up into the cloudless sky.", parse);
			Text.NL();
			Text.Add("You are not unacquainted with death - your mother has been teaching you to hunt, after all. But she was the biggest, strongest thing in your world, and for her to end up like one of your kills is… <i>wrong</i>.", parse);
			Text.NL();
			Text.Add("Besides, nothing had tried to eat her. You did not hunt something for the mere sport of it.", parse);
			Text.NL();
			Text.Add("Great gashes had been gouged into her flesh, her wings broken and bent at strange angles. The fruit that she said she’d be out gathering lay strewn on the grass in a circle, some of them trodden on, others squeezed until they’d burst. The sweet and sour smell of juice mixed with the coppery tang of blood and broken feathers, forever etched into your memory.", parse);
			Text.NL();
			Text.Add("It is a gryphon’s instinct to bury remnants and remains; small as you were compared to her, it took you three days and nights to dig a grave deep enough to fit what was left, only pausing when you grew too hungry or tired to continue. After you’d dealt with what was left of the thing that once was Mother, you buried all of the fruit where it had fallen. It only seemed like the right thing to do.", parse);
			Text.NL();
			Text.Add("After all, it was not as if you were going to eat of the harvest that she died trying to keep.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("<i>“And these trees grew where the fruit fell?”</i> He still doesn’t stir, his head bowed, his breathing shallow.", parse);
				Text.NL();
				Text.Add("That is it, you answer uncertainly.", parse);
				Text.NL();
				Text.Add("He reaches out and lays his palm on the trunk before him, feeling its bark. <i>“This one feels stronger than the others.”</i>", parse);
				Text.NL();
				Text.Add("You have no words for him.", parse);
				Text.NL();
				Text.Add("Slowly, he removes his hand, leans his weight on the shaft of his spear, and closes his eyes. He doesn’t move, but his beak opens and closes slightly, murmuring something under his breath that you can’t make out.", parse);
				Text.NL();
				Text.Add("What is he doing?", parse);
				Text.Flush();
				
				//[Ask][Watch]
				var options = new Array();
				options.push({ nameStr : "Ask",
					tooltip : "Ask him what he’s up to.",
					func : function() {
						Text.Clear();
						Text.Add("Your eyes dart between him and… Mother, the rest of you fidgeting nervously while you try to figure out what to do.", parse);
						Text.NL();
						Text.Add("Finally, you square your shoulders, tug gently on his wing, and ask what he’s doing. Normally, you wouldn’t want to disturb his concentration, but this <i>is</i> Mother, after all. You <i>need</i> to at least ask.", parse);
						Text.NL();
						Text.Add("He ignores you.", parse);
						Text.NL();
						Text.Add("There’s nothing for it, you suppose, but to stand back and wait for him to be done.", parse);
						Text.NL();
						GryphonsScenes.PastsRemembrance();
					}, enabled : true
				});
				options.push({ nameStr : "Watch",
					tooltip : "There’s something somber about his actions. Words can wait; you should just watch.",
					func : function() {
						Text.Clear();
						Text.Add("Your breath catching in your throat, you step up beside him; he shuffles slightly to one side, making space for you. Usually, you have to force yourself to come here and stand here before the tree, before Mother, but today is different.", parse);
						Text.NL();
						Text.Add("Today, he is at your side. While it doesn’t take away the sad, empty feeling in you, you are not afraid today.", parse);
						Text.NL();
						Text.Add("His head is still down, his beak moving, and you follow suit, feeling an urge to join him. You feel a strange presence that sends tingles running across your fur and feathers - almost like when you’re the recipient of his attention…", parse);
						Text.NL();
						GryphonsScenes.PastsRemembrance();
					}, enabled : true
				});
				Gui.SetButtonsFromList(options, false, null);
			});
		});
	});
}

GryphonsScenes.PastsRemembrance = function() {
	var parse = {
		
	};
	
	Text.Add("At long last, he raises his eyes and takes your hand, gently leading you away from the tree and back through the ring of greenery.", parse);
	Text.NL();
	Text.Add("<i>“I paid my respects. It only seemed appropriate.”</i>", parse);
	Text.NL();
	Text.Add("You’re not familiar with the term, so you ask him what it means.", parse);
	Text.NL();
	Text.Add("<i>“In my tribe, we remember those who came before us, and those who gave their lives such that we may live. It’s a complicated idea to describe.”</i>", parse);
	Text.NL();
	Text.Add("Tribe. There’s another word you’re not sure of. He’s told you what it means, but even so… when you weren’t alone, it was just Mother and you, and now him and you. The idea of two or three handfuls of your kind being together is more than you’ve ever imagined.", parse);
	Text.NL();
	Text.Add("He continues the thought. <i>“Something hunted her?”</i>", parse);
	Text.NL();
	Text.Add("To hunt is not the right word to use, you insist. Not when Mother ended up… going away.", parse);
	Text.NL();
	Text.Add("He lets out a soothing murmur and rubs you on the back of your neck, taking his time to fluff your feathers with his fingertips. <i>“Still, you understand my meaning?”</i>", parse);
	Text.NL();
	Text.Add("Yes, you do. And that is the case.", parse);
	Text.NL();
	Text.Add("<i>“You’re right, though. We’re not hunted. We’re not prey, because we can kill those who would dare.”</i> His gaze hardens. <i>“I must teach you someday.”</i>", parse);
	Text.NL();
	Text.Add("When?", parse);
	Text.NL();
	Text.Add("<i>“I should have asked earlier. You haven’t seen any other strange flying things about, have you?”</i>", parse);
	Text.NL();
	Text.Add("No, he was the first thing bigger than a large bird you ever remember encountering.", parse);
	Text.NL();
	Text.Add("<i>“There are things out there which are trying to kill us. I came to escape them,”</i> he explains, looking thoughtful. <i>“We should be safe here, but since you are my mate, you must learn. Amongst the many other things I find myself compelled to teach you.</i>", parse);
	Text.NL();
	Text.Add("<i>“Don’t be afraid, Aurora. I know you are, even if you won’t admit it. Let’s go home - would you like some comforting?”</i>", parse);
	Text.NL();
	Text.Add("His suddenly hushed voice leaves little doubt as to what he means by that, and before you know it, you find yourself clinging to his firm waist and broad chest, pushing your beak against his fur and inhaling deeply of his scent.", parse);
	Text.NL();
	Text.Add("<i>“Want home.”</i>", parse);
	Text.NL();
	Text.Add("He doesn’t bother correcting you. <i>“Let’s go, then.”</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("Time passes…", parse);
		Text.NL();
		Text.Add("His idea has taken a long time to bear fruit, but the work is almost complete now. Both of you began work two days after returning from the grove, and now, the first fruits that you’ve buried in the earth have sprouted. The result is new saplings that stand tall with their roots firmly in the earth, drinking in the warm summer sunshine.", parse);
		Text.NL();
		Text.Add("Clearings are rare in the valley; he’s picked the largest one which still suited his designs, but there still wasn’t enough space. To this effect, he’s felled trees at the edges, making room for those which you will plant in their stead. You don’t fully understand why he wants to do this - the valley’s gifts have always been enough to feed you well enough - but he insisted.", parse);
		Text.NL();
		Text.Add("<i>“It’s not enough to live day by day,”</i> he told you when you asked. <i>“One has to look to what lies ahead.”</i>", parse);
		Text.NL();
		Text.Add("It is true, you suppose. Until he came, you’d never really thought about what tomorrow would bring, living day by day, alone and unthinking. But he… he thinks and does things that you would once have considered impossible, such as felling the huge trees of the jungle like what he’s doing now. Flint axe in hand, he hacks away at the trunk of his latest conquest, putting the entirety of his body to use; if not for the fact that you had work to do, you could watch him forever, the graceful yet strong movements of his muscles as he puts his all into it strangely alluring…", parse);
		Text.NL();
		Text.Add("His work is hard and exhausting; felling the tree, splitting the stump, then hacking and digging up the roots before filling in the hole left behind in preparation for planting. He usually manages two a day, three if he’s particularly energetic. It leaves him tired, sore and hungry at the end of the day, and that’s not counting the effort it takes to split the felled trunks into something more manageable before bringing them back.", parse);
		Text.NL();
		Text.Add("You’re glad you’re not the one doing it. Instead, he’s assigned you to digging small holes in the spots he’s marked as ready, and planting fruit, which will hopefully sprout. It’s a task that’s more suited to you in your current condition. He’s right, when you think about it more deeply. There will soon be more gryphons in the valley, more mouths to feed.", parse);
		Text.NL();
		Text.Add("Almost of its own accord, your hand caresses the gentle, firm swell of your belly. Over the last moon or so, the dizzy spells and queasy bouts stopped, and your once sleek midriff began to grow outwards, your breasts turning tender and full. He was suitably pleased when he pronounced that you were going to be a mother, but you yourself feel so… what’s the word for it…", parse);
		Text.Flush();
		
		//[Hot][Content][Worried]
		var options = new Array();
		options.push({ nameStr : "Hot",
			tooltip : "",
			func : function() {
				Text.Clear();
				Text.Add("Hot, that’s the word you were looking for. Dreamily, you think back to the night that he first came; how he took you, filled you up and made you feel so full. You love the feeling of having life growing inside of you, the faint flutters of movement inside your womb only serving to fuel your delight. You haven’t told him about those - they only started a few nights ago - but imagining your brood stirring inside you only serves to make your heart beat faster while you daydream of growing heavy with child.", parse);
				Text.NL();
				Text.Add("A soft moan escapes your beak, and you realize that the fingers that you were caressing your pregnant bump with have found their way into your snatch, pumping in and out as you fantasize about him seeding you over and over again, your belly growing round and ripe with each brood of gryphlets that take root in your womb. Quickly, you stop and hurriedly wipe your slick fingers on the grass before he notices.", parse);
				Text.NL();
				GryphonsScenes.PastsSexytimes(2);
			}, enabled : true
		});
		options.push({ nameStr : "Content",
			tooltip : "",
			func : function() {
				Text.Clear();
				Text.Add("Content, that’s the word; you feel so peaceful. The sensation of new lives growing inside of you make you feel calm and relaxed, perhaps even sleepy; you have little doubt that this feeling will only grow with time. He says it’s odd that your belly is getting this big this quickly, that there’s probably more than one in there. Even so, you aren’t worried about the prospect of such; all of this just feels so <i>right</i>, and it keeps any fears you might have had at bay.", parse);
				Text.NL();
				Text.Add("He’s here, and he’ll protect you and the brood of gryphlets that’s growing in your womb. That’s all you need to know.", parse);
				Text.NL();
				GryphonsScenes.PastsSexytimes(1);
			}, enabled : true
		});
		options.push({ nameStr : "Worried",
			tooltip : "",
			func : function() {
				Text.Clear();
				Text.Add("Worried, that’s the word you were looking for. He’s mentioned that you’re starting to show sooner than expected, whatever that means, and that you’re probably carrying more than one gryphlet. How big are you going to get? Will you get too heavy to fly? You try to imagine your belly big and round like he described, full of growing gryphlets, but no matter how you picture it you always end up looking fat and clumsy…", parse);
				Text.NL();
				Text.Add("Will you start feeling ill again? What if…", parse);
				Text.NL();
				Text.Add("No… he’s here. He’ll guide and teach you, like he has since his arrival. That, at least, is something that you don’t have to worry about, and you feel a little more comforted by the thought.", parse);
				Text.NL();
				GryphonsScenes.PastsSexytimes(0);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	});
}

GryphonsScenes.PastsSexytimes = function(preg) {
	var parse = {
		
	};
	
	Text.Add("More importantly, though, will you be a good mother? Your memories of Mother are so dim and hazy that you’re not completely sure what you should do other than feeding and cleaning. Maybe it’s for the best that he wants you to help tend the saplings; you’ll have a chance to get used to having to care for something…", parse);
	Text.NL();
	Text.Add("You remember Mother, how she always seemed so big to you. Will your own children see you the same way? A towering, protective giantess?", parse);
	Text.NL();
	Text.Add("You hope so.", parse);
	Text.NL();
	Text.Add("His voice cuts through your thoughts. <i>“Aurora!”</i>", parse);
	Text.NL();
	Text.Add("Oh no… you’ve fallen behind with all your daydreaming. The job isn’t too hard - dig into the freshly turned earth with the trowel he’s made, unearth and throw away any fruit that failed to sprout, plant the fresh ones that the two of you picked the day before. You kneel and dig away, and are just about to move onto the next spot when he draws into view, axe in hand.", parse);
	Text.NL();
	Text.Add("<i>“It’s getting hot,”</i> he says, panting. <i>“We should take a small break.”</i>", parse);
	Text.NL();
	Text.Add("You nod and say that you’d be glad for the chance, although you do feel a little guilty at not having done all you could. He senses your unease, even if he doesn’t know the reason behind it, and takes your hand reassuringly, squeezing it as the two of you make for the cover of the tree line. He sets down his axe by a freshly hewn stump, you do the same with your trowel, and the two of you sit down in the shade a moment to catch your breath.", parse);
	Text.NL();
	Text.Add("It’s an interesting thing he’s doing, you wonder aloud as you edge a little closer to him. He’s so driven, so ambitious…", parse);
	Text.NL();
	Text.Add("He squints at you. <i>“To be frank, you were the one who came up with the idea. I merely followed it, and it led me here.”</i>", parse);
	Text.NL();
	Text.Add("What does he mean?", parse);
	Text.NL();
	Text.Add("<i>“It struck me the day after you brought me to see where your mother lies,”</i> he says. <i>“The way an entire grove sprung up in a field because of all the fallen fruit you buried so long ago.</i>", parse);
	Text.NL();
	Text.Add("<i>“In my old tribe, we used to follow the herds which we depended on, moving from place to place when they did; all we knew was that the wild wheat would be back when the herds returned. Even if we’d thought to plant anything, we wouldn’t have stayed long enough to get anything out of it, and chances were another tribe would pass by and reap our hard work before we returned.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Here, though, I’m not going anywhere, so it’s worth the time.”</i> He gives you a brief hug. <i>“It makes sense, now that I’ve given it some thought. I still haven’t figured out why some of them sprout and others just rot, but there’s got to be something to it. In the end, though, I wouldn’t have thought of doing this if you hadn’t brought it up to me.”</i>", parse);
	Text.NL();
	Text.Add("You return the hug, pressing your body against his, feeling the softness of his fine feathery coat.", parse);
	Text.NL();
	Text.Add("<i>“It’ll take some time for us to get anything useful out of all our work,”</i> he says thoughtfully. <i>“But we’re not just doing this for ourselves. We have to think of our children.”</i>", parse);
	Text.NL();
	Text.Add("You feel his muscles shift, and you’re suddenly very, very aware of his touch on the gentle swell of your midriff. Tracing the firm bump of your pregnancy with his fingertips, the gentle pricking of his claws against your skin sending shivers down your spine, he works his hand downwards towards your pussy lips. You moan and tremble in anticipation, waiting for what seems to be inevitable, but he draws his hand away and breaks the hug, a knowing, naughty glint in his eye.", parse);
	Text.NL();
	Text.Add("<i>“Not now,”</i> he whispers, nibbling at your beak. His breath is warm, heavy and musty, smelling of heat and exertion. <i>“There’s still work to be done.”</i>", parse);
	Text.NL();
	Text.Add("B-but weren’t you supposed to be resting?", parse);
	Text.NL();
	Text.Add("<i>“Yes, that’s true.”</i> His fingers find their way to your nipples, teasing each of them in turn; gentle beads of warm milk well up at their tips even as they grow large and stiff. <i>“But then, who’s going to split logs later if I use all my strength in fucking you silly? Later, love, later. The sooner we finish today’s work, the sooner we can get to it.”</i>", parse);
	Text.NL();
	Text.Add("Something tickles at your nether-lips, and you have to squeeze your eyes and clench your beak to stifle a wail. He’s such a tease! You hate him, and yet… yet at the same time, the warm wetness seeping from your groin and into your fur betrays you. It’s not your fault, it really isn’t; ever since you stopped being ill in the mornings, you’ve been feeling especially raunchy for the father of your brood. There’re so many things happening to you, so many changes in yourself that you don’t notice until too it’s late, and… and…", parse);
	Text.NL();
	Text.Add("You have to take a deep breath to calm yourself, and it doesn’t go unnoticed by him. He chuckles and runs his fingers through your wings, taking his time in savoring the sensitive flight feathers. <i>“Good girl.”</i>", parse);
	Text.NL();
	Text.Add("Noon passes; the two of you share a small meal of pomegranates that fills the stomach and quenches one’s thirst, then move on to the afternoon’s work. You can’t help but steal the occasional glance at him, but he’s completely immersed in the tiresome job of splitting logs. No matter how much you try, though, you can’t concentrate like he does; it takes a lot of effort to keep your thoughts lined up, but at long last, you heap the last of the dirt into the hole and pat it down with the trowel’s stone blade.", parse);
	Text.NL();
	Text.Add("Finally. Now to look for him…", parse);
	Text.NL();
	Text.Add("He’s not at the log pile, which is odd, since the axe is leaning against the stack of cut wood he’s piled up at the clearing’s edge. Where is he? This isn’t funny; if-", parse);
	Text.NL();
	Text.Add("A rustle of foliage, a rush of air. Suddenly, his weight is pressing on you and forcing you to the ground, the heat of his body close to yours as he nibbles on the back of your neck.", parse);
	Text.NL();
	Text.Add("<i>“Gotcha.”</i>", parse);
	Text.NL();
	Text.Add("You make a show of squirming and struggling, but it’s not as if you want to break out from under him, even if you could. With a small chirp, you ask him where he was all this time.", parse);
	Text.NL();
	Text.Add("<i>“Look up next time, love.”</i>", parse);
	Text.NL();
	Text.Add("Oh. Well, now that everything’s done and over with, is he going to make you ask for it?", parse);
	Text.NL();
	Text.Add("<i>“Don’t be silly,”</i> he replies. <i>“You’ve already made it clear what you want, so I’m just going to give it to you.”</i>", parse);
	Text.NL();
	Text.Add("You close your eyes and shiver. Here? Now?", parse);
	Text.NL();
	Text.Add("<i>“Why not? But you know, maybe you’re right. Hmm…”</i>", parse);
	Text.NL();
	Text.Add("Before you know it, he’s hauling you upright, pressing you against the nearest of the tall, woody trees with your back to the trunk, your wings splayed against rough bark. Without hesitation, he lowers his head to preen your feathers, the tip of his beak pricking against your collarbone. Whether you want it or not, your body is stiffening with anticipation; it’s only when your lungs cry for air that you realize that you’ve been holding your breath. He twists his head, moving his attentions to your neck, to the crook of your chin.", parse);
	Text.NL();
	Text.Add("At the same time, you can’t help but take hold of one of his hands, guiding it to your generous cleavage. He acquiesces to your request, tickling tender titflesh with tenuous touches, pressing ever so lightly. The flush of heat that rushes into your breasts is enough to make you squirm and gasp; even knowing that they’ve grown with your pregnancy, they feel so especially <i>warm</i> and <i>full</i> when he touches them…", parse);
	Text.NL();
	Text.Add("Done with your neck, he lifts his head and takes a half-step to your side to better admire you from that angle, tail swaying idly from side to side as his eyes drink in your form. Being examined like this, you can’t help but feel…", parse);
	Text.Flush();
	
	//[Proud][Pleased][Shy]
	var options = new Array();
	options.push({ nameStr : "Proud",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("Proud, proud that you’re going to bear his gryphlets. Meeting his gaze with a playful one of your own, you lean back with hands on your broad hips and push out your belly as far as it’ll go. Does he like what he sees?", parse);
			Text.NL();
			Text.Add("His only reply is a snort and a smirk, then he reaches to trail his fingertips across the swell of your pregnancy, wrapping a broad, feathery wing about you in the process. His touch… it’s exquisite, and you can imagine the tiny gryphlet - no, gryphlets - in your belly, a growing brood getting bigger and stronger by the moment, becoming more and more fully formed as the moment of birthing slowly draws nearer with each passing day…", parse);
			Text.NL();
			Text.Add("Yes, this is what you were made for, to be a mate and mother, to be the fertile soil which will bear full, ripe fruit from his seed. He continues to rub, his hand moving closer and closer to your crotch like he did earlier on… hungrily, you push your wet pussy against his hand and half-growl, half-chirp. It doesn’t matter that you’ve already been bred; you want his cock inside you, his seed filling what remaining space in your womb that isn’t already occupied by your gryphlets. The thought of him thoroughly breeding you over and over again only makes the sensation of him teasing your folds all the more luxuriant, until you can’t take it any longer and release a squirt of girl-cum all over his fingers.", parse);
			Text.NL();
			GryphonsScenes.PastsSexytimes2(preg);
		}, enabled : true
	});
	options.push({ nameStr : "Pleased",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("Pleased, pleased that he appreciates you. It’s the same sensation of being watched from the very first night he entered your life, but knowing now that his gaze is protective… it makes you feel all warm and good inside. His hand slides up your tail to its base, pausing to grope and squeeze your full, firm buttcheeks one at a time; wanting more, you push into his cupped palm and rub your ass all over his fingers.", parse);
			Text.NL();
			Text.Add("<i>“Naughty girl,”</i> he chides you, giving your ass a firm smack.", parse);
			Text.NL();
			Text.Add("You snap at him playfully, a gesture he easily avoids and counters by running his fingers around your wide, birthing hips. Tiny sparks of pleasure erupt just under your skin at his touch, only serving to add to the hot anticipation growing in your lower belly. With predatory swiftness, he whips his hand around to sink his fingers into your hot, tight snatch.", parse);
			Text.NL();
			Text.Add("You sing in pleasure, and it’s only because of the tree you’re leaning against that your knees don’t give way and send you to the ground. Feeling trickles of your girl-cum ooze from your pussy lips and run down his fingers, it takes you a moment for you to be able to think straight again.", parse);
			Text.NL();
			GryphonsScenes.PastsSexytimes2(preg);
		}, enabled : true
	});
	options.push({ nameStr : "Shy",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("Shy, shy that he won’t appreciate you the way he did when you were sleek and slender. Sensing your hesitation, he croons deeply and runs a hand down your front, following the contours of your form from your collarbone, through your cleavage, over the bump of your pregnancy and finally stopping just above your snatch.", parse);
			Text.NL();
			Text.Add("<i>“Don’t be afraid, Aurora,”</i> he whispers. <i>“You’re a good girl, and doing very well for your first time at this.”</i>", parse);
			Text.NL();
			Text.Add("Perhaps all it took was to hear the words coming from him, but he’s right; your trepidation melts away like the last snows of winter, and you lean into his strong, powerful frame, letting his hands play across your body where they will.", parse);
			Text.NL();
			Text.Add("He doesn’t lie. If he says something will happen, it will happen. Not always immediately, but he’ll see it through. You’ve only been with him for a season, and yet you feel like you’ve known it all your life.", parse);
			Text.NL();
			Text.Add("His hands find the lush curves of your hips, fingers playing at your fur and gently kneading the soft layer of feminine fat that lies over your muscles.", parse);
			Text.NL();
			Text.Add("<i>“Look at these. There’s no doubt that you’ll have an easy birth.”</i>", parse);
			Text.NL();
			Text.Add("You try to think of something to say, but your thoughts are cut short by his fingers diving into your snatch and coming out wet and glistening.", parse);
			Text.NL();
			GryphonsScenes.PastsSexytimes2(preg);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

GryphonsScenes.PastsSexytimes2 = function(preg) {
	var parse = {
		
	};
	
	Text.Add("You moan loudly, lewdly; first, when he withdraws his fingers, then again when a wave of pleasure runs upwards from your groin, your inner walls clenching down hard on empty air as they seek something to grasp, to fill you with.", parse);
	Text.NL();
	Text.Add("Your arousal isn’t lost on him, either - his body is preparing itself accordingly, the folds of his sheath already parted to reveal his thick, black shaft, already half-erect and getting fuller and stiffer by the second. The tantalizing musk of mating meets your nostrils as he wipes his hand off on your side, smearing your own girl-cum all over your fur.", parse);
	Text.NL();
	Text.Add("You don’t care. All you want is that thick, throbbing cock - <i>all</i> of it - inside you as soon as possible.", parse);
	Text.NL();
	Text.Add("<i>“Why so eager? To be honest, I thought you’d cool down a little once you were bred.”</i>", parse);
	Text.NL();
	Text.Add("You can’t explain your raunchiness yourself, but who cares? Why, is he complaining?", parse);
	Text.NL();
	Text.Add("He laughs. <i>“Only when there are better things to do, love. Come on, then - let’s get started.”</i>", parse);
	Text.NL();
	Text.Add("You can hardly wait, and chirp in delight as he grabs you by the waist and hoists you off your feet, whirling around such that it’s now his turn to have his back to the tree. Fluttering his wings a few times for balance, he lets himself slide down its length until he’s half-sitting, half-lying down with his legs outstretched, the raging erection of his knotted cock standing tall in the air. You look down at it, watching beads of pre ooze from its twitching tip, almost touching your pregnant belly as you straddle his thighs.", parse);
	Text.NL();
	Text.Add("<i>“Not as good as mating while flying,”</i> he grunts. <i>“But I know it’s one of your favorites.”</i>", parse);
	Text.NL();
	Text.Add("It <i>is</i> one of your favorites. With a flourish, he picks you up and yanks you forward onto the tip of his shaft, allowing his glans to kiss the thick fullness of your nether lips a few times. You wail and wriggle in his grasp, tail thrashing in the air and sweet honey dripping from your soaked thighs onto his cock; he clicks his beak in mock disapproval, then impales you on the length of his shaft, letting gravity spread your slick cunt to fit him snug and tight like a sleeve.", parse);
	Text.NL();
	Text.Add("With a feral glint in his eye, he begins, going from nothing to giving it his all in a matter of moments.", parse);
	Text.NL();
	Text.Add("The ride is almost too much for you to bear. Up and down, up and down his strong arms carry you along the base of his shaft, from the ridge of its head to the base of its knot. His grip is so firm you don’t even have to balance yourself with your arms, but are free to flap, squirm and wriggle as you please without falling.", parse);
	Text.NL();
	Text.Add("Up and down. In and out. Down you go, your ass slapping against his generous balls, and up comes his cock to meet you. Your tender breasts and life-laden womb jiggle and bounce in time with his thrusts; the extra weight only making you more conscious of each and every motion of your mating. Deep within you, flutters of motion come to life in your lower belly; it seems that your brood has been awakened by all the activity.", parse);
	Text.NL();
	Text.Add("You can’t wait to bathe them in their father’s seed. Can you conceive while you’re already carrying chicks? You don’t think so, but still…", parse);
	Text.NL();
	Text.Add("He grunts and growls, chest heaving from the exertion of both mating and keeping you in place, breath coming out in great, hot gusts that spill across his chest. At this point, there’s not much use in even trying to steady yourself, so you simply concentrate on the pleasure he’s giving you, trusting him not to drop you or let you go astray.", parse);
	Text.NL();
	Text.Add("It’s still not enough; you haven’t taken his knot inside you yet. Incorrigible tease! You need more! More!", parse);
	Text.NL();
	Text.Add("As if sensing your thoughts, he slides his grasp down to your thighs and pushes down firmly as he thrusts upward. There’s a brief resistance, and then you feel his knot slip into you, your inner walls gripping it tightly even as it begins to swell in earnest, tying the two of you together. Not that he stops, of course - in fact, since you’re firmly hilted on him like this, he moves his hands back up your waist, reaching for your chest. You lean forward a little, letting him cup your breasts with his outstretched palms, and moan as the firm, swollen nubs of your nipples make contact. Soon, like he said, they’ll be big and bountiful, and you wonder if they’ll get big enough that his hands can’t cup them anymore…", parse);
	Text.NL();
	Text.Add("He can’t go on much longer, not with the way his balls are churning against your ass, ready to spill his virile seed into you. You do your best to clench your insides, to milk his cock for all it’s worth, but you’re not quite sure if - who cares? You can worry about that later; he’s clearly enjoying himself. With your addled mind and fogged vision, you can barely register his face, clearly as lost in bliss as you are.", parse);
	Text.NL();
	Text.Add("Cum… more… hungry…", parse);
	Text.NL();
	Text.Add("He’s the first to cum; you feel the gentle pulsating of his seed traveling up his cock and fountaining up inside you, spurting through your cervix and into your womb, oozing around his knot and out of your cunt. The glorious feeling of being filled… there, in that moment, you want nothing more in life than to be his mate forever, to be well-cared for and taught so many interesting things, to feel the heat of his body and scent his spicy male musk, and most of all, to be filled with his seed and bear strong, healthy gryphlets who will make their father proud.", parse);
	Text.NL();
	Text.Add("You scream as you orgasm, a shudder running through your very being from head to toe while your inner walls grip his cock with all the strength you can muster. He keeps on going as long as he can, as long as his seed will last; eventually, he’s spent everything he has inside you, but not before you’ve cum again. Growling with the effort, he hefts you off his cock with an audible pop, thick baby batter oozing from your well-used cunt and splattering on his groin as you slip off his knot. He then plonks you down on the grass in the most unceremonious fashion, finally getting a moment’s respite; instinct drives you to curl up on the soft grass beside him, your hammering heart finally starting to slow a little.", parse);
	Text.NL();
	Text.Add("<i>“Aurora.”</i> His voice is but a mumble, utterly drained from the effort of mating.", parse);
	Text.NL();
	Text.Add("Exhausted as you are, you barely manage to reply. Yes?", parse);
	Text.NL();
	Text.Add("<i>“You always seem so joyous. So happy, no matter what happens.”</i>", parse);
	Text.NL();
	Text.Add("Are you? You’d never noticed; you’ve always behaved as how you are. Yourself.", parse);
	Text.NL();
	Text.Add("<i>“Stay like that for me. Happy. It makes it all worthwhile.”</i>", parse);
	Text.NL();
	Text.Add("You get the vague feeling that he’s said something important, that you should pay extra attention to his words, but your mind and body just don’t seem to want to play nice with your intentions. Snuggling into his warm embrace, you wrap yourself around him as best as you can and drift off to sleep.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		GryphonsScenes.Outro(Gender.female, preg);
	});
}

GryphonsScenes.Building = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("The days are growing shorter.", parse);
	Text.NL();
	Text.Add("You turn your eyes from the setting sun and back to your tools. Back while you were with the tribe, the days grew longer and shorter too, following the succession of the moons, but they were more abrupt about it. Here in the valley, the deep orange sun hangs long in the sky, sharing its space with the moon as it reluctantly slips behind the horizon; its dying rays illuminate the sharp, jagged peaks-", parse);
	Text.NL();
	Text.Add("-That’s enough. Time to turn your mind to matters more pressing. Carefully, you clean the blood off your flint knife on the grass, then put it away with the others under the skins. There will be more work tomorrow - there will always be more work, but tonight is a time of rest.", parse);
	Text.NL();
	Text.Add("With that thought in mind, you head in to gather your mate.", parse);
	Text.NL();
	Text.Add("Aurora has grown big, too. Your mate sports a gravid belly large enough to grace a mother carrying a full-grown gryphlet, and she’s only just barely entered the last phases of her pregnancy, if your counting of the moons is right. It’s plain to see that you’ve seeded more than one life in her womb, an auspicious start to what will hopefully be many, many more sons and daughters to come. Curled up upon the sleeping shelf, she cradles her life-laden belly with both hands, eyes closed, wings fluttering and tail swaying as she feels for the movements of her growing gryphlets.", parse);
	Text.NL();
	Text.Add("You certainly chose well; Father would be proud of you.", parse);
	Text.NL();
	Text.Add("<i>“Aurora.”</i> You reach down and take hold of your mate, fingers sinking into her luxurious, light fur and feathers. Ooh, she’s grown considerably heavier than you remember her being. Her muscles tense, then relax when she realizes it’s you. <i>“It’s almost time to eat. Want to watch me cook?”</i>", parse);
	Text.NL();
	Text.Add("<i>“Yes.”</i> She purrs deeply, sleepily, warm limbs wrapping about your body as you carry her out and lay her on the dry dirt outside, a little way by the fire pit.", parse);
	Text.NL();
	Text.Add("<i>“Want to try lighting it this time?”</i>", parse);
	Text.NL();
	Text.Add("<i>“No.”</i> She emphasizes her answer with a flick of a wing, then lays her head between her hands to watch you. You chuckle and give her a pat on the head, then reach for the flint and tinder, blowing on the sparks you strike. The tinder smolders well, and it’s not too long before you have a small fire going with the logs you split today. Aurora returns with the skewered pieces of the hog you butchered earlier this afternoon, then watches the fire intently as you turn the skewers on the spit and allow the meat to roast in its own juices.", parse);
	Text.NL();
	Text.Add("<i>“Still don’t like fire, eh?”</i>", parse);
	Text.NL();
	Text.Add("She gives you a disaffected click of her beak. <i>“No.”</i> Nevertheless, her movements, her eyes - they give her thoughts away with the way they flicker, her muscles twitch impatiently, poised to spring into action. Aurora may have changed much since you strode into her life and began rearranging it to your liking, but there’s a part of your mate that’ll always be a wild thing.", parse);
	Text.NL();
	Text.Add("<i>“You don’t have to lie to me, you know,”</i> you tell her, looking smug.", parse);
	Text.NL();
	Text.Add("She huffs. <i>“I can never understand how you can always tell. What gives me away? My scent? I’ve always wondered if it’s my scent…”</i>", parse);
	Text.NL();
	Text.Add("<i>“And I can never understand why you keep on trying, despite the fact that you know it’s pointless. Cheeky little thing.”</i>", parse);
	Text.NL();
	Text.Add("She sticks her tongue out at you, then goes back to fussing over her pregnancy. Snorting, you turn from the fire to see the last rays of amber light die from the horizon, allowing darkness to complete its conquest across the valley. The soft light of your fire caresses your fur, the spitting and hissing of melted fat plays its own faint music amidst the chilly night wind, and the scent that rises from the ashes is simply wonderful. No grasses, no bulbs, no spices of any sort… there’s something, one supposes, to be said for eating with someone else. You check the meat, still browning over the fire, and breathe in the wonderful scents of Aurora and hot fat.", parse);
	Text.NL();
	Text.Add("<i>“I want you to get over your fear of fire, Aurora. You’re almost there - do you remember when I first lit one? You practically ran up the mountain screaming, and I had to go and get you down.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Don’t remind me of that!”</i>", parse);
	Text.NL();
	Text.Add("<i>“And once you’re done with that… you can start learning how to cook.”</i> Seems like the first of the skewers is about done; you take it off the fire, still glistening with melted fat, and wave it in front of her face. Raw is fine, but cooked is divine… and you pull the wooden skewer away just as she lunges for it, leaving her to snap her beak on empty air. <i>“You sure you don’t want to learn, or would you prefer to just stuff yourself on the results?”</i>", parse);
	Text.NL();
	Text.Add("<i>“You incorrigible tease!”</i> she cries.", parse);
	Text.NL();
	Text.Add("Whipping out your free hand, you catch Aurora by the chin and press down firmly with thumb and forefinger. <i>“Oh, but I am. What do you plan to do about it? Hmm? Hmm? You’ll learn to do both, then you can sneak morsels from your cooking and I’ll pretend not to notice. Well, not unless you take too much, then I’ll have punish you.”</i>", parse);
	Text.NL();
	Text.Add("She screams in mock outrage; you only laugh and shove the skewer in her hands. <i>“Careful now, it’s hot. Eat slowly and don’t burn your throat.”</i>", parse);
	Text.NL();
	Text.Add("She waves the skewer around before taking an experimental nibble. <i>“It’s tough.”</i>", parse);
	Text.NL();
	Text.Add("<i>“An old sow. Only to be expected.”</i>", parse);
	Text.NL();
	Text.Add("<i>“The piglets taste better, and you can fit a whole one on a stick like you do.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Yes, they do, but you don’t want to kill them - not if you want more hogs tomorrow.”</i> You tear off a morsel of roasted flesh with your beak. Simple yet filling, food fit for a king. <i>“That’s another thing that separates us gryphons from wild beasts: the ability to think of tomorrow, and prepare for it by working hard or going without today.”</i>", parse);
	Text.NL();
	Text.Add("She still seems confused by such concepts, and you have to remind yourself that she was a wild thing not that long ago. Though she learns fast, there’s also the matter of her having to unlearn that bestial mentality… or do you want it completely gone? A certain feral nature - hidden, of course - in your heirs might not be a completely bad thing… one can certainly see how it might be put to use.", parse);
	Text.NL();
	Text.Add("While you were thinking, Aurora’s gone after the organs, blood and meat juices, inevitably staining her lovely white feathers. You shake your head. Your mate eats so much but is tired all the time; it’s as if her unborn gryphlets are draining her energy in order to grow as quickly as they can. With each morning that passes, you’re sure that her belly is slightly bigger than it was the night before, and it shows no sign of slowing.", parse);
	Text.NL();
	Text.Add("<i>“Here, have these.”</i> You hold out the sow’s heart and liver to her, dangling the tantalizing morsels before her eyes like a piece of bait. <i>“You’ll need to enrich your blood.”</i>", parse);
	Text.NL();
	Text.Add("She reaches for it, taking the bait like the silly little thing that she is, and you grab her outstretched hand and yank her over with a firm pull. Her gravid body scuffles on the ground a little as you guide her body against yours, her back landing against your breast with a faint “oomph” and a flutter of wings. Grinning, you wrap your hands about your mate and let her have her prize even as you savor yours.", parse);
	Text.NL();
	Text.Add("<i>“Silly little thing,”</i> you whisper, cupping her swollen, milk-laden breasts with your hands and giving the sensitive dugs a gentle squeeze. She squirms a little, and nestles closer against you. <i>“Lured into my dastardly trap by food, of all things.”</i>", parse);
	Text.NL();
	Text.Add("<i>“It was worth it,”</i> she replies, her voice slightly muffled. By the tone of her voice, she actually meant it, too.", parse);
	Text.NL();
	Text.Add("<i>“Don’t talk while you’re eating. It’s impolite.”</i>", parse);
	Text.NL();
	Text.Add("Her beak is too occupied for a reply, and you take the opportunity to let your hands flow downwards, your palms running down the round, stretched curve of Aurora’s pregnancy. Her womb is full and warm, proof positive of your considerable virility, and you have to admit, there’s something very satisfying about having claimed a mate so thoroughly.", parse);
	Text.NL();
	Text.Add("Aurora purrs, instinctively pushing out her tummy so you can appreciate it more. Yes, you can feel the gryphlets in her squirming as they grow strong, but you have other ideas, too. Returning your hands to her swollen breasts, you feel through the soft layer of fluff and stroke her dark areolae, moving your fingertips in slow circles. Her purring is broken as her breath grows short, and she squirms against you, wings fluttering.", parse);
	Text.NL();
	Text.Add("<i>“Not now…”</i> she mutters, but you continue anyway, feeling the already swollen nipples growing stiff under your fingers. Your palms work away, stroking the full and firm boobflesh of your mate’s breasts, feeling a flush of heat creep into their teardrop-shaped confines even as her breath starts to come in small gasps.", parse);
	Text.NL();
	Text.Add("Why, is she that sensitive already?", parse);
	Text.NL();
	Text.Add("<i>“I don’t think so,”</i> you reply. <i>“You’ve fallen into my dastardly trap, remember? Now you’ll just have to submit to my nasty, evil demands… unless you can break free, that is.”</i>", parse);
	Text.NL();
	Text.Add("Of course, her pride demands that she put up a token struggle, but her heart clearly isn’t in it - all you have to do is hold onto her for a bit, and it’s over sooner than you expected.", parse);
	Text.NL();
	Text.Add("<i>“Well, looks like I couldn’t escape you. I’ll just have to - ah!”</i>", parse);
	Text.NL();
	Text.Add("Whoops, seems like that last squeeze made Aurora leak a little. You slow your ministrations a little, watching a bead of delicious cream well up on each nipple before seeping into her glorious feathers… ah, the little pleasures of life, soon to become big pleasures. Gently, you apply a little more pressure with your palms, and are rewarded with a shiver that runs the length of your mate’s body from head to tail-tip. Wonderful.", parse);
	Text.NL();
	Text.Add("<i>“No need to be so flighty,”</i> you tell her, nipping at the nape of her neck, making sure she feels the light pricking of your sharp beak-tip. <i>“You’re well and caught now; all you have to do is enjoy it…”</i>", parse);
	Text.NL();
	Text.Add("A soft wail escapes Aurora’s beak as you pull down gently on her breasts, fingers gentle but firm as they work up and down with rhythmic motions. Her nipples resist for a second or two, then she chirps as a warm trickle of rich cream oozes forth, wetting your hands with its thick goodness. The last vestiges of resistance give way to contented bliss, her body so much shivering, warm putty in your hands. Bit by bit, you increase the pressure, your movements growing more vigorous until the trickles turn into gentle streams of white, spurting forth from her engorged nipples with wanton abandon. Aurora cries, thrusting her torso against your hands, her body begging you to milk her down to the last drop.", parse);
	Text.NL();
	Text.Add("What a bounty it is! The sweet smell of your mate’s milk blends with the spicy scent of her arousal, made only more intense by her gravid state. Your cock stirs in its sheath, ready for duty at any moment, but you still your mind and focus on the task of milking your mate. Firm boobflesh pulses and flows under your hands as you squeeze and pull, and finally, finally does the flow begin to thin, heavy streams slowing to a trickle once more. Even so, it takes a good while for the flow to finally cease, the last few whitish droplets swelling forth from her nipples and rolling down to soak her already soggy feathers.", parse);
	Text.NL();
	Text.Add("Your mate whimpers and chirps pathetically, and it’s only then that you let go of her bountiful baby feeders, slightly smaller now that they’ve been drained. Addled from the sheer joy of being milked to the last drop, Aurora collapses into your embrace, her big, round belly heaving in and out as she pants heavily. It’s sorely tempting to take her there and then, to do your best and see if she can bear yet more gryphlets while already stuffed with a clutch, but you stay yourself with no small amount of willpower.", parse);
	Text.NL();
	Text.Add("<i>“So, were the delicious morsels still worth it?”</i>", parse);
	Text.NL();
	Text.Add("Your mate croons, lost in the absolute bliss of being hand-milked. She’ll make a good mother.", parse);
	Text.NL();
	Text.Add("<i>“I’ll take that as a yes, then.”</i> You give her a nip on the neck. <i>“Don’t forget to wash yourself off before you head to bed. Clean up well enough, and I might just take you properly.”</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("The next morning dawns, golden light pouring into your valley as the sun shows its face from behind the mountains. Aurora is always a pleasure to wake to, especially with her firm, voluptuous form snuggled in yours - a form that’s only grown more curvaceous with her advancing pregnancy.", parse);
		Text.NL();
		Text.Add("As the waking world looms, you claim your morning’s share of your mate, running your hands through her fur and feathers, delighting in her warmth. Her breasts are deliciously full and milky once more after being drained so soon, and she squeals and chirps, wriggling in your grasp as you squeeze them gently.", parse);
		Text.NL();
		Text.Add("<i>“All right, sleepyhead,”</i> you whisper to her. <i>“I’m off.”</i>", parse);
		Text.NL();
		Text.Add("She murmurs, and you swat her on her furry rump before stepping out into daylight. The days may have shortened, but the list of daily tasks has lengthened - and with Aurora reserving all her energy to grow her gryphlets, an ever greater proportion of the work falls on your shoulders. You look around you - your workbench, tools, even your spear - and feel…", parse);
		Text.Flush();
		
		//[Satisfied][Dissatisfied]
		var options = new Array();
		options.push({ nameStr : "Satisfied",
			tooltip : "It’s not much, but it’s the best you could do under these circumstances.",
			func : function() {
				Text.Clear();
				Text.Add("Satisfied. Sure, what you have to work with is really crude, but more importantly, it works. Of course, you’re not going to lie to yourself and this is the best you can do, but one step at a time - you’ve got only two pairs of hands to deal with things, and one pair is still learning.", parse);
				Text.NL();
				Text.Add("Surveying your handiwork once more, you allow yourself a little chirrup of contentment. Onwards and upwards, as the old saying goes.", parse);
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Dissatisfied",
			tooltip : "These are really crude, you ought to have done much better.",
			func : function() {
				Text.Clear();
				Text.Add("Discontent. Yes, you’ve done what you can on your own, without a whole tribe at your back aiding you, but even then you can’t silence the little voice in your head that keeps on telling you more could have been done. What would your father have said if he saw this? Maybe he <i>is</i> looking down at you with as much disapproval as you’re feeling right now…", parse);
				Text.NL();
				Text.Add("There’s always more to do. More to do… and not enough time in which to do it. you need a sharper blade for your axe, and that in turn means finding suitable quantities and forms of stone for sharpening. Better vines and resin with which to cure them. So much of the valley’s bounty lies unused; oh, if only you’d lived here as long as Aurora did - only in a less bestial fashion.", parse);
				Text.NL();
				Text.Add("Heavy hangs the head on which the crown lies.", parse);
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		
		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("As you look up from your workbench, though, something catches your eye amidst the golden dawn, and your gaze turns to the sky. Something aloft amongst the wispy clouds, but too large to be simple birds… two of them.", parse);
			Text.NL();
			Text.Add("Your heart hardens, and you can feel fire stir in your blood as your muscles instinctively tense. Could it be? Is it? The silhouettes are still too distant to make out what exactly they are, but there’s no time to lose. Reaching for your spear, you bellow for Aurora.", parse);
			Text.NL();
			Text.Add("<i>“What’s the matter?”</i> her sleepy voice mewls from within.", parse);
			Text.NL();
			Text.Add("<i>“Danger.”</i> You jab a finger up at the sky and the rapidly growing silhouettes. <i>“Hide yourself while I deal with it.”</i>", parse);
			Text.NL();
			Text.Add("Sleepy though your mate may be, the urgency and sharpness of your voice cuts through the fog of drowsiness. She follows your finger to the approaching figures, nods mutely and then spreads her wings to descend into the forest below. Only when she’s gone from sight do you return your gaze to the interlopers, your fingers clenched so tightly about the shaft of your spear that you can sense the blood pumping through them, a small mirror of your heart’s pounding.", parse);
			Text.NL();
			Text.Add("This is your home now - you have taken a mate, and she is about to bear your young. Killing to defend something is nothing new to you, but now you have more reason to do it.", parse);
			Text.NL();
			Text.Add("Moments pass, and by and large both silhouettes become clearer - furred and feathered like you are. You’re tempted to relax your guard, but the fact that the interlopers are gryphons like you doesn’t necessarily mean there’s less danger to be had. Yes, they’ve clearly caught your scent, and are heading straight for you - you should decide how you want to make your first impressions.", parse);
			Text.Flush();
			
			//[Aggressive][Diplomatic][Thoughtful]
			var options = new Array();
			options.push({ nameStr : "Aggressive",
				tooltip : "Make it clear that if they’re here to cause trouble, you’re more than willing to fight.",
				func : function() {
					Text.Clear();
					Text.Add("Best to meet the newcomers with a bit of deterrence, then. Planting your feet firmly on the ground, you broaden your stance, ready your spear and watch them close the distance with a stony gaze. Two of them, yes, and with a distinct deep blue color to their fur and plumage - from the northern tribes, then. Unarmed, but that doesn’t have to mean anything. They land on the shelf a little distance away from you, eyes darting between your gaze and the point of your spear.", parse);
					Text.NL();
					Text.Add("Guess it’s up to you to break the ice, then. <i>“This is my land, my valley. Who are you and what is your purpose here?”</i>", parse);
					Text.NL();
					Text.Add("<i>“We don’t mean any harm,”</i> one of them - the male - replies. <i>“We were fleeing, you see, and scented gryphons on the wind and wondered…”</i>", parse);
					Text.NL();
					Text.Add("<i>“This is the edge of the world. There is not much life here - as far as you are concerned, I am the only one of our kind in this valley.”</i>", parse);
					Text.NL();
					Text.Add("<i>“You have a mate.”</i>", parse);
					Text.NL();
					Text.Add("<i>“What of it? Why, do you wish to challenge me for her? Is one not enough for you?”</i>", parse);
					Text.NL();
					Text.Add("Both of them take an involuntary step back, and a rush of grim satisfaction courses through your body. Were you that imposing? <i>“N-no.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Good. Maybe now we can talk reasonably.", parse);
					Gui.PrintDefaultOptions();
				}, enabled : true
			});
			options.push({ nameStr : "Diplomatic",
				tooltip : "Go for a peaceful approach, but make it clear there’s an iron fist in that velvet glove.",
				func : function() {
					Text.Clear();
					Text.Add("They’re gryphons like you, even if from another tribe. Though the tribes have never quite agreed on much for most of their existence, maybe things can be different on a more personal level. At the very least, you think you can give them the benefit of the doubt - until they make a single false move, that is.", parse);
					Text.NL();
					Text.Add("Planting the base of your spear on the ground, you watch as both newcomers close the distance between you and land on the shelf, a male and his mate, by their scents. Their distinct deep blue fur and feathers mark them as from the northern tribes, and you hold out a hand palm outward by way of greeting.", parse);
					Text.NL();
					Text.Add("<i>“I greet you, one of the northern tribes.”</i> The formal words feel oddly stiff on your tongue, but you’ve had whole moons of speaking to no one but Aurora. <i>“Will you cry friend?”</i>", parse);
					Text.NL();
					Text.Add("<i>“I return your greeting, one of the plains,”</i> the male replies, instinctively stepping forward to place himself between his mate and your spear, showing you his hand in return. <i>“I choose to cry friend.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Then you are welcome on my territory, at my providence. Cause no trouble.”</i> No matter how friendly they might be, though, you keep a firm hand on your spear. The formalities done with, you give both blue gryphons a nod. Still, you keep your wording stiff and careful, as is always best when dealing with those from other tribes. <i>“Why have you come? This is the edge of the world.”</i>", parse);
					Text.NL();
					Text.Add("<i>“We are fleeing, and scented gryphons on the wind,”</i> the female pipes up. <i>“You have claimed a mate?”</i>", parse);
					Text.NL();
					Text.Add("<i>“I have instructed her to hide until it is certain there is no danger.", parse);
					Gui.PrintDefaultOptions();
				}, enabled : true
			});
			options.push({ nameStr : "Thoughtful",
				tooltip : "Maybe you can make use of this situation and turn it to your advantage.",
				func : function() {
					Text.Clear();
					Text.Add("They’re gryphons like you are, even if they’re from another tribe - at the very least, they’re not bloodthirsty wyverns out for pillage and territory. While the need for caution doesn’t escape you, there still can be some way you can turn this chance happenstance to your advantage; at the very least, some news of the remaining tribes and their fight against the wyverns would be welcome. Life is idyllic here in the valley, and it would be good to have a reminder of why you’re here in the first place.", parse);
					Text.NL();
					Text.Add("With that thought in mind, you plant the base of your spear firmly in the ground, test its shaft in your hand, and wait for the newcomers’ arrival. Their scent heralds their coming; you don’t have to look at their deep blue fur and feathers to realize they’re a mated pair from the northern tribes, and you dredge the depths of your mind, doing your best to recall what you’d been taught of them. They land on the ledge, a safe distance from you, and eye you warily even though you’re holding out a hand, empty palm outstretched.", parse);
					Text.NL();
					Text.Add("You don’t blame them. Were you faced with yourself - and while unarmed to boot, like they are - you’d be wary, too. Maybe a little reassurance is in order.", parse);
					Text.NL();
					Text.Add("<i>“I greet you, one of the northern tribes.”</i> The formal words feel oddly stiff on your tongue, but you’ve had whole moons of speaking to no one but Aurora; it’s a small wonder that they came as easily as they did. <i>“Do you come peacefully? Will you cry friend?”</i>", parse);
					Text.NL();
					Text.Add("<i>“I return your greeting, one of the plains,”</i> the male replies, instinctively stepping forward to place himself between his mate and your spear, showing you out his empty hand in return. <i>“I shall cry friend.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Then you are welcome on my territory, at my providence. Cause no trouble.”</i> All right, now that the formalities are over, it’s time to see what they’re willing to tell you. Nevertheless, it’s clear from how the pair’s looking around that they’re aware of Aurora’s existence - and yes, if you’d been in their position, you might have suspected a trap, too… <i>“I sent my mate away to hiding; I did not wish to unnecessarily expose her to danger in her current condition. You are not in danger.”</i>", parse);
					Text.NL();
					Text.Add("<i>“I understand. I would do the same for mine, were she heavy with young, too. Although then we might not have fled this far.”</i>", parse);
					Text.NL();
					Text.Add("Hm. Interesting. <i>“You were fleeing?”</i>", parse);
					Text.NL();
					Text.Add("<i>“Yes.”</i> It’s the female’s turn to pipe up. <i>“We have traveled far and scented another mated pair on the wind, and thought it - well, we have not seen another gryphon for a while.”</i>", parse);
					Text.NL();
					Text.Add("You shake your head. Oh, you know how that feels well enough, but fleeing? That bears further questioning. <i>“", parse);
					Gui.PrintDefaultOptions();
				}, enabled : true
			});
			
			Gui.Callstack.push(function() {
				Text.Add(" Now, what is your business here? There are not many of our kind at the edge of the world.”</i>", parse);
				Text.NL();
				Text.Add("<i>“No, but there will be more in the days to come,”</i> the male replies wearily. <i>“The wyverns grow greedier by the day, as does their queen. With the plains tribes scattered, they have come after us in search of plunder.”</i>", parse);
				Text.NL();
				Text.Add("You snort. <i>“So, they still do not grow, do not build, and do not create.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Why, when it is so much easier to take from those who must do so in order to live?”</i>", parse);
				Text.NL();
				Text.Add("<i>“If the tribes could have worked together, they might have had a chance - but such is wishful thinking. It has been tried and failed, the divisions simply run too deep.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Are we, then, to be scattered to the winds like a handful of feathers?”</i>", parse);
				Text.NL();
				Text.Add("You shake your head and click your beak. <i>“I will not have talk of such. My mate and I, we have a plan - one that will take many years, but it is still a plan. For now, this is the edge of the world; both of you will be safe here a while as I have been. This valley may be my territory, but there is much unclaimed land to be had. Find somewhere else nearby.”</i>", parse);
				Text.NL();
				Text.Add("<i>“We will. Thank you.”</i>", parse);
				Text.NL();
				Text.Add("You dismiss them with an easy, almost contemptuous wave of your hand and watch the pair take off, steadily receding into the distance. It’s only when they’ve gone that Aurora clambers back into your view, brushing a few leaves out of her fur.", parse);
				Text.NL();
				Text.Add("<i>“Those were others,”</i> she states flatly.", parse);
				Text.NL();
				Text.Add("<i>“Yes,”</i> you reply. <i>“I think we’ll be seeing more in the future as the tribes are broken. Slowly, perhaps, and one at a time, but they will be. They won’t - can’t - unite, and alone, they’re no match for the wyvern hordes.”</i>", parse);
				Text.NL();
				Text.Add("Aurora looks at you blankly, and you remember that she’s lived in this valley for the entirety of her existence, that she knows absolutely nothing about the outside world - it’s odd, some days you can just forget these things about her.", parse);
				Text.NL();
				Text.Add("You’d known this day would come eventually. She might not have been interested in the world beyond her valley, but it’s interested in her - and you, of course.", parse);
				Text.NL();
				Text.Add("<i>“Don’t worry about it,”</i> you rumble, pulling her close with a strong arm and patting her reassuringly. <i>“It won’t help matters. I’ll handle it when need be.”</i>", parse);
				Text.NL();
				Text.Add("Or die trying. This is the edge of the world, after all; there’s nowhere left to run.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					GryphonsScenes.Outro(Gender.male);
				});
			});
			
			Gui.SetButtonsFromList(options, false, null);
		})
		
		Gui.SetButtonsFromList(options, false, null);
	});
}

GryphonsScenes.NewLife = function() {
	let player = GAME().player;
	var parse = {
		
	};
	
	var preg = 0;
	
	Text.Clear();
	Text.Add("You are so <i>heavy</i>.", parse);
	Text.NL();
	Text.Add("You can’t get away from it anymore; the enormous, elongated dome of your belly constantly threatens to enter your field of view - if it’s not already there in the first place. Low and heavy, its weight is always on your mind, and even when you close your eyes and lie down on your side - something which you seem to be doing more and more of these days - the never-ending shifting and squirming of your unborn gryphlets keeps you awake. Several moons ago, you would’ve laughed at the thought of you like this; now, you’re not finding it that funny anymore.", parse);
	Text.NL();
	Text.Add("So swollen are you that you can’t even fly properly; the most you can manage is an awkward glide, constantly having to adjust for your life-laden midriff. As a result, you spend most of the days on the cliffside, doing what work you can while you wait for him to return.", parse);
	Text.NL();
	Text.Add("And there is much work to be done. Despite your condition, the rest of your body is still perfectly functional, your muscles lean and trim; besides, lying down all day isn’t going to suit you. The things you have learned from him are many, and yet each day he still manages to surprise you with something new, something that the creature that you were could have never even begun to consider on her own.", parse);
	Text.NL();
	Text.Add("A short, sharp kick from within your heavily swollen womb knocks the breath out of you, and you set down the knife blade that you’d been sharpening before rubbing the stretched, taut skin of your baby bump in a bid to calm the gryphlets within. He’s told you that where he came from, there would be other females who would take care of those who were about to bear gryphlets, help them through the process, but you have not the privilege of such. Not when your own mother has left.", parse);
	Text.NL();
	Text.Add("It’s not going to be long now, you’re sure of that. You can’t help but wonder how holding and caring for a tiny version of you is going to work out.", parse);
	Text.Flush();
	
	//[Fulfilled][Calm][Frustrated]
	var options = new Array();
	options.push({ nameStr : "Fulfilled",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("Cooing and chirping, you pat the prodigious swell of your pregnancy, and feel the gryphlets within respond to your touch through fur and flesh. Perhaps you should be worried, but you just feel so full, so <i>right</i>. The sense of warm bliss that spreads out from your belly and suffuses the entirety of your being leaves no doubt in your mind that this is your destiny, what you were made for. Good thing, then, that you love it so much; even after the gryphlets have been born, you can’t wait to go through it all over again. Sure, it’s not all good, but it’s so worth it.", parse);
			Text.NL();
			Text.Add("Besides, you’re not alone in this. He’s there to guide you, like he always has been.", parse);
			Text.NL();
			Text.Add("And of course, the very act which started it all… each time you think back to that night by your pool, you can’t help but fantasize about him, the way he took you by the water’s edge. The sensations of being plowed and bred like that for the first time…", parse);
			Text.NL();
			Text.Add("It’s a little while before you realize that your tongue is hanging out of your beak and your fingers wet with your own juices, and you quickly move to clean yourself up. If he catches you like this, he’ll tease you about it to no end… although maybe it isn’t so bad, considering what the teasing almost always ends up in.", parse);
			
			player.slut.IncreaseStat(75, 1);
			preg = 2;
			
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Calm",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("Sighing, you lean back and close your eyes, wings fluttering a little as you settle down on your side. You’re not lazing around, you’re just… just taking a much needed rest. While being so swollen has had its downsides - you do miss soaring through the skies - it hasn’t been all too bad, either. He’s taken good care of you, you’ve to admit as much; and besides, lying down like this on your side, hands just holding your swollen midriff, you feel at peace.", parse);
			Text.NL();
			Text.Add("So at peace, in fact, that when you finally wake up, the sun is much higher in the sky and beats down upon you mercilessly. Oh no… what if he caught you like this? Him teasing you is one thing, but him being disappointed is another, and that’s much worse than the first… your mind reels for a bit until you finally get hold of your mood and thoughts. It’ll be fine. You just have to… just have to…", parse);
			
			preg = 1;
			
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Frustrated",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("Well, at least it’ll be easier to deal with than the condition you’re stuck in right now. Swollen, heavy, unable to fly, always hungry - and while those are the least of your problems, it doesn’t help that they’re practically always there, nudging at the edges of your thoughts. To make it all worse, you’ve been feeling utterly sullen for no good reason at all - he just smacks you on the tush and teases your impotent broodiness, and that just makes it… urgh! You want him, and yet you don’t want him.", parse);
			Text.NL();
			Text.Add("Sighing, you reach for your massively milk-swollen breasts and try to knead a little of the tenderness out of them. Unfortunately, all you manage to knead out is a little milk from your engorged nipples, which doesn’t help matters at all.", parse);
			Text.NL();
			Text.Add("Ooh… maybe you’ll grow into this, maybe you won’t. In the meantime, though, you need to put aside your frustrations so that you can get this job done. A monumental task - the heavier with gryphlets you become, the wilder your mood swings are - but after a few deep breaths, you think that you might just be able to keep your head on straight until he comes back. It’s always easier to think when he’s around - you don’t understand why, but it just <i>is</i>.", parse);
			
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("Your thoughts back in order, you’re about to reach for the blade and sharpening stone once more when a sharp jab of pain lances through your lower belly, one unlike anything you’ve ever experienced before. Gasping, you squeeze your eyes shut and begin to pant heavily, cursing the day he made you like this. Maybe you should just endure his teasing and lie down for the rest of the day…", parse);
		Text.NL();
		Text.Add("Alas, your body doesn’t seem to want to go along with your plans - there it is again, strong enough to knock the wind out of you, followed shortly by an outpouring of fluid that soaks your fur and runs down your thighs. Clutching your gravid womb, you let out an involuntary whimper and mewl as the aftershocks fade, leaving you utterly drained.", parse);
		Text.NL();
		Text.Add("Where is he? Where is he? It must be beginning - it’s as he said - and yet he’s not here! Fine. You’ll just have to handle this by yourself. Painful as it is, it won’t kill you. He’s told you about how his mother and aunts did it - it still feels strange to imagine so many others of your kind - but this is something only you can do. As soon as you’ve regained enough sense to move, you make for the safety of the cave - you’re barely able to get into the shade before the birthing starts in earnest.", parse);
		Text.NL();
		Text.Add("What happens next is the greatest effort of your life.", parse);
		Text.NL();
		Text.Add("You’re not entirely sure how long you spend flat against the wall, huffing and groaning, squirming and shifting as the weight in your swollen belly descends lower and lower. What you do know, in those brief moments between the pains and contractions, is that the sun’s moved steadily across the sky.", parse);
		Text.NL();
		Text.Add("Crying and panting, a grunt of effort accompanying each contraction, the large, round dome of your belly visibly squeezing down as you feel parts you didn’t know you had stretch and dilate to admit new life into the world - although the pain gets better, the exhaustion only worsens. He’s told you to keep upright for as long as you can, to let the weight of the gryphlets help with the birth, that lying down will only make it harder - but knowing this is one thing, and actually doing it is another.", parse);
		Text.NL();
		Text.Add("At last, though, it’s finally over: with an outpouring of clear, sticky fluid, one weight passes from between your legs, followed swiftly by another. Panting and utterly drained, yet gloriously relieved, you gather up the tiny infants - one in each arm - and examine them. Truly, they are versions of you and him wrought in miniature - tiny beaks and wings, a soft, thin coat of fur and feathers still wet with fluid. They’re so small and soft and warm; you pull them close, pressing them against your now-smaller belly, and can’t help but feel a surge of pride at what you’ve accomplished today.", parse);
		Text.NL();
		Text.Add("Now this’ll be a surprise for him to come back to.", parse);
		Text.NL();
		Text.Add("What do you do now, though? Just as you’re considering that question, you hear a flutter of wings from outside, and pause. Has he returned? You still need to rest awhile, clean up the mess you’ve made, and -", parse);
		Text.NL();
		Text.Add("- No, the scent is all wrong. Though you can’t see whatever this thing is yet, you can perceive its shadow, and it’s not his. Too sharp, too many edges. The scent - it’s not a comforting one of fur and feathers, but smooth and dry, like that of sand…", parse);
		Text.NL();
		Text.Add("You can hear it, whatever this thing is, rummaging about outside on the shelf, methodically searching through his tools, your things. It’s no simple beast, then, but a creature possessed of some measure of thought and intelligence. If you can smell it, then it no doubt can do the same for you and the newborns; why isn’t it going after you yet? Caution, or does it know that you’re trapped in here, with no other exit?", parse);
		Text.NL();
		Text.Add("A cold hand grips your heart, and then it’s swiftly replaced with burning rage. No. It’s not going to harm you. It’s not going to harm your <i>children</i>. He’s not home at the moment, which means <i>you</i> are next in line.", parse);
		Text.NL();
		Text.Add("The creature outside is as alien as it is repulsive to your instincts: rummaging as it is through his workbench and tools, you can only see its back, but it’s more than enough for you to quickly size up what you’re dealing with. Rough, leathery hide, wings that stretch from its forearms to its torso, horns that curve backwards from its head. Its legs are bent, its feet clawed, and it moves with an unnatural, loping gait that would have been comical - if it was not obviously a predator.", parse);
		Text.NL();
		Text.Add("But you are, too. Weak from birthing and body still twinging with afterpains, you’re still a predator.", parse);
		Text.NL();
		Text.Add("Can it not sense you, or does it just not care? Either way, the end result is the same. The stone blade you were sharpening earlier today is still on the ground where you left it; the creature’s back is turned to you. What comes next couldn’t have been any other way: one movement to take the blade in hand, another to bring it down at the creature’s back, right between its shoulder blades. It notices you at the last moment, half-turns such that your blow misses its spine and instead turns on the creature’s leathery hide, sinking deep into flesh and sending a spurt of reddish-black blood into the air.", parse);
		Text.NL();
		Text.Add("It screams and whips around, its ridged tail lashing out, sweeping across the ground in an attempt to catch on your feet. You sidestep the blow and meet the face of your enemy - black, beady eyes set above elongated jaws and protruding teeth. Completely ignoring the knife blade sticking out of its back, the creature rounds on you even as you seek to open the distance, to give you more space to maneuver. Jabbering in a language - it has to be a language - you don’t understand, it readies long claws tied to hide straps on its wrists, claws carved from bone, sharpened to cruel points and fitted over its thick fingers.", parse);
		Text.NL();
		Text.Add("No, you did the right thing in doing this. If you’d merely waited inside, it’d just have entered the cave and killed you and the gryphlets when it was done outside. At least out here you have some space… and weapons, should the situation call for it. Now, though, the two of you watch each other, waiting for the other to make the first move.", parse);
		Text.NL();
		Text.Add("Which it does, feinting left first, then following up by raking its right claws through the spot where you’d been moments ago, catching little but a handful of fur and feathers. Folding your wings against your body, you duck in and deliver a savage blow to its belly. Shrieking in outrage, the creature recovers with startling speed and falls upon you before you can react, pressing you down onto your knees with its weight. You’ve got to resist, but… don’t seem to have the… strength…", parse);
		Text.NL();
		Text.Add("You realize your mistake too late: you’d been fighting this thing like you would an animal when out hunting. However, it’s no animal.", parse);
		Text.NL();
		Text.Add("It screams and jabbers some more in its own language, then to your horror, speaks words you recognize: <i>“Stupid female. Eat you, eat your babies, then bring your feathers and bones back as trophies.”</i>", parse);
		Text.NL();
		Text.Add("Never! With a desperate surge of strength, you shove it hard enough for it to lose its grip on you, then claw at its face, drawing blood. Enraged and bleeding, the creature hisses and raises its gleaming talons to deal a killing blow. You raise your arms to shield yourself, see a shadow fall over you, shudder as warmth and wetness blossoms just above your heart -", parse);
		Text.NL();
		Text.Add("<i>“Aurora.”</i>", parse);
		Text.NL();
		Text.Add("Whimpering, you open your eyes and find that the blood on your breast isn’t yours - instead, it drips off the tip of his spear, which has found its way into the horrid creature’s back and out its front, neatly spearing its heart in the process. Your gaze follows the shaft of the bloodied spear all the way up to his face, and behold the sheer intensity of the pure hatred set in his face and lingering in his eyes - instinctively, you cry out and shrink back before realizing that his anger isn’t directed at you.", parse);
		Text.NL();
		Text.Add("<i>“Get up, Aurora.”</i> His voice is strong, even and comforting, completely contrasting his expression. <i>“It’s dead. It can’t hurt you any more.”</i>", parse);
		Text.NL();
		Text.Add("Finally managing to summon what strength you have left, you scooting backwards and away from the gruesome sight. You watch as he expertly flicks the shaft of his spear, sending the creature’s body slumping to the ground before kicking it aside like a hunk of cooling meat.", parse);
		Text.NL();
		Text.Add("It’s… it’s finally over.", parse);
		Text.NL();
		Text.Add("You stare up at him; in the blink of an eye, his anger has turned to a grim and impassive mood. <i>“So soon,”</i> he mutters. <i>“Why did it have to be so soon? Not even a single turning of the seasons… ”</i> At last, he heaves a sigh, and turns his attention to you, then to the darkness of the sleeping cave where the smells and scents of birthing still linger.", parse);
		Text.NL();
		Text.Add("<i>“What a mess,”</i> he grunts. Without hesitation, he sets down his spear and scoops you up over his shoulder like a fresh kill; you don’t mind the gesture one bit as he carries you into the shade. It’s nice to be able to let go and allow him to take control of matters from here on out. <i>“I’ll get this all cleared away. Just sleep, and let me do the thinking.”</i>", parse);
		Text.NL();
		Text.Add("With that, he dumps you on the sleeping shelf; you’re too exhausted to protest the rough treatment even if you wanted to, and the last thing you’re aware of before you doze off is him placing the newborn gryphlets by your side to snuggle against your warm body and soft fur.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("The two of you spend the rest of the day gathering fragrant windflowers. To mask the scent of its blood when he gets around to burning the creature’s corpse, he explains. You help out where you can, insisting that being out in the air and sun will help you recover far better than being cooped up in the darkness. Besides, now that he’s back, you don’t want to be away from his side for a little while.", parse);
			Text.NL();
			Text.Add("Well, to be honest, he does most of the work. The gryphlets want constant care and the occasional feeding, and he leaves you to your own devices for the most part - you suspect he gets considerable amusement out of seeing you struggle with learning how to care the tiny lives in your arms. Sure, he could tell you, but you already know what he’d say if you asked: “where’d be the fun in that, and how would you learn?”</i>", parse);
			Text.NL();
			Text.Add("So it is as it is. The creature that appeared, he explains to you as he gathers stems and petals, was a wyvern. The things which he came here to avoid - that was but one, and a scout at that. Sooner or later, more will follow on its tail, seeking it, which is why he labors at gathering windflowers, to bury the carcass, and with it, the scent.", parse);
			Text.NL();
			Text.Add("Better later than sooner, after all. It means more time to prepare, which might make all the difference.", parse);
			Text.NL();
			Text.Add("Since he cannot be around all the time, he will teach you to kill them. His mother and aunts all could, and so will you - but only as a last resort. He will protect you, but you in turn must be ready to protect the gryphlets. That is the way of things. That is the way of nature, and also the way of the tribes.", parse);
			Text.NL();
			Text.Add("You think back to the brutal struggle just earlier today, and shiver both with fear and anticipation. Up till today, you’ve never killed anything you didn’t intend to eat. This is a new feeling.", parse);
			Text.NL();
			Text.Add("One of the gryphlets snuffles and nips at one of your breasts with her tiny beak; you sigh in satisfaction, cuddle the little one close, and allow her to drink her fill. Earlier on, you’d asked him if he wanted to name the gryphlets, but he declined. Unfortunate things happened to the very young, he explained. Disease. Weakness. Accidents. There were many things that could happen despite the best of efforts, and it was bad luck to bestow a name upon a new life while it was too young.", parse);
			Text.NL();
			Text.Add("You wonder how he can be so cold and unfeeling, then remember that he’s seen far more of the world beyond the valley walls. How many… no!", parse);
			Text.NL();
			Text.Add("Your gryphlets squirm and shift in your arms, and you press them close to you, savoring the warmth of their tiny bodies. There, that feels so much better.", parse);
			Text.NL();
			Text.Add("<i>“I’m done,”</i> he announces. Indeed he is, a large bushel of freshly picked windflowers in his hands, all reds and oranges and yellows as the broad petals wave in the breeze. Carefully, he sets them down and picks up his flat-bladed shovel. <i>“No time to rest. We need a hole, and a fire. Aurora, please prepare the materials while I dig.”</i>", parse);
			Text.NL();
			Text.Add("But he looks so tired. Won’t he just rest for a moment? The sun is beginning to set, but all of you are safe here. There’ll be time enough to-", parse);
			Text.NL();
			Text.Add("<i>“There’ll be time enough for me to rest when I’m dead. Now get out the tinder.”</i> There’s that face to him when he uses that tone of voice with you, and your body moves to obey unthinkingly almost of its own accord; you set down the gryphlets, make sure they’re comfortable nestled on the grass, then move to fetch the dried moss and bark shavings. Even so, you can’t help but eye him as he digs, piling up shovelful of shovelful of dirt by his side, lean, hard muscles flexing and moving with considerable vigor…", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("<i>“Aurora. Pay attention.”</i>", parse);
				Text.NL();
				Text.Add("You look up, and are met with a resounding slap to your face that brings tears to your eyes. He’s pulled the blow, but it still stings terribly, and your breast is filled with equal parts anger and fear. His face is cold and straight, and somehow, that is immensely more terrifying than if he were plainly angry.", parse);
				Text.NL();
				Text.Add("<i>“Let me make this clear, Aurora. That thing which came today was a wyvern. It was a scout; there will be others of its kind wondering where it’d gotten to, and start searching for it. There will be more of them than we can fight off. They will come.</i>", parse);
				Text.NL();
				Text.Add("<i>“We must burn the body, then mask the scent and bury the smoke. You don’t seem to have grasped the seriousness of the situation. Everything that you have ever known is at stake here, and I don’t know if we have any time, or if it’s already too late. Today may have been quite a day for you, and I understand that your life has hardly prepared you for such, but show some sense of urgency instead of fantasizing about me here and now!</i>", parse);
				Text.NL();
				Text.Add("<i>“Now, I’m almost done with the pit. Prepare the tinder while I do so, and if you can get a fire going, that would be appreciated.”</i>", parse);
				Text.NL();
				Text.Add("You hang your head in shame, and don’t look up until you’re sure he’s turned back to his digging. Rubbing your face a few times to soothe the worst of the stinging, you settle back and do your best to follow his instructions. The fire, though, you have trouble with - you <i>know</i> what needs to be done, it’s just that your body doesn’t seem to want to obey. There’ll be the slightest whiff of smoke, or flashes from the sparks you struck from flint, and then you find your body instinctively recoiling despite you knowing better…", parse);
				Text.NL();
				Text.Add("<i>“Let me.”</i> His voice enters your world again, and then he is kneeling next to you, one wing draped about your form, gently nudging you closer to him. A few strikes of the flint, followed by a little blowing, and he’s got a small fire going - and your cheeks are burning with shame. You <i>will</i> learn to do this thing as flawlessly and easily as he does. Slowly, you watch as he transfers the flames into the pyre that he’s built in the dug hole, then together you wait for the flames to grow, their light replacing that of the setting sun.", parse);
				Text.NL();
				Text.Add("<i>“All right, then,”</i> he says when the flames have grown strong enough. <i>“Take the windflowers, Aurora. Scatter them over the fire while I throw this beast in.”</i>", parse);
				Text.NL();
				Text.Add("You obey, and soon a fragrant aroma rises with the cinders and smoke, rising up and away into the night sky to scatter into the winds. The moment the wyvern’s body meets the roaring flames, though, you’re quickly thankful for the windflowers: the stench that the creature’s body makes as it burns is horrible. Oily blood sputters and hisses as the flames devour leathery hide and tough sinew, and you step back from the foul smell, still casting handfuls of petals into the pit. He stands on the other side, his arms crossed across his chest, his expression blank as he watches the carcass burn.", parse);
				Text.NL();
				Text.Add("He is hiding his feelings, you realize, or perhaps he truly does not have any at the moment, for he has blotted them out.", parse);
				Text.NL();
				Text.Add("At last, all the windflowers are spent, and he gives you a quick, businesslike nod. Without further ado, he picks up the shovel once more and begins filling in the hole, trapping the smoke beneath soft clods of freshly turned dirt. You sit down beside the gryphlets and watch him awhile, barely daring to breathe as he works like someone possessed under the wan, silvery light of the risen moon.", parse);
				Text.NL();
				Text.Add("<i>“Go and get some rest, Aurora,”</i> he says at last. <i>“Tomorrow will be the start of another day.”</i>", parse);
				Text.NL();
				Text.Add("But what about him?", parse);
				Text.NL();
				Text.Add("<i>“As I said, there’ll be time enough to sleep when I’m dead.”</i>", parse);
				Text.NL();
				Text.Add("Does he <i>have</i> to be so grim?", parse);
				Text.NL();
				Text.Add("<i>“Do you think I’m grim?”</i>", parse);
				Text.NL();
				Text.Add("To be honest, you don’t know what you’re thinking at the moment. Each and every part of you is pulling in a different direction at the moment - one part of you just wants to curl up on the spot and sleep, the other is seething with anger and frustration, another is upset with him and yourself that he has to slap you, another wants to be fucked thoroughly to get all that tightness out of your mind and body, and yet one more is amazed at the fact that you made it through this day and now have two little gryphlets by your side -", parse);
				Text.NL();
				Text.Add("You don’t know if he’s grim or not, but whatever he does, you’d like to follow.", parse);
				Text.NL();
				Text.Add("He looks at you with his head tilted for a moment or so, then nods. <i>“Suit yourself, Aurora.”</i>", parse);
				Text.NL();
				Text.Add("Personally, you imagine he looks glad to have your company, but he’d never admit as much. For a long while, the two of you stare down at the steaming, baking earth, the gentle fragrance of windflowers hiding the fact that anything’s buried under the earth here. All you need to do tomorrow is move some grass over the freshly turned dirt, and hopefully that’ll be the end of things.", parse);
				Text.NL();
				Text.Add("So many things to think about and consider, so much that the days when you lived simply from day to day without a care in the world seem so distant. You’ve never really thought about it, but now, sitting on the ground at his side, it hits you: that night by the pool, one world ended and another began.", parse);
				Text.NL();
				Text.Add("Is that how these things work?", parse);
				Text.NL();
				Text.Add("His face is inscrutable, his movements calm and measured. You wonder if he feels otherwise…", parse);
				Text.Flush();
				
				//[Comfort][Hug][Watch]
				var options = new Array();
				options.push({ nameStr : "Comfort",
					tooltip : "Comfort him in the way you know he likes most.",
					func : function() {
						Text.Clear();
						Text.Add("You turn to take one last look at the gryphlets - and let your worries rest once you see them sleeping by the remains of the fire, huddled together in a tight, warm bundle. They’re sleeping very well; now to help your mate do the same.", parse);
						Text.NL();
						Text.Add("A low purr forming in the back of your throat, you slink forward and embrace him, your hands wandering down his sides until they meet in front of his hard, muscular midriff, your beak nipping and grooming the feathers of his wings and shoulders. You chirp softly, urging, no, <i>begging</i> him to relax just a little. It’s over. He’s done all that he can. There are other things which need his attention…", parse);
						Text.NL();
						Text.Add("<i>“Aurora, you shouldn’t.”</i>", parse);
						Text.NL();
						Text.Add("You soundly ignore him and push your face more aggressively against his skin and feathers, rubbing your beak all over his skin, nipping away with its sharp tip. He gently makes to pry your fingers off him, but you hold firm, and he relents.", parse);
						Text.NL();
						Text.Add("<i>“It’s not good for you. You just had your gryphlets this morning.”</i>", parse);
						Text.NL();
						Text.Add("Oh? You press your head against his chest and listen to the deep bass thumping of his heart. Sure, his words may say one thing, and he may even mean them, but his heart is saying another.", parse);
						Text.NL();
						Text.Add("Hey, you’re getting better at this “sniff out lies” thing he does so easily. Besides, when did you say you wanted to mate? Maybe you just wanted to fool around a little? Really, he shouldn’t jump to conclusions so easily.", parse);
						Text.NL();
						Text.Add("<i>“Hrrmph. You just can’t wait, can you? Why, did you enjoy being stuffed full of life so badly that you can’t bear to be empty once more, can you? Don’t worry, all in due time - I’ll put plenty of gryphlets into you when you next go into heat, so don’t be hasty.”</i>", parse);
						Text.NL();
						Text.Add("Mmm… that certainly is a nice thought, but it’s not what you’re after. Cooing softly, you let your fingers wander of their own accord down to his sheath, idly tickling the sensitive folds of skin in a bid to get his delicious cock out in the air where it belongs. If you were going to be completely frank, you need this more than he does - what with all the death and burial and burning and birthing… it’s good to have someone to cling to when you’re falling.", parse);
						Text.NL();
						Text.Add("Ha-<i>ha</i>. Seems like it’s working just fine, all right - once enough of his cock is out for you to get a grip on, you quickly and easily stroke your fingers up and down its rapidly expanding length. Watching that delicious, thick-set member lengthen and engorge before your very eyes - no, getting to <i>feel</i> it do so, pushing apart your fingers with ease, staining your palm with his strong, masculine musk…", parse);
						Text.NL();
						Text.Add("You can’t help but take a sniff, and the scent of his growing arousal is enough to send shivers racing down your spine and your insides to squirming and tying themselves into knots. Greedily, you run your fingers along his glans, taking care to roll your fingertips back and forth along the sensitive ridge. He draws a sudden, sharp breath, and satisfaction blossoms in your heart.", parse);
						Text.NL();
						Text.Add("<i>“Again, Aurora, you’ve just had-”</i>", parse);
						Text.NL();
						Text.Add("No, you’re going to heed his sage advice and don’t intend to take him inside you. Even so, there are other ways in which the two of you can satisfy each other…", parse);
						Text.NL();
						Text.Add("You can see his eyes dart this way and that as he thinks, than at last he sighs, his depressed demeanor dissipating just a little. <i>“You know what? I’m thinking that maybe I’ve been worrying too much about the future to appreciate the time I’ve got with you right now. Just this once, alright?”</i>", parse);
						Text.NL();
						Text.Add("Just this once? Well, that’s a small victory for you, at the very least. You can’t help but feel all smug and satisfied as his strong hands reach for the top of your head and guide you into a kneeling position before his cock, a most suitable position for worshipping such a heavenly thing as it is. Naturally, you don’t let go, instead clinging onto it throughout the whole process - has it actually gotten <i>bigger</i> since the last time you looked? Your tongue hangs out of your beak for a moment as you fantasize about what it’dt be like to take that pulsing, throbbing life-rod into you again and be plowed utterly and thoroughly, but you made a promise…", parse);
						Text.NL();
						Text.Add("A powerful twitch of his cock against your fingers has your thoughts racing back to reality, and without further ado, you begin stroking him off in earnest, feeling the wonder of the huge, sheath-slick cock in every drop of pre and bulging vein you feel in your palms. The stickiness, the musk, the way it feels so rock-<i>hard</i> beneath your fingertips, the beating of his heart, the slow, rhythmic motions as he begins to thrust into your grasp, gaining in strength and quickness with each buck of his hips.", parse);
						Text.NL();
						Text.Add("In turn, you feel your arms respond in kind, tugging him towards you even as he pulls away. The firm grasp that you usually use to catch prey is now put to great use in pleasuring him; even though your hands and wrists are not utterly coated with a thin sheen of pre, you nevertheless hold unwaveringly onto his cock with one hand while you cup and fondle his massive balls with the other.", parse);
						Text.NL();
						Text.Add("<i>“No need to be so eager,”</i> he whispers with a certain nasty playfulness - no mean feat, considering what his body must be feeling. With a broad sweep of an arm, he reaches down to pat the top of your head, ever reminding that you’re his, and as such he’s responsible for you. <i>“Even if I bred you right here and now, it wouldn’t take - not until you go into heat again.”</i>", parse);
						Text.NL();
						Text.Add("Heat…half-idle, half-stupefied, you think back to all those lonely nights, all those sleepless evenings spent tossing and turning in your bed, rubbing your thighs together and feeling warmth roil within you, sloughing off you in waves. That night, you’d been at the pool to try and cool the heat by bathing, to quench the desire by drowning it… and while it was finally silenced, it didn’t happen quite the way you expect…", parse);
						Text.NL();
						Text.Add("With a powerful roar, he thrusts into your hands one last time, wriggling in your grasp as primal instincts seize his body in a desperate urge to knot whatever he’s fucking at the moment. In that split second, you <i>feel</i> his load as it rushes up the length of his big black cock, and then it’s all over you - onto your face, dripping from your beak, sliding down your neck and pooling in the feathers of your cleavage. He grunts and growls as he spends himself upon you, utterly draining his balls in response to the scent of his mate; the small geyser of gryphon sperm that continues to blast from his cock-tip is an unending, overflowing font that covers you in his seed and scent.", parse);
						Text.NL();
						Text.Add("You feel practically giddy with how much cum there is, and wonder if there’ll be just as much when it’s time for you to be bred. All that life-force rushing into you, invading your insides utterly before taking root within your fecund confines to grow into gryphlets…", parse);
						Text.NL();
						Text.Add("At last, the stream blasting from his manhood turns to spurts, and finally dribbles before coming to a stop. He looks utterly spent - and you’d be surprised if he weren’t, judging by the sheer size of the cum puddles on the grass. Turning his gaze from side to side, he surveys the devastation that he’s wrought on his surroundings, then looks down at you and snorts.", parse);
						Text.NL();
						Text.Add("<i>“My,”</i> he says. <i>“I guess I was pent-up after all.”</i>", parse);
						Text.NL();
						Text.Add("See, isn’t that so much better? Doesn’t he feel that much more comfortable?", parse);
						Text.NL();
						Text.Add("He makes a show of considering his answer, clicking his beak and tapping his chin as he eyes you. <i>“I suppose I do, yes.”</i>", parse);
						Text.NL();
						Text.Add("Then you were very glad to have been of service. Slowly, you stand up and give him a warm generous hug, spreading the cum on your body all over him and savoring the sensation of his thick black cock pressed against your lower belly. He sighs, returns your embrace, then ruffles your fur before bringing you down to the grass with him.", parse);
						Text.NL();
						Text.Add("<i>“Be sure to wash up tomorrow before handling the gryphlets.”</i>", parse);
						Text.NL();
						Text.Add("You nod enthusiastically, then snuggle into his warm arms, wanting as much of his steady breathing and the powerful beating of his heart as you can get. Who cares if there is danger to be had, if these horrible leathery-skinned, furless monsters wait beyond the mountains. Together, him and you, you will destroy those who would threaten the sanctity of your valley.", parse);
						Text.Flush();
						
						player.slut.IncreaseStat(100, 2);
						
						Gui.NextPrompt(function() {
							GryphonsScenes.Outro(Gender.female, preg);
						});
					}, enabled : true
				});
				options.push({ nameStr : "Hug",
					tooltip : "Give him a nice, long hug. Let him know you’re still around.",
					func : function() {
						Text.Clear();
						Text.Add("A soft chirp escapes your beak, followed by a gentle purr in the back of your throat as you step forward and wrap your arms around him in a hug from behind, closing your eyes to better appreciate the scents and sensations of being so close to him. Besides, you know he enjoys your sleek body, too, and want him to appreciate it as much as he wants.", parse);
						Text.NL();
						Text.Add("For a moment, he stands caught, neither accepting nor rejecting you, and then he, too, closes his eyes and let his spear fall, quickly easing your embrace apart and swinging you around to his front so <i>he</i> can hug you better. And hug you he does, just tight enough such that you feel all warm and protected, but also tight enough to let you know he could easily crush you if he so desired. Somehow, you find that thought… arousing, especially when you know that strength isn’t going to be directed at you.", parse);
						Text.NL();
						Text.Add("Now is not the time for that - all this is supposed to be is a simple hug, fur against fur, feathers against feathers, breath against breath. Bit by bit, you feel the tension in his muscles loosen, and chirp out loud, nuzzling your face all over the crook of his chin.", parse);
						Text.NL();
						Text.Add("You’re glad he’s here. For all that’s happened since he came, and all that will happen in the future, you’re glad he’s here.", parse);
						Text.NL();
						Text.Add("He doesn’t say anything by word of reply, but lets out a contented rumble. That’ll have to do, you guess. You reach up with your beak to nip and nibble at his chin, savoring his touch, and he in turn gives you a gentle pat on the head.", parse);
						Text.NL();
						Text.Add("While you wouldn’t have minded remaining like this for the rest of the night, he breaks the embrace at last, easing your arms from around him, sliding them across his well-built form as he pulls away from you. There’s much that remains unspoken, but even though he’s the one who’s taught you to speak properly, it’s odd that the longer you’ve been together, the more gets across without the need for words.", parse);
						Text.NL();
						Text.Add("Maybe one day you’ll even be able to read him as easily as he reads you.", parse);
						
						GryphonsScenes.NewLifeHugEnding();
					}, enabled : true
				});
				options.push({ nameStr : "Watch",
					tooltip : "If he doesn’t want to be touched, then you’ll respect that for now…  but you’re here.",
					func : function() {
						Text.Clear();
						Text.Add("Slowly, you shuffle closer to him, settling down on the lush, soft grass at his feet - not quite touching him but nevertheless entering his little circle of personal space, letting him <i>feel</i> your presence. Well, it’s the first time you’ve actually tried doing it on purpose, and it’s a different way from how he does it, but you think you’ve got it all figured out. Chirping softly, you gather the gryphlets into your lap, and the little ones make small, mewling noises as they snuggle into your fur, seeking warmth and comfort.", parse);
						Text.NL();
						Text.Add("Just sitting down like this, watching the last cinders of the fire go out and the fragrant smoke rise, it’s hard to believe you’re in the mortal danger that he says everyone’s in. It’s simply too <i>peaceful</i> for that, and your instincts simply shrug and tell you there’s nothing to worry about.", parse);
						Text.NL();
						Text.Add("Yet… you believe him, more than you believe your instincts. He has a way of seeing into the future, something which the back of your mind is not the best at. If he can see it, and you haven’t, then it’s as simple as that. He’s never deceived you.", parse);
						Text.NL();
						Text.Add("He’s leaning his weight on the shaft of his spear, you can see that. Maybe he should at least sit down, if he’s going to keep vigil.", parse);
						Text.NL();
						Text.Add("He looks down at you for a long time, then wordlessly does so, setting down his spear beside him and tucking in his feet to assume a cross-legged pose. After some thought, he reaches out and pulls you against him, letting out a gentle, contented rumble as your bodies meet. You’re content to leave it at that.", parse);
						Text.NL();
						Text.Add("<i>“I knew they would eventually come,”</i> he says slowly. <i>“They won’t rest until they’ve eaten everything. I should have been more careful after the northlanders brought us their tidings, but I thought we had more time.”</i>", parse);
						Text.NL();
						Text.Add("Worrying about it won’t help any. He’s done all he can.", parse);
						Text.NL();
						Text.Add("<i>“I’ve tried at every point, every place I could make a difference, but it’s so hard…”</i> ", parse);
						
						GryphonsScenes.NewLifeHugEnding();
					}, enabled : true
				});
				Gui.SetButtonsFromList(options, false, null);
			});
		});
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

GryphonsScenes.NewLifeHugEnding = function() {
	var parse = {
		
	};
	
	Text.NL();
	Text.Add("With a definite reluctance, he pulls away from you and sprawls out on the grass. <i>“It’s too late to get back home. We should be safe here; getting some sleep is probably a good idea. Today’s been a long day, and tomorrow will be even longer.”</i>", parse);
	Text.NL();
	Text.Add("Why? Does he expect more trouble?", parse);
	Text.NL();
	Text.Add("<i>“No, but today’s events have made it such that I need to move things along more quickly.”</i> Flapping his wings a few times, he yawns, then rolls over onto his back. <i>“You don’t need to concern yourself with that much. Focus on taking care of the gryphlets now - they’re your responsibility.”</i>", parse);
	Text.NL();
	Text.Add("Of course they are.", parse);
	Text.NL();
	Text.Add("<i>“Good. Now let’s sleep.”</i>", parse);
	Text.NL();
	Text.Add("The gryphlets have already dozed off; small, warm bodies tucked against each other in a heap, and once you’re sure they’re safe, you move to snuggle up to him. He doesn’t reject you, instead allowing you to press your head against him while he idly strokes the feathers on the back of your neck.", parse);
	Text.NL();
	Text.Add("Before you know it, you’ve drifted off into darkness, the last thing on your mind his hands in your fur and feathers.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		GryphonsScenes.Outro(Gender.female, 0);
	});
}

export { Gryphons, GryphonsScenes };
