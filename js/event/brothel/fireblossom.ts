
import { Entity } from '../../entity';
import { Text } from '../../text';
import { Gui } from '../../gui';
import { LucilleFlags } from './lucille-flags';
import { GAME, TimeStep } from '../../GAME';
import { LucilleScenes } from './lucille';

let FireblossomFlags = {
	State : {
		S1Journey   : 0,
		S2DraxenPet : 1,
		S2RakkatPet : 2,
		S2GrexPet   : 3,
	},
	Outset : {
		Draxen       : 0,
		Rakkat       : 1,
		RakkatToGrex : 2,
		Grex         : 3,
	},
	Rakkat : {
		Lover   : 1,
		Seduced : 2,
	},
};

export class Fireblossom extends Entity {
	xariRel : number;
	draxenRel : number;
	rakkatRel : number;
	grexRel : number;
	qinRel : number;

	constructor(storage? : any) {
		super();
		
		this.flags["State"]  = FireblossomFlags.State.S1Journey;
		this.flags["Outset"] = 0;
		this.flags["Rakkat"] = 0; //Bitmask
		
		this.xariRel   = 0;
		this.draxenRel = 0;
		this.rakkatRel = 0;
		this.grexRel   = 0;
		this.qinRel    = 0;
		
		if(storage) this.FromStorage(storage);
	}

	Cost() {
		return 250;
	}
	First() {
		return !(GAME().lucille.flags["Theme"] & LucilleFlags.Themeroom.Fireblossom);
	}
	ResetState() {
		GAME().fireblossom = new Fireblossom();
	}
	//TODO Update as new episodes are added
	ReachedEnd() {
		return this.flags["State"] > FireblossomFlags.State.S1Journey;
	}
	
	
	FromStorage(storage : any) {
		// Load flags
		this.LoadFlags(storage);
		
		this.xariRel = !isNaN(parseInt(storage.xariRel)) ? parseInt(storage.xariRel) : this.xariRel;
		this.draxenRel = !isNaN(parseInt(storage.draxenRel)) ? parseInt(storage.draxenRel) : this.draxenRel;
		this.rakkatRel = !isNaN(parseInt(storage.rakkatRel)) ? parseInt(storage.rakkatRel) : this.rakkatRel;
		this.grexRel = !isNaN(parseInt(storage.grexRel)) ? parseInt(storage.grexRel) : this.grexRel;
		this.qinRel = !isNaN(parseInt(storage.qinRel)) ? parseInt(storage.qinRel) : this.qinRel;
	}
	
	ToStorage() {
		var storage : any = {};
		
		this.SaveFlags(storage);
		
		storage.xariRel   = this.xariRel.toFixed();
		storage.draxenRel = this.draxenRel.toFixed();
		storage.rakkatRel = this.rakkatRel.toFixed();
		storage.grexRel   = this.grexRel.toFixed();
		storage.qinRel    = this.qinRel.toFixed();
		
		return storage;
	}	
}


export namespace FireblossomScenes {
	export function IntroEntryPoint() {
		let player = GAME().player;
		let kiakai = GAME().kiakai;
		let fireblossom = GAME().fireblossom;
		let lucille = GAME().lucille;

		var parse : any = {
			armor : player.ArmorDesc(),
			skin  : player.SkinDesc(),
			name  : kiakai.name,
			heshe : kiakai.heshe()
		};
		
		var first = fireblossom.First();
		
		lucille.flags["Theme"] |= LucilleFlags.Themeroom.Fireblossom;
		
		Text.Clear();
		Text.Add("The chamber beyond the door is sparsely furnished, containing a rack for clothing, a cushioned chair and a large, full-body mirror. There’s a small oil lamp hanging from the ceiling, casting a warm glow on the room. On the walls hang expensive-looking tapestries, showing images of ornate dragons. Drawn on the floor next to the mirror is a complex magic circle.", parse);
		Text.NL();
		if(first) {
			Text.Add("The instructions are simple: remove your clothes and approach the mirror. The room will do the rest. Undonning your [armor], you nervously survey your surroundings. In the dim, flickering light, the dragons on the tapestries almost seem to be moving, their bodies writhing lazily, scales glimmering.", parse);
			Text.NL();
			Text.Add("As soon as you step into the magic circle, a tingle runs through your body. Sparks run across your naked [skin], changing you - or perhaps just your perception of yourself. Once the vertigo of stepping into the body of another has passed, you take a moment to look yourself over. The image is starting to turn a bit blurry, but you can make out the gist of it. Just as the poster promised, your body is that of a young human woman, fair of skin and hair and incredibly beautiful. ", parse);
			if(player.Slut() < 30)
				Text.Add("Your new form seems very pure and delicate, perhaps even innocent, and you almost instinctively cover your breasts.", parse);
			else
				Text.Add("Your new form seems pure and innocent, though you wonder how long that will last. You run your hands over your silken skin, shivering slightly as you brush over your pert nipples.", parse);
			Text.NL();
			Text.Add("It strikes you that were you a foot or so taller and didn’t have these deep blue eyes, you’d be the spitting image of Lady Aria. You idly wonder what [name] would think if [heshe] saw you now…", parse);
			Text.NL();
			Text.Add("Taking a look around, the magic seems to have changed more than your appearance. The chair is still there, but your [armor] have been replaced by a white silken shift, and the door through which you entered is nowhere in sight. Slightly worried by this strange limbo, you nevertheless don the white robe and step back to the mirror, which has turned into a murky portal, beckoning you closer.", parse);
			Text.NL();
			Text.Add("Taking a deep breath, you step through, entering not just the body but also the mind of the fair maiden Fireblossom...", parse);
			Text.Flush();
			
			Gui.NextPrompt(FireblossomScenes.SceneSelect);
		}
		else {
			Text.Add("You remove your [armor] and step into the magic circle, activating the spell that puts you inside the body of Fireblossom. She - you - is beautiful as always. Donning the white shift, you walk over to the mirror, its murky depths ready to take you into the lands of the dragon empire. The spell seems almost welcoming, recognizing someone who’s used it before and altering the world accordingly.", parse);
			Text.NL();
			Text.Add("On the top of the mirror, there’s a tiny, faintly glowing gemstone inlaid in the border. Next to it, you can see the words <i>‘Begin Anew’</i> engraved in stylized letters. It seems that you can use this to restart your experience from the beginning. Alternatively, you could just step through the mirror and continue where you last left off.", parse);
			Text.Flush();
			
			//[Enter][Reset]
			var options = new Array();
			options.push({ nameStr : "Enter",
				tooltip : "Continue exploring Fireblossom’s world from where you left off.",
				func : function() {
					Text.Clear();
					Gui.PrintDefaultOptions();
				}, enabled : !fireblossom.ReachedEnd()
			});
			options.push({ nameStr : "Reset",
				tooltip : "Start over from the beginning. Now that you’ve seen part of it, perhaps you’ll act differently this time around.",
				func : function() {
					fireblossom.ResetState();
					
					Text.Clear();
					Text.Add("You press the glowing gemstone with your delicate finger, and there’s a sudden swirl of activity in the mirror as the lands beyond rearrange themselves, the spell returning to its original form. Perhaps this time you’ll act a different way.", parse);
					Text.NL();
					Gui.PrintDefaultOptions();
				}, enabled : true
			});
			
			Gui.Callstack.push(function() {
				Text.Add("You resolutely step through the mirror, entering the body and mind of Fireblossom. You wonder what you’ll experience, and shiver in anticipation...", parse);
				Text.Flush();
				
				Gui.NextPrompt(FireblossomScenes.SceneSelect);
			});
			
			Gui.SetButtonsFromList(options, false, null);
		}
	}

	export function SceneSelect() {
		let fireblossom = GAME().fireblossom;
		switch(fireblossom.flags["State"]) {
			default:
			case FireblossomFlags.State.S1Journey: FireblossomScenes.S1TheJourney(); break;
			//TODO new scenes
		}
	}

	export function Outro() {
		let player = GAME().player;
		let fireblossom = GAME().fireblossom;
		var parse : any = {
			armor : player.ArmorDesc()
		};
		
		Text.Clear();
		Text.Add("When you open your eyes again, you’re back in the Shadow Lady. For a moment, you feel unfamiliar with your own body, but the feeling quickly passes. After you’ve rested for a bit on the chair, pondering your experiences, you redon your [armor] and exit the room, heading back to the main area.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			TimeStep({hour: 3});
			LucilleScenes.WhoreAftermath(null, fireblossom.Cost());
		});
	}

	export function S1TheJourney() {
		let player = GAME().player;
		let fireblossom = GAME().fireblossom;
		var parse : any = {
			
		};
		
		Text.Clear();
		Text.Add("You gradually come to, wincing as the carriage goes over another bump in the road. Sure, it makes sense for beings who can fly to not care about proper paving, but it still irks you, as if the fact were a personal affront. Not even the plush cushions strewn throughout your cabin are enough to completely shield you from the uncomfortable ride. If only you’d arrive soon…", parse);
		Text.NL();
		Text.Add("Looking around, you see that you’ve overslept again, as your maid Qin is already up and about, folding clothes in a chest. You take a moment to study the creature - unlike you, she’s not human. Though until recently you’ve never seen someone like her, you were aware that creatures such as Qin serve the dragons. The kobold is perhaps four foot tall, her body covered in tiny bronze scales, ridges sticking up over her eyes. You’ve heard the guards in your entourage call her a pretty little thing, though for the life of you, you can’t see why. If anything, she looks like an oversized lizard walking around on two legs. You idly wonder if the fabled dragons that conquered your lands are more like this creature or like the bestial brutes that form your honor guard. Probably the latter.", parse);
		Text.NL();
		Text.Add("As you sniff to yourself, Qin makes a small startled jump, hurrying to help you with your clothes and hair. She seems more tired than usual, and you have to admonish her several times when she combs out a snag from your golden hair too roughly. The kobold doesn’t share your quarters - through from what you’ve overheard around the campfires, she’s shared pretty much everyone else’s. You blush faintly. It’s really not becoming of you to be thinking of things like that… though you can’t help but feel a morbid curiosity about it. For the sake of the country, your father has safeguarded you from temptation during your eighteen years of life, but you still have a general understanding of how these things work. How the tiny kobold can even walk around if she shares the bedrolls of the hulking drakes is a mystery to you. A naughty, enthralling mystery. Mayhaps you ought to ask her about it some time.", parse);
		Text.NL();
		Text.Add("Using a small stepping ladder, the kobold helps you adjust your white dress - fine craftsmanship from your home country, spun from the most elegant drider silk that can be bought. It’s one of your most prized possessions, one of the precious few you had the opportunity to bring with you on this journey. It is your armor. In it, you can face the strange and wild lands of the dragons. Finally, you don a necklace of pearls, studying yourself closely in the mirror while Qin makes the bed. Yes. A proper princess.", parse);
		Text.NL();
		Text.Add("Resigning yourself to another boring day, you sit down by the carriage window, peeking out through the curtains and watching the hills roll by. Sighing, you once again wonder why you are here, why you had to leave your home, your mother and father, your brothers. A familiar lump forms in your throat, but you fight it back down. No! You are the princess, daughter of King Cecil of Galenta. You may be alone in strange lands, but crying does not befit you.", parse);
		Text.NL();
		Text.Add("King Cecil the Burned, they call him now, you bitterly remind yourself. The king who bent the knee to the conquering armies of the dragons and their vassals. As if to drive the point home, one of the drakes lumbers by outside the window.", parse);
		Text.NL();
		Text.Add("Unlike tiny Qin, the hulking beast stands over nine feet tall and fifteen feet from chest to tail, brimming with muscle. His scaly hide is thick - so thick that you wonder why he even bothers carrying armor over it. Like your other guardians, he walks on four feet, with two additional arms attached to a humanoid upper body. This particular one has an ugly scar running over one eye, and a huge glaive slung across his back. Noticing you observing him, he turns his head and grins at you wickedly, dozens of sharp teeth flashing from his inhuman maw. You don’t like this one, you’re sure of that. He guffaws to himself as you retreat back behind the curtains, not wishing to see more of him.", parse);
		Text.NL();
		Text.Add("After Qin has brought you your breakfast, you’re allowed a short period outside as the caravan pauses. While you recline, the drakes water the hulking Rakhs that draw the carriages. The four-legged slow-but-strong lizards are even more bestial than the drakes, though you suspect that they share some common heritage. You glance at the scarred drake, who’s sharing some rowdy story with his comrades, roaring with guttural laughter. Perhaps the same mother.", parse);
		Text.NL();
		Text.Add("The rest of the day passes uneventfully until you stop for the night. As you sit by the fire with the other Galentans, Qin brings you your meal - another serving of stringy, overly spiced meat stew. You beg the Spirits for this forsaken journey to finally be over so you can have some proper food again. It’d also be nice if the roads were smoother, so your bum wouldn’t have to be so sore all the time. At least you don’t have to ride. You begin your ritual evening dance of trying to glean some sort of information from ambassador Herod, but he’s just as evasive as ever. Sure, you understand that you are here on an important diplomatic mission, but not even father has told you what you’re actually supposed to <i>do</i>. Your brooding frustration is intruded upon as Qin lets out a small yelp when the scarred drake sweeps her up in his arms.", parse);
		Text.NL();
		Text.Add("<i>“Be a good girl and say goodnight to the princess,”</i> he growls, his fingers digging their way in under the kobold’s skirts.", parse);
		Text.NL();
		Text.Add("<i>“Y-yes, Grex,”</i> she squeaks. <i>“G-goodnight, princess.”</i> You turn your gaze away, trying to hide your blush as the brute makes off with his prize for the night. Barbarians and beasts. The other Galentans avoid your accusing eyes, and you stomp off to your own carriage, trying to ignore the animalistic noises coming from just beyond the clearing. Something like this would never happen at home.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("A few days’ travel later, the land around you begins to change. You’ve travelled beyond the mountains encircling your father’s kingdom - impenetrable walls that had protected Galenta from invaders for centuries, but proved useless against foes that could fly. After that, weeks across strange hills and forests, stopping in towns where people spoke strange languages, or were more animal than human.", parse);
			Text.NL();
			Text.Add("The hills give way to rolling plains, where animals you’ve never even heard of before graze. For the last few days, you’ve spied an impossibly huge tree outlined against the horizon, growing in size each day as you draw nearer. From what the campfire gossip says, your destination is a sprawling city a mere day away; the regional capital where the Imperial Envoy of the dragon empress resides. As to why you’re going there, despite your nightly efforts, you’re still none the wiser.", parse);
			Text.NL();
			Text.Add("The trip through the city is, if anything, even stranger than the rest of the journey. At least here the roads are paved, but they’re lined with houses that look like nothing you’ve ever seen. Strange, multitiered buildings painted in all the colors of the rainbow, though the main theme seems to be blue. Motifs of dragons are everywhere; one crawling up every pillar, one cresting every roof. Day and night, the city is ablaze with lights; everything from tiny lanterns to huge roaring bonfires whose flames reach for the skies.", parse);
			Text.NL();
			Text.Add("And the people. Though lizans and kobolds seem to be the predominant population, there are men and women of every race you’ve ever seen and more, all packed together tightly into a city that must house millions. The air is heavy with smoke, spicy fumes and the roaring of the crowds. High above, a huge palace rears dozens of stories high, easily dwarfing your own home. Even as cosmopolitan as you consider yourself - you’ve seen plenty of foreign dignitaries at the castle, after all - this place is still overwhelming, and you retreat back behind your curtains, brooding.", parse);
			Text.NL();
			Text.Add("Guarded by your retinue of drakes, your procession makes its way up to the palace. Despite being a princess, you feel pretty small in this giant city that could swallow Galenta whole without pause. Rather than the parade you had anticipated when father approached you about going to the regional capital for a diplomatic mission, your arrival causes barely a stir among the tumultuous multitudes clogging the streets.", parse);
			Text.NL();
			Text.Add("Qin has been busy flustering around you the entire time, making sure your dress is without blemish and your hair perfectly arranged. For the tenth time in half an hour, you irritably wave the kobold off, adjusting your necklace and peering up at the towering palace. The carriage halts just inside the huge gates, and Qin urges you to come outside. Finally, you’ve arrived.", parse);
			Text.NL();
			Text.Add("Ambassador Herod and the other Galentans are just as wide eyed as you, and you cluster together as you are led toward the main building over a large courtyard lined with what you first believe are statues, but eventually realize are more armored drakes, standing guard in motionless silence. Banners of the dragon empire hang all over the place; a blazing red flame on a field of gold.", parse);
			Text.NL();
			Text.Add("The banners of conquerors.", parse);
			Text.NL();
			Text.Add("Your party is unceremoniously ushered into the palace. Into a side entrance, in fact, which puzzles you. Surely there should be more fanfare to announce your arrival? Your escort is replaced by lizans dressed in a courtly manner. At least you don’t have to look at Grex and his stupid smile anymore.", parse);
			Text.NL();
			Text.Add("<i>“This way, my lady,”</i> Qin murmurs, leading you into a lavishly furnished room. Dozens of extravagant dresses line the walls, and there are what seems like hundreds of small jars with powders and creams of all sorts.", parse);
			Text.NL();
			Text.Add("<i>“Good work, girl. You may leave.”</i> The sharp voice that comes from behind you is one that is used to command, so much so that you almost instinctively shirk back, its tones of authority reminding you of your mother, the queen. Its owner is a female lizan, probably in her thirties, her tight but professional dress and curt mannerisms all proclaiming ‘head maid’.", parse);
			Text.NL();
			Text.Add("<i>“Yes, mistress Xari.”</i> Qin gives a small curtsy and backs out of the room, leaving you alone with the intimidating reptile. You pull yourself together, straightening your back and preparing to-", parse);
			Text.NL();
			Text.Add("<i>“Not too bad, not too bad.”</i> The lizan clicks her tongue as she looks you up and down. <i>“The dress won’t do, of course, but that won’t be a problem.”</i> She tilts her head to the side. <i>“Yes, good stock.”</i>", parse);
			Text.NL();
			Text.Add("<i>Stock?!</i>", parse);
			Text.NL();
			Text.Add("<i>“No lip, girl. The Imperial Envoy is waiting, and you do not want to keep him waiting,”</i> she continues briskly. <i>“The little one may have done what she could, but we must wash the grime of the road off you. A bath has been prepared. Now, strip.”</i>", parse);
			Text.NL();
			Text.Add("You fume over her tone, but can’t deny that you’ve been dreaming of a bath these long weeks and months on the road. Just beyond a beaded curtain, you can see a stone basin full of steaming hot water, enticing you. It’s a bit of a struggle trying to get out of the dress by yourself, but the lizan matron finally clicks her tongue irritably and helps you, her hands expertly undoing the complex lacing. You deposit your shift and jewelry on a nearby table and step down into the hot water, sighing as the tightly wound knots in your body - part rough travel and part anxiety - slowly loosen up.", parse);
			Text.NL();
			Text.Add("There’s a rustle and a small splash as the lizan maid undresses and drops into the bath with you, settling a tray of oils, bath salts and ointments. You raise your eyebrow quizzically, about to call her out on her rude interruption, but she’s not about to be argued with.", parse);
			Text.NL();
			Text.Add("<i>“You can relax later, should the Envoy so please,”</i> she tuts. <i>“Now, you must be bathed.”</i> Without waiting for your approval, she pours a soapy mixture into the bath, raising a multitude of bubbles that slowly rise into the air.", parse);
			Text.NL();
			Text.Add("<i>“Turn around and lean against the edge,”</i> Xari instructs, pointing you to a deeper end of the pool. The water there is deep enough that you can stand on your knees and still be mostly submerged in water. It doesn’t seem to be worth it arguing with this one, so you do as she says, leaning on your elbows while she works the mixture into your hair. By the Spirits, how you’ve missed this…", parse);
			Text.NL();
			Text.Add("You yelp as you feel the nude, scaly body of the maid press against your back as she works your limbs washing off the dirt of the road. It’s not the first time you’ve shared a bath with someone, but your handmaidens and lady friends were never this… forward. The lizan is all business, and she doesn’t shirk from oiling up your entire body, working from your feet up. A shudder runs through you as you feel her hand slide up the inside of your thighs; surely she doesn’t-", parse);
			Text.NL();
			Text.Add("This time, your yelp is more of a moan. Without pausing, the maid lathers up the inside of your legs, intruding on your most intimate spots. When you try to protest, she just mutters <i>“don’t be such a baby,”</i> continuing her thorough ministrations unperturbed.", parse);
			Text.NL();
			Text.Add("Next up are your breasts, which receive the same rough lathering. Xari thoughtfully weighs them in her hands, sizing you up. <i>“Just like I thought, good stock,”</i> she murmurs into your ear. <i>“I’d say that I have just the dress for you… of course, you will need a new one when you start producing milk and grow.”</i> You feel her hand trail down your side, resting on your hip, the other squeezing your breast.", parse);
			Text.NL();
			Text.Add("Wait. Milk? What?", parse);
			Text.NL();
			Text.Add("<i>“Good hips too… From what I hear, you are a virgin, yes?”</i> She throws the comment out matter-of-factly. <i>“The Envoy will be pleased, I believe.”</i>", parse);
			Text.Flush();
			
			//[Protest][Don’t][Encourage]
			var options = new Array();
			options.push({ nameStr : "Protest",
				tooltip : "Give this grabby maid a harsh telling off. She clearly doesn’t know her place!",
				func : function() {
					Text.Clear();
					Text.Add("Now <i>this</i> is going too far! Who does she think she is!?", parse);
					Text.NL();
					Text.Add("Fuming, you round on the lizan, rising to your feet to tower over her, soapy water dripping from you. In no uncertain terms, you tell her that she’s overstepped her position; you are a <i>princess</i>, you’ll have her know, and she should treat you as such. Who is she to ask these questions, and for what reason?", parse);
					Text.NL();
					Text.Add("Xari allows the waves of your words to wash over her, unimpressed by your certainly imposing voice. <i>“Princess or not, you are the guest of the Envoy, and for this I must prepare you. I am simply doing my job,”</i> she replies, unconcerned.", parse);
					Text.NL();
					Text.Add("Well, the Envoy is sure to hear about <i>this</i> incident, that’s for sure.", parse);
					Text.NL();
					Text.Add("<i>“Is that so? You’ll tell the Envoy in front of his court that Xari touched you in a bad place? You are more childish than I thought. For what reason do you think you are here, girl?”</i>", parse);
					Text.NL();
					Text.Add("What is that supposed to mean?", parse);
					Text.NL();
					Text.Add("<i>“Silly girl, you’ve yet to learn the ways of the world,”</i> the lizan tuts, shaking her head. <i>“In the right company, a princess is no more than an ant. You would do well to remember where you are before blurting such things. No one listens to an indignant ant.”</i>", parse);
					Text.NL();
					Text.Add("Why you-", parse);
					Text.NL();
					Text.Add("<i>“I’m thinking you’ll want to have words over this later, no matter how unwise that would be on your part, but for now, compose yourself. If you want to be treated like a princess, act like one.”</i> Xari shakes her head. <i>“I must know your measures in order to pick the dress, and you are not the first I’ve asked if she’s a virgin; I’ve posed the question to princesses and queens alike. Depending on the answer, I shall pick out a different dress. It is tradition,”</i> she adds.", parse);
					Text.NL();
					Text.Add("You give her an exasperated sigh, but it seems like she’s going to be stubborn about this. Begrudgingly, you nod.", parse);
					Text.NL();
					Text.Add("<i>“Good, good.”</i> She nods to herself, satisfied at her skills of observation. <i>“I think I know just the one.”</i>", parse);
					Text.NL();
					
					player.subDom.IncreaseStat(10, 1);
					fireblossom.xariRel--;
					
					Gui.PrintDefaultOptions();
				}, enabled : true
			});
			options.push({ nameStr : "Don’t",
				tooltip : "Stifle your protests. She might be a bit grabby, but she’s good with her hands.",
				func : function() {
					Text.Clear();
					Text.Add("You glower, but nod faintly.", parse);
					Text.NL();
					Text.Add("<i>“Good, I thought as much. I shall prepare a dress befitting a maiden, according to our traditions.”</i>", parse);
					Text.NL();
					Text.Add("You wonder what traditions those might be… Xari keeps working your body, loosening knots that you didn’t even know were there. She seems slightly fascinated by your smooth, fair skin, continuing to be quite intimate with you, though she thankfully doesn’t put her hands between your legs again. You can’t deny that what she does feels good… as did her more intimate touches. It does serve to make you very confused though. You didn’t lie; you’ve never been with a man, and you’ve certainly never been with a woman. Finally, she seems satisfied with your bath, instructing you to rise up.", parse);
					Text.NL();
					Text.Add("<i>“First, we’ll arrange your hair, then pick out the dress, yes?”</i>", parse);
					Text.NL();
					
					player.slut.IncreaseStat(25, 1);
					player.subDom.DecreaseStat(0, 1);
					
					Gui.PrintDefaultOptions();
				}, enabled : true
			});
			options.push({ nameStr : "Encourage",
				tooltip : "That thing she did… can she do it again?",
				func : function() {
					Text.Clear();
					Text.Add("You grudgingly admit that you’ve indeed never lain with a man. Nor a woman, you add, cheeks flushed, not quite sure what’s gotten over you. There’s a slight change in Xari’s movements; slight, but oh so noticeable to your sensitive skin. You shiver, biting your lip as you once again feel her fingers trailing lower down across your stomach to that most secret of spots, her other hand fondling your breast.", parse);
					Text.NL();
					Text.Add("<i>“How come you have never experienced such things?”</i> the lizan maid teases, pretending to lather you up but drawing closer and closer to your tingling crotch. <i>“Surely you have bathed with ladies in your court before. Surely Qin offered to… aid you in this matter?”</i>", parse);
					Text.NL();
					Text.Add("Your cheeks grow even redder as your thoughts go back to that first night in the caravan. For the kobold to be asking such a thing, and mere hours since they’d met! Since that day, you didn’t allow Qin to sleep in your carriage. The maid found other places to sleep, though you feel a slight twinge of guilt over the matter.", parse);
					Text.NL();
					Text.Add("You mutter something about the ways of Galenta not being quite this… free about things. You stifle another moan as Xari’s fingers find their way inside your folds, probing a highly sensitive spot.", parse);
					Text.NL();
					Text.Add("<i>“This is fine, I’m sure you’ll find many teachers willing to assist in giving you some overdue lessons. Maybe you’ll even ask Qin for her services.”</i> This time, you can’t hold back the moan. Something strange is building up inside your body, stirred to life by the lizan’s skillful fingers. Xari’s voice comes as through a fog.", parse);
					Text.NL();
					Text.Add("<i>“...Sadly, I cannot be such a teacher. Not today.”</i> You feel a bit aggravated as she reluctantly removes her probing fingers, opting to instead finish her lathering. <i>“You came here an innocent, and the Envoy would wish you to remain so for a while longer… If you still retain these thoughts when that is no longer so, perhaps we will talk again?”</i>", parse);
					Text.NL();
					Text.Add("You’re puzzled by why the Envoy would care about this matter.", parse);
					Text.NL();
					Text.Add("<i>“A maiden’s dress is different from that of a woman deflowered; thus is our tradition. We shall pick you a beautiful one that will please the Envoy.”</i>", parse);
					Text.NL();
					
					player.slut.IncreaseStat(50, 2);
					player.subDom.DecreaseStat(-50, 2);
					
					fireblossom.xariRel++;
					
					Gui.PrintDefaultOptions();
				}, enabled : true
			});
			
			Gui.Callstack.push(function() {
				Text.Add("You don’t need a new dress, you protest. You’ve brought your own from Galenta, and a fine one at that!", parse);
				Text.NL();
				Text.Add("<i>“A bit provincial… no, it will not do.”</i> Xari shakes her head, clicking her tongue in disapproval while she towels you dry. <i>“The fabric is fine, but the style simply will not do. Perhaps if you stay here in the palace, I’ll adjust its cut to something more befitting. Now, this way.”</i> The bossy maid gestures for you to take a seat in front of a mirror, pulling out several combs and scissors.", parse);
				Text.NL();
				Text.Add("Glancing around for your clothes, you don’t see them anywhere. Giving up, you settle down and pout, letting her dry and comb your hair. It probably needed a few touches anyways; Qin did what she could, but her tools were limited. You lean back, appraising yourself in the mirror. You find that the bath has definitely improved your appearance; your skin has regained its smoothness thanks to the almost magical oils that Xari applied, and your hair is an even deeper gold than usual.", parse);
				Text.NL();
				Text.Add("“Touched by the Lady”, they called it in Galenta, in respects to your similarity to the Lady Aria. Even for a princess, being compared to a Goddess is rather high praise, but in your case, everyone agrees that it is warranted. You’re not only princess of Galenta; you also happen to be the most beautiful woman inside her borders. You idly wonder if the dragon empress prays to the Lady for guidance as well.", parse);
				Text.NL();
				Text.Add("Xari is rather talkative as she works, and now that you’ve resigned yourself to listening, what she says worries you a bit. <i>“Such beautiful curls,”</i> she compliments you. <i>“There was a girl like you before, only she had raven hair. Shorter than this, but the same curls. For a while, she was Envoy Draxen’s favorite. This may bode well for you. Your eyes, too. They are blue like him.”</i>", parse);
				Text.NL();
				Text.Add("Draxen. It’s not the first time you hear his name, but being reminded of it brings you back to your current situation. Despite the invasion, you’ve only seen a real dragon once, and that from a great distance, afloat in the skies. About to come face to face with one, you can’t deny the nervous flutter in your stomach... and just what does she mean? Ah… how you wish you could just go home again and forget all this strange nonsense.", parse);
				Text.NL();
				Text.Add("Any such thoughts are washed away when Xari brings out your new dress. Compared to your stately, but by Galentan measures rather daring dress, this is in a different category altogether. The cloth is fine azure silk covered in intricate patterns. The dress looks like a great serpentine dragon swirling around your body, hugging you tightly. Even if it reaches down to your feet, the pattern has many gaps in it, leaving very little to the imagination, especially since the maid hasn’t provided you with any undergarments. There’s a large diagonal gash across your chest, revealing pretty much everything but your nipples. The left side of your leg is bared up to your hip. You look yourself over in the mirror, blushing fiercely. Back home, merely whispering about a dress such as this would be scandalous.", parse);
				Text.NL();
				Text.Add("Still, you can’t deny that it is a striking and beautiful piece of clothing. No one would dare look the other way while you wear this thing.", parse);
				Text.NL();
				Text.Add("And what of your pearl necklace? <i>“I’m sure the Envoy will give you a new one, should he so please.”</i> There’s a slight smile playing on the lizan’s lips. <i>“For now, I will hold on to your old one, along with the white dress.”</i> She gives you a few last touches, applying some creams and powders to your skin.", parse);
				Text.NL();
				Text.Add("<i>“Now, you must go. Envoy Draxen awaits.”</i>", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("Outside, Qin is waiting for you.", parse);
					Text.NL();
					Text.Add("<i>“Y-you look stunning, my lady,”</i> the kobold praises you, a faint blush on her cheeks. From her lower vantage point, she can see quite a bit more than the typical observer, you realize. You mutter something to yourself, trying to suppress your embarrassment and regain your composure.", parse);
					Text.NL();
					Text.Add("The tiny kobold seems to have tidied herself up during your bath, and is now wearing a much more colorful dress than she did on the trip here. The same azure blue as yours, you notice, if not nearly as extravagant.", parse);
					Text.NL();
					Text.Add("<i>“This way. Envoy Draxen and your companions are waiting.”</i> Qin ushers you along the corridor, heading deeper into the palace. The smooth stone is cold against your bare feet, but you soldier on. You came here for a diplomatic meeting, so you will face it with pride. They may have taken your armor, but you still have to face your foe in battle.", parse);
					Text.NL();
					Text.Add("You and Qin are joined by two drakes when you enter the main passageway - a lavish corridor at least fifty feet wide and a hundred feet high, lit by roaring plumes of flame - and with some distaste you notice that one of them is Grex. The brute flashes you one of his toothy smiles, eyeing your new dress with apparent approval, but keeps his comments to himself. After the brutal encounter with Xari, you’re happy with any bit of respect, from whomever it comes.", parse);
					Text.NL();
					Text.Add("At the end of the gigantic hallway is a huge double door inlaid with twin golden dragons, their eyes the largest sapphires you’ve ever seen - each one easily as big as your fist. Two more armed drakes stand guard beside the doors, which they pull open as you approach. Beyond is a vast garden, a courtyard abundant with strange plants and animals. Far above, you can see the open sky, framed by at least ten stories of palace. From here, similar doors lead back into the building in every cardinal direction.", parse);
					Text.NL();
					Text.Add("Grex and Qin lead you to the ones directly opposite those you came in through. You pass through another long corridor, and by the time you reach Envoy Draxen’s actual throne room, your feet are starting to hurt a little. Both drake and kobold seem unperturbed. You enter the biggest chamber yet, a hall so big in both height and area that there are multiple rows of massive pillars along its length to keep the roof in place. Motionless drakes in ceremonial armor stand at attention between the pillars, ready to serve their master’s will. Qin gives you a gentle push to get you going again. So beyond your experiences is this that your determination is all but shattered. Is Galenta truly so small?", parse);
					Text.NL();
					Text.Add("Farther ahead, you see a raised dais where a few people are lounging on couches, discussing something. There’s a cloud of spicy incense floating in the air, further adding to the strangeness of the situation. They fall silent as you approach, and you notice a slight tension in the air. Ambassador Herod is there, as well as a few lizan nobles, but the undoubted center of attention is the man sitting on the edge of what looks like an enormous pillow, watching you with interest.", parse);
					Text.NL();
					Text.Add("There’s something about the man… a presence of sorts. It’s not merely his appearance, though he’s definitely imposing, with his exotic dark hair and striking figure. There’s something in the way he holds himself… something that naturally demands respect. He may look human, but you’ve been warned about the glamours of dragons. One thing's for sure, those swirling, mesmerizing azure eyes belong to no mortal. He radiates something; you feel a deep sense of… it’s confusing. A mixture of love, fear and adoration, all bunched up in a confused ball. From the moment you lay eyes on him, you can see nothing else… and you feel small and humble. As if by reflex, you fall to your knees, and you sense your companions doing the same. If this man isn’t the Imperial Envoy, the dragon Draxen, then you don’t know what he is. Perhaps one of the Spirits incarnate.", parse);
					Text.NL();
					Text.Add("<i>“A very pleasing gift, ambassador,”</i> the dragon speaks, his soft voice emanating through the chamber. <i>“Daughter of Cecil the Burned, is she not?”</i> He turns to one of the lizans standing at attention nearby. <i>“What do you think, Rakkat? Is it not wonderful that such beauty can rise from war? That even in the burned fields of Galenta, this fair flower may blossom?”</i> He muses to himself. <i>“Yes… I shall call you Fireblossom.”</i>", parse);
					Text.NL();
					Text.Add("It takes a while before understanding sets in - it is difficult to focus in Draxen’s presence - but when it does, it hits you like a rock. How could you have been so blind? All the evasive answers, this faux dress-up to make you pretty… this is indeed a diplomatic mission, but you are not the dignitary. You are the tribute. The slightly guilty look on ambassador Herod’s face confirms your unvoiced suspicion: you are here to be sold.", parse);
					Text.NL();
					Text.Add("You bite back a snappy reply, taking a moment to think over your situation, the vastness of the room pressing down on you. Here, a hundred miles from home, you have no allies. Herod and the others clearly have showed their intent - they are not to be trusted. You doubt that a single one of the multitude of drakes or the lizan nobles would lift a finger in your aid. ", parse);
					if(fireblossom.xariRel > 0)
						Text.Add("The only two people who’ve shown you any sort of kindness in this strange land is the kobold by your side, Qin, and the sultry lizan, Xari. Completely useless friendships. Even if they’d feel inclined to help you, they have no sway over anything here.", parse);
					else
						Text.Add("The only person who’ve shown you any form of kindness in this strange land is your maid Qin, but she has no power at all here.", parse);
					Text.NL();
					Text.Add("No, you are on your own.", parse);
					Text.NL();
					Text.Add("<i>“Rise, Fireblossom,”</i> Draxen intones, and you instinctively pull yourself to your feet, your own body betraying you in its willingness to serve the dragon lord. That is not even your name… but that matters little at this point. <i>“From your conflicting emotions, I can see that you were not informed of why you came here. Rest assured that I’ll be a kind master, and that I won’t be ungrateful if you serve me well.”</i>", parse);
					Text.NL();
					Text.Add("Everyone is waiting for you to speak, but concentrating is so difficult with the dragon’s gaze burning into you. What do you do?", parse);
					Text.Flush();
					
					//[Give in][Scheme][Protest]
					var options = new Array();
					options.push({ nameStr : "Give in",
						tooltip : "It’s no use, you can’t fight him.",
						func : function() {
							fireblossom.flags["Outset"] = FireblossomFlags.Outset.Draxen;
							
							FireblossomScenes.S1Draxen();
						}, enabled : true
					});
					options.push({ nameStr : "Scheme",
						tooltip : "You can’t fight back openly, not here and now - you can’t even think straight in Draxen’s presence. You must find a way to get away from him.",
						func : function() {
							fireblossom.flags["Outset"] = FireblossomFlags.Outset.Rakkat;
							
							FireblossomScenes.S1Rakkat();
						}, enabled : true
					});
					options.push({ nameStr : "Protest",
						tooltip : "Invoke your right as princess of Galenta, demand that this outrage is stopped!",
						func : function() {
							fireblossom.flags["Outset"] = FireblossomFlags.Outset.Grex;
							
							FireblossomScenes.S1Grex();
						}, enabled : true
					});
					Gui.SetButtonsFromList(options, false, null);
				});
			});
			
			Gui.SetButtonsFromList(options, false, null);
		});
	}

	export function S1Draxen() {
		let player = GAME().player;
		let fireblossom = GAME().fireblossom;
		var parse : any = {
			
		};
		
		Text.Clear();
		Text.Add("It’s all so overwhelming. The city, the drakes, all the strange sights and sounds, this entire situation… everything comes together, crashing down and crushing you completely. There is no way you can escape from this, no way that you can avoid your fate. All you can do is latch on to the calm eye at the center of the storm, the immovable Draxen.", parse);
		Text.NL();
		Text.Add("Now that you take some time to study him, he seems even more alien than before. When you first laid eyes on him, you thought that he was surrounded by a cloud of some form of incense, but a more careful examination shows that it’s actually steam rising from his body; the spicy scent is the dragon’s musk.", parse);
		Text.NL();
		Text.Add("You know one thing for sure - you’d never have a match like this in Galenta. He’s not only the most beautiful man you’ve ever seen, he’s also by far the most powerful, both politically and in sheer personal presence. So sure in his own divinity is he that you’re all but convinced that all these guards are nothing more than window dressing. If there exists a being strong enough to harm a single nail on Draxen, you don’t know what it is.", parse);
		Text.NL();
		Text.Add("Your future, your fate, lies with him. Your name, the name he gave you, is Fireblossom.", parse);
		Text.NL();
		Text.Add("You look at the dragon in adoration, and whisper: <i>“I will serve and obey.”</i>", parse);
		Text.NL();
		Text.Add("Draxen nods amiably, motioning to Qin. <i>“Take her to my chambers.”</i>", parse);
		Text.NL();
		Text.Add("Your heart skips a beat at those words, all of Xari’s talk of virginity showing itself in a new light. The kobold ushers you out of the hall, and you try to gather your conflicting emotions. Once again, to no one in particular, you whisper: <i>“I will serve and obey.”</i>", parse);
		Text.Flush();
		
		player.subDom.DecreaseStat(-50, 2);
		player.slut.IncreaseStat(25, 1);
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("Qin is demure and quiet as she leads you to your new home, though you doubt that you’d have taken note even if she was screaming in your face right now. As you leave the intimidating presence of Draxen you gradually regain your senses; your blind adoration replaced with a nagging feeling of doubt. Did you do the right thing? What exactly have you gotten yourself into?", parse);
			Text.NL();
			Text.Add("The dragon’s last words burn in your mind like hot irons: <i>Take her to my chambers.</i> There’s little doubt as to his intentions in that matter, and you can’t help but feel a flutter of excitement, a strange warmth suffusing you.", parse);
			Text.NL();
			Text.Add("Like everything else in the palace, Draxen’s personal quarters are immense in size, as are the doors and corridors leading to them. Were your thoughts not otherwise occupied, you might have wondered about why everything is so big around here. Surely nothing so petty as to impress on provincial visitors such as yourself?", parse);
			Text.NL();
			Text.Add("The main room seems more like a garden than anything else, full of strange plants and flowers. The kobold maid shows you around, indicating a table where one might feast on grapes and other exotic fruits, where one may recline near a large sprinkling fountain… and the bed. Like the one in the throne room, it’s massive, easily able to house dozens. Draxen must be one of quite lavish tastes, you think to yourself, blushing faintly. Above it, you can see the sky through a segmented glass dome.", parse);
			Text.NL();
			Text.Add("A flutter of movement near the back of the hall draws your eyes. As if summoned by your overactive imagination, a group of beautiful and scantily clad women pass by on a walkway, tittering among themselves as they see you. When you ask her, Qin informs you that they are the wives and concubines of Draxen, some of them former queens and princesses much like you. It seems like you are even less special than you thought here.", parse);
			Text.NL();
			Text.Add("Overwhelmed by it all, you sink down on the silken sheets of the royal bed, wondering what will happen to you. Seeing you bereft like this, the diminutive Qin takes pity on you.", parse);
			Text.NL();
			Text.Add("<i>“Take heart, my lady,”</i> she murmurs, breaking the silence. <i>“Being one of Draxen’s chosen is a high honor. You’ll never want for anything here.”</i>", parse);
			Text.NL();
			Text.Add("Fireblossom. She should call you Fireblossom.", parse);
			Text.NL();
			Text.Add("<i>“As you wish, my lady Fireblossom,”</i> the kobold replies, curtesing. After another awkward silence, she adds: <i>“Is there anything you wish for, lady Fireblossom?”</i> Advice, though you don’t say so. Instead, you buy some time by asking for a selection of fruits from the banquet and something refreshing to drink. By the time she’s returned, you’ve gathered your wits again.", parse);
			Text.NL();
			Text.Add("Haltingly, you ask your maid if Draxen is always this… intimidating.", parse);
			Text.NL();
			Text.Add("<i>“It is the first time I’ve seen the Envoy this close, my lady Fireblossom,”</i> Qin confesses. <i>“I’d of course heard stories, but nothing could prepare me...”</i> She blushes, lowering her head and muttering to herself. <i>“One such as me should not have these kind of thoughts, but could anyone blame me, having seen his glory?”</i>", parse);
			Text.NL();
			Text.Add("What sorts of thoughts would those be?", parse);
			Text.NL();
			Text.Add("<i>“I-it’d hardly be my place to speak of such things to you, lady Fireblossom,”</i> Qin blushes even more fiercely, avoiding your gaze. <i>“If you would excuse me...”</i>", parse);
			Text.NL();
			Text.Add("No! It comes out a little sharper, and perhaps with a bit more desperation than you intended. The maid studies you thoughtfully, perhaps for the first time seeing the frightened girl lost in a foreign land rather than the haughty princess.", parse);
			Text.NL();
			Text.Add("And so you talk. You have the sort of talk you once had with your mother on the relations between men and women, but you ask all the questions you didn’t dare to then. You have the kind of naughty conversation that you’ve sometimes overheard between your maids back home, though you doubt they could hold a candle to the kobold in terms of actual experience.", parse);
			Text.NL();
			Text.Add("All the questions about her and Grex and the other caravan guards come bubbling up, as well as anything else she can tell you about the carnal arts. Qin is frank with you, answering you in exquisite detail, even when her words set fire to your cheeks.", parse);
			Text.NL();
			Text.Add("<i>“Getting used to Grex took time and preparation,”</i> she admits. <i>“Not only is he rough, he’s… well, <b>big</b>.”</i> Your eyebrows rise as the diminutive maid measures out a rough estimate, almost half her height. <i>“Being used by the others before helped. Also, there’re some potions and salves that help...”</i> You listen attentively as she details out techniques for pleasuring a man, a field woefully ignored in your formal education. At last, Qin comes to a pause.", parse);
			Text.NL();
			Text.Add("<i>“One cannot really be prepared for their first… no matter how much we talk. I’m sure that you will do just fine, lady Fireblossom.”</i> She hesitates. <i>“Of course, I’ve never been with a dragon, but I’ve heard that...”</i> The kobold trails off, her eyes wide as saucers.", parse);
			Text.NL();
			Text.Add("You don’t even need to turn your head to know what caused her distress; the spicy scent is more than enough. Qin quickly hops off the bed, pausing to smoothen the sheets before scurrying off, leaving you to your fate. You think that you spy her throwing you a sympathetic look, but you’re too distracted to tell if it’s just your imagination playing tricks with you.", parse);
			Text.NL();
			Text.Add("As you turn to face the approaching Draxen, your treacherous heart does a somersault, leaving you breathless. He’s just so beautiful, so commanding… when he opens his mouth, his voice is a soaring song, caressing you and sending shivers down your spine.", parse);
			Text.NL();
			Text.Add("<i>“Is everything to your liking, my little Fireblossom?”</i> You quickly nod, stammering that you’ve received every possible kindness. Straining to not make a buffoon of yourself, you avoid the trap of his swirling eyes, opting to bow your head for your master instead. A futile effort.", parse);
			Text.NL();
			Text.Add("<i>“You should not lower your eyes, Fireblossom. They are treasures possessing beauty beyond that of any sapphire, and they deserve to be seen.”</i> He is close now, within reach, towering above you. Letting go of your last fluttering sense of doubt, you raise your head and meet his gaze.", parse);
			Text.NL();
			Text.Add("From then on, you are lost.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("The rest is a blur, a passionate storm of emotions and confused sensations. Now that you’re the full focus of the dragon’s attention, the intensity of him is breathtaking. His eyes are mesmerizing whirlpools that one could be lost in for days. His breath is nutmeg, cinnamon and clove, in addition to exotic spices you have no name for. His touch is fire, hot like a blazing furnace yet somehow leaving your skin intact.", parse);
				Text.NL();
				Text.Add("Your heart beats like crazy as he slowly removes your maiden gown, baring your creamy skin and your hard, rosy nipples. The sweltering heat exuding from his body has you sweating profusely, large drops of liquid trailing down the small of your back. Between your legs, your pussy glistens, your body instinctively inviting the powerful male. He leans in and kisses you.", parse);
				Text.NL();
				Text.Add("The dragon tastes even better than he smells.", parse);
				Text.NL();
				parse["x"] = fireblossom.xariRel > 1 ? "; Xari’s sensual caress seems nothing but rough groping in comparison" : "";
				Text.Add("Draxen doesn’t rush, he acts as if he has all the time in the world, playfully exploring your body and seeing how you react to his more and more intimate touches. In your entire life, you’ve never felt anything like this[x]. Wherever his lips or fingers touch your body, pleasure follows. When he finally leans down and tastes your quivering nethers, you cry out helplessly as the dam breaks, letting forth waves of unfamiliar and exhilarating sensations.", parse);
				Text.NL();
				Text.Add("The dragon allows you time to come down from your high, but he’s ignited a fire in your loins that refuses to go out. Looking deep into his eyes, you plead for him to take you, to mate with you. His swirling eyes are unreadable, but he allows you to undress him, your lithe hands seeming clumsy in comparison to his. You trail a finger in wonder down his chest, the smooth skin hiding powerful muscle beneath. A flash of blue draws your eye, a line of tiny azure scales that run along his collarbone. They seem to be a part of his skin, meshing with it seamlessly. When you look up, you notice similar scales on his brow, on his jaw, scales you could swear weren’t there a moment ago.", parse);
				Text.NL();
				Text.Add("Noticing your hesitation, the dragon murmurs assurances. <i>“Worry not, my Fireblossom, no harm shall come to you here.”</i> His voice seems deeper than before; the silken quality is still there, but it’s overlaid by the rumble of a distant thunderstorm. <i>“Your appearance… your eagerness, they arouse strong emotions in me. It becomes difficult to retain the glamour.”</i>", parse);
				Text.NL();
				Text.Add("Despite his words you find yourself faltering, as a new challenge appears before you. Draxen is bare down to his waist, his silken breeches being the only piece of clothing he still wears. Beneath them, something is straining to get out; something big, hard, throbbing… you shake yourself, remembering Qin’s words. She was right, for all the talking, you feel not one iota more prepared. Your master gently guides your hand down to it, murmuring encouragement as you caress the outline of his manhood. It responds to your touch, throbbing with excitement. Gulping down your fears, you pull down his trousers.", parse);
				Text.NL();
				Text.Add("The cock that springs free is almost as mesmerizing as his eyes. It’s a lighter blue than his scales, ridged and pointed. It’s big, but thankfully not as big as the one Qin described to you. Like the rest of his body, touching it is like putting your hand in a fire. Touching it. With a blush, you realize that your hand moved to the enticing member almost instinctively. It’s stiff, and at your touch it leaks a single drop of glistening seed from the tip. You wonder what it tastes like, your mouth watering at the prospect of finding out…", parse);
				Text.NL();
				Text.Add("Before you know it, Draxen has caught you in another kiss, pushing you down on your back, grasping one of your breasts and squeezing it enthusiastically. Settling himself astride you, the dragon pushes your lush titflesh together, forming a soft and welcoming embrace for his maleness. You whimper as he thrusts himself between your boobs, the tip of his member jutting out between them and grinding against your jaw. The glistening juice spreads from his tip to form a slick coating for his ridged shaft, hot like magma wherever it touches your skin. This close, his musk is overpowering. You want nothing but for him to brazenly drive his cock into your needy pussy; to quench the incessant ache in your loins.", parse);
				Text.NL();
				Text.Add("<i>“All in good time, my Fireblossom,”</i> the dragon rumbles. <i>“I wish to fully appreciate every part of you before I pluck you and make you mine.”</i> Apparently, you voiced your desires out loud. It matters not. Make you his? You are already his, and have been since he first laid his eyes on you. This is unquestionable.", parse);
				Text.NL();
				Text.Add("Letting out another whimper, you let him continue his relentless teasing. You dip your head and open your mouth, seeking his thrusting shaft with your tongue. Draxen relents and slows down, letting you taste his seed and lick his pointed tip. The taste is indescribable, beyond your wildest imagination. Your thoughts are a jumble; all you can keep in your head is your need to have more of it, to let the powerful dragon pump you full of it, to bear his children...", parse);
				Text.NL();
				Text.Add("Before long, he gives you what you want. You cry out in wanton ecstasy as his blazing hot member pushes inside you. Qin spoke to you of pain, but there’s none of the sort, only mind-numbing pleasure. You lose the concept of time while the Imperial Envoy mates with you, his cock a pillar of fire thrusting into you, making it impossible to focus on anything else.", parse);
				Text.NL();
				Text.Add("When he finally spends his seed in you, you almost black out. Even when he’s retracted his member, the potent burning liquid flows within you, coaxing a massive, prolonged orgasm from your wrecked body. You don’t know how long it persists, but at last blissful darkness claims you.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("You slowly come to, the burning ache of Draxen’s seed still in your loins. Now that you are more used to it, it’s possible to at least move, though you feel weak at the knees. Above you, you can see the stars of night glimmering in the sky.", parse);
					Text.NL();
					Text.Add("Draxen is with you. It must be Draxen, you instinctively recognize his presence, though his form is nothing like what you knew. You are cuddled up against a massive beast, the starlight glinting off his smooth azure scales. Heat emanates from the Imperial Envoy’s body as the dragon sleeps. Worming yourself up against his chest, you sigh in contentment. Even though Draxen is the size of ten Rakhs, you know you can come to no harm in his presence. You are his.", parse);
					Text.NL();
					Text.Add("You slowly drift back to sleep in your lover’s embrace…", parse);
					Text.Flush();
					
					fireblossom.draxenRel++;
					
					fireblossom.flags["State"] = FireblossomFlags.State.S2DraxenPet;
					
					Gui.NextPrompt(FireblossomScenes.Outro);
				});
			});
		});
	}

	export function S1Rakkat() {
		let player = GAME().player;
		let fireblossom = GAME().fireblossom;
		var parse : any = {
			
		};
		
		Text.Clear();
		Text.Add("You lower your gaze from Draxen, instinctively sensing the strange influence he has over you. Perhaps it’s his eyes, those deep swirling azure pools that look like they could drown you… No! Focus! Here, tact is best. You need to get out of the dragon’s presence in order to formulate a plan. Perhaps humility will work.", parse);
		Text.NL();
		Text.Add("Falling to your knees again, you murmur that you’re not worthy of his brilliance. You are but a mere princess of a subjugated backwater country - will he not have mercy on you?", parse);
		Text.NL();
		Text.Add("<i>“Fireblossom.”</i> Draxen sounds like he’s tasting the name. <i>“When I gave you your name, I thought that I sensed a spark of dragon’s fire in you. Perhaps I was wrong.”</i> You hurry to reply that you will live up to your name to the best of your abilities; you are merely overwhelmed by all of this.", parse);
		Text.NL();
		Text.Add("<i>“Very well.”</i> The dragon nods to himself. <i>“General Rakkat, as the leader of the forces that took Galenta, I give you this prize, my Fireblossom. May she serve you well, and live up to her name.”</i>", parse);
		Text.NL();
		Text.Add("It’s difficult to keep a straight face when the general is named. You realize that you’ve seen him before; that day when your father bent the knee, he was the one to accept the pledge of servitude. The lizan bows to his liege, murmuring his thanks. Throwing a glance at your new master, you think you spot what looks like… compassion?", parse);
		Text.NL();
		Text.Add("You are dismissed, and Grex and Qin are ordered to lead you to the general’s quarters. Your mind is a maelstrom of conflicting emotions, and you barely speak on the way there. It stings to bend the knee to this lizan who personally conquered your country, to be passed off as if you were some petty present of no consequence, but you think you felt a weakness in him. Something that you may be able to exploit, given time.", parse);
		Text.NL();
		Text.Add("Lost in your thoughts, you follow the tiny maid and the huge drake through the giant maze of the palace.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("As soon as you’re out of earshot of the court, Grex mouths up, guffawing. <i>“So yer going to be spreading your legs for the General, huh? Sounds like we’ll be seeing a lot more of each other in the future, little Fireblossom.”</i>", parse);
			Text.NL();
			Text.Add("What’s that supposed to mean? You respond icily.", parse);
			Text.NL();
			Text.Add("<i>“Grex works for the General,”</i> Qin explains. <i>“He holds the rank of Penmaster.”</i>", parse);
			Text.NL();
			Text.Add("<i>“As she says,”</i> Grex grunts. His feral eyes glint down at you. <i>“Perhaps I’ll ask the General for a favor or two.”</i>", parse);
			Text.NL();
			Text.Add("You throw him a smoldering glare. He wouldn’t dare. You might have to bow to the whims of the Imperial Envoy, but you’re <i>not</i> going to take such nonsense from a lowly soldier! Responding sweetly, you suggest that perhaps he should consider acting more gracefully to the consort of his master… you too could ask for a few favors, if it came to that. Grex grumbles, but doesn’t pursue the issue.", parse);
			Text.NL();
			Text.Add("<i>“Here we are, my lady,”</i> Qin indicates a set of ornate doors ahead, guarded by two drakes. <i>“The quarters of General Rakkat. I’ll go and fetch some- eek!”</i> Before she can finish her sentence, Grex grabs hold of the diminutive maid, picking her up by the tail.", parse);
			Text.NL();
			Text.Add("<i>“We wouldn’t want the little kobold to feel jealous, would we, ‘my lady’?”</i> He grins lecherously, fondling the maid’s behind. <i>“She can bring you your refreshments when I’m done with her - if she can still walk at that point.”</i> He guffaws, wandering off with the dejected Qin flopped over his shoulder.", parse);
			Text.NL();
			Text.Add("You resist the urge to throw a tantrum - there’s plenty time to get back at the brutish Grex once you’ve solidified your position here. Hopefully Qin will forgive you… she’s shown herself capable of handling the drake before, after all. Throwing a nervous glance at the guards, you enter the General’s quarters.", parse);
			Text.NL();
			Text.Add("This Rakkat’s rooms are surprisingly unassuming for someone of his stature. His chambers are sparsely decorated, the most lavish things around being his weaponry and armor, all of which is polished to a mirror shine. There’s a table and chairs for meetings, a small study crammed with books and scrolls of all kinds, and a small open garden connecting the other rooms where you can look at the evening sky. Exploring further, you find his personal quarters and dressing chambers. Blushing, you take to the garden, wishing to think of other things than beds for a while longer.", parse);
			Text.NL();
			Text.Add("In the time it takes for the General to retire, you’ve had time to settle down and start formulating plans - all of them rather chancy affairs before you know what kind of man Rakkat is. One thing's for sure, you need to earn the man’s trust if you are to gain any form of power here, the only question is how…", parse);
			Text.NL();
			Text.Add("You’re still pondering your predicament when soft footfalls announce the the arrival of your new master. He doesn’t approach you immediately, giving you some time to study him from the garden. The lizan starts by heading to his quarters and removing his stately robe. Your cheeks heat a little as you see him disrobe, noting that he’s got the toned body of a warrior. His oiled scales are emerald green, covering him from head to tail. Despite your own quite significant height, he has a few inches on you. Instead of hair, the lizan has a set of sharp spines and ridges, giving him quite a fierce appearance, if not as brutish as that of Grex and the other drakes.", parse);
			Text.NL();
			Text.Add("<i>“My lady Fireblossom,”</i> he greets you gravely as he enters the garden, giving you a smooth bow. He’s not wearing a single thread on his body, yet he seems to not be overly bothered by it.", parse);
			Text.NL();
			Text.Add("<i>“General,”</i> you reply, perhaps a bit more stiffly than you intended. You know that you have to get along with this man if you are going to have any say in anything, but it’s still difficult to forgive him for what he did under the orders of Draxen. That, and his nudity is rather distracting. Giving in to your curiosity, you let your gaze wander downward, chest thumping. Odd… you believed you had some form of idea of the male anatomy, yet the lizan’s loins are smooth.", parse);
			Text.NL();
			Text.Add("Rakkat clears his throat. <i>“Is my appearance disconcerting, perhaps something amiss?”</i> You snap your eyes back to his face, catching the last trace of a faint smile there. <i>“It is my habit to not let clothes bother me in the confines of my own home… hopefully this isn’t too distracting for you?”</i> he adds wryly.", parse);
			Text.NL();
			Text.Add("No, not at all, you hurry to reply, doing your best to hide your true emotions.", parse);
			Text.NL();
			Text.Add("<i>“I’ll leave it up to you if you wish to follow this habit or not. I think it would please me, for you are quite pleasant on the eyes.”</i> He gestures toward his bedroom. <i>“You may await me in bed, my lady, I have some work to attend before I join you.”</i> Not waiting for a response, he walks into his study, settling down with some reports.", parse);
			Text.NL();
			Text.Add("Well, that wasn’t quite what you expected. For the moment, you retire back into the bedroom, considering your next move. The General at least seems polite with you, something so far unfamiliar to you in the land of the dragons… but still, he is who he is. Many of your countrymen have died on the orders of this man.", parse);
			Text.Flush();
			
			//[Wait for him][Seduce][Kill him]
			var options = new Array();
			options.push({ nameStr : "Wait for him",
				tooltip : "For now, do as he says. Wait and observe.",
				func : function() {
					Text.Clear();
					Text.Add("Your stomach flutters as you shrug yourself out of Xari’s dress. Peeking out across the garden, you try to see if Rakkat is spying on you, but he seems to be completely absorbed in his maps and reports. You sigh and flop down on the bed, brooding over your situation. There’s need for careful observation and planning; before you can act and start twisting him to your liking, you must know how he thinks. An irksomely daunting task, thanks to the General’s polite, stony expression.", parse);
					Text.NL();
					Text.Add("He may have courtly manners, but he guards his emotions closely. You must be careful of how you act around him before you know him better, lest you walk into a carefully laid trap.", parse);
					Text.NL();
					Text.Add("The General gives you plenty of time to think over these things, as he doesn’t seem at all in a hurry to claim his gift, working well into the night. The cool air streaming in from the open garden sends shivers over your bare skin. The rosy nubs of your nipples are stiff. The air, you tell yourself. Pouting, you wrap yourself in the bedsheets, trying to warm yourself before Rakkat joins you.", parse);
					Text.NL();
					Text.Add("It’s considerably later before the lizan finally sets aside his work, rising to his feet. You’ve drowsed off while waiting for him, so it’s a bit startling seeing him looming over you from the foot of the bed, an oil lamp in hand.", parse);
					Text.NL();
					Text.Add("<i>“I’ve kept you waiting long enough. A test, if you will. It seems that Draxen’s gift will become a pretty ornament in my garden.”</i> From his neutral tone, it’s difficult to tell if he is pleased or not. With lamp in hand, he lights several lanterns, flooding the room with warm light. He puts down the lamp on a small table nearby and turns to you.", parse);
					Text.NL();
					Text.Add("<i>“Now, let me look at you, my Fireblossom.”</i> This time, his tone is far from neutral, and carries the overtones of a command. Shivering involuntarily, you get up on your knees and let the sheets slip. <i>“Beautiful,”</i> Rakkat whispers. The word floats through the air, possessively caressing your nude form.", parse);
					Text.NL();
					Text.Add("Eyes wide, you survey him in turn, letting out a small gasp when you see something starting to poke out of a slit between the lizan’s legs. Two shafts of not insignificant size are slowly swelling, glistening wetly in the glow of the lanterns. They are pink in color, a stark contrast to Rakkat’s emerald scales, and are ridged and pointed. It would seem that the rumors going around the castle at home about lizan males were true after all. You gulp nervously.", parse);
					Text.NL();
					Text.Add("<i>“You are cold,”</i> the General murmurs, trailing a hand down one of your arms. There’s a smoldering heat just below the surface of his skin, quite startling at first, but not unwelcome either in the chill night. When you point this out, he simply replies: <i>“There’s a drop of dragon’s blood in my veins. It comes with some advantages.”</i> A smile plays on his lips. <i>“Do go ahead, I’m quite happy to share my warmth.”</i>", parse);
					Text.NL();
					Text.Add("Your heart beats faster, your breath comes quicker, your thoughts are a jumble, rapidly falling into the swirling maelstrom of your confused emotions. You put a questing hand on his chest, trailing it over firm muscle hammered to perfection through diligent training. Every part of his body is thrumming with the gentle warmth… you swallow nervously, feeling lower. Yes, those too.", parse);
					Text.NL();
					Text.Add("The intimate touch is all that Rakkat needs in order to gauge your willingness, and he pushes you down on the sheets, towering over you. His scales feel slick and oily against your skin, but not at all unpleasant. Ahh… far from it, in fact.", parse);
					Text.Flush();
					
					player.subDom.DecreaseStat(-20, 1);
					fireblossom.rakkatRel++;
					
					Gui.NextPrompt(FireblossomScenes.S1RakkatCont);
				}, enabled : true
			});
			options.push({ nameStr : "Seduce",
				tooltip : "If you are ever going to hold any sway over this man, you are going to have to be the first one to move.",
				func : function() {
					Text.Clear();
					Text.Add("You throw a thoughtful glance across the garden. No. There is no sense in antagonizing this man. He was only following orders, and truth be told, the conquest of Galenta was a lot less bloody than it could have been.", parse);
					Text.NL();
					Text.Add("If you are ever going to hold any sway in this land, you must twist Rakkat around your finger. With the Imperial Envoy so close at hand, that still might not be enough, but perhaps even he could be swayed in time. You shudder, thinking back to the oppressive feeling of being in Draxen’s presence. Perhaps, perhaps not. Either way, you are going to have to take risks in order to conquer, and that starts here and now.", parse);
					Text.NL();
					Text.Add("Resolutely, you let Xari’s maiden dress fall to the floor and step through the garden, naked as the day you were born. Your golden hair streams out behind you in the evening breeze. Let’s see how long the General will favor his reports over his lover.", parse);
					Text.NL();
					Text.Add("His muscles tense as you trail a soothing hand over his shoulder, coiled to spring, but they gradually relax when you press your bare bosom against his back. You discover something quite startling: Rakkat’s skin is hot to the touch - not scalding, but nevertheless much warmer than you’d expect from a lizard… as if there’s a fire burning within his body.", parse);
					Text.NL();
					Text.Add("<i>“I see you adopt to customs quite quickly, Fireblossom,”</i> Rakkat murmurs, not looking up from his maps. Peeking over his shoulder, you see the lands of Galenta and her surrounding neighbors. From the looks of it, the army marches on, conquering new lands as it goes. No matter, that battle was lost almost half a year ago; this one is barely starting.", parse);
					Text.NL();
					Text.Add("And is it the custom here for a lord to keep his lady waiting?", parse);
					Text.NL();
					Text.Add("<i>“Not so, I merely have a few matters to attend to before I can join you. Matters of work. Retire to the bed and I’ll come for you when I am done.”</i> Hah. Nice try. You kneel down and envelop him in an embrace, hands sensually trailing down his body.", parse);
					Text.NL();
					Text.Add("You tell him to not mind you, you’ll just entertain yourself while your master is busy with more important matters. There’s a faint tremble from Rakkat as his heartbeat quickens - not visually apparent, but very easy for you to detect in your intimate embrace.", parse);
					Text.NL();
					Text.Add("<i>“As you wish,”</i> he amiably replies, pretending to continue to pore over his battle plans.", parse);
					Text.NL();
					Text.Add("What you lack for in experience, you make up for in curiosity and boldness. Your hands are everywhere, caressing his chest, his arms, his legs. You playfully toy with the rough spines crowning his head and running down his back, sensing another shudder run through your prey as you move on to his long, flexible tail. A useful snippet of information, one which you shelve for later use.", parse);
					Text.NL();
					Text.Add("One more spot remains for you to explore; that secret place down between his legs. Overcome by curiosity, you set out once again… only to find something that you did not expect. Where you previously could have sworn were only smooth, scaly underbelly, two thick, rigid shafts sprout, lured out from their sheath by your sensual wiles. Your hands continue their probing, further studying this new finding. From what you know of the anatomy of the human male, they are usually not this pointed, and lack the ridges underneath. There’s usually just one of them, too. You start to ponder what you could do with this new information, but are interrupted by a slightly hesitant cough.", parse);
					Text.NL();
					Text.Add("<i>“A moment.”</i> The General still appears calm, though his voice is slightly strained. Temporarily freeing himself from your grasp, he stands up and pulls a book from one of the shelves. When he settles down again, poring over old notes, he turns his chair so that you have full access to his nethers. He even spreads his legs accommodatingly when you snuggle up between them to get a closer look.", parse);
					Text.NL();
					Text.Add("Well, if Qin can do this, so can you. You use your hand to stroke one of his cocks, while you pleasure the other one with your mouth. The taste is spicy, and both shafts are as warm as the rest of his body.", parse);
					Text.NL();
					Text.Add("<i>“Draxen named you true,”</i> Rakkat mutters. <i>“Full of fire you are… if still a bit lacking in experience.”</i> Let him throw his jibes, you have him where you want him. Your free hand strays behind his back playing with his tail. Despite his stubborn resistance, your efforts eventually overwhelm the lizan. He grunts as seed spews forth from his cocks, painting the inside of your throat and the contents of the current page of his notebook with sticky white strands.", parse);
					Text.NL();
					Text.Add("You swallow the hot liquid, noting with satisfaction the expression on his face. You definitely have his attention now.", parse);
					Text.NL();
					Text.Add("Rakkat looks down at his notes, shaking his head disparagingly. <i>“It seems you will not be content until I attend you, Fireblossom,”</i> he concludes mournfully. <i>“Had I known the Galentans were so eager, I’d have urged for the campaign much sooner.”</i> Another jibe. Careful now.", parse);
					Text.NL();
					Text.Add("Ah, so he has conquered Galenta, has he? You hadn’t noticed. You wonder if this his luck will stay with him in his next conquest.", parse);
					Text.NL();
					Text.Add("<i>“And what would I conquer? The western armies rest for the moment,”</i> he counters, studying you.", parse);
					Text.NL();
					Text.Add("You roll your eyes. <i>“Me, you dolt. There’s still one bit of Galenta left unconquered by your uncouth hands.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Sounds like we’ll have to change that,”</i> he replies, grinning as he sweeps you up into his arms. He effortlessly carries you into the bedchamber, throwing you onto the bed. The General busies himself with lighting the lanterns around the room to ward off the rapidly encroaching night, thus missing your victorious smile. He’s yours.", parse);
					Text.NL();
					Text.Add("And now, he intends to make you his. Let him try, you tell yourself boldly, though you can’t quite shake your nervosity. This is, after all, the first time you’ll have such intimate contact with a man’s cock… let alone two at once. The lizan seems to have little sympathy for your unease, pushing you down on the sheets roughly. Now that you’ve lit the fire in him, it’s not about to go out before he’s sated. From the hungry look in his eyes, he can go on through the rest of the night.", parse);
					Text.Flush();
					
					player.slut.IncreaseStat(50, 1);
					player.subDom.IncreaseStat(50, 1);
					fireblossom.rakkatRel += 2;
					
					fireblossom.flags["Rakkat"] |= FireblossomFlags.Rakkat.Seduced;
					
					Gui.NextPrompt(FireblossomScenes.S1RakkatCont);
				}, enabled : true
			});
			options.push({ nameStr : "Kill him",
				tooltip : "There’s no way this is going to end well… but Rakkat must pay for his crimes.",
				func : function() {
					Text.Clear();
					Text.Add("A quick glance across the courtyard; Rakkat is busy in his studies, and doesn’t appear to be monitoring your movements. No matter how much you try, you can’t accept this man as your master. You retreat back into the common room, eyes alighting on the General’s weapon stand.", parse);
					Text.NL();
					Text.Add("You’ll show Draxen a thing or two about the dragon’s fire in you. Smiling grimly, you draw out one of the ceremonial blades - half-knife, half-sword, and about two feet long. It makes a soft hissing sound as you pull it from its sheath, the ominous sound of Rakkat’s death. You know that you are probably going to die here, but you are damn well going to take that murderer down with you. That’ll show those damn lizards what happens if they try to turn the princess of Galenta into some hussy.", parse);
					Text.NL();
					Text.Add("The blade is a bit unsteady as you sneak closer to the General, echoing your own uncertainty. One the one hand, if there ever was a man that deserved it, he sits here. On the other, you are no soldier, and have never taken another’s life, never considered it before now. Rakkat doesn’t react as you creep up behind him, he seems to be fully absorbed in some map or other. Probably plotting another military conquest. You hesitate slightly as you recognize the name Galenta.", parse);
					Text.NL();
					Text.Add("The hesitation proves fatal.", parse);
					Text.NL();
					Text.Add("Rakkat smoothly throws himself into a roll, narrowly missing a stab in the back. He comes up in a crouch, muscles tensed and ready to spring. <i>“Fireblossom,”</i> he says, tasting the name thoughtfully as he sidesteps your next desperate lunge, disarming you effortlessly. <i>“I cannot decide whether to be impressed or disappointed.”</i>", parse);
					Text.NL();
					Text.Add("You turn to run, but your path is quickly impeded by the bulky frame of Grex, just back from abusing your maid. He picks you up as he try to dash past him, shredding your dress in the process and baring your creamy skin.", parse);
					Text.NL();
					Text.Add("<i>“Everything alright, General?”</i> the brute rumbles, his eyes darting between your struggling form and the blade in Rakkat’s hand.", parse);
					Text.NL();
					Text.Add("<i>“Quite so. The evening has transpired as I expected, if not as how I hoped.”</i> He knew what you were plotting all along, you realize with a sinking heart. <i>“Let her down, but do not let her run.”</i> You are gently lowered to the floor, though there’s no saving your dress; it no longer retains enough material to afford you even partial decency.", parse);
					Text.NL();
					Text.Add("<i>“My lady Fireblossom,”</i> the General intones. <i>“Imperial Envoy Draxen has given you to me as a gift - well meant, I am sure, and I wouldn’t dream that he foresaw your traitorous actions. In honor of his gift, you shall remain in my household as my property, but I rather dislike the thought of having to sleep with one eye open in fear of assassination from my own bed warmer.”</i>", parse);
					Text.NL();
					Text.Add("No. Not this way. You embarked on this course knowing you would die, will the dragons rob you even of this?", parse);
					Text.NL();
					Text.Add("<i>“Take her away, Grex,”</i> Rakkat says as he turns away, sealing your fate. <i>“Take care not to harm her overly much, other than that, you and your men may do as you please with her.”</i>", parse);
					Text.NL();
					Text.Add("<i>“You are too kind, General.”</i> Grex bows, grinning down possessively at you. <i>“Me and the boys will give her a warm welcome to the ranks.”</i> Guffawing, the brute throws you over his shoulder and heads for the pens.", parse);
					Text.Flush();
					
					player.subDom.IncreaseStat(100, 2);
					fireblossom.rakkatRel--;
					fireblossom.flags["Outset"] = FireblossomFlags.Outset.RakkatToGrex;
					
					Gui.NextPrompt(function() {
						Text.Clear();
						Text.Add("Well, that didn’t work out as planned. ", parse);
						
						FireblossomScenes.S1GrexEntrypoint();
					});
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		});
	}

	export function S1RakkatCont() {
		let fireblossom = GAME().fireblossom;
		var parse : any = {
			
		};
		
		fireblossom.flags["Rakkat"] |= FireblossomFlags.Rakkat.Lover;
		
		var seduced = fireblossom.flags["Rakkat"] & FireblossomFlags.Rakkat.Seduced;
		
		Text.Clear();
		Text.Add("<i>“Get ready to be plucked, my pretty little flower,”</i> the General huffs, leaning in for a kiss. Your tongues intermingle and wrestle, his long and sinuous. ", parse);
		if(seduced)
			Text.Add("You make sure you win the fight.", parse);
		else
			Text.Add("You close your eyes, leaning into the kiss and letting the powerful lizan take charge.", parse);
		Text.Add(" The lower one of his twin shafts rubs against your nether lips, mirroring his other kiss and bringing promise of further pleasure.", parse);
		Text.NL();
		Text.Add("You let out a delighted yelp as he hoists you to the edge of the bed, spreading your legs and holding you by the knees. Rakkat drinks in the sight of you beneath him, flushed and willing, golden hair spreading out behind you like a waterfall. <i>“More beautiful than I first imagined,”</i> the lizan hisses as he roughly grinds your pussy, eliciting gasps from you. <i>“I didn't think I’d one day have the pleasure of fucking the spitting image of one of the Grand Spirits. I bet you were a much sought after prize in your homeland, but now, you’re <b>mine</b>.”</i>", parse);
		Text.NL();
		Text.Add("He thrusts forward, plunging one of his members into your dripping snatch. You moan, overcome as your virginity is passionately taken, grasping Rakkat’s back like a drowning woman desperately holding on to her only lifeline. His other shaft grinds against your clit and drips hot, sticky pre on your stomach, like a candle dripping wax. The lizan pulls out, dipping his other cock in your pussy and hilting it. His lower member grinds against your taint, hinting at further virginities to take.", parse);
		Text.NL();
		Text.Add("Rakkat fiercely makes love to you, pumping his cocks into you like a man possessed. Once you’ve grown accustomed to his girth, you begin to return his passion, gyrating your hips and leaning up to kiss his neck, his chin, his mouth. He grabs one of your heaving breasts, massaging it and twisting your sensitive nipple, causing you to whimper.", parse);
		Text.NL();
		if(seduced)
			Text.Add("Not wanting to be outdone, you wrap your legs around your lover, putting one foot above and one beneath his tail. In time with his thrusts, you stroke him with your feet, drawing a gasping moan from the lizard. You give him a taunting smile, causing him to redouble his efforts.", parse);
		else
			Text.Add("It’s all you can do to hang on and wait out the storm, though it looks like it’s going to be quite some time before he’s done. The lizard’s hands are all over your body, tugging at your tits, caressing your hips and legs, cupping your chin when he leans in to tongue-wrestle with you.", parse);
		Text.NL();
		Text.Add("As the night goes on, your lovemaking turns more creative, making full use of his twin cocks. When he first puts both of them in at once, you clench your teeth and endure. When he puts one of them in your virgin ass and fucks both your holes at once, you cry out in pleasure. Before long, you’re leaking of his hot seed from both pussy and ass, aching for more.", parse);
		Text.NL();
		Text.Add("The General seems versed in both giving and taking, using his flexible tongue on you almost as much as his cocks. ", parse);
		if(seduced) {
			Text.Add("Locked in a loop of oral pleasure, your mouth around one of his cocks, his tongue plunged deeply in your cunt, a naughty idea comes to your mind. Time to see just how far you can push him.", parse);
			Text.NL();
			Text.Add("Throat clamped tight around his throbbing shaft, you begin to stroke his tail, using both of your hands to stroke it like a third cock. This seems to have a satisfactory response. The closer your prying hands come to the base of his tail, the more urgent his own licking becomes. You pull him out of your mouth to catch a breather, and survey your new target. Anal is already on the table, so he can hardly complain, can he?", parse);
			Text.NL();
			Text.Add("Rakkat hisses in surprise when you instead of returning to suck on his cock plunge your tongue into his own unused hole, but at your nudging he continues to eat you out, enjoying this new sensation. Before long, you’re rewarded with a thick splatter of cum across your chest as you bring the lizan to an anal orgasm, smiling triumphantly to yourself.", parse);
			Text.NL();
			Text.Add("The experiment is not without its drawbacks; before the night is out, you’ve experienced what having two dicks shoved to the hilt into your ass feels like. It’s a pain that can be endured, if it means pulling one over on your new ‘master’.", parse);
		}
		else {
			Text.Add("At first, you blanch at sucking his cocks, but the intensity with which he goes down on your cunt convinces you to give it a try. You’re promptly rewarded with a mouthful of hot, spicy cum. Enjoying your discomfort, Rakkat promptly has you repeat the exercise once more, smiling down at you possessively.", parse);
			Text.NL();
			Text.Add("Your night is just beginning.", parse);
		}
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("You frenzied love-making goes on through the night, with both of you testing out new positions and delighting in exploring the other’s body. Rakkat seems truly taken with you, commending you for your stamina. He’s hardly one to talk; it feels like the hardened soldier could keep at this for half a day more and still hit his morning drill with a spring in his step.", parse);
			Text.NL();
			Text.Add("When the two of you finally settle down, cuddled together in a heap of sweat and sexual fluids, you’ve lost count of the number of ways that he’s fucked you. Hot seed leaks out from both pussy and ass, and there’s a generous serving of the warming fluid settling in your stomach. Rakkat toys with your hair, nipping at your ear playfully.", parse);
			Text.NL();
			if(seduced) {
				Text.Add("<i>“I thought I would have to teach you much, Fireblossom,”</i> he murmurs, <i>“yet your ingenuity never ceases to surprise me. The Galentans never knew what a horny little minx they’d been raising.”</i>", parse);
				Text.NL();
				Text.Add("You can’t refrain from blushing. In time, you may become more used to this, but this first night you were going on instinct alone, and you blanch at some of the memories of what you’ve done these past hours. Still…", parse);
				Text.NL();
				Text.Add("Rubbing your sore butt back against him sultrily, you shoot back a question: are you perhaps too much for him to handle?", parse);
				Text.NL();
				Text.Add("<i>“Don’t fear, I was going easy on you,”</i> the General replies amiably. Seems like you still have work to do, but now you have an idea on how you can exert leverage on the lizan… there’re things you can give him that he perhaps doesn’t yet know he himself wants.", parse);
			}
			else {
				Text.Add("<i>“We have many delightful nights ahead of us, Fireblossom,”</i> he murmurs. <i>“You have a gorgeous body, and a quick and playful mind to go with it. It will be most gratifying to school you in the carnal arts.”</i>", parse);
				Text.NL();
				Text.Add("Oh, he thinks you’re not adept?", parse);
				Text.NL();
				Text.Add("<i>“Enthusiastic, certainly, perhaps even eager. It is not a surprise for one who’s been kept in the dark regarding these matters her entire life. Still… this too is a skill that one can improve upon.”</i>", parse);
				Text.NL();
				Text.Add("It is with some optimism that you let your thoughts wander, dreaming of these further lessons.", parse);
			}
			Text.NL();
			Text.Add("When at last you fall into exhausted sleep, it is with a satisfied smile on your lips.", parse);
			Text.Flush();
			
			fireblossom.flags["State"] = FireblossomFlags.State.S2RakkatPet;
			
			Gui.NextPrompt(FireblossomScenes.Outro);
		});
	}

	export function S1Grex() {
		let fireblossom = GAME().fireblossom;
		var parse : any = {
			
		};
		
		Text.Clear();
		Text.Add("You are still a princess, and you will not be treated this way, sold off like a sack of wheat! There’s a worried look on ambassador Herod’s face, and you throw him a murderous glare.", parse);
		Text.NL();
		Text.Add("<i>“You misunderstand, Fireblossom,”</i> Draxen replies. His tone of voice is lower than before, and carries a sharp undertone. <i>“A princess you may be, but the title means nothing in the empire. You were selected mostly for your beauty, not for your position.”</i>", parse);
		Text.NL();
		Text.Add("This barbaric outrage must be stopped! Do they have no respect for royalty in this empire of theirs?! Draxen sighs, shaking his head.", parse);
		Text.NL();
		Text.Add("<i>“Fireblossom, pretty Fireblossom, you disappoint me. We dragons place a great deal of importance on royal heritage. But here and now, I am the one of royal blood, and you nothing but a common peasant, a citizen of a subjugated land.”</i> The way he says it, it seems like it should be obvious to you, the natural order of things. No mere human could hold any power in the presence of a dragon. <i>“Due to your young age and striking beauty, I will give you a final chance. Accept your servitude gracefully, or face the consequences.”</i>", parse);
		Text.NL();
		Text.Add("<i>Never</i>, you spit out.", parse);
		Text.NL();
		Text.Add("Ambassador Herod looks like he’s about to speak, but he’s silenced by a glare from the Envoy. <i>“We shall speak of this later, ambassador. It ill befits Galenta to so poorly prepare her tribute. You may leave.”</i> The flustered Herod scurries away out of sight, leaving you completely alone with the lizards.", parse);
		Text.NL();
		Text.Add("<i>“I grow bored of this rebellious toy,”</i> Draxen drawls. <i>“Will no one take her off my hands?”</i> There’s an uncomfortable shuffle up on the dais. The lizan nobles are intrigued by you exotic beauty, but fear that speaking up might invoke the dragon’s wrath. The one named Rakkat looks like he’s about to say something, but before he utters a word, you hear a guttural rasp behind you.", parse);
		Text.NL();
		Text.Add("<i>“I’ll take her, show her her proper place. Your Eminence.”</i> With a rapidly sinking feeling in your stomach, you look up at Grex in horror. The drake’s head is bowed in reverence, but you think you spy him throwing you a triumphant look through slitted eyes.", parse);
		Text.NL();
		Text.Add("The hall is silent while the Envoy ponders this, standing judgement over your fate. <i>“Very well,”</i> Draxen says at last. <i>“You may have the girl. Take her from my presence.”</i>", parse);
		Text.NL();
		Text.Add("It’s as if he’s swept away the floor from under your feet. Your head swims at how unreal this is; surely, you’ll wake up any moment in your bed. Surely he did not just say… It’s only thanks to Qin’s aid that your fall doesn’t harm you as dizziness takes over. The last thing you see is Grex’s stupid grin, and then everything turns black.", parse);
		Text.Flush();
		
		fireblossom.draxenRel--;
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("You come to, waking up from a dream of misery into real misery. Struggling, you take note of your current predicament. ", parse);
			FireblossomScenes.S1GrexEntrypoint();
		});
	}

	export function S1GrexEntrypoint() {
		let fireblossom = GAME().fireblossom;
		var parse : any = {
			
		};
		
		Text.Add("Grex is carrying you over his shoulder like a bag of flour, showing little care for your comfort. Exactly where he’s taking you, you know not, but this doesn’t look anything like the grand passageways of the palace. The walls are made from rougher stone, there’s more distance between the fires, and there are no windows anywhere to be seen. The dank smell suggests that you’re somewhere underground.", parse);
		Text.NL();
		Text.Add("Beside Grex, Qin is jogging as fast as she can, trying to keep up with the brute. <i>“G-Grex, wait!”</i> she yelps, gasping for air. <i>“Don’t do something rash now!”</i>", parse);
		Text.NL();
		Text.Add("<i>“What, you think I’ll get in trouble for a bit of rough and tumble?”</i> he growls. ", parse);
		if(fireblossom.flags["Outset"] == FireblossomFlags.Outset.RakkatToGrex)
			Text.Add("<i>“Little Fireblossom isn’t exactly in favor at the moment. She made a mistake by trying to show steel while having too little of it.”</i>", parse);
		else
			Text.Add("<i>“Where you perhaps at a different audience than me?”</i>", parse);
		Text.NL();
		Text.Add("<i>“B-be that as it may, p-please don’t harm her!”</i> Qin begs him. <i>“She won’t survive the pens!”</i>", parse);
		Text.NL();
		Text.Add("Stopping for a moment, Grex looks down perplexed at the diminutive kobold. <i>“What do you care? You don’t work for her anymore.”</i>", parse);
		Text.NL();
		Text.Add("<i>“My reasons are my own,”</i> Qin mumbles, taking care to not look directly at you.", parse);
		Text.NL();
		Text.Add("<i>“Your reasons are insufficient unless you have something to back them up with,”</i> Grex seems to take pleasure in tormenting the poor creature. <i>“She’s going into the pens.”</i> He gives you a heavy slap on your butt, causing you to yelp. You mutter something about him being the son of a feral Rakh, though you take care to do so under your breath, fearing further reprisals.", parse);
		Text.NL();
		Text.Add("<i>“A week in the pens,”</i> Qin says slowly. <i>“You’ll turn her over to mistress Xari immediately.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Two weeks beside her,”</i> Grex counters. <i>“Little Fireblossom stays, but you can have some time to prepare her. That’s the best offer I’ll give you. Don’t try to offer me something that’s already mine. You know that your cunt belongs to me.”</i>", parse);
		Text.NL();
		Text.Add("Qin lowers her head dejectedly. <i>“Done,”</i> she mutters.", parse);
		Text.NL();
		Text.Add("<i>“She must be really special, this girl,”</i> Grex guffaws. <i>“Me and the boys will have a good time breaking her in...”</i> You try to close your ears to his taunting voice, but have little success. In the distance, you hear the noises of carousing; drinking, singing and lecherous roars.", parse);
		Text.NL();
		Text.Add("<i>“Here we are, your new home,”</i> the brute declares, putting you down on your feet again and pushing you through an open door. Thankfully, he seems to have heeded Qin, as your new quarters are at least somewhat presentable. There’s at least sufficient lighting, and presentable if somewhat odd furniture. You had expected a dark and dank dungeon, but this place doesn’t seem so bad… that is, until you smell the musk in the air. With a sinking feeling, you hear Grex enter the room behind you, putting his glaive on a weapon’s rack. These are his quarters.", parse);
		Text.NL();
		Text.Add("<i>“I’m off to tell the boys the good news,”</i> Grex announces. <i>“Little Fireblossom has a long night ahead of her.”</i> Qin starts to protest, but Grex cuts her off. <i>“I’ll take a few drinks, sort out some bad apples that may have cropped up while I was gone. The boys have bad memories, they need to be shown who the top drake is. You have until I return. Make it count, if you care for her.”</i> With that, he cracks his knuckles and heads toward the carousing, slamming the door shut behind him.", parse);
		Text.NL();
		Text.Add("Drawing a ragged breath, you slump down on the ground, exhausted. Qin looks like she’s about to head to assist you, but quickly shakes herself and moves to the door instead. <i>“I-I’m sorry, my lady, but there’s no time to lose. I will return shortly,”</i> the kobold slips out the door, leaving you alone.", parse);
		Text.NL();
		Text.Add("What’d you like to do?", parse);
		Text.Flush();
		
		FireblossomScenes.S1GrexRoom({});
	}

	export function S1GrexRoom(opts : any) {
		let player = GAME().player;
		let fireblossom = GAME().fireblossom;
		var parse : any = {
			
		};
		
		//[Survey][Explore][Wait]
		var options = new Array();
		options.push({ nameStr : "Survey",
			tooltip : "Look through Grex’s chambers.",
			func : function() {
				Text.Clear();
				Text.Add("The room is bigger than what you thought a regular soldier would have, even counting the size of the drakes; it really seems like Grex occupies some position of power here. That, or he’s murdered the previous owner of the quarters. Much of it is occupied by a low drake-sized bed lining one of the sides of the room. Plain, but at least it’s not a bale of hay. Along one side of the wall is Grex’s armory, containing a selection of various weapons.", parse);
				if(fireblossom.flags["Outset"] == FireblossomFlags.Outset.RakkatToGrex)
					Text.Add(" You doubt you could lift any of them, so your last plan is even more hopeless here than it was with Rakkat. Probably best to drop that line of thought altogether; Grex doesn’t look like he’d take kindly to it.", parse);
				Text.NL();
				Text.Add("There’s a long table set in the side of one wall. At first you think it a shelf, but you realize that for Grex, it’d be on level with his torso; you can barely reach it if you stretch your arms up. The remaining fourth wall is covered by a drapery. Peering in behind it, you deem it some form of storage area, containing various articles of oversized clothing, a discarded tankard and a large chest. Further examination reveal that the chest is soundly locked. No luck there.", parse);
				Text.NL();
				Text.Add("Finding little else to do, you slump down on the bed. The smell is worse here, but at least it’s comfortable.", parse);
				Text.Flush();
				
				opts.survey = true;
				
				FireblossomScenes.S1GrexRoom(opts);
			}, enabled : !opts.survey
		});
		options.push({ nameStr : "Explore",
			tooltip : "Slip out into the corridor and see what else there is around here.",
			func : function() {
				Text.Clear();
				Text.Add("Feeling a strange bravado - you’re pretty much already in the worst situation you could be, anyways - you slip back out into the corridor, peering around. Back the way you came, you see the backs of two drakes. Bad idea. The other way, you hear the sounds of carousing, but at least you don’t see anyone moving about. Deciding to chance it, you creep down the corridor.", parse);
				Text.NL();
				Text.Add("You pass by several similar doors, from behind some of which you hear noises - snoring, drinking or whoring. There’re also several large staircases leading down to lower floors. You avoid those for now, going down is not likely to help you. Ahead, there seems to be some sort of great hall, and the din of revelry is loud on the air. No one is likely to <i>hear</i> you at least.", parse);
				Text.NL();
				Text.Add("The hall is several stories high, and you emerge near the highest level. There’re ramparts running around the sides of the chamber on each level, allowing you to peer down below. A scrutiny shows that there’s no one on your level for the moment; everyone seems to have joined the party.", parse);
				Text.NL();
				Text.Add("Below, you see a mass of drakes. There’re long tables set out, laden with platters of raw meat and tankards of foul ale for the feasters. There’re two large fires roaring in the hall, lending warmth and light to the revelry. Near the back, there’s a platform with some strange form of stockade on it. You think you can spy several lizan women chained to it, but no one seems to be paying them any attention at the moment.", parse);
				Text.NL();
				Text.Add("Grex is the center of attention. Even from up here, you can recognize his guffaw, his scarred face, his cock-sure manners. You pull back, just in case he decides to look up your way, but he seems otherwise occupied. The soldiers below have formed a ring, in the middle of which Grex and another drake are slowly circling each other. Grex lunges, throwing a wild blow at his opponent, only narrowly missing. The other drake rears back, charging Grex with a huge club as he lets out a roar. Seemingly from nowhere, the scarred brute pulls out an evil looking dagger, stabbing his opponent in the side.", parse);
				Text.NL();
				Text.Add("The other drake gives, clasping his side painfully as he retreats. The pecking order has been re-established. <i>“Who’s next?”</i> Grex roars. <i>“The sooner you boys get back in line, the sooner we can start the party!”</i> Two more disgruntled drakes step forward, but they have little chance against Grex. The brute may be full of scars, but none of them are recent. He’s not one to make a mistake in battle, even when outnumbered.", parse);
				Text.NL();
				Text.Add("You let out a muffled yelp as a hand clamps over your mouth, but no one below takes note. <i>“What are you doing here?!”</i> Qin hisses in your ear. <i>“If someone finds you wandering around, things’ll turn really ugly. Come, quick, we don’t have a lot of time.”</i> Not seeing any reason to disagree with the kobold, you hurry after her. After narrowly avoiding an encounter with a drunk drake lurching by, you find yourself back in Grex’s quarters.", parse);
				Text.NL();
				Text.Add("<i>“That was a stupid thing to do,”</i> Qin admonishes you sharply. <i>“Right now you need to be brave, my lady, not rash.”</i> She leads you over to the bed, returning for a satchel that lies discarded by the door, presumably what she hurried away for in the first place.", parse);
				Text.NL();
				
				player.subDom.IncreaseStat(25, 1);
				
				opts.explore = true;
				
				FireblossomScenes.S1GrexPens(opts);
			}, enabled : true
		});
		options.push({ nameStr : "Wait",
			tooltip : "Best not get into even more trouble. Hopefully Qin will be back soon, then you can ask her how to get out of here.",
			func : function() {
				Text.Clear();
				Text.Add("You hate being cramped in here, the smell of Grex all around you, but going wandering is bound to end badly. Sighing dejectedly, you settle down and wait for Qin’s return. Minutes tick by, but they feel more like hours. Just when you are beginning to despair, the kobold returns. She’s walking a bit unsteadily, and there are stains of sticky white fluid dripping down from her maw.", parse);
				Text.NL();
				Text.Add("<i>“The guards gave me trouble on the way back,”</i> she explains her tardiness, wiping away the worst of it. <i>“They were adamant… but no matter. We have little time, my lady.”</i> The maid hurries over to you, carrying a satchel with her, presumably what she went to fetch in the first place.", parse);
				Text.NL();
				
				player.subDom.DecreaseStat(-25, 1);
				
				FireblossomScenes.S1GrexPens(opts);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}

	export function S1GrexPens(opts : any) {
		let player = GAME().player;
		let fireblossom = GAME().fireblossom;
		var parse : any = {
			
		};
		
		var fromRakkat = fireblossom.flags["Outset"] == FireblossomFlags.Outset.RakkatToGrex;
		
		Text.Add("Qin opens her satchel and brings out several vials and jars containing strange fluids and salves. You look at her bewildered and ask her how these are going to aid in your escape. The maid blinks at you.", parse);
		Text.NL();
		parse["e"] = fromRakkat ? "General" : "Envoy";
		Text.Add("<i>“I… I’m sorry, my lady. There are limits to what I can do. Here, in the capital - no, anywhere in the empire - rebelling against the dragons and their followers is impossible. There is no escape.”</i> She hangs her head sadly. <i>“I… wish it wasn’t so, my lady, but this is the will of the [e].”</i>", parse);
		Text.NL();
		Text.Add("I-is there nothing she can do? Your lip trembles, showing your fear.", parse);
		Text.NL();
		Text.Add("<i>“I can reduce the strain on your body and prepare you.”</i> Qin gestures to her ointments. <i>“With so little time, it will still be rough… but you should be able to avoid permanent damage.”</i> She opens up one of the jars, taking out a generous glob of creamy salve. <i>“Remove your clothes. Do not argue, if you value your safety.”</i>", parse);
		Text.NL();
		parse["e"] = fromRakkat ? "shredded remains of your dress" : "flimsy maiden’s dress";
		Text.Add("There’s an urgency in her words that makes you heed her request. She might be acting out of line, but there’s no doubt that if you have even a single friend in this entire city, she’s standing in front of you right now. You hurriedly disrobe, shrugging off the [e] and seating yourself according to the kobold’s instruction.", parse);
		Text.NL();
		Text.Add("<i>“Lay back, my lady,”</i> Qin murmurs. <i>“I’m sorry if I must be a bit rough, but Grex might return any minute. Endure, and you’ll thank me in the end.”</i> Without further delay, the kobold maid begins to apply the cold substance between your legs, rubbing on your nether lips and your tight rosebud.", parse);
		Text.NL();
		Text.Add("You gasp, shocked at her impertinence, but she pays little heed to your protests. Returning with even more of the cream, Qin thrusts the substance further into your orifices, roughly jabbing her fingers in where none has gone before. Admittedly not the first woman to do so this day, but where Xari was gentle, even sensual, Qin is all business.", parse);
		Text.NL();
		Text.Add("<i>“This one will act as lubricant,”</i> the kobold informs you. <i>“It will make applying the other ones easier, and lessen the pain somewhat.”</i> Another wad. You clench your teeth as the maid works it in, massaging both your holes vigorously. Stifling a moan, you ask what’s going to happen; what’s she ‘preparing’ you for?", parse);
		Text.NL();
		Text.Add("<i>“You remember all those times that Grex pulled me away during the journey?”</i> You nod numbly. <i>“The drakes are unfamiliar with the concept of being gentle. Kobolds and Lizans have certain advantages in this regard… a natural stretchiness. I’ll do the best I can in order to allow you something similar before they come for you.”</i>", parse);
		Text.NL();
		Text.Add("T-they are going to… come for you?", parse);
		Text.NL();
		Text.Add("<i>“They will, and soon.”</i> Qin opens a bottle containing an oily blue liquid, and pours some of it on her hand, then her forearm. <i>“When they do, they will mate with you, every one of them, until they are sated.”</i> The words fall like rocks, blocking off your escape. <i>“Brace yourself.”</i>", parse);
		Text.NL();
		Text.Add("You cry out, unable to restrain yourself any longer when the diminutive maid slowly pushes her entire hand into your pussy. She gives you precious little time to acclimate before pressing inward, thrusting with slow but relentless purpose. The kobold twists her arm back and forth, causing you to squirm and moan as she works the new liquid into you, pausing only to apply more oil to her arm.", parse);
		Text.NL();
		Text.Add("Brace and endure she says, but it’s easier said than done. You close your eyes and bite your lip, though you’re still unable to hold back your moans. Each violating thrust of her arm takes her deeper than the last. Through the haze of pain and pleasure, you wonder how it’s even possible for her to do what she does - you’re pretty sure your body isn’t built for this.", parse);
		Text.NL();
		Text.Add("This… w-what is she… ahh! Your vaginal muscles tighten, clasping around Qin’s arm as she presses against your cervix, prodding the entrance to your womb. A wave of raw orgasmic pleasure surges through your body, leaving you a shaking, moaning wreck. The maid patiently waits out your climax, then pulls out her arm. She pulls over a few pillows and props up your rear end. <i>“One final potion.”</i> She holds up a bottle with a swirling purple solution in it, pouring a generous serving of its contents into your gaping pussy. It’s like honey to your sore passage, smooth and soothing.", parse);
		Text.NL();
		Text.Add("The relief is only temporary though, as Qin once again brings out the oil, this time focusing on your ass. It’s a new and weird feeling, not altogether painful thanks to the salve, but nonetheless strange and alien. You brace and endure. After several more rounds of oil, you are granted the sweet, soothing relief of the purple potion. Exhaustion.", parse);
		Text.NL();
		Text.Add("The kobold maid tries not to show it, but she’s clearly worried for you. She gives you an encouraging smile. <i>“You’re doing good, lady Fireblossom. Are you ready for the next step?”</i>", parse);
		Text.NL();
		Text.Add("Your resolve wavers. There’s more?", parse);
		Text.NL();
		Text.Add("<i>“It will take several more applications of the oils. Once again, I’m sorry my lady, but we must work quickly. The more I can prepare you, the less the discomfort… later.”</i> You try to forget that part. Brace, endure. You’re still sore when she starts working more oil into your pussy, but it’s slowly becoming easier, to the point where it almost feels good… You’re not sure you know your own body any more; everything screams to you how wrong this is, how much it goes against your sensibilities. Your body seems to have other ideas, however.", parse);
		Text.NL();
		Text.Add("Another round of the honey, granting you relief. Quickly following, more oil, expanding and massaging your back passage, preparing it for intrusions it was never meant to accommodate. Brace, endure. Sweat is freely running down your body. More soothing honey.", parse);
		Text.NL();
		Text.Add("Qin closely studies your reaction. She doesn’t let up, rather opting to increase her pace when she judges you sufficiently prepared. Thus, there’s always constant strain, through your body is rapidly adapting to larger and larger insertions. When the kobold finally manages to insert a second arm, you writhe helplessly, riding out the climax. Qin doesn’t even pause in her intimate massage. The kobold is growing more and more anxious, throwing glances at the door each time there’s a noise outside.", parse);
		Text.NL();
		Text.Add("<i>“Good, good, you are strong, my lady,”</i> the maid praises you. You moan a weak response, shivering as you are rewarded with another dose of honey. By now, both your holes are constantly gaping wide, to the point you’re not sure they’ll ever tighten again. <i>“We are making good progress. With a few more treatments, you should-”</i>", parse);
		Text.NL();
		Text.Add("Qin trails off as heavy steps echo in the corridor outside, announcing your impending doom. Grex kicks open the door, draining the last of a tankard of ale down his gullet and discarding it carelessly in a corner. The drake grins widely as he drinks in the sight of you on your back, exhausted and with legs spread and both your holes gaping.", parse);
		Text.NL();
		Text.Add("<i>“Don’t you look the proper princess,”</i> he guffaws. <i>“The boys’ll love a tasty and exotic morsel like you... once I’m done, that is.”</i> He snaps at Qin. <i>“Get little Fireblossom on her feet, we’re going.”</i> He tosses over a leather collar, trailing a long metal chain. <i>“A gift for you, some pretty jewelry for the penmaster’s bitch!”</i> He roars with laughter as you unsteadily get up. Qin stands on her toes on the bed behind you, fastening the wretched thing around your neck. Now you are a slave in both name and reality.", parse);
		Text.NL();
		Text.Add("<i>“Endure,”</i> the kobold whispers to you. <i>“I will be there with you.”</i>", parse);
		Text.NL();
		Text.Add("Were you not so distraught, you’d put further thought to why the maid goes to such efforts to help you. Right now, all you can think about is the den of brutes waiting to ravage you. There’s a tug on the leash. Your master is calling. You start walking.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			if(opts.explore)
				Text.Add("Your steps are heavy as you retrace to the edge of the feasting hall, all but dragged along by Grex. The collar chafes, but the band around your neck is merely a minor humiliation; you’d gladly wear it for the rest of your life it you could avoid the night ahead of you.", parse);
			else
				Text.Add("Your steps are heavy as you follow behind Grex, dragged along by the leash. He takes you toward the roaring revelry, emerging on the top level of a multi-tiered hall full of his ilk. Tables laden with platters of raw meat and tankards of foul-smelling ale line the hall. There’re two roaring fires, throwing giant shadows of the carousing drakes, making them seem like ancient creatures out of legend.", parse);
			Text.NL();
			Text.Add("Grex takes you down a step of stairs, descending into the pit below. The revelry gradually quietens down as all eyes turn to you. The scarred drake drags you along, pausing to let Qin help you regain your feet when you stumble. He brings you to a raised platform at the opposite end of the hall containing a stockade of sorts, and several chained lizan slaves.", parse);
			Text.NL();
			Text.Add("<i>“When I told you that Grex the undefeated had bested the Grand Spirit Aria herself, you doubted!”</i> Grex roars, silencing the crowd. <i>“Feast your eyes on the prize, brothers!”</i>", parse);
			Text.NL();
			Text.Add("There’s nervous shuffling in the ranks. <i>“I hear she can obliterate someone with a single thought,”</i> someone mutters, and there’s agreement from other drakes. <i>“Look her in the eyes, and one is blinded.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I’ve mounted her every single day while bringing her back from the campaign, she holds no such powers,”</i> Grex boasts. <i>“I’ll fuck her right here and you’ll see.”</i> He swivels his head around, gauging the mood. <i>“Are the bunch of you just superstitious craven wimps?!”</i> he roars in challenge. <i>“Does the sight of this creature not stir your shrivelled cocks?”</i>", parse);
			Text.NL();
			Text.Add("The scarred drake janks your chain, fastening it to the stockades. <i>“On all fours, ‘Aria’,”</i> he rumbles, giving you a sharp slap on your bared bottom. Qin hurries past you, busying herself with applying the stretching oil on something immense between Grex’s hind legs… you shudder and avert your eyes.", parse);
			Text.NL();
			Text.Add("The glinting eyes of the audience drill into you as you stand there naked on hands and knees. Grex moves up behind you, and you feel the rough scales of his underbelly drag against your back. His massive, clawed forefeet paw at the ground on either side of you. You wince as something pointed and impossibly huge pokes your sore pussy… then he lunges forward.", parse);
			Text.NL();
			Text.Add("Not even Qin using both her arms can compare to the sheer girth of Grex’s monster. Never in your life have you felt so full, stretched to and well beyond your physical limit. The apprehensive crowd lets out a roar when you moan and whimper helplessly as the scarred drake takes you, his position of power verified once again. The outline of his cock is clearly visible on your stomach for all to see.", parse);
			Text.NL();
			Text.Add("He ruts you like the beast he is, each thrust burrowing deeply inside your abused cunt and ramming against the entrance of your womb. You lose track of time, the room and the jeering drakes swirling around you, your entire world focused on the shaft repeatedly re-adjusting your internal organs. Thanks to Qin’s preparations, you are able to take it, but you know not for how long. Despite your own revulsion, your treacherous body rebels against you, relishing in your conquering.", parse);
			Text.NL();
			Text.Add("Grex roars, pouring his greatest humiliation yet into your pussy. Gallons of hot seed flood your womb, quickly overflowing and soaking the ground beneath you. You gasp and tremble as he rides out his climax, every twitch of his massive cock causing you to wince. <i>“One down, one to go,”</i> he rasps to you below the din of the cheering crowd.", parse);
			Text.NL();
			Text.Add("Your gaping, leaking pussy is presently vacated, only for Grex to shove himself back inside, this time claiming your protesting asshole. The only thing you can do is to repeat your mantra: Endure. You’d have collapsed if not for the drake holding you by the leash. Before the cheering crowd, he claims, brutalizes and fills you with his seed a second time. Your stomach bloats, straining to contain his hot semen.", parse);
			Text.NL();
			Text.Add("<i>“The only power that remains vested to this Goddess is the power to sate my cock!”</i> Grex proclaims. He dismounts you, the removal of his member releasing a deluge of trapped ejaculate. <i>“No longer shall you call her Aria and pray to her; her new name shall be Fireblossom, and her purpose in life shall be to be our cumdumpster!”</i>", parse);
			Text.NL();
			Text.Add("As you lie on the ground shaking, Grex pads over and hoists up Qin in one hand, displaying her to the drakes. <i>“This second gift I present you with! This here is the most naughty little kobold you’ve ever met, don’t let her small frame fool you! I’m betting she’ll outlast every one of you weaklings. Now, LET’S PARTY BOYS!”</i>", parse);
			Text.NL();
			Text.Add("The rest of the night is a confused jumble. You, Qin and the lizan slaves are fucked again and again by the horde of drakes, until you feel that your abused holes will never stop gaping. Finally, blissful darkness descends.", parse);
			Text.Flush();
			
			player.slut.IncreaseStat(100, 5);
			player.subDom.DecreaseStat(-100, 5);
			fireblossom.grexRel++;
			fireblossom.qinRel++;
			
			fireblossom.flags["State"] = FireblossomFlags.State.S2GrexPet;
			
			Gui.NextPrompt(FireblossomScenes.Outro);
		});
	}
}
