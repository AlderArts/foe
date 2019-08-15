import * as _ from "lodash";

import { EncounterTable } from "../encountertable";
import { GAME } from "../GAME";
import { Gui } from "../gui";
import { AccItems } from "../items/accessories";
import { CombatItems } from "../items/combatitems";
import { DryadGladeFlags } from "../loc/glade-flags";
import { MagicShopScenes } from "../loc/rigard/magicshop";
import { Party } from "../party";
import { Text } from "../text";
import { AscheFlags } from "./asche-flags";
import { AscheTasksScenes } from "./asche-tasks";
import { GlobalScenes } from "./global";

export namespace AscheScenes {
    export function FortuneCost() {
        return 10;
    }

    export function FirstEntry() {
        const player = GAME().player;
        const asche = GAME().asche;

        const parse: any = {
            heshe : player.mfFem("he", "she"),
            handsomepretty : player.mfFem("handsome", "pretty"),
        };

        asche.flags.Met = AscheFlags.Met.Met;

        Text.Clear();
        Text.Add("A gentle jingle of chimes greets you as you push open the hardwood door, followed by a strong, heady aroma of incense that’s practically overpowering. Still, you forge ahead into the small store, and are greeted by the proprietor behind the counter, a jackal-morph of slender build. Her large ears perk up as she sees you, and she adjusts her clothing - an exotic-looking garment consisting of a white drape, mostly wrapped about her waist and with one end hung loosely over a shoulder, baring her furry midriff. Her dark eyes look as if she’s gone way overboard with the eyeliner and shadow, and she’s adorned from head to toe in jewelery - some of it tasteful, but most of it absolutely tacky, with bangles, earrings, and all.", parse);
        Text.NL();
        Text.Add("<i>“Asche welcomes you to her store, new customer,”</i> she says, flashing you a toothy canine grin. <i>“You have a strange aura about you that Asche cannot quite place. Perhaps you have come seeking a solution to one of your problems? Asche’s shop is here to solve problems for customers, yes.”</i>", parse);
        Text.NL();
        Text.Add("Asche? Who… oh, right, that must be her, she’s referring to herself in the third person; that <i>is</i> an unconventional manner of speech. No, you just saw the store and thought it interesting, so you came in to browse. Something like that, anyway.", parse);
        Text.NL();
        Text.Add("<i>“Ah, carried in by the winds of fate! Even better, then!”</i>", parse);
        Text.NL();
        Text.Add("So… what exactly does she sell here? Looking around you, you kind of have an idea, but it’s best to ask anyway.", parse);
        Text.NL();
        Text.Add("<i>“Customer wants to know what Asche sells? Anything and everything, so long as it bears some relation to the magical.”</i> The jackaless waggles her fingers. <i>“Truly, that is making for some degree of clutter, but it makes better chances that customer who comes in will be able to find something to buy, yes?</i>", parse);
        Text.NL();
        Text.Add("<i>“Asche has for sale some books, trinkets, staves - and of course, clothes to match.”</i> She gestures at the shelves, then at herself. <i>“Is very important to not just stay in style, but also character. Customers expect certain appearances when they are coming in, and Asche hopes to please; in same way, people are expecting certain things of magic workers.</i>", parse);
        Text.NL();
        Text.Add("<i>“Other things that Asche has in stock are potions for many ailments - when those who are too poor to see healers get sick, they come to Asche, for she has very reasonable prices and effective cures. Not for sale are things that transform others - Asche has enough problems with guards that she does not need to be giving them more reason to be knocking on her door.</i>", parse);
        Text.NL();
        Text.Add("<i>“Finally, Asche can also do some things for you, although not things [handsomepretty] customer may be having in mind.”</i> She winks at you slyly. <i>“For example, Asche is very skilled in the art of fortune-telling, and can read your palm for a few coins. No crystal balls for this jackaless, yes.”</i>", parse);
        Text.NL();
        Text.Add("Well, that’s certainly a bit to digest all at once.", parse);
        Text.NL();
        Text.Add("<i>“World of magic is very wide and varied, both in good and evil, so long-winded tale is only to be expected. If good customer has questions about any of the merchandise, [heshe] should not hesitate to ask Asche for details. Safe customer is happy customer is repeat customer.”</i> With that, she gives you one last canine smile and turns back to her own devices.", parse);
        Text.Flush();
        Gui.NextPrompt();
    }

    export function Prompt() {
        const player = GAME().player;
        const asche = GAME().asche;
        const rigard = GAME().rigard;

        const parse: any = {
            handsomepretty : player.mfFem("handsome", "pretty"),
            heshe: player.mfFem("he", "she"),
            hisher: player.mfFem("his", "her"),
            himher: player.mfFem("him", "her"),
        };

        const options = new Array();
        options.push({ nameStr : "Appearance",
            tooltip : "Study the jackal-morph.",
            func : AscheScenes.Appearance,
            enabled : true,
        });
        options.push({ nameStr : "Talk",
            tooltip : "Chat up Asche.",
            func() {
                Text.Clear();
                Text.Add("Asche looks around the her shop for a bit, craning her neck this way and that. Once the jackaless is content that business isn’t too brisk to prevent a bit of chit-chat, she lounges on the counter with all the nonchalance of a lazy cat and smiles at you.", parse);
                Text.NL();
                Text.Add("<i>“Well, it seems like Asche has a little time for making small talk with [handsomepretty] customer like you. Maybe call it customer relations? Maybe with enough luck, can be called customer service, too.”</i> She chuckles at her own joke. <i>“Well, what does good customer wish to gossip about?”</i>", parse);
                Text.Flush();

                AscheScenes.TalkPrompt();
            }, enabled : true,
        });
        options.push({ nameStr : "Buy",
            tooltip : "Ask to see her wares.",
            func() {
                Text.Clear();
                Text.Add("The jackaless nods and beams at you. <i>“Asche is happy to be able to service customer! Please to be browsing, perusing, going through. If customer is finding anything to [hisher] liking, then is but small matter of money to be bringing it away with [himher].”</i>", parse);

                rigard.MagicShop.Buy(function() {
                    Text.Clear();

                    const scenes = new EncounterTable();
                    scenes.AddEnc(function() {
                        Text.Add("<i>“Oh? There is being nothing here that is interesting customer?”</i> Heaving a small sigh, Asche shrugs and spreads her hands, palms upward. <i>“Well, it is being what it is, so maybe customer should be looking at something else?”</i>", parse);
                    }, 1.0, function() { return true; });
                    scenes.AddEnc(function() {
                        Text.Add("Licking her muzzle, Asche proceeds to smack her lips. <i>“Eh? Nothing is catching customer’s eye? Is not big problem, Asche would rather have customer be buying useful thing rather than just buying for the sake of making Asche happy. This jackaless is not so hard up that she is needing others to be buying everything she is putting on the shelves.”</i>", parse);
                    }, 1.0, function() { return true; });
                    scenes.AddEnc(function() {
                        Text.Add("<i>“Is pity that customer is not fancying anything right now, but maybe [heshe] has not come across right item yet,”</i> Asche says as she puts her goods away. <i>“Is not big deal, anyway - these days Asche is doing this more for practice and amusement than actually needing to feed her face. To be coming again another time, when she has different things?”</i>", parse);
                    }, 1.0, function() { return true; });
                    scenes.Get();

                    Text.Flush();
                    AscheScenes.Prompt();
                }, true);
            }, enabled : true,
        });
        options.push({ nameStr : "Sell",
            tooltip : "Get rid of some of your surplus.",
            func() {
                Text.Clear();
                Text.Add("<i>“Customer is wanting to sell something to Asche?”</i> The jackaless rubs her hands together, a movement accompanied by the clinking of bangles. <i>“Let Asche see item, and she will tell you how much she thinks she will buy it for.”</i>", parse);

                rigard.MagicShop.Sell(function() {
                    Text.Clear();
                    Text.Add("<i>“Customer come back to Asche if [heshe] wants to sell things, yes?”</i>", parse);
                    Text.Flush();
                    AscheScenes.Prompt();
                }, true);
            }, enabled : true,
        });
        options.push({ nameStr : "The Magic Box",
            tooltip : "Do you feel lucky? Well, do you?",
            func() {
                Text.Clear();
                Text.Add("<i>“Ah, customer is interested in magic box?”</i> There’s a soft clink of metal as Asche shifts slightly in her seat. <i>“What is it that good customer desires? Fee is [coin] coins.”</i>", {coin: Text.NumToText(asche.MagicBoxCost()) });
                Text.Flush();

                AscheScenes.MagicBoxPrompt();
            }, enabled : true,
        });
        options.push({ nameStr : "Fortune Telling",
            tooltip : "Ask Asche to see what the future has in store for you.",
            func() {
                Text.Clear();
                parse.coin = Text.NumToText(AscheScenes.FortuneCost());
                Text.Add("<i>Ah, you are wanting Asche to be divining what future holds for you?”</i> the jackaless says with a smirk and wink. <i>“Can be done, for the price of [coin] coins.”</i>", parse);
                Text.Flush();

                AscheScenes.FortuneTellingPrompt();
            }, enabled : true,
        });
        options.push({ nameStr : "Sex",
            tooltip : "Propose a romp in the hay with the exotic shopkeeper.",
            func() {
                Text.Clear();
                Text.Add("<i>“Mm…”</i> Asche licks her muzzle, then leans up close to you. Nonchalantly, she cups her breasts, one in each hand, then pushes her lady lumps forward such that the hand-filling mounds seem even bigger and fuller than they already are - you can practically see them through the fabric of her sari. Making sure you’re looking, the jackaless begins kneading gently, a small whine escaping her muzzle before she stops and grins at you. <i>“Asche thinks… not. Asche is a good girl, a nice girl, and does not give freebies to get others hooked, unlike her big sister.”</i>", parse);
                Text.NL();
                Text.Add("She’s such a tease.", parse);
                Text.NL();
                Text.Add("<i>“Is merely practical,”</i> the jackaless replies. <i>“Customers are buying more when they are being served by pretty girl; bad hair day for Asche means bad business day, too. But sometimes they are getting ahead of themselves, [handsomepretty] customer is not the first one to have invited Asche to the back room.</i>", parse);
                Text.NL();
                Text.Add("<i>“Nevertheless, if customer is determined… maybe there may come a time when there are things [heshe] can do that may make Asche change her mind,”</i> she adds with a wink.", parse);
                Text.Flush();
            }, enabled : true,
        });
        Gui.SetButtonsFromList(options, true, function() {
            Text.Clear();

            const scenes = new EncounterTable();
            scenes.AddEnc(function() {
                Text.Add("<i>“Bye bye now,”</i> Asche says, flicking a softly-furred ear in your direction. <i>“Asche is hoping that customer is being in one piece when [heshe] is next returning to her shop… but if not, there are things she has which can be solving that little problem, too…”</i>", parse);
            }, 1.0, function() { return true; });
            scenes.AddEnc(function() {
                Text.Add("Asche glances up at you as you move towards the door. <i>“Asche is wishing you good health until you next return, customer. Is very easy to be not feeling well while out there, so to be coming back if you have need of her potions.”</i>", parse);
            }, 1.0, function() { return true; });
            scenes.AddEnc(function() {
                Text.Add("As you make for the door, you hear Asche chuckle behind you, the jackaless’ soft voice more than a little disquieting. <i>“So, does brave customer possess the courage to move on and face [hisher] fateful fate? Or will the sound of [hisher] screams mark the end of [hisher] adventure? This jackaless would offer customer escape, but even her shop is probably not enough to stand against the powers that are hunting customer…to be staying safe until next return.”</i>", parse);
            }, 1.0, function() { return true; });
            scenes.AddEnc(function() {
                Text.Add("<i>“Asche is saying farewell to you, customer,”</i> the jackaless says, stifling a yawn as her gaze follows you to the door. <i>“When being out there, customer is to be remembering: everything is having its price, even if not visible all at once…”</i>", parse);
            }, 1.0, function() { return true; });
            scenes.Get();

            Text.Flush();
            Gui.NextPrompt();
        });
    }

    export function Appearance() {
        const player = GAME().player;
        const parse: any = {
            handsomepretty : player.mfFem("handsome", "pretty"),
        };

        Text.Clear();
        Text.Add("Asche is a lusciously full-bodied jackal-morph, her limbs and figure slender, her chest and hips exotically full. Clothed in a pure white sari that exposes her midriff’s soft deep golden-brown fur, the jackaless is quite the sight to behold. Large, pointy ears peek out from the hood of her snow-white shawl, constantly alert and swivelling this way and that. Stray strands of dirty blond hair streaked with black gather around her chin and shoulders as she levels her narrow, dark eyes at you.", parse);
        Text.NL();
        Text.Add("Illuminated by the crystal lamp on the counter, the jackaless’ fur looks absolutely soft and strokable, lustrous, and appropriately mystical. To say it’s practically spun gold wouldn’t be too far off the mark - Asche clearly puts a lot of work into ensuring she’s presentable for her clientele. A faint scent of jasmine hangs about her person, alluring and exotic.", parse);
        Text.NL();
        Text.Add("True to her customers’ expectations, Asche wears far too much makeup - particularly in the eyeshadow and liner department - and has adorned herself with gold and silver jewelery to the point that she clinks and clanks when she moves. Bangles line her wrists and ankles, numerous small rings have been set into her large ears, and there’s even an exquisite chain of gold filigree resting on her hips, tiny shards of topaz and amber worked into some of the links.", parse);
        Text.NL();
        Text.Add("<i>“Is [handsomepretty] customer done admiring Asche?”</i> she asks slyly, her muzzle splitting in a canine grin even as her long, fluffy tail begins wagging eagerly. <i>“Asche loves to feel treasured, yes yes, but even though she is magical, she is not for sale.”</i>", parse);
        Text.Flush();
    }

    export function TalkPrompt() {
        const player = GAME().player;
        const asche = GAME().asche;

        const parse: any = {
            handsomepretty : player.mfFem("handsome", "pretty"),
            heshe: player.mfFem("he", "she"),
            hisher: player.mfFem("his", "her"),
            himher : player.mfFem("him", "her"),
        };

        // [Shop][Magic][Herself][Sister][Stock][Tasks][Back]
        const options = new Array();
        options.push({ nameStr : "Shop",
            tooltip : "That’s a nice shop she has there.",
            func() {
                Text.Clear();
                Text.Add("The shop’s a pretty nice place, you mention, looking around. It definitely has that feel that one gets when entering one of those tiny antique shops, or perhaps an old bookstore - the kind in which forgotten treasures are found, treasures which have entire stories revolving about them.", parse);
                Text.NL();
                Text.Add("Asche beams. <i>“Did not happen by accident, Asche spent years cultivating atmosphere, you know. Was not very good at first, customers would come in, take a look, then go; long time getting the jasmine scent correct, to help customers be at ease while not sending them to sleeping or driving them away.”</i>", parse);
                Text.NL();
                Text.Add("Years, huh. Just how long has she had the shop?", parse);
                Text.NL();
                Text.Add("<i>“Oh, long, long time. As you can guess, Asche is older than she looks, yes?”</i> The jackaless’ muzzle parts in a sly smile, her tail wagging back and forth even more vigorously now. <i>“Maybe not by so much by way some are reckoning time, but she is not afraid to admit it. Lying to oneself is quick way to meet sticky end in her line of work.</i>", parse);
                Text.NL();
                Text.Add("<i>“But since you are wanting to know… if you are asking old man in streets how long Asche’s shop has been around, then he will remember it being there as a small boy. Owner was also jackaless named Asche, but the one running shop today must be her daughter, also named Asche… no one is young forever, right?”</i>", parse);
                Text.NL();
                Text.Add("So… is she <i>really</i> that old, or is she the daughter of the former proprietor? Or maybe she really isn’t a jackal-morph and something else masquerading as one? The possibilities are endless!", parse);
                Text.NL();
                Text.Add("The jackaless raises a finger to her lips. <i>“I cannot be so easily telling that. Is part of shop’s mystique, and am afraid much of it would be gone if you are knowing answer. Maybe nice customer can be earning knowledge of that later on, maybe not.</i>", parse);
                Text.NL();
                Text.Add("<i>“But all customer needs to be knowing is that Asche is here running her shop, selling safe solutions to customers’ problems. That is all that is really needed, yes?”</i>", parse);
                Text.NL();
                Text.Add("Well, from a business standpoint, you suppose it is. From a more personal point of view, though, it’s hardly enough. Nevertheless, it’s probably not good to press her for too much in one go…", parse);
                Text.Flush();

                asche.flags.Talk |= AscheFlags.Talk.Shop;

                AscheScenes.TalkPrompt();
            }, enabled : true,
        });
        options.push({ nameStr : "Magic",
            tooltip : "Discuss Asche’s particular brand of magic with her.",
            func : AscheScenes.Lessons, enabled : true,
        });
        options.push({ nameStr : "Herself",
            tooltip : "Ask the jackaless about herself.",
            func() {
                Text.Clear();
                Text.Add("Perhaps she could tell you something about herself.", parse);
                Text.NL();
                Text.Add("<i>“Customer is wanting to know about Asche? To be commended, for most are merely interested in what she can do for them. Oh, do not worry. Asche can tell you many things about herself that are true, but do not make shop look more mundane than it should be.”</i>", parse);
                Text.NL();
                Text.Add("Well then, you say, settling down for a long talk. You’re all ears.", parse);
                Text.NL();
                Text.Add("<i>“Asche grew up in highlands of Eden,”</i> the jackaless begins, idly drumming the fingers of one hand on the counter. <i>“Was pretty much shithole, as much as she remembers it. Returned to visit family few years back, still is much of a shithole, was reminded why she came to city.</i>", parse);
                Text.NL();
                Text.Add("<i>“Highlands may be shithole, but still is mystical shithole. Magic there is not like magic of coasts and lowlands, and Asche’s mother was herb woman for tribe; did pretty well for herself by taking chieftain as mate. Was not long before big sister and Asche were born; big sister was intended to take on mother’s mantle, but Asche learned too anyway - mostly in secret. Still, only room for one herb woman in a tribe. Asche is not stupid, so she left before big sister arranged for accident to happen to her. Later on, sister is also deciding that tribe is too small for her, you know? Wants to see world? So everything is for nothing.”</i>", parse);
                Text.NL();
                Text.Add("Ouch. That’s nasty.", parse);
                Text.NL();
                Text.Add("Asche shakes her head. <i>“Is only natural for those who scheme to think others are scheming too; they are always imagining that others also thinking like them. Now, where were we? Right! Asche comes to city. Was long and tiring walk, also some interesting things happened, but best to save those for later.”</i>", parse);
                Text.NL();
                Text.Add("What happened next?", parse);
                Text.NL();
                Text.Add("<i>“Asche makes living casting small spells,”</i> the jackaless replies. <i>“Keep bugs away from grain bin and sleeping place, get rid of rats, soothe mild fever, that kind of thing. Many swindlers in those days, so is hard to get started, but once people are knowing that you are not cheating them by talking nonsense and passing off colored water as potions, they are the ones who are finding you rather than other way round.</i>", parse);
                Text.NL();
                Text.Add("<i>“Soon enough, Asche is having enough money to rent out small place in merchants’ district - rent of this place was very much cheaper back then, so easier to do. When she is earning enough money later on, she is buying place and making it her own. Is very nice story, no?”</i>", parse);
                Text.Flush();

                asche.flags.Talk |= AscheFlags.Talk.Herself;

                AscheScenes.TalkPrompt();
            }, enabled : true,
        });
        // Requires having asked about herself and shop
        options.push({ nameStr : "Sister",
            tooltip : "So, this sister she mentioned…",
            func() {
                Text.Clear();
                Text.Add("The jackaless’ ears flick at your question. <i>“Why yes, Asche has one big sister. Much lovelier than Asche, too - and much more nasty. Big sister also runs shop much like Asche’s, only with much fewer scruples; while Asche is careful not to sell things that harm customers unless misused, big sister does not think twice about doing so. That is why while Asche can remain in one place, big sister was always having to move shop before shop was moved for her, if you are understanding Asche’s meaning.”</i>", parse);
                Text.NL();
                Text.Add("Sounds like she doesn’t like that sister of hers very much.", parse);
                Text.NL();
                Text.Add("<i>“Of course not. When Asche was little, big sister was always making Asche do things for her; Asche, fetch this, Asche, carry that. Later on, was also always tricking customers into doing things for her, often because she sells them bad things, cursed things, things which have hidden prices. She is doing it even when simple paying of money would be easier; habits are hard in dying. There was this time when she was having this monkey’s paw…”</i>", parse);
                Text.NL();
                Text.Add("You clear your throat, interrupting the jackaless before she gets drawn off on a tangent. And… <i>was</i> having to move shop? One can only take it karma caught up with Asche’s elder sister?", parse);
                Text.NL();
                Text.Add("<i>“In a sense of speaking, yes.”</i> Asche chuckles, the jackal-morph’s grin growing wider. <i>“Last Asche heard of sister, she was bragging how she had made customer into good little slave with magical ankhs, help her get rare items she is too lazy to get herself. Have not had news from her since, but one has come across rumors…”</i>", parse);
                Text.NL();
                Text.Add("Asche laughs, not even bothering to hide the undertones of dark glee in her voice. She raises an eyebrow and cozies up to the counter, gazing straight into your eyes.", parse);
                Text.NL();
                Text.Add("<i>“Nevertheless, if you are finding in your travels shop much like Asche’s, and also owner who looks like Asche, only she has black and silver fur instead… customer is not to be buying anything and leaving immediately. But there is little to fear from Asche, good customer. Asche is a nice girl, and knows not to salt earth. None of Asche’s merchandise will harm you - unless you mean to do evil with it.”</i>", parse);
                Text.Flush();

                asche.flags.Talk |= AscheFlags.Talk.Sister;

                AscheScenes.TalkPrompt();
            }, enabled : (asche.flags.Talk & AscheFlags.Talk.Shop) && (asche.flags.Talk & AscheFlags.Talk.Herself),
        });
        options.push({ nameStr : "Stock",
            tooltip : "Where does she get all the stuff she sells?",
            func() {
                Text.Clear();
                Text.Add("You’ll admit to being a bit curious - just where does Asche get her stock? Some of the things she sells are positively odd; you don’t think the likes of them can be found in any other shop in Rigard - in fact, you’re pretty sure some of her goods would be more at home in the Academy of Higher Arts rather than sitting on her shelves.", parse);
                Text.NL();
                Text.Add("Asche whistles innocently and rolls her eyes in the most exaggerated fashion, then gives you a toothy grin. <i>“Oh, little bit here, little bit there, many a mickle makes a muckle, as saying goes. Some of it is coming from customers like you, wanting to sell things and not knowing what they truly are - for example, once had a fellow come in who was using pretty powerful artifact to help grow pumpkins, and wanted to get rid of it because he was selling farm and moving to Afaris. Such waste; Asche was more than willing to buy from him. More yet is also coming from dealers Asche trusts, although she is not going to be revealing their names.</i>", parse);
                Text.NL();
                Text.Add("<i>“Other stock, Asche admits, is being pulled out of box, although she is making sure that everything is safe to use; some things are disguising themselves and slipping through box’s protections. After being victim of many of big sister’s pranks, Asche has good skill at scenting dark magic.”</i> The jackaless taps her nose for emphasis. <i>“If she cannot be destroying item, she knows enough to at least send it back where it is coming from.</i>", parse);
                Text.NL();
                Text.Add("<i>“As for potions, all are brewed by Asche. Simple ones anyone who studies can make, but some are Asche’s special recipe and she is not letting such secrets slip easily.”</i> With that, the jackaless clears her throat and gestures at her store. <i>“Asche has not stayed in business for so long by being stupid or careless; she is having many loyal customers who be relying on her not to make mistake.”</i>", parse);
                Text.Flush();

                asche.flags.Talk |= AscheFlags.Talk.Stock;

                AscheScenes.TalkPrompt();
            }, enabled : true,
        });
        // TODO Default response:
        options.push({ nameStr : "Tasks",
            tooltip : "Does she perchance need the services of an adventurer?",
            func() {
                if (AscheTasksScenes.Ginseng.IsEligable()) {
                    AscheTasksScenes.Ginseng.Initiation();
                } else if (AscheTasksScenes.Ginseng.IsOn()) {
                    if (AscheTasksScenes.Ginseng.IsFail()) {
                        AscheTasksScenes.Ginseng.Failed();
                    } else if (AscheTasksScenes.Ginseng.IsSuccess()) {
                        AscheTasksScenes.Ginseng.Complete();
 } else {
                        AscheTasksScenes.Ginseng.OnTask();
 }
                } else if (AscheTasksScenes.Nightshade.IsEligable()) {
                    AscheTasksScenes.Nightshade.Initiation();
 } else if (AscheTasksScenes.Nightshade.IsOn()) {
                    if (AscheTasksScenes.Nightshade.IsSuccess()) {
                        AscheTasksScenes.Nightshade.Complete();
                    } else {
                        AscheTasksScenes.Nightshade.OnTask();
                    }
                } else if (AscheTasksScenes.Spring.IsEligable()) {
                    AscheTasksScenes.Spring.Initiation();
 } else if (AscheTasksScenes.Spring.IsOn()) {
                    if (AscheTasksScenes.Spring.IsSuccess()) {
                        AscheTasksScenes.Spring.Complete();
                    } else {
                        AscheTasksScenes.Spring.OnTask();
                    }
                } else {
                    AscheTasksScenes.Default();
 }
            }, enabled : true,
        });
        Gui.SetButtonsFromList(options, true, function() {
            Text.Clear();
            Text.Add("<i>“Customer is having enough of chit-chat, maybe mouth is getting dry?”</i> Leaning forward on the counter, Asche grins at you playfully. <i>“Asche has many nice teas for long conversations, maybe customer can be purchasing some. But is there anything else customer wishes to have to do with Asche before this meeting is over?”</i>", parse);
            Text.Flush();

            AscheScenes.Prompt();
        });
    }

    export function Lessons() {
        const player = GAME().player;
        const asche = GAME().asche;

        const parse: any = {
            handsomepretty : player.mfFem("handsome", "pretty"),
            heshe: player.mfFem("he", "she"),
            hisher: player.mfFem("his", "her"),
            himher: player.mfFem("him", "her"),
        };

        Text.Clear();
        // Lesson one - Components
        if (asche.flags.Magic < AscheFlags.Magic.Components) {
            Text.Add("You’d like to discuss the nature of magic with her. It seems quite different from what is usually practiced on Eden.", parse);
            Text.NL();
            Text.Add("<i>“Oh-ho,”</i> the jackaless replies, eyeing you with a raised eyebrow, her tail swishing from side to side. <i>“Customer is wanting to know the secrets of highlander witch doctors, herb women, and shamans? Is taking many years to truly understand, as well as good memory; Asche spent her whole time as girl learning basics of such magic.”</i>", parse);
            Text.NL();
            Text.Add("Well, maybe she could give you a condensed version of the idea?", parse);
            Text.NL();
            Text.Add("<i>“Yes, yes. Well, to be simply saying, basics of magic is not too different from that of lowlanders with their staves and fancy clothes and sparkling crystals. Is all about energy. But just as one can be choosing to be carrying water in barrel or bucket, so can these energies be moved in different ways.</i>", parse);
            Text.NL();
            Text.Add("<i>“Differences between lowlander and highlander magic are being many, but most important one is this: highlander magic is often - but not always - being employing the use of magical components, as if brewing potion. These components are being items which are representing facets of natural world which is having magic in them; by using these components in casting of spell, shaman is being able to draw much energy to fuel spell.”</i>", parse);
            Text.NL();
            Text.Add("So, it’s like brewing a potion… you kind of get it, yet at the same time, there’s something off about Asche’s explanation you can’t quite put a finger on…", parse);
            Text.NL();
            Text.Add("<i>“Good point about using magic component in casting of spell is that is allowing skilled herb woman or witch doctor to harness far more magic than self can draw. Bad point is that if caster is not having component, spell is weaker or even worse, not working. In such case, highlander magician is having to fall back on spells which are being not so powerful.”</i>", parse);
            Text.NL();
            Text.Add("Yeah, it sounds like an obvious tradeoff to you. So, what are some of these components? You’d imagine they’d be pretty rare and mystical…", parse);
            Text.NL();
            Text.Add("Asche shrugs. <i>“It is really being depending on what customer has in mind. For example, best item for drawing forth power of sea is being black pearl, which is being incredibly rare. Pearl is also working, but not as powerful, to be needing more of them as compared to black ones. To be representing life and growth is very simple, just needing pinch of common basil herb. Invoking fire and light is requiring volcanic ash from deep underground, but coal can also be sufficing if simple magic is what is needed.</i>", parse);
            Text.NL();
            Text.Add("<i>“Rituals is also being important in working of highlander magic, but maybe is discussion best saved for another time, is it not? Asche’s tongue is getting dry from so much talking, maybe is wanting something to drink.”</i> The jackaless chuckles.", parse);

            asche.flags.Magic = AscheFlags.Magic.Components;

            Text.Flush();
            AscheScenes.TalkPrompt();
        } else if ((asche.flags.Magic < AscheFlags.Magic.Rituals) && (asche.flags.Tasks >= AscheFlags.Tasks.Ginseng_Finished)) {
            Text.Add("<i>“Now that customer has had chance to see shamanistic power for [himher]self, Asche is thinking that maybe [heshe] is ready for deeper explanation. But… really, this jackaless is curious - she cannot be teaching customer to be doing highlander magic, so why is customer being asking so many questions?”</i>", parse);
            Text.NL();
            Text.Add("Curiosity, nothing more.", parse);
            Text.NL();
            Text.Add("Asche considers that a moment, a soft rustle accompanying movements under her snow-white sari. <i>“Well, if it is curiosity that customer is giving as reason, then Asche shall be giving answer that is fitting. Let us be moving onto next portion of highlander magic: ritual.</i>", parse);
            Text.NL();
            Text.Add("<i>“You may be already knowing that lowlander magicians may be speaking words to help concentrate their focus; others are being making gestures to same effect. Both are not being strictly necessary, but are helping to sharpen mind and direct intent. Lowlanders is often seeing it as crutch, sign of weakness to be discarded.”</i>", parse);
            Text.NL();
            Text.Add("The jackaless looks at you to make sure you’re still listening, then continues. <i>“Ritual being used in highlander magic is same basic idea, to use actions and symbols to be focusing mind. Difference is that is very tricky. Even Asche does not use it much, only when true power is being called for.”</i>", parse);
            Text.Flush();

            Gui.NextPrompt(function() {
                Text.Clear();
                Text.Add("<i>“Maybe best explanation is being through example. Say there is not being rain for some time, and shaman is asked to summon rain so that crops may have water. First thing shaman does is to retreat into cave and start preparing large amount of woad. During this time, shaman is also fasting from dawn to dusk to prepare mind for ritual, this period is being lasting two days.</i>", parse);
                Text.NL();
                Text.Add("<i>“When this is being over, shaman is taking prepared woad to standing stones, which are being arranged in circle. With this, he is to be pouring woad dye and connecting all stones in one unbroken line. Is being very important that stream is unbroken, if shaman is being stopping pouring even once and resuming, ritual is not working. After circle is joined, is time to draw patterns.</i>", parse);
                Text.NL();
                Text.Add("<i>“Patterns on stones are to be made in woad, patterns on shaman’s body are to be made in henna. Red of henna is being contrasting with blue of woad to produce opposites between animate and inanimate, which is becoming during dance.”</i>", parse);
                Text.NL();
                Text.Add("Wow, that’s quite a speech, and she’s not done yet. Asche brings out a small flask of what looks like milk tea from under the counter and takes a deep, long swig, running her tongue over her muzzle to wet her lips.", parse);
                Text.NL();
                Text.Add("<i>“Now, where was Asche? Ah, yes, actual dance to be summoning rain. Too complicated for Asche to be describing right here, but is quite intricate and is consisting of many steps. Also, better if many people are watching. Not just many people, but many people whom shaman is knowing and caring for. This is usually meaning tribe.</i>", parse);
                Text.NL();
                Text.Add("<i>“To be sure, is not easy thing. Many steps must be done in right order, with right movements, in right place and at right time for magic to be correctly worked. But when it is working, result of ritual can be incredibly powerful. If given three days to prepare, single shaman can summon rain over entire mountain with rain dance. What many people are seeing is end result - dance that is lasting maybe half an hour, but much preparation is going into ritual magic.”</i>", parse);
                Text.NL();
                Text.Add("Wow. That certainly is a lot.", parse);
                Text.NL();
                Text.Add("Asche shakes her head, soft clinks of gold against gold accompanying the movement. <i>“What Asche has told good customer is being very, very summarized. There is reason why next herb woman is almost certainly being daughter of previous one, as training is beginning from moment child is able to walk and speak. Maybe even before, if customer is seeing it that way.</i>", parse);
                Text.NL();
                Text.Add("<i>“Now, Asche has said enough, and has shop to tend to. Maybe you buy something to make up for Asche telling you long grandmother story, yes?”</i>", parse);

                asche.flags.Magic = AscheFlags.Magic.Rituals;

                Text.Flush();
                AscheScenes.TalkPrompt();
            });
        } else if (!GlobalScenes.PortalsOpen() && (asche.flags.Magic < AscheFlags.Magic.Authority) && (asche.flags.Tasks >= AscheFlags.Tasks.Nightshade_Finished)) {
            Text.Add("<i>“Today, Asche would be liking to be talking about what kinds of magic can be done, and what is to not be done. This jackaless is admitting that maybe she should have been making this her very first lesson to customer, but it was slipping her mind…</i>", parse);
            Text.NL();
            Text.Add("<i>“Never mind. She can be making up for lost time right now.”</i>", parse);
            Text.NL();
            Text.Add("What does she mean by not done, anyway? Does that mean certain types of magic don’t work here on Eden? That they’re illegal? That people use them anyway, but keep it on the low-down?", parse);
            Text.NL();
            Text.Add("<i>“By not being done, Asche is meaning that if Inquisition is ever being catching wind of customer trying to do such naughty things, they will be investigating customer. And if they are being having cause, customer shall be dragged off to be standing trial for magical crimes. Is most unpleasant thing - Asche has not had honor of being star of one of Inquisition’s shows, and is being very glad to not be.”</i>", parse);
            Text.NL();
            Text.Add("All right. Inquisition, magical authorities. Stay out of their hair. Sounds straightforward enough.", parse);
            Text.NL();
            Text.Add("The jackaless narrows her eyes at you. <i>“Somehow, this jackaless is getting feeling that maybe customer is not being taking this seriously enough. Inquisition is being very hard on magical wrongdoers, because they are not wanting to be having time like in past, when common people are being fearing and hating practitioners of the Art. Asche cannot be blaming them, because in those days every simple hedge witch or wizard are being getting up to all sorts of evil. If Inquisition is finding customer using magic to be doing evil things, customer’s life is likely to be forfeit. Please to be keeping that in mind.”</i>", parse);
            Text.NL();
            Text.Add("Out of curiosity, what kinds of things does the Inquisition go after people for?", parse);
            Text.NL();
            Text.Add("<i>“Dealing with beings of demonic nature,”</i> Asche replies flatly, droning on as if reciting from a list. <i>“Killing, or driving others mad with power. Permanent, irreversible transformation of sapient being into another form against being’s will. Practicing evil magics which are always being causing harm, such as blood magic or necromancy. Need this jackaless be saying more?”</i>", parse);
            Text.NL();
            Text.Add("No, no. You get the idea well enough.", parse);
            Text.NL();
            Text.Add("<i>“Inquisition is also being investigating natural occurrence of significant magical nature, but maybe that is thing that customer need not be bothering [himher]self with. Most important thing is to be knowing that there <b>are</b> being those who watch over those who are being practicing the Art, and <b>will</b> be coming after customer if [heshe] is stepping out of line. Understand?”</i>", parse);
            Text.NL();
            Text.Add("You nod.", parse);
            Text.NL();
            Text.Add("<i>“Good, that is one thing off this jackaless’ conscience.”</i> Asche huffs, warm breath jetting from her muzzle, and pulls herself away from you. <i>“Do not be saying that Asche is not giving warning… and that is being ending today’s lesson. Is an important one, so Asche is hoping customer is learning it well.”</i>", parse);

            asche.flags.Magic = AscheFlags.Magic.Authority;

            Text.Flush();
            AscheScenes.TalkPrompt();
        } else if ((asche.flags.Magic < AscheFlags.Magic.Spirits) && (asche.flags.Tasks >= AscheFlags.Tasks.Spring_Finished) && GlobalScenes.DefeatedOrchid()) {
            Text.Add("Asche nods and traces a finger on the counter. <i>“For today’s lesson with customer, Asche is wishing to be broaching the subject of spirits.”</i>", parse);
            Text.NL();
            Text.Add("Right. Spirits. That’s how you ended up in this mess in the first place - the gem aside, of course. Aria, Uru…", parse);
            Text.NL();
            Text.Add("<i>“Asche knows that customer is being harboring at least one spirit with [himher]… she is sensing its power. It is being for customer’s own good that [heshe] is learning some history about power [heshe] is now possessing.</i>", parse);
            Text.NL();
            Text.Add("<i>“To be starting with, nature of spirits is beings of power. Of what nature, that is very many - some are being manifestations of natural forces, others are being embodying ideas and otherwise abstract concepts. Earth, water, luck, war, destruction, honor, fertility, such are some things which spirits may be representing. Naturally, as with people, so there are being many spirits which are possessing different stations in order of things.</i>", parse);
            Text.NL();
            Text.Add("<i>“Remember, to not be confusing spirits with magical beings like dragons or nymph or elf. Although they are possessing much magical power compared to customer or this jackaless, even greatest of dragons is only as powerful as lowest of spirits.”</i>", parse);
            Text.NL();
            Text.Add("All right, you get her drift. They’re <i>really</i> powerful.", parse);
            Text.NL();
            Text.Add("Asche clicks her tongue. <i>“No need for customer to be impatient, just listening carefully as Asche is teaching. Now, grand spirits are being greatest of them all. They are being entities of much power, to be rightly even called gods; very presence of one can be greatly altering the fate of an entire world, not to be saying much if spirit is taking interest in it. Reach of such spirits can be spanning many planes, and much spiritual strength is being needed to even to be standing before them.”</i>", parse);
            Text.NL();
            Text.Add("Right. As before, Aria and Uru. You don’t <i>feel</i> as if you have amazing spiritual strength, as Asche put it, but the gem probably did something to you - Aria did say something about you not being able to linger long in her realm.", parse);
            Text.NL();
            Text.Add("<i>“Next step down is greater spirits. These are still being very powerful entities, demigods or maybe even gods in own realms - although if so, may also be weaker outside of it. Most common example are being greater elemental spirits - wind, fire, and such - or spirits which are being embodying concepts which many people are being aware of.</i>", parse);
            Text.NL();
            Text.Add("<i>“Finally, there are existing lesser spirits, those of which common people are most likely to be meeting. These are still being possessing much power in their own spheres, and may be servant to that of spirit above them. For example, highlands is being having many tribes… but only few, like minotaurs, are being having patron spirit to be watching over them. Such spirit is lesser spirit, is often manifesting themselves with the people and interacting with them… not to say that other spirits are all being aloof, but it is just thing Asche has noticed.”</i>", parse);
            Text.NL();
            Text.Add("So, to recap: there’re three broad categories of spirits, all of differing power.", parse);
            Text.NL();
            Text.Add("Asche nods. <i>“Traditional highland magics are often consorting with many lesser spirits; it is way of doing things which is being handed down for very, very long time. Relationship between shaman and spirit has been codified in this way… Asche cannot be saying same for practitioners which are not being trained in highland way of things, they are being only knowing subjugation, and most are being always seeking tricks and loopholes to be making spirits into their servants. Hmph. Not knowing between diverting river’s flow and damming river. Having resentful servant always ends badly.</i>", parse);
            Text.NL();
            Text.Add("<i>“Of course, if you are being asking them, they are no doubt having their own story, so to be taking what this jackaless is saying with grain of salt.”</i>", parse);
            Text.NL();
            Text.Add("You’ll take care to treat Spirit here with respect, then.", parse);
            Text.NL();
            Text.Add("<i>“Respect is part of what is being needed, yes. Knowing where lines are drawn, and what may or may not be asking of spirit without special permission… is not something Asche can teach, but customer must be learning for [himher]self. Understand?”</i>", parse);
            Text.NL();
            Text.Add("You’ll try and wrap your head about it.", parse);
            Text.NL();
            Text.Add("<i>“Is as much as this jackaless can be asking for, and that is concluding today’s lesson. If customer is taking only one thing away from Asche’s words, she is asking customer to remember to be treating accompanying spirits with respect. Much will be owed them in future.”</i>", parse);

            asche.flags.Magic = AscheFlags.Magic.Spirits;

            Text.Flush();
            AscheScenes.TalkPrompt();
        } else {
            Text.Add("The jackaless makes a show of looking contemplative, leaning on the counter as she taps her chin and rolls her eyes in an exaggerated display of thoughtfulness. <i>“Hmm… customer is wanting to be talking more magic with Asche? This jackaless is thinking not so quickly… maybe good customer is getting one step ahead of [himher]self, yes? Perhaps is best to be contemplating and internalizing things which are being told, lessons which are being taught, having some time to be seeing it in action.</i>", parse);
            Text.NL();
            Text.Add("<i>“Maybe it is being best for good customer if [heshe] is coming back after Asche is finding opportunity to be sending [himher] to experience it in field.”</i>", parse);
            Text.Flush();
            AscheScenes.TalkPrompt();
        }

    }

    export function FortuneTellingPrompt() {
        const player = GAME().player;
        const kiakai = GAME().kiakai;
        const terry = GAME().terry;
        const layla = GAME().layla;
        const party: Party = GAME().party;
        const rigard = GAME().rigard;
        const glade = GAME().glade;

        const parse: any = {
            handsomepretty : player.mfFem("handsome", "pretty"),
            HeShe: player.mfFem("He", "She"),
            heshe: player.mfFem("he", "she"),
            hisher: player.mfFem("his", "her"),
            himher : player.mfFem("him", "her"),
        };

        const cost = AscheScenes.FortuneCost();

        // [Fortune][Fate][Explain][Never Mind]
        const options = new Array();
        options.push({ nameStr : "Fortune",
            tooltip : "Ask for a quick, light and easy reading.",
            func() {
                Text.Clear();
                Text.Add("<i>“Mm.”</i> The jackaless pulls at her shawl as you pass her the money, then dips her head. <i>“All right. Good customer is to be holding out hand, please.”</i>", parse);
                Text.NL();
                Text.Add("Obediently, you do as Asche requests. Her fingers tickle as they ply along the contours of your palm, while she mumbles all the while. There’s no obvious indication of worked magic, but she seems to be concentrating furiously, her eyes narrowed and face set; it’s a minute or so before she finally relaxes her grip on your hand.", parse);
                Text.NL();

                const scenes = new EncounterTable();
                scenes.AddEnc(function() {
                    Text.Add("<i>“Hmm. Asche is thinking that you are being having romantic problems in near future.”</i> The jackaless looks up from your palm, her expression serious. <i>”Maybe is being a bit of a headache.”</i>", parse);
                    Text.NL();
                    Text.Add("Is there anything you can do to avoid it?", parse);
                    Text.NL();
                    Text.Add("The jackaless thinks a moment, then grins, her dark eyes glinting in the shop’s light. <i>“Actually, Asche is suggesting that customer should be lying back and accepting [hisher] fate.”</i>", parse);
                    Text.NL();
                    Text.Add("What? Isn’t the whole point of knowing a bad fortune to try and avert it?", parse);
                    Text.NL();
                    Text.Add("<i>“Is only headache, and looks like will have no really bad consequences for customer. Will make [himher] stronger for real trouble, does [heshe] not agree?”</i>", parse);
                }, 1.0, function() { return true; });
                scenes.AddEnc(function() {
                    Text.Add("The jackaless looks up from your palm, her expression contemplative. <i>“Am thinking that you may not want to be overindulging if you are ever visiting Lady Blessing’s inn.”</i>", parse);
                    Text.NL();
                    Text.Add("Why? Is someone going to pick your pocket when you’re passed out? The inn seems like too nice a place for that kind of riff-raff…", parse);
                    Text.NL();
                    Text.Add("<i>“Is not coming from another living thing.”</i> Asche looks truly worried, a rare thing for the shopkeeper. <i>“Asche… is not sure. But unless you are being thrill-seeker, Asche is asking you nicely not to be tempting fate.”</i>", parse);
                }, 1.0, function() { return true; });
                scenes.AddEnc(function() {
                    Text.Add("<i>“Hmm. Fortune for near future is being indeterminate.”</i>", parse);
                    Text.NL();
                    Text.Add("What’s the matter?", parse);
                    Text.NL();
                    Text.Add("<i>“Other would simply make up nonsense for customer to hear, but I think is more important to tell truth. Next few days for you… is wrapped in chaos. Like highland mist or fog… hard to see clearly. Asche advises you to be cautious, that is all; is but period of uncertainty.”</i>", parse);
                }, 1.0, function() { return true; });
                scenes.AddEnc(function() {
                    Text.Add("<i>“Is customer fond of swimming?”</i>", parse);
                    Text.NL();
                    Text.Add("You might be, or might not, you reply. Is there something up?", parse);
                    Text.NL();
                    Text.Add("<i>“Asche is suggesting that maybe you are staying away from large bodies of water tomorrow,”</i> the jackaless replies. <i>“That, and you are best to be avoiding seafood and letting sleeping dogs lie. Is best for your own safety, and is only for one day, so maybe little is being lost if customer follows advice?”</i>", parse);
                }, 1.0, function() { return true; });
                scenes.AddEnc(function() {
                    Text.Add("<i>“Asche is thinking that today Lady Luck is being smiling on you. If good customer is wanting to play games of chance, then is probably best to be doing it before midnight.</i>", parse);
                    Text.NL();
                    Text.Add("<i>“Of course, always to be warned that Lady Luck can get tired of carrying same person around for too long, so while to be taking advantage of good fortune, best not to be abusing it.”</i>", parse);
                }, 1.0, function() { return true; });
                scenes.AddEnc(function() {
                    Text.Add("<i>“Asche is remembering good saying: that is important to be learning from mistakes. This jackaless is hoping that customer will be remembering that.”</i>", parse);
                    Text.NL();
                    Text.Add("Well, it’s solid enough advice in general, but why bring that up in particular?", parse);
                    Text.NL();
                    Text.Add("<i>“Because Asche is thinking that customer will be having chance to be learning very much, very soon, in very short time.”</i> She flashes you a cheerful grin. <i>“To be wishing good luck upon customer.”</i>", parse);
                    Text.NL();
                    Text.Add("But… but shouldn’t she give you some sort of advice on how to deal with whatever’s coming up?", parse);
                    Text.NL();
                    Text.Add("Asche shrugs, the motion causing more than a little clinking on her part. <i>“What is customer wanting Asche to do? To be telling [himher] to be buying clothing or furniture in effort of ward off ill fortune? Customer must act accordingly and appropriately.”</i>", parse);
                }, 1.0, function() { return true; });
                scenes.AddEnc(function() {
                    Text.Add("The jackaless looks up from your palm and thinks a moment. <i>“Hmm. Asche is suggesting that customer is to be finding a peaceful place where [heshe] may be making plans for future.”</i>", parse);
                    Text.NL();
                    Text.Add("And… well, you’re curious. What if one doesn’t exist?", parse);
                    Text.NL();
                    Text.Add("<i>“Then customer is to be creating one,”</i> Asche replies matter-of-factly. <i>“Is being simple as that. Will be doing [himher] much good in the future, so is strong recommendation that customer be following Asche’s advice.”</i>", parse);
                }, 1.0, function() { return true; });
                /*
                scenes.AddEnc(function() {
                    Text.Add("", parse);
                    Text.NL();
                    Text.Add("", parse);
                }, 1.0, function() { return true; });
                */
                scenes.Get();
                Text.Flush();

                party.coin -= cost;
                rigard.MagicShop.totalBought += cost;

                AscheScenes.FortuneTellingPrompt();
            }, enabled : party.coin >= cost,
        });
        options.push({ nameStr : "Fate",
            tooltip : "So, you’re serious about asking Asche to read what the future has in store for you…",
            func() {
                Text.Clear();
                Text.Add("All trace of nonchalance drops from the jackaless’ face. Her eyes harden, her lips thin, and you notice that she’s begun fiddling with the hem of her shawl. <i>“So, you are being serious about this, then.”</i>", parse);
                Text.NL();
                Text.Add("If she can really tell you of your fate, then yes, you’d like to hear what she has to say; forewarned is forearmed, after all. You place your money on the counter, and watch as Asche sweeps the coins into her palm.", parse);
                Text.NL();
                Text.Add("<i>“Very well. Customer is to be holding out hand.”</i>", parse);
                Text.NL();
                Text.Add("You do as instructed, and Asche takes hold of your hand, tracing her fingers along the contours of your palm, exploring the ridges of your thumb and fingers. You half-wonder if she’s going to feel your knuckles as well, but thankfully she’s only interested in the top of your hand.", parse);
                Text.NL();
                Text.Add("As the jackaless chants softly under her breath, you sense a growing tension in the air, like static electricity gathering - and then it’s released in an instant, a popping sensation against your skin, just as she releases your hand and looks up at you.", parse);
                Text.NL();
                Text.Add("<i>“Asche is ready to be telling you what she is seeing in your fate.</i>", parse);
                Text.NL();

                const scenes = new EncounterTable();

                // Fate readings for first phase of game

                scenes.AddEnc(function() {
                    // Referencing Uru at portal opening.
                    Text.Add("<i>“Customer is to be wary; an old adversary is to be turning up soon. While customer is knowing that [heshe] will eventually have to confront this enemy, meeting will be far sooner than expected.</i>", parse);
                    Text.NL();
                    Text.Add("<i>“Asche is seeing that there is no escaping this fate, so customer must be finding way to deal with it and pass through unharmed. Maybe a safe path will be revealing itself.”</i>", parse);
                }, 1.0, function() { return true; });
                scenes.AddEnc(function() {
                    // If player rejected Kiai at the start.
                    Text.Add("<i>“Asche sees that one whom you rejected will be eventually returning to your side. Your destinies are intertwined like roots twisting about each other; more you try to tear apart, more they cleave back together. Rejecting this one has only made the inevitable stronger; there is not much customer can be doing to fight it, and maybe is better that way.”</i>", parse);
                }, 1.0, function() { return !party.InParty(kiakai, true); });
                scenes.AddEnc(function() {
                    // References Corruption, Malice and Lust.
                    Text.Add("<i>“Before customer’s quest is over, [heshe] will be meeting three foes who will be standing out against the many others that [heshe] will meet along [hisher] travels. Customer may already have heard of or even met them, although [heshe] will not know who they are. These three foes may be seeming to be disconnected at first, but they are being sharing common goal, and struggle against them will be no easy task. Asche suggests that you be steeling yourself for what is lying ahead.”</i>", parse);
                }, 1.0, function() { return true; });
                scenes.AddEnc(function() {
                    // References gemstead.
                    Text.Add("<i>“Customer must be careful about who [heshe] is making friends with,”</i> Asche says. <i>“Is more than just friendship. The more who are knowing of your cause, the more are gathering their energies to aid it; the way these energies are being manifesting will soon make themselves clear as customer proceeds towards [hisher] chosen fate. Of course, customer does not want to be making the wrong friends, trusting the wrong people…“</i>", parse);
                }, 1.0, function() { return true; });
                scenes.AddEnc(function() {
                    // Requires that PC has met Layla.
                    Text.Add("<i>“The creature that customer is being calling a chimaera…”</i> Asche looks strangely intent. <i>“Is old. Very, very old, but not in shape that customer now knows; body is old, but mind to be like that of a newborn. She is very pliable thing… Asche is hoping that you are making wise decisions in choosing to mold her.”</i>", parse);
                }, 1.0, function() { return party.InParty(layla, true); });
                scenes.AddEnc(function() {
                    // Requires that player have recruited Terry.
                    Text.Add("<i>“Perhaps may be coming time when you will not be needing collar around foxy companion’s neck, good customer,”</i> Asche says. <i>“May be some time off yet, but is still being possible… provided wise choices are being made. But where to be making wise choices… that is not clear to Asche. This jackaless is sorry, but the mists are being clouding your future, and seeing through them is hard.”</i>", parse);
                }, 1.0, function() { return party.InParty(terry, true); });
                scenes.AddEnc(function() {
                    Text.Add("<i>“Customer must be seeking out spirits.”</i>", parse);
                    Text.NL();
                    Text.Add("Huh?", parse);
                    Text.NL();
                    Text.Add("<i>“Customer is already being in possession of one spirit, is [heshe] not?”</i> Asche jabs a finger in the direction of your gem, as if she can see it directly in your pocket. <i>“This jackaless is sensing presence of such with customer; [heshe] has done well to gain such an ally, but more are being required.”</i>", parse);
                    Text.NL();
                    Text.Add("Can she give you an idea of how many more?", parse);
                    Text.NL();
                    Text.Add("<i>“All customer can be having. More the merrier, as saying goes; customer will be requiring everything that [heshe] can be bringing to bear.”</i>", parse);
                }, 1.0, function() { return glade.flags.Visit >= DryadGladeFlags.Visit.DefeatedOrchid; });
                scenes.AddEnc(function() {
                    Text.Add("<i>“Asche recognizes this place where customer is standing, is minotaur village in highlands. Barricades, they are being there, but are likely to be of not much use against foe customer faces, a fearsome man-beast. Behind each, two evenly matched forces.”</i> The jackaless scratches her muzzle. <i>“Asche will say that she is finding customer’s fate disturbing. Is not liking to think that old tribe may be caught up in strife, too.”</i>", parse);
                }, 1.0, function() { return true; });
                scenes.AddEnc(function() {
                    Text.Add("<i>“Asche is seeing customer wandering across endless hot sands, seeking something that [heshe] cannot see with the eye alone. Customer is to be speaking with two siblings on that plane, a brother and sister, a jeweller and tailor. They are being telling customer something of great importance.”</i>", parse);
                    Text.NL();
                    Text.Add("The desert?", parse);
                    Text.NL();
                    Text.Add("<i>“Not here. Not on Eden. This desert being different… a red hot forge inhabited by gargantuan metallic beasts… is very odd. Asche has never heard of this place.”</i>", parse);
                }, 1.0, function() { return true; });
                scenes.AddEnc(function() {
                    Text.Add("<i>“Asche is seeing customer walking amidst ruins belonging to a lost people of the sky. [HeShe] is being flying through clouds, walking on air, carried by wings of wind.”</i> The jackaless concentrates furiously. <i>“There is being a spirit, whispering, pleading. Customer is being piecing together memories belonging to ancient people of sky plane. [HeShe] is being requiring one of their number as companion to do so…”</i>", parse);
                }, 1.0, function() { return true; });
                /* TODO Jin
                scenes.AddEnc(function() {
                    Text.Add("", parse);
                    Text.NL();
                    Text.Add("", parse);
                }, 1.0, function() { return true; });

    #scene
    //References Jin.

    <i>“If in future you are being caught in magical trap and cat-morph is making bargain with you, Asche is strongly suggesting that customer be accepting deal.”</i>

    What? Why?

    <i>“Asche is not sure of the details…”</i> The jackaless concentrates furiously, her eyes aglow. <i>“But Asche is completely certain that if customer is not accepting, only other outcome is being a bad ending. Asche is thinking that customer is wanting to avoid that, yes?”</i>

    #converge
    */
                // SECOND PHASE
                if (GlobalScenes.PortalsOpen()) {
                    scenes.AddEnc(function() {
                        Text.Add("The jackaless throws you a suspicious glare. <i>“All muddy. Customer is messing things up! Things Asche saw before are still being there, still connected, but in different way… is confusing.”</i>", parse);
                        Text.NL();
                        Text.Add("That… sounds more like an accusation than a prediction.", parse);
                        Text.NL();
                        Text.Add("<i>“It is all being very strange,”</i> Asche shrugs. <i>“Foe is friend and friend is foe, the child is being the corruptor, the void is awaking. Customer is to be traveling back to journey forth.”</i> She gives your palm another affronted glance. <i>“Customer’s fate is all mixed like casserole, [heshe] is better being fixing it,”</i> she advises.", parse);
                    }, 1.0, function() { return true; });
                }
                /*
                *
    //TODO
    //Third phase

    //Fourth phase

                scenes.AddEnc(function() {
                    Text.Add("", parse);
                    Text.NL();
                    Text.Add("", parse);
                }, 1.0, function() { return true; });
                */
                scenes.Get();

                party.coin -= cost;
                rigard.MagicShop.totalBought += cost;

                Text.Flush();

                AscheScenes.FortuneTellingPrompt();
            }, enabled : party.coin >= cost,
        });
        options.push({ nameStr : "Explain",
            tooltip : "How does this fortune-telling of her work, anyway?",
            func() {
                Text.Clear();
                Text.Add("Eyeing Asche, you tell the jackaless you’d probably be interested in having your fortune told, but perhaps if you knew a little more about what you were getting yourself into, you could be more enthusiastic about the prospect…", parse);
                Text.NL();
                Text.Add("Asche smiles and holds out her hands palms skyward, the movement setting her jewelery clinking. <i>“Certainly. Asche has little to hide.</i>", parse);
                Text.NL();
                Text.Add("<i>“To be starting at beginning, there is belief amongst some clans in highlands that is possible to foretell future of person by seeing length and shape of fingers and palm lines. Each combination is having meaning and way it is impacting bearer’s life and can be used to paint hazy picture of what is to come.”</i>", parse);
                Text.NL();
                Text.Add("It does sound rather incredible, you have to admit. It seems as difficult to make sense of as reading the future in the entrails of birds and other such practices. Besides, with alchemy letting anyone change one’s body - and one presumes, hands - how is it that one’s fate can stay the same when one’s palm changes?", parse);
                Text.NL();
                Text.Add("<i>“It is what it is; not all things are being seen by eye alone.”</i> The jackaless shrugs. <i>“If you are doubting usefulness of fortune, then maybe you are not to be basing your decisions on it and just taking what Asche says for fun. Good money is being spent on more trivial entertainments.</i>", parse);
                Text.NL();
                Text.Add("<i>“That aside, Asche can tell customer [hisher] fate, or fortune. Latter is light and easy to do, maybe small prediction of what is going to be happening later when customer goes to bed, or whether customer is going to be lucky in love. Fate is…”</i> The jackaless grows more somber, her lips pulling into a thin, straight line. <i>“More important, for lack of better word to be describing it. Asche knows what she is saying just now, but fate is not so easily brushed off, is not something done for fun. If you are taking such things lightly or not believing what this jackaless is saying, please not to be asking Asche to read your fate.”</i>.", parse);
                Text.Flush();

                AscheScenes.FortuneTellingPrompt();
            }, enabled : true,
        });
        options.push({ nameStr : "Never Mind",
            tooltip : "Maybe another time.",
            func() {
                Text.Clear();
                Text.Add("<i>“As customer is wishing.”</i> Is that a hint of sourness you hear in her voice? <i>“Is there any other business that [heshe] has with Asche?”</i>", parse);
                Text.Flush();

                AscheScenes.Prompt();
            }, enabled : true,
        });

        Gui.SetButtonsFromList(options, false, null);
    }

    export function MagicBoxPrompt() {
        const player = GAME().player;
        const asche = GAME().asche;

        const parse: any = {
            coin : Text.NumToText(asche.MagicBoxCost()),
            heshe : player.mfFem("he", "she"),
            himher : player.mfFem("him", "her"),
        };

        // [Explanation][Grab][Back]
        const options = new Array();
        if (asche.flags.Talk & AscheFlags.Talk.Box) {
            options.push({ nameStr : "Grab",
                tooltip : "Stick your hand into limbo and see what you can draw out.",
                func() {
                    AscheScenes.MagicBoxGrab();
                }, enabled : GAME().party.coin >= asche.MagicBoxCost(),
            });
        }
        options.push({ nameStr : "Explanation",
            tooltip : "Just what is this box?",
            func() {
                Text.Clear();
                Text.Add("<i>“Idea is very simple,”</i> Asche begins, lazily drawing small circles on the counter with a finger. <i>“Box is old family heirloom, artifact with power to draw out lost things. Money behind couch cushions, things fallen beneath floorboards, blasted into limbo, that sort of thing, yes? For small price of [coin] coins, customer can stick hand into box and see what [heshe] can draw out. Is like… hmm… is like a game, yes? Or maybe like lottery. No guarantee that customer will find something useful, but there is also chance that customer will find a great steal. Only sure thing is that thing you draw out is not likely to harm you, and I am here to watch, so customer is perfectly safe.”</i>", parse);
                Text.NL();
                Text.Add("Sounds like a lot of fun.", parse);
                Text.NL();
                Text.Add("<i>“To be frank, box is Asche’s most popular part of shop, even if it does not directly bring in that much money. People come in to see what bin holds, end up buying things off shelves. Maybe good customer might want to try it out [himher]self?” The jackal-morph giggles. <i>“Perhaps fortune will be smiling today - as saying goes, does customer feel lucky? Well, does [heshe]?”</i>", parse);
                Text.Flush();

                asche.flags.Talk |= AscheFlags.Talk.Box;

                AscheScenes.MagicBoxPrompt();
            }, enabled : true,
        });
        Gui.SetButtonsFromList(options, true, function() {
            Text.Clear();
            Text.Add("Seeing you reconsider, Asche puts away the box back underneath the counter. <i>“Not feeling lucky today? Is all right, Asche understands. Is there anything this jackaless can be helping good customer with?”</i>", parse);
            Text.Flush();

            AscheScenes.Prompt();
        });
    }

    export function MagicBoxGrab() {
        const asche = GAME().asche;
        const rigard = GAME().rigard;

        const parse: any = {

        };

        const cost = asche.MagicBoxCost();

        GAME().party.coin -= cost;
        rigard.MagicShop.totalBought += cost;

        Text.Clear();
        Text.Add("You slide the coins across the counter to Asche, who nods and waves you on. Stepping up to the large wooden box, you stick your hand into the swirling darkness. It’s cool to the touch and there’s a vaguely sticky sensation as you waggle your fingers about, but you’re otherwise fine. Now to see what you can find…", parse);
        Text.NL();

        const scenes = new EncounterTable();
        scenes.AddEnc(AscheScenes.MagicBoxLoss, 1.0, function() { return true; });
        scenes.AddEnc(AscheScenes.MagicBoxWin, 1.0, function() { return true; });

        scenes.Get();
    }

    export function MagicBoxWin() {
        const player = GAME().player;
        const party: Party = GAME().party;
        const asche = GAME().asche;

        let parse: any = {
            himher : player.mfFem("him", "her"),
            heshe : player.mfFem("he", "she"),
        };

        const scenes = new EncounterTable();
        scenes.AddEnc(function() {
            Text.Add("Your hand closes around something distinctly bottle-shaped - pulling it out, you find that it is indeed a bottle. Inside, you find a potion, and though the bottle looks old and dusty, it should still be drinkable. You stow it away with your other belongings.", parse);
            Text.NL();

            const item = _.sample(MagicShopScenes.MShop().potions);

            party.Inv().AddItem(item);

            Text.Add("<b>Acquired [lDesc]!</b>", {lDesc : item.lDesc()});

            AscheScenes.MagicBoxRepeat();
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("Your hand closes about an irregularly-shaped object, and you draw the item out of the box. Seems like it’s one of Asche’s sundry supplies...", parse);
            Text.NL();
            Text.Add("<i>“Asche was wondering where that had gotten to!”</i> the jackaless exclaims. <i>“Books did not tally - must have lost it behind cupboard or something. But, is belonging to customer’s now, so please enjoy.”</i>", parse);
            Text.NL();
            Text.Add("It seems a little ironic that you could’ve bought her stock off the shelves instead of going to such trouble. Still, you guess that it could have been a worse deal, and stow away your new acquisition.", parse);
            Text.NL();

            const item = _.sample(MagicShopScenes.MShop().consumables);

            party.Inv().AddItem(item);

            Text.Add("<b>Acquired [lDesc]!</b>", {lDesc : item.lDesc()});

            AscheScenes.MagicBoxRepeat();
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("Feeling something smooth under your fingertips, you close in on the object and pull it out of the box’s indeterminate depths. It’s a small leather pouch, and you draw open the strings to reveal a handful of alchemical ingredients. Not the best value that your money could have brought you, but more reagents on hand are always welcome.", parse);
            Text.NL();
            Text.Add("Putting away the reagents and throwing the pouch back into the bin, you turn to other matters.<br>", parse);
            _.times(_.random(4, 10), function() {
                const item = _.sample(MagicShopScenes.MShop().ingredients);

                party.Inv().AddItem(item);

                Text.Add("<br><b>Acquired [lDesc]!</b>", {lDesc : item.lDesc()});
            });

            AscheScenes.MagicBoxRepeat();
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("You find your hand meeting some kind of stuffed toy, its soft form almost seeming to jump into your grasp as you pull the strange thing out of the swirling darkness. Looking at what you’ve found, you blink as you find that you’re holding a miniature version of yourself, the little plush doll appearing to be an exact replica of you as you are now, right down to the smallest detail. Eyeing the unusual doll carefully, it seems almost alive, which is strangely disconcerting in a way…", parse);
            Text.NL();
            Text.Add("You’re not the only one who has noticed your find. Asche is staring at you, the jackal-morph’s dark eyes wide with fear. <i>“Customer! To be giving Asche doll now! Before is too late!”</i>", parse);
            Text.NL();
            Text.Add("The urgency in her voice is plain, and you rush over and set the strange doll on the counter. Asche already has a silver dagger in her hand, and with one swift motion, she puts its edge to the doll’s neck, a brilliant nimbus surrounding the blade as she begins sawing away at its neck.", parse);
            Text.NL();
            Text.Add("The effects are immediate. The moment the dagger’s edge connects with the doll, it begins to struggle, an unearthly squeal sounding in the air as Asche slices away with grim determination. Greenish flames erupt from its stuffing, consuming the doll, but the nimbus protects Asche’s hands. Once the doll’s head is severed, cloth and stuffing rapidly decay into nothing save a handful of dust, which the jackaless carefully sweeps up with a dustpan and seals tightly in a jar.", parse);
            Text.NL();
            Text.Add("Shaken, you ask her what that was all about.", parse);
            Text.NL();
            Text.Add("<i>“Doll is a wicked, wicked thing made by practitioners of dark magic like big sister,”</i> Asche explains with a shudder. <i>“Follows owner around, helps out, makes itself useful. Too useful, until owner grows fat and lazy, then one day owner is waking to find they are doll and doll is them… after that, doll goes back to one who created it and does his or her bidding.</i>", parse);
            Text.NL();
            Text.Add("<i>“Is very dark, evil magic; many are made in many worlds. Asche will be more careful in the future, a thousand apologies to customer for placing [himher] in peril. Least Asche can do is return good customer’s money and hope [heshe] does not hold it against Asche.”</i>", parse);

            party.coin += asche.MagicBoxCost();

            asche.flags.Talk |= AscheFlags.Talk.BoxDoll;

            AscheScenes.MagicBoxRepeat();
        }, 1.0, function() { return !(asche.flags.Talk & AscheFlags.Talk.BoxDoll); });
        scenes.AddEnc(function() {
            Text.Add("You dig around for a bit in the darkness, not really finding anything to your liking, but eventually, your fingers close about something cold and slender, and you pull it out. It’s a thin glass vial of bluish liquid labeled “Lewton’s Concentrate”, but the potion is clearly old and stale; who knows what might have happened to it after sitting around for so long. Best to decide what to do with it while there’s trained help on hand - do you drink it?", parse);
            Text.Flush();

            // [Yes][No]
            const options = new Array();
            options.push({ nameStr : "Yes",
                tooltip : "What could go wrong?",
                func() {
                    Text.Clear();
                    Text.Add("Well, nothing for it! Down the hatch! You pull out the cork with a satisfying pop and pour the viscous liquid down your throat, feeling it settle in your stomach. Job done, you smack your lips and savor the aftertaste, vaguely reminiscent of cherries and cream as you wait for the elixir to do its job.", parse);
                    Text.NL();
                    Text.Add("Nothing happens for a few seconds, but then ", parse);

                    const scenes = new EncounterTable();
                    scenes.AddEnc(function() {
                        Text.Add("you feel a lot more calm and alert, your body cool and mind ready to focus. Hey, that wasn’t so bad, even if the potion was well past its use-by date. Handing the empty vial over the counter to Asche, you turn your refreshed mind to the matters at hand.", parse);

                        player.AddLustFraction(-1);
                        player.AddSPFraction(1);
                    }, 1.0, function() { return true; });
                    scenes.AddEnc(function() {
                        parse = player.ParserTags(parse);
                        parse.heat = player.FirstCock() ? "rut" : "heat";
                        Text.Add("heat flares up in your loins, rapidly spreading to the rest of your body as you’re wracked from head to toe in delicious, delicious arousal. Even your breath grows hot and heavy as you’re plunged straight into [heat], ", parse);
                        if (player.FirstCock()) {
                            Text.Add("your [cocks] tenting the fabric of your clothes, ", parse);
                        }
                        if (player.FirstVag()) {
                            Text.Add("your [vag] and netherlips growing wet and swollen, ", parse);
                        }
                        Text.Add("your skin flush with desire. There’s no way you’re going to be doing much of anything in this state…", parse);
                        Text.NL();
                        Text.Add("Watching you from the counter, Asche shakes her head and sighs. <i>“Silly customer, potions are having expiry dates for a reason, you know. Is true that Asche’s merchandise will not harm when properly used… but even the best of Asche’s potions cannot cure stupid. Maybe this will teach you lesson… either case, Asche requests that you do not relieve yourself in her shop. Cum is terrible thing to have to clean up - it is so… sticky.”</i>", parse);

                        player.AddLustFraction(1);
                        player.AddSPFraction(-1);
                    }, 1.0, function() { return true; });

                    scenes.Get();

                    AscheScenes.MagicBoxRepeat();
                }, enabled : true,
            });
            options.push({ nameStr : "No",
                tooltip : "Best not risk it.",
                func() {
                    Text.Clear();
                    Text.Add("Shaking your head, you pass the expired elixir to Asche, who slides it beneath the counter. <i>“Is good thing you decided not to drink. Potions which sit too long can cause problems, ingredients get old, properties are changing…”</i> The jackaless shrugs and smiles. <i>“Asche will dispose of it properly, rather than just pour it out on ground. Most irresponsible way of dealing with old potions, is it not? Sad to say, though, Asche cannot refund your money for use of box.”</i>", parse);
                    AscheScenes.MagicBoxRepeat();
                }, enabled : true,
            });
            Gui.SetButtonsFromList(options, false, null);
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("Pulling your arm out of the box, you find in your hand a rather thick novel, the cover art depicting a rather rugged and handsome jackal-morph caught in quite a suggestive position. A few moments spent flicking through its pages reveals that it’s a romance novel, the plot revolving around the jackal-morph, who swashbuckles his way through the hearts and beds of various women, with no small amount of highly descriptive ravishing on the side.", parse);
            Text.NL();
            Text.Add("A small cough from behind you draws your attention. <i>“Why, Asche is believing that book is one of a number from sister’s collection before she is losing the lot. Between customer and Asche, this jackaless is thinking that book is being quite trashy, much like rest of collection… even if nights can be long and lonely in shop, there is being better things to do than reading such things. Besides, Asche is much preferring less outright ravishing and finding more restrained power much more sexy.”</i>", parse);
            Text.NL();
            Text.Add("Oh, so <i>that’s</i> the kind of novel she likes, eh?", parse);
            Text.NL();
            Text.Add("The jackaless rolls her eyes. <i>“Not to be changing subject at hand, please. Customer can be doing with book as [heshe] pleases, Asche supposes. Certainly not going to be returning it to sister.”</i>", parse);
            Text.NL();
            Text.Add("You look between the book and the box. What do you do with the trashy novel in your hands?", parse);
            Text.Flush();

            // [Keep][Toss]
            const options = new Array();
            options.push({ nameStr : "Keep",
                tooltip : "It might be pulp fiction, but it’s still a read, right?",
                func() {
                    Text.Clear();
                    Text.Add("Books are books, wherever you find them. Asche coughs loudly when you elect to keep the salacious novel on you, but keeps any comments to herself as you pack it away. Maybe it’ll come in useful later on… or at the very least, keep you company on those cold, lonely nights.", parse);
                    party.Inv().AddItem(AccItems.TrashyNovel);

                    AscheScenes.MagicBoxRepeat();
                }, enabled : true,
            });
            options.push({ nameStr : "Toss",
                tooltip : "You don’t really need such a thing…",
                func() {
                    Text.Clear();
                    Text.Add("Shaking your head, you toss the novel back into the box. You certainly don’t need a piece of dead weight on you. The book plunges into the swirling depths of the box and vanishes without a trace. There’s already plenty of written pornography floating about - more of the same old trashy stuff isn’t going to do the world any favors, right?", parse);

                    AscheScenes.MagicBoxRepeat();
                }, enabled : true,
            });
            Gui.SetButtonsFromList(options, false, null);
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            if (party.Inv().QueryNum(CombatItems.GlassSword) >= 3) {
                Text.Add("Your hand closes about the familiar shape of a hilt, cool to the touch, and your heart skips a beat. However, the thing wrests itself from your grasp at the last moment with a savage twist, slipping back into the swirling darkness of the box.", parse);
                Text.NL();
                Text.Add("What? You stand there for a moment, cursing your luck, then remember that you already carry a number of glass swords with you at the moment. Perhaps they don’t like being cooped up together in one place - it might be best to get rid of one or two of them before trying to acquire another.", parse);
                Text.NL();
                Text.Add("Either way, you’re not going to be getting your payment back from Asche…", parse);
            } else {
                Text.Add("Is that the hilt of a sword you feel? It has the shape of one, but definitely doesn’t feel like leather or metal. Curious, you pull it out - at first glance, it seems like the hilt is fashioned from crystal, but on closer inspection it turns out to be glass, as does the blade when you eventually draw the rest of the weapon out from the box.", parse);
                Text.NL();
                Text.Add("Spirits above, the thing is <i>huge!</i> The blade itself is probably longer than the entirety of the box - how it managed to fit is anyone’s guess - and longer than you are tall, even though it doesn’t seem to weigh anything in your hand. The entirety of the blade is wrapped in a strange dark fabric, and you can practically <i>feel</i> the power emanating from this thing.", parse);
                Text.NL();
                Text.Add("Watching you from the counter, Asche whistles appreciatively. <i>“Glass sword is weapon of incredible power, fit for warrior like you; it is capable of inflicting terrible wounds with single stroke. Customer is to be using it wisely, for once it is striking anything, glass sword is shattering into a million pieces, dying with its only blow.”</i>", parse);
                Text.NL();
                Text.Add("You thank the jackaless for her advice and put the glass sword away carefully. It looks sturdy enough that a simple jostle probably won’t break it, but best not to take any chances.", parse);
                Text.NL();

                party.Inv().AddItem(CombatItems.GlassSword);

                Text.Add("<b>Acquired a glass sword!</b>", parse);
            }
            AscheScenes.MagicBoxRepeat();
        }, 0.5, function() { return true; });

        scenes.Get();
    }

    export function MagicBoxLoss() {
        const parse: any = {

        };

        const scenes = new EncounterTable();
        scenes.AddEnc(function() {
            Text.Add("Something stiff hooks itself around your wrist, and as you pull it out, you find that it’s a perfectly ordinary-looking umbrella. Certainly nothing magical about this - or so you think, up to the point where you open it and a light drizzle comes pouring out of its underside.", parse);
            Text.NL();
            Text.Add("You can see how a source of fresh water might be useful to, say, someone stranded in a desert, but the umbrella is utterly useless to you. Sighing, you toss it back into the box and consider your payment lost.", parse);
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("Your fingers meet a soft and fuzzy object, and feeling curious, you draw it out of the box. It’s a ball of yellow-orange fur tipped with a white tuft on one end, and you’re wondering just how something like that ended up in the box when the ball quivers in your hands.", parse);
            Text.NL();
            Text.Add("Was it just your imagination? Your question is answered when the fuzzy ball suddenly unfurls into a small fox. Utterly terrified, the little animal leaps from your hands and scampers for the door, disappearing into the streets outside.", parse);
            Text.NL();
            Text.Add("You give Asche a curious look; the jackal-morph replies by way of smiling at you and rolling her eyes. Guess you’re not getting your money back on that one.", parse);
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("Your fingers catch on something heavy, and you pull out the offending object, revealing an iron medallion. It’s clearly very, very old and the snarling wolf motif is masterfully done, but other than that it doesn’t look very magical or special in any way whatsoever.", parse);
            Text.NL();
            Text.Add("Sighing, you toss the medallion back into the box. What a waste - wait, did the wolf’s eyes just glow when it was in the air? Oh well, it’s too late to change your mind - the medallion is gone. Shrugging your shoulders, you write off this attempt as a loss.", parse);
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("Fumbling around in the chaos that is the box, you pull out something significantly heavy, a statue of some sort - why yes, it <i>is</i> a statuette, and a rather lewd one at that. Fashioned from ebony, it depicts an extremely busty naked woman, and there’s an inscription on the stand: “Mrs. Coffee”.", parse);
            Text.NL();
            Text.Add("If the statuette is meant to do anything, though, it doesn’t do it for you. No matter how you poke, prod and shake Mrs. Coffee, the ebony figurine remains as it is. Guess it must be broken or something - shaking your head, you toss it back into the box with a sigh.", parse);
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("Your hand closes around something cool and hard; drawing it out of the box, you discover that it’s a message in a bottle, still smelling of sea salt. The cork isn’t too hard to remove, and the message within is… perplexing. Sure, you can read the words just fine, but they make no sense: just what <i>is</i> a “dunka dunka”? From the fact that the note seems to be an invitation to one, it’s got to be some kind of event, but why would there be a secret word? And why the insistence that wizards can’t swim? Come to think of it, is that why this bottle ended up in the sea at one point?", parse);
            Text.NL();
            Text.Add("Shrugging, you replace the message in the bottle and toss it back into the box. Hopefully the message will get to its intended recipient…", parse);
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("Something small and hard brushes against your fingertips: grabbing hold of it, you draw it out of the box. It’s a plain golden ring, but unfortunately far too small to fit on any of your fingers. Though as it sits in your palm, you begin to doubt this last observation, as it appears larger than when you first looked.", parse);
            Text.NL();
            Text.Add("There’s something disturbing about it, something that turns the stomach by just looking at the simple gold. While you can’t quite explain the uneasy feeling the ring instills in you, you decide to trust your instincts, and hurriedly throw it back into the box where it vanishes into the dark depths.", parse);
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("Meeting your grasp is what feels like a stiff piece of card, and when you draw the object from the box -  why indeed, it’s a small card, perhaps just the right size to fit comfortably inside a breast pocket. Blank, save for the words <i>“get ye gone from gaol”</i> written on it in neat cursive, it definitely doesn’t look very magical.", parse);
            Text.NL();
            Text.Add("Well, what bad luck. You toss the card back into the box, and it flutters a bit before dipping back into the darkness and vanishing.", parse);
        }, 1.0, function() { return true; });
        scenes.AddEnc(function() {
            Text.Add("Your hand closes about something hard and heavy, and drawing it out of the box, you find that you’ve dug up a rather heavy tome of alchemical trivia. Flipping through the pages, you quickly learn that:", parse);
            Text.Add("<i><ul>", parse);
            Text.Add("<li>For the purpose of alchemy rooted in magic rather than simple herbal remedies, it is ideal that ginseng be reboiled in distilled water exactly forty times, thus reducing the root into a pungent-smelling syrup.</li>", parse);
            Text.Add("<li>Only less than one in ten thousand pearls are black, making them exceedingly expensive for use in alchemy.</li>", parse);
            Text.Add("<li>A good way to harvest mandrake root is to exhume the root while leaving the earth it is planted in intact; invert and bury the plant’s body in the hole you just created, then chop off the root. This procedure will allow the plant to regrow, while protecting you from its deadly shrieks.</li>", parse);
            Text.Add("<li>The creation of bloodfire, an alchemical component intended to produce explosive concoctions instead of edible potions, involves combining an equal amount of the alchemist’s blood with the base reagents. Doing so renders the reagents active for said alchemist only - if another attempts to use an explosive crafted with the component, it will remain inert.</li>", parse);
            Text.Add("</ul></i>", parse);
            Text.Add("Interesting trivia, but nonetheless rather useless. You toss the book back into the box, where it disappears into the dark depths.", parse);
        }, 1.0, function() { return true; });

        scenes.Get();

        AscheScenes.MagicBoxRepeat();
    }

    export function MagicBoxRepeat() {
        const party: Party = GAME().party;
        const asche = GAME().asche;

        const parse: any = {
            coin : Text.NumToText(asche.MagicBoxCost()),
        };

        Text.NL();
        Text.Add("Now, would you like to have another go at the bin, or have you had enough for now? The fee is [coin] coins.", parse);
        Text.Flush();

        // [Yes][No]
        const options = new Array();
        options.push({ nameStr : "Yes",
            tooltip : "Why not? Another go it is!",
            func() {
                AscheScenes.MagicBoxGrab();
            }, enabled : party.coin >= asche.MagicBoxCost(),
        });
        options.push({ nameStr : "No",
            tooltip : "Nah, not now.",
            func() {
                Text.Clear();
                Text.Add("Deciding that you’ve played enough, you gesture for Asche to put away the box. Lady Luck gets tired having to carry one particular person for too long, and you feel you’ve exhausted your share of good fortune for now. Maybe later.", parse);
                Text.Flush();

                AscheScenes.Prompt();
            }, enabled : true,
        });
        Gui.SetButtonsFromList(options, false, null);
    }
}
