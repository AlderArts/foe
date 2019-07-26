import { Lei } from './lei';
import { WorldTime } from '../../GAME';
import { Gui } from '../../gui';
import { Text } from '../../text';
import { Race } from '../../body/race';

let SexScenes = {};

SexScenes.Prompt = function(options) {
	var parse = {
		
	};
	
	if(SexScenes.PettingUnlocked()) {
		options.push({ nameStr : "Petting",
			tooltip : "Ask him to pet you.",
			func : function() {
				SexScenes.Petting(true);
			}, enabled : true
		});
	}
	/* TODO
	options.push({ nameStr : "name",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}, enabled : true
	});
	*/
}

SexScenes.PettingUnlocked = function() {
	return lei.flags["Met"] >= Lei.Met.CompletedTaskEscort;
}
SexScenes.Petting = function(repeat) {
	var parse = {
		boygirl : player.mfFem("boy", "girl"),
		hair : function() { return player.Hair().Short(); },
		ear : function() { return player.EarDesc(); },
		leg : function() { return player.LegDesc(); }
	};
	
	var p1 = party.Get(1);
	parse["comp"] = party.Num() == 2 ? p1.name : "your companions";
	parse["heshe"] = party.Num() == 2 ? p1.heshe() : "they";
	
	Text.Clear();
	if(repeat) {
		Text.Add("You incline your head in agreement. Yes, you’d like a reward.", parse);
		Text.NL();
		Text.Add("<i>“Well then, let me take you somewhere we will not be interrupted.”</i> He motions for you to follow, and leads you back up to his room, where you had spoken after the job.", parse);
		Text.NL();
		if(party.Num() > 1) {
			Text.Add("<i>“Don’t worry, I’ll take good care of your friend,”</i> he tells [comp], motioning for them to wait in the lounge further on.", parse);
			Text.NL();
		}
		Text.Add("You look at him nervously, edging back, as he takes a step forward, erasing the distance between you.", parse);
	}
	else {
		Text.Add("You incline your head in acknowledgement, and Lei hops down from the desk. With him looming over you, you stand up almost involuntarily, knocking over your chair in the process, which only makes him smile the wider.", parse);
	}
	Text.NL();
	Text.Add("Your breath catches as Lei's fingers trace slowly along your cheek, before he moves further up, stroking your hair. The motion of his fingers is gentle; they barely press against your [hair], tickling more than brushing. You wonder what he'll do next, but once he reaches your neck, he simply shifts his hand back to the top, and starts over.", parse);
	Text.NL();
	Text.Add("You're a little disappointed at first, but gradually, as his digits trace stroke after stroke over your scalp, you feel a warmth spread through you. The steady movements are pleasant, almost hypnotic, and you drift into a pleased daze as Lei pets you.", parse);
	Text.NL();
	Text.Add("An involuntary sigh of pleasure escapes your mouth, causing your eyes to flicker open in surprise for an instant, only to find that you're leaning close against Lei, your bodies pressing together. When did that happen? Well, that doesn't matter, it's warm here, and you're enjoying the feeling of closeness.", parse);
	Text.NL();
	Text.Add("<i>“Are you enjoying this, pet?”</i> Lei asks, the words mirroring your thoughts from a moment ago.", parse);
	Text.NL();
	var taller = lei.Height() > player.Height() + 10;
	if(taller)
		Text.Add("You nod, your nose pressing against his chest,", parse);
	else
		Text.Add("You nod, your head brushing against his,", parse);
	Text.Add(" and murmur your agreement.", parse);
	Text.NL();
	Text.Add("<i>“Then purr for me,”</i> he instructs.", parse);
	
	var catty = player.Ears().race.isRace(Race.Feline) || player.RaceCompare(Race.Feline) >= 0.3;
	if(!catty) {
		Text.NL();
		Text.Add("Purr? But you're not a cat...", parse);
		Text.NL();
		Text.Add("<i>“That doesn't matter. I think cats make for a cute pet.”</i> He keeps stroking you as he speaks.", parse);
	}
	Text.Flush();
	
	//[Purr][Bite]
	var options = new Array();
	options.push({ nameStr : "Purr",
		tooltip : "Why not? It <i>is</i> rather pleasant.",
		func : function() {
			Text.Clear();
			if(catty)
				Text.Add("Purring comes naturally to you. If anything, it's a bit of a surprise you weren't purring already. You take a deep breath, and slowly push it out, letting a deep, low purr cascade out from your stomach.", parse);
			else
				Text.Add("Feeling rather awkward, you try to purr, imitating the sound you've heard cats make. You don't get it quite right at first, but after a few more attempts, you're purring well enough that you could trick a cat.", parse);
			Text.Add(" It feels peculiarly good, a release of tension from the center of your being, as your muscles relax and your world narrows to his hand on your hair, and this sound of pleasure coming from inside you.", parse);
			Text.NL();
			parse["h"] = !player.Hair().IsLongerThan(4) ? ", shifting your hair aside," : "";
			Text.Add("<i>“Good [boygirl],”</i> Lei says quietly. His hand moves down a little, and[h] scratches behind your [ear], and you tilt your head towards him in pleasure.", parse);
			Text.NL();
			Text.Add("Lei smiles, and with a turn, moves towards the bed and sits down, pulling you after him into his lap. You look up at him, wondering what he’s planning, but he only holds you.", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Bite",
		tooltip : "There's more than one way cats might react - bite the hand that strokes you.",
		func : function() {
			Text.Clear();
			Text.Add("You wait for Lei to finish one of his strokes, before grabbing hold of his right arm, and nibbling on the hand. You worry at the skin for a few moments, and then take a bigger bite, taking the knuckle of his thumb between your teeth. Keeping firm hold of the hand, you glance up at him out of the corner of your eye.", parse);
			Text.NL();
			Text.Add("To your surprise, you see him grinning, and after a moment he bursts into laughter, the sounds of his mirth filling the room. You tilt your head in puzzlement, inadvertently shifting his hand along with it.", parse);
			Text.NL();
			Text.Add("Apparently undeterred, Lei strokes your hair with his other hand. <i>“I didn’t know I had such a selfish, playful kitten,”</i> he says. <i>“How about this, then?”</i> He grabs you around the waist with his free arm, and with a twist, tumbles both of you onto his bed. You let out a startled yelp as you fall, releasing his hand from your jaws, as you fall down on top of him.", parse);
			Text.NL();
			Text.Add("You feel his chest stir beneath your back, as he chuckles at the result of your resistance. Lying on top of him, in his arms, you can’t help but join in as well, and soon both of you are laughing together, tears of merriment springing to your eyes.", parse);
			Text.NL();
			Text.Add("After a minute, you quiet down. Lei sits up, pulling you along with him, leaving you sitting in his lap, held tight in his arms. You look up at him, wondering if he’s plotting something else, but he only holds you.", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		TimeStep({hour: 1});
		
		Text.Add(" <i>“It’s nice to let someone close sometimes, isn’t it?”</i>", parse);
		Text.NL();
		Text.Add("Feeling his warm body pressed against you, you can’t help but nod. With his arms wrapped around you, you feel safe. Safe from immediate danger, yes, but also safe from having to be cautious, from doubting people, from having your guard up.", parse);
		Text.NL();
		Text.Add("The two of you stay entwined for a long time, and you begin to feel drowsy in the small dark room, with candles flickering around you. Your [leg] feels like it’s falling asleep too, and you move it, shifting position a little awkwardly.", parse);
		Text.NL();
		if(player.Hair().IsLongerThan(6))
			Text.Add("Lei leans down over you, and gently brushes a strand of hair away from your eyes.", parse);
		else
			Text.Add("Lei leans down over you, and strokes your hair one more time.", parse);
		Text.Add(" <i>“I was wondering if you had fallen asleep. Come, I think that was reward enough for one day.”</i>", parse);
		Text.NL();
		Text.Add("You stir in his arms languidly, stopping just short of coming to a sitting position. It’s pleasant here - do you really have to get up already?", parse);
		Text.NL();
		Text.Add("Lei flicks your nose lightly, and your eyes shoot fully open. <i>“Don’t be a lazy kitty, now. It’s time to be up and about,”</i> he says, ", parse);
		if(WorldTime().hour >= 22 && WorldTime().hour < 5)
			Text.Add("<i>“even if it is rather late.”</i>", parse);
		else
			Text.Add("<i>“the day is not over yet.”</i>", parse);
		Text.NL();
		Text.Add("Regretfully, you disentangle yourself from his arms, and pull yourself to your feet.", parse);
		Text.NL();
		Text.Add("As he walks you to the door and you say your goodbyes, you smile. It’s not too bad being a pet.", parse);
		if(party.Num() == 2)
			Text.Add(" You collect [comp] from the lounge, where [heshe] seems nearly asleep, and head back down to the common room.", parse);
		else if(party.Num() > 2)
			Text.Add(" You collect your companions from the lounge, where they seem nearly asleep, and head back down to the common room.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

export { SexScenes };
