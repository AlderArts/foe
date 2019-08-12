import { GetDEBUG } from '../../../app';
import { WorldTime, TimeStep, GAME } from '../../GAME';
import { Entity } from '../../entity';
import { SetGameState, GameState } from '../../gamestate';
import { Gui } from '../../gui';
import { Text } from '../../text';
import { EncounterTable } from '../../encountertable';
import { EstevanFlags } from '../nomads/estevan-flags';
import { MariaFlags } from './maria-flags';
import { OutlawsFlags } from './outlaws-flags';
import { Time, Season } from '../../time';
import { Sex } from '../../entity-sex';
import { Cavalcade } from '../../cavalcade';
import { RigardFlags } from '../../loc/rigard/rigard-flags';
import { Party } from '../../party';

//
// Maria Dead drops
//
let DeadDropScenes : any = {};

DeadDropScenes.Alert = function() {
	let player = GAME().player;
	let maria = GAME().maria;

	var parse : any = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("As you’re crossing the drawbridge into the outlaws’ camp, you’re stopped by one of the gate sentries just inside the camp. She looks you up and down, then clears her throat. <i>“[playername], right?”</i>", parse);
	Text.NL();
	Text.Add("Yes, that’s you. Something come up?", parse);
	Text.NL();
	Text.Add("<i>“Word has it that Maria wants to see you next time you show your face around here; we’ve instructions to let you know to go find her when you come in. Don’t know what you’ve done to excite High Command so much, but keep your head on your shoulders while talking to her, okay?”</i>", parse);
	Text.NL();
	Text.Add("That’s silly. When have you never had your head on your shoulders? Nevertheless, you thank the sentry as the drawbridge is pulled up in your wake - if Maria is looking for you, then you shouldn’t keep her waiting. If it’s about what happened last time… well, let’s see if her putting in a good word for you has worked out.", parse);
	Text.Flush();
	
	maria.flags["DD"] |= MariaFlags.DeadDrops.Alert;
	
	TimeStep({minute: 15});
	
	Gui.NextPrompt();
}

//Trigger this when the player approaches Maria after having witnessed the above scene.
DeadDropScenes.Initiation = function() {
	let player = GAME().player;
	let maria = GAME().maria;

	var parse : any = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Taking a deep breath and squaring your shoulders, you step forward and approach Maria. She whirls around the moment you’re within earshot, then loosens up slightly as she realizes it’s you.", parse);
	Text.NL();
	Text.Add("<i>“[playername].”</i>", parse);
	Text.NL();
	Text.Add("Yes, it’s you. She called for you, and well, here you are. What’s the matter?", parse);
	Text.NL();
	Text.Add("<i>“You remember how I mentioned that I’d put in a good word for you with Zenith? Well, turns out that words aren’t enough - you’re still relatively new to us and all, even with you being given more of a head start on this trust thing than most are used to getting from him.</i>", parse);
	Text.NL();
	Text.Add("<i>“Long story short, if you’re really interested in working as an operative for us, you’ll need to start out like everyone else. Furthermore, since I was the one who stuck her neck out for you, I get the honor of showing you the ropes, at least until you’re capable of finding your way about on your own without walking straight into the guard.”</i>", parse);
	Text.NL();
	Text.Add("Maybe it’s better that way than assigning a complete stranger to your case, isn’t it? Best to have someone whom with you’ve got a little history mentor you and get past the whole ice-breaking thing?", parse);
	Text.NL();
	Text.Add("Maria rolls her eyes, but a small smile tugs at her lips. <i>“Well, when you put it that way, I guess that’s what Zenith was thinking, too. But trust me, I hope to be out of the babysitting phase as quickly as possible.</i>", parse);
	Text.NL();
	Text.Add("<i>“So, here’s what’s going to happen. We’ll get you started on the easy tasks first, and it doesn’t get much easier than dead drops.”</i>", parse);
	Text.NL();
	Text.Add("Dead drops?", parse);
	Text.NL();
	Text.Add("<i>“The basic idea’s very simple. We have a list of places where our contacts and sympathizers from around the kingdom and beyond drop off things which they want to get to us. Mostly information, but a few gifts here and there both ways aren’t out of the question. They have their people drop off their goods at a spot that we’ve agreed on beforehand, we get our people to pick them up, and the reverse happens when we’ve got something we want to hand over. Following me so far?”</i>", parse);
	Text.NL();
	Text.Add("Yeah, that sounds like pretty basic stuff.", parse);
	Text.NL();
	Text.Add("<i>“It may sound ‘pretty basic’ to you, but the correspondence contained in some of those drop-offs lets us get a better view of things that’re going on around Eden, and communicate with some of the outlying cells we have out there. They may make most of their own decisions, but still need to check in with Zenith for direction every now and then.”</i>", parse);
	Text.NL();
	Text.Add("It does sound serious, when even the lowliest and simplest of jobs carries such weight.", parse);
	Text.NL();
	Text.Add("Maria eyes you and folds her arms. <i>“No one misses the outhouse diggers, but believe me, everyone makes noise when shit starts to stink. Anyway, back to the point - we don’t always use the same ones over and over again. That’s just asking for someone to spot whoever’s making the drop-off or pick up, and then cause all sorts of trouble. Sticking to a regular schedule and being predictable in any shape or fashion is stupid, so we go through a rotation with each correspondence, arrange for new drop-off spots, reuse old ones which have been empty for a while now, so on and so forth.”</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("All right, you think you get the point. When can you get started?", parse);
		Text.NL();
		Text.Add("Maria shakes her head at you. <i>“Not so fast, buster. There are a few things you’ve got to know first.</i>", parse);
		Text.NL();
		Text.Add("<i>“Number one, we go alone. Ideally, this means just you. For now, though, that means you and me. No one makes or picks up a dead drop with too many hands tagging along; that’s just asking for someone to notice you and start asking inconvenient questions. You’re not royalty and don’t need an entourage trailing along behind you everywhere you go waiting to wipe your ass if you crap your pants, so if anyone’s with you at the time, they get to hang back at camp and have some fun while you head out with me.</i>", parse);
		Text.NL();
		Text.Add("<i>“Next, I hope I’ve impressed upon you that these things are important, so there’s not going to be any dithering around once we set off. If we’re slated to go to the slums to get something from a contact, then that’s where we’re going, and we turn around and make for camp afterwards. No stopping for drinks, no wandering around, and no - well, you get the point. Each moment in between our friends making the drop and us getting to it is a moment some busybody can poke his or her nose into our business.</i>", parse);
		Text.NL();
		Text.Add("<i>“And… really, that’s about it. The rest is common sense, which I hope for your own sake you have plenty of. Do you understand me? Zenith wants to see what you can do, and how well you can do it; I stuck my neck out for you, so don’t fail me.”</i>", parse);
		Text.NL();
		Text.Add("Of course.", parse);
		Text.NL();
		Text.Add("<i>“Good. We get drop-offs all the time, so I’m not going to rush you into this - the worst thing you can do to a greenhorn is to push him or her out the window overenthusiastic and underprepared. Talk to me again when you’re ready to head out, and I’ll check the schedule, see where we can take you. Now, if there’s nothing else, I’ve got a few matters to attend to.”</i>", parse);
		Text.Flush();
		
		maria.flags["DD"] |= MariaFlags.DeadDrops.Talked;
		
		TimeStep({hour: 1});
		
		Gui.NextPrompt();
	});
}

DeadDropScenes.First = {};
DeadDropScenes.First.Chat = function(CampPrompt : any) {
	var parse : any = {};
	
	Text.Clear();
	Text.Add("All right, you’re ready. You tell Maria as much, and the ebony beauty looks you up and down.", parse);
	Text.NL();
	Text.Add("<i>“Are you sure?”</i> she asks. <i>“I don’t want you suddenly remembering midway that you’ve something really important that you need to be doing. Get yourself in the clear first, then we can go.”</i>", parse);
	Text.NL();
	Text.Add("Good point. Are you ready?", parse);
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "You’re about as ready as they come.",
		func : DeadDropScenes.First.Start, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "Not just yet.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Right.”</i> Is it your imagination, or does Maria look relieved? <i>“Get yourself sorted out, then come find me again when you’re done.”</i>", parse);
			Text.NL();
			Text.Add("You nod and back away from her. Whatever it is that you’ve forgotten to do, you should get it out of the way first before returning.", parse);
			Text.Flush();
			
			CampPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

DeadDropScenes.First.Start = function() {
	let player = GAME().player;
	let party : Party = GAME().party;
	let outlaws = GAME().outlaws;
	let maria = GAME().maria;

	var parse : any = {};
	
	// PARTY STUFF
	maria.DDtimer = new Time(0,0,2,0,0);
	
	maria.RestFull();
	
	var group1 = party.Num() > 1;
	if(party.Num() > 1) {
		var group = party.Num() > 2;
		var p1 = party.Get(1);
		parse["comp"] = group ? "your companions" : p1.name;
		if(group) {
			parse["heshe"] = "they";
			parse["himher"] = "them";
			parse["s"] = "";
		}
		else {
			parse = p1.ParserPronouns(parse);
			parse["s"] = p1.plural() ? "" : "s";
		}
	}
	
	party.SaveActiveParty();
	party.ClearActiveParty();
	party.SwitchIn(player);
	party.AddMember(maria, true);
	
	//Set up restore party at the bottom of the callstack, fallthrough
	Gui.Callstack.push(function() {
		party.LoadActiveParty();
		Gui.PrintDefaultOptions();
	});
	// PARTY STUFF
	
	Text.Clear();
	Text.Add("You’ve got everything out of the way. Time to go!", parse);
	Text.NL();
	Text.Add("Maria quirks an eyebrow at you, then sighs and shakes her head resignedly. <i>“All right, let’s be off. You came at just the right time - too conveniently so, in fact, since I just got word from Zenith to bring in the latest drop. Place’s down by the slums, I’ll fill you in while we walk.”</i>", parse);
	Text.NL();
	if(group1) {
		Text.Add("You take a moment to settle down [comp], telling [himher] to just kick back and relax for a moment in the camp while you run this errand. Watching [himher] trundle off into the camp’s main body to do what [heshe] need[s] to do, you fall in behind Maria, ready to set out.", parse);
		Text.NL();
	}
	Text.Add("Maria wastes no time, immediately setting off for the gates at a brisk pace with you trailing behind her. The sentries manning their positions salute as she approaches, then quickly lower the drawbridge to let the both of you pass.", parse);
	Text.NL();
	Text.Add("<i>“The slums by the city walls are where many of our operatives within Rigard proper make their drop-offs,”</i> she explains. <i>“There aren’t as many patrols in the area, we have a fair number of sympathizers, and the generally rough-and-tumble nature of the place makes getting away easy if we need to leg it.”</i>", parse);
	Text.NL();
	Text.Add("Yes, you’re getting that all down. So, what exactly is the pick-up this time?", parse);
	Text.NL();
	Text.Add("<i>“Just a little pillow talk,”</i> Maria replies as the two of you reach the forest’s edge and step onto open road proper. <i>“We have someone working for us in the local brothel, which is great for intelligence-gathering - people tend to find their tongues rather loose in that place, and in more than one way.”</i>", parse);
	Text.NL();
	Text.Add("Hmm. The rest of the journey is uneventful; you come across a couple of passers-by making their trips to and from the city, but the road is otherwise peaceful and deserted until you draw near to the edge of the slums. The tall-peaked roofs of the shanty town’s wooden buildings come into view, and Maria holds up a hand.", parse);
	Text.NL();
	Text.Add("<i>“All right, we get off the road here. Now, remember what I told you; when in doubt, just follow my lead. We shouldn’t run into any trouble, but keep your wits about you and your voice down anyway.”</i>", parse);
	Text.NL();
	Text.Add("True to her word, Maria veers off the beaten path, circling around the edges of the slums, her eyes trained on the buildings that pass her by. You follow behind her for a minute or so, and then she stops all of a sudden and points out a dilapidated, abandoned hovel to you.", parse);
	Text.NL();
	Text.Add("<i>“There,”</i> she whispers to you. <i>“We approach that one; there’s a hole in the side of that hovel in which our people at the docks make their drop-offs. Remember, don’t be nervous. Act as if you have every right to be here, and people usually will just assume that you do - this goes doubly so in the slums. Of course, those who live here are pretty good at sniffing out fakes, so you’d better put on your best show.”</i>", parse);
	Text.NL();
	Text.Add("All right. Maria sets off at a brisk, casual walk, and you do your best to mimic her as she crosses the slums’ dirt streets and approaches the hovel. As she turns a corner, though, the archer’s face turns from serious to savage, a scowl parting her full lips.", parse);
	Text.NL();
	Text.Add("<i>“You! Drop that!”</i>", parse);
	Text.NL();
	Text.Add("You hurry around the corner just as Maria breaks into a sprint, giving chase after a young mouse-morph who can’t be any older than nine or ten. The brat has a small wrapped package under his arm, and given Maria’s reaction, it has to be what you’re after today.", parse);
	Text.NL();
	parse["w"] = WorldTime().season == Season.Winter ? " and slush" : "";
	Text.Add("Well, nothing for it. You take off after the brat as well, joining Maria in the chase through the muddy streets of the slums. The dirt[w] is slick underfoot, the alleyways narrow, and more than one poor passerby is bowled over by the sheer force of your chase as the two of you pursue the mouse-morph through the shacks and hovels. Dogs bark and chickens flap at the commotion, and though you duck and weave as well as you can, you can’t seem to gain on him - but at least you don’t lose him, either. The streets are long and narrow with few bends, and that helps.", parse);
	Text.NL();
	Text.Add("<i>“You don’t want that!”</i> Maria shouts at the fleeing street urchin. <i>“Do you even know what’s in it?”</i>", parse);
	Text.NL();
	Text.Add("<i>“Dunno!”</i> comes the reply as the little mouse-morph ducks and weaves between angry dockhands and donkey carts. <i>“But if yer willing to chase me for it, yer willing to buy it back, rite?”</i>", parse);
	Text.NL();
	Text.Add("Maria mutters something foul not quite under her breath, but the street urchin’s words give you an idea. If you’re really willing to pay for it… then you could end this right now, assuming you’ve the money to do so.", parse);
	Text.Flush();
	
	TimeStep({hour: 4});
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Pay",
		tooltip : "Offer to buy back the package for ten coins.",
		func : function() {
			party.coin -= 10;
			
			maria.flags["DD"] |= MariaFlags.DeadDrops.PaidKid;
			
			Text.Clear();
			Text.Add("Hey, if he’s willing to sell it back, you have the money to buy it. Doing your best not to lose sight of the little mouse-morph, you dig into your belongings for a handful of coins.", parse);
			Text.NL();
			Text.Add("Maria catches sight of what you’re doing, and shakes her head angrily. <i>“Don’t do that!”</i>", parse);
			Text.NL();
			Text.Add("Why not? You could end this right now. It’s only a few coins, and you won’t risk the little fellow giving both of you the slip.", parse);
			Text.NL();
			Text.Add("<i>“That’s not the p- look out for that stand! The point!”</i> Maria hisses through her teeth. <i>“If you buy him off, every little street urchin’s going to know that they can hold our drop-offs ransom!”</i>", parse);
			Text.NL();
			Text.Add("And if the dead drops were truly secure, street rats like him wouldn’t find them in the first place. Besides, the little bastard probably knows the slums better than either of you do, and that he just needs to get lucky once to give you the slip. On the other hand, you have to be lucky all the time, and you don’t feel very blessed today.", parse);
			Text.NL();
			Text.Add("Maria mutters something even more foul, but doesn’t stop you as you draw out a handful of coins and call out to the mouse-morph. Hearing the clink of coins and seeing the gleam of metal in your hand, he stops - but not before placing a sizeable stack of crates in between the two of you and him, ready to leap off and resume fleeing at the slightest provocation.", parse);
			Text.NL();
			Text.Add("<i>“Yeah, that’s enough. Throw it over.”</i>", parse);
			Text.NL();
			Text.Add("<i>“We’re not that stupid,”</i> Maria snaps. She glares daggers at you, but seems resigned to the choice you’ve made. <i>“Half up front, and half when you hand it over.”</i>", parse);
			Text.NL();
			Text.Add("The street urchin looks down at you from atop his perch, clearly thinking as to what to do next. His whiskers twitch as he considers Maria’s offer, then he looks at Maria and sees something in her face which brings his train of thought screeching to a halt.", parse);
			Text.NL();
			Text.Add("<i>”Okay. Half up front, half after it is. Toss it over.”</i>", parse);
			Text.NL();
			Text.Add("Well, that’s your cue. You split your handful of coins - ten in total - in half and toss it at the little brat, who tosses the wrapped package back at you in turn. You make good on the other half of your payment, and watch the street urchin scamper down from the heap to pick up his ill-gotten gains - while still keeping a healthy distance from you and Maria, of course.", parse);
			Text.NL();
			Text.Add("Thankfully, the chase and commotion haven’t attracted any onlookers; seems like the denizens of the slums are inclined to keep their heads under cover when there’s a ruckus going on near their doorsteps. Still looking like she’s bitten into something sour, Maria bends over and picks up the package, then elbows you as she tucks it away.", parse);
			Text.NL();
			Text.Add("<i>“Gah! Don’t just stand there - let’s get out of here before someone gets a close look at our faces!”</i> Without waiting for a reply, she grabs you by the arm and moves to drag you away from the scene, back through the dirt streets and under low rooftops. <i>“That drop point is as good as gone now - would’ve been anyway, but to make such a huge mess of it… and you just had to give in and take the easy way…”</i>", parse);
			Text.NL();
			Text.Add("Again, if the locals can’t actually find the drops, they can’t hold them for ransom. Maybe a rethinking of the locations <i>is</i> in order, as this whole debacle showed - had the two of you arrived a minute later,  he’d be long gone and you’d have nothing at all.", parse);
			Text.NL();
			Text.Add("<i>“Yes, but now they’ll actually be looking for them since they know there’s money in it - look, I’m not having this argument right now. Let’s get out of here and head back.”</i>", parse);
			
			Gui.PrintDefaultOptions();
		}, enabled : party.coin >= 10
	});
	options.push({ nameStr : "No",
		tooltip : "You’re not going to let this little brat hold your goods ransom.",
		func : function() {
			Text.Clear();
			Text.Add("Pay for what’s yours? Oh, the cheek of that little squirt; he’s not ransoming a single coin out of you! Still, there’s got to be some way that you can get the drop on him, and just chasing the little brat like this isn’t going to yield much in the way of results. While you have to keep on getting lucky to continue hounding him, the street urchin just has to get lucky once to give you the slip; if you’re not going to give in to his demands, you’ll need to act fast.", parse);
			Text.NL();
			Text.Add("A look at Maria’s face tells you that she concurs, and she motions to the rooftops. <i>“I’ll cut across the roofs,”</i> she tells you, slightly breathless from the chase. <i>“You herd him towards the docks. I’ll cut him off there.”</i>", parse);
			Text.NL();
			Text.Add("All right, sounds like a better plan than the one you have right now -  which is none. Maria makes a running leap for one of the low roofs, grabs its edge, and hoists herself up hand-over-foot onto the rooftops; the last sight you have of the archer is that of her dashing across the rickety, closely-spaced shanty town roofs, shortbow in hand.", parse);
			Text.NL();
			Text.Add("Alright, time for you to do your job. You can’t have been giving chase for any more than five to ten minutes, but it sure <i>feels</i> like it’s been far longer - and with the uneven roads and dodging you’re having to do, it’s sure taking the wind out of your sails more quickly than you expected. Hopefully, the docks aren’t too far away - with how things are going, you’re going to end up unlucky sooner or later.", parse);
			Text.NL();
			Text.Add("<i>“Just give up already, ya big lunkhead!”</i> the mouse-morph yells back at you. <i>“Yer good for a townie, but this thing of yers really worth a stint in the clapper?”</i>", parse);
			Text.NL();
			Text.Add("What, is he threatening you with jail? Unless he got drafted into the City Watch in the last few minutes, the only thing that this little brat is giving you is what’s rightfully yours!", parse);
			Text.NL();
			Text.Add("<i>“Finders keepers, losers weepers! ‘S the law ‘round these parts! Yer aren’t willing to pay to get this back, I’m sure someone else will!”</i>", parse);
			Text.NL();
			Text.Add("The law, that’s a joke. But anything to keep him talking and distracted - already, the dirt roads are giving way to boardwalks as you enter the pier, and you can see the lake ahead of you. Where <i>is</i> Maria? You can’t keep up the chase forever, and if the slums were bad, the docks are even worse - stacks of crates and barrels abound, not to mention all the tar and rope coils lying about, <i>and</i> then there’s the matter of the dockhands -", parse);
			Text.NL();
			Text.Add("All of a sudden, the street urchin squeals like a stuck pig, the short, sharp noise sending droves of gulls scattering in all directions. Pinning him to a nearby wooden pillar is the shaft of an arrow, driven through the side of his loose, tattered clothing. No arrowhead, but it’d definitely have caused a bloody bruise had it actually struck him.", parse);
			Text.NL();
			Text.Add("Maria!", parse);
			Text.NL();
			Text.Add("It’s a small opening, but it’s enough. As the little bastard tugs and tears away in an effort to get himself free, you close the distance and grab him in a flying tackle, tearing his clothes and sending the two of you to the ground. He sure has got quite a bit of fight left in him, biting, kicking and screaming as you pin him to the boardwalks.", parse);
			Text.NL();
			Text.Add("<i>“Cough it up and we’ll let you off easy, buster.”</i> Right on cue, Maria turns up on the scene, her shadow falling on the both of you. <i>“That’ll teach you to take things that don’t belong to you. I know living in this place is tough, but you’ve got to understand that there are some things you just don’t touch.”</i>", parse);
			Text.NL();
			Text.Add("Faced with no way out, the street urchin whimpers and goes limp, pulling out the package from his clothing. Maria reaches down and takes it from him, then glances at you. <i>“Right, it looks like the genuine article. Let him up, but watch out for any fast moves - on second thought, don’t. I’ve got you covered.”</i>", parse);
			Text.NL();
			Text.Add("You nod and get off the mouse-morph, who wastes no time struggling to his feet and legging it - but not before sticking out his tongue at the both of you and making a rude noise.", parse);
			Text.NL();
			Text.Add("<i>“Whatever helps him salvage a little of his pride,”</i> Maria says, slinging her bow on her back before folding her arms across her chest. <i>“Good job back there pinning down the little bastard, but we should clear out too before we attract too much attention.”</i>", parse);
			Text.NL();
			Text.Add("You don’t know about that - despite the chase and commotion, it looks like not that many of the locals have actually paid attention to the two of you, let alone stopped to stare. It certainly says something about the state of the slums and adjoining dock - but whether it’s that the locals are too used to violence to actually care, too wary to be overly curious about violence, or simply just plain disinterested - well, you have no idea.", parse);
			Text.NL();
			Text.Add("<i>“Come on.”</i> Maria’s voice cuts through your thoughts like a heated knife through butter. Right, right. Turning your back on the whole mess, you make do and head back, circling around the slums - you don’t want to be going back in there just yet.", parse);
			
			outlaws.relation.IncreaseStat(100, 1);
			
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("The two of you walk in silence side by side along the road for a while, the package still in Maria’s hands. Every now and then, she looks down at it, as if not quite sure if it’s really there; you’re just about to ask her for her two coins when she clears her throat.", parse);
		Text.NL();
		Text.Add("<i>“Well. That should put paid to that particular drop-off point. Once we get back, I need to discuss with Zenith just how safe the others are. I don’t want to go through what happened today again - there’re only so many of the City Watch, while brats like that one are everywhere.”</i>", parse);
		Text.NL();
		Text.Add("Well. One minute more and it’d be gone for good, one minute earlier and none of this unpleasantness would ever have happened.", parse);
		Text.NL();
		Text.Add("<i>“Which isn’t the point, that being whatever goes in should remain safe until we decide to pick it up within a reasonable time frame. But enough of that - let’s see what we’ve got in here.”</i>", parse);
		Text.NL();
		Text.Add("With that said, Maria quickly unties the the bundle, nimble fingers teasing apart cord and tearing open waxed paper to reveal a small sheaf of neatly-folded papers. The paper itself appears to be of fairly good quality, and you’re quite sure there’s a lingering scent of perfume of some sort, but it’s too faint to be sure of what the exact scent is. Maria’s lips move as she reads, and at length, she folds the paper back up and pockets it.", parse);
		Text.NL();
		Text.Add("What was the message, if you may ask?", parse);
		Text.NL();
		Text.Add("<i>“A note from one of our better people in Rigard,”</i> comes the reply. <i>“The City Watch’s onto us, but as expected, they’re still running around like chickens. If I didn’t know better, I’d say they’ve ducked their heads down and are hoping that this will all blow over, but they aren’t <b>completely</b> stupid, either.</i>", parse);
		Text.NL();
		Text.Add("<i>“A few more interesting bits here and there, some more pillow talk… this might come in useful later on.”</i> Maria folds up the papers and stuffs them back into her pocket. <i>“Stupid kid, trying to run off with these - if the City Watch got wind of what he was carrying, he’d be in no end of trouble. We work to free them from Rigard, and this is what we get…”</i>", parse);
		Text.NL();
		Text.Add("Well, the street urchin couldn’t have known what was in the package or that the both of you were outlaws, right? As far as he knew, he was holding a ticket to a meal, and meals are hard enough to come by in the slums.", parse);
		Text.NL();
		Text.Add("Maria sighs and shakes her head as the two of you leave the road for the forest’s edge. <i>“Yes, you’re right. Still. It’s been a long day, we’ve dithered outside for far longer than we should’ve been, and I’m not looking forward to talking to Zenith about this. Still, it’s got to be done, so nose to the grindstone and all.”</i>", parse);
		Text.NL();
		Text.Add("The remainder of your trip back passes in silence. At length you’re back within the outlaw camp, the sentries pulling in the drawbridge behind the two of you.", parse);
		Text.NL();
		parse["c"] = group1 ? ", gather your people" : "";
		Text.Add("<i>“All right, that’s it for today,”</i> Maria tells you. <i>“You’re dismissed - go and get a drink[c], take a nap or play some cards, whatever you do for entertainment when no one’s watching. I’ve got a report to make.”</i>", parse);
		Text.NL();
		Text.Add("Right. That wasn’t so bad in the end, was it?", parse);
		Text.NL();
		Text.Add("<i>“I’d have liked it to go much smoother,”</i> Maria snaps, then catches herself and rubs her face. <i>“Look, if you ever want to do another pick-up, just let me know. You’ve still got a little way to go before you’re skilled and trusted enough to do these on your own, and especially after what happened today…”</i>", parse);
		Text.NL();
		Text.Add("She leaves the end of that last sentence hanging and stalks away for the map building, leaving you alone to reflect on today’s events.", parse);
		Text.Flush();
		
		maria.flags["DD"] |= MariaFlags.DeadDrops.Completed;
		outlaws.relation.IncreaseStat(100, 1);
		
		TimeStep({hour: 4});
		
		Gui.NextPrompt();
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

DeadDropScenes.Repeat = function(CampPrompt : any) {
	let player = GAME().player;
	let party : Party = GAME().party;
	let maria = GAME().maria;

	var parse : any = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“Oh, so you’re interested in going on another field trip?”</i> Maria says. <i>“I suppose I could send you on the next one; it should be coming up soon. Just you as usual, of course, but depending on the situation I might come along, too. I was planning to check in with Zenith with regards to the schedule, so if you do want to go, I’ll hop over and see if there’s anything to be done.”</i>", parse);
	Text.NL();
	Text.Add("Well, that sounds like an invitation all right. Do you want to head on out on another drop?", parse);
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "Yeah. Anything need picking up or dropping off?",
		func : function() {
			
			// PARTY STUFF
			maria.DDtimer = new Time(0,0,2,0,0);
			
			if(party.Num() == 2) {
				var p1 = party.Get(1);
				parse["comp"] = p1.name;
				parse = p1.ParserPronouns(parse);
			}
			else {
				parse["comp"] = "your companions";
				parse["himher"] = "them";
				parse["hisher"] = "their";
			}
			parse["c"] = party.Num() > 1 ? Text.Parse(" You dismiss [comp], allowing [himher] to get up to [hisher] own mischief, then settle back to catch a breather.", parse) : "";
			
			party.SaveActiveParty();
			party.ClearActiveParty();
			party.SwitchIn(player);
			
			//Set up restore party at the bottom of the callstack. Call before trying to look at party again (in ending)
			Gui.Callstack.push(function() {
				party.LoadActiveParty();
			});
			// PARTY STUFF
			
			Text.Clear();
			Text.Add("<i>“I had a few things in mind, but let me talk to Zenith and see which one’s most urgent. Why don’t you get settled down in the meantime and get ready?”</i>", parse);
			Text.NL();
			Text.Add("All right, then.[c] Maria’s off like an arrow in flight and is back before too long, looking marginally more satisfied than she was when she left.", parse);
			Text.NL();
			Text.Add("<i>“All right, I’ve had a chat with Zenith and gotten our priorities in order. There <b>is</b> something that needs doing quite urgently, so I’d listen up if I were you.</i>", parse);
			Text.NL();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				DeadDropScenes.Docks.Entry();
			}, 1.0, function() { return true; });
			/* TODO other scenes
			scenes.AddEnc(function() {
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
			}, 1.0, function() { return true; });
			*/
			scenes.Get();
		}, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "Actually, not right now.",
		func : function() {
			Text.Clear();
			Text.Add("Maria shrugs and rolls her eyes. <i>“You were just asking? Well, there’s always work for me and mine to be done. Thanks for your concern, but if you’re not about to help then the next best thing you can do is stay out of our way.</i>", parse);
			Text.NL();
			Text.Add("<i>“If you <b>do</b> want to do something later you can come back - assuming I’m still around, that is.”</i>", parse);
			Text.Flush();
			
			CampPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

DeadDropScenes.Docks = {};
DeadDropScenes.Docks.Entry = function() {
	let player = GAME().player;
	
	var parse : any = {
		playername : player.name
	};
	
	Text.Add("<i>“One of our sympathizers from Rirvale upstream should have come into the slum docks yesterday; the barge should be unloaded by now. One of the crates from the cargo is earmarked for us and filled with a number of things that we can’t get for ourselves here in the forest, and someone needs to go and bring it in. That means you, [playername].”</i>", parse);
	Text.NL();
	Text.Add("Right. Which barge are you looking for, and what does this crate look like?", parse);
	Text.NL();
	Text.Add("Maria leans in and gives you the name of the barge in question. <i>“As for which one exactly, it’s hard to tell in advance, but you’ll recognize it by our symbol in one of the corners.”</i> She quickly sketches a sign in the air, a three-fingered paw. <i>“Shouldn’t be too large, easy enough for anyone to carry on his or her own. This should be easy enough for you to do alone, [playername]. Go there, pick up the goods, come back. You don’t even have to act innocent or anything, so don’t screw it up.”</i>", parse);
	Text.NL();
	Text.Add("Right, sounds simple enough for a glorified shopping run. You’ll be out and back in a jiffy, then.", parse);
	Text.NL();
	Text.Add("<i>“Come back soon, then. I’ll be out on forest patrol - if you get back before I do, just dump your haul in the map room and either Zenith or I will come by to pick it up.”</i> She gives you a final nod, then draws her cloak about herself. <i>“Stay out of trouble, okay?”</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("The trip to Rigard is uneventful, and you take care to skirt around the edges of the slums - you don’t want to draw any more attention to yourself than what’s strictly necessary. Eventually, though, you end up at the docks from their northward side, and earth gives way to boardwalks as the smell of tar and stale water greets your nose.", parse);
		Text.NL();
		Text.Add("All right, then. Time to start looking.", parse);
		Text.NL();
		
		TimeStep({hour: 4});
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("Aria must be smiling on you today - things go off without a hitch. You find the barge moored off one of the piers without too much trouble, and sailors and dockhands alike soundly ignore you as you approach the barge and its offloaded cargo - one wonders if they’ve been told to expect you, or at least, someone from the outlaws.", parse);
			Text.NL();
			Text.Add("Boxes, barrels and crates - the last have been laid out on pallets, as opposed to being stacked up like the former two. It’s a small matter to spot the outlaws’ three-fingered paw on one of them, and hoist it off the pallet. Weighty, but not heavy.", parse);
			Text.NL();
			Text.Add("Well, that’s your job done - time to head back.", parse);
			Text.Flush();
			
			TimeStep({hour: 4});
			
			Gui.NextPrompt(DeadDropScenes.Docks.Ending);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			DeadDropScenes.Docks.Cavalcade();
		}, 2.0, function() { return true; });
		scenes.AddEnc(function() {
			DeadDropScenes.Docks.GuardInspection();
		}, 2.0, function() { return true; });
		/* TODO
		scenes.AddEnc(function() {
			
		}, 2.0, function() { return true; });
		*/
		
		scenes.Get();
	});
}

DeadDropScenes.Docks.Ending = function() {
	let player = GAME().player;
	let party : Party = GAME().party;
	
	var parse : any = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Indeed, Maria wasn’t exaggerating when she mentioned that these were things that a merry band living out in the forest wouldn’t be able to get for themselves. ", parse);
	
	var scenes = new EncounterTable();
	
	scenes.AddEnc(function() {
		Text.Add("Several alchemical admixtures which you don’t look too closely at, a small case of finely-milled nuts and bolts, some glassware, and the rest of the remaining space in the crate is packed with bags upon bags of fine salt.", parse);
		Text.NL();
		Text.Add("Hmm. Guess the outlaws must use a lot of salt. The old forest might provide much, but something as basic and essential as salt… yeah. You can see why this was so important.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("A small measure of sulfur, several aromatic oils, and a number of short blades fashioned from quality steel lie in the crate. Quite the odd combination, actually, especially the latter - that is, until you remember that the outlaws don’t have the tools and facilities with which to work metal all the way out here. It really makes one think as to all the people who’re involved in just the simple making of a knife from its constituent parts…", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("What greets you as you pry the lid open are a number of unmarked bottles, sealed and corked with the utmost care. They’re certainly nothing you’ve ever seen anyone in camp indulge in, so -", parse);
		Text.NL();
		Text.Add("<i>“It’s not for us, but for some folk further inland,”</i> Maria explains. <i>“We pass them along on the quiet and help them avoid the ruinous taxes that the Crown imposes on them, and get a cut of the savings made.”</i>", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("<i>“Well, that wraps up this particular drop,”</i> Maria says, dusting off her hands and picking up the crate. <i>“Thanks for sticking your neck out and helping, [playername]. I’ll take it from here and get these stowed away.”</i>", parse);
	Text.NL();
	
	Gui.PrintDefaultOptions();
	
	parse["comp"] = party.saved.length == 2 ? party.saved[1].name : "your companions";
	parse["c"] = party.saved.length > 1 ? Text.Parse(" to fetch [comp]", parse) : "";
	Text.Add("One last nod, and she’s gone. Well, nothing left for it. Turning, you head off into the camp[c] - maybe a warm bath would be welcome after all this…", parse);
	Text.Flush();
	
	Gui.NextPrompt();
}

DeadDropScenes.Docks.Cavalcade = function() {
	let party : Party = GAME().party;
	let estevan = GAME().estevan;
	
	var parse : any = {
		
	};
	
	Text.Add("Despite a half-hour’s worth of searching, you turn up empty-handed. You must’ve gone through the barge’s entire cargo at least twice, and the captain’s assured you that nothing’s been moved to the warehouses just yet, so where is that crate you’re looking for?", parse);
	Text.NL();
	parse["n"] = WorldTime().IsDay() ? "" : " by the light of a flickering lamp";
	Text.Add("As it turns out, it can be found in the middle of four dockhands playing Cavalcade[n]. They’re merrily using it as a table while they sit on burlap sacks and sip at foul-smelling liquor straight from the bottle. They look up warily as you approach, the presence of a strange newcomer in their game not exactly welcomed. But there it is - almost invisible, but there nevertheless - the small mark of a three-fingered paw printed on the crate’s corner.", parse);
	Text.NL();
	Text.Add("<i>“Oi,”</i> one of the dockhands grumbles, glaring up at you. <i>“Looking at something? I’ll have you know we’re on our break right now.”</i>", parse);
	Text.NL();
	Text.Add("Oh no no, you weren’t going to accuse them of lazing about - who do you look like, some kind of slave-driver? The only thing that you were interested in is that crate they’re currently using as a game table - you were sent to get it for your boss, so if they would be so kind to let you have it…", parse);
	Text.NL();
	Text.Add("The idea that their game might be interrupted doesn’t quite go over well with the dockhands, who look amongst each other and shoot you surly looks. However, the one who just addressed you looks at his fellows and gives you a shrug.", parse);
	Text.NL();
	Text.Add("<i>“Tell you what, the game’s getting a bit boring with just the four of us here. All of us know each other and our tells, and things are getting mighty predictable around these parts. Play with us, win a hand, and we’ll give you your goods. Deal?”</i>", parse);
	Text.NL();
	Text.Add("<i>“Eh, it’s your fault if you can’t keep a straight face on a bad hand -”</i>", parse);
	Text.NL();

	var coin = DeadDropScenes.Docks.CavalcadeCost();

	Text.Add("<i>“Shut up, you. Anyway,”</i> he says, turning back to you, <i>“how about it? Buy-in is [coin] coins.”</i>", {coin: Text.NumToText(coin)});
	if(estevan.flags["Cheat"] >= EstevanFlags.Cheat.Triggered) {
		Text.NL();
		Text.Add("You’re… not so sure about that, having some experience with cheating at Cavalcade yourself. Who’s to say that this game isn’t rigged in some way in much the same fashion that you rigged Cale’s game? Still, the only choice is for you to wait for them to finish their break… which could be goodness knows when…", parse);
		Text.NL();
		Text.Add("Decisions, decisions. And you’d better make a good one.", parse);
	}
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "Join in for a hand or two.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“All right, then, I’m out. Give my spot to the newcomer.”</i>", parse);
			Text.NL();
			Text.Add("Hah, so guess he was the one tiring of the game, after all. Well, let’s get this over with. Settling down at the vacated spot by your crate, you eye your opponents, and realize they’re returning the favor by sizing you up as well.", parse);
			Text.NL();
			Text.Add("Oh well; you’d be insulted if they didn’t take you seriously. Let the game begin!", parse);
			Text.Flush();
			//TODO
			
			Gui.NextPrompt(function() {
				Text.Clear();
				DeadDropScenes.Docks.CavalcadePrep();
			});
		}, enabled : party.coin >= coin
	});
	options.push({ nameStr : "No",
		tooltip : "Sit things out and wait for the dockhands to be done.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Well, it’s your call,”</i> comes the reply. <i>“I guess we don’t mind you watching, now that we know you’re not a snitch for the boss, or even worse, the watch. But fair warning - we’ll be a little while, so you might want to make yourself comfortable.”</i>", parse);
			Text.Flush();
			
			Gui.NextPrompt(DeadDropScenes.Docks.CavalcadeLoss);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

DeadDropScenes.Docks.CavalcadeCost = function() {
	return 10; //TODO
}

DeadDropScenes.Docks.CavalcadePrep = function() {
	let player = GAME().player;
	let party : Party = GAME().party;
	
	player.purse  = party;
	var players = [player];
	
	var coin = DeadDropScenes.Docks.CavalcadeCost();
	
	for(var i = 0; i < 3; i++) {
		var dockworker : any = new Entity();
		
		dockworker.name = "Dockworker";
		dockworker.body.DefMale();
		dockworker.purse = { coin: 100 };
		
		players.push(dockworker);
	}
	
	var onEnd = function() {
		var that = this;
		
		var parse : any = {
			playername : player.name
		};
		
		SetGameState(GameState.Event, Gui);
		
		TimeStep({minute: 5});
		
		Text.NL();
		if(that.winner == player) {
			DeadDropScenes.Docks.CavalcadeWin();
		}
		else {
			Text.Add("<i>“Want another try, stranger?”</i> the dealer asks, smiling invitingly.", parse);
			Text.Flush();
			
			//[Sure][Nah]
			var options = new Array();
			options.push({ nameStr : "Sure",
				func : function() {
					Text.NL();
					DeadDropScenes.Docks.CavalcadePrep();
				}, enabled : party.coin >= coin,
				tooltip : "Deal another round!"
			});
			options.push({ nameStr : "Nah",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Don’t worry about it too much,”</i> one of the dockhands tells you, clapping you on the shoulder. <i>“That last one was a pretty decent game. Why don’t you have a seat and wait for us to be done?”</i>", parse);
					Text.Flush();
					
					Gui.NextPrompt(DeadDropScenes.Docks.CavalcadeLoss);
				}, enabled : true,
				tooltip : "Nah, you give."
			});
			Gui.SetButtonsFromList(options, false, null);
		}
	}
	
	var g = new Cavalcade(players, {bet    : coin,
	                                onPost : onEnd});
	g.PrepGame();
	g.NextRound();
}

DeadDropScenes.Docks.CavalcadeWin = function() {
	let outlaws = GAME().outlaws;
	let maria = GAME().maria;

	var parse : any = {
		
	};

	Text.Add("Smiling, you display your winning hand and lay it out on the crate. Right, that’s one win for you - can you please, <i>please</i> have your goods now like what was promised?", parse);
	Text.NL();
	Text.Add("The dockhands look at each other, and for a moment, you wonder if they’re going to renege on their promise. Eventually, they gather their cards and stand up, allowing you access to your precious goods.", parse);
	Text.NL();
	Text.Add("<i>“Yeah, you won fair and square. Go on, take your loot - we’ll find another box to deal on.”</i>", parse);
	Text.NL();
	Text.Add("How nice of them. You scoop up the small crate in your arms; it’s a little weighty, but nothing that you can’t handle on your own. Not even bothering to look back, you stroll away from the docks, past the slums, and right back to the outlaws’ camp, where Maria is waiting for you.", parse);
	Text.NL();
	Text.Add("Did she have to wait long?", parse);
	Text.NL();
	Text.Add("<i>“Not really. I just got back from patrol and need a moment with Zenith. Fancy that you should happen to turn up right now.”</i>", parse);
	Text.NL();
	Text.Add("Well, life is full of coincidences like that. You show Maria the crate and the marking on its corner, and she looks satisfied.", parse);
	Text.NL();
	Text.Add("<i>“Let’s open it up and see what got sent over this time,”</i> she says. <i>“Hopefully, it’s better than the last shipment we had.”</i>", parse);
	Text.Flush();
	
	outlaws.relation.IncreaseStat(30, 2);
	maria.relation.IncreaseStat(50, 2);
	
	TimeStep({hour: 4});
	
	Gui.NextPrompt(DeadDropScenes.Docks.Ending);
}

DeadDropScenes.Docks.CavalcadeLoss = function() {
	var parse : any = {
		
	};

	Text.Clear();
	Text.Add("So be it. You settle down on a nearby stack of sacks and watch the dockhands go at it - dealing, calling, folding, raking in winnings. The whole waiting thing wasn’t a joke, either - you must’ve dozed off, because next thing you know, you’re wakened by one of the dockhands from earlier tapping your shoulder.", parse);
	Text.NL();
	Text.Add("<i>“All right, friend. We’re done - you can go get your precious box.”</i>", parse);
	Text.NL();
	Text.Add("Goodness, how long have you been out of it? Have they really been playing that long, or - oh, it doesn’t matter. Hefting the small crate in your arms, you test its weight and prepare to head back to the outlaw camp.", parse);
	Text.NL();
	Text.Add("By the time you get back, Maria is waiting for you by the map building with her arms folded. <i>“You’re finally back. I was wondering where you’d gotten to.”</i>", parse);
	Text.NL();
	Text.Add("Well, yes, you had -", parse);
	Text.NL();
	Text.Add("She cuts you off with a wave of her hand. <i>“You’re late.”</i>", parse);
	Text.NL();
	Text.Add("Yes, you are, but -", parse);
	Text.NL();
	Text.Add("<i>“You’re late, aren’t you? No doubt you have a perfectly good reason for your tardiness, I’m sure, but that doesn’t change the fact that you’re late. I don’t want to hear it.”</i>", parse);
	Text.NL();
	Text.Add("You open your mouth to protest, but think better of it. Do you really want to explain to Maria that you had to wait for a quartet of dockhands to finish their game of cavalcade before picking up the drop-off? Knowing her, it’d just infuriate her even more.", parse);
	Text.Flush();
	
	TimeStep({hour: 8});
	
	Gui.NextPrompt(DeadDropScenes.Docks.Ending);
}

DeadDropScenes.Docks.GuardInspection = function() {
	let player = GAME().player;
	let outlaws = GAME().outlaws;
	let maria = GAME().maria;

	var parse : any = {
		playername : player.name
	};

	var humanity = player.Humanity();

	Text.Add("The goods in question aren’t hard to find - a quick chat with the harbormaster has you directed to the barge you’re looking for, and another brief conversation with the first mate clears up matters. Seems like you, or at least someone from the outlaws was expected, and the crate in question is at the end of the pier, freshly offloaded and waiting under a tarpaulin for you to come in and collect it.", parse);
	Text.NL();
	Text.Add("Time’s a-wasting, then. Doing your best to keep out of the way of dockhands and stevedores about their business, you make all due haste for what you came for.", parse);
	Text.NL();
	if(humanity < 0.95) {
		Text.Add("Sure, you do get a few odd looks here and there, but morphs are common enough along the docks that no one questions where you’re going, especially since you look and act as if you’ve every right to be heading down the pier. To be honest, most of the stares you’re getting are from the non-humans hauling cargo and working at shipwrighting - just what’s it that’s gotten them so tetchy?", parse);
		Text.NL();
	}
	Text.Add("Yep, there it is all right - that small stack of boxes and crates at the end of the pier. Pulling aside the oilcloth tarpaulin, you easily spot the three-fingered paw printed on one corner of a small, compact crate, and pull it free. Job done, time to -", parse);
	Text.NL();
	Text.Add("- Before you know it, a whisper ripples down the length of the boardwalks and jettys, spoken in hushed tones when it’s voiced aloud at all. Full humans, morphs and people of every stripe in between stare at each other with wide, knowing eyes as they flee for cover. It’s amazing how quickly the waterfront empties of all life - laborers, harbor officials and ships’ officers alike taking cover in the slums, in their craft or in the dockside buildings. Just what’s going on here?", parse);
	Text.NL();
	Text.Add("<i>“Inspection!”</i> Although you don’t hear who said it, the whisper quickly running over where you’re standing. The effect is immediate; the stevedores, already tense, immediately set down their burdens and take cover on the nearest barge or dive straight into the water. As your eyes focus, a group of armed and armored figures come strolling down the boardwalks, their sabatons sounding a steady tap-tap-tap of metal against wood as they march in lockstep.", parse);
	Text.NL();
	Text.Add("Right. Royal guards, an inspection. That makes it all clear now - too bad you’re caught out here in the open, with few places to hide. Doubly so, since you’re here on business that’s not exactly lawful… but how would they know that? Right? Right?", parse);
	Text.NL();
	Text.Add("Still, you’ve to find some way to get out of this bind, and fast. What will you do?", parse);
	Text.Flush();
	
	//[Dive][Walk Past][Hide]
	var options = new Array();
	options.push({ nameStr : "Dive",
		tooltip : "Dive into the lake water. If it’s good enough for the dockhands, it’s good enough for you.",
		func : function() {
			Text.Clear();
			Text.Add("Without thinking twice, you toss the crate aside and ease yourself over the edge and into the lake’s clear water. Since the dock workers are doing it, it can’t be that bad, can it? At the very least, it’s got to be better than being stopped by a bunch of overarmed, pompous prats looking for a shakedown.", parse);
			Text.NL();
			Text.Add("That thought’s quickly quashed as the shock of cold water hits you - the folks here might be used to being dunked into the lake on a regular basis, but you sure aren’t. The chattering of your teeth sounds impossibly loud in your head even as the guards’ heavy footsteps sound out from above you, and you cling to the paling for dear life even as groans and triumphant shouts from above let you know that the pompous prats have found some poor sop to sink their fangs into.", parse);
			Text.NL();
			Text.Add("Brr. How long has it been? Surely it can’t be that long - the guards’ footsteps are only just beginning to fade - but you’re shivering pretty badly. Gah, it seems like forever before they finally leave, and you take your cue from some of the dockhands beneath the pier - the moment they’re out of the water, you follow them with all due haste. They may be fine, but you sure don’t feel so, especially with your drenched clothing.", parse);
			Text.NL();
			Text.Add("Bah… time to get back to the outlaw camp. Hopefully, you’ll be able to find a fire, and a change of clothes. With the Royal Guard gone, the waterfront is steadily becoming abuzz with activity once more, and you scoop up the crate and hurry back as quickly as you can, skirting the slums and heading down the road to the forest. The activity does your frozen limbs some good, and by the time you’re over the drawbridge and through the gates, you don’t feel <i>too</i> terrible anymore.", parse);
			Text.NL();
			Text.Add("<i>“What’ve you gotten yourself into, [playername]? You’re soaking wet. Come with me before you catch a chill, you idiot.”</i>", parse);
			Text.NL();
			Text.Add("Maria’s words pierce your thoughts like an arrowhead, and you nearly drop the crate in your hands. Hey, she shouldn’t sneak up on people like that! It could become a habit or something!", parse);
			Text.NL();
			Text.Add("A sigh. <i>“I didn’t sneak up on you; you were just so out of it that you didn’t hear me coming up. Anyways, let’s get you to a fire and dry you off, then see to that crate. I hope you have some spare clothes, since no one’s going to lend you theirs.”</i>", parse);
			Text.NL();
			Text.Add("Before too long, you’re sitting before a fire pit, and Maria has a merry little blaze going while you warm yourself. Spirits, you can feel life returning to your extremities.", parse);
			Text.NL();
			Text.Add("<i>“Now let’s see what you’ve gotten yourself into that much trouble in order to get for us,”</i> Maria continues. <i>“Hopefully, it’s better than the last shipment that came over.”</i>", parse);
			Text.Flush();
			
			TimeStep({hour: 5});
			
			maria.relation.IncreaseStat(50, 2);
			outlaws.relation.IncreaseStat(30, 2);
			
			player.AddHPFraction(-player.HPLevel() * 0.5);
			
			Gui.NextPrompt(DeadDropScenes.Docks.Ending);
		}, enabled : true
	});
	options.push({ nameStr : "Walk Past",
		tooltip : "Try to mingle with the crowd and hope you don’t get called out.",
		func : function() {
			Text.Clear();
			Text.Add("Quickly dropping the crate and stowing it back with the others, you make to cross the pier at a brisk pace, hoping to join the crowd fleeing along the waterfront. Sure, you’ll be a little behind considering the late start you’ve had, but once you catch up with the flow, you ought to be able to disappear into the slums and hide out until the Royal Guards have gone.", parse);
			Text.NL();
			Text.Add("Keep your head down, don’t look up, slump your shoulders a little, act nonchalant, don’t stand out. Oh, and of course, don’t overdo it, lest you want to make yourself stand out even more than you would’ve were you just being yourself. Or maybe a bit so, since you’re supposed to be a terrified dockworker not wanting to be shaken down for a bit of coin this fine day…", parse);
			Text.NL();
			Text.Add("It’s a fine line to straddle, isn’t it?", parse);
			Text.NL();
			Text.Add("You reach the end of the pier without incident, and move to join the crowd. The guards aren’t too far off now - you can clearly make out the iconography on their uniform - so it’s not one moment too soon, yes.", parse);
			Text.NL();
			if(humanity >= 0.95 || Math.random() < 0.5) {
				Text.Add("Thankfully, it seems like they’ve found another poor soul to torment for the moment, leaving you free to make good on your escape. One of them does peer at you curiously, you notice, but turns his gaze when they begin the shakedown in earnest.", parse);
				Text.NL();
				Text.Add("Yeah, it’s awful that someone’s getting roughed up by a couple of pompous pricks like those, but let’s face it - better someone else than you, right? The last glimpse you have of the sordid scene is the morph they’re shaking down shelling out a few coins by way of a payoff. Not enough, though, since the next thing the guards do is make a beeline for the nearest barge - ship “inspections” are bound to be more profitable, you guess, if a little less exciting than personal ones.", parse);
				Text.NL();
				Text.Add("No time to waste, though. You duck and weave your way through the crowd until you’re sure you’re out of sight, then slip into the edges of the slums to wait for them to pass.", parse);
				Text.NL();
				Text.Add("Eventually, the Royal Guard do leave, presumably having had their fill of bribes and torments. One by one, the population of the docks peer out from beneath cover, slowly emerging back out into the open now that the storm’s passed. The way they go about returning to their business without so much as blinking, you’d imagine being shaken down for bribes was a way of life for them, like bed bugs, rain or hauling heavy objects around.", parse);
				Text.NL();
				Text.Add("Which is probably closer to the truth than you care to think about.", parse);
				Text.NL();
				Text.Add("Not much more you can do around here. Heading back down the pier, you pick up the appointed goods in both arms - it’s a bit heavy, but you manage to make your way back to the outlaws’ without further incident. Maria is waiting by the gates for you, brushing off bits of bark off her cloak - she must’ve come in recently herself - and gives you a nod as you approach.", parse);
				Text.NL();
				Text.Add("<i>“Trouble down by the docks?”</i>", parse);
				Text.NL();
				Text.Add("Of course. Did someone tell her?", parse);
				Text.NL();
				Text.Add("<i>“Got word from one of our ears down there, yes. But even if we didn’t have anyone present, I could’ve guessed. The place was long overdue for another so-called inspection.”</i> She sighs. <i>“Come on, let’s get this thing opened up and see what we’ve gotten for your troubles.”</i>", parse);
				Text.Flush();
				
				maria.relation.IncreaseStat(50, 2);
				outlaws.relation.IncreaseStat(30, 2);
				
				TimeStep({hour: 5});
				
				Gui.NextPrompt(DeadDropScenes.Docks.Ending);
			}
			else {
				Text.Add("Alas, you’re not so fortunate or inconspicuous as you hoped you’d be. While you do your best to remain inconspicuous, you feel a sudden weight on your shoulder just as you’re about to catch up with and slip into the crowd.", parse);
				Text.NL();
				Text.Add("<i>“Running away?”</i>", parse);
				Text.NL();
				Text.Add("You can’t quite see the face beneath the guard’s helmet, but the eyes through the visor tell you all you need to know. Why, no, you weren’t running away, you just remembered that there was a pretty great special on beer down at the Maiden’s Bane, and since you just got off your shift…", parse);
				Text.NL();
				Text.Add("It’s a horrible, transparent excuse, but both you and him know that there’s no reason, no matter how plausible or legitimate, that’s going to get you out of this one. They’ve come to shake folks down and throw their weight about a bit, and that’s what they’re going to do.", parse);
				Text.NL();
				Text.Add("<i>“And do you know why you’ve been stopped, animal?”</i>", parse);
				Text.NL();
				Text.Add("Um, no, you have absolutely no idea. This is going to be good.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				
				scenes.AddEnc(function() {
					Text.Add("<i>“Your clothes are of the wrong fit. They’re deviating too much from actual, proper human styles.”</i>", parse);
					Text.NL();
					Text.Add("Seriously? When was bad fashion a crime? As in, a crime crime? And let’s face it, when was the time you actually last changed your clothes? You don’t actually say it out loud, though - both you and the guard know that it’s utter bullshit.", parse);
					Text.NL();
					Text.Add("<i>“Good thing that this is only a minor offense, so you’ll just have to pay a fine on the spot. That is, if you have the money - else a night in the cells will do just as well, although I’m sure you’d like to avoid that.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“You were loitering along the waterfront.”</i>", parse);
					Text.NL();
					Text.Add("Wait, loitering? You were clearly heading to the Maiden’s Bane -", parse);
					Text.NL();
					Text.Add("<i>“Being a public nuisance as of now.”</i>", parse);
					Text.NL();
					Text.Add("Public nuisance?", parse);
					Text.NL();
					Text.Add("<i>“Disrespecting an officer of the law, and let’s hope I don’t have to add resisting arrest to that list.”</i>", parse);
					Text.NL();
					Text.Add("You get the idea, and shut your trap before you dig yourself ever deeper into this hole.", parse);
					Text.NL();
					Text.Add("<i>“Fortunately for you, I’m in a good mood today and willing to let this slide,”</i> the guard continues, those eyes peering at you from within his visor. <i>“We’ll just make it a small fine, and let things lie as they are, shall we? I’m sure you don’t want any trouble, either.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“You’re on the docks without the appropriate pass.”</i>", parse);
					Text.NL();
					Text.Add("You’re pretty sure one doesn’t need a pass to be on the docks, really -", parse);
					Text.NL();
					Text.Add("<i>“I’m an elite officer of the law, and you’re just a dirty animal,”</i> comes the cool reply. <i>“Who’d be expected to know about the laws coming out of the castle, me or you? So, you don’t have a pass?”</i>", parse);
					Text.NL();
					Text.Add("No, you don’t have one - and because there’s no such thing, although you don’t say that last part out loud.", parse);
					Text.NL();
					Text.Add("<i>“Luckily for you, I’m not exactly in the mood to haul you all the way to the city watch for them to deal with your mangy ass. To be frank, I don’t want to touch one of you, even on a good day, so let’s call it a small fine and be done with it, shall we?”</i>", parse);
				}, 1.0, function() { return true; });
				
				scenes.Get();
				
				Text.NL();
				Text.Add("Grr. While it might be tempting, actually getting into a fight with the Royal Guard here isn’t going to be the best of ideas, and neither is running away. You’re going to have to return here later on  for future drop-offs if nothing else, and you really, <i>really</i> don’t want to end up wanted by this farce that passes for the law in Rigard.", parse);
				Text.NL();
				parse["b"] = outlaws.flags["BullTower"] >= OutlawsFlags.BullTowerQuest.Completed ? ", considering what you got up to at Bull Tower" : "";
				Text.Add("On the other hand, there has to be some way of getting rid of them that doesn’t involve you being taken in for further questioning[b]. Any bright ideas?", parse);
				Text.Flush();
				
				DeadDropScenes.Docks.GuardPrompt();
			}
		}, enabled : true
	});
	options.push({ nameStr : "Hide",
		tooltip : "Find a nice place to hide and be out of it.",
		func : function() {
			Text.Clear();
			Text.Add("From the looks of it, you won’t be able to cross the pier in time to blend in with the fleeing crowd - or at least, not quick enough that you can be sure you can make a clean getaway. Fine, if you’re stuck here, then you might as well make the most of it. The pier is filled with plenty of cargo from river barges waiting to be offloaded to the warehouses or brought on board, and you make a quick decision. ", parse);
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Several casks of vintage wine laid out under a tarpaulin", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("A number of grain sacks, stacked against each other on large pallets", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Numerous boxes of fine cotton cloth lie strewn on the boards where the stevedores dropped them in their haste, and it’s these that", parse);
			}, 1.0, function() { return true; });
			scenes.Get();
			
			Text.Add(" catch your eye. Seeing little recourse, you dive amidst them and cover yourself up as best as you can, hoping that the guards won’t check this particular bit of cargo. It’s a good thing that you came alone, too - having someone else with you might have led to an awkward situation…", parse);
			Text.NL();
			Text.Add("No, now’s not the time for that.", parse);
			Text.NL();
			Text.Add("Huddling against yourself in the cramped confines, you hold your breath as the guards’ footsteps draw ever closer, their armored boots making quite the racket - no doubt intentionally so. Muffled voices resound about you, followed by the occasional raised voice and barked order - seems like you weren’t by far the only one to try and hide from the eye of the law. Hopefully, they’ll be satisfied with whatever poor sops they’ve already caught and won’t investigate further…", parse);
			Text.NL();
			
			var goal = 50;
			var dex = (player.Dex()+player.Int())/2 + Math.random() * 20;
			
			if(GetDEBUG()) {
				Text.Add("DEBUG: (dex+int)/2 check [dex] (vs [goal])", {dex: dex, goal: goal}, 'bold');
				Text.NL();
			}
			
			if(dex >= goal) {
				Text.Add("It can’t be more than a handful of minutes, and yet it feels like hours. Someone shifts a load of heavy objects, and there’s yet more arguing - the guard come close to your hiding spot once or twice, but at least they don’t actually uncover you, which is a big relief.", parse);
				Text.NL();
				Text.Add("At length, their footsteps fade as they retreat back along the pier, but you elect to remain hidden a little while longer until you’re sure they’re gone. Eventually, though, you can’t stand it anymore and burst back out into the open, sucking in sweet lungfuls of fish-scented air. You’re not the only one to do so - by and large, various members of the docks’ populace who manage to evade the Royal Guard’s gaze emerge once more into daylight.", parse);
				Text.NL();
				Text.Add("Well, you’ve wasted enough time here. Without further ado, you grab your prize in both hands - it’s a little weighty, but not actually cumbersome - and book it, skirting the slums until you hit the road and slipping into the forest at the earliest available opportunity. A short stroll later has you waltzing in through the front gates, and when you ask for Maria, the sentries simply direct you to the map building. ", parse);
				Text.NL();
				Text.Add("When you arrive at the place, there’s a small informal meeting of sorts going on between several outlaws, with Maria amongst them. The archer notices you out of the corner of her eye, and excuses herself to greet you.", parse);
				Text.NL();
				Text.Add("<i>“Don’t mind them, got to keep the people on speaking terms with each other,”</i> she says, as if that explains anything. <i>“Well, I see you’re back, and in one piece too. Did you have any trouble?”</i>", parse);
				Text.NL();
				Text.Add("You explain to Maria what went down today at the docks, and she shakes her head. <i>“Trawling for bribes as usual, the bastards. The Royal Guard was never much good, but it’s only gotten worse under Preston.”</i> A sigh. <i>“Well, let’s open this up and see what you brought back, then.”</i>", parse);
				Text.Flush();
				
				TimeStep({hour: 5});
				
				maria.relation.IncreaseStat(50, 3);
				outlaws.relation.IncreaseStat(30, 2);
				
				Gui.NextPrompt(DeadDropScenes.Docks.Ending);
			}
			else {
				Text.Add("Huddled in your hiding spot, you wait with bated breath, hoping that you won’t be uncovered. The guards’ footsteps pass close by more than once as they round up and shake down more than one unfortunate soul, and you think yourself almost safe when there’s a rustling just above you and light floods into your hiding spot.", parse);
				Text.NL();
				Text.Add("<i>“Aha!”</i> the guard who’d uncovered you shouts as he reaches in and hauls you out like a sack of grain, dumping you on the boards. <i>“What do we have here?”</i>", parse);
				Text.NL();
				Text.Add("Shoot, and you were so close, too. Blinking, you quickly rack your mind for any way to get yourself out of this sticky situation. Fighting them won’t work - and it’ll make things even worse, not to mention disrupt business down at the docks. You have to come back here again sometime, after all.", parse);
				Text.NL();
				parse["b"] = GAME().rigard.Krawitz["Q"] >= RigardFlags.KrawitzQ.HeistDone ? ", especially with what happened back at Bull Tower. These two might not know you, but it’s likely that someone on duty back at the cells will" : "";
				Text.Add("What now? You really, really, don’t want to be taken in for questioning[b].", parse);
				Text.NL();
				Text.Add("Happily, the guard offers you an out: <i>“Trying to hide from the long arm of the law, eh, citizen? Well, I’m going to have to take you in for wasting my time. Of course, there’s always the option of paying a small fine…”</i>", parse);
				Text.NL();
				Text.Add("Which will no doubt go into the bastard’s pocket, but at least you’re reasonably sure he’ll let you go if you pay up.", parse);
				Text.Flush();
				
				TimeStep({hour: 1});
				
				DeadDropScenes.Docks.GuardPrompt();
			}
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

DeadDropScenes.Docks.GuardPrompt = function() {
	let player = GAME().player;
	let party : Party = GAME().party;
	let outlaws = GAME().outlaws;
	let maria = GAME().maria;

	var parse : any = {
		
	};

	let humanity = player.Humanity();

	//[Pay][Service][Royals]
	var options = new Array();
	options.push({ nameStr : "Pay",
		tooltip : "Just pay their bloody price and be done with it. Fifteen coins should do it.",
		func : function() {
			party.coin -= 15;
			
			Text.Clear();
			Text.Add("Try as you might, you can’t see an alternative that’s acceptable to you at the moment. Sure, it’ll only encourage them in the future, but for now it’d be just easier to let the guard shake you down and pay his asking price.", parse);
			Text.NL();
			Text.Add("Does it <i>feel</i> good? Most assuredly not, especially when you draw out the coins and tip them into his gauntleted hand, but it’s the fastest and most painless way. How did the saying go again? Bend like a reed?", parse);
			Text.NL();
			Text.Add("The smarmy bastard chuckles as he palms your money. <i>“That’ll do, that’ll do. All right, you’ve paid your fine, you can go now. Move along, nothing to see here.”</i>", parse);
			Text.NL();
			Text.Add("You don’t need telling twice - while the guard has moved onto another victim to rough up and shake down, it’s probably for the best that you don’t linger within sight. Wasting no time, you head back down the pier, pick up the goods and hightail it out of there while the Royal Guards are busy “inspecting” a barge and discovering all manner of goods with improper paperwork.", parse);
			Text.NL();
			Text.Add("From there, it’s a quick trip back past the slums and down the road, and you’re back through the camp gates before too long. Maria is there with a merry band of her own - seems like she’s just returned from patrol herself - and dismisses them before turning her attention to you.", parse);
			Text.NL();
			Text.Add("<i>“Word’s come from our eyes and ears that there was an ‘inspection’ down by the docks. It seems like you made the pick-up just fine, but did you run into any trouble?”</i>", parse);
			Text.NL();
			Text.Add("You did, but you got out of it without too much trouble. Mostly because you capitulated to their demands, but hey, current sacrifices for future gain, right? Or is that just an excuse to soothe your bruised ego?", parse);
			Text.NL();
			Text.Add("<i>“Well, it’s for the best that you’re back in one piece. Operatives are hard to come by. Now, let’s get this thing opened up and see what Rirvale decided to send us this time… hopefully it’s something more useful than sweets.”</i>", parse);
			Text.Flush();
			
			TimeStep({hour: 4, minute: 30});
			
			maria.relation.IncreaseStat(50, 2);
			outlaws.relation.IncreaseStat(30, 2);
			
			Gui.NextPrompt(DeadDropScenes.Docks.Ending);
		}, enabled : party.coin >= 15
	});
	options.push({ nameStr : "Service",
		tooltip : "You may not want to pay or have the money, but there’s certainly something else you can do…",
		func : function() {
			Text.Clear();
			Text.Add("Moments tick by, and the guard’s gaze grows ever stonier as you fail to pony up the expected bribe. <i>“Don’t have the money, eh? Well, good thing the law’s made allowances for those who can’t meet their fines. Maybe a night or two behind bars will change your mind on that.”</i>", parse);
			Text.NL();
			Text.Add("Wait, wait. You didn’t say you weren’t going to pay; you were just wondering if he wouldn’t mind taking the fine in a different fashion.", parse);
			Text.NL();
			Text.Add("<i>“Oh? And what might that be?”</i> Judging from the tone of the royal guard’s voice, though, he probably already knows what you mean, and you can just imagine him sneering underneath that helmet as you explain just exactly how you intend to pay your bribe - you mean, fine.", parse);
			Text.NL();
			parse["m"] = player.Femininity() < 0 ? "man-" : "";
			Text.Add("<i>“Oh, I’ve nothing against it,”</i> comes the reply when you finish speaking. <i>“I’ll want my partner over there watching, though. Make sure you aren’t leading me into an ambush or anything. You don’t mind that, do you, you little [m]slut? Everyone knows that morphs and people who spend too much time with them are incorrigible whores anyway, so you shouldn’t have a problem with it.”</i>", parse);
			Text.NL();
			Text.Add("You’re not exactly in a position to argue, are you? Taking your silence as consent, the guard calls his colleague over and briefly explains the situation with a finger pointed in your direction and a nod. Seems like they aren’t too unused with this sort of situation, either… which, one supposes, says something about them.", parse);
			Text.NL();
			Text.Add("What happens next is a bit of a blur. Taking you between the two of them, the guards frogmarch you over to the edge of the slums, finding a nice, deserted alleyway where you won’t be interrupted.", parse);
			Text.NL();
			Text.Add("<i>“Hey, keep a look out while I handle matters with this little [m]slut, will ya? Wouldn’t want to be unduly interrupted; I’ll repay the favor next time.”</i>", parse);
			Text.NL();
			Text.Add("As the guard’s colleague dutifully turns and keeps an eye on the alley’s opening, the guard grins and quickly unbuckles his belt, pulling apart his leggings and dropping his trousers such that his cock is exposed, already half-hard with anticipation.", parse);
			Text.NL();
			parse["p"] = humanity < 0.95 ? "animal" : "peasant";
			Text.Add("<i>“Down on your knees, [p],”</i> he grunts. <i>“You’d better make this worthwhile, else I might just decide to take you in anyway.”</i> With that, he grabs his shaft and urges it to full hardness with a few strokes of his gloved hands, then steps up to you. <i>“Let this be a lesson in how to properly treat your betters, [p]. Now, open wide and say ah…”</i>", parse);
			Text.NL();
			if(player.SubDom() < -20) {
				Text.Add("Feeling a shiver of arousal run down your spine as you're ordered around, you kneel, open your mouth and obediently await the guard’s cock. Grinning widely at your eagerness to serve, he rubs the tip of his cock against your face, letting you get a good feel of the hot skin and sweaty musk. Then he holds it out for you, at which point you happily slide your lips over his cock and start sucking eagerly.", parse);
				Text.NL();
				
				Sex.Blowjob(player, null);
				player.FuckOral(player.Mouth(), null, 2);
				
				parse["girlboy"] = player.Femininity() > 0 ? "girl" : "boy";
				Text.Add("<i>“Oh yeah,”</i> the young man grunts as you bob up and down on his shaft, <i>“Not too shabby, not too shabby. That's a good [girlboy].”</i>", parse);
				Text.NL();
				Text.Add("With you using your hands to jerk his cock and fondle his balls while you suck him, the royal guard gets treated to a very nice and stimulating blowjob. It's quite clear that he likes your lips and tongue working on his shaft - a lot - judging from all the moans and grunts he's making. In fact, you seem to arouse him so strongly that it doesn't take all that long to drive him over the edge; if he wanted a quickie, well, he’s going to get one all right.", parse);
				Text.NL();
				Text.Add("Grabbing your head in a sudden movement, he pulls you down on his shaft as far as you can take, grunting deeply as the first shot of cum is blasted into the back of your throat and slides down into your stomach. More and more of his seed follows, until you almost choke on it. Soon, you feel that you really need to breathe, and push against his hips to show him to pull out. As he does so, one last spurt of cum shoots directly onto your face, a thick rope of white seed splattering all over your face to drip off your chin.", parse);
				Text.NL();
				Text.Add("<i>“Rub it in, all over your face and chest.”</i> You’re only too happy to oblige the command, smearing yourself with a thin layer of spunk as he chortles at the sight.", parse);
			}
			else {
				Text.Add("Reluctantly, you kneel, open your mouth and sullenly await the guard’s cock. Sure, you might have proposed this, but actually seeing that thing is giving you second thoughts. Grinning widely at your displeasure, the royal guard takes aim, then slaps his cock against your face with one swift movement of his hips. <i>“Oh, having second thoughts? I’ll let you know that attempting to bribe an official of the Crown is a very serious offense, so I’d pipe down if I were you.”</i>", parse);
				Text.NL();
				Text.Add("After a humiliating bit of getting slapped in the face by the guard’s cock, you’re allowed to start sucking. <i>“Oh yeah,”</i> the young man grunts with exaggerated lewdness as you take his shaft into your throat and bob up and down, <i>“Just like that.", parse);
				if(humanity < 0.95)
					Text.Add(" That’s a good slutty animal you are; everyone knows that morphs are shameless sluts. Are you a shameless slut? Well, you have to be, else you wouldn’t be sucking me off.", parse);
				Text.Add("”</i>", parse);
				Text.NL();
				
				Sex.Blowjob(player, null);
				player.FuckOral(player.Mouth(), null, 2);
				
				Text.Add("Having no choice but to do this, you try to get it over with quickly at least. You start to use your hands to jerk and fondle the guard’s cock and balls while you suck him. It's quite clear that he likes your lips and tongue working on his shaft; enough for him not to taunt you any further over your current predicament. In fact, you seem to have such a strong effect on his arousal that it doesn't take all that long to drive him over the edge.", parse);
				Text.NL();
				Text.Add("Grabbing your shoulder to steady himself, he pulls you down on his shaft as far as you can take, the tip of his member poking your tonsils as the first blast of cum is pumped directly into your stomach. More and more of his seed follows, until you’re pretty sure you need to breathe.", parse);
				Text.NL();
				Text.Add("Soon, you feel that you can't take much more, and push against the guard’s hips to extract yourself from this literally sticky situation. As you do so, one last big spurt of cum shoots directly onto your face, splattering your face and chest with thick strands of seed.", parse);
				Text.NL();
				Text.Add("Finally. Surveying you with a satisfied air, the royal guard looks down on your cum-splattered form with a sneer. <i>“Rub it in over your face and chest,”</i> he orders, which you do after a little shrug. He's fed you quite a bit of his cum, so what's a bit rubbed all over you after that?", parse);
			}
			Text.NL();
			Text.Add("<i>”You’re decent at this, I’ll grant you that. All right citizen, your fine’s paid, and we’ll overlook your transgression. Now get lost.”</i> With that, the guard pushes his cum-dripping cock back where it belongs before adjusting his armor and stomping off with his colleague.", parse);
			Text.NL();
			Text.Add("You’re left kneeling in the alley to recover, and when you feel well enough, you head back to the docks to get your goods. The sight of your cum-stained face draws a few curious stares, but the general air you’re getting from the docks’ denizens is one of recognition for taking one for the team and getting the Royal Guard out of their collective hair. At least that’s some small consolation for what you’ve done today…", parse);
			Text.NL();
			Text.Add("Wasting no more time, you pick up the crate and head back, skirting the slums and heading down the road back to the forest. The sentries raise an eyebrow at your current condition, but say nothing as you head to the river and get a quick wash up to make yourself presentable before looking for Maria, crate in tow.", parse);
			Text.NL();
			Text.Add("You eventually find her in the willow grove, applying some kind of resin to the wood of her bow, and she gives you a nod as you sit down beside her and lay out the crate.", parse);
			Text.NL();
			Text.Add("<i>“Heard there was some trouble down by the docks today. Couple of Royal Guards came along trawling for bribes. Took someone offering a quickie to lure them away. Heard anything about it?”</i>", parse);
			Text.NL();
			Text.Add("You did, but it wasn’t important.", parse);
			Text.NL();
			Text.Add("Maria shrugs. <i>“If you say so. Well, at least you’re here with the goods. Let’s see what Rirvale sent this time.”</i>", parse);
			Text.Flush();
			
			TimeStep({hour: 6});
			
			maria.relation.IncreaseStat(50, 2);
			outlaws.relation.IncreaseStat(30, 2);
			
			maria.flags["DD"] |= MariaFlags.DeadDrops.SexedGuards;
			
			Gui.NextPrompt(DeadDropScenes.Docks.Ending);
		}, enabled : true
	});
	if(GAME().rigard.Krawitz["Q"] >= RigardFlags.KrawitzQ.HeistDone) {
		options.push({ nameStr : "Royals",
			tooltip : "You have the Twins’ letter with you, don’t you? Time to turn the tables.",
			func : function() {
				Text.Clear();
				Text.Add("Well, the Royal Guards mean to throw their authority around, don’t they? Maybe they’ll think twice after seeing this. Grimly, you reach into your possessions and draw out your royal pass, opening the envelope and holding out the contents for the bastard to see, although you make sure to keep it out of his reach.", parse);
				Text.NL();
				Text.Add("Why, do they recognize the writing on it, or maybe the seal? Hmm? Hmm?", parse);
				Text.NL();
				Text.Add("All of a sudden, the royal guard before you goes very silent. Raising a hand, he waves his colleague over, and together, the two of them pore over every word written on the paper.", parse);
				Text.NL();
				Text.Add("For a moment, you wonder if the Royal Guards are going to double down and accuse your pass of being a forgery, or maybe if they’ll claim you stole it somehow. Fortunately - more for them, than for you - they decide that it’s probably not worth it to press the issue further, and take off the other way. Not quite at a run, perhaps, but brisk enough that you can tell yourself that you just sent them packing.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Little brats, using the animals as their spies…”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“I can’t believe this, what is the world coming to…”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“The king has <b>got</b> to take those squirts in hand before it’s too late…”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.Get();
				
				Text.Add(" you hear one of them mutter before they round a corner and are gone. Sensing that the threat’s over, the docks’ denizens begin filtering back out into the open from their hiding places. Some of them give you curious looks, but by and large, you notice that a small circle of empty space has formed about you. Dockhands, stevedores and laborers alike make an effort to avoid getting too close to your person.", parse);
				Text.NL();
				Text.Add("Frankly, that suits you just fine. No more time to waste - you head back down the pier, pick up the goods, and are well on your way back to the outlaws’, skirting around the slums and making good time on the roads and forest trails. The gate sentries salute you and bring the drawbridge for you to enter, and then run off to get Maria.", parse);
				Text.NL();
				Text.Add("<i>“Just came back from patrol myself,”</i> the archer greets you as she steps up to you, dismissing the sentries who went to get her. <i>“Although I heard you solved a little situation down by the docks.”</i>", parse);
				Text.NL();
				Text.Add("Well, you were more saving your own skin than anything else - that you convinced the royal guards to beat it was a nice bonus. Glad to have been of service.", parse);
				Text.NL();
				Text.Add("<i>“I’m sure they’re grateful, too.”</i> Maria looks thoughtful a moment, then glances at you. <i>“Come on, let’s open this thing up and see what Rirvale’s seen fit to send over this time.”</i>", parse);
				Text.Flush();
				
				TimeStep({hour: 4});
				
				maria.relation.IncreaseStat(50, 2);
				outlaws.relation.IncreaseStat(30, 2);
			
				maria.flags["DD"] |= MariaFlags.DeadDrops.ShowedRoyal;
				
				Gui.NextPrompt(DeadDropScenes.Docks.Ending);
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

export { DeadDropScenes };
