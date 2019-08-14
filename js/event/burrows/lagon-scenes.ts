import { GAME, TimeStep, WORLD } from "../../GAME";
import { Text } from "../../text";
import { BurrowsFlags } from "../../loc/burrows-flags";
import { Gui } from "../../gui";
import { LagonFlags } from "./lagon-flags";
import { Sex } from "../../entity-sex";
import { EncounterTable } from "../../encountertable";
import { BodyPartType } from "../../body/bodypart";
import { Gender } from "../../body/gender";
import { Lagomorph, LagomorphBrute, LagomorphWizard, LagomorphElite } from "../../enemy/rabbit";
import { PregnancyHandler } from "../../pregnancy";
import { QuestItems } from "../../items/quest";
import { OpheliaBrute } from "./ophelia";
import { Time } from "../../time";
import { Encounter } from "../../combat";
import { SetGameState, GameState } from "../../gamestate";
import { SetGameOverButton } from "../../main-gameover";
import { Party } from "../../party";
import { VenaScenes } from "./vena-scenes";
import { OpheliaFlags } from "./ophelia-flags";
import { Race } from "../../body/race";
import { Entity } from "../../entity";
import { LagonRegular, LagonBrute } from "./lagon";

let OpheliaScenes : any;
export function InitLagon(opheliaScenes : any) {
    OpheliaScenes = opheliaScenes;
}

export namespace LagonScenes {

    export function LagonImpregnate(mother : Entity, slot? : number) {
        let lagon = GAME().lagon;
        mother.PregHandler().Impregnate({
            slot   : slot || PregnancyHandler.Slot.Vag,
            mother : mother,
            father : lagon,
            race   : Race.Rabbit,
            num    : 5,
            time   : 20 * 24,
            load   : 4
        });
    }

    export function InteractRuler() {
        let lagon = GAME().lagon;
        let burrows = GAME().burrows;
        var parse : any = {
            
        };
        
        Text.Clear();
        Text.Add("Lagon, the king of the rabbits, holds court in his throne room amidst a mound of riches, treasures and junk gathered from the outside world. He’s lounging on his throne with a bored look on his face and a submissive daughter tending to his cock.", parse);
        Text.NL();
        if(lagon.Relation() < 0)
            Text.Add("<i>“And what do you want?”</i> Lagon looks annoyed at your approach, seeming far more interested in the blowjob he’s getting.", parse);
        else if(lagon.Relation() < 25)
            Text.Add("<i>“Traveler,”</i> Lagon gives you a nod, caressing his daughter’s bobbing head.", parse);
        else if(lagon.Relation() < 50)
            Text.Add("<i>“Welcome back,”</i> Lagon smiles, motioning you to step forward. <i>“I’m almost finished with this one, perhaps you’d like to take her place?”</i> You blush uncertainly.", parse);
        else
            Text.Add("<i>“Ah, my favorite little slut,”</i> Lagon grins, waving for you to come sit at his feet. You eagerly crawl forward, seating yourself before the throne, head in your master’s lap.", parse);
        Text.NL();
        if(burrows.LagonAlly())
            Text.Add("<i>“So good to see you again,”</i> he almost purrs. <i>“Any more insurgents you’d like to report?”</i>", parse);
        else if(burrows.flags["Access"] >= BurrowsFlags.AccessFlags.Stage3)
            Text.Add("<i>“You did a fine job bringing all the ingredients to my daughter. Are you perhaps looking for more work? The Pit should have a few spots open, if you’re into that.”</i>", parse);
        else {
            parse["more"] = burrows.flags["Access"] >= BurrowsFlags.AccessFlags.Stage1 ? " more" : "";
            Text.Add("<i>“Have you found any[more] ingredients for Ophelia? If so, bring them to her so she can prepare them.”</i>", parse);
        }
        Text.Flush();
        
        LagonScenes.RulerPrompt();
    }

    export function RulerPrompt() {
        let player = GAME().player;
        let lagon = GAME().lagon;
        let burrows = GAME().burrows;
        var parse : any = {
            playername : player.name
        };
        parse["stuttername"] = player.name[0] +"-"+ player.name;
        
        //[Talk][Sex] ( [Usurp] )
        var options = new Array();
        options.push({ nameStr : "Talk",
            func : function() {
                Text.Clear();
                if(lagon.Relation() < 0)
                    Text.Add("<i>“Make it quick, I’m busy,”</i> he responds shortly. It doesn’t look like the king appreciates you butting into his affairs.", parse);
                else if(lagon.Relation() < 50)
                    Text.Add("<i>“And what would you ask?”</i> Lagon prompts, a bored expression on his face. It looks like he’s far more interested in his blowjob than in any questions you could possibly have.", parse);
                else
                    Text.Add("<i>“And what thoughts have gone through your vapid little head?”</i> Lagon queries, scratching said head fondly.", parse);
                Text.Flush();
                
                LagonScenes.RulerTalkPrompt();
            }, enabled : true,
            tooltip : "There’s something you want to ask the king."
        });
        options.push({ nameStr : "Sex",
            func : function() {
                Text.Clear();
                var first = !(lagon.flags["Talk"] & LagonFlags.Talk.RegularSex);
                if(first) {
                    Text.Add("Feeling a bit apprehensive, you ask the king if he might be interested in having sex with you.", parse);
                    Text.NL();
                    parse["mister"] = player.mfFem("mister", "miss");
                    if(lagon.Relation() < 0)
                        Text.Add("A slow grin spreads on Lagon’s lips, and he chuckles heartily. <i>“Now that is more like it! You’ve been a bit of a pain in my side ever since you arrived here, you know. By all means, I’d love the opportunity to exact some ‘punishment’ for little [mister] high and mighty...”</i> He catches your flinch. <i>“Not what you were looking for? Maybe you shouldn’t have mouthed back.”</i>", parse);
                    else if(lagon.Relation() < 25)
                        Text.Add("<i>“Such a pleasant surprise, my little agent has a crush on me!”</i> Lagon taunts, grinning widely. <i>“Well, far be it from the king to deny such a heartfelt request from his loyal subject.”</i>", parse);
                    else
                        Text.Add("<i>“Why [playername], I was wondering how long you were going to keep moping around like a maiden waiting to be deflowered,”</i> Lagon grins, amused that you’ve finally come around to his point of view.", parse);
                }
                else {
                    if(lagon.Relation() < 0)
                        Text.Add("<i>“You still have a ways to go if you want to be in my good graces,”</i> Lagon lazily drawls. <i>“I’m expecting that you put in some effort this time - instead of trying to put me to sleep.”</i>", parse);
                    else if(lagon.Relation() < 25)
                        Text.Add("<i>“Back for more? Not that I’m surprised.”</i> The lagomorph king flashes you a knowing grin. <i>“Know that my schedule is packed; you should be grateful that I spend any time on one such as you.”</i>", parse);
                    else if(lagon.Relation() < 50)
                        Text.Add("<i>“Back for another taste of my cock?”</i> Lagon jibes heartily, giving you a knowing grin. <i>“Don’t be ashamed; you and the rest of the burrows have wet dreams of being fucked by me… some just happen to be luckier than others. I’m going to make you a very lucky bitch indeed,”</i> he adds fondly.", parse);
                    else
                        Text.Add("<i>“Of course, my little slut,”</i> Lagon replies fondly. <i>“You’re quickly growing into one of my favorites fucktoys. Such willingness and unabashed perversion should not go unrewarded.”</i>", parse);
                }
                Text.NL();
                Text.Add("<i>“So, how do you wish to be taken?”</i> You gulp, your eyes straying to the king’s massive shaft; at about fifteen inches long and three inches thick, it looks absurdly big on his relatively small frame.", parse);
                Text.Flush();
                LagonScenes.RulerSexPrompt();
            }, enabled : true,
            tooltip : "Proposition Lagon for sex."
        });
        /* TODO
        options.push({ nameStr : "name",
            func : function() {
                Text.Clear();
                Text.Add("", parse);
                Text.NL();
                Text.Flush();
            }, enabled : true,
            tooltip : ""
        });
        */
        if(burrows.flags["Access"] >= BurrowsFlags.AccessFlags.Stage3 && !burrows.LagonAlly()) {
            options.push({ nameStr : "Usurp!",
                func : function() {
                    Text.Clear();
                    Text.Add("Uh... are you sure that you’re ready for this? Once you go up against Lagon, there’s no turning back.", parse);
                    Text.Flush();
                    
                    var options = new Array();
                    options.push({ nameStr : "Do it!",
                        func : function() {Text.Clear();
                            Text.Add("<i>“And what can I do for you today, traveler?”</i> Lagon leisurely regards you with a bored expression. <i>“I believe that you already bought all the needed ingredients to Ophelia; I do not have any further requests for your currently.”</i> He shakes his head. <i>“I feel the girl grows rebellious. Perhaps it’s time to throw her in the Pit together with her mother, as I should have done long ago.”</i>", parse);
                            Text.NL();
                            Text.Add("He’ll do no such thing. The king’s eyebrows rises in question, as if he doesn’t quite understand what he’s hearing. <i>“I was thinking out loud, not asking for advice, traveler,”</i> he rests his chin on his knuckles, studying you. <i>“Do you presume to tell me what to do? What kind of nonsense has that girl been feeding you?”</i>", parse);
                            Text.NL();
                            Text.Add("You contemptuously tell him that you can see him for what he is; a savage beast that needs to be put down. Fury fills Lagon’s eyes, but before he can reply, your conversation is interrupted by the arrival of Ophelia, flanked by two guards.", parse);
                            Text.NL();
                            Text.Add("<i>“Y-you called for me, father?”</i> she falters, her gaze flickering between the two of you, locked in your staredown. The king is the first to break eye contact, casting his furious glare at his daughter.", parse);
                            Text.NL();
                            Text.Add("<i>“You!”</i> he screams, jumping to his feet, his face dark with rage. <i>“This fucking rebellious bullshit ends now! I’m throwing you into the fucking Pit for the rest of your damned life you sneaky little bitch!”</i> He starts making for her, but you step into his way.", parse);
                            Text.NL();
                            Text.Add("<i>“[stuttername]... this… please… no...”</i> Ophelia stammers. <i>“You can’t, I told you he’s too strong!”</i> This apparently doesn’t earn her any favors with daddy.", parse);
                            Text.NL();
                            Text.Add("<i>“Seize her, I’ll deal with her later! You three… take care of this cretin.”</i> Lagon hops back onto his throne as his guards rush to intercept you, his gaze drilling into you. <i>“As for you… when I’m done with you, you’ll be begging for me to throw you in the pit.”</i>", parse);
                            Text.NL();
                            Text.Add("It’s a fight!", parse);
                            Text.Flush();
                            
                            Gui.NextPrompt(function() {
                                LagonScenes.Usurp(false);
                            });
                        }, enabled : true,
                        tooltip : "You’re ready to take him on!"
                    });
                    options.push({ nameStr : "No",
                        func : function() {
                            Text.Clear();
                            Text.Add("You reconsider. Attacking right now would be foolhardy.", parse);
                            Text.Flush();
                            LagonScenes.RulerPrompt();
                        }, enabled : true,
                        tooltip : "On second thought..."
                    });
                    Gui.SetButtonsFromList(options, false, null);
                }, enabled : true,
                tooltip : "Lagon’s reign has gone on long enough! Scepter or no scepter, he’s going down!"
            });
        }
        Gui.SetButtonsFromList(options, true);
    }

    //TODO
    export function RulerSexPrompt() {
        let lagon = GAME().lagon;
        var parse : any = {
            
        };
        
        //[Blowjob][Get fucked][The Pit][(Back)]
        var options = new Array();
        options.push({ nameStr : "Blowjob",
            func : function() {
                lagon.flags["Talk"] |= LagonFlags.Talk.RegularSex;
                LagonScenes.RulerBlowjob();
            }, enabled : true,
            tooltip : "Ask the king for permission to suck his cock."
        });
        options.push({ nameStr : "Get fucked",
            func : function() {
                lagon.flags["Talk"] |= LagonFlags.Talk.RegularSex;
                Text.Clear();
                Text.Add("You tell him that you want him to mount you and make you his bitch, to fuck you with that amazing cock of his. Judging from his expression, those were just the right words to use.", parse);
                Text.NL();
                if(lagon.Relation() < 0)
                    Text.Add("<i>“I must say, outsider, despite your reluctance, you adopt very quickly to our ways,”</i> the king smiles. <i>“Very well, I shall grace your request... ”</i> Yawning leisurely, he pushes away his daughter, who tries to get one last taste of his shaft before being chased off.", parse);
                else if(lagon.Relation() < 50)
                    Text.Add("<i>“As you wish,”</i> Lagon replies languidly. <i>“I’ll grant your request, traveler… but I won’t listen to any last minute change-of-hearts.”</i> The king waves his daughter away, and she reluctantly relinquishes his shaft, throwing you a jealous glare over her shoulder as she hops away.", parse);
                else
                    Text.Add("<i>“My children are getting jealous; you keep hogging me all to yourself,”</i> Lagon replies, grinning. Sure enough, the daughter that’s giving him a blowjob throws you a dark glare before she reluctantly hops off, in search for some other release. <i>“I’d be a bad host if I didn’t grant such an earnest request, however.”</i>", parse);
                Text.Add(" You gulp, an excited shiver going through your body.", parse);
                Text.NL();
                LagonScenes.RulerGetFuckedEntrypoint(false);
            }, enabled : true,
            tooltip : "Offer your body to the king, beg for him to use you like the bitch you are."
        });
        /* TODO
        options.push({ nameStr : "name",
            func : function() {
                Text.Clear();
                Text.Add("", parse);
                Text.NL();
                Text.Flush();
            }, enabled : true,
            tooltip : ""
        });
        */
        Gui.SetButtonsFromList(options, true, function() {
            Text.Clear();
            Text.Add("...On second thought… you’ve changed your mind.", parse);
            Text.NL();
            Text.Add("<i>“No one likes a tease,”</i> Lagon frowns. <i>“Don’t come waltzing up to the king offering yourself, only to pussy out the last moment. Now,”</i> he waves you off, roughly shoving his cock in his daughter’s protesting throat. <i>“If you don’t mind, I have an itch to scratch, and since you’re obviously not interested in taking care of it, you can fuck off.”</i>", parse);
            Text.NL();
            Text.Add("With that, you are dismissed.", parse);
            Text.Flush();
            
            lagon.relation.DecreaseStat(-10, 3);
            
            Gui.NextPrompt();
        });
    }

    export function RulerBlowjob() {
        let player = GAME().player;
        let lagon = GAME().lagon;
        var parse : any = {
            
        };
        
        Text.Clear();
        if(player.Slut() < 30)
            Text.Add("Damn… he’s huge. Perhaps starting with a blowjob would be best… You hesitantly offer the king your mouth and your tongue for his use.", parse);
        else if(player.Slut() < 60)
            Text.Add("Your mouth water when you throw a glance at Lagon’s impressive member; at his swollen balls, heavy with his tasty seed. Trying to act nonchalant about it, you offer to give the king a blowjob.", parse);
        else
            Text.Add("You can’t wait to wrap your lips around the lapin king’s magnificent cock and drink up every drop of his royal seed. Trying to make your voice as sultry as you can, you beg Lagon for permission to relieve his stress with your mouth, your eyes locked on your prize.", parse);
        Text.NL();
        var messy = false;
        if(lagon.Relation() < 0) {
            Text.Add("<i>“By all means,”</i> he replies in a bored voice. <i>“You’ll have to wait your turn though.”</i> He caresses his daughter’s head fondly, coaxing her to swallow more and more of his length. <i>“Come here,”</i> he idly waves you over, pointing at the base of his throne. <i>“Kneel while in attendance to your king.”</i>", parse);
            Text.NL();
            Text.Add("Fighting back your blush, you do as he asks, seating yourself at his feet while the lapin leans back, sighing in pleasure while his daughter works her magic. Somehow, him ignoring you after your offer makes it all the more humiliating… as if you’re not even worthy of sucking his cock. Now and then, you catch him glancing at you, his lip curled into a taunting sneer. You scowl - he’s definitely enjoying every second of this.", parse);
            Text.NL();
            Text.Add("<i>“Hey, slut,”</i> he grunts, prodding you with his foot and bringing you out of your reverie. <i>“Make yourself useful,”</i> he grunts, gesturing to his sack. Very well, if that’s where he wants you… You lean in, cupping his heavy balls and giving them a long lick. A great throb goes through his scrotum, spreading to his shaft and making the female lagomorph at your side give out a muffled squeal of delight.", parse);
            Text.NL();
            Text.Add("The king’s crotch gives off a heady smell of musk, enough to make your head spin. He reeks of masculinity and dominance, and he’s about to make you his bitch. <i>“Unf - Yeah baby, get ready for my load,”</i> Lagon grunts as another throb pulses through his cock, announcing his impending climax. The girl beside you shivers in delight, gulping greedily as her king pours great gouts of thick bunny semen down her overstuffed gullet.", parse);
            Text.NL();
            Text.Add("At first, she does an admirable job at swallowing, but Lagon’s output eventually becomes too much for her. Wet splatters of cum drip on your forehead as thick rivulets of excess seed trickle down the lapin’s throbbing dick, pooling on top of his balls before they cascade down on your face. Just when you thought you couldn’t become more of a mess, the king suddenly pulls his daughter away, grabbing you roughly by the nape of your neck and aiming his still-ejaculating bunny-cock right at you. Several shots later, your entire front is covered in crisscrossing strands of jizz, leaving you gasping for air.", parse);
            Text.NL();
            Text.Add("<i>“A taste,”</i> Lagon chuckles as you cough. <i>“You’ll be getting plenty more of that in a moment. Now, clean me up.”</i> You make a half-hearted effort at cleaning yourself up before you move on to his flaccid shaft, licking up the thick white goo sticking to it. As you work, you can feel the turgid tool twitch under your tongue, engorging back to its full size in a remarkably short time.", parse);
            Text.NL();
            Text.Add("<i>“Let’s see if you can match my daughter, traveler,”</i> Lagon grins down at you. <i>“Somehow, I doubt it. Don’t make me fall asleep now.”</i> His cock twitches in your grip as he shifts in his seat.", parse);
            
            player.subDom.DecreaseStat(-30, 1);
            messy = true;
        }
        else if(lagon.Relation() < 50) {
            Text.Add("<i>“Not quite what I had in mind, but it’ll have to do,”</i> Lagon jests. He gives his daughter a pat on the head. <i>“You, run off now. Don’t pout like that, you can sit on daddy’s cock after I’m done with this one.”</i> She steals one last lick of pre before hopping away, letting you have a go at her father’s glistening shaft.", parse);
            Text.NL();
            Text.Add("Lagon throws a glance after her. <i>“Sluts like her are a dime a dozen down here… diligent but predictable. It shall be interesting to see what kind of techniques you’ve learned on the surface.”</i> He gestures at you imperiously. <i>“Approach your king and pay your respects.”</i>", parse);
            Text.NL();
            Text.Add("Swallowing your doubts, you kneel between the powerful lapin’s legs, licking your lips in anticipation. Lagon’s erect member is glistening from his interrupted blowjob, and for all his lofty attitude, he looks anxious for you to get started, fighting his urge to spring on you and bend you over. Better begin before he changes his mind.", parse);
        }
        else {
            parse["phisher"] = player.mfTrue("his", "her");
            Text.Add("<i>“Of course, far be it from me to keep my slut from [phisher] prize,”</i> Lagon grins, waving you over. His daughter huffs, but knows when she’s not wanted. She gives the king’s cock one final lick, relishing in a taste of his pre before she hops off, throwing you a jealous glare.", parse);
            Text.NL();
            Text.Add("You eagerly scoot over so that you’re positioned between your king’s legs, kneeling at the altar of his fleshy obelisk as you prepare to worship it. Lagon rests his chin in his palm, looking down on you with a pleased smile playing on his lips as he waits for you to begin.", parse);
        }
        Text.NL();
        LagonScenes.RulerBlowjobEntrypoint();
    }

    export function RulerBlowjobEntrypoint() {
        let player = GAME().player;
        let lagon = GAME().lagon;
        let burrows = GAME().burrows;
        var p1cock = player.BiggestCock();
        
        var parse : any = {
            playername : player.name
        };
        
        parse = player.ParserTags(parse);
        parse = Text.ParserPlural(parse, player.NumCocks() > 1);
        
        if(p1cock) {
            parse["cock"]    = function() { return p1cock.Short(); }
            parse["cockTip"] = function() { return p1cock.TipShort(); }
        }
        
        Text.Add("<i>“That’s a good little slut,”</i> Lagon hisses, stretching languidly as you take his turgid shaft into your mouth. Pre splatters onto your [tongue] as you try to stretch your jaws around his massive girth; just getting the head in is an ordeal. You lovingly stroke your [hand]s along his length, tracing the bulging veins on his royal scepter.", parse);
        Text.NL();
        
        Sex.Blowjob(player, lagon);
        player.FuckOral(player.Mouth(), lagon.FirstCock(), 3);
        lagon.Fuck(lagon.FirstCock(), 3);
        
        Text.Add("The lagomorph king is so big that merely attempting to cover his glans has him poking at the back of your throat - and there’s a whole lot more to go before you’ve taken all of him. Determined to not be outclassed by Lagon’s daughter - despite her dainty frame, the girl was able to take more than half of his length without struggling - you slowly start bobbing your head, each time forcing a little more of it down your gullet.", parse);
        Text.NL();
        Text.Add("You tense up as you feel a massive paw on the back of your head, but for now, the lapin seems content with letting you do your thing, merely caressing your [hair]. It’s an agonizingly slow process to get used to his jaw-straining girth, but the king is in no hurry. No doubt, he could keep you here all day for no other reason than to flaunt his dominance over you.", parse);
        Text.NL();
        var opheliaPresent = false;
        if((burrows.LagonAlly() == false) && (Math.random() < 0.3)) {
            Text.Add("Some indeterminate time later you hear a polite cough behind you, rousing the king from his reverie. You try to turn your head to see who it is, but Lagon’s hand keeps you right where he wants you to be, between his legs and with ten inches of cock jammed down your throat.", parse);
            Text.NL();
            Text.Add("<i>“Can’t you see I’m busy, daughter?”</i> he growls, lazily scratching you on the head. <i>“As a ruler, I must keep up diplomatic ties with the surface dwellers, don’t you agree?”</i>", parse);
            Text.NL();
            Text.Add("<i>“Is that… [playername]?”</i> replies a female voice you quickly recognize as Ophelia. Your cheeks burn, but you angrily dismiss the twinge of shame; hasn’t she been in this exact situation countless times before? Who is she to judge you, when it all comes down to it?", parse);
            Text.NL();
            Text.Add("<i>“Indeed it is. We have such a good deal worked out, haven’t we, pet?”</i> Lagon continues relentlessly. <i>“You go out into the world and fetch me things, and I allow you to worship at the altar of my cock. Everyone is happy.”</i> He stretches, shuffling on his seat and inadvertently - scratch that, considering who it is, probably advertently - jamming the rest of his shaft down your protesting throat. <i>“Now, what did you want?”</i>", parse);
            Text.NL();
            
            var scenes = new EncounterTable();
            scenes.AddEnc(function() {
                Text.Add("<i>“I- uh, I had new potion I wanted to show, the effects are quite interesting-”</i>", parse);
            }, 1.0, function() { return true; });
            scenes.AddEnc(function() {
                Text.Add("<i>“I’m in need of some more supplies from the surface-”</i>", parse);
            }, 1.0, function() { return true; });
            scenes.AddEnc(function() {
                Text.Add("<i>“Ah… I could use some more volunteers, the latest bunch all-”</i>", parse);
            }, 1.0, function() { return true; });
            
            scenes.Get();
            
            Text.Add(" the alchemist starts uncertainly, only to be cut off by her father.", parse);
            Text.NL();
            Text.Add("<i>“If it’s no more important than that, it can wait,”</i> he interrupts her. <i>“I’m sure you can have some fun with your brothers over there while I... finish my business. Stay, but stay quiet. Depending on how well my little pet performs, I may have need of you afterward.”</i>", parse);
            Text.NL();
            Text.Add("Out of the corner of your eye, you see Ophelia demurely walk over to join the harem nearby, absentmindedly swatting away one of her horny brothers who makes a grab for the alchemist. With yet another person joining your audience, you try to clear your mind and focus on the task at hand.", parse);
            Text.NL();
            opheliaPresent = true;
        }
        Text.Add("You’re not sure how much time you spend there, worshipping the powerful alpha male’s massive dick. Your head grows foggy from his musk, and the powerful taste on your [tongue] doesn’t make things any easier… and when he finally comes… You shiver as you imagine immense cascades of thick seed flowing down your throat, making your stomach bulge obscenely. Even more imaginary ropes of hot bunny-batter splash on your upturned face, soaking you from head to toe in royal cum, unmistakably marking you as his.", parse);
        Text.NL();
        if(player.FirstCock()) {
            Text.Add("Your own [cocks] [isAre] stiff despite yourself, though you know that the chance that you will actually get to use [itThem] are close to nil. The best [itThey] can hope for from Lagon is a brutal prostate-pounding.", parse);
            Text.NL();
        }
        if(player.FirstVag()) {
            Text.Add("Your moist nether lips ache for this magnificent shaft; and you wonder what it’d feel like to have him just throw you on your back and take you. If your mouth weren’t filled to the brim, you might even have voiced your longing.", parse);
            Text.NL();
        }
        
        player.AddLustFraction(0.4);
        
        if(player.sex.gBlow < 10) {
            Text.Add("None of that can take away from the fact of how hard this is on you, though. You’re barely used to giving blowjobs, and this monster of a cock isn’t making things any easier for you. It’s a struggle to keep sucking it for long, and your eyes are watering from the constant strain.", parse);
            Text.NL();
            Text.Add("<i>“Pathetic,”</i> Lagon sighs, shaking his head disapprovingly. <i>“Breaking in virgin sluts can be fun, but you have to do so much work yourself.”</i> Rolling his shoulders, the king hops to his feet, janking your jaw with him. You look up at him, a sinking feeling growing in your stomach. The lapin flashes you a malicious grin, grasping your head in both hands. <i>“Buckle up, slut, daddy’s going to take you for a ride.”</i>", parse);
            Text.NL();
            parse["h"] = player.HasHair() ? ", gently at first, but soon the hand closes into a fist, tugging you along whether you wish or not" : "";
            Text.Add("Once he gets started, he doesn’t hold back at all. One paw is lodge firmly at the back of your head, the other stroking your [hair][h]. Your jaw aches as the lagomorph roughly fucks your throat, his hips moving back and forth in a blur as he thrusts. It doesn’t matter that you aren’t trained in this, Lagon’s methods quickly show results in the shape of your lips being repeatedly pressed against his crotch, an impossible amount of turgid flesh clogging your gullet.", parse);
            Text.NL();
            Text.Add("You can hardly breathe through the frenzied fucking, and you think you can see stars. That’s not right, you are underground, there shouldn’t be any stars… You throw back your head and gasp for air as you’re allowed a brief respite, but you know you can’t keep this up for long. ", parse);
            if(opheliaPresent)
                Text.Add("Out of the corner of your eye, you can see Ophelia throwing you a pitying glance. ", parse);
            Text.Add("Before you can voice your concerns, your mouth is full of cock again, breaching your throat like a battering ram. Your eyes are filled with silent pleading for this to end as you look up at your tormentor. One way or another, it looks like your wish will be fulfilled.", parse);
            Text.NL();
            Text.Add("<i>“Ngh- about to bust a nut down that tight throat of yours,”</i> Lagon grunts. <i>“Get ready for your filling, slut!”</i> Not like you have a choice. You resign yourself to your fate and wait patiently for his load, anxious for your training-session to be over.", parse);
            Text.NL();
            LagonScenes.RulerBlowjobSwallowEntrypoint(opheliaPresent);
            return;
        }
        else if(player.sex.gBlow < 25) {
            Text.Add("<i>“Not bad for a surface dweller,”</i> Lagon compliments you, languidly leaning back. <i>“You’re not the first one to come by… the others were just a lot less competent and much more combatative. Once I tired of them, I gave them to my children. They’re probably still somewhere in the Pit, endlessly fucked by my sons and daughters.”</i> The king caresses your [hair] fondly, smiling down at you as you bob your head.", parse);
            Text.NL();
            Text.Add("<i>“You’re not like that though, are you pet? You will continue to be useful and loyal to me, won’t you?”</i> His voice is silk and honey, but the hand on the back of your head is suddenly a lot less gentle. <i>“As long as you do, you can get as much cock as you can swallow; from a king, no less.”</i> Your eyes meet, and a silent understanding pass between you. You won’t cross him. The pressure eases.", parse);
            Text.NL();
            Text.Add("<i>“Very good… now keep doing that.”</i> He’s rock hard, making it all the more difficult to fit his length down your throat, but you persevere. Lagon continues toying with your [hair], looking down on you with smug contentment.", parse);
            if(opheliaPresent)
                Text.Add(" Out of the corner of your eye, you see Ophelia watching the two of you, an unreadable expression on her face.", parse);
            Text.NL();
            Text.Add("You use your hands in order to make it feel better for him, excitedly stroking whatever cockflesh you’re unable to cover with your mouth. As you jerk him, your [hand] brushes against his heavy balls, and you feel a tremor rush through them. The king is close to climax, you realize. All that remains is to finish it.", parse);
        }
        else {
            Text.Add("<i>“I must say, you’ve picked up some rather interesting techniques on the surface, my little slut,”</i> Lagon sighs languidly, patting you on the head. Oh, you’ll show him about interesting techniques. In one smooth motion, you’ve swallowed the entirety of his length, lodging it firmly down your throat. Just as quickly, you pull back until only the bulbous head of the king’s shaft remains in your mouth. Setting a rhythm, you bob your head up and down rapidly, lavishing in the king’s surprised gasps.", parse);
            Text.NL();
            Text.Add("Just when you he’s starting to build toward his explosive climax, you grasp him by his root and pull him out of your mouth. ", parse);
            if(player.FirstBreastRow().Size() > 15)
                Text.Add("Lagon’s angry growl is silenced when you bare your [breasts], sultrily wrapping them around his glistening member. Using your ample bosom to jerk him off, you once again wrap your lips around his tip.", parse);
            else
                Text.Add("You give him a naughty smirk before you focus your attention on his tip, using both your hands to stroke the rest of his shaft.", parse);
            Text.Add(" Your [tongue] plays with the king’s cumslit, greedily lapping up his copious pre.", parse);
            Text.NL();
            Text.Add("Just as the lapin thinks he has you figured out, you switch back to sucking him off with long, deep strokes. Your trained throat easily parts around his girth, massaging it with great fervor. Your [hand]s aren’t idle either, seeking up and squeezing his cum-laden sack, cupping it and feeling your imminent reward sloshing around within. Finally, you gently press one finger to his all-but-untouched anus, trespassing on territory no man nor lagomorph has braved before.", parse);
            Text.NL();
            Text.Add("Lagon’s at a loss, unable to do anything but ride out the storm of your assault, grunting and groaning appreciatively. You can hear the astonished whispers of his harem around you, jealous of your prowess. ", parse);
            if(opheliaPresent)
                Text.Add("A sideways glance shows you a very interested Ophelia in the middle of taking notes, though she seem to have tapered off and is watching the two of you with a transfixed stare, idly biting on her pen. ", parse);
            Text.Add("With both your audience and your king enraptured by your skill, it’s time to put an end to this.", parse);
        }
        Text.Flush();
        
        //[Swallow][Shower][Finger][Beg]
        var options = new Array();
        options.push({ nameStr : "Swallow",
            func : function() {
                Text.Clear();
                Text.Add("Eager for your reward, you redouble your efforts, deepthroating your king for all that you’re worth. <i>“That’s sluts for you,”</i> he grunts. <i>“Always showing their true nature when they’re offered a generous serving of jizz.”</i> Scuttling to his feet, the lapin grabs you by the back of your head and starts thrusting in time with you, giving you a rough and messy skullfucking.", parse);
                Text.NL();
                Text.Add("<i>“Gonna blast you so full that you’ll be tasting cum for weeks,”</i> the king groans, his rutting becoming quicker and more erratic. <i>“Gonna- ugh… FUCK!”</i> He roars triumphantly, his dominion over you complete.", parse);
                Text.NL();
                LagonScenes.RulerBlowjobSwallowEntrypoint(opheliaPresent);
            }, enabled : true,
            tooltip : "You don’t want to waste a single drop."
        });
        options.push({ nameStr : "Shower",
            func : function() {
                Text.Clear();
                Text.Add("Just as he’s about to blow, you pull away after leaving a final kiss on the tip of his throbbing member. Using both hands to jerk off the massive cum-cannon, you open your mouth expectantly, looking up lustfully at your king. Lagon shifts in his seat, leaning back and stretching luxuriously.", parse);
                Text.NL();
                Text.Add("<i>“My little slut has such naughty ideas… it’d be fun seeing you try to explain your new appearance to your surface dwelling friends; they’ll take you for a googirl by the time I’m done with you!”</i> You stoically endure his continued taunts, determined to get your creamy shower. It won’t be long now either; a massive drop of quivering pre is forming on the king’s cocktip.", parse);
                Text.NL();
                Text.Add("<i>“Say aah~”</i> You dutifully stick your tongue out, successfully catching most of the first strand jetting out of his cock. That alone would put most men to shame and has you coughing, but Lagon’s barely gotten started. With a roar, he shoots another load, draping you in sticky white from tip to toe. You close your eyes, letting the lapin defile you. Rope after rope of thick bunny-batter cascades over you and paint you a pale alabaster. Several more blasts hit you right in the face, messing up your entire front as they slowly trickle down.", parse);
                Text.NL();
                Text.Add("After what feels like an eternity, Lagon is finally spent. You cautiously open one eye, in time to catch a last large droplet of cum splashing onto you from the cock inches away from your face. At some point, the lagomorph king has hopped to his feet, and he’s now looming above you, panting and heaving. He flashes you a triumphant grin, slumping back onto his throne.", parse);
                Text.NL();
                Text.Add("<i>“You should see yourself right now,”</i> Lagon chuckles, lazily waving to one of his daughters to come over and slurp up the last bit of seed drooling from his shaft. <i>“Truly, this new garb befits you, traveler. Did you come straight out of a dip in the Pit?”</i> You can just imagine what you must look like; it feels like there isn’t a square inch of your body not covered in his ejaculate.", parse);
                Text.NL();
                Text.Add("A group of tittering bunny-girls hop over to you, rubbing themselves against you and greedily licking up their master’s cum. You patiently let them help in cleaning you up, though them constantly grinding their breasts over your body only serves to arouse you even further.", parse);
                Text.NL();
                Text.Add("<i>“Now, be off with you. I shall have need of you later.”</i>", parse);
                Text.NL();
                
                LagonScenes.RulerBlowjobAftermath(opheliaPresent);
            }, enabled : true,
            tooltip : "Let the powerful male show you just how much cum he has backed up for you."
        });
        if(player.sex.gBlow >= 25) {
            var first = !(lagon.flags["Talk"] & LagonFlags.Talk.BJfinger);
            var tooltip = first ? "Let’s see just how far you can push him. You’re interested to find out how the lagomorph king would react to a prostate massage… and who knows, perhaps it’ll lead to even more fun." : "You know what will happen, but you can’t resist the urge to tease the lagomorph king further. Him getting rougher only turns you on even more, and your loins ache, longing for his cock."
            options.push({ nameStr : "Finger",
                func : function() {
                    Text.Clear();
                    if(first) {
                        lagon.flags["Talk"] |= LagonFlags.Talk.BJfinger;
                        Text.Add("Lagon’s just on the cusp of climaxing, but you can’t help yourself but mess with him. Having the high and mighty king melt like butter in your hands is such a delight to see… and speaking of hands, that gives you a <i>very</i> naughty idea. You pop his cock out of your mouth, using your [tongue] to tease his glans. One of your hands lightly strokes him, tracing his veins and moving down to cradle his huge sack, teeming with tasty cum. Purring, you wet your fingers and coax him to lean back and enjoy; this is how you pleasure a man on the surface.", parse);
                        Text.NL();
                        Text.Add("Your other hand is busy even lower down, steadily increasing the pressure on Lagon’s virgin rosebud. ", parse);
                        if(p1cock)
                            Text.Add("You know it’s nothing more than a fantasy, but one day, you’re going to claim that tight ass. ", parse);
                        Text.Add("Keeping him distracted with your tongue, one of your soaked digits slowly breach his tight hole, probing deeper and deeper.", parse);
                        Text.NL();
                        Text.Add("<i>“W-what are you doing down there,”</i> the lapin gasps. You hush him, slurping up the pre quivering on the tip of his stiff member. Just lean back and relax… let it happen. Miraculously, he goes along with it, perhaps too intrigued by the unfamiliar feelings to realize what’s going on.", parse);
                        Text.NL();
                        Text.Add("Now for the grand finale. Grasping his rock-hard cock firmly, you start jerking him off, angling the tip upward. You lean down and suck on one of his balls, coaxing the virile spunk within to come out and play. To top it all off, you insert another finger in his virgin-tight butt, jabbing up against his prostate.", parse);
                        Text.NL();
                        Text.Add("Lagon’s angry growl devolves into a hapless moan as you pick up speed, furiously jerking and finger-fucking the king into submission. With a great roar, he orgasms, shooting his seed a dozen feet into the air. You smugly grin to yourself as thick globulettes of cum start raining down, showering both of you in sticky white strands. Squeezing all you can out of his prostate, you lap up his falling seed as the king writhes in throes of ecstasy.", parse);
                        Text.NL();
                        Text.Add("Suddenly, there is a lapin foot on your chest, the pawpads resting right over your heart. The air is driven from you body as you’re violently kicked back, tumbling around haplessly only to land in a crumpled heap. Before you have had the time to recover, Lagon is stalking up to angrily, grabbing you by the scruff of your neck and hoisting you into the air as if you were a ragdoll.", parse);
                        Text.NL();
                        var tail = player.HasTail();
                        parse["t"] = tail ? tail.Short() : player.Butt().Short();
                        Text.Add("<i>“WHAT THE FUCK DO YOU THINK YOU’RE DOING, YOU LITTLE BITCH?!”</i> he screams at you, baring his teeth in rage. He hurls you bodily across the room, crashing on your back near the throne. <i>“THE FUCKING NERVE!”</i> he roars. <i>“When I’m done with you, you’re going to walk funny for MONTHS!”</i> Before you can get up, he’s on you again, ripping the clothes and gear off your body like wrapping paper. You try to grapple with him, but the enraged king is far too strong. He throws you face-first onto the throne, grabbing you by your [t] and holding you down.", parse);
                        Text.NL();
                        Text.Add("A quick glance over your shoulder shows you that he’s calmed down somewhat, but as his anger subsides, his erection grows. He’s serious about banging your brains out, and he’s not going to take no for an answer. Perhaps you shouldn’t have teased him like that…", parse);
                    }
                    else {
                        parse["h"] = player.HasHair() ? Text.Parse(" by the [hair]", parse) : "";
                        Text.Add("The king is about to blow his load… but you aren’t satisfied yet. You <i>need</i> to be fucked by his majestic cock, and you know just the way to taunt him into giving you the savage pounding that you so desire. Knowing full well what is going to happen, you wet your finger and continue to play with Lagon’s butt, pressing against his tight rear entrance. He immediately tenses up, grabbing you[h] roughly.", parse);
                        Text.NL();
                        Text.Add("<i>“It seems I did a bad job of teaching you a lesson last time, dimwitted little slut,”</i> he growls. <i>“Don’t try to play with forbidden things, lest you incur my wrath again.”</i>", parse);
                        Text.NL();
                        Text.Add("Oh, but that is just what you’re yearning for. You lick him from root to stem, throwing him a sultry look as you slowly invade the tight confines of his sphincter. You don’t get far; within seconds, he’s twisted you around and locked your arms behind your back.", parse);
                        Text.NL();
                        Text.Add("<i>“You’re really pushing it, naughty bitch,”</i> he hisses as he rips off your clothes and gear. <i>“It seems like I must once again demonstrate for you what it means to be ruined.”</i> In another flurry, you’re bent over the throne on your elbows, your ass in the air, ready for the taking.", parse);
                        Text.NL();
                        Text.Add("Yes! You moan, begging for him to be rough, to teach you your place. In response, you get what you gave; a rough finger thrust into your butt. You roll your [hips] back to meet him, quivering in anticipation. When he withdraws his thick digit, it leaves you empty and aching for more, though not for long.", parse);
                    }
                    Text.Add(" You tense up as he presses the bulbous tip of his cum-covered battering ram against your [anus], and ball up your fists in preparation for the inevitable violation.", parse);
                    Text.NL();
                    Text.Add("<i>“Don’t think I’ll go easy on you, you little whore,”</i> Lagon growls. His voice is that of a predator on the prowl, just about to jump his hapless prey. The prey that just thoughtlessly went up and offered him its body. <i>“You’re in for a long, long ride.”</i>", parse);
                    Text.NL();
                    
                    player.AddLustFraction(1);
                    
                    LagonScenes.RulerGetFuckedEntrypoint2(true, BodyPartType.ass, opheliaPresent);
                }, enabled : true,
                tooltip : tooltip
            });
        }
        options.push({ nameStr : "Beg",
            func : function() {
                Text.Clear();
                Text.Add("You pull off his cock, giving the tip a final sultry lick  as you slowly back away.", parse);
                Text.NL();
                Text.Add("<i>“Where the fuck do you think you’re going?”</i> Lagon growls as he hops to his feet. <i>“I’m going to bust my nut in you, don’t think you can deprive me of my pleasure now!”</i>", parse);
                Text.NL();
                Text.Add("Oh, you want nothing more… but wouldn’t he rather try another hole? Wouldn’t it be nice if both of you could get off? You’re getting so hot and bothered from sucking his delicious cock… you <i>need</i> it inside you.", parse);
                Text.NL();
                if(burrows.LagonAlly())
                    Text.Add("<i>“How could I decline such a heartfelt request from my most loyal of sluts?”</i> Lagon purrs, his demeanor suddenly changing from annoyed to horny.", parse);
                else
                    Text.Add("<i>“I suppose I shouldn’t be surprised to see you cave in to your lust, my little slut,”</i> Lagon purrs fondly. <i>“I suppose I can’t decline bending you over and breaking you after such an honest request.”</i>", parse);
                Text.Add(" He gives his quivering shaft a slow stroke, his eyes locked with yours and burning with a predatory lust.", parse);
                Text.NL();
                
                player.AddLustFraction(0.5);
                
                LagonScenes.RulerGetFuckedEntrypoint(opheliaPresent);
            }, enabled : true,
            tooltip : "You want more than this! Beg for him to take you, to fuck you raw until you’re swollen from his cum!"
        });
        Gui.SetButtonsFromList(options, false, null);
    }

    export function RulerBlowjobSwallowEntrypoint(opheliaPresent : boolean) {
        var parse : any = {
            
        };
        
        Text.Add("Your eyes go wide as the long awaited eruption finally comes. What feels like gallons of potent bunny-semen gushes from the tip of Lagon’s cock, torrenting down your gullet in thick, sticky ropes. <i>“You… better not spill a single drop...”</i> he pants, his hips still twitching erratically. Your lips are pressed against his crotch, sealed tightly around his massive, throbbing member. There shouldn’t be any room left for anything to leak out, yet you can still feel rivulets of cum pushing their way up your throat as your rapidly swelling stomach leaves them nowhere else to go.", parse);
        Text.NL();
        Text.Add("An eternity later, the king is finally spent, leaving you with a belly full of royal alabaster cream. As he pulls out, you hurry to gather up the stray strands of seed drooling down your chin and quickly swallow them before he notices. You dutifully open your mouth at his request, showing him that you’ve done as he asked.", parse);
        Text.NL();
        Text.Add("<i>“Good job, my little slut,”</i> he praises you. Lagon flops back onto his throne, allowing you to lick his softening member clean. <i>“You might be worth keeping around after you’ve finished your tasks for me.”</i>", parse);
        Text.NL();
        
        LagonScenes.RulerBlowjobAftermath(opheliaPresent);
    }


    export function RulerBlowjobAftermath(opheliaPresent : boolean) {
        let player = GAME().player;
        let lagon = GAME().lagon;

        var parse : any = {
            
        };
        
        Text.Add("Once dismissed, you do your best to clean yourself up and gather your senses again, heading back out on your journey.", parse);
        if(opheliaPresent)
            Text.Add(" As you turn to leave, you hear Lagon calling his daughter forward. <i>“I’m in a good mood,”</i> he hums to himself. <i>“What was it that you wanted again?”</i>", parse);
        Text.Flush();
        
        player.AddLustFraction(0.2);
        player.slut.IncreaseStat(50, 1);
        player.subDom.DecreaseStat(-50, 1);
        lagon.relation.IncreaseStat(0, 2);
        lagon.relation.IncreaseStat(40, 2);
        TimeStep({hour: 1});
        
        Gui.NextPrompt();
    }


    //TODO
    export function RulerGetFuckedEntrypoint(opheliaPresent : boolean) {
        let player = GAME().player;
        let lagon = GAME().lagon;

        var p1cock = player.BiggestCock();
        var lagonSize = lagon.FirstCock().Size();
        var parse : any = {
            armor : function() { return player.ArmorDesc(); },
            pheshe : player.mfTrue("he", "she")
        };
        parse = player.ParserTags(parse);
        parse = Text.ParserPlural(parse, player.NumCocks() > 1);
        
        Text.Add("<i>“Now, lets get you out of those pesky clothes that you surface dwellers insist on wearing.”</i> You hurriedly remove your [armor] before Lagon decides to do something more permanent. Caught under his hungry, possessive stare and bereft of any covering, you feel exposed and vulnerable; a deer caught in the sights of a wolf.", parse);
        Text.NL();
        Text.Add("<i>“Perfect… now show me the goods.”</i> The king leans back, making himself comfortable. He gestures for you to give him a show.", parse);
        Text.NL();
        if(player.Slut() < 30) {
            Text.Add("You gulp. This kind of thing really isn’t your forté… but you comply anyways. After all, you asked for this. Besides, putting yourself on display doesn’t seem like such a big deal, considering what’s going to come after. <i>“Is that a blush I see on your cheeks? Is the chaste little virgin perhaps contemplating the rough fucking [pheshe]’s about to receive?”</i> You try to not let his words get to you, but you can’t help but have your heart skip a beat when he talks about your imminent ravaging.", parse);
            Text.NL();
            Text.Add("Your hands trail down your body, alighting on your [breasts]. ", parse);
            if(player.FirstBreastRow().Size() < 5) {
                Text.Add("<i>“As flat as a man,”</i> Lagon chuckles. ", parse);
                if(!player.FirstVag())
                    Text.Add("<i>“You’re no man though, are you?”</i> he adds maliciously. <i>“A man wouldn’t come here and beg to have his ass fucked, would he?”</i> ", parse);
            }
            else if(player.FirstBreastRow().Size() < 15)
                Text.Add("<i>“A decent rack,”</i> Lagon notes. <i>“I’ve seen better, though. Give them a bounce for me.”</i> Truly, the lapin knows no shame… but you dutifully obey, cupping them in your hands. <i>“A nice set of teats to blow my load on… if I wasn’t already planning to put it elsewhere.”</i> ", parse);
            else
                Text.Add("<i>“Pretty impressive,”</i> Lagon concedes. <i>“With udders like that, I don’t imagine you get much done. I’m guessing guys stop you for titjobs all the time… and I bet you humor them.”</i> ", parse);
            Text.Add("Blushing, you hurry on downward.", parse);
            Text.NL();
            if(p1cock) {
                var size = p1cock.Size();
                Text.Add("You pause as you reach your [cocks], but after a brief moment of hesitation, you grasp[oneof] [itThem] and give it a tug. ", parse);
                if(size * 2 < lagonSize)
                    Text.Add("<i>“Bet the ladies just gush when they see that little clit of yours,”</i> the king taunts. <i>“If they notice it at all.”</i>", parse);
                else if(size < lagonSize)
                    Text.Add("<i>“Bet you’re proud of your little pecker, aren’t you, bitch?”</i> the king mocks you. <i>“Pity it won’t see any use here.”</i>", parse);
                else
                    Text.Add("<i>“Now that’s a cock far too big to be attached to a bitch like you,”</i> the king mocks you. <i>“Do you carry it in a cart or something?”</i>", parse);
                Text.NL();
            }
            if(player.FirstVag()) {
                if(p1cock)
                    Text.Add("Ah… of course he’s not going to be interested in that… but you have other parts that are bound to be more enticing. ", parse);
                parse["b"] = player.HasBalls() ? Text.Parse("Pulling your [balls] out of the way, y", parse) : "Y";
                Text.Add("[b]ou carefully spread your [vag], exposing your sensitive folds. <i>“Now we are getting somewhere,”</i> Lagon nods, lazily stroking his cock. <i>“Filling your womb to the brim with my royal seed is tempting… but so is stuffing my cock in your ass and having you squirm beneath my touch.”</i> The king imperiously motions for you to turn around and show off your booty. <i>“Help me decide, will you?”</i>", parse);
                Text.NL();
            }
            Text.Add("You uncertainly turn around, throwing a worried glance over your shoulder. At Lagon’s annoyed gesture, you hurriedly spread your cheeks, presenting him with your [anus]. This whole ordeal was even more humiliating than you expected, with all his constant taunts and jeers.", parse);
            if(p1cock)
                Text.Add(" With all that blood flowing to your face, you wonder how your [cocks] can possibly be this hard.", parse);
            Text.NL();
            Text.Add("Suddenly, you feel a presence right behind you, and two big paws fall on your shoulders. <i>“It’s time, pet,”</i> you hear the king murmur in your ear, roughly manhandling you and turning you around, bending you over his royal seat. His words are ringing in your head, like the knells of a huge bell, sealing your fate. <i>“I’m going to have a <b>lot</b> of fun with you before I’m done.”</i>", parse);
        }
        else if(player.Slut() < 60) {
            Text.Add("Smiling sultrily, you do a little twirl for him, flaunting your body. If he wants to humiliate you, he’s going to have to do better than that. You blow him a kiss, your eyebrow raised in a questioning ‘like what you see?’ <i>“Very sassy,”</i> he yawns, though you can see your display has a clear effect on his body. A very prominent effect, actually.", parse);
            Text.NL();
            if(player.FirstBreastRow().Size() < 5) {
                Text.Add("Your [breasts] may not be much to look at, but you flash them anyways, gauging his response. <i>“What, you’re expecting praise? I’d mistake you for a boy, if I didn’t know better.”</i>", parse);
                if(!player.FirstVag())
                    Text.Add(" Ugh… you should have expected that.", parse);
            }
            else if(player.FirstBreastRow().Size() < 15)
                Text.Add("You cup your [breasts], giving them an alluring bounce. <i>“You have my attention.”</i> Lagon stretches languidly, grinning as you prance and squeeze your bounty for him.", parse);
            else
                Text.Add("You squeeze your [breasts] together, a slight smirk playing on your lips as you mesmerize the lapin king with your generous mass of titflesh. <i>“Not bad at all,”</i> he compliments you. <i>“Once I’m done banging your brains out, perhaps I’ll let you clean me up with those afterward.”</i>", parse);
            Text.Add(" Swaying your [hips] sensually, you slowly move your hands down your body, closing in on your loins.", parse);
            Text.NL();
            if(p1cock) {
                var size = p1cock.Size();
                parse["l"] = player.HasLegs() ? "Between your legs" : "In the valley of your crotch";
                Text.Add("[l], your [cocks] [isAre] jutting out proudly, a clear sign of your arousal. Biting your lip, you caress [itThem] from tip to root, letting out a faint moan as a pleasurable shiver runs down your spine. ", parse);
                if(size * 2 < lagonSize) {
                    parse["a"] = player.NumCocks() > 1 ? "" : " a";
                    Text.Add("<i>“Such[a] pretty little clit[s] you have, slut,”</i> Lagon grins. <i>“I wonder if [itThey] will leak when I fuck you.”</i> With a girth like that, you doubt you could restrain yourself even if you wanted to.", parse);
                }
                else if(size < lagonSize)
                    Text.Add("<i>“I’m sure you’re very proud of [thatThose] little pecker[s],”</i> Lagon mocks you. <i>“I think you’ll find you are a bit… outmatched in that department.”</i> That much is true… you don’t hold much when put up against the king’s massive shaft. That same massive shaft that will soon impale you, you are reminded.", parse);
                else
                    Text.Add("<i>“Aren’t you a hung little slut,”</i> the king mocks. <i>“Don’t think you’ll have a chance to use [thatThose] thing[s] anytime soon, though.”</i> You weren’t really expecting anything else, not when it comes to Lagon.", parse);
                if(player.FirstVag())
                    Text.Add(" Well, you might have something else that he’d be more interested in...", parse);
                Text.NL();
            }
            if(player.FirstVag()) {
                parse["b"] = player.HasBalls() ? Text.Parse("Pulling your [balls] out of the way, y", parse) : "Y";
                Text.Add("[b]ou flash him your juicy pussy, pulling your folds apart and teasing him with your wet opening. <i>“Delightful,”</i> Lagon grins. <i>“I think I’ll cram that tight little hole with some cock… unless...”</i> ", parse);
            }
            Text.Add("The king imperiously motions for you to turn around and show off the rest of your goods. You dutifully do as he asks, swirling around and giving your [butt] a shake. At an impatient growl from the lapin, you spread your cheeks, exposing your [anus].", parse);
            Text.NL();
            Text.Add("<i>“Such an obedient little slut,”</i> you hear Lagon breathe in your ear. The king has moved up right behind you, his massive paws grabbing your arms. You bite your lip in anticipation as you feel his equally massive cock slide up between your buttcheeks. <i>“I think it’s time to show my appreciation...”</i> Before you can react, you’ve been turned around and bent over, arms resting on Lagon’s throne.", parse);
        }
        else {
            Text.Add("Oh, he’s going to get a show alright… only question is if he’s able to handle that much of you. Flashing him the best fuck-me look you can muster, you slowly stalk closer to the throne, eyes locked on the king. He drinks in the sight of you, silent but looking pleased. You stop when you’re a step away, within touching distance. Trailing a hand up his thigh, you lean down and plant a kiss on his rigid member. You’ll get your fill of it soon enough, but you’ll take this opportunity to tease it and its owner.", parse);
            Text.NL();
            if(player.FirstBreastRow().Size() < 5) {
                Text.Add("Rising up slowly, you rub his tip with your [nips], leaving a trail of pre plastered across your [breasts]. <i>“Hate to break it to you, pet, but you weren’t built for giving titjobs,”</i> Lagon drawls. <i>“No doubt you have other interesting places I can put my cock.”</i>", parse);
            }
            else if(player.FirstBreastRow().Size() < 15)
                Text.Add("You squeeze your [breasts] together around the lagomorph’s cock, giving him a few strokes. He’s too big for you to give a proper titjob, but it still seems to do the trick. <i>“Seems like someone is a bit antsy to get fucked,”</i> Lagon breathes leisurely, rewarding your diligence with a splatter of pre in your cleavage.", parse);
            else
                Text.Add("You squeeze your [breasts] together around the lagomorph’s cock, easily swallowing it up in your ample bosom. Lagon sighs languidly as you stroke him off with your tits, depositing a smatter of sticky pre in your cleavage. <i>“Not bad, I could enjoy some more of this... if I didn’t already have other plans for you.”</i>", parse);
            Text.Add(" Oh, you’re just getting started.", parse);
            Text.NL();
            Text.Add("Lets see what he thinks of <i>this</i>. Giving his cock a last peck, you move in for a kiss, rubbing your body against his. ", parse);
            if(p1cock) {
                var size = p1cock.Size();
                Text.Add("The close proximity and your arousal incidentally brings your own [cocks] to bear, grinding [itThem] together with Lagon’s. ", parse);
                if(size * 2 < lagonSize)
                    Text.Add("<i>“You naughty little bitch,”</i> the king hisses. <i>“[ThatThose] pitiful little clit[s] of yours speak[notS] volumes… you’re <b>really</b> looking forward to this, aren’t you?”</i>", parse);
                else if(size < lagonSize)
                    Text.Add("<i>“Careful where you’re putting [thatThose] thing[s],”</i> he mutters, though you can feel his cock strain against your own member[s].", parse);
                else
                    Text.Add("<i>“Get [thatThose] fucking thing[s] out of my face, will you?”</i> he complains, though you can feel his cock strain against your member[s].", parse);
                if(player.FirstVag()) {
                    parse["l"] = player.HasLegs() ? ", legs spread wide as you straddle the king" : "";
                    Text.Add("  After a few lewd grinds, you crawl up into his lap[l].", parse);
                }
                Text.NL();
            }
            if(player.FirstVag()) {
                Text.Add("You hear an appreciative moan from the lapin as you spread your pussy lips, grinding them along his shaft. ", parse);
                if(p1cock) {
                    var size = p1cock.Size();
                    if(size * 2 >= lagonSize) {
                        Text.Add("Your [cocks] smear[notS] [itsTheir] sticky pre all over his chest, but he’s beyond caring at this point. ", parse);
                        if(size >= lagonSize)
                            Text.Add("Not even when [itThey] rub[notS] against his chin does the lagomorph react, lost in your intimate massage. ", parse);
                    }
                }
                Text.Add("<i>“Ah… I’m going to enjoy breaking this slut in,”</i> he sighs languidly.", parse);
                Text.NL();
            }
            Text.Add("Just when the king is starting to get into it, you reverse your position, grinding your [butt] against him. His massive cock throbs deliciously between your cheeks, and you feel one of the lapin’s paws firmly grip your hip, groping you while you hotdog him.", parse);
            Text.NL();
            Text.Add("Finally, your intimate lapdance becomes too much for Lagon. With a lustful roar, he grabs you around the waist and hoists you around, bending you over his royal seat. There’s a firm hand on your hip, the king’s other hand splayed on your back, holding you down. <i>“Your slutty body is screaming to be taken,”</i> you hear him grunt behind you as he grinds his bulbous dick in the crevasse of your ass. <i>“Hope you can handle me, because I’m not holding back after that.”</i>", parse);
        }
        Text.NL();
        
        var target;
        var scenes = new EncounterTable();
        scenes.AddEnc(function() {
            target = BodyPartType.ass;
            parse["target"] = player.Butt().AnalShort();
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            target = BodyPartType.vagina;
            parse["target"] = player.FirstVag().Short();
        }, 3.0, function() { return player.FirstVag() && player.HasLegs(); });
        scenes.Get();
        
        Text.Add("You shiver as you feel the lapin king press the head of his immense shaft against your [target], demanding entry and not taking no for an answer. Tightening your [hand]s into fists, you try to prepare yourself for your imminent violation.", parse);
        Text.NL();
        
        LagonScenes.RulerGetFuckedEntrypoint2(false, target, opheliaPresent);
    }

    //TODO
    export function RulerGetFuckedEntrypoint2(angry : boolean, target : BodyPartType, opheliaPresent : boolean) {
        let player = GAME().player;
        let ophelia = GAME().ophelia;
        let lagon = GAME().lagon;
        let burrows = GAME().burrows;

        var parse : any = {
            
        };
        parse = player.ParserTags(parse);
        parse = Text.ParserPlural(parse, player.NumCocks() > 1);
        
        var lagonGirth = lagon.FirstCock().Thickness();
        target = target || BodyPartType.ass;
        var pussy = target == BodyPartType.vagina;
        var cap;
        if(pussy) {
            parse["target"] = function() { return player.FirstVag().Short(); }
            cap = player.FirstVag().Cap();
        }
        else {
            parse["target"] = function() { return player.Butt().AnalShort(); }
            cap = player.Butt().Cap();
        }
        
        Text.Add("When it comes, it comes with all the brutal force you expect from Lagon. You give out a wordless cry as the king rams several inches of girthy dick into your [target], giving zero fucks about your comfort. ", parse);
        if(cap * 2 < lagonGirth)
            Text.Add("<i>“Like breaking in a virgin,”</i> he grunts. <i>“You’re in for a rough ride, slut.”</i>", parse);
        else if(cap < lagonGirth)
            Text.Add("<i>“Tight fuck,”</i> he grunts. <i>“Just how I like it.”</i>", parse);
        else
            Text.Add("<i>“Someone’s been busy in the sack,”</i> he grunts appreciatively. <i>“‘Round here, only one this loose is Vena!”</i>", parse);
        Text.NL();
        
        if(pussy) {
            Sex.Vaginal(lagon, player);
            player.FuckVag(player.FirstVag(), lagon.FirstCock(), 4);
            lagon.Fuck(lagon.FirstCock(), 4);
        }
        else {
            Sex.Anal(lagon, player);
            player.FuckAnal(player.Butt(), lagon.FirstCock(), 4);
            lagon.Fuck(lagon.FirstCock(), 4);
        }
        
        if(angry) {
            parse["c"] = player.FirstCock() ? ", mashing your prostate repeatedly" : "";
            Text.Add("You bite down, stifling your desperate moans. The lapin is going down on you like a jackhammer; if not for his paws holding you in place you fear his angry thrusts would smash you right through the throne. As it is, he’s drilling you so hard that each thrust makes the chair creak dangerously. It’s all you can do to keep on to your sanity as he pounds your ass[c]. Time blurs for a while, and before you know it the king is balls deep in you, stretching your colon way past its intended capacity.", parse);
        }
        else {
            Text.Add("He’s not holding back one bit, but after a while you somehow start getting used to his size. No sooner have you accommodated his initial insertion then you’re stuffed with even more cock, until the king’s hips tap against yours. <i>“See? The bitches I fuck always whine about how it won’t fit,”</i> Lagon scoffs. <i>“They soon change their tune though. I can be very persuasive.”</i> His words are accentuated by your stifled moans and the rhythmical meaty slaps of his merciless pounding. You’d be hard pressed to argue with him.", parse);
        }
        Text.NL();
        Text.Add("As the lapin pulls out, he leaves a feeling of aching emptiness behind, only to quickly fill it again with all fifteen turgid inches of his shaft. ", parse);
        parse["rs"] = player.HasBalls() ? "rs" : "";
        if(pussy) {
            parse["preg"] = player.PregHandler().IsPregnant() ? "vaginal passage" : "defenseless womb";
            Text.Add("Your nether lips are stretched tightly around him, clamping down around the veiny pillar of flesh. Each thrust, you can feel his massive balls slap against you[rs], a potent promise of the bountiful seed soon to be flooding your [preg].", parse);
        }
        else
            Text.Add("Each thrust, the king’s massive balls slap against you[rs], a potent promise of the gallons of cum he’s planning to flood your rectum with. He seems intent on breeding you like a bitch in heat - not far from the truth - even if the only effect it’s likely to have is him solidifying his dominance over you.", parse);
        Text.NL();
        if(burrows.LagonAlly())
            Text.Add("<i>“That’s right,”</i> Lagon grunts as you eagerly push your hips back to meet his. <i>“Never say the king doesn’t reward his loyal slut.”</i>", parse);
        else if(lagon.Relation() < 0)
            Text.Add("<i>“Don’t worry, bitch, I’m only getting started with you,”</i> Lagon grunts, giving your ass a sharp slap. <i>“A few more sessions like this and I’m sure you’ll be more… agreeable.”</i>", parse);
        else if(lagon.Relation() < 50)
            Text.Add("<i>“How’s that, am I beginning to convert you to our ways, traveler?”</i> Lagon grunts, grinding against you. <i>“Wouldn’t you rather stay here, where there’s plenty of cock to keep you satisfied?”</i>", parse);
        else
            Text.Add("<i>“I’ll be sure to give you all that you wished for, slut,”</i> Lagon grunts, squeezing your ass. <i>“Don’t complain if you can’t walk properly once I’m done with you, though. Maybe you can spend some time in the Pit ‘recovering’.”</i>", parse);
        Text.Add(" You barely register his words, too busy hanging onto your sanity as the hung lapin attempts to rearrange your insides. One thing is for sure though; now that you’ve managed to get used to his girth, getting fucked feels simply amazing. Time and time again the massive shaft burrows into you, replacing that cursed emptiness with a blissful sense of complete satisfaction.", parse);
        Text.NL();
        Text.Add("The king, too, seems to be enjoying himself, if his wild rutting is any indication. ", parse);
        if(angry)
            Text.Add("<i>“Not so cocky now, are you, fucking bitch?”</i> he taunts, ramming his hips home. <i>“You wanted anal? I’ll give it to you; I’ll give it to you <b>hard!</b>”</i>", parse);
        else
            Text.Add("<i>“Hanging in there?”</i> he taunts. You manage to gasp a reply, assuring him you’re fine. <i>“How about now?”</i> he grunts, ramming his hips home with great fervor. This time, you’re unable to respond.", parse);
        Text.NL();
        Text.Add("As you are bent over and getting railed, you notice that some of Lagon’s children have moseyed their way over to get a closer look, some giving you jealous glares. ", parse);
        if(opheliaPresent)
            Text.Add("At the back, you can see Ophelia hovering uncertainly, perhaps deciding if she’s going to dare to approach. ", parse);
        
        var blownbyophelia = false;
        
        var scenes = new EncounterTable();
        scenes.AddEnc(function() {
            Text.Add("<i>“Look but don’t touch,”</i> the king admonishes them, waving them away. <i>“Once I’m done, perhaps you can have the leftovers.”</i>", parse);
            Text.NL();
            Text.Add("Chastised, the disgruntled rabbits keep their distance, though you see that some of the males are stroking themselves, perhaps in anticipation of Lagon finishing quickly. Unfortunately for them, you have no indication that would suggest that he’s anywhere near being done with you.", parse);
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("<i>“It seems like you’re going to have to take care of some of my sons too, my little slut,”</i> the king grunts in your ear. You’re shuffled around, multiple furry hands groping your body as you’re bent over the armrests of the throne, Lagon impaling you on one side and three cocks being shoved in your face on the other. <i>“Open up and relieve them like a good slut, or you’re likely to be here a lot longer than you planned.”</i>", parse);
            Text.NL();
            Text.Add("In your aroused state, you don’t need much coaxing to wrap your lips around the middle one - a respectable seven inch bunny-pecker - simultaneously grabbing the other two and stroking them off. Unlike their father, these ones are quick to shoot, relatively soon blasting their seed all over your face and down your gullet. <i>“Good work,”</i> Lagon purrs, scratching you on the back.", parse);
            
            var bunny : any = new Lagomorph(Gender.male);
            Sex.Blowjob(player, bunny);
            player.FuckOral(player.Mouth(), bunny.FirstCock(), 1);
            bunny.Fuck(bunny.FirstCock(), 1);
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("<i>“It seems like you’ve gathered the attention of my daughters, my little slut,”</i> the king grunts in your ear. You raise your eyes, and sure enough, two pretty does are standing nearby beaming down at you. <i>“We wouldn’t want to deprive them of their treats, now would we?”</i>", parse);
            Text.NL();
            Text.Add("Saying so, Lagon lifts you up by your armpits. Still lodged firmly inside you, the king takes his throne again, letting you sit in his lap, back leaning against his chest. Returning his hands to your hips, he elevates you until only his tip remains inside, then let gravity do the work. Your [cocks] twitch[notEs] ecstatically as you sink down, the entire length of his turgid shaft rubbing against your prostate. The girls lean in eagerly, licking and sucking on your cock[s], hungrily lapping up your pre.", parse);
            Text.NL();
            if(opheliaPresent) {
                Text.Add("<i>“What about you, miss scientist?”</i> Lagon mockingly calls over to Ophelia. <i>“Would you not like to examine our dear surface dweller more closely?”</i> He chuckles to himself. <i>“You can never get enough ‘samples’, right?”</i>", parse);
                Text.NL();
                Text.Add("The alchemist fusses with her glasses, but obediently hops over, squeezing in between her sisters. All three of the lusty lapins go to their knees, lavishing your genitalia with their attention. There’s a faint blush on Ophelia’s cheeks, and she pulls some unruly hairs out of her eyes before eagerly wraps her lips around[oneof] your [cocks].", parse);
                Text.NL();
                
                Sex.Blowjob(ophelia, player);
                ophelia.FuckOral(ophelia.Mouth(), player.FirstCock(), 1);
                player.Fuck(player.FirstCock(), 1);
                
                Text.Add("<i>“Good girl,”</i> Lagon grunts as he pistons into you. The dual stimulation - quadruple if you count the other two ladies, and they most certainly make themselves count - almost make you come then and there, and you let out a whorish moan. <i>“Someone seems to like it,”</i> the king mocks you, his breath hot in your ear. <i>“How about <b>this</b>?”</i>", parse);
                Text.NL();
                Text.Add("Just when you thought that his fucking couldn’t get more frenzied, the lapin king proves you wrong. ", parse);
                if(player.HasLegs())
                    Text.Add("He hoists you up by the back of your knees, holding you in place and leaving him free to pound you into oblivion.", parse);
                else
                    Text.Add("Rising to his feet, he takes a firm hold of your [hips] and start pounding you at breakneck speed.", parse);
                Text.Add(" On each thrust, your [cock] is driven all the way down Ophelia’s throat, pushing you even further.", parse);
                Text.NL();
                
                var cum = player.OrgasmCum();
                parse["cum"] = cum > 6 ? "massive" :
                            cum > 3 ? "impressive" : "meager";
                parse["c"] = player.NumCocks() > 1 ? " and all over her sisters" : "";
                parse["b"] = player.HasBalls() ? Text.Parse(" and [balls]", parse) : "";
                parse["bnotS"] = player.HasBalls() ? "" : "s";
                Text.Add("You can’t stand up to the bunnies’ concerted efforts for long before you cry out, pumping your [cum] load down Ophelia’s throat[c]. Your prostate[b] feel[bnotS] drained, but Lagon isn’t about to stop until he’s had his fill. After they lap up your seed, Ophelia and her sisters back away demurely, watching with interest as your [cocks] slowly grow[notS] erect again. Cock[s] drooling, you moan as you’re once again bent over the throne.", parse);
                
                blownbyophelia = true;
            }
            else {
                Text.Add("<i>“Good girls, aren’t they?”</i> Lagon murmurs fondly, giving you another bounce. You can only moan in response, a wordless cry of agreement. ", parse);
                
                var scenes = new EncounterTable();
                scenes.AddEnc(function() {
                    Text.Add("One of them move further down and suck on your [balls], while the other lavishes[oneof] your shaft[s].", parse);
                }, 1.0, function() { return player.HasBalls(); });
                scenes.AddEnc(function() {
                    Text.Add("They take one cock each, sucking on them earnestly while their father takes care of your [target].", parse);
                }, 1.0, function() { return player.NumCocks() > 1; });
                scenes.AddEnc(function() {
                    Text.Add("The girls take turns sucking on your [cocks], never leaving you unattended.", parse);
                }, 1.0, function() { return true; });
                
                scenes.Get();
                
                Text.Add(" <i>“Why don’t you sate their desires?”</i>", parse);
                Text.NL();
                
                var bunny : any = new Lagomorph(Gender.female);
                
                Sex.Blowjob(bunny, player);
                bunny.FuckOral(bunny.Mouth(), player.FirstCock(), 1);
                player.Fuck(player.FirstCock(), 1);
                
                Text.Add("The king doesn’t wait for your response; rather, he seems intent on forcing your orgasm, starting to pound into you at breakneck speed. The combined stimulation from all three lagomorphs has you seeing stars, each rapid thrust of Lagon’s monster cock battering your prostate into submission.", parse);
                Text.NL();
                
                var cum = player.OrgasmCum();
                parse["cum"] = cum > 6 ? "massive" :
                            cum > 3 ? "impressive" : "meager";
                
                Text.Add("Finally, you can no longer hold back, crying out as you feed your [cum] load to the sisters. Before you’ve even regained your senses again, your [cocks] [isAre] growing stiff again, coaxed by Lagon’s constant pounding. Their hunger sated, each of the girls give your quivering cock[s] a final kiss before withdrawing, licking cum from their lips. You’re given no time to recover before you’re once again bent over the throne, the king impaling you with undiminished fervor.", parse);
            }
            player.AddLustFraction(0.5);
        }, 1.0, function() { return player.FirstCock(); });
        
        scenes.Get();
        
        
        Text.NL();
        Text.Add("Time passes...", parse);
        Text.Flush();
        TimeStep({minute: 45});
        
        Gui.NextPrompt(function() {
            Text.Clear();
            Text.Add("You’re not sure how long the king has been fucking you; time has little meaning down here under the ground. Your body is quivering from numerous orgasms, brought on by his relentless pounding. ", parse);
            if(player.FirstCock())
                Text.Add("There’s a pool of your seed spreading around the base of the throne, dripping from your spent [cocks]. ", parse);
            Text.Add("It’s as if he’s trying to grind every defiant bone in your body down to dust, using only his cock. How the heck can he keep this up for so long?!", parse);
            Text.NL();
            if(angry)
                Text.Add("<i>“Learned your place yet, slut?”</i> Lagon grunts, driving into you hard. <i>“If not, I’ll be happy to provide you with additional lessons… perhaps in the Pit.”</i> Leaning in closer, he roughly cups your chin from behind. <i>“Now that we’ve cleared up what parts of me are off-limits, I think I’ll leave you with a little - unf - present.”</i>", parse);
            else
                Text.Add("<i>“Hanging in there, slut?”</i> Lagon grunts, driving into you hard. <i>“Just a little more… almost there...”</i>", parse);
            Text.NL();
            Text.Add("Going into the final stretch, the lapin’s hips become a blur of erratic thrusts, ravaging your [target] as deeply as he can. Your insides are a mess of bunny pre, but you have a sinking feeling you’ll soon get a lot more where that came from. At last, you can feel an incessant throbbing spreading through the king’s massive shaft, announcing the imminent eruption of his royal seed.", parse);
            Text.NL();
            Text.Add("Letting out a great, dominant roar, Lagon pushes your head down, holding you there while he unleashes his load. It’s as if a great flood rushes into your [target]; gout after gout of thick bunny-batter pumping into you from the king’s seemingly inexhaustible balls. By the time he’s done with you, it feels like your belly has put on twenty pounds.", parse);
            Text.NL();
            
            player.OrgasmCum(2);
            var cum = player.OrgasmCum(2);
            
            if(player.FirstCock()) {
                Text.Add("The intense pressure once again forces an orgasm from your battered [balls], causing yet more sticky cum to leak from your [cocks]. ", parse);
                if(cum > 6)
                    Text.Add("Somehow, even after all that, you still have a lot to give. You join your own cry to Lagon’s as you pour out an even greater amount of cum than the king himself, splashing all over your front and spreading out around you.", parse);
                else if(cum > 3)
                    Text.Add("Somehow, even after all the times you’ve come, you still manage to squeeze out a respectable amount of spunk, almost on the same level as the king.", parse);
                else if(cum > 0)
                    Text.Add("You cry out weakly as your seed splatters uselessly on the ground, nothing more than a splatter to Lagon’s river of seed.", parse);
                else
                    Text.Add("After all your continuous orgasms, you’re too spent to summon more than a pathetic trickle, no more than a raindrop compared to Lagon’s river of seed.", parse);
            }
            else
                Text.Add("The intense pressure once again brings you over the edge, leaving you a gasping, leaking mess.", parse);
            parse["gen"] = pussy ? "pussy" : "asshole";
            Text.Add(" You gasp as the lapin pulls out, spurting the last few blasts of his copious royal gift all over his well-fucked slut. Your belly is swollen with his virile sperm, your [gen] gaping and leaking. The king flops down on his seat, his cock dripping down sperm on your prone form. ", parse);
            if(burrows.LagonAlly())
                Text.Add("<i>“Carry my seed with pride, my servant,”</i> he purrs.", parse);
            else if(lagon.Relation() < 0)
                Text.Add("<i>“I’m done with you,”</i> he growls, sounding bored.", parse);
            else if(lagon.Relation() < 50)
                Text.Add("<i>“Nice fuck,”</i> he yawns languidly, waving over one of his daughters to clean him up.", parse);
            else
                Text.Add("<i>“As expected from you, slut,”</i> he grins, prodding at you playfully with his foot. <i>“Come back when you want another serving.”</i>", parse);
            Text.NL();
            
            LagonScenes.LagonImpregnate(player, pussy ? PregnancyHandler.Slot.Vag : PregnancyHandler.Slot.Butt);
            
            if(player.sexlevel >= 5) {
                Text.Add("After you regain your breath, you get up and stretch, working out the kinks in your sore muscles. There are few men who can fuck like that, you grudgingly admit. Lagon seems quite impressed by the fact that you can even walk, and you blow him a taunting kiss. He was rough… but by the spirits that felt amazing. Who knows, perhaps you’ll ask him for another round later.", parse);
                player.AddSPFraction(-0.1);
            }
            else if(player.sexlevel >= 3) {
                Text.Add("You’re a little wobbly on your [feet] by the time you finally recover, exhausted from the rough ordeal. Still… the king sure knows how to make you cum, whether you want to or not. Seeing your stamina, Lagon nods appreciatively, and for a moment it looks like he’s considering taking you for another round, just to see if you’d break.", parse);
                player.AddSPFraction(-0.25);
                TimeStep({minute: 15});
            }
            else {
                Text.Add("It’s quite a long time before you can even move, so exhausted are you from the king’s rough fucking. You’re a complete mess, barely able to walk straight, and you’re going to need some time to recover after this ordeal. Seeing your distress, Lagon merely chuckles, suggesting that perhaps you can wobble your way down the Pit and rest there for a while.", parse);
                player.AddSPFraction(-0.5);
                TimeStep({minute: 30});
            }
            Text.NL();
            if(opheliaPresent) {
                Text.Add("<i>“Now, what did you want, Ophelia?”</i> the king dismisses you and motions for his daughter to step forward. ", parse);
                if(blownbyophelia)
                    Text.Add("<i>“Surely you didn’t come here only to suck cocks?”</i> ", parse);
                Text.Add("As you leave, the alchemist hurries over to the throne and tries to put forth her request a second time. At least the king should be in a good mood now.", parse);
            }
            else
                Text.Add("He gives you a dismissive wave, adding that he’ll be waiting if you feel you have another itch that needs scratching.", parse);
            Text.NL();
            Text.Add("You somehow manage to get yourself moderately cleaned up, readying yourself to set out on your journey again.", parse);
            Text.Flush();
            
            player.slut.IncreaseStat(75, 2);
            player.subDom.DecreaseStat(-75, 2);
            lagon.relation.IncreaseStat(0, 4);
            lagon.relation.IncreaseStat(80, 4);
            TimeStep({minute: 45});
            
            Gui.NextPrompt();
        });
    }

    //TODO
    export function RulerPitEntrypoint() {
        var parse : any = {
            
        };
        
        Text.Add("PLACEHOLDER (pick something else for now)", parse);
        Text.Add("", parse);
        Text.NL();
        Text.Flush();
        
        Gui.NextPrompt();
    }


    export function AlliedFirst() {
        let player = GAME().player;
        let lagon = GAME().lagon;

        var parse : any = {
            
        };
        
        lagon.flags["Talk"] |= LagonFlags.Talk.AlliedFirst;
        
        Text.Clear();
        Text.Add("<i>“Ah, if it isn’t my little loyal minion,”</i> Lagon greets you expansively as you approach. The king is lounging on his throne as usual, a pretty little lagomorph female kneeling at his feet, dutifully polishing the royal cock. He irritably shoves her away, letting the glistening pillar of flesh out into the air. Lagon lets it bob there, unconcerned about the pre forming on the tip. You shift uncomfortably, uncertain what he has in mind.", parse);
        Text.NL();
        Text.Add("<i>“Now, far be it from me to withhold such a loyal subject their dues, yes? You know well that I always richly reward obedience...”</i> He lets the promise hang in the air a while, seeing if you’ll take the bait. <i>“So… what award could be worthy of your betrayal?”</i> There’s a guilty twinge as the king reminds you of Ophelia. No, it was the only way.", parse);
        Text.NL();
        Text.Add("<i>“Yes, yes, that is truly the highest honor I could bestow,”</i> Lagon drawls to himself, tapping his chin. Turning to you, the king gives you a wide grin. <i>“For your services to the lagomorph kingdom, you are hereby rewarded with the king himself deigning to bed you.”</i>", parse);
        Text.NL();
        Text.Add("You stiffen, not quite sure how to respond to that. The lagomorph’s massive member bobs invitingly as Lagon leans forward. <i>“I insist,”</i> he adds.", parse);
        Text.Flush();
        
        lagon.relation.IncreaseStat(40, 100);
        //[Blowjob][Get fucked][The Pit][Decline]
        var options = new Array();
        options.push({ nameStr : "Blowjob",
            func : function() {
                Text.Clear();
                Text.Add("<i>“Is my loyal minion apprehensive? Or perhaps just hungry?”</i> Lagon grins, motioning for you to come closer. <i>“You have your king’s permission to suck his cock.”</i> He reclines, eyes intent on you as he waits for you to get started. Swallowing your doubts, you kneel down between his legs, licking your lips.", parse);
                Text.NL();
                LagonScenes.RulerBlowjobEntrypoint();
            }, enabled : true,
            tooltip : "Perhaps just start with what the girl was doing as you came in."
        });
        options.push({ nameStr : "Get fucked",
            func : function() {
                Text.Clear();
                Text.Add("<i>“Very good,”</i> Lagon murmurs, motioning for you to approach. <i>“The king shall share his bounty with his loyal subject… with his slut.”</i> You gulp as your eyes meet his. There is a hunger in them, a raging fire that seeks to use and consume all that stands before it… and right now, you are in his sights. And Aria help you, you want to be there.", parse);
                Text.NL();
                LagonScenes.RulerGetFuckedEntrypoint(false);
            }, enabled : true,
            tooltip : "Yes… you want this. Accept the king’s reward."
        });
        options.push({ nameStr : "The Pit",
            func : function() {
                Text.Clear();
                Text.Add("<i>“You keep exceeding my expectations, my little slut,”</i> Lagon laughs, slapping the arm of his throne. <i>“But very well, I shall entertain your request. You’ll receive a place of honor right next to my dear mate, and you may stay there for as long as you please. All your needs will be taken care of, and I will personally grace you whenever the mood strikes me. Is that what you wish for?”</i>", parse);
                Text.NL();
                Text.Add("You nod eagerly… there’s nothing you could wish for more.", parse);
                Text.NL();
                parse["step"] = player.HasLegs() ? "step" : "slither";
                Text.Add("<i>“Then follow me, slut.”</i> The lagomorph king bounds to his feet, throwing a familiar arm around your shoulder as he marches you out of the throne room and into the tunnels. <i>“I’d give you a good fuck before we go, but I think it best to wait until we’re there… I think you’d have trouble walking for a while, and I’m sure you wouldn’t want to miss out on any action.”</i> With your heart in your throat, you keep pace with him, a skip in your [step].", parse);
                Text.NL();
                LagonScenes.RulerPitEntrypoint();
            }, enabled : true,
            tooltip : "You wish for nothing more than to be fucked by him… by him and everyone of his men, by Vena, by the entire Pit."
        });
        options.push({ nameStr : "Decline",
            func : function() {
                Text.Clear();
                Text.Add("<i>“How noble of you, declining your just payment,”</i> Lagon drawls, waving for another one of his daughters to claim your reward instead. <i>“Truly, you’re a paragon of honor, shedding your blood for your king without wishing for anything in return.”</i> He looks disappointed at your refusal to humiliate yourself, but it’s not about to ruin his good mood.", parse);
                Text.NL();
                Text.Add("<i>“Now, what did you want?”</i>", parse);
                Text.Flush();
                
                LagonScenes.RulerPrompt();
            }, enabled : true,
            tooltip : "You… ah, you really have to pass."
        });
        Gui.SetButtonsFromList(options, false, null);
    }

    export function RulerTalkPrompt() {
        let player = GAME().player;
        let party : Party = GAME().party;
        let roa = GAME().roa;
        let ophelia = GAME().ophelia;
        let lagon = GAME().lagon;
        let burrows = GAME().burrows;

        var parse : any = {
            tongue : function() { return player.TongueDesc(); }
        };
        
        //[Burrows][Lagon][Vena][Ophelia] { [Scepter][Roa] }
        var options = new Array();
        options.push({ nameStr : "Burrows",
            func : function() {
                Text.Clear();
                TimeStep({minute: 10});
                if(lagon.Relation() < 25) {
                    Text.Add("<i>“I don’t find any reason to share my plans with an outsider,”</i> Lagon frowns. <i>“You are here because you are somewhat useful to me, and I pay you for being useful. Don’t think it’s anything more than that.”</i>", parse);
                    Text.Flush();
                    LagonScenes.RulerTalkPrompt();
                    return;
                }
                else if(lagon.Relation() < 50)
                    Text.Add("<i>“I only wish what’s best for me and my extended family,”</i> Lagon replies, waving expansively. <i>“There are many on the outside who would wish us exterminated, and hunt my kind like vermin. We are fully justified in protecting ourselves.”</i>", parse);
                else
                    Text.Add("<i>“Ah, my simple little friend, what do you think I plan to do with it?”</i> Lagon scratches your head fondly. <i>“My children will continue to multiply and spread across the lands, until there are no more predators that will hunt us. Of course, I won’t be a heartless ruler; anyone we subjugate are free to become part of the colony and take their place in the breeding pits.”</i>", parse);
                Text.NL();
                Text.Add("How did it all start?", parse);
                Text.NL();
                Text.Add("<i>“It started when I gained the strength to strike back. I vowed to never let myself be stepped on by those pitiful outsiders again. They’ll pay for what they’ve done, mark my words.”</i> The king taps the armrest of his throne restlessly.", parse);
                Text.NL();
                Text.Add("<i>“This is why I’ve ordered my subjects to ravage the caravans of the surface dwellers; we weaken them and gather the tools of their downfall.”</i> Lagon smiles at you. ", parse);
                if(lagon.Relation() < 50)
                    Text.Add("<i>“It’s an uneven but just battle.”</i>", parse);
                else
                    Text.Add("<i>“Sometimes, I’m able to find fine tools indeed,”</i> he adds, patting your head.", parse);
                if(burrows.LagonAlly()) {
                    Text.NL();
                    Text.Add("And… what now? What will his next move be?", parse);
                    Text.NL();
                    Text.Add("<i>“Thanks to your loyalty, I no longer have a rebellion brewing. Thus, the time has come to turn our eyes outside.”</i> Lagon taps his chin thoughtfully. <i>“My scouts bring me word that there’s unrest in the human kingdom. It’s right on our doorstep, and the less they think to look our way, the better. As my little agent, I’m sure you could infiltrate the ranks of the rebellious exiles and stir some havoc in Rigard.”</i>", parse);
                    Text.NL();
                    Text.Add("The king smiles. <i>“You can do that for me, can’t you? You’ve proven yourself in the past to be an expert betrayer.”</i> The words sting, even though they are true.", parse);
                }
                Text.Flush();
                LagonScenes.RulerTalkPrompt();
            }, enabled : true,
            tooltip : "This colony, this kingdom of his… what’s he planning to do with it?"
        });
        options.push({ nameStr : "Lagon",
            func : function() {
                Text.Clear();
                TimeStep({minute: 10});
                if(lagon.Relation() < 0) {
                    Text.Add("<i>“I don’t think you’ve earned learning anything about my past, outsider,”</i> Lagon frowns, <i>“and asking about it is very presumptuous. Know that I am king and master here in the burrows. Anything else, you’ll have to work for.”</i>", parse);
                    Text.Flush();
                    LagonScenes.RulerTalkPrompt();
                    return;
                }
                else if(lagon.Relation() < 50) {
                    Text.Add("<i>“A question worth asking, certainly,”</i> Lagon nods, scratching his chin. <i>“I fully understand that it’s strange to find a being such as I among my people.”</i>", parse);
                    lagon.relation.IncreaseStat(25, 1);
                }
                else {
                    Text.Add("<i>“Shouldn’t you be quite familiar with me already?”</i> Lagon chuckles, momentarily pulling his daughter off his cock to let you get a taste. You drag your [tongue] along the length of his massive shaft, relishing in his masculine musk. It’s almost enough to make you forget what you asked in the first place.", parse);
                    Text.NL();
                    Text.Add("<i>“But nonetheless, I’ll regale you with my tale, since you so desire. Just keep that up, and I’ll answer whatever questions you may have.”</i> You nod happily, licking his cock together with his daughter.", parse);
                    lagon.relation.IncreaseStat(60, 1);
                }
                Text.NL();
                Text.Add("<i>“A suitable place to start would be the beginnings of our race,”</i> the king continues, leaning back in his throne. <i>“The lagomorphs are considered lesser morphs by the surface dwellers, since their nature does not allow them to live in the cities built by men. As such, my people are outcast, sometimes even hunted as pests by these hypocritical and ‘civilized’ folks.”</i> There’s anger in his voice, ", parse);
                if(lagon.Relation() < 50)
                    Text.Add("and he clenches his fist irritably.", parse);
                else {
                    Text.Add("and you can feel his hand press on the back of your head, urging you to relieve his tension. Hasting to pleasure your master, you fondle his balls while you wrap your lips around the bulbous tip of his member, eagerly swallowing his pre.", parse);
                    Sex.Blowjob(player, lagon);
                    player.FuckOral(player.Mouth(), lagon.FirstCock(), 1);
                    lagon.Fuck(lagon.FirstCock(), 1);
                }
                Text.NL();
                Text.Add("<i>“Among these ‘lesser’ morphs, I was born. Unlike my weaker siblings, I did not hesitate to take what was my due and strike back at my oppressors. Together with my mate, Vena, I claimed my kingdom and founded my dynasty.”</i> Talking about Vena seems to calm him down, and he smiles fondly. <i>“My queen understood, and she agreed that we had to protect our family. The only way to do so with these barbaric surface dwellers is by force. Thus, we build our strength and deal with trespassers accordingly.”</i>", parse);
                Text.NL();
                Text.Add("Didn’t he have any rivals or competitors for the throne? To you, it sounds like the lagomorphs used to live in much smaller groups than this.", parse);
                Text.NL();
                if(lagon.Relation() >= 50)
                    Text.Add("Lagon irritably motions for you to continue with your blowjob, annoyed at the interruption. ", parse);
                Text.Add("<i>“Of course there were, but they lacked the strength and ambition to follow through with it. Breaking them down was amusing. My minions know full well what happens to disobedient traitors.”</i> ", parse);
                if(burrows.LagonAlly())
                    Text.Add("Yes… you remember well what he did to his own daughter. It’s best to keep staying on his good side.", parse);
                else if(burrows.flags["Access"] >= BurrowsFlags.AccessFlags.Stage3)
                    Text.Add("You gulp, hoping that he didn’t notice. If he found out what Ophelia asked you to do...", parse);
                else
                    Text.Add("You keep your thoughts about this to yourself.", parse);
                Text.NL();
                parse["rel"] = lagon.Relation() >= 50 ? " - unf -" : "";
                Text.Add("<i>“Most of my soldiers are my children; dutiful, good children that will[rel] birth me even more minions and further extend our family.”</i>", parse);
                
                if(lagon.Relation() >= 50) {
                    Text.NL();
                    Text.Add("<i>“Now… anything else you’d like to know, little slut?”</i> Lagon grunts, suddenly thrusting his hips forward. The hand at the back of your neck keeps your head firmly in place as the well-endowed lapin stuffs your throat with his gargantuan flesh-pole. You’re helpless to do anything other than sit there and take it, moaning weakly as the powerful male ravages your gullet.", parse);
                    Text.NL();
                    Text.Add("<i>“Perhaps what my seed tastes like? Or would you prefer to not - ngh - spill any of it?”</i> The king has gotten up on his feet, now able to thrust with the full power of his legs. His rutting is growing more erratic, announcing his impending climax. With a primal roar, Lagon unloads into your stomach, pouring a veritable torrent of cum down your throat. Regardless of your own wishes, you get plenty of opportunity to taste him as he slowly withdraws his throbbing member, stray ejaculate quickly filling your mouth and painting your face white. His daughter quickly joins in cleaning you up, eager to get her share of cream.", parse);
                    Text.NL();
                    Text.Add("<i>“I hope you found our session educational,”</i> Lagon chuckles, flopping back onto his throne, letting his daughter clean up his leaking member. With a wave, he dismisses you from his presence.", parse);
                    Text.Flush();
                    TimeStep({minute: 10});
                    player.AddLustFraction(0.3);
                    Gui.NextPrompt();
                }
                else {
                    Text.Flush();
                    LagonScenes.RulerTalkPrompt();
                }
            }, enabled : true,
            tooltip : "Ask him about himself."
        });
        options.push({ nameStr : "Vena",
            func : function() {
                Text.Clear();
                TimeStep({minute: 10});
                if(lagon.Relation() < 0)
                    Text.Add("<i>“Vena is a loyal and true wife. She willingly sacrifice herself for the greater good. That is all you need to know,”</i> Lagon replies.", parse);
                else if(lagon.Relation() < 50)
                    Text.Add("<i>“My dear Vena has always been true and loyal to me. Her heartfelt obedience and dedication is truly inspiring, don’t you think?”</i> Lagon looks at you meaningfully.", parse);
                else
                    Text.Add("<i>“My mate is the prime example of a loyal subject. Obedient and willing; diligent in her service to me.”</i> There’s pride in his voice as he speaks of her. The king scratches your head fondly.", parse);
                Text.Add(" <i>“Her duty is one reserved for those I hold in highest regard. Thanks to her, my army grows stronger every day.”</i>", parse);
                Text.NL();
                Text.Add("Then he’s… not bothered by the fact that she’s always being fucked by everyone in the Pit?", parse);
                Text.NL();
                Text.Add("<i>“Why would I be?”</i> Lagon queries, scratching his daughter’s ear as she bobs her head on his cock. <i>“My wife has needs, and I cannot attend her constantly. It’s only fair I let her children care for her. Besides, I make sure to always be the one who impregnates her.”</i> He studies you inquiringly. <i>“And what do you make of this little arrangement?”</i>", parse);
                Text.Flush();
                
                //[Fair][Admirable][Questionable]
                var options = new Array();
                options.push({ nameStr : "Fair",
                    func : function() {
                        Text.Clear();
                        Text.Add("As an outsider, you cannot fault the lagomorphs’ customs.", parse);
                        Text.NL();
                        Text.Add("<i>“Indeed, it’s not your place to criticize,”</i> Lagon agrees sagely. <i>“Know that all she does, she does on her own volition, out of the goodness of her heart and her dedication to me.”</i>", parse);
                        Text.NL();
                        Text.Add("You keep your thoughts to yourself.", parse);
                        Text.Flush();
                        LagonScenes.RulerTalkPrompt();
                    }, enabled : true,
                    tooltip : "Better not anger him."
                });
                options.push({ nameStr : "Admirable",
                    func : function() {
                        Text.Clear();
                        Text.Add("You agree that he’s lucky to have a mate such as Vena. Anyone would be envious to be in her place.", parse);
                        Text.NL();
                        Text.Add("<i>“Luck has nothing to do with it,”</i> Lagon scoffs. <i>“I’m not king for nothing. It’s a title that belongs to the strongest and most capable, and I am both.”</i> The way he phrases it, it’s no boast, merely a statement of fact. It’s no lie either.", parse);
                        Text.NL();
                        Text.Add("<i>“You are correct that there are many who would offer much to take her place at my side, but they lack her dedication. Many of my daughters have offered themselves as such, but they all break after a week or two. Such a pity,”</i> he sighs.", parse);
                        if(lagon.Relation() >= 50) {
                            Text.NL();
                            parse["ally"] = burrows.LagonAlly() ? "you merely have to ask" : "prove your loyalty to me and I shall consider it";
                            Text.Add("<i>“Now, one such as you, who are both strong and dedicated, that is the sort of subject fit to take on such a task,”</i> he cherishes you. <i>“I know there may be many things that you hold to be important, but if you wish to let them go and receive the same honors as Vena, [ally].”</i>", parse);
                        }
                        Text.Flush();
                        lagon.relation.IncreaseStat(10, 1);
                        LagonScenes.RulerTalkPrompt();
                    }, enabled : true,
                    tooltip : "Agree that it truly is a high honor. Anyone would be envious to be in Vena’s place."
                });
                options.push({ nameStr : "Questionable",
                    func : function() {
                        Text.Clear();
                        Text.Add("<i>“Your ways may not be ours, but do not presume to judge my mate’s dedication.”</i> There’s a thinly veiled threat in his voice, suggesting that you shouldn’t continue this train of thought. <i>“My mate is mine to treat as I please.”</i>", parse);
                        Text.NL();
                        Text.Add("<i>“Now, if there’s nothing else, be on your way traveler,”</i> Lagon dismisses you curtly, putting a firm hand on his daughter’s head and pressing down until the girl is almost choking on his dick. He seems to be in a bad mood; perhaps it’s best to leave for now.", parse);
                        Text.Flush();
                        lagon.relation.DecreaseStat(0, -2);
                        Gui.NextPrompt();
                    }, enabled : !burrows.LagonAlly(),
                    tooltip : "That’s not how he should treat his wife."
                });
                Gui.SetButtonsFromList(options, false, null);
            }, enabled : true,
            tooltip : "Ask him about his mate, Vena."
        });
        options.push({ nameStr : "Ophelia",
            func : function() {
                Text.Clear();
                TimeStep({minute: 10});
                if(burrows.LagonAlly()) {
                    Text.Add("The king’s expression darkens as you remind him of his rebellious daughter. <i>“That traitorous bitch got what was coming to her,”</i> he growls. <i>“Her potions may have proven useful, but I hold no value in pawns that go against my will. Not like you,”</i> he adds, <i>“you’ll continue being my loyal pet, won’t you?”</i>", parse);
                    Text.NL();
                    Text.Add("You gulp uncertainly and nod. You wouldn’t dream of going against him.", parse);
                    Text.NL();
                    Text.Add("<i>“Do not worry, I know you don’t have it in you to betray me, pet,”</i> he assures you. Looking imploringly at you, Lagon adds: <i>“And how is my daughter treating you? I hope that she’s to your satisfaction?”</i>", parse);
                    Text.NL();
                    parse["master"] = player.mfFem("master", "mistress");
                    if(ophelia.InParty())
                        Text.Add("<i>“New [master] is great!”</i> Ophelia chimes in, gushing over you. <i>“Treats Ophelia good!”</i> The perky lapin gives you a hug, rubbing her breasts against your arm sultrily. She probably needs some attention when this is said and done.", parse);
                    else
                        Text.Add("You assure him that you have no complaints.", parse);
                    Text.NL();
                    Text.Add("<i>“Excellent,”</i> he leans back, satisfied with his answer.", parse);
                }
                else {
                    Text.Add("The king smiles as you remind him of his favorite daughter. <i>“She’s a diligent one, isn’t she?”</i> he says proudly. <i>“Quite sharp too, reminds me of her mother at times.”</i>", parse);
                    Text.NL();
                    if(lagon.Relation() < 0) {
                        Text.Add("<i>“She shows her loyalty by brewing potions for me. Some of them are even quite useful.”</i> That seems to be all that Lagon wishes to say. Perhaps you’re better off asking Ophelia herself.", parse);
                        Text.Flush();
                        Gui.NextPrompt();
                        return;
                    }
                    else
                        Text.Add("<i>“She’s one of my favorites. Such a clever girl.”</i> Though he’s talking about his own daughter, his tone and his words make it sound as if he’s a kid boasting about a cool toy.", parse);
                }
                Text.NL();
                Text.Add("<i>“Unlike most of her brothers and sisters, Ophelia inherited some portion of my intellect,”</i> Lagon continues. <i>“It was quite amusing to see her sift through the junk scavenged from the surface and put it together into something useful.”</i>", parse);
                Text.NL();
                if(burrows.LagonAlly())
                    Text.Add("<i>“Her tricks were cute, but in the end they were only mere shortcuts to real strength. I’m saddened that I had to punish her for her disobedient behavior, but I cannot be lenient when my children attempts to bite the hand that feeds them. I’m sure you can understand.”</i>", parse);
                else {
                    parse["rel"] = lagon.Relation() >= 50 ? " Not to mention, Vena’s current condition is all thanks to her." : "";
                    Text.Add("<i>“Her tricks have been quite useful to me so far, allowing me to take shortcuts to gain strength more rapidly.[rel]”</i>", parse);
                }
                Text.Flush();
                LagonScenes.RulerTalkPrompt();
            }, enabled : true,
            tooltip : "Ask him about his daughter, Ophelia."
        });
        //TODO Followers
        /*
        if() { //TODO, only available once
            options.push({ nameStr : "Followers",
                func : function() {
                    Text.Clear();
                    TimeStep({minute: 10});
                    Text.Add("<i>“A fair request.”</i> The lagomorph king claps his hands sharply, summoning four young rabbits. <i>“As I said, I can’t offer you Ophelia, but this lot should do well enough.”</i> You take some time to examine your prizes. There are two males, slim and lithe, and two females with exquisite curved forms. All of them have coats of fine white fur, silky to the touch. <i>“Are these to your liking? You’ll have to excuse me for not remembering their names, they are simple enough creatures, call them whatever you like.”</i>", parse);
                    Text.NL();
                    parse["master"] = player.mfTrue("master", "mistress");
                    Text.Add("You nod, pleased with your reward. Lagon’s children hop over to your side, cuddling up close to their new [master].", parse);
                    Text.NL();
                    Text.Add("<b>A group of Lagon’s children have joined you. They aren’t going to be much use in combat as they are pretty weak, but they make up for it in their eagerness to please you.</b>", parse);
                    Text.Flush();
                    LagonScenes.RulerTalkPrompt();
                }, enabled : true,
                tooltip : "Ask him for a selection of his sons and daughters to join you."
            });
        }
        */
        if(burrows.LagonAlly()) {
            if(!party.Inv().QueryNum(QuestItems.Scepter)) {
                options.push({ nameStr : "Scepter",
                    func : function() {
                        Text.Clear();
                        TimeStep({minute: 10});
                        Text.Add("<i>“A mere trinket acquired during my youth,”</i> Lagon dismisses it, <i>“though if it carries such power as Ophelia seemed to think, perhaps I should have guarded it more carefully. In either case, it’s of little use to me now.”</i>", parse);
                        Text.NL();
                        Text.Add("How did he lose it in the first place?", parse);
                        Text.NL();
                        Text.Add("<i>“It was the day that little sissy ran away… his name escapes me, one of my sons. I think the only one to match him for sluttiness is Vena. That kid would bend over for anyone.”</i> The king shakes his head in disgust. <i>“I guess he thought to use it to trade with the surface dwellers. Losing it was a minor irk, but betrayal still stings.”</i>", parse);
                        Text.NL();
                        if(!roa.Recruited()) {
                            Text.Add("<i>“You said that you found him during your travels? Roa, was it?”</i> You nod, confirming that you’ve met the wayward bunny in the whorehouses of Rigard when you were searching for the scepter.", parse);
                            Text.NL();
                            Text.Add("<i>“I’d like it if you could bring him back here… perhaps his sister can convince him to come. I don’t want his juvenile rebellion to go unpunished.”</i> He waves dismissively. <i>“After I’m done with him, you can do what you please with him.”</i>", parse);
                            Text.NL();
                        }
                        Text.Add("The powerful lapin picks up the scepter from where it was discarded in his treasure pile, studying it lazily. <i>“It’s pretty enough, but nothing more than that.”</i>", parse);
                        Text.Flush();
                        
                        //[Silence][Request]
                        var options = new Array();
                        options.push({ nameStr : "Silence",
                            func : function() {
                                Text.Clear();
                                Text.Add("<i>“If there’s nothing else, I have better things to do,”</i> the kind dismisses you.", parse);
                                Text.Flush();
                                LagonScenes.RulerTalkPrompt();
                            }, enabled : true,
                            tooltip : "Say nothing."
                        });
                        options.push({ nameStr : "Request",
                            func : function() {
                                Text.Clear();
                                if(lagon.Relation() < 50) {
                                    Text.Add("<i>“I don’t think that you’ve quite earned something like that yet, pet,”</i> Lagon drawls lazily, without his eyes leaving the valuable stone. <i>“You’ll have to be a little more… shall we say enthusiastic? Request denied.”</i>", parse);
                                    Text.NL();
                                    Text.Add("You’re pretty sure you know in what way the king would like you to show your ‘loyalty’ to him.", parse);
                                    Text.Flush();
                                    LagonScenes.RulerTalkPrompt();
                                    return;
                                }
                                else if((lagon.flags["Talk"] & LagonFlags.Talk.ScepterTalk) == 0) {
                                    Text.Add("<i>“Oh? What value has it to you?”</i> Lagon asks curiously.", parse);
                                    Text.NL();
                                    Text.Add("Well, a powerful artifact like that could be of much use to you in your fight.", parse);
                                    Text.NL();
                                    Text.Add("<i>“Well… I can’t let it go just like that, now can I?”</i> he gives it a twirl, scratching your head fondly.", parse);
                                    Text.NL();
                                    Text.Add("Wait, didn’t he just say that it was of no use to him?", parse);
                                    Text.NL();
                                    Text.Add("<i>“Don’t contradict me, pet,”</i> he idly chastises you. <i>“It has sentimental value. I couldn’t just let something like this go… without something in return.”</i>", parse);
                                    Text.NL();
                                    Text.Add("Ah… what did he have in mind, exactly?", parse);
                                    Text.NL();
                                    Text.Add("<i>“Oh, nothing much. My sons and daughters grow antsy when they’re idle for too long… I’d like you to entertain them for a while.”</i>", parse);
                                    Text.NL();
                                    Text.Add("How?", parse);
                                    Text.NL();
                                    Text.Add("<i>“Spend a week in the Pit, for anyone to use and abuse,”</i> Lagon purrs. <i>“Embrace your slutty nature and take your place beside Vena. Endure for a week, and it shall be yours.”</i>", parse);
                                    Text.NL();
                                    Text.Add("You give the king a dubious glance. He’s obviously testing you… but you have no leverage here. <i>“Of course, you are free to refuse,”</i> he shrugs, carelessly throwing the scepter back on the pile. <i>“No Pit, no scepter.”</i>", parse);
                                    lagon.flags["Talk"] |= LagonFlags.Talk.ScepterTalk;
                                }
                                else {
                                    Text.Add("<i>“Oh, would you like to reconsider our deal?”</i> The lecherous king grins. <i>“Give me a week, and it shall be yours.”</i>", parse);
                                }
                                Text.Flush();
                                
                                //[Refuse][Accept]
                                var options = new Array();
                                options.push({ nameStr : "Refuse",
                                    func : function() {
                                        Text.Clear();
                                        Text.Add("<i>“Your loss,”</i> Lagon shrugs.", parse);
                                        Text.Flush();
                                        LagonScenes.RulerTalkPrompt();
                                    }, enabled : true,
                                    tooltip : "Ah… no. You don’t really need it, come to think of it."
                                });
                                options.push({ nameStr : "Accept",
                                    func : function() {
                                        Text.Clear();
                                        Text.Add("<i>“Excellent… this shall be very entertaining, I’m sure,”</i> Lagon grins, scratching your head. He leans down, adding. <i>“Of course, avoiding your duty or leaving the Pit for any reason will count as breaking the deal. Only a full week will do.”</i>", parse);
                                        Text.NL();
                                        Text.Add("You nod, uncertain what you’ve gotten yourself into.", parse);
                                        Text.NL();
                                        Text.Add("<i>“Then there is no time like the present! Best begin at once, you have a long week ahead of you, my horny little bitch.”</i> With that, he roughly hauls you to your feet and twist you around, giving you a shove in the direction of the entrance. As you set off into the tunnel, the king joins you, leading you on. <i>“Don’t want you having cold feet now, right?”</i> he jibes, throwing a possessive arm around your waist.", parse);
                                        Text.NL();
                                        
                                        /*
                                        * TODO
    #set up 1 week challenge

    #goto Pit entry point

    Pit win (todo)


    Pit loss (todo)
                                        */
                                        //TODO parameters
                                        LagonScenes.RulerPitEntrypoint();
                                    }, enabled : true,
                                    tooltip : player.Slut() < 75 ? "You really want that scepter." : "Scepter or not, that proposal sounds really enticing..."
                                });
                                Gui.SetButtonsFromList(options, false, null);
                            }, enabled : true,
                            tooltip : "Ask him to give you the scepter."
                        });
                        Gui.SetButtonsFromList(options, false, null);
                    }, enabled : true,
                    tooltip : "Ask him about the story of the scepter, and what it’s significance is. You’ve seen its effects up close with the Gol queen."
                });
            }
            options.push({ nameStr : "Roa",
                func : function() {
                    Text.Clear();
                    TimeStep({minute: 10});
                    if(roa.Recruited()) {
                        //TODO Recruited Roa talk
                    }
                    else if(lagon.flags["Talk"] & LagonFlags.Talk.RoaTalk) {
                        Text.Add("<i>“Him again?”</i> Lagon frowns. <i>“If you have the time to waste your breath asking about that slut, why don’t you go and fetch him instead? I’d like to talk to him about disobedience.”</i>", parse);
                    }
                    else {
                        Text.Add("<i>“Who?”</i> Lagon looks confused before you remind him about his son; the one who ran away with the scepter? <i>“Ah, so that’s what his name was.”</i> He shrugs. <i>“What about him?”</i>", parse);
                        Text.NL();
                        Text.Add("Well… uh… it’s his son, right? The lapin laughs haughtily.", parse);
                        Text.NL();
                        Text.Add("<i>“I have more sons than I can count, the only reason I remember this one is because he had the gall to run away.”</i> He taps his chin, trying to recall something about the wayward bunny. <i>“Roa was weak; a kid half his age could push him around. He’d take it too; don’t think I’ve seen a wimpier rabbit in my life. He’d moan like a bitch in heat when you fucked him too, begging for more.”</i>", parse);
                        Text.NL();
                        Text.Add("<i>“I think… yes, he was the one always hiding behind Ophelia’s shirttails and gulping down her potions. Not even her alchemy could make him man up, apparently.”</i> Lagon chuckles, waving dismissively.", parse);
                        Text.NL();
                        Text.Add("<i>“He’s inconsequential. You bringing him up reminds me though… Even with him stealing from my hoard, chasing him down would be too much of a bother. Now that you know where he is though...”</i> The king idly scratches his daughter’s head, collecting his thoughts. <i>“Why don’t you do me a favor, pet?”</i>", parse);
                        Text.NL();
                        Text.Add("What does he have in mind?", parse);
                        Text.NL();
                        Text.Add("<i>“I’d like you to fetch my son and bring him here. I’m sure his sister can convince him to come along, he always looked up to her.”</i> There’s a malicious smile playing on the lapin’s lips. <i>“I’d like to talk with him on the subject of disobedience.”</i>", parse);
                        lagon.flags["Talk"] |= LagonFlags.Talk.RoaTalk;
                    }
                    Text.Flush();
                    LagonScenes.RulerTalkPrompt();
                }, enabled : true,
                tooltip : "Ask about Roa."
            });
        }
        Gui.SetButtonsFromList(options, true, function() {
            Text.Clear();
            Text.Add("<i>“Very well. Anything else?”</i>", parse);
            Text.Flush();
            
            LagonScenes.RulerPrompt();
        });
    }

    export function PitDefianceWin() {
        let party : Party = GAME().party;
        let ophelia = GAME().ophelia;
        let lagon = GAME().lagon;

        SetGameState(GameState.Event, Gui);
        var enc = this;
        var parse : any = {
            
        };
        
        Gui.Callstack.push(function() {
            Text.Clear();
            Text.Add("Lagon falls back, his face a mask of rage. Before you can step in to deliver the final blow, dozens of rabbits flood in your way, showering you in ineffectual punches. You try to throw them out of the way, but they are just too many. With the combined pressure of their bodies, the lagomorph mob pushes you away from their king.", parse);
            Text.NL();
            Text.Add("<i>“Don’t fucking think this is the end!”</i> Lagon roars, similarly restrained as he’s quickly carried from the hall. <i>“I’ll find you, and I’ll fucking <b>murder</b> you, little cretin!”</i> His ranting fades as his subjects retreat, leaving you a brief moment of respite. You are about to give chase when a hand on your shoulders reins you in.", parse);
            Text.NL();
            Text.Add("<i>“Quickly, come with me!”</i> Ophelia urges you, leading toward the exit. She’s very excited, hopping along with a new-found energy in her step. <i>“That was amazing!”</i> the alchemist exclaims, absentmindedly pulling you around a group of bunnies so deep into the carnal act they probably didn’t even notice the fight. <i>“I’ve never seen <b>anyone</b> stand up to father! Well, and come out of it victorious, at least.”</i>", parse);
            Text.NL();
            Text.Add("As you run, Ophelia’s gaze flickers left and right, as if she’s expecting an ambush. <i>“Gotta get out before the honor guard arrives,”</i> she mutters to herself. Why not stand and fight? You should be heading for the throne room, you counter.", parse);
            Text.NL();
            Text.Add("<i>“No, no,”</i> she shakes her head, still not quite understanding what just happened. <i>“He’s hiding his strength, he has to be. He’s trying to trap you! If you follow him, you’ll be thrown in chains!”</i> she keeps muttering to herself, but you decide to humor her for the time being. Lagon isn’t going anywhere.", parse);
            Text.NL();
            Text.Add("As you finally emerge above ground again, the alchemist takes some time to pant and wheeze before turning to face you.", parse);
            Text.NL();
            Text.Add("<i>“I… thanks,”</i> she says, bowing her head. <i>“You really saved me back there. Father’s been getting more and more out of hand… you were right to step in, and I’m grateful for it.”</i> She takes a deep breath, and slumps down on the ground. <i>“It forces my hand, however. I’ve known for a while now that this couldn’t go on, but I don’t have any ways of standing up to father on my own.”</i> Ophelia looks at you with admiration, blushing faintly. <i>“I’m not as strong, nor as brave as you.”</i>", parse);
            Text.NL();
            
            ophelia.relation.IncreaseStat(100, 25);
            ophelia.burrowsCountdown = new Time(0,0,7,0,0); //7 days
            
            OpheliaScenes.ScepterRequest(true);
            
            Text.Flush();
            
            lagon.flags["Usurp"] |= LagonFlags.Usurp.FirstFight;
            
            TimeStep({minute: 30});
            party.location = WORLD().loc.Burrows.Entrance;
            
            Gui.NextPrompt();
        });
        
        Encounter.prototype.onVictory.call(enc);
    }

    export function PitDefianceLoss() {
        let player = GAME().player;
        let party : Party = GAME().party;
        let lagon = GAME().lagon;

        SetGameState(GameState.Event, Gui);
        var parse : any = {
            face : function() { return player.FaceDesc(); },
            tongue : function() { return player.TongueDesc(); },
            anusDesc : function() { return player.Butt().AnalShort(); },
            vagDesc : function() { return player.FirstVag().Short(); },
            cocks : function() { return player.MultiCockDesc(); }
        };
        
        parse["comp"] = party.Num() == 2 ? party.Get(1).name :
                        party.Num() >  2 ? "your companions" : "";
        
        Text.Clear();
        parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
        Text.Add("You fall to the ground, exhausted from the fight. It’s no use… he’s just too strong. The taste of defeat is all the more palpable here, in the middle of the salty lake of cum fueled by hundreds of rutting rabbits. Any hopes of escape are crushed by a horde of bunnies piling up on top of you[c], the combined weight of their bodies keeping you in place.", parse);
        Text.NL();
        Text.Add("<i>“Well, that was amusing for a brief moment,”</i> Lagon chuckles, rolling his shoulders. <i>“But I’m not sure what you hoped to achieve.”</i> He hops over to you, grabbing you roughly by the chin. <i>“Did you consider that in your pitiful rebellion, you tried to deny my daughter her deepest desires? Such an unworthy cause, traveler. See? She’s so much happier without your meddling.”</i>", parse);
        Text.NL();
        Text.Add("The rabbit king forces your head to the side. Two rabbits come into view - Vena and Ophelia, the former ecstatically pounding the latter - both crying out in joyous orgasm. <i>“See how much fun they are having?”</i> he rasps in your ear. <i>“Perhaps if you are a good little slut, I’ll let you join in.”</i> Lagon effortlessly pulls you out from under the heap of bunnies, holding you by the throat in an iron grip.", parse);
        Text.NL();
        Text.Add("<i>“First, however,”</i> he grunts, his words accentuated by a heavy punch to your stomach, <i>“we need to talk about obedience.”</i> You are coughing and gasping for breath as he drops you to the ground. <i>“It’s quite simple,”</i> the royal brute continues unhurriedly as he flips you over on your stomach, making you taste salty cum. <i>“You are now lower than a worm. You’ll obey the wishes of any and all here in the burrows, be it myself or the lowest fuckslut in the Pit. This will be easy, as your orders will be quite simple. For example, <b>suck</b>.”</i>", parse);
        Text.NL();
        Text.Add("Your eyes go wide as Lagon shoves his fifteen inch monstrosity down your throat, a firm hand on your head as he continues his lecture even as he facefucks you. <i>“Now that Vena has reached perfection, I might be generous and let Ophelia experiment on <b>you</b> next.”</i> Your vision is rapidly fading as you choke on the massive shaft, eyes watering...", parse);
        Text.NL();
        
        Sex.Blowjob(player, lagon);
        player.FuckOral(player.Mouth(), lagon.FirstCock(), 3);
        lagon.Fuck(lagon.FirstCock(), 3);
        
        Text.Flush();
        
        TimeStep({hour : 1});
        
        Gui.NextPrompt(function() {
            Text.Clear();
            Text.Add("When you come to again, your [face] is smeared in sticky cum. Your throat feels raw, though blissfully empty, allowing sweet air to fill your lungs. The ordeal has barely just begun, however, as you feel a heavy weight on your back.", parse);
            Text.NL();
            Text.Add("<i>“You know,”</i> Lagon says conversationally as he roughly jams his cock into your protesting ass, <i>“I’ve even considered taking some of my daughter’s potions myself. The one that increases strength and size could be fun, don’t you think? As soon as I do it, I’ll be sure to test it out on you first.”</i>", parse);
            Text.NL();
            
            Sex.Anal(lagon, player);
            player.FuckAnal(player.Butt(), lagon.FirstCock(), 4);
            lagon.Fuck(lagon.FirstCock(), 4);
            
            LagonScenes.LagonImpregnate(player, PregnancyHandler.Slot.Butt);
            
            Text.Add("You bite down your response, trying to keep hold of your sanity while the rabbit king ravages your [anusDesc]. Visions of the brutes created by Ophelia’s alchemy swims into your mind. As big as Lagon’s cock is now - something you’re rather intimately familiar with now - how big would it be once he took something like that? Three feet? Four?", parse);
            Text.NL();
            Text.Add("<i>“I’ve barely even gotten started with you, little bitch,”</i> Lagon growls, his hips a blur as he goes to town on your ass, <i>“and once I’m satisfied, once I’ve put enough loads in you to make your belly swell even larger than Vena’s, then I’ll let the rest of the Pit have you. Hundreds of bunnies fucking you without rest for days on end, and each time one of them cums in you, you’ll be reminded of your mistake; the day that you dared raise your hand against me.”</i>", parse);
            Text.NL();
            if(party.Num() > 1) {
                var p1 = party.Get(1);
                parse["s"]      = party.Num() > 2 ? "s" : "";
                parse["heshe"]  = party.Num() > 2 ? "they" : p1.heshe();
                parse["hisher"] = party.Num() > 2 ? "their" : p1.hisher();
                parse["poss"]   = party.Num() > 2 ? "your companions'" : p1.name;
                Text.Add("<i>“The same goes for your friend[s]; [heshe] too will end [hisher] days here, in the darkness of the pit.”</i> Lagon’s voice is dripping of malice as he speaks of [poss] fate.", parse);
                Text.NL();
            }
            Text.Add("In a last weak effort to defy your tormentor, you raise your head to curse him, to denounce him, but before you can blink the powerful lagomorph has shoved your face back into the jizz-pool.", parse);
            Text.NL();
            Text.Add("Gradually, your senses dull one by one, until all that remains is the taste of cum on your [tongue], the dim silhouettes writhing in carnal bliss, the incessant heat… and the gargantuan rod stretching your back door to its limits. Everything else fades in comparison. The king’s words are too much to handle, and you force yourself to focus on this one cock. Sooner or later, Lagon has to be satisfied, right? And then you will be able to rest...", parse);
            Text.NL();
            Text.Add("Yet no rest is to be had. Even after Lagon has filled you to the brim countless times, even after Vena has done the same, even when Lagon has had a second round… not even then does it stop. Bunny after bunny ravages your every hole, usually several at once, until you’re convinced that the cum leaking from you alone is enough to threaten to fill the Pit.", parse);
            Text.NL();
            if(player.FirstVag()) {
                Text.Add("Your [vagDesc] receives equal treatment to your ass; countless cocks ravage your insides, flooding your womb with virile lagomorph seed. You realize that you will most likely spend the rest of your life just like Vena - constantly pregnant, only getting a short respite from fucking when you give birth.", parse);
                Text.NL();
            }
            if(player.FirstCock()) {
                parse = Text.ParserPlural(parse, player.NumCocks() > 1);
                Text.Add("Your [cocks] [isAre] all but forgotten, though no small amount of the jizz you are bathing in comes from yourself. On Lagon’s orders, none of the other bunnies touch [itThem], though the rabbit king promises that you will get your turn if you behave like a good slut.", parse);
                Text.NL();
            }
            Text.Add("Everything blurs together as the massive orgy around you continues, your own concerns, plans and goals discarded and forever lost. The last words you hear are Lagon calling for someone to bring you a special potion; something that will make you feel even better. You can hardly wait.", parse);
            Text.NL();
            Text.Add("Time passes...", parse);
            Text.Flush();
            
            TimeStep({hour : 1});
        
            Gui.NextPrompt(LagonScenes.BadendPit);
        });
    }

    export function BadendPit() {
        let player = GAME().player;
        let party : Party = GAME().party;

        var parse : any = {
            
        };
        
        party.location = WORLD().loc.Plains.Burrows.Pit;
        TimeStep({season: 1});
        
        Text.Clear();
        Text.Add("Whoever you were before, both physically and mentally, it’s all washed away in the orgasmic wave of ecstasy that is your every waking moment. Everywhere around you, dark shapes writhe in carnal bliss as the endless orgy of the Pit grinds on, with you as one of its central pieces.", parse);
        Text.NL();
        Text.Add("You don’t know how long you’ve been here beside Vena and Ophelia; days and weeks meld together in a mess of pleasure and cum. Much like the matriarch and her daughter, you are almost constantly pregnant, your swollen belly a temple to your dedication to your master. ", parse);
        if(!player.FirstVag())
            Text.Add("A fading memory reminds you that you were not always like this… what a horrible thing to imagine, not being able to serve your king and birth him more children. You shudder at the thought.", parse);
        else
            Text.Add("Your pussy and womb are now the property of Lagon, and whomever he chooses to fill them.", parse);
        Text.NL();
        parse["c"] = player.FirstCock() ? ", giving, receiving, it no longer matters to you" : "";
        Text.Add("Your days are filled with endless fucking[c]. All that fills your head is the next blissful orgasm, and the pleasure of knowing that you are <i>needed</i>, you serve a purpose. You and your sisters are to be the mothers of the rulers of Eden; with their rapidly growing numbers, the bunnies will soon be unstoppable.", parse);
        Text.NL();
        Text.Add("News are slow to travel down here, but your master loves to gloat about his exploits. His armies have started moving; not against Rigard, not yet, but the highland tribes are quietly submitting, one by one. Before long, the rabbits will be too many to stop; a tide of fluffy bodies washing over the walls of Rigard and breaking the city with sheer numbers. And you are one of the proud mothers of this unstoppable army.", parse);
        Text.NL();
        Text.Add("Even now, young ones kick in your womb, their growth accelerated by Ophelia’s alchemy. Strong ones too; you suspect that these might carry the brute strain, and may one day stand in the forefront of Lagon’s army. But enough of that. Until you birth your young and can be fertilized again, your duty is to relieve the breeders and be the willing receiver of any cock that wants you.", parse);
        Text.NL();
        parse["comp"] = party.Num() == 2 ? party.Get(1).name :
                        party.Num() >  2 ? "your companions" : "";
        parse["c1"] = party.Num() > 1 ? "," : " and";
        parse["c2"] = party.Num() > 1 ? Text.Parse(", and [comp]", parse) : "";
        Text.Add("Matters of politics, magic and demons are swept from your mind as another one of the bunnies plunges himself into your needy pussy; just one of dozens today. You share a warm look with Ophelia[c1] Vena[c2]. Here in the Pit, you are needed.", parse);
        Text.Flush();
        
        SetGameOverButton();
    }


    export function BadendBrute() {
        let party : Party = GAME().party;

        SetGameState(GameState.Event, Gui);
        
        var scepter = party.Inv().QueryNum(QuestItems.Scepter);

        SetGameState(GameState.Event, Gui);
        var parse : any = {
            
        };
        
        Text.Clear();
        Text.Add("With a great roar, the mad king slams you across the chest, sending you flying though half the hall. The impact dazes you, and you’re only half aware of what’s going on around you. There seem to be a lot of screams… You try to shake the dull pain from your skull and shake your blurry vision.", parse);
        if(party.Num() == 2)
            Text.Add(" Beside you, you dimly see [name] in a similar state.", {name: party.Get(1).name});
        else if(party.Num() > 2)
            Text.Add(" Beside you, you dimly see your companions in similar states.", parse);
        Text.NL();
        Text.Add("The throne room is a scene of chaos; the still bodies of fallen bunnies everywhere. At the heart of the whirlwind of violence is the bestial Lagon, eyes burning with an unnatural flame as he indiscriminately bashes people out of his way left and right, no longer caring about distinguishing between friend and foe.", parse);
        Text.NL();
        Text.Add("Only one person remains standing against the brute - his daughter Ophelia, who stands up on shaking legs. ", parse);
        if(scepter)
            Text.Add("The scepter is gone somewhere, most likely broken and shattered against one of the walls. ", parse);
        Text.Add("<i>“Please, stop this father!”</i> she cries out, begging him.", parse);
        Text.NL();
        Text.Add("Against all odds, her plea seems to be working. Lagon pauses for a moment, a vague look of recognition in his eyes as he looks down on his daughter; a mere ant in front of a hulking giant. He leans down and picks her up in one huge paw, effortlessly lifting the squirming alchemist off the ground.", parse);
        Text.NL();
        Text.Add("<i>“Oph-elia.”</i> The name rings oddly, as if the brute is trying to remember how to form words. A wide, malicious grin spreads on Lagon’s face. For good or ill, the king’s rage has subsided for the moment. <i>“Bring… bitch.”</i> He drops her, and she falls to the ground with a loud thump. Slowly, Ophelia makes her way over to you, her spirit defeated.", parse);
        Text.NL();
        Text.Add("<i>“Please come… we must do as he tells us, or he’ll kill everyone,”</i> she urges you. She’s right. You know from experience just how quickly the beast can move; there’s no use trying to escape.", parse);
        Text.NL();
        Text.Add("Lagon is trying to sit down on his throne as you and Ophelia crawl to his feet, but it ill fits his new frame. He tries to break of the arms of the seat, but it ends up just being uncomfortable. Shrugging, the king kicks the scraps of the chair crashing into a wall. He flops down on the ground, resting on his mound of treasure. When he notices you and Ophelia, he motions you to come to his side.", parse);
        Text.NL();
        Text.Add("It quickly becomes apparent for what reason he’s called you; as you snuggle into the king’s fur, you share a look with Ophelia, only for your view to be blocked as Lagon’s titanic member slowly rises to full erection. Without hesitation, the alchemist leans down and starts caressing the king’s massive balls, which leaves the shaft to you.", parse);
        Text.NL();
        Text.Add("Your hands are trembling as they grasp the massive flesh pillar. Even for his size, Lagon’s cock is of impressive proportions, rising at least four feet from his crotch. The bulbous tip sways far above your head, huge droplets of pre splashing down on you and Ophelia. Fearfully, you trace the veins of the gargantuan shaft, caressing it from top to bottom.", parse);
        Text.NL();
        Text.Add("Lagon grunts appreciatively as you and Ophelia grind your bodies against his member. You can only hope he won’t actually try to use it on you - Vena is probably the only one that could take him as he is now. Either way, your combined efforts seem to bear fruit, as more pre continues to stream down the rigid monolith.", parse);
        Text.NL();
        Text.Add("Both you and Ophelia yelp in surprise as Lagon shifts his weight, getting up on his feet. You scramble to keep your hold on the colossal shaft, ending up hanging underneath it while Ophelia is perched on top of it. There’s little time to try to change your position before the king thrusts forward, trapping you between the floor and fifty inches of thick bunny cock. The alchemist presses her thighs against your side and leans down to kiss you, your bodies forming a tight cavern of flesh that the giant brute can use.", parse);
        Text.NL();
        Text.Add("Lagon’s thrusts grow quicker and quicker as he slides his massive member between your bodies, groaning as he unloads into the cocksleeve formed by his former enemies. The first stream of ejaculate hits you below the chin almost hard enough to knock you out. The following jets sail by just an inch above your face, the tail end of each blast leaving a thick rope of semen plastered across your face. By the time he’s finished both you and Ophelia are drenched in his cum, panting and gasping for breath.", parse);
        Text.NL();
        Text.Add("<i>“T-the Pit,”</i> Ophelia gasps. <i>“We must take him there before he needs to go again.”</i>", parse);
        Text.NL();
        Text.Add("Somehow, the two of you are able to coax the huge beast along with you, though he won’t let you escape from his reach. You move quickly, as both of you are aware of his slowly rising dick, and what he’ll demand of you when he’s ready to go again. As soon as he sees Vena, he discards Ophelia and throws himself at his mate with a lusty roar, dragging you along for the ride.", parse);
        Text.NL();
        Text.Add("Even the lagomorph matriarch gasps when Lagon impales her, her body straining to accommodate his girth. His cock dwarfs even Vena’s, and if she weren’t heavily pregnant, she’d probably have a giant bulge on her stomach. Not forgetting about you, the lagomorph king puts you on top of the matriarch, letting you care for her male parts.", parse);
        Text.NL();
        Text.Add("Time blurs as your life devolves into the fiery passion of body grinding against body. Lagon’s rage seem to have abated now that he’s satisfied, replaced by some of his former intelligence. Enough, at least, to never leave you unattended so that you can escape. You have what feels like countless lovers, often many at the same time, before the king returns to you again, feeding you a number of potions and giving you a shower of jizz.", parse);
        Text.NL();
        Text.Add("After that, things become even more fuzzy as the drugs begin to set in...", parse);
        Text.NL();
        Text.Add("Time passes…", parse);
        Text.Flush();
        
        Gui.NextPrompt(function() {
            TimeStep({season : 1});
            party.location = WORLD().loc.Plains.Burrows.Pit;
            
            Text.Clear();
            Text.Add("At first, your new body could barely even take Vena, but the more drugs the bunnies feed you, the easier it becomes, until one day, your master is finally able to fuck you. You cry in pleasure as Lagon’s enormous shafts drills into your flexible pussy, your belly swollen from the numerous loads he’s graced you with.", parse);
            Text.NL();
            Text.Add("This is your life now. Before, there was something else… some grander purpose. You shake your head in lust-addled confusion. What purpose could be higher than this? To care for the king, to be his personal fuck-toy and breeding bitch? Already, you’ve birthed more strong soldiers for Lagon’s armies than you can count, each one quickly growing into a powerful young buck or doe.", parse);
            Text.NL();
            Text.Add("Here, beside your sisters Ophelia and Vena, you are needed.", parse);
            Text.Flush();
            
            SetGameOverButton();
        });
    }

    export function ReturnToBurrowsAfterFight() {
        let player = GAME().player;
        let party : Party = GAME().party;
        let ophelia = GAME().ophelia;

        var parse : any = {
            playername : player.name
        };
        
        Text.Clear();
        Text.Add("Remembering how your last encounter with the lagomorph king ended, you pause at the cusp of entering the tunnel. You most likely have a fight on your hands if you proceed. Are you ready for this?", parse);
        Text.Flush();
        
        //[Enter][Leave]
        var options = new Array();
        options.push({ nameStr : "Leave",
            func : function() {
                Text.Clear();
                Text.Add("No… not yet.", parse);
                Text.NL();
                Text.Add("While it’s true that Lagon isn’t likely to be a major threat anytime soon, Ophelia is still in there. You wonder how she’s faring; hopefully she’s been able to stay out of trouble so far.", parse);
                if(ophelia.CountdownExpired())
                    Text.Add(" It’s been a rather long time though...", parse);
                Text.Flush();
                
                TimeStep({minute: 5});
                Gui.NextPrompt();
            }, enabled : true,
            tooltip : "You’re not ready quite yet. Lagon isn’t going anywhere."
        });
        options.push({ nameStr : "Enter",
            func : function() {
                Text.Clear();
                var toolate = ophelia.CountdownExpired();
                
                parse["comp"] = party.Num() == 2 ? party.Get(1).name :
                                party.Num() >  2 ? "your companions" : "";
                parse["c"] = party.Num() > 1 ? Text.Parse(" look at [comp] and", parse) : "";
                Text.Add("Resolute, you[c] stride into the Burrows, expecting the worst. Best be on your guard from this moment on.", parse);
                Text.NL();
                Text.Add("You meet relatively few bunnies on your way in, and those you meet scurry out of your way as soon as they see you. The tunnels reek of fear, making your heart sink further. Figuring your first order of business is to locate Ophelia, you make for her lab.", parse);
                Text.NL();
                if(toolate)
                    Text.Add("It looks even worse than you first feared. The place has been sacked, crushed flasks and jars aplenty, and not a living soul around - even her usual test subjects have deserted. It doesn’t look like anyone has been here for quite a while.", parse);
                else
                    Text.Add("You’re out of luck though, as the alchemist is not in here. It looks like someone has been rummaging through her stuff in a haste, and her notes are strewn all over the place. A few of her test subjects raise their heads hopefully, but look disappointed that you are not their mistress.", parse);
                Text.Add(" Troubled, you make your way back into the tunnel, only to find the path outside blocked by a wall of armed and rather serious looking bunnies. Those are probably Lagon’s elite guards… either way, they don’t seem to want to attack you immediately, merely herd you in the direction of the throne room.", parse);
                Text.NL();
                Text.Add("Well, that is what you came here for, isn’t it? Keeping a close eye on your ‘escort’, you trek deeper into the underground kingdom, muscles tense. Before long, you reach Lagon’s high seat, and the lagomorph tyrant himself. There are more guards lining the walls of the throne room than when you last visited it, though the regular civilian slut detail is also present.", parse);
                Text.NL();
                if(toolate) {
                    Text.Add("Lagon is lounging in his chair, looking rather bored. His expression quickly changes as you enter the hall, and he springs up to greet you, a malicious smile playing on his lips.", parse);
                    Text.NL();
                    Text.Add("<i>“Ah, the prodigious traitor finally returns,”</i> the rabbit king smirks, spreading his arms invitingly. <i>“If nothing else, you have balls for coming back here, considering how last we parted.”</i> He turns around. <i>“Daughter, aren’t you happy? Soon, your old conspirator will join you in your duties. Familiar faces sure are comforting, are they not?”</i>", parse);
                    Text.NL();
                    Text.Add("Your heart sinks as you notice Ophelia, chained to the foot of the throne. Of her labcoat, there’s little more than rags left, and her fur is unkempt and soaked with cum. The look of despair on her face deals you another blow to the gut… the alchemist has not had a pleasant time while you were away. You can still see a spark of rebellion flash in her eyes as they meet yours, though it is but a weak flicker.", parse);
                    Text.NL();
                    Text.Add("Lagon is oblivious to what passed between you, but he’s not about to pass up on a moment to gloat over someone else’s misfortune. <i>“I was rather… vexed, when we last parted. My dear daughter has been oh so helpful in relieving my stress… she’s truly a diligent little slut.”</i> He cracks his knuckles.", parse);
                }
                else {
                    Text.Add("Lagon is in the middle of some kind of audience as you walk in. Before him on her knees sits Ophelia, two guards flanking her. The king gives you a wide grin as you approach.", parse);
                    Text.NL();
                    Text.Add("<i>“Ah, and here we have our other rat, just in time! I was just about to punish my wayward daughter for her rebellion, and in walks its ringleader!”</i>", parse);
                    Text.NL();
                    Text.Add("<i>“[playername]!”</i> Ophelia gasps. <i>“Did they get you too?”</i> She looks confused as you shake your head resolutely.", parse);
                    Text.NL();
                    Text.Add("Lagon casually gives his daughter a backhanded slap, violently throwing her to the ground. Unconcerned, he continues to address you as if she never spoke. <i>“Tell me, what is the occasion? Or did you merely want to save me the trouble of hunting you down? Why not make this easy for yourself and give in… once I’m finished with you, the Pit awaits, and all your worries will fade away into endless bliss.”</i>", parse);
                }
                Text.NL();
                Text.Add("In a huge leap, Lagon launches himself into the air, coming down to rest on his throne. <i>“I can tell that you don’t think you’re here to bend the knee… but bend it shall. Bend or break.”</i> At a wave of his hand, the elite guard closes up around you, weapons at the ready.", parse);
                Text.NL();
                Text.Add("<i>“As you will both learn, however, I’m not an impossible master, nor am I unnecessarily cruel. I simply reward obedience… and punish treachery. A king must be resolute in these things, yes?”</i>", parse);
                Text.NL();
                Text.Add("It’s a fight!", parse);
                Text.Flush();
                
                TimeStep({minute: 30});
                
                Gui.NextPrompt(function() {
                    LagonScenes.Usurp(toolate);
                });
            }, enabled : true,
            tooltip : "The time has come to face off against this so called king."
        });
        Gui.SetButtonsFromList(options, false, null);
    }

    export function ReturnToBurrowsAfterScepter() {
        let player = GAME().player;
        let party : Party = GAME().party;
        let burrows = GAME().burrows;
        let kiakai = GAME().kiakai;

        var parse : any = {
            playername : player.name
        };
        
        Text.Clear();
        Text.Add("Once you enter the Burrows, you’re not likely to leave until this whole business has concluded, one way or the other… are you ready for this?", parse);
        Text.Flush();
        
        //[Enter][Leave]
        var options = new Array();
        options.push({ nameStr : "Leave",
            func : function() {
                Text.Clear();
                Text.Add("You can’t be quite sure what’ll face you inside… if Lagon’s caught whiff of who sent you looking for the scepter, and why, there’s bound to be trouble.", parse);
                Text.NL();
                Text.Add("You decide on postponing your visit for now.", parse);
                Text.Flush();
                
                TimeStep({minute: 5});
                Gui.NextPrompt();
            }, enabled : true,
            tooltip : "You need some more time to prepare… Lagon isn’t going anywhere."
        });
        options.push({ nameStr : "Enter",
            func : function() {
                Text.Clear();
                burrows.flags["Access"] = BurrowsFlags.AccessFlags.QuestlineComplete;
                party.location = WORLD().loc.Burrows.Throne;
                Text.Add("Steeling yourself, you head into the dark and dank underground. It’s unusually quiet in the tunnels, and the few bunnies you meet scurry out of sight before you can get close. At one point, you see group of heavily armed bunnies running down a side tunnel. These aren’t the usual horny and uncoordinated rabbits that fill this place; these look like Lagon’s personal guard, and they’re searching for something.", parse);
                Text.NL();
                Text.Add("<i>“Quickly, over here!”</i> you hear someone whisper from a smaller opening in the side of the tunnel. Ophelia peeks her head out, looking anxious as she waves you in. <i>“Do you have it?”</i> she keeps her voice low, but it’s strained with urgency. Relief floods her face when you nod. <i>“Father’s men… they are looking for me. We need to get to my mother as fast as we can, before they catch us!”</i>", parse);
                Text.NL();
                Text.Add("Not waiting for your reply, she drags you along, dashing from cover to cover. <i>“Shit!”</i> she mutters. Peeking around her, you see that the way ahead is blocked and guarded by a dozen soldier bunnies. <i>“We can’t go through here, but I know another way.”</i> This venture, too, proves short lived, as the way back is blocked by another patrol hurrying your way.", parse);
                Text.NL();
                Text.Add("<i>“They are herding us!”</i> Ophelia growls anxiously, pulling you down another side passage. She’s right; you’re no expert at navigating these mad tunnels, but you seem to be steadily pushed away from the Pit and toward the throne room. Then again, perhaps this is for the best.", parse);
                Text.NL();
                Text.Add("<i>“Y-you can’t face him alone, you can’t!”</i> Ophelia begs you, pulling on your arm.", parse);
                Text.NL();
                if(party.Num() > 1) {
                    parse["c"] = party.Num() > 2 ? "your companions are" : party.Get(1).name + " is";
                    Text.Add("You tell her that you’re not alone; [c] by your side.", parse);
                }
                else
                    Text.Add("You’ll be fine, you assure her. After beating up the Gol, Lagon shouldn’t be any problems.", parse);
                Text.Add(" The alchemist doesn’t look convinced, but you have little choice but to continue heading toward the throne room.", parse);
                Text.NL();
                Text.Add("<i>“Ah, here we have the both of you,”</i> Lagon greets you as you enter the hall, lounging idly on his throne. <i>“The diligent traveler… and the rebellious daughter. Just what have you two been up to?”</i> He looks like he’s enjoying watching Ophelia squirm. Finally, the smaller bunny gathers her courage.", parse);
                Text.NL();
                Text.Add("<i>“This can’t go on father, what you are doing to mother! [playername] has been helping me… With the scepter, we can restore her, bring her back to like she was in the old days!”</i> Lagon’s eyes darken, and the alchemist falters.", parse);
                Text.NL();
                Text.Add("<i>“Have you perhaps forgot <b>why</b> Vena is the way she is?”</i> the king counters. <i>“She too wished to rebel against me… wasn’t it a nice twist of fate that it was you who provided the means for her to continue serving me as a loyal breeding slut… Ophelia, your mother is happy where she is. Would you take that away by introducing meaningless strife in my kingdom once more?”</i>", parse);
                Text.NL();
                Text.Add("<i>“Y-you… evil!”</i> Ophelia gasps, tears in her eyes. Gulping, she steels herself. <i>“I was right after all… I had hoped that you might… but no. There is only one way to end this. You have to be put down.”</i>", parse);
                Text.NL();
                Text.Add("For a moment, it’s as if Lagon hasn’t even heard her. So inconceivable are the words that come out of her mouth. <i>“And you, traveler?”</i> he turns your way. <i>“Where do you stand in all this? Are you too caught up in this foolishness, or are you willing to listen to reason?”</i>", parse);
                Text.NL();
                Text.Add("What reason?", parse);
                Text.NL();
                Text.Add("<i>“You have been a good servant… aye, my plans have progressed much quicker than anticipated thanks to your actions.”</i> The lagomorph king leans back into his seat, yawning. <i>“You have no clue on who you are dealing with if you step in here and think you have even the faintest glimmer of a chance defeating me. Why not continue working with me instead?”</i>", parse);
                Text.NL();
                Text.Add("<i>“Don’t listen to him!”</i> Ophelia pleads, eyes shifting anxiously between the two of you.", parse);
                Text.NL();
                Text.Add("<i>“Great riches await you if you choose this path…”</i> a grin plays across Lagon lips. <i>“I’ll even let you keep my daughter here as a pet. Just hand me the scepter and lay down your arms, and I’ll forgive you just this once.”</i>", parse);
                Text.Flush();
                
                //[Oppose][Stand down]
                var options = new Array();
                options.push({ nameStr : "Oppose",
                    func : function() {
                        Text.Clear();
                        Text.Add("No, it’s not going to be that easy. You stand by Ophelia, and the king can take his offers and stuff them. You’ve had enough of his bullshit.", parse);
                        Text.NL();
                        Text.Add("<i>“I was willing to let bygones be bygones,”</i> Lagon sighs, shaking his head. <i>“Some harsh words were raised, perhaps you could have gotten out of it by begging my forgiveness. Or offering yourself as my grateful cocksleeve. Alas, such rebellious war-mongers have to be put to task for their transgressions.”</i>", parse);
                        Text.NL();
                        Text.Add("Fuck you!", parse);
                        Text.NL();
                        parse["comp"] = party.Num() == 2 ? party.Get(1).name :
                                        party.Num() >  2 ? "your companions" : "";
                        parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
                        Text.Add("<i>“Guards, put this pitiful display of misplaced chivalry to rest.”</i> The king leans back in his throne. <i>“The one that takes the traveler down will get sloppy seconds.”</i> The guards close in on you[c], weapons raised.", parse);
                        Text.NL();
                        Text.Add("It’s a fight!", parse);
                        Text.Flush();
                        
                        Gui.NextPrompt(LagonScenes.Usurp);
                    }, enabled : true,
                    tooltip : "Fuck that. Lagon is a treacherous snake, you very much doubt that he’d keep such promises… not to mention his sinister agenda."
                });
                options.push({ nameStr : "Stand down",
                    func : function() {
                        Text.Clear();
                        Text.Add("Ophelia can hardly believe her eyes as you walk over to Lagon and hand over the scepter.", parse);
                        if(party.InParty(kiakai)) {
                            Text.Add(" Neither can your elven companion, who looks at you with stunned disbelief.", parse);
                            kiakai.relation.DecreaseStat(-100, 10);
                        }
                        Text.NL();
                        Text.Add("<i>“There, that wasn’t so hard, was it?”</i> the king drawls, accepting the gift. <i>“As for you,”</i> he addresses his daughter, <i>“your disobedience must be punished. I promised to turn you over to [playername]... but first, reparations must be made. Down on your knees, daughter. I have a farewell gift for you.”</i> He slowly gets up from his seat, his heavy cock dangling down between his knees.", parse);
                        Text.NL();
                        Text.Add("<i>“N-no! You can’t make me!”</i> Ophelia shrieks as she scrambles backward, only to be grabbed by the guards. <i>“Traitor!”</i> she screams. <i>“I trusted you, and you do this?!”</i>", parse);
                        Text.NL();
                        Text.Add("<i>“Bring her here.”</i> Lagon motions for the guards to drag his struggling daughter to him, a victorious grin on his face… but things aren’t meant to be that easy.", parse);
                        Text.NL();
                        Text.Add("In a fierce burst of strength, Ophelia pulls one of her arms free for just a second, enough for her to reach into her bodice and fish out a potions. In a last desperate effort, she downs the flask, body convulsing as the transformative takes effect.", parse);
                        Text.NL();
                        Text.Add("<i>“Restrain her!”</i> Lagon snaps, but it’s already too late. The alchemist’s body is rapidly growing, muscles bulging and bones cracking until she’s more than twice her regular size. Her labcoat stretches way past its limits, ripping into tiny shreds. With a great roar, the amazonian lagomorph throws off the guards as easily as if they were dolls. She looks this way and that, her crazed eyes finally falling on you.", parse);
                        Text.NL();
                        Text.Add("<i>“I’d say that your first order of business as my agent should be to take care of this mess,”</i> Lagon suggests, languidly returning to his throne. <i>“Now, entertain me!”</i>", parse);
                        Text.NL();
                        Text.Add("You ready yourself for combat as the furious she-brute bounds toward you.", parse);
                        Text.NL();
                        Text.Add("It’s a fight!", parse);
                        Text.Flush();
                        
                        party.Inv().RemoveItem(QuestItems.Scepter);
                        
                        Gui.NextPrompt(LagonScenes.OpheliaFight);
                    }, enabled : true,
                    tooltip : "This damn fetch-quest has gone on for too long… time you get a real reward. And if you can get it without even having to fight anyone… why not? Besides, taking Ophelia away from this place is probably the best she could ever hope for."
                });
                Gui.SetButtonsFromList(options, false, null);
            }, enabled : true,
            tooltip : "You’re ready."
        });
        Gui.SetButtonsFromList(options, false, null);
    }

    export function Usurp(toolate : boolean) {
        var parse : any = {
            
        };
        
        var enemy = new Party();
        var lagonMob = new LagonRegular(true);
        enemy.AddMember(lagonMob);
        enemy.AddMember(new LagomorphBrute());
        enemy.AddMember(new LagomorphWizard());
        enemy.AddMember(new LagomorphElite(Gender.Random()));
        var enc : any = new Encounter(enemy);
        enc.toolate = toolate;
        
        enc.canRun = false;
        enc.VictoryCondition = function() {
            return lagonMob.Incapacitated();
        }
        
        enc.onLoss    = LagonScenes.LossToRegularLagon;
        enc.onVictory = LagonScenes.WinToRegularLagon;
        
        enc.Start();
    }

    export function LossToRegularLagon() {
        let player = GAME().player;
        let party : Party = GAME().party;
        let lagon = GAME().lagon;
        
        SetGameState(GameState.Event, Gui);
        
        var enc = this;
        var toolate = enc.toolate;
        var scepter = party.Inv().QueryNum(QuestItems.Scepter);
        
        var parse : any = {
            tongue : function() { return player.TongueDesc(); },
            breasts : function() { return player.FirstBreastRow().Short(); }
        };
        
        Text.Clear();
        Text.Add("<i>“Pathetic and predictable,”</i> Lagon yawns as you drop to the ground, shaking with exhaustion. He’s just too strong… perhaps you should never have stood up to him.", parse);
        Text.NL();
        if(toolate) {
            parse["HeShe"]  = player.mfFem("He", "She");
            parse["hisher"] = player.mfFem("his", "her");
            Text.Add("<i>“Bring the traveler over here, and remove [hisher] clothes,”</i> Lagon gestures to his guards. <i>“[HeShe] won’t be needing them any longer.”</i>", parse);
        }
        else {
            Text.Add("<i>“Bring my daughter over here too… and remove her clothes,”</i> Lagon gestures to his guards. <i>“She won’t be needing them any longer. Nor will you, traveler.”</i>", parse);
        }
        if(scepter)
            Text.Add(" With a sneer, the rabbit king adds: <i>“Oh, and bring me that scepter.”</i>", parse);
        Text.Add(" The honor guard makes short work of your equipment before they drag you before the throne.", parse);
        Text.NL();
        Text.Add("<i>“Do you see now, daughter? Your actions have brought even more pain and distress to those you hold dear. Don’t you feel the weight of your choices?”</i> Ophelia lowers her head, tears streaming down her face as she nods. <i>“And if I told you there was a way to relieve yourself of this burden, would take it?”</i> Lagon’s eyes burn with malicious fire as he regards the fallen alchemist.", parse);
        Text.NL();
        Text.Add("<i>“A-anything!”</i> she sobs, looking up hopefully. <i>“Anything to relieve this pain!”</i>", parse);
        Text.NL();
        Text.Add("<i>“Give in, daughter. Drop your foolish rebellion, your precious experiments. Relinquish your free will.”</i> The lagomorph king caresses Ophelia’s hair affectionately. <i>“After all, if you have no free will nor choices, no one can blame you for the outcome of your actions. And with this,”</i> Lagon flourishes a bottle from the pile beside the throne, <i>“you will not even remember your painful past.”</i>", parse);
        Text.NL();
        Text.Add("Ophelia’s chest falls as she sees the flask. <i>“Yes,”</i> the king continues. <i>“This is the very draught you brewed for you mother, so long ago. Drink and let all your cares drift away.”</i>", parse);
        Text.NL();
        Text.Add("The alchemist gives you one last look before accepting the potion, and it tells you everything. Deep sorrow, anguished defeat, a broken pride and a small twinge of disappointment, any hope you instilled her with utterly crushed. She averts her eyes and dutifully gulps up the concoction, stepping down from her old role and embracing her new. While there aren’t any physical changes that you can see - perhaps a widening of the hips, a swelling of the breasts - when her expression changes to one of blissful lust, the effects of the potion are clear.", parse);
        Text.NL();
        parse["comp"] = party.Num() == 2 ? party.Get(1).name :
                        party.Num() >  2 ? "your companions" : "";
        parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
        Text.Add("<i>“And now, I must deal with you,”</i> Lagon says as he turns his attention to you[c], ignoring his daughter who’s happily snuggling his leg. <i>“The prodigal traveler turned traitor. I’ll offer you the same out as I gave Ophelia… but first, you need to taste true defeat.”</i> Almost purring, he motions you closer: <i>“Approach, my slut.”</i>", parse);
        Text.NL();
        Text.Add("Your mind rebels, but your body moves against your wishes, not wishing to incur his wrath. Joining Ophelia at the foot of the throne, you copy her actions, caressing the king’s feet, his legs, his thighs, licking his fur subserviently. ", parse);
        if(player.SubDom() >= 30)
            Text.Add("Only, unlike her, you can still feel the shame burning deep in your chest.", parse);
        else if(player.SubDom() >= -30)
            Text.Add("It is demeaning, but you fear this is only the start of it.", parse);
        else
            Text.Add("It comes naturally to you, but it’s still piteous for your rebellion against your master to end this way.", parse);
        Text.NL();
        Text.Add("<i>“You’ll have to do better than that,”</i> Lagon urges, though a shiver runs through his hardening cock… that big, juicy cock… Ophelia is the first one to lean forward and suckle the giant shaft, letting her tongue play along its length, but you know you can’t be idle for long. Besides, the rabbit king has a <i>lot</i> of cock, plenty for the both of you. You add your [tongue] to the mix, obediently worshipping the stiffening member.", parse);
        if(party.Num() > 1) {
            parse["isAre"] = party.Num() > 1 ? "are" : "is";
            Text.Add(" Behind you, the moans indicate that [comp] [isAre] similarly occupied with Lagon’s guards. But you can’t let that distract you.", parse);
        }
        Text.NL();
        Text.Add("<i>“Go on, daughter,”</i> Lagon encourages Ophelia. Without hesitation, the former alchemist wraps her lips around the king’s colossal rod, managing to swallow at least half of it before her protesting jaws meet resistance. The bunny’s paws are busy between her legs, and her eyes  are almost closed, her expression euphoric. She diligently soldiers on in polishing her father’s dick, but is finally forced to withdraw.", parse);
        Text.NL();
        if(player.SubDom() > 0) {
            Text.Add("<i>“Well?”</i> The king looks down on you. <i>“This isn’t the time to be prudish, little slut. Follow my daughter’s example, and you too may receive the same pleasure as she...”</i>", parse);
            Text.NL();
            Text.Add("Something fundamental clicks in your head… a shift in attitude as you surrender completely to the powerful lagomorph. There’s no use resisting anymore… that will only bring more punishment. You obediently take Ophelia’s place, sucking on the magnificent cock. Lagon is no idle participant either; he takes perverse pleasure in jolting his hips forward just when you’re not expecting it, teasing your limits.", parse);
            Text.NL();
            Text.Add("<i>“Good little slut,”</i> he praises you.", parse);
        }
        else {
            Text.Add("Knowing what’s expected of you, you take her place, almost gagging when the rabbit king idly shifts in his seat, shoving another five inches down your ambushed gullet. <i>“Not bad,”</i> Lagon comments, holding your head in place as he feeds you another three inches. <i>“Perhaps you don’t need the potion after all; you’re such a willing slut even without it.”</i>", parse);
        }
        Text.NL();
        
        Sex.Blowjob(player, lagon);
        player.FuckOral(player.Mouth(), lagon.FirstCock(), 2);
        lagon.Fuck(lagon.FirstCock(), 2);
        
        Text.Add("You do your best to service your king, but he soon grows bored of your efforts. Without warning, Lagon jumps to his feet, taking a firm grasp of your head. You’re powerless to do anything but take it as he starts to thrust, gaining in speed until the movements of his hips are a blur.", parse);
        Text.NL();
        Text.Add("<i>“Your first reward,”</i> the powerful alpha grunts, the meaning of his words quickly becoming clear as thick jets of bunny cum surge down your throat. You even get a taste of the lovely liquid as he pulls out, the final bursts landing on your tongue and splattering all over your face and [breasts]. Not wishing to be let out, Ophelia meticulously cleans Lagon’s cock, and when there’s no more seed to find there, she proceeds to lap up whatever was left on you. Leaning back into her kisses, you caress her breasts, coaxing throaty moans from the king’s daughter.", parse);
        Text.NL();
        Text.Add("<i>“A good start on your journey of redemption,”</i> your master praises you, an unexpected smile spreading on your lips as he pats your head. ", parse);
        if(scepter)
            Text.Add("If your mind hadn’t been filled by such serene warmth, you might have paid closer attention to the scepter that Lagon idly holds… it doesn’t seem important now, however. ", parse);
        Text.Add("<i>“But I’m sure you can do better...”</i> Urged by his encouraging voice, you hurriedly promise that you will do your utmost to serve him.", parse);
        Text.NL();
        Text.Add("Smiling, Lagon invites you to take a seat on his glistening cock…", parse);
        Text.NL();
        parse["c"] = party.Num() > 1 ? Text.Parse(", [comp]", parse) : "";
        Text.Add("Sensory impressions blur and fade together as the lagomorph king uses you[c] and his daughter. Countless times, he and his guards spend their seed in you, and each time you do, you lose a little more of yourself. When he finally offers you the potion he gave Ophelia, you take it willingly, and after that, you experience only bliss.", parse);
        Text.NL();
        Text.Add("Time passes...", parse);
        Text.Flush();
        
        Gui.NextPrompt(LagonScenes.BadendPit);
    }

    export function WinToRegularLagon() {
        let party : Party = GAME().party;
        
        SetGameState(GameState.Event, Gui);
        
        var enc = this;
        var toolate = enc.toolate;
        var scepter = party.Inv().QueryNum(QuestItems.Scepter);
        
        var parse : any = {
            
        };
        
        Gui.Callstack.push(function() {
            Text.Clear();
            Text.Add("There’s an incredulous look on Lagon’s face as he stumbles back on his throne. <i>“Worm!”</i> he screams, trying to regain his footing. <i>“Don’t think that this is the end; I was willing to let you off easy, but for this, I’ll <b>fucking murder you!</b>”</i> The lagomorph king scrambles for something in the pile of treasure surrounding his throne, coming back up with a triumphant look on his face.", parse);
            Text.NL();
            Text.Add("<i>“Hah… this was the most useful of your discoveries, my dear daughter,”</i> he gasps, wielding a potion in one of his paws. <i>“The rest of your garbage you can keep, but with this, I achieve ultimate power!”</i> With that, Lagon downs the flask in one fell swoop, his body convulsing as the transformation begins.", parse);
            Text.NL();
            Text.Add("Even the royal guards take a fearful step backwards as their king transforms into a hulking giant; a muscular monster that make the brutes of his army look like school children. A raging fire burns in the mutant’s eyes; seeking nothing but the destruction of all his enemies. Between his legs flops a dick the size of a tree trunk, supported by balls the size of coconuts.", parse);
            Text.NL();
            if(scepter) {
                Text.Add("<i>“Hand me the scepter, quickly!”</i> Ophelia yells. <i>“I’ll try to figure out how it works, perhaps it can help to subdue him!”</i> You toss her the rod, your eyes never leaving the beast.", parse);
                Text.NL();
            }
            Text.Add("With a wordless cry, the monster springs toward you, sweeping his own guards out of the way as if they were mere motes of dust. You barely have time to brace yourself before the enraged king throws himself at you.", parse);
            Text.NL();
            Text.Add("It’s a fight!", parse);
            Text.Flush();
            
            Gui.NextPrompt(function() {
                var enemy = new Party();
                enemy.AddMember(new LagonBrute(scepter != 0));
                var enc = new Encounter(enemy);
                
                enc.canRun = false;
                
                enc.onLoss    = LagonScenes.BadendBrute;
                enc.onVictory = LagonScenes.WinToBruteLagon;
                
                enc.Start();
            });
        });
        Encounter.prototype.onVictory.call(enc);
    }

    export function WinToBruteLagon() {
        let player = GAME().player;
        let party : Party = GAME().party;
        let ophelia = GAME().ophelia;
        let lagon = GAME().lagon;
        
        SetGameState(GameState.Event, Gui);
        
        var enc = this;
        var toolate = enc.toolate;
        var scepter = party.Inv().QueryNum(QuestItems.Scepter);
        
        var parse : any = {
            playername : player.name
        };
        
        lagon.flags["Usurp"] |= LagonFlags.Usurp.Defeated;
        
        Gui.Callstack.push(function() {
            Text.Clear();
            Text.Add("Stunned by your strength, the brute topples backward, falling like a giant tree. There is a moment of absolute silence after the lagomorph king hits the ground; everyone is frozen in time, not daring to move a muscle. Ophelia is the first one to spring to action, leaping past her father and quickly gathering a number of potions from Lagon’s stash.", parse);
            if(scepter) {
                Text.Add(" She tosses you the scepter.", parse);
                Text.NL();
                Text.Add("<i>“It won’t work against just anyone, but father’s been touched by its power before,”</i> she explains. <i>“Hold it just like that and press it to his temple, it should subdue him long enough for me to neutralize him.”</i>", parse);
                Text.NL();
                Text.Add("It’s a curious feeling… almost as if you’re sharing a mind with the lagomorph king. It’s a tangle of dark rage, looking somewhat like a nest of angry snakes writhing together, though it is surprisingly small. Resolutely, you press it down with a mental palm, keeping it in place. Lagon stops struggling.", parse);
            }
            else {
                Text.NL();
                Text.Add("<i>“Hold him down for a while. I’m going to subdue him,”</i> the alchemist promises.", parse);
            }
            Text.NL();
            Text.Add("Hurrying to your side, Ophelia quickly feeds her father one of the potions before any of the guards can gather themselves to stop her. They still seem shocked by their king’s transformation and sudden drop into madness. After some consideration, the alchemist feeds him two more, just for good measure.", parse);
            Text.NL();
            Text.Add("This time, the transformation isn’t as rapid as before. Bit by bit, Lagon shrinks down to his old size, his muscles withering until he’s even smaller than he was to begin with. <i>“I had to be sure he couldn’t get away,”</i> Ophelia explains. She leans back and gives out a ragged sigh. <i>“It’s finally over, isn’t it?”</i>", parse);
            Text.NL();
            Text.Add("You nod, giving her a pat on the shoulder.", parse);
            Text.NL();
            Text.Add("<i>“T-thank you, [playername],”</i> she blushes, leaning against you. <i>“What you did… I didn’t think it possible.”</i> As you are talking, one of the royal guards carefully makes his way over to you, stopping when you notice him. The bunny has discarded his weapon, and holds a non-threatening stance.", parse);
            Text.NL();
            Text.Add("<i>“Queen,”</i> he simply says, going down to one knee in front of Ophelia. <i>“Queen. Queen. Queen,”</i> the others echo, until the hall is ringing with their call. They quieten down when the alchemist unsteadily gets to her feet, a resolute look on her face.", parse);
            Text.NL();
            Text.Add("<i>“I’m not strong like my father, and my crimes number as many as his,”</i> she starts, her voice growing more confident as she goes on. <i>“I cannot lead you, but I can guide you until there is someone who can.”</i> She turns to you.", parse);
            Text.NL();
            
            ophelia.relation.IncreaseStat(100, 25);
            
            parse["pheshe"] = player.mfFem("he", "she");
            if(scepter) {
                Text.Add("<i>“This is all thanks to [playername]... not only that, [pheshe] carries the instrument of our salvation!”</i> The alchemist’s gaze borders on worshipful, and she invites you to join her and stand by her side.", parse);
                Text.NL();
                Text.Add("<i>“With this scepter, we can restore my mother, the matriarch Vena, to her old self!”</i> she cries out, getting a resounding cheer from the audience.", parse);
                Text.NL();
                Text.Add("<i>“Will you come with us now?”</i> she asks as she turns to you. <i>“The procedure should be quick, but the Burrows need her now.”</i>", parse);
                Text.NL();
                Text.Add("You nod, and the two of you set out for the Pit, followed by the cheering honor guard. Lagon, still unconscious and affected by your mental touch, is chained to a wall and left under a strict watch.", parse);
                Text.NL();
                
                VenaScenes.RestoreEntrypoint(true);
            }
            else {
                Text.Add("<i>“None of this would have been possible if not for [playername], [pheshe] deserves more praise than I.”</i> Ophelia hugs you tightly, her voice filled with adoration. When the cheers have quieted down, she turns to you.", parse);
                Text.NL();
                Text.Add("<i>“Do you think we could ask one final favor of you?”</i> she asks, her eyes lowered. <i>“The scepter that I spoke of before; the one my brother took when he left. With it, I’m certain that I could restore my mother’s mind, and everything could finally be right again. I know it’s much to ask, but… please.”</i>", parse);
                Text.NL();
                Text.Add("You tell her that if you find the scepter, you’ll bring it back here. Still, there are no guarantees. <i>“Thank you,”</i> she whispers.", parse);
                Text.Flush();
                
                Gui.NextPrompt(function() {
                    Text.Clear();
                    Text.Add("Lagon, now reduced to a shadow of his former self, is hauled off and chained in a cell somewhere close to the throne room. He’ll await justice there until Vena stands judgement over him. Ophelia hints that you also have a say in this, since if it weren’t for you, he’d still be on the throne. Time enough to worry about that later.", parse);
                    Text.NL();
                    Text.Add("<i>“I really cannot thank you enough,”</i> Ophelia bows her head again. <i>“Without you… if there’s <b>anything</b> you need at all, we are at your service.”</i> Her eyes burn with a very different kind of fire as she meets yours. <i>“<b>I</b> am at your service.”</i>", parse);
                    Text.NL();
                    Text.Add("On her urging, you take some of the treasure that Lagon has hoarded for himself; the lagomorphs have no need for coin, she assures you.", parse);
                    Text.NL();
                    Text.Add("<i>“If you find the scepter, we would be forever grateful,”</i> she concludes, giving you a kiss on the cheek before hurrying off to see her mother. You should return to her once things have quietened down a bit.", parse);
                    Text.Flush();
                    TimeStep({hour: 1});
                    Gui.NextPrompt();
                });
            }
        });
        
        Encounter.prototype.onVictory.call(enc);
    }

    export function OpheliaFight() {
        var enemy = new Party();
        enemy.AddMember(new OpheliaBrute());
        var enc = new Encounter(enemy);
        
        enc.canRun = false;
        
        enc.onLoss    = LagonScenes.LossToOphelia;
        enc.onVictory = LagonScenes.WinToOphelia;
        
        enc.Start();
    }

    export function LossToOphelia() {
        let player = GAME().player;
        
        SetGameState(GameState.Event, Gui);
        var enc = this;
        
        var parse : any = {
            cocks : function() { return player.MultiCockDesc(); }
        };
        
        player.AddLustFraction(1);
        
        Text.Clear();
        Text.Add("<i>“Why, this is even more entertaining than I first imagined, traveler!”</i> Lagon laughs as you drop to the ground, no longer able to fight. Perceiving this new enemy, Ophelia throws herself at her father with a mighty roar.", parse);
        Text.NL();
        Text.Add("<i>“Tell me,”</i> the king continues unhurriedly as he dodges a blow from the enraged alchemist, <i>“what use are you to me if you can’t even handle my daughter?”</i> He dodges another blow, then throws a blindingly fast high kick, hitting Ophelia squarely in the jaw. As the confused brute stands there blinking, trying to figure out what just happened, Lagon lands another flurry of blows, throwing her on her back.", parse);
        Text.NL();
        Text.Add("<i>“My agent? No, I have a far more appropriate task for you, weak little traveler.”</i> The lagomorph king languidly makes his way over to the two of you as you lie gasping on the ground. He flops down on her chest, legs straddling her sides. <i>“Say aaah!”</i> he encourages her, forcing her jaw open while he pours the contents on a large flask down her throat. Bit by bit the effects of the brutish transformation are reversed, until Ophelia looks much like her old self - except now she’s nude, her old robes mere tatters.", parse);
        Text.NL();
        Text.Add("<i>“Now, this one is for you.”</i> Lagon grins maliciously as he hops over onto your chest, driving the air out of your lungs. As you gasp for air, he forces a thick and sickly sweet liquid into your mouth, and you have no choice but to swallow. <i>“Good girl,”</i> he cheers you on. ", parse);
        if(!player.FirstVag())
            Text.Add("You try to shake your head; you’re not a girl! ", parse);
        var gen = "";
        if(player.FirstCock())
            gen += ", your gushing pussy overflowing with juices";
        if(player.FirstCock() && player.FirstVag())
            gen += " and ";
        else
            gen += ", ";
        if(player.FirstVag())
            gen += "your [cocks] spewing thick cum everywhere";
        parse["gen"] = gen;
        Text.Add("Warmth spreads through your torso, through your guts, and finally into your loins. You cry out as a spike of pleasure shoots down your spine[gen].", parse);
        Text.NL();
        Text.Add("You should be resisting - gathering your strength and striking back - but the blissful ecstasy is too much! Unable to do anything but ride it out, you lie there and whimper… only to find that the pleasure does not die down.", parse);
        Text.NL();
        parse["pussy"] = player.FirstVag() ? "your pussy" : "a pussy that wasn’t there just minutes ago";
        Text.Add("<i>“A good reaction, little slut.”</i> Lagon - that was his name, right? - Lagon’s voice sounds like it’s coming from far away, but a new sensation in your loins tells you he is indeed very close. <i>“Vena was the same when I first fed her this mixture,”</i> the bunny king continues conversationally as he drives his cock deep inside [pussy]. All your worries wither and disappear as your world narrows down to the thick shaft plunging into your nethers, indescribable pleasure rushing through your veins.", parse);
        Text.NL();
        if(!player.FirstVag()) {
            Text.Add("<b>You’ve lost your virginity.</b>", parse);
            Text.NL();
        }
        Text.Add("You are dimly aware of that the king is pouring his seed into your womb… thrice? Five times? It all blends together... As for yourself, you no longer have any idea of when your orgasms begin or end. When Lagon finally withdraws, you let out a deep longing cry, bereft of your release.", parse);
        Text.NL();
        Text.Add("<i>“Worry not, my little slut,”</i> you hear a voice whisper from afar. <i>“Soon, I’ll take you to your new home, where you can do nothing but fuck for the rest of your life.”</i> That sounds wonderful… <i>“But first, I need to show my daughter the same kindness.”</i>", parse);
        Text.NL();
        Text.Add("Jealous, you watch as Lagon pounds into Ophelia. Crawling over, you massage your friend’s breasts, suckle on her nipples, kiss her passionately. How you hope that she too can be together with you forever...", parse);
        Text.Flush();
        
        Gui.NextPrompt(LagonScenes.BadendPit);
    }

    export function WinToOphelia() {
        let player = GAME().player;
        let ophelia = GAME().ophelia;
        let lagon = GAME().lagon;
        
        SetGameState(GameState.Event, Gui);
        var enc = this;
        
        var parse : any = {
            playername : player.name,
            stuttername : player.name[0] +"-"+ player.name,
            pheshe : player.mfFem("he", "she")
        };
        
        lagon.flags["Usurp"] |= LagonFlags.Usurp.SidedWith;
        ophelia.flags["Met"] |= OpheliaFlags.Met.Recruited;
        ophelia.flags["Met"] |= OpheliaFlags.Met.Broken;
        ophelia.flags["Met"] |= OpheliaFlags.Met.InParty;
        
        Gui.Callstack.push(function() {
            Text.Clear();
            Text.Add("Lagon claps as you finally subdue the she-brute. Ophelia, no longer strong enough to keep standing, falls to the ground panting. <i>“I thought she had you there for a bit,”</i> he says unconcerned, as if he didn’t care who won the fight. <i>“I suppose you may be of some use after all.”</i>", parse);
            Text.NL();
            Text.Add("The lagomorph king tosses you two potions. <i>“As promised… I’ll let you do the honors. These will make her a bit more manageable.”</i> Well, there’s no turning back now. You feed the defeated alchemist both of the draughts and wait for the effects to set in.", parse);
            Text.NL();
            Text.Add("Gradually, Ophelia shrinks down to her former size as the new potions counter the effects of the first one. That doesn’t seem to be the only thing it does, though. The alchemist lets out a throaty moan, one of her hands going between her legs, her back arching sensually. Slowly, she opens her eyes.", parse);
            Text.NL();
            Text.Add("<i>“[stuttername]?”</i> she pants. <i>“W-what happened? Why do I feel so… aah!”</i> She gasps as she hits a particularly sweet spot. Her father traces a finger down her stomach, dipping it into her dripping snatch. Ophelia cries out in pleasure as she rides out her orgasm.", parse);
            Text.NL();
            Text.Add("<i>“[playername] is your master now, slut, and you must do anything that [pheshe] says. A much more fitting role for you than your silly experiments, no?”</i> Lagon throws you a heavy bag, clinking heavily with coins. <i>“Your reward, traveler.”</i>", parse);
            Text.NL();
            Text.Add("And what now, you ask?", parse);
            Text.NL();
            Text.Add("<i>“Start by getting this slut out of my sight,”</i> Lagon prods the still recovering bunny with his foot. <i>“I have much to do here, but I’ll call for you if I need something. Actually...”</i> He studies the scepter thoughtfully. <i>“You said you got this from Roa, didn’t you?”</i>", parse);
            Text.NL();
            Text.Add("You nod.", parse);
            Text.NL();
            Text.Add("<i>“I vaguely remember him… the little sissy, wasn’t it? Since you know where he is, go fetch him for me.”</i> Lagon chuckles as he toys with the artifact. <i>“We can’t have such disobedience go unpunished, can we?”</i>", parse);
            Text.NL();
            Text.Add("With that, you’re dismissed. Ophelia is on your heels, looking around in distracted wonder and touching herself absentmindedly. <i>“Where we go now? Can we go to the Pit? Please?”</i>", parse);
            Text.NL();
            Text.Add("You are starting to understand what Lagon meant when he said that the potions would make her easier to handle...", parse);
            Text.Flush();
            
            Gui.NextPrompt();
        });
        
        Encounter.prototype.onVictory.call(enc);
    }

}
