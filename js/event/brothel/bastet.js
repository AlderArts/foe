import { Entity } from '../../entity';
import { Text } from '../../text';
import { Gui } from '../../gui';

let BastetScenes = {};

function Bastet(storage) {
	Entity.call(this);
	
	this.flags["State"] = Bastet.State.NotViewed;
	
	if(storage) this.FromStorage(storage);
}
Bastet.prototype = new Entity();
Bastet.prototype.constructor = Bastet;

Bastet.State = {
	NotViewed : 0,
	S1Birth : 1,
	S2Life : 2,
	S3Anubis : 3,
	S4Drought : 4,
	S5Trouble : 5
};

Bastet.prototype.Cost = function() {
	return 250;
}
Bastet.prototype.First = function() {
	return this.flags["State"] == Bastet.State.NotViewed;
}


Bastet.prototype.FromStorage = function(storage) {
	// Load flags
	this.LoadFlags(storage);
}

Bastet.prototype.ToStorage = function() {
	var storage = {};
	
	this.SaveFlags(storage);
	
	return storage;
}

BastetScenes.IntroEntryPoint = function() {
	var parse = {
		armor : player.ArmorDesc()
	};
	
	var choice = 0;
	
	var func = function(c) {
		return function() {
			choice = c;
			Text.Clear();
			Gui.PrintDefaultOptions();
		}
	};
	
	Gui.Callstack.push(function() {
		Text.Add("Without cause for delay, you begin removing your [armor], hanging it up out of the way on the hangers provided. Once you are totally naked, you move past the stool and enter the magical circle. Then you close your eyes, take a deep breath to steel yourself, and say, <i>'enter'</i> as instructed.", parse);
		Text.NL();
		
		BastetScenes.SceneSelect(choice);
	});
	
	Text.Clear();
	
	//TODO
	//[Birth][Life][Anubis][Drought][Trouble]
	var options = new Array();
	options.push({ nameStr : "Birth",
		tooltip : "“Enjoy life as the avatar of a cat Goddess.” Says the poster beside the door.",
		func : func(Bastet.State.S1Birth), enabled : true
	});
	
	if(bastet.First()) {
		Text.Add("As the door clicks shut behind you, you cast a brief observatory glance around the room you’re inside of. It’s fairly small - little more than a glorified closet, really - and simply done. The walls are covered in wallpaper printed with the images of rolling sand dunes underneath a clear sky. A few hangers are provided for putting things up on, but other than that, there’re only four things of note: A simple three-legged stool, a full-body mirror against the furthest wall, a small switch, and an ornate magic circle on the floor in front of the mirror, just waiting to be activated.", parse);
		Text.NL();
		Text.Add("As you examine the switch, you note what appears to be a selection of chapters within this theme room. You try to move the switch experimentally, but it seems to be locked in the first choice for now. Looks like you’re supposed to experience these in order...", parse);
		Text.NL();
		choice = Bastet.State.S1Birth;
		
		Gui.PrintDefaultOptions();
	}
	else {
		Text.Add("As the door shuts behind you, you take glance at the familiar desert-themed closet. Well, you know the drill. Choose a chapter, get naked and enter the fantasy.", parse);
		Text.Flush();
		Gui.SetButtonsFromList(options, false, null);
	}
}

BastetScenes.SceneSelect = function(choice) {
	
	Gui.Callstack.push(function() {
		if(bastet.flags["State"] < choice)
			bastet.flags["State"] = choice;
		Gui.PrintDefaultOptions();
	});
	
	switch(choice) {
		default:
		case Bastet.State.S1Birth: BastetScenes.Birth(); break;
		//TODO new scenes
	}
}

BastetScenes.TFBlock = function() {
	var parse = {};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Add("Stretching, you take a few moments to check yourself over, getting used to having your real body back.", parse);
	Text.NL();
	
	var TFapplied = false;
	
	var scenes = new EncounterTable();
	
	var incompleteCatTF = function() {
		if(!player.Ears().race.isRace(Race.Feline)) return true;
		if(player.HasTail() && !player.HasTail().race.isRace(Race.Feline)) return true;
		if(!player.Eyes().race.isRace(Race.Feline)) return true;
		if(!player.Tongue().race.isRace(Race.Feline)) return true;
		if(player.FirstCock() && !player.BiggestCock().race.isRace(Race.Feline)) return true;
		if(!player.Arms().race.isRace(Race.Feline)) return true;
		if(!player.Legs().race.isRace(Race.Feline)) return true;
		if(!player.Race().isRace(Race.Feline)) return true;
		if(!player.Face().race.isRace(Race.Feline)) return true;
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
			var breasts = player.AllBreastRows();
			for(var i = 0; i < breasts.length; i++) {
				breasts[i].size.IncreaseStat(40, 2);
			}
			return "Your [breasts] feel a bit heavier. It seems like your [breasts] have increased in size.";
		},
		odds: 2,
		cond: function() { return player.SmallestBreasts().Size() < 40; }
	});
	func({
		tf: function() {
			var breasts = player.AllBreastRows();
			for(var i = 0; i < breasts.length; i++) {
				breasts[i].nippleThickness.IncreaseStat(2, 0.5);
				breasts[i].nippleLength.IncreaseStat(2, 0.5);
			}
			return "Your [nips] feel tingly, and upon closer examination, you realize they have grown bigger.";
		},
		cond: function() { return player.SmallestNips().NipSize() < 4; }
	});
	func({
		tf: function() {
			var ret = player.Lactation();
			player.lactHandler.lactating = true;
			player.lactHandler.FillMilk(1);
			player.lactHandler.milkProduction.IncreaseStat(5, 1);
			player.lactHandler.lactationRate.IncreaseStat(10, 1);
			return ret ? "Your breasts feel fuller. Somehow you know you’re producing more milk now." : "Milk begins seeping from your [nips]. Seems like you’re lactating now.";
		},
		odds: 2
	});
	func({
		tf: function() {
			player.body.femininity.IncreaseStat(1, 0.1);
			return "Your reflection looks more… feminine than before.";
		},
		odds: 1,
		cond: function() { return player.body.femininity.Get() < 1; }
	});
	func({
		tf: function() {
			var ret = player.HasBalls();
			TF.SetBalls(player.Balls(), 2, 2);
			player.Balls().size.IncreaseStat(6, 1);
			player.Balls().cumProduction.IncreaseStat(3, 0.25);
			return ret ? "Your balls feel heavier somehow, and you just know it isn’t just more cum that you’re producing. Your balls have actually gotten bigger." : "You note the addition of a nutsack below your [cocks]. This wasn’t here before...";
		},
		odds: 3,
		cond: function() { return player.FirstCock(); }
	});
	func({
		tf: function() {
			player.body.cock.push(new Cock(Race.Feline));
			parse = Text.ParserPlural(parse, player.NumCocks() > 1);
			return "Looking between your legs, you notice that you seem to have acquired a feline pecker. Much like the one you had in the world beyond the mirror. Although it lacks a sheath, and isn’t nearly as big as the one you had as Bastet.";
		},
		odds: 1,
		cond: function() { return !player.FirstCock(); }
	});
	func({
		tf: function() {
			player.FirstVag().minStretch.IncreaseStat(Capacity.loose, 0.5);
			return "Your [vag] tingles for some reason. Spreading your nethers to examine yourself, you note that you feel much more stretchy than before. This should let you take bigger cocks than you could before.";
		},
		odds: 1,
		cond: function() { return player.FirstVag() && player.FirstVag().Tightness() < Capacity.loose; }
	});
	func({
		tf: function() {
			player.body.vagina.push(new Vagina());
			return "A tingling between your legs bothers you, and you move to scratch it. A gasp of pleasure escapes you as you unwittingly touch a pair of pussy lips between your legs. It seems that you have grown a new pussy.";
		},
		odds: 1,
		cond: function() { return !player.FirstVag(); }
	});
	func({
		tf: function() {
			if(!player.Ears().race.isRace(Race.Feline)) {
				var t = Text.Parse("You hadn’t realized before, but it seems your [ears] have have turned into triangular cat-ears. You twitch them experimentally and reach up to touch them. These are no illusion...", parse);
				player.Ears().race = Race.Feline;
				return t;
			}
			else if(player.HasTail() && !player.HasTail().race.isRace(Race.Feline)) {
				var t = "A strange sensation on your lower back makes itself known, and you reach back to check what is it. A gasp escapes your lips as you grasp the source of the discomfort, and feel a light tug. Looking back, it seems you have grown a cat tail.";
				var tail = player.HasTail();
				if(tail) {
					parse["tail"] = tail.Short();
					t = Text.Parse("Something feels different with your [tail]. Looking back, you realize that your [tail] has turned into a thin feline tail.", parse);
					tail.race = Race.Feline;
				}
				else {
					TF.SetAppendage(player.Back(), AppendageType.tail, Race.Feline, Color.black);
				}
				return t;
			}
			else if(!player.Eyes().race.isRace(Race.Feline)) {
				player.Eyes().race = Race.Feline;
				return "Your vision feels a little different, and looking closely at yourself in the mirror, you realize that your eyes have become slitted feline eyes.";
			}
			else if(!player.Tongue().race.isRace(Race.Feline)) {
				player.Tongue().race = Race.Feline;
				return "A tingle inside your mouth causes you some discomfort, and when you examine your tongue you realize that it has changed into a rough feline tongue.";
			}
			else if(player.FirstCock() && !player.BiggestCock().race.isRace(Race.Feline)) {
				var t = Text.Parse("Something feels different on your [cocks]. Examining [itThem], you realise[oneof] your [cocks] has changed into a feline pecker, complete with a barbed tip.", parse);
				player.BiggestCock().race = Race.Feline;
				return t;
			}
			else if(!player.Arms().race.isRace(Race.Feline)) {
				player.Arms().race = Race.Feline;
				return "You notice a strange feeling on the tips of your fingers, and upon close inspection, you realize that you have pads on your hands now. Flexing them, you gasp as a sharp feline claw emerges from the tips of your fingers.";
			}
			else if(!player.Legs().race.isRace(Race.Feline)) {
				var t = Text.Parse("You hadn’t even realized, but your [legs] have changed. It felt so natural to walk like this in the illusion that you hadn’t even paid attention to it. Sitting down on the stool you examine your new legs. They look like cat-legs, tipped with cat-paws for feet.", parse);
				if(player.HasLegs())
					t = Text.Parse("You shift your stance a little. Your [legs] feel different. Sitting on the stool, you take a closer look. Seems like your legs have changed into feline legs, capped with cat footpaws.", parse);
				player.Legs().race = Race.Feline;
				if(player.Legs().count < 2)
					player.Legs().count = 2;
				return t;
			}
			else if(!player.Race().isRace(Race.Feline)) {
				player.body.torso.race = Race.Feline;
				return "You were too worried to realize, but you’re now covered in short cat fur.";
			}
			else if(!player.Face().race.isRace(Race.Feline)) {
				player.Face().race = Race.Feline;
				return "You don’t know how you hadn’t realized before, but your face has changed to that of a cat. It seems that now you truly are a cat-morph. Complete with every bit and piece that begets the title.";
			}
		},
		odds: 3,
		cond: function() { return incompleteCatTF(); }
	});
	
	var text = [];
	_.times(_.random(0, 3), function() {
		text.push(scenes.Get());
	});
	
	if(TFapplied) {
		Text.Add("As you check yourself out, you realise that your body has changed! It must be some sort of side effect from the magic used in the mirror...", parse);
		_.each(text, function(t) {
			if(t) {
				Text.NL();
				Text.Add(t, parse);
			}
		});
	}
	else {
		Text.Add("Everything checks out, you were just a little disorientated.", parse);
	}
	Text.NL();
}

BastetScenes.Birth = function() {
	var parse = {
		
	};
	
	Text.Add("For a moment, you are overcome with a sense of vertigo, as if you were free-falling. Just as quickly as it happened, it passes, and you open your eyes. Before you lies the image of a cat-morph.", parse);
	if(player.RaceCompare(Race.Feline) >= 0.4)
		Text.Add(" Not a surprising development since you already were a cat-morph to begin with. But you do note a few differences here and there.", parse);
	Text.NL();
	Text.Add("You are a male cat-morph, with sandy-beige fur and brown short hair covering your head. Emerald slitted eyes look back at you through the reflection in the mirror. You’re fairly well-built, with muscles showing on your naked pecs, a trim belly, and strong-looking legs. Your padded hands end in claw-tipped fingers, flexing them will expose the claws, while relaxing will cause them to retract inside your finger. Your cat-like feet are the same. Behind you sways a thin cat-tail, it sways to and fro as you look at yourself with curiosity.", parse);
	Text.NL();
	Text.Add("Between your legs, you have a sheath, hiding a feline-pecker which you know is about eight inches long and two inches thick when fully erect. Inside your scrotum lies a pair of decently-sized nuts. Between your flat buttcheeks, you have a virgin anus, right where it belongs.", parse);
	Text.NL();
	Text.Add("Overall, you’d say you look pretty attractive, but let’s not linger. As instructed, you approach the mirror and watch as your reflection is replaced by the image of endless sandy dunes before you. Taking a deep breath, you steel yourself and step through.", parse);
	Text.NL();
	if(lucille.ThemeroomFirst()) {
		Text.Add("It’s a strange feeling stepping through the mirror. Like entering a pool, but without getting wet.", parse);
	}
	else {
		Text.Add("You’ll never get used to the feeling of stepping through the mirror...", parse);
	}
	lucille.flags["Theme"] |= Lucille.Themeroom.CatDynasty;
	Text.NL();
	Text.Add("You look back and see that the doorway has vanished; you’re left standing in the middle of the desert. At least you’re no longer naked, or not as naked as before anyway. Looking over yourself, you see that you’re clad in a simple loincloth with another piece of cloth over your head to protect you from the oppressive heat of the desert.", parse);
	Text.NL();
	Text.Add("The warm wind beats against you, carrying particles of sand that cling to your fur. You haven’t been here for more than a couple minutes, but you already feel parched. Thankfully, you have fur to protect your skin, but that does little against the heat of the sun. These mere moments you spent standing here are enough for sweat to begin permeating your skin. You have a feeling this will be quite tiring...", parse);
	Text.NL();
	Text.Add("Better get started then. You close your eyes and focus for a moment, recalling who you are in this world and what sort of role you’re supposed to play.", parse);
	Text.NL();
	Text.Add("You hail from a humble village, about three days south. It’s been a longstanding tradition in your village for the elders to send an envoy to the temple of most holy Lady Bastet. Lady Bastet is the Cat Goddess, protector of the people, and lady of love and joy. The envoy is meant to stay at the Lady’s temple, living a life of reverence and serving the Goddess of love - so that she may spread her love to all her faithful.", parse);
	Text.NL();
	Text.Add("Being chosen as the envoy is a great honor bestowed upon few. The covenant established between your village and the temple is that of a cat-morph, one of the people graced by the cat Goddess herself, would be sent whenever needed. Usually, this happens once every century, though the specific amount of time may vary.", parse);
	Text.NL();
	Text.Add("Pure cat-morphs are somewhat of a rarity in this world; though any union has a chance of resulting in a cat-morph, due to the Goddess’ blessing, not many are born. It’s more common to see unions result in human births or even cat-people. They have cat ears and cat tails, but are otherwise human. Closer to the Goddess, but still far in comparison to a cat-morph like yourself.", parse);
	Text.NL();
	Text.Add("Usually, the honor of serving the Goddess would be reserved for a female - but this century, you were the only living cat-morph in the village, so you were chosen despite being male.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("The blazing sun beats on you like a tyrant. You feel tired, sweaty and dusty. There’s so much sand clinging to your fur that you wouldn’t be surprised if you’d gained weight. Your footpaws ache with each strenuous step. By now, you’d have given up, were it not for the temple located a couple feet away. Honestly, you feel as if you’re about to pass out… but if you’re going to collapse, might as well as do it when you’re inside.", parse);
		Text.NL();
		Text.Add("The temple is nestled against the shore of a great oasis. Within minutes, you are passing under the welcoming shade of great date palms, striding upon a pathway of stone. Twin statues of the Goddess herself, a magnificently voluptuous female cat-morph, naked save for a shift about her loins, loom on either side of the front door.", parse);
		Text.NL();
		Text.Add("The size of the doors alone are enough to make you feel dwarfed, but you steel your courage and reach for the rings of gold that serve as its handles, using them to gently rap on the door.", parse);
		Text.NL();
		Text.Add("It takes a while, but soon enough, your ears twitch with the sound of the doors hinges scraping against each other as the grandiose door gives way to a cat-girl.", parse);
		Text.NL();
		Text.Add("As is expected of a priestess of Bastet, she is nearly-naked, with only a shift fastened around her flaring hips and plush, heart-shaped butt preserving her innocence. The rest of her attire, if one is generous enough to call it that, consists only of jewelry adorning her form. Bracelets adorn each arm, and anklets each leg. A great necklace of gold and lapis lazuli wreaths her neck, laying upon teardrop-shaped breasts only slightly smaller than her head.", parse);
		Text.NL();
		Text.Add("Her skin is pale as the moon, and even from where you stand, it looks soft as milk, offset by the luxuriant black hair that adorns her scalp, ears and tail. There is a world-wise maturity in her bearing, not diminished by the loving, yet slightly mischievous smile that curls her ruby-red lips. From her bearing, and the quality of her apparel, you know that it is no less a figure than the high priestess who stands before you.", parse);
		Text.NL();
		Text.Add("As soon as her eyes settle on your form, she smiles at you. <i>“Ah, one of Lady Bastet’s holy children. You look tired, please come in,”</i> she says, stepping aside and holding the door open for you.", parse);
		Text.NL();
		Text.Add("Obsequiously, you bow at the waist, thanking Her Ladyship for her generosity. Still lowered into your bow, you scurry through the door, not daring to straighten up until after it has been closed behind you.", parse);
		Text.NL();
		Text.Add("<i>“Please have a seat,”</i> she says, motioning at one of the many comfortable-looking cushions that dot the entrance hall. <i>“Rest while I fetch you some water, you must be parched.”</i>", parse);
		Text.NL();
		Text.Add("Humbly, you thank the high priestess for her kindness. The cushion feels wonderfully soft and plump, obviously stuffed with only the finest quality feathers. But in your state, even a mound of sand would feel good. The trek was truly an exhausting one.", parse);
		Text.NL();
		Text.Add("The sound of quiet footfalls is almost beneath your hearing, but your keen ears still catch the approaching footsteps of the high priestess. She presents you with a small amphora and you receive it with your most gracious thanks. As you smell the cool water sloshing within, you become aware of just how thirsty you are. But you are used to the desert and control yourself, taking slow mouthfuls of the life-giving fluid rather than guzzling it down as you crave to do.", parse);
		Text.NL();
		Text.Add("<i>“More?”</i> she offers.", parse);
		Text.NL();
		Text.Add("Holding the emptied amphora out to her, you thank her and reply that you would like some more, please.", parse);
		Text.NL();
		Text.Add("Smiling, she nods and takes a small jar. She pours water until your amphora is filled to the brim.", parse);
		Text.NL();
		Text.Add("With the same deliberation, you drain this amphora as well. Thirst well and truly quenched, you place it carefully aside and thank the high priestess for her kindness. The desert was long and hot, and your travels to reach this place were truly exhausting.", parse);
		Text.NL();
		Text.Add("The high priestess takes the amphora from your hand and gently lays it along with the jar, in a nearby table. <i>“Now that you’ve quenched your thirst, I believe introductions are in order. I am high priestess Adala, currently the highest authority in this temple.”</i>", parse);
		Text.NL();
		Text.Add("Bowing your head, you share with her your own name.", parse);
		Text.NL();
		Text.Add("<i>“It’s a pleasure to meet you,”</i> she says with a gentle smile. <i>“And what business would you have here, at the temple of Lady Bastet?”</i>", parse);
		Text.NL();
		Text.Add("The cool air of the temple flows deeply into your lungs as you steel yourself. Once steadied, you explain to her that you have been sent here from your village to fulfill your part the covenant that is owed to Lady Bastet herself.", parse);
		Text.NL();
		Text.Add("She nods in understanding. <i>“I see. So they decided to a send a male this time...”</i>", parse);
		Text.NL();
		Text.Add("With a nod of agreement, you explain that there were simply no eligible females available to send this time. So you were sent in their place. Apologetic, you ask if that will present a problem for the village.", parse);
		Text.NL();
		Text.Add("She shakes her head. <i>“No, of course not. Please forgive me. I was just surprised because according to the written records, it’s been many generations since your village has sent a male to fulfill this task.”</i>", parse);
		Text.NL();
		Text.Add("You do not bother to hide your surprise at the high priestess’ words; you were not aware that males had been sent to fulfill the covenant before. Still, relief quickly washes through you, pleased that you have not endangered your village by coming here. A smile breaks across your face and your tail swishes happily across the floor behind you.", parse);
		Text.NL();
		Text.Add("<i>“Please stand up for a minute, let me have a better look at you.”</i>", parse);
		Text.NL();
		Text.Add("Without hesitation, you do as you are told, standing up ramrod straight in your best imitation of the soldiers you once saw passing through your village.", parse);
		Text.NL();
		Text.Add("Adala looks you over, circling you to drink in your features. One of her soft hands gently reaches for your chest, feeling the powerful pectorals you’ve built over years of work in your family’s farm. <i>“I see that your village has chosen a fine specimen to send us.”</i> She grabs your arm, squeezing your biceps experimentally. <i>“A very fine specimen indeed,”</i> she adds with a smile.", parse);
		Text.NL();
		Text.Add("You shift from foot to foot, an embarrassed smile writing itself across your features. Meekly, you ask if she approves of you.", parse);
		Text.NL();
		Text.Add("<i>“I do. You take very good care of your body, and you look very cute too. Your fur, your hair, this toned belly... ”</i> she trails off gently rubbing your belly. A quiet purr rumbles up your throat at the touch. <i>“Your village couldn’t have picked a better envoy. I’m sure Lady Bastet is pleased.”</i>", parse);
		Text.NL();
		Text.Add("With a sheepish smile, you bow your head and reply that you wish only to please the Goddess, whatever that may entail.", parse);
		Text.NL();
		Text.Add("<i>“Very well. I’m sure you must be tired, but we mustn't delay. Let’s get you cleaned and prepared for your new life here at the temple. Please, follow me.”</i> She bows softly. <i>“Your Ladyship...”</i> she says, turning to lead you down the hall.", parse);
		Text.NL();
		Text.Add("...Ladyship?", parse);
		Text.Flush();
		
		//[Correct][Nevermind]
		var options = new Array();
		options.push({ nameStr : "Correct",
			tooltip : "You’re pretty sure you heard her refer to you as “Her Ladyship”. But you’re a man! Maybe you should correct her.",
			func : function() {
				Text.Clear();
				Text.Add("You try not to sound too affronted, lest you anger the high priestess, as you gently correct her. She referred to you as “Ladyship”, but you’re male.", parse);
				Text.NL();
				Text.Add("She stops in her tracks and turns to face you. For a moment, you visibly shrink. Maybe you shouldn’t have said anything...", parse);
				Text.NL();
				Text.Add("<i>“Forgive me, chosen one, but what do you know of your task as an envoy?”</i> she asks.", parse);
				Text.NL();
				Text.Add("Cringing, you explain you know nothing more than that you must come to the temple and that it is a great honor for you to be here.", parse);
				Text.NL();
				Text.Add("<i>“I see. So, you don’t actually know what is expected of you?”</i>", parse);
				Text.NL();
				Text.Add("With a hapless shrug of your shoulders, you confirm that’s correct.", parse);
				Text.NL();
				Text.Add("<i>“Very well, then allow me to explain while we head towards the bathing pool,”</i> she says, taking hold of your hand and gently leading you after her.", parse);
				Text.NL();
				Text.Add("<i>“The covenant we have with your village, is that they will send one of Lady Bastet’s holy children to the temple whenever necessary. The envoy will then give up on their previous life in the village and start a new life here, at the temple, as Lady Bastet’s new avatar,”</i> she explains.", parse);
				Text.NL();
				Text.Add("Brows furrow in confusion at Adala’s statement. Humbly, you ask if that’s really possible, since your physique is... very much the opposite of the Lady’s own.", parse);
				Text.NL();
				Text.Add("Adala laughs in amusement. <i>“Gender is unimportant. All that matters is that you’re a cat-morph. One of Lady Bastet’s holy children. Still, you are going to become the avatar of Lady Bastet. Everyone will take your words as our Goddess’ own, so you should become accustomed to having people refer to you with female honorifics, Your Ladyship.”</i>", parse);
				Text.NL();
				Text.Add("That... makes sense, you suppose. Though privately, you are still unconvinced as to how well that will work, you politely assure Adala that you will do your best to grow accustomed to it.", parse);
				Text.NL();
				Text.Add("<i>“That’s all I could ask for, Your Ladyship. Now please, follow me to the bathing pool,”</i> she says, tugging you along towards the end of the hallway.", parse);
				Text.Flush();
				
				Gui.NextPrompt(BastetScenes.Birth2);
			}, enabled : true
		});
		options.push({ nameStr : "Nevermind",
			tooltip : "Maybe you heard it wrong? Though you feel compelled to correct her, you’re not sure if someone as important as her would take it well if a mere peasant like you corrected her.",
			func : function() {
				Text.Clear();
				Text.Add("It’s probably for the best if you don’t say anything and simply follow her in silence.", parse);
				Text.NL();
				Text.Add("She leads you down a hallway, adorned with friezes of the Goddess Bastet, her gifts to mortals and her many pleasures and dalliances with the other gods, all beautifully detailed and colored.", parse);
				Text.NL();
				Text.Add("You look around in wonder, admiring the lavish decor as she leads you away. Gradually, you begin to notice a scent. The scent of greenery and water. When you look ahead, you realize that she’s taken you to a large bathing pool.", parse);
				Text.Flush();
				
				Gui.NextPrompt(BastetScenes.Birth2);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	});
}

BastetScenes.Birth2 = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("You stare in marvel at your surroundings; the hallway is given over to a huge pool of crystal clear water, something that was clearly a natural spring, once. Though stones have been sunk into the mud to create rudimentary steps and seats, its origins are still perfectly clear to you. Images of Bastet have been placed around, both statues and carvings upon the trunks of still-thriving trees, adding to the spring’s feeling of holiness.", parse);
	Text.NL();
	Text.Add("With the characteristic disdain of a priestess of the Goddess of love and beauty, Adala begins to remove her garb. Without the slightest concern for your presence, she unfastens her shift and lets it tumble to the tiled floor below, then bends over to begin unfastening her anklets. As she does, your eyes drink in the sight of her luscious rear as it is presented to you, shapely thighs exposing the rose pink cleft of her womanhood as she lifts her leg.", parse);
	Text.NL();
	Text.Add("At once, your traitorous manhood rises, thrusting boldly out of your sheath and piercing up over your loincloth. Your face burns with shame and you instinctively cup yourself; the priestesses of Bastet are not chaste, but this still feels perverse, a sacrilege against this sacred place.", parse);
	Text.NL();
	Text.Add("Her bracelets are next, and just like that, she’s completely naked. She collects her belongings with a smile on her face, diverting her eyes towards you and smiling once she sees you cupping your crotch. <i>“There’s no need to be ashamed, Your Ladyship,”</i> she says with a soft smile, taking her belongings to a table just inside the hallway.", parse);
	Text.NL();
	Text.Add("Your gaze lowers itself to the tiles, unable to raise itself to meet Adala’s own.", parse);
	Text.NL();
	Text.Add("<i>“It’s nothing I haven’t seen before, plus I’m flattered that you find me attractive, Your Ladyship,”</i> she says, sashaying towards you and gently hugging you from behind, pressing her soft mounds to your back.", parse);
	Text.NL();
	Text.Add("A shiver runs down your spine at the contact. A pang of lust throbs within you, your traitorous manhood now beginning to drool precum in anticipation.", parse);
	Text.NL();
	Text.Add("She removes the cloth from your head and discards it carelessly, throwing it over her shoulders. <i>“You won’t be needing that anymore, nor will you be needing this,”</i> she says, tugging on your loincloth from the side.", parse);
	Text.NL();
	Text.Add("Despite her words, your fingers still grip the loincloth fiercely, refusing to release it.", parse);
	Text.NL();
	Text.Add("<i>“Relax, Your Ladyship. Move your hands and let me help you undress, so that we can bathe together,”</i> she says, gently touching your hands from behind.", parse);
	Text.NL();
	Text.Add("A lump rises in your throat and threatens to choke you. Fiercely, you swallow it down as trembles ripple beneath your skin. Finally, ashamedly, you nod your head and slowly relax your grip.", parse);
	Text.NL();
	Text.Add("A few tugs are all that necessary before your loincloth is loosened, held aloft by your throbbing erection. Shame colors your cheeks, despite your fur. A gasp escapes you as you feel Adala’s hand gently encircle your shaft, sizing your cathood up. <i>“Hmm.”</i> She slides around you, circling you so she can gaze at your naked front. You mew softly when she cups your balls, testing them for weight.", parse);
	Text.NL();
	Text.Add("Tucking your chin into your chest to avoid meeting the priestess’s eyes, you shift restlessly from one foot to the other, tail curled protectively against your legs.", parse);
	Text.NL();
	Text.Add("Taking you by your chin, she gently guides you gaze back to her. <i>“You shouldn’t be ashamed, Your Ladyship. This is a very nice cock that you have,”</i> she says, gripping your shaft.", parse);
	Text.NL();
	Text.Add("A timid smile curls across your face, and your muscles soften as the tension begins to drain from you at her kind words.", parse);
	Text.NL();
	Text.Add("<i>“Come now, let’s bathe,”</i> she says, dragging you by your manhood down the steps and into the pool.", parse);
	Text.NL();
	Text.Add("She doesn’t stop until you at the very center of the pool, the waters rising well-over your waist. They are almost high enough to brush the underside of the priestess’s bountiful breasts, plenty of water in which to bathe. The cool is a welcome relief from the heat, but it does nothing to calm your raging erection.", parse);
	Text.NL();
	Text.Add("Adala releases your member and looks at you with a coy smile. She closes her eyes and holds her breath as she ducks under the water, emerging mere moments later, completely wet. Her alabaster skin glints in the sunlight as she tosses her hair back. <i>“Go ahead, the water will relieve you of your fatigue,”</i> she urges you.", parse);
	Text.NL();
	Text.Add("You accept her words with a nod and take a deep breath. Lungs full to bursting, you plunge yourself into the cool water, trying to lie upon the bottom of the spring. Your whole body is enveloped in wetness, permeating your fur, letting the heat of the desert bleed from your being into its welcoming depths. Only when your lungs start to protest do you explode back to the surface, gasping loudly for breath.", parse);
	Text.NL();
	Text.Add("<i>“Much better, don’t you agree, Your Ladyship?”</i> Adala asks.", parse);
	Text.NL();
	Text.Add("You chuckle as you nod.", parse);
	Text.NL();
	Text.Add("<i>“Come, let’s sit by the steps. I’ll help clean you up,”</i> she says, grabbing your toned butt and leading you away towards the steps.", parse);
	Text.NL();
	Text.Add("The water sloshes gently around your waist, then your thighs as the high priestess escorts you to the shallows of the pool. With a sigh of relief, you lower your shapely ass to the step and lean back; after all of the walking you did to get here, it feels so good to get off your feet.", parse);
	Text.NL();
	Text.Add("As caught up in the feeling of aching muscles as you are, you don’t even register that Adala is kneeling before you until you feel her fingers closing around your thigh. A groan bubbles up your throat as the catgirl priestess starts to massage your aching flesh, cleaning the dust from your fur and soothing protesting sinews and joints with deft motions of her fingers. From the thigh, she continues patiently down your leg, rotating the knee until it clicks softly, then working the kink from your ankle. Finally, she reaches your foot and begins to rub it, kneading the tender pawpads between her palms.", parse);
	Text.NL();
	Text.Add("<i>“How do you feel, Your Ladyship?”</i>", parse);
	Text.NL();
	Text.Add("Purring luxuriantly, you assure her that you feel wonderful. She is so good with her hands!", parse);
	Text.NL();
	Text.Add("<i>“Good, I’m glad. Just relax, I’ll make sure you’re properly cleaned and purified.”</i>", parse);
	Text.NL();
	Text.Add("A moan rips out of your throat as dainty fingers suddenly seize your cock in a deceptively gentle grip. With expert precision, they dance hauntingly across every inch of your maleness. Fingers stroke your glans, mock-pinching the bristles, and then glide along your shaft. They tease their way under your sheath and knead your balls, leaving you harder than you can remember ever being in your life.", parse);
	Text.NL();
	Text.Add("A fire burns inside your loins, your balls pulsate as they churn up seed, your cock throbs in anticipation. When Adala’s fingers suddenly abandon your maleness, a heart-wrenching moan of despair escapes you, so addled by lust are your thoughts. The priestess simply smiles and rises from her former position, hands reaching out to spread fingers lovingly across your chest, making your heart race as she does.", parse);
	Text.NL();
	Text.Add("Adala cleans the rest of your body with the same diligence, ensuring not a speck of dust or sand clings to your short fur. You feel a bit disappointed as her hands leave your body, but this couldn’t last forever...", parse);
	Text.NL();
	Text.Add("<i>“Please, wait here for a moment, Your Ladyship. I’ll go make sure the preparations for the ritual are complete, then take you to the ritual chambers. Take this opportunity to reflect upon your new role, or relax if you prefer.”</i>", parse);
	Text.NL();
	Text.Add("As Adala emerges from the pool and pads quietly away, you lean back and sigh hugely. Resting against the steps, your gaze becomes unfocused as you allow your mind to wander. Just what will life be like, serving as the avatar of Lady Bastet? And will that allow you to spend more time with Lady Adala?", parse);
	Text.NL();
	Text.Add("You purr throatily as your mind drifts to the glorious image of the naked high priestess, her curves burned into your very brain. Her image shifts in your mind’s eye, growing more perverse. Her luscious lips wrapped around your cock... her breasts heaving as you suckle upon them... her ass jiggling hypnotically as you spank it...", parse);
	Text.NL();
	Text.Add("Aware of your hand wrapping itself around your cock, you snap back to reality with a start. A flush of shame sours your belly, making your hand withdraw. You can’t do that here!", parse);
	Text.NL();
	Text.Add("...But, Lady Bastet <b>is</b> a Goddess of love and pleasure, whispers a treacherous little voice in the back of your head. Surely, there is nothing <b>wrong</b> with a little self-pleasure in her temple...?", parse)
	Text.Flush();
	
	//[Masturbate][Meditate]
	var options = new Array();
	options.push({ nameStr : "Masturbate",
		tooltip : "You’re sure no one will mind if you take the opportunity to relieve some tension. Adala did tell that you could relax if you wanted...",
		func : function() {
			Text.Clear();
			Text.Add("Mind made up, you push out of your impromptu seat and slink behind one of the palms that grows upon the pool’s banks, using it as a cover for what you are about to do. Need for privacy sated, you empty your mind of anything other than visions of the voluptuous loveliness that is the high priestess.", parse);
			Text.NL();
			Text.Add("Before your mind’s eye swims the most wonderfully perverse sights, your hand caressing the throbbing length of your member as you envision her lavishing her expert attention on it with hand and mouth, with breast and buttocks. As your pace picks up, you grow more inventive, daydreams of what it would feel like to be buried into the very depths of her cunt flood your imagination.", parse);
			Text.NL();
			Text.Add("Finally, you stifle a shriek of pleasure as your seed bubbles across the sand.", parse);
			Text.NL();
			Text.Add("Having emptied your aching balls, you kick sand over the puddle you have left to hide the evidence before wading back into the pool.", parse);
			Text.NL();
			Text.Add("You scrub yourself to clean up after your little playtime and return to the steps, where you once again take a seat and lean back as you try to relax. Aah… this feels much better now that you don’t have a raging erection clouding your thoughts.", parse);
			Text.NL();
			Text.Add("Sitting here, basking in the afterglow of sexual climax, listening to wind gently graze the water of the pool... it’s a wonderfully serene experience. Your ears twitch almost in time with the hypnotic sound of water rippling, and a dreamy smile crosses your lips as you allow your eyes to start sinking closed.", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Meditate",
		tooltip : "No, you shouldn’t. This is a sacred place. It wouldn’t be right. Maybe you should meditate, try to calm your body...",
		func : function() {
			Text.Clear();
			Text.Add("Closing your eyes, you inhale deeply, holding your breath as you try to think of nothing. Though the lust continues to rage inside of you, it slowly ebbs away as you focus on nothing but breathing. In, out, in, out.", parse);
			Text.NL();
			Text.Add("With each exhalation, it feels as if the fire in your loins dwindle and die. Slowly, your cock grows limper and limper, until it begins to shrink back inside of your sheath. A feeling of deep tranquility washes over you, and you smile absently to yourself. It’s rare you get a feeling to just relax like this, and you willingly give yourself over to it, even though the flames within are well-quenched now.", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("<i>“Your Ladyship?”</i> You nearly jump out of your skin. You were so relaxed that you didn’t even hear Adala approach.", parse);
		Text.NL();
		Text.Add("<i>“Forgive me for startling you, Your Ladyship, but the preparations for the ritual are complete. Shall we go?”</i>", parse);
		Text.Flush();
		
		//[Explain][Wait][Ready]
		var options = new Array();
		options.push({ nameStr : "Explain",
			tooltip : "You don’t feel ready just yet. Why not ask her to explain the ritual while you wait?",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Of course, Your Ladyship,”</i> she replies, bowing in reverence.", parse);
				Text.NL();
				Text.Add("<i>“Every envoy must undergo the ritual, it is the most important part of your duties. We will anoint your body with the holy oils and sacred essences to prepare you for your new role as Bastet reincarnate. The oils must cover every inch of your body, and you must allow it to seep inside your very being.”</i>", parse);
				Text.NL();
				Text.Add("You nod slowly to show you’re listening.", parse);
				Text.NL();
				Text.Add("<i>“Afterward, we will help you clean yourself of the remaining oil and you will be take to your throne, where you shall rule this temple as Lady Bastet herself,”</i> she finishes.", parse);
				Text.NL();
				Text.Add("Letting the high priestess’s words digest, you thank her for explaining them to you. But... what does she mean by ‘letting it seep into your very being’? What do you do actually need to do for that?", parse);
				Text.NL();
				Text.Add("<i>“You don’t have to do anything yourself, Your Ladyship. Just wait and let the changes come naturally. Normally, we’d have a small period of training for the envoy, to make sure they’re physically fit for this task, but that won’t be necessary in your case,”</i> she says with a smile.", parse);
				Text.NL();
				Text.Add("Changes? Furrowing your brow, you explain that you thought that this was only ceremonial - this is actually going to change you in some way?", parse);
				Text.NL();
				Text.Add("<i>“Yes. Your body will change to a form better fit for the avatar of the Lady. You’re a very handsome male, Your Ladyship, but I think we can both agree that you still lack a few of the visual qualities of our Goddess, Lady Bastet.”</i>", parse);
				Text.NL();
				Text.Add("...Well, that explains how your gender is of no object. For a moment, a flash of panic ripples through you, demanding that you flee now. But... this is a holy obligation. The Goddess has blessed your people for so long; is it really so great a sacrifice?", parse);
				Text.Flush();
				
				//[Yes!][Hot][No…]
				var options = new Array();
				options.push({ nameStr : "Yes!",
					tooltip : "I mean, this your manhood that we’re talking about! And if what she said is true, you’re going to lose it!",
					func : function() {
						Text.Clear();
						Text.Add("Panic races through your veins, your whole body trembling with the desire to run. From somewhere deep within your bones, a primal urge to flee this place and never look back rises...", parse);
						Text.NL();
						Text.Add("And is met with the cold logic of the matter. This is a sacred task. Your village, your family, they have been completing their side of the covenant for generations. Lady Bastet is the Goddess of love now, but once, she was Goddess of war and ruin. Do you dare to offend the Goddess herself by breaking the covenant? Even if you somehow believed you could escape her wrath yourself, what might happen to all you once called friends and family?", parse);
						Text.NL();
						Text.Add("With those thoughts ringing in your head, the panic leaks from your pores, washed away in the icy deluge of resignation. Shoulders slumping, you sigh and quietly thank Adala for at least being honest with you about what your fate will be.", parse);
						Gui.PrintDefaultOptions();
					}, enabled : true
				});
				options.push({ nameStr : "Hot",
					tooltip : "Yes, you might lose your manhood… but then again? Would be it be so bad? Especially when you’re going to be a woman as pretty as Lady Bastet.",
					func : function() {
						Text.Clear();
						Text.Add("Your tail sticks as if you had been electrified, ears perked up. Shivers race across your body, prickles of delight dancing under your skin. That sounds... that sounds so <b>hot!</b> Your mind’s eye flashes before you, teasing you of images of yourself remade to fit the Goddess. Unthinkingly, you cup the imaginary bulge of your prodigious breasts, trembling with fantasized pleasure.", parse);
						Text.NL();
						Text.Add("Opening your eyes, lips curled into an eager smile, you purr avidly to Adala that you wish she’d told you this sooner. You can’t wait to begin now...", parse);
						Gui.PrintDefaultOptions();
					}, enabled : true
				});
				options.push({ nameStr : "No…",
					tooltip : "...This is but a small sacrifice for the many blessings Lady Bastet has granted you and your village.",
					func : function() {
						Text.Clear();
						Text.Add("You inhale deeply, letting your raging emotions still, exhaling softly to expel your doubts. Humbly, you thank Adala for being honest with you about what will happen. You promise her that you will do whatever she asks so that you may fulfill your role.", parse);
						Gui.PrintDefaultOptions();
					}, enabled : true
				});
				
				Gui.Callstack.push(function() {
					Text.NL();
					Text.Add("<i>“Of course, Your Ladyship. Never forget that we’re here to serve you. We’ll do our best to make sure you’re comfortable and want for nothing,”</i> she says, bowing reverently.", parse);
					Text.NL();
					Text.Add("Exhaling softly, you ask her to lead the way; there’s no point delaying any longer.", parse);
					Text.NL();
					Text.Add("<i>“Yes, Your Ladyship. Please follow me,”</i> she says, extending her hand.", parse);
					Text.NL();
					Text.Add("You take her hand and follow her as she leads you away.", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				});
				
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true
		});
		options.push({ nameStr : "Wait",
			tooltip : "You’re not ready yet. Ask her for a few moments so you can steel yourself.",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Of course, Your Ladyship. We have time, but please try not to delay for too long. The ritual is ready and we are waiting for you.”</i>", parse);
				Text.NL();
				Text.Add("Absently, you nod to the priestess, focusing on trying to slow the beating of your heart. Inhaling and exhaling slowly, you start to feel more in control. After a few moments, you open your eyes and nod to Adala, telling her that you’re ready to go.", parse);
				Text.NL();
				Text.Add("The high priestess gives you a gentle smile, understanding shimmering in her eyes as she holds her hand out in invitation. Your own fingers curl softly around hers, and she patiently begins leading you to your destiny.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		options.push({ nameStr : "Ready",
			tooltip : "You’re as ready as you’ll ever be. Time to go and assume your role as Bastet’s new avatar.",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Excellent, then please follow me,”</i> she says, extending her hand welcomingly.", parse);
				Text.NL();
				Text.Add("Without hesitation, you accept her invitation, fingers twining firmly around her own. The high priestess gives you a maternal smile and the two of you set off, hand in hand, to meet your destiny.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		
		Gui.Callstack.push(function() {
			Text.Clear();
			Text.Add("It takes several minutes of walking for you to reach the holy chamber that Adala wishes to find, leaving you wondering just how large the temple truly is. Then, Adala triumphantly pushes open the door and you are too awestruck to think about such things anymore.", parse);
			Text.NL();
			Text.Add("The room is bigger than the whole of the house you lived in before. At its center, a huge altar of night-black marble, intricately decorated with silver leaf, takes the pride of place. On ornately decorated tables nearby lie large jars and intricate looking tools of gold and ivory, obviously part of what you are about to undergo. Reliefs of the Goddess, naked and in all her divine glory, adorn the walls, depicting her dancing, drinking, making love and pleasuring herself.", parse);
			Text.NL();
			Text.Add("But the room is not unoccupied, either. Two more women, clearly fellow priestesses, are busily preparing the items that will soon be used upon you. Unlike Adala herself, both of them clad in nothing but a few trinkets about their forms. Further, each girl has the same holy markings of a feline ears and tail, and for a moment, the question as to if they are Adala’s daughters rises in your mind.", parse);
			Text.NL();
			Text.Add("Dumbstruck, you quietly follow Adala through the doors, trying not to start as they swing shut behind you, without needing to be closed by either of you.", parse);
			Text.NL();
			Text.Add("<i>“Your Ladyship, let me introduce you to your personal attendants,”</i> she says motioning to the twins. They immediately stop and approach you, bowing reverently.", parse);
			Text.NL();
			Text.Add("<i>“It’s an honor to finally meet you, Your Ladyship,”</i> they say in unison.", parse);
			Text.NL();
			Text.Add("<i>“My name is Ming,”</i> says one of them. <i>“And I am Ling,”</i> says the other. They both lift their heads to finally get a good look at you.", parse);
			Text.NL();
			Text.Add("To your marvel, the two of them are perfectly identical to each other; it’s like looking into a pair of reflections in a smooth pond. They must be twin sisters to look so much alike. Each has beautiful dusky brown skin, clearly marking them as from one of the deeper desert tribes, whilst their ears and tails remind you of a caracal, with their reddish fur the color of frosted sand. Four eyes of sparkling leaf green study you intently, waiting for you to say something.", parse);
			Text.NL();
			Text.Add("Realising that you are staring, you finally remember your manners enough to say hello and tell them how nice it is to meet them.", parse);
			Text.NL();
			Text.Add("<i>“Thank you, Your Ladyship,”</i> they reply in unison with a grin. The twins walk towards the altar, kneeling besides it and motioning for you to hop on.", parse);
			Text.NL();
			Text.Add("<i>“As soon as you lie upon the altar, we can begin,”</i> says Adala, patiently waiting for your next move.", parse);
			Text.NL();
			Text.Add("Inhaling softly, you approach the altar, tail swishing softly behind you. The altar is more than large enough to let a single person lay down upon its surface, and it has been indented in the shape of a vague humanoid outline. Even through your fur, the marble is cool enough that your skin prickles as you sit atop it, maleness shrinking at the chill suddenly placed against your testes. Steeling yourself, you swing yourself around and lie down within the indent, arms against your sides as you stare up at the ceiling. For lack of anything else to do, you call to the priestesses that you are ready to begin when they are.", parse);
			Text.NL();
			Text.Add("<i>“Yes, Your Ladyship.”</i> Adala moves to pick up one of the jars while the twins stand beside you. <i>“We’ll start on the top. Please, close your eyes, Your Ladyship.”</i>", parse);
			Text.NL();
			Text.Add("No sooner have your eyes fallen shut than warm liquid begins gently pouring over your face. With measured hands, a steady flow of oil spatters against your forehead and begins running downwards. It flows into the corners of your eyes, but it doesn’t sting as you might expect, instead welling up there before sliding harmlessly down your cheeks. As the stream moves, more oil flows over your snout, filling your nostrils with its rich scent.", parse);
			Text.NL();
			Text.Add("It smells like night lilies and spring rain.", parse);
			Text.NL();
			Text.Add("Despite everything, your lips curl into a smile as your face is inundated with oil. You can feel the excess washing through your hair as it pools in the indent, seeping down the back of your neck and oozing sluggishly along your shoulders.", parse);
			Text.NL();
			Text.Add("You feel a pair of tongues, gently licking your face, a ticklish feeling spreading over your head as they lick your cheeks, chin and snout clear of the oil.", parse);
			Text.NL();
			Text.Add("<i>“Open your mouth, Your Ladyship,”</i> whispers one of the twins into your ear.", parse);
			Text.NL();
			Text.Add("Without hesitation, you part your jaws, letting the oil flow directly onto your tongue. It’s thick and rich - almost like honey in its consistency - and just like honey, it tastes wonderfully sweet. You tilt your face to catch more of the wonderful sweetness, letting it glide down your throat.", parse);
			Text.NL();
			Text.Add("When you finish gulping down the offered liquid, a pair of lips press to your own. A feline tongue thrusting into your maw as one of the priestesses kisses you passionately.", parse);
			Text.NL();
			Text.Add("At once, your eyes spring open, revealing that you are locking lips with the luscious Adala. Without a moment’s hesitation, you start kissing her back, your oil-sweetened tongue curling playfully against the priestess’s own. Slick as it is, you easily squirm out of her efforts to pin your tongue, allowing you to counterattack.", parse);
			Text.NL();
			Text.Add("Even as the twins, Ming and Ling, begin pouring yet more oil over your head, nimble fingers working to massage it deep into your scalp, you hardly notice. All that matters to you is the taste of Adala’s tongue on your own. Purring in pleasure, your arms unthinkingly reach up to wrap themselves around the older catgirl, crushing her wonderfully soft breasts to your own harder chest.", parse);
			Text.NL();
			Text.Add("Adala doesn’t fight or complain as you reach behind her. She simply purrs in pleasure, breaking the kiss long enough to lick your jaws then move in for another dose.", parse);
			Text.NL();
			Text.Add("Through the haze of pleasure, you feel a strange sensation on your scalp. The more the twins massage and caress it, the stronger it feels. It’s a sort of prickling, but not one that’s annoying. Your brow furrows in confusion... it actually feels kind of good.", parse);
			Text.NL();
			Text.Add("Even as the twins stop massaging, the prickling continues to linger, before slowly fading away. Occupied as you are trying to taste Adala’s tonsils, the high priestess deftly fending you off before counterattacking, you only dimly realise the twins are picking up combs.", parse);
			Text.NL();
			Text.Add("You certainly feel when they touch combs to hair, though. As each sister deftly runs her comb through your hair, you purr softly. With a sense of absent-minded wonder, you realise that they seem to be working harder than you’d expect.", parse);
			Text.NL();
			Text.Add("You can feel each comb gliding through and through, and your mind begins to paint a picture. Your brown hair must be much longer now, silken soft to the touch from how easily the twins are able to comb it. You picture yourself with a new hairdo, long, lush and womanly, and you smile dreamily; you’re going to look so pretty.", parse);
			Text.NL();
			Text.Add("Adala finally breaks the kiss, pushing herself off your grasp and panting. <i>“The changes have already started. How do you feel, Your Ladyship?”</i>", parse);
			Text.NL();
			Text.Add("Lips curled in a dreamy smile, you reply that you feel pretty good, giggling to yourself. At the sound of your titter, you stop, blinking in confusion. Since when do you giggle? And is that your voice? You sound... girlier, than you remember. It’s such a soft and dainty voice, but it’s melodious, too. Warm and pleasing to the ears, with a lilt to it that sounds full of invitation. It just sounds so... so right, for a Goddess.", parse);
			Text.NL();
			Text.Add("Still, it’s an alien sound, to be coming from your own mouth. As much as you know that it’s your own voice... it still feels and sounds strange to you.", parse);
			Text.NL();
			Text.Add("<i>“I’m glad to hear it. We will be moving on to your chest now, Lady Bastet.”</i>", parse);
			Text.NL();
			Text.Add("Lady Bastet... you know that Adala is only trying to honor you, that it is the name that you will go by once they are done... but it still feels wrong to hear them call you that. Your heart squeezes painfully tight inside your chest at that name, and you repress the urge to look around for worshippers angry at such blasphemy. Foolish, you know - these are the Lady’s own priestesses, after all", parse);
			Text.NL();
			Text.Add("But still... you’re not ready to hear that name for you.", parse);
			Text.NL();
			Text.Add("Not yet, anyway.", parse);
			Text.NL();
			Text.Add("The three priestess each grab a pitcher and begin pouring the oil over your chest and belly. Their hands move to massage both your fur and muscles underneath. It feels… divine. Their hands are so soft, yet they move with purpose. Massaging, teasing, molding your body under their touch. You gasp softly as one of the twins, Ming you believe, teases one of your nipples.", parse);
			Text.NL();
			Text.Add("<i>“Sorry, Your Ladyship. I couldn’t resist,”</i> she says with a mischievous smile. You gasp once more as her naughty little twin does the same to your other nipple. <i>“Forgive me, Your Ladyship,”</i> she says with a mischievous smile of her own.", parse);
			Text.NL();
			Text.Add("Feeling your maleness starting to peek out of its sheath, you don’t even try to hide the wicked grin that curls across your features. With your lilting new voice, you coo that maybe they should kiss it better; that would help you to forgive them.", parse);
			Text.NL();
			Text.Add("The twins look at you in surprise for a second, but their lips curl into knowing smiles soon after. <i>“Of course, Your Ladyship. We’re here to serve,”</i> says Ming. <i>“And serve we shall.”</i> says Ling.", parse);
			Text.NL();
			Text.Add("They each take to one of your sides, leaning close to kiss your little nips. You arch your back with a moan of pleasure, trailing off into a delighted purr as the twins kiss and lick, running their tongues around your dainty pink pearls. Blood rushes under your skin, making your nipples swell proud and firm, all the sign that the catgirls need. With the eagerness of hungry babes, the twins slurp each nipple into their mouths, faces pressed side by side in their need to nurse. Your nubs vibrate as they purr eagerly, lips and tongues working to suckle from your flat, boyish chest.", parse);
			Text.NL();
			Text.Add("Two dainty hands, one from each sister, place themselves upon your pectorals, groping and squeezing, as if they were trying to knead clay for a potter’s wheel. You mewl in pleasure, panting, your toes curl at the fire that flares inside your stomach. Unnoticed by any of you, your cock thrusts itself from its sheath, achingly hard.", parse);
			Text.NL();
			Text.Add("But your own attentions are upon your chest. Through a haze of pleasure, a lust stronger than anything you can ever recall feeling before, you are aware of your chest <i>growing</i>. As the twins knead and caress, what was once work-hardened muscle grows softer and fuller, swelling out into full, proud breasts. You can feel the weight of them, growing with every second, and you yowl in pleasure, pleading with the twins to make you bigger, to give you tits worthy of a Goddess.", parse);
			Text.NL();
			Text.Add("As if in response to your pleas, their hands start moving faster. The more your breasts grow, they more they have to knead, not that they seem bothered by the idea...", parse);
			Text.NL();
			Text.Add("Even as Ling and Ming lavish their attentions on your breasts, you are not unaware of Adala as the voluptuous high priestess straddles you. For a moment, you hope that she is going to begin pleasuring your cock; even if it means losing it entirely, it would be worth it to have her mouth wrapped around your meat.", parse);
			Text.NL();
			Text.Add("For a moment, the image of your cock shrinking as Adala suckles from it, vanishing into your flesh and leaving behind nothing but a last glaze of sperm on the high priestess’s tongue, flows through your mind. The image is so perverse, so wonderful, that you mewl in ecstasy, waiting for it to become reality.", parse);
			Text.NL();
			Text.Add("To your surprise, Adala lowers her head to your stomach instead. With long, lavish laps her tongue glides across your midriff, trailing ornate patterns over the rippling six-pack. As she circles your belly-button, leaving you crooning beneath her touch, you can feel the warmth flowing across your skin. Your muscles are softening, belly sucking inwards, leaving you with a trim, svelte stomach fitting of a woman.", parse);
			Text.NL();
			Text.Add("And yet, even as your muscles soften into womanly curves, you feel no sense of diminishment. Your strength remains as great as it ever was... indeed, as your curves grow, you feel stronger than before! It is as if you are... are being invigorated by the worship of your priestesses!", parse);
			Text.NL();
			Text.Add("As a twin gently grinds a nipple with her teeth, you groan in ecstasy, rolling that thought around in your mind. Worship... yes, that’s it, that’s exactly what they are doing. These women, these gorgeous, sexy women, are worshiping you.", parse);
			Text.NL();
			Text.Add("Mmm... and you’re loving it, every glorious second of it...", parse);
			Text.NL();
			Text.Add("If this is what your future holds, then you couldn’t be happier.", parse);
			Text.NL();
			Text.Add("<i>“I’m pleased to hear that, Your Ladyship,”</i> says Adala, stopping her attentions on your midriff. <i>“I’m done with your belly, now it’s time to move to this,”</i> she adds, moving a hand to your sheath and balls. <i>“May I, Your Ladyship?”</i>", parse);
			Text.NL();
			Text.Add("A luxuriant purr rumbles out of your belly as you feel soft, dexterous fingers playing lazily around your manhood. Dreamily, you tell her that to go ahead; you’re ready to lose that part of yourself.", parse);
			Text.NL();
			Text.Add("<i>“Lose this part? What do you mean, Your Ladyship?”</i> Adala asks in confusion. The twins stop their ministrations on your chest to look at you in bewilderment, almost as much as Adala herself.", parse);
			Text.NL();
			Text.Add("Purring still, wrapped in the blanket of pleasure they so carefully enveloped you in, you clarify that you’ve made your peace with losing your penis. After all, you can hardly be the avatar of the Goddess with it, you point out.", parse);
			Text.NL();
			Text.Add("The three priestess continue to look at you in confusion, until one of the twins begins laughing. Her sister follows in tow, and even the head priestess herself seems to crack a smile. <i>“Forgive me, Your Ladyship,”</i> she says, stifling her laughter. <i>“But none of us would <b>dream</b> of removing your penis. It’s such a beautiful cock, after all. So shapely… I have no doubt you’ll bring much pleasure to whomever you deem worthy,”</i> she says.", parse);
			Text.NL();
			Text.Add("A flush of pride makes your cock stretch just that little bit taller, throbbing with need. Still, your mind latches onto Adala’s words and confusion reigns. Puzzled, you ask how it is that you can keep your penis if you are supposed to be the avatar of Bastet - how can you retain that most vital piece and still be called a woman?", parse);
			Text.NL();
			Text.Add("<i>“Lady Bastet is the Goddess of love, and as such, she has many aspects. Some see Her Ladyship as a mischievous lover, who takes what she wants and makes you love her all the more for it. Some see her as a gentle matron, happy to provide for her children and her faithful. There are those who see her as a protector, defending them and their loved ones. And others simply see her as a gentle lover, bringing comfort and happiness. Tell me, Your Ladyship, which aspect do believe to be your true aspect?”</i>", parse);
			Text.Flush();
			
			//[Mischievous][Matron][Protector][Lover]
			var options = new Array();
			options.push({ nameStr : "Mischievous",
				tooltip : "She’s the mischievous lover, of course. Flirtatious and playful, a good-hearted tease who wants your heart and as much fun as she can get.",
				func : BastetScenes.Birth3, enabled : true
			});
			options.push({ nameStr : "Matron",
				tooltip : "She’s the matron, naturally. She’s the warm heart who brings children into the world and soothes the troubled hearts of those in need. She is the heart of the family, and all are her children.",
				func : BastetScenes.Birth3, enabled : true
			});
			options.push({ nameStr : "Protector",
				tooltip : "Lady Bastet is the protector, she who prefers peace but whose hand will take up the spear and the shield when danger threatens. Someone must be strong when evil is near, and so it falls to her.",
				func : BastetScenes.Birth3, enabled : true
			});
			options.push({ nameStr : "Lover",
				tooltip : "The source of all that is comforting, the bringer of joy, the queen of happiness and the granter of desire. What else can be she be but the truest incarnation of the lover?",
				func : BastetScenes.Birth3, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		});
		
		Gui.SetButtonsFromList(options, false, null);
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

BastetScenes.Birth3 = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Adala simply shakes her head. <i>“No, Your Ladyship. You’re all of them. No artist in this world is capable of representing all that you are, for you are the sum of all that and more. So they just pick one of your many aspects, Your Ladyship. You are love and joy incarnate. And like a loving mother, you extend your reach to protect us all. But as the Goddess of love, you must also have the means to show your faithful that you love them, and could you do that if you were not properly equipped to do so?”</i>", parse);
	Text.NL();
	Text.Add("You blink slowly, digesting what the high priestess has said. Quietly, you assure her that does make sense... but then, why have you always seen her depicted as purely female? And does this mean that those women who have served before you have grown penises as part of their ascension to the role?", parse);
	Text.NL();
	Text.Add("The high priestess smiles softly. <i>“Lady Bastet has always had a playful heart. She likes to surprise the more naive petitioners. As for the female envoys, yes. They do grow penises as part of this ritual. Usually, it’s a lot of work making sure a worthy penis grows, but not in your case, Your Ladyship - you already have such a beautiful one...”</i>", parse);
	Text.NL();
	Text.Add("With a giggle, you thank her for the compliment; you’re very proud of it. Tilting your head to the side, you ask her what she needs to do with it as part of the ritual, then, if she doesn’t have to remove it?", parse);
	Text.NL();
	Text.Add("<i>“Simply anoint it, Your Ladyship, unless you don’t mind me playing with it a bit. If I must confess, I’ve had my eye on your cock ever since I saw you in the bath, Lady Bastet.”</i>", parse);
	Text.NL();
	Text.Add("The beautiful high priestess wants to play with your cock? Well, what else could you say, but ...?", parse);
	Text.Flush();
	
	//[Yes!][Definitely!][Absolutely!]
	var options = new Array();
	options.push({ nameStr : "Yes!",
		tooltip : "If that’s what she wants, who are you to say no? She can go right ahead and play to her heart’s content!",
		func : Gui.PrintDefaultOptions, enabled : true
	});
	options.push({ nameStr : "Definitely!",
		tooltip : "She wants to play with your dick, and you’ve been wanting her to play with it since you laid eyes on her sexy body. Of course she can!",
		func : Gui.PrintDefaultOptions, enabled : true
	});
	options.push({ nameStr : "Absolutely!",
		tooltip : "You’re so horny right now, you’d have to be crazy to deny her. You expect her to play with it like she plays with her favorite toy.",
		func : Gui.PrintDefaultOptions, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("<i>“You honor me, Your Ladyship,”</i> Adala says with a grin, fetching a small vial of oil and what looks like a small funnel. The twins simply pout in obvious jealousy.", parse);
		Text.NL();
		Text.Add("A nervous tongue dabs at your lips as you observe the implements she’s taken, and you hesitantly ask what it is that she needs those for.", parse);
		Text.NL();
		Text.Add("<i>“The funnel is so we can pour the oil inside your shaft and around your sheath. We need to make sure every inch of your body is anointed, Your Ladyship.”</i>", parse);
		Text.NL();
		Text.Add("Well, that’s a relief. With a sigh, you settle back down, spreading your legs slightly as you wriggle your hips to get more comfortable. You announce that you’re ready to begin when she is.", parse);
		Text.NL();
		Text.Add("Adala starts by pouring a healthy dose of oil on your penis and balls, then she closes the vial and begins massaging your shaft. She does her best to touch every inch, every vein, and every sensitive barb on your glans.", parse);
		Text.NL();
		Text.Add("You moan luxuriantly, fighting not to wriggle and make her mess up what she’s doing. It’s so hard to do, though; her touch feels just exquisite, each stroke sending chills dancing along your spine even through the warmth of the oil.", parse);
		Text.NL();
		Text.Add("Once she’s satisfied, she moves to your balls, weighing them and rolling them in her palms as she makes sure they’re properly covered in the sacred oils. Your sheath gets a similar treatment. When she’s done with the external part, she takes the funnel in hand and turns to look at you. <i>“I’m going to pour some oil inside your sheath and inside your shaft now, Your Ladyship.”</i>", parse);
		Text.NL();
		Text.Add("With a shudder and a deep breath, you force yourself to relax. As if sensing your tensions, the twins work themselves around, hands reaching down to caress your shoulders. With expert precision, their fingers attack the stiffness in your muscles, rolling and stroking, their touch rough enough that you can feel every glorious inch, yet not so hard it hurts. Within moments, you are loose as a sodden parchment.", parse);
		Text.NL();
		Text.Add("Purring in your pleasure, you assure Adala that you’re ready for her to start now.", parse);
		Text.NL();
		Text.Add("Nodding, Adala takes the funnel and gently adjusts it between your sheath and your shaft. It’s a bit uncomfortable, but you bear it. Then she starts to slowly pour the oil, moving the funnel along to ensure it’s all spreading properly.", parse);
		Text.NL();
		Text.Add("Your legs quiver, and you suppress the urge to kick at the alien sensation of liquid oozing down inside your sheath, coating you inside and out with the mystical oil.", parse);
		Text.NL();
		Text.Add("Next, she takes your shaft in her hands, gently rubbing your tip and opening your urethra. Once she does, she inserts the funnel. Just the tip. It still feels uncomfortable… but it also feels kinda good. It’s an interesting feeling having your urethra penetrated. Speaking of penetration, you wonder what it will be like when you have a pussy of your own...", parse);
		Text.NL();
		Text.Add("A mewl bubbles out of your throat as the oil starts to glide down the funnel, trickling slowly into your urethra. By the Lady, there are no words to describe how alien it feels to have fluid going <b>in</b> when normally it would be coming out!", parse);
		Text.NL();
		Text.Add("Even as the twins continue their massage, moving along your shoulders and down your arms, you still have to bite your lip to help you keep from pulling away from Adala’s ministrations. Finally, mercifully, the priestess gently removes the funnel and you can unclench your jaw. The coppery tang of blood washes across your tongue and you know that you have broken the skin.", parse);
		Text.NL();
		Text.Add("As you ruminate upon this, a shiver runs up your body, causing you to growl softly in pleasure. Adala has leaned her face back in towards your throbbing cock, drooling a thick mixture of oil and precum, and her warm breath stirs the sensitive flesh like nothing you’ve ever imagined.", parse);
		Text.NL();
		Text.Add("And then her tongue sweeps across your oil-soaked, pre-smeared balls and you nearly leap off of the altar with a girlish squeal. Your balls have always been kind of sensitive, but that just felt like nothing you’ve ever known before!", parse);
		Text.NL();
		Text.Add("Emboldened by your reaction, the priestess licks you again, and then again. Within a heartbeat, she is orally worshipping your straining balls. Her tongue curls around them, slathering with her drool and flicking them back and forth, then glides back into her mouth before she bends in closer. Noisily, she kisses them, one by one, then starts to suckle upon them.", parse);
		Text.NL();
		Text.Add("As she does this, her hands ensure your cock doesn’t feel left out. With the same expertise as before, her fingers glide up and down and across your shaft, teasing every bristle, dabbing at your oozing urethra. Your fluids dribble into her hair, but the priestess clearly couldn’t care less; her world has receded to her hands on your dick, your balls in her mouth, and her need to please them both.", parse);
		Text.NL();
		Text.Add("If your arms weren’t being held by the twins, who seem to feel they must pin you to the altar, lest you wriggle yourself off of it in your pleasure, you’d just have to pet Adala like the gorgeous kitty she so resembles.", parse);
		Text.NL();
		Text.Add("Speaking of kitties, you’re pretty sure you can feel the slight vibrations of a purr emanating from her. She must be really enjoying herself… Of course, so are you. And you voice this enjoyment in the form of a moan. Adala, having grown tired of your balls, has decided to move to a more tasty morsel, namely, your cock. She licks the shaft all the way to the tip, then licks her way back down.", parse);
		Text.NL();
		Text.Add("Right at this time, you also feel the twin gently latch on and suck on your fingers. Even as they suck your fingers, they cast envious looks at the head priestess tending to your man-meat. Oh yes… Adala really knows how to use her mouth…", parse);
		Text.NL();
		Text.Add("You gasp, short, sharp bursts of air escaping your mouth from the stimulus driving you mad with pleasure. Your balls are feeling fuller and fuller, so full that you feel like they’re going to burst from the sheer volume of cum building up inside of them... But, they just keep on getting tighter and heavier with each passing heartbeat.", parse);
		Text.NL();
		Text.Add("In one burst of mad insight, you realise that your balls aren’t merely feeling heavier, they are <b>getting</b> heavier - your nuts are growing! As your try to process this thought through the haze of sheer pleasure clouding your mind, you dimly realise that Adala’s mouth is growing tighter and tighter.", parse);
		Text.NL();
		Text.Add("For a dreamy second, you marvel at her ability to clench her mouth so exquisitely. But, as the tightness keeps on increasing, you’re forced to confront reality. Even an expert cocksucker couldn’t mimic this sort of tightness. Your dick is growing bigger too...", parse);
		Text.NL();
		Text.Add("And yet you couldn’t be more pleased. A great yowl of pleasure echoes up from your belly as your legs wrap themselves over Adala’s shoulders, pulling her further onto your growing maleness. As your newfound breasts bounce and jiggle, you cry for her to keep on sucking, to make you bigger still; you want a tool worthy of the Goddess of love herself!", parse);
		Text.NL();
		Text.Add("Adala redoubles her efforts, trying her best to take more and more of you inside her mouth, even as you grow way too big to fit. She showers you in attention, moaning and purring, sending delicious vibrations coursing through your growing shaft.", parse);
		Text.NL();
		Text.Add("It’s just too much for you. Flinging your head back, you howl like an alleycat in heat as a toe-curling climax rips through you. Your new balls squeeze tighter than they ever have before as you paint Adala’s throat white with cum.", parse);
		Text.NL();
		Text.Add("The priestess is a natural at this; as you climax, she thrusts you all the way into her throat, relaxing her gullet and letting you simply <i>pour</i> down. Her stomach begins to bulge, violently distending as wave after wave of semen keeps slapping into it.", parse);
		Text.NL();
		Text.Add("As it begins to press against your knees, the taut skin deforming from the pressure, it’s clear even she can’t keep up with your sheer volume. She tries - by the Lady’s bounty, she tries so hard. ", parse);
		Text.NL();
		Text.Add("But with a choke and a splutter, she is forced to pull herself from your member, belly sloshing as she lets you paint her face white. Her skin is turned creamy as you layer on semen over her breasts and arms and shoulder. Unable to swallow any more, she simply kneels there with dignity, letting your seed coat her.", parse);
		Text.NL();
		Text.Add("In what could be an eternity, or only a few seconds, you finally run dry, spurting a final pitiful shot square into the canyon of Adala’s cleavage before you slump back. Though your cock remains achingly hard, you are no longer cumming, instead focusing on gulping for breath as you try to regain your strength from the exhaustive orgasm.", parse);
		Text.NL();
		Text.Add("Adala licks her fingers clean, purring in pleasure as she rubs your seed over the skin of her breasts and wipes her face. <i>“Thank you for this boon, Your Ladyship.”</i>", parse);
		Text.NL();
		Text.Add("The twins, having finishes with your hands, move to help their leader clean up. They lick Adala’s breasts with gusto, drawing moans of delight from the head priestess.", parse);
		Text.NL();
		Text.Add("Your tongue dabs at your lips, arousal forming a lump in your throat that you try to swallow. Your cock, still enchanted by the ritual’s effects, throbs at the display, but your balls are too empty for you to make a serious attempt at getting them to turn their attention to you.", parse);
		Text.NL();
		Text.Add("But from the feelings flowing from your bloated nutsack, you don’t think it’ll be too long before you can change that...", parse);
		Text.NL();
		Text.Add("<i>“Ming, Ling, please anoint Her Ladyship’s legs. I’ll handle her ass.”</i>", parse);
		Text.NL();
		Text.Add("Your ass? You purr at the thought; yes, that sounds wonderful. The twins gave you such wonderful big boobies already. How can you not complement such perfection with a nice round booty? As you muse to yourself, your fingers idly pinch one of your nipples, the spark of stimulus widening the cat-like grin on your face.", parse);
		Text.NL();
		Text.Add("<i>“Yes, lady Adala,”</i> the twins reply in unison, each grabbing a pitcher full of oil. They coat your legs and your feet with the sacred oil, then they each take one of your legs and lifts it.", parse);
		Text.NL();
		Text.Add("You shift slightly, trying to help them by holding your legs aloft. As their nimble little fingers begin to rub against your inner thighs, you purr softly in pleasure, feeling the first drops of a new batch of precum starting to seep from your cock.", parse);
		Text.NL();
		Text.Add("Two sets of eyes flick towards your dripping dick, matching mischievous grins spreading on identical faces, but the twins remain professional. Their hands lovingly sweep back and forth along their chosen thighs, rubbing more of that wonderful oil into your fur and your skin. Once they deem your thighs coated, they renew their own handfuls of oil and start sliding up your legs, meticulously covering each limb in feminizing lubricants.", parse);
		Text.NL();
		Text.Add("You lay your head back and sigh in comfort, feeling completely drained of tension. Though not quite so much that you don’t raise an eyebrow when you see Adala return with a rather large dildo, its reverse-end sculpted into the lips of a wide funnel.", parse);
		Text.NL();
		Text.Add("With more nonchalance than you would have thought, you ask the high priestess what she needs that for.", parse);
		Text.NL();
		Text.Add("<i>“For your butt, Your Ladyship. We must anoint inside you as well,”</i> she explains, rubbing some slick oil on the tip of the dildo.", parse);
		Text.NL();
		Text.Add("...Oh. That thought hadn’t occurred to you. A little earlier, you might have freaked out at the statement, but you feel so good that, right now, it just sounds like some more kinky fun. With a toothy grin, you nonchalantly ask if that’s all, waving one of your dainty new hands to emphasize your flippant tone.", parse);
		Text.NL();
		Text.Add("<i>“Of course not, Your Ladyship. We haven’t even started molding your pussy. We use the same dildo for both tasks.”</i>", parse);
		Text.NL();
		Text.Add("Interest piqued, you note that sounds like fun, then ask if there’s anything you need to do to help her out. One of the twins tickles the pads of her chosen foot, and you giggle, wriggling an ankle in response.", parse);
		Text.NL();
		Text.Add("Adala shakes her head. <i>“No need to worry, Mistress Bastet. Just sit back, spread your legs and relax. I’ll make sure you enjoy your anointment.”</i>", parse);
		Text.NL();
		Text.Add("Giggling, you assure her that you have no doubts about that, before noting you’re happy to lie back for her, but you currently can’t do anything about spreading your legs.", parse);
		Text.NL();
		Text.Add("<i>“Girls?”</i> Adala says. The twins respond with a grin and move themselves, helping you spread your legs, far more than you thought yourself capable of without feeling any discomfort.", parse);
		Text.NL();
		Text.Add("Now that the head priestess has a clear view of your puckered hole, she gathers some oil on her fingers and begin massaging around your buttcrack.", parse);
		Text.NL();
		Text.Add("A gasp escapes your mouth at her touch, tingles racing along your spine as she stimulates you.", parse);
		Text.NL();
		Text.Add("She spreads your tight hole with a finger, rubbing some oil inside before pulling back and aligning the dildo with your entrance. <i>“May I, Mistress Bastet?”</i>", parse);
		Text.NL();
		Text.Add("With an approving lilt, you tell her that you’re ready when she is.", parse);
		Text.NL();
		Text.Add("Adala feeds your hungry butt the dildo. It slips past your sphincter with only the slightest hint of pain. Far less than you’d expect for a dildo that size, especially when you consider you used to be a virgin prior to this.", parse);
		Text.NL();
		Text.Add("However, she slides it in, you can feel every glorious inch as it pushes inside, stretching you open wider and wider. The feeling of being so full is alien to you, yet also intoxicating. A moan bubbles from your throat, giving way to a lustful purr as you consider the all-too-attractive idea of experiencing this again and again in the future.", parse);
		Text.NL();
		Text.Add("It almost makes you protest when you feel it stop pushing. Even though it’s doing interesting things inside of you, you’re sure that it could go <b>deeper</b>. Almost, because no sooner has it stopped its advance than you feel it grow deliciously warm inside of you. Thick, warm liquid begins to ooze its way inside your stretched hole, seeping wonderfully over your sensitive flesh, and you groan lewdly, a hapless slave to the pleasure you are feeling.", parse);
		Text.NL();
		Text.Add("Pleased by your reaction, Adala begins pumping the dildo in and out of you, each motion helping spread the thick oil inside you as she moves into a slow fucking. The twins, stilling clinging to your legs, begin gently licking your ankles, moving up as they soon reach your sensitive pads. You mewl in delight, both at the twins’ ministrations as well as the delicious stimulation your high priestess is giving your tight puckered hole.", parse);
		Text.NL();
		Text.Add("Quivers ripple up and down your spine, your tail going ramrod straight. When Adala decides you are finished and pulls the tool free of your hole, you whimper in disappointment, butthole clenching down in a futile attempt to try and stop her. It doesn’t even slow her down, but the friction makes you squirm, and you promise yourself that you will be able to grip better, one day.", parse);
		Text.NL();
		Text.Add("<i>“Any takers for Her Ladyship’s pussy?”</i> Adala asks, lifting the still dripping dildo up in the air.", parse);
		Text.NL();
		Text.Add("<i>“Me!”</i> they cry in unison, though Ling was just a little bit faster...", parse);
		Text.NL();
		Text.Add("<i>“Ling it is, then,”</i> Adala announces, passing the dildo to the winning twin.", parse);
		Text.NL();
		Text.Add("<i>“Aww...”</i> Ming pouts.", parse);
		Text.NL();
		Text.Add("<i>“Don’t worry, Ming. We can handle Mistress Bastet’s butt and her back,”</i> the head priestess says, giggling.", parse);
		Text.NL();
		Text.Add("You titter along with them, smiling in blissful anticipation of what they have in mind.", parse);
		Text.NL();
		Text.Add("<i>“Your Ladyship, please turn around,”</i> Adala asks.", parse);
		Text.NL();
		Text.Add("Without so much as a nod, you roll over in your incline. It’s a little trickier, what with your new bustline... mmm, but there’s definitely something to be said for the feel of your big tits squishing just so against the warm, oil-slick marble.", parse);
		Text.NL();
		Text.Add("Once you have made yourself comfortable, a deluge of more warm oil starts gliding down along your back, poured daintily across your tail and focusing on your butt. You wiggle your ass in invitation, arching your back and moaning in exaggerated pleasure at the feeling.", parse);
		Text.NL();
		Text.Add("You feel Ming straddle your back, leaning over hugging you from behind as she presses her mounds to your back. Though, in truth, she’s a little hard to feel; the catgirl is so light! Is she really that petite? ...Or have you just gotten that much stronger?", parse);
		Text.NL();
		Text.Add("Adala’s hands busy themselves with molding your once flat rear, but you can feel your tush growing under her fingers. Firm, round, and with just the right give to make it a thrill to hold. Of course, it’s also a thrill to be held like that…", parse);
		Text.NL();
		Text.Add("A mewl of pleasure bubbles from your lips, and your legs move to squeeze Adala around her waist. You hope she understands that you want a nice big butt, a proper counterweight to your glorious tits.", parse);
		Text.NL();
		Text.Add("Right about then, Ling decides to start molding your new vagina. She massages the flesh just behind your balls, making circular motions with a pair of fingers as if she was spreading and closing pussy lips.", parse);
		Text.NL();
		Text.Add("It feels strange at first, but also rather nice. The more she massages, the nicer it feels. Pleasure growing and growing, you have no idea that your flesh is shifting shape until the priestess slides her fingers inside you with an audible squelch. The sudden spike of strange, wonderful tingles along your spine makes you yelp and then purr in approval.", parse);
		Text.NL();
		Text.Add("Ling stirs up your insides with her fingers, pouring more oil to coat your entrance. You mewl in disappointment when she pulls out, but the feeling is dashed when you feel the dildo against your nethers.", parse);
		Text.NL();
		Text.Add("Unfamiliar muscles ripple as you clench and relax your new orifice experimentally. A hungry grin spreads across your face and you wriggle your hips slightly. Your tail flicks in invitation as you order Ling to just shove it in you, your tone brooking no argument.", parse);
		Text.NL();
		Text.Add("<i>“Yes, Your Ladyship,”</i> she replies. Without any delay, she spears your new vagina, taking your virginity and hilting with you in a single go. Rather than the unbearable pain of a new taking, all you feel is a bothersome little tickle that soon passes.", parse);
		Text.NL();
		Text.Add("The feeling is like when Adala had it up your asshole... but at the same time, it’s totally different. It feels <b>so</b> much better than that, the sensations washing through your body and leaving you to moan. Muscles go loose as jelly, leaving you slumping in your place, totally at Ling’s mercies and loving every second of it.", parse);
		Text.NL();
		Text.Add("As Ling thrusts and pumps the dildo inside of you, you find yourself wondering dimly how a real cock would compare to this. Mmm... it’d probably take a really good lover to make it better, though; it feels like Ling knows your new pussy even better than you do. As juices and oil squelch and slurp, the toy-tool rubs against the most sensitive spots within you, the friction driving you mad with pleasure.", parse);
		Text.NL();
		Text.Add("When your moaning reaches its peak, your cock aching so hard it feels ready to burst, Ling starts to pour the oil down its length. It’s almost like the dildo is cumming inside of you, and that thought makes you feel so <b>hot</b>...", parse);
		Text.NL();
		Text.Add("With a full-throated scream of pleasure, cum gushes from both your organs. Your pussy clamps down on the dildo, shaking as its first ever female orgasm - but definitely not the last - rushes through it, female honey spurting around its edges and soaking your balls. Your cock, trapped between your belly and the altar, erupts, flooding the incline with your semen and sending it cascading down the drainage, pouring white, sex-scented wetness across the tiles.", parse);
		Text.NL();
		Text.Add("<i>“It is done,”</i> Adala announces.", parse);
		Text.NL();
		Text.Add("Ming clambers off your back, and Ling pulls the dildo out. They set about cleaning the many tools, jars and pitchers they’ve used.", parse);
		Text.NL();
		Text.Add("So... this is it; the first day of the rest of your new life? Well... you don’t think it’s going to be so bad, given how it started. Tittering softly to yourself, you push yourself out of the incline, swiveling as you sit up so that you are facing your priestesses. Absently, you make a vain attempt to brush some of the worst of the cum from your breasts, stomach and thighs.", parse);
		Text.NL();
		Text.Add("As soon as she sees you sit up, Adala bows in reverence. <i>“Please, Lady Bastet. Wait here, I’ll go fetch a mirror for Your Ladyship,”</i> she says, hurrying off.", parse);
		Text.NL();
		Text.Add("<i>“Mistress Bastet, please allow us to clean you up,”</i> the twins say in unison, towels in hand.", parse);
		Text.NL();
		Text.Add("You hold your arms out to make it easier for Ling and Ming, and the twin catgirls fall upon you with soft, snuggly towels. They work enthusiastically, and soon have you surprisingly clean of the mixed fluids. They do sneak in a few licks and kisses when they think you’re not paying attention, but you don’t mind. You certainly steal a few from them yourself while you can.", parse);
		Text.NL();
		Text.Add("Finally, they have you as clean as they can hope to get you and they step away, placing the used towels to the side to be cleaned later.", parse);
		Text.NL();
		Text.Add("<i>“Here, Your Ladyship,”</i> announces Adala, carrying a full-body mirror. She sets it down, bows reverently, then moves away so that you may inspect yourself.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("Pushing gently against the altar’s surface, you drop lightly to the floor, rising in a single smooth motion. You feel so powerful and graceful now, more than you ever have before. A smile crosses your lips at the thought, and you stare deeply into the mirror to see who you have become.", parse);
			Text.NL();
			Text.Add("The Bastet who stares back at you is at once familiar and alien. Those are your features looking back at you, but they’re so feminine now. You’re a true beauty, the kind of woman who gets anyone who likes girls to stare, and that thought fills you with pride. You’ve shrunk a little, and you don’t have the muscles you used to have, but that doesn’t bother you at all. It just makes you look cuter.", parse);
			Text.NL();
			Text.Add("And besides - here, you smirk and giggle to yourself at the realisation - whatever inches you’ve lost from your height, you’ve more than gained elsewhere.", parse);
			Text.NL();
			Text.Add("With a lechery that betrays your original gender, your hands reach up to possessively caress the huge breasts that bounce enticingly upon your chest. They’re a small DD-cup at the least, but given you only barely stand more than five feet tall, they look enormous on your petite frame. Large nipples jut freely through your fur, and as a finger brushes past one, you have to bite your lip; they’re definitely sensitive.", parse);
			Text.NL();
			Text.Add("But you’re not just top-heavy! No, you’re properly curvy all over. Turning partially around, you look back over your shoulder into the mirror to admire the view of the new you from behind. Wide, womanly hips curve sensuously at your sides, inviting the eye to follow as you walk. And once the hips have lured them in, your big, firm, gropeable heart-shaped booty will make sure they can’t take your eyes off you.", parse);
			Text.NL();
			Text.Add("Your tail flicks in pride and you toss your head, watching in amusement as your shoulder-length brown hair falls into place to frame your features. Reaching down with your hand, you grope your ass, confirming that it feels just as lovely as it looks, and then you spread your cheeks to get a better look at your two holes. Though you’re not a virgin with either of them, they both look to be really tight, something that you confirm with a carefully probing finger.", parse);
			Text.NL();
			Text.Add("Done examining your back, you turn around once more to examine the last lingering remnant of your original gender. Like everything else about you, it’s been enhanced. Your dick is <b>huge</b> compared to what it was; a foot long and it has to be at least three inches thick! To say nothing of the balls swaying beneath it, which are easily three times their former size and feel even heavier than that. With a proud smirk, you realise that you should never have to worry about running out of sacred seed with these new beauties dangling down there.", parse);
			Text.NL();
			Text.Add("<i>“Lady Bastet? I take it you’re pleased?”</i>", parse);
			Text.NL();
			Text.Add("Your voice is a lilting purr, husky with arousal, as you reply that you are very pleased indeed. You close your eyes, savoring the feelings of power, comfort and arousal as they sweep through you...", parse);
			Text.NL();
			Text.Add("And then, when you open your eyes, you are back in the Shadow Lady again, the experience being over.", parse);
			Text.NL();
			
			BastetScenes.TFBlock();
			
			Text.Add("Once you feel ready to leave, you dress yourself and leave the room, heading for the main area.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				TimeStep({hour: 3});
				Scenes.Lucille.WhoreAftermath(null, bastet.Cost());
			});
		});
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

export { Bastet, BastetScenes };
