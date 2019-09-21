import { Gender } from "../body/gender";
import { Encounter } from "../combat";
import { Bandit } from "../enemy/bandit";
import { Gwendy } from "../event/farm/gwendy";
import { GwendyFlags } from "../event/farm/gwendy-flags";
import { Miranda } from "../event/miranda";
import { MirandaFlags } from "../event/miranda-flags";
import { Player } from "../event/player";
import { GAME, MoveToLocation, TimeStep, WORLD } from "../GAME";
import { GameState, SetGameState } from "../gamestate";
import { Gui } from "../gui";
import { IChoice } from "../link";
import { Party } from "../party";
import { IParse, Text } from "../text";

let GwendyScenes: any;
export function InitMarket(gScenes: any) {
    GwendyScenes = gScenes;
}

export namespace MarketScenes {

    export function GoToMarketFirst(backfunc: any) {
        const player: Player = GAME().player;
        const party: Party = GAME().party;
        const gwendy: Gwendy = GAME().gwendy;

        const parse: IParse = {
            playername : player.name,
        };

        gwendy.flags.Market = GwendyFlags.Market.GoneToMarket;

        Text.Clear();
        Text.Add("Gwendy sighs, clearly she hoped to change your mind about visiting the city. <i>“Oh, all right. I suppose I need to make my run anyway, and having someone I trust tag along might even make this trip bearable,”</i> she smiles resigned. <i>“Alrighty then, we’re going today. I’ll need you to help me load my cart though. I hope you don’t mind some heavy lifting,”</i> she tells you.", parse);
        Text.NL();
        Text.Add("You promptly tell her that you just need to know what she wants done.", parse);
        Text.NL();
        Text.Add("<i>“My usual load is a mix of things - wool, milk, cheese, butter, fruits and vegetables. Can you start fetching me some of the prepared goods from the barn where they're stored?”</i> Gwendy asks you, instructing you to where the storage area is.", parse);
        Text.NL();
        Text.Add("You tell her that's fine, and promptly set off to start grabbing the things that she needs: boxes of fruits and veggies, gallon jugs of milk, bales of cleaned wool, wax-sealed cheeses, knobs of butter... Eventually, Gwendy's wagon is starting to groan under the weight of its load of produce, and your own shoulders are aching as well. It's quite a workout getting all this stuff together. You can only imagine the work it took to grow and prepare it.", parse);
        Text.NL();
        Text.Add("<i>“Looks like that’ll be all,”</i> the buxom farmer affirms, after a final check. <i>“Ready to go?”</i> she asks you with a smile.", parse);
        Text.NL();
        if (party.Num() > 1) {
            const p1 = party.Get(1);
            parse.comp  = party.Num() > 2 ? "your companions" : p1.name;
            parse.HeShe = party.Num() > 2 ? "they" : p1.HeShe();
            parse.notS  = party.Num() > 2 ? "" : "s";
            Text.Add("Before going, you instruct [comp] to take care of the farm while you two are away. [HeShe] nod[notS] in understanding and bid you a safe journey. You promise you’ll be back soon.", parse);
            Text.NL();
        }
        Text.Add("Hopping in on the front of the cart, you let her know that you are. Gwendy takes her place as the driver, flicks the reins, and the carthorse starts trotting off. You settle back and make yourself comfortable as the creaking of the wheels fills the air, adjusting yourself to the rocking motions of the cart as it trundles slowly but steadily along the trodden path leading out of the farm and toward the road leading to the big city.", parse);
        Text.NL();
        Text.Add("Time passes lazily as you sit back and let the carthorse do all the work for you. You probably could have made better time yourself, on foot, but given the amount of goods Gwendy is taking, that would have been far too impractical. It's far from unpleasant, however, as Gwendy proves a very lively traveling companion. The two of you chatter away about nothing in particular, and hardly notice the passing of time. Gwendy guides her horse with the near-instinctive ease of long practice, and evidently is a lot less distracted than you might have thought.", parse);
        Text.NL();
        Text.Add("As the road starts passing through a forested area, Gwendy grows noticeably tenser. Her easy dialogue dies away and she becomes much terser, prompting you to stop talking in response. She flicks urgently at the reins, softly urging the carthorse to go faster, causing the wagon to pick up its pace. Unable to bear the silence, you ask her what's wrong.", parse);
        Text.NL();
        Text.Add("<i>“I've heard a lot of stories about bandits preying on people traveling along these roads,”</i> Gwendy replies quickly, eyes scanning the forest around the two of you as she talks. <i>“Used to be that this road was a lot safer, but with the current trouble in Rigard you can never be too certain,”</i> she looks around. <i>“Unfortunately, there’s no way around this forest. While I'm not carrying a lot of money myself, the food we’re carting might be tempting.”</i>", parse);
        Text.NL();
        Text.Add("You stand ready, just in case. Off in the distance, you hear the sound of hooves, though they don’t see to be getting closer. Instead, they stop after some time.", parse);
        Text.NL();
        parse.wepDesc = player.WeaponDesc();
        Text.Add("<i>“You better be ready, [playername]. I think we’re walking straight into an ambush,”</i> she says, slowing down as she prepares for the worst. You grip your [wepDesc] tightly as you feel the tension building up.", parse);

        party.SaveActiveParty();
        party.ClearActiveParty();
        party.SwitchIn(player);
        party.AddMember(gwendy, true);

        gwendy.RestFull();

        party.location = WORLD().loc.Plains.Crossroads;
        TimeStep({hour: 2});
        Text.Flush();

        Gui.NextPrompt(() => {
            Text.Clear();
            Text.Add("When the attack comes, it’s swift and sudden. Four horses come crashing through the undergrowth, quickly surrounding your cart. The riders - three male and one female - are all wearing masks, and are armed with swords and cudgels.", parse);
            Text.NL();
            Text.Add("<i>“Woah, hang on there, girlie!”</i> their leader calls out, blocking the path with his steed. <i>“Don’t ya know there is a toll on this road?”</i>", parse);
            Text.NL();
            Text.Add("Gwendy is livid, and quickly reaches for a blade she has hidden under her seat. <i>“Knew this would be trouble,”</i> she mutters, trying to keep her eyes on all four assailants at once. <i>“Keep back, scum!”</i> she growls, brandishing the old sword.", parse);
            Text.NL();
            Text.Add("<i>“Drop the tough act, and the toothpick. Ya ain’t your father, girlie,”</i> the bandit laughs at Gwendy’s shocked expression. <i>“No soldiers to protect you now!”</i>", parse);
            Text.NL();
            Text.Add("<i>“What’s the toll?”</i> she asks, gritting her teeth.", parse);
            Text.NL();
            Text.Add("<i>“Your money, your maidenhood, or your life,”</i> the bandit leader replies. <i>“Though I suspect you have little of the first, and lost the second to some farm animal ages ago.”</i>", parse);
            Text.NL();
            Text.Add("<i>“Fuck you!”</i> Gwendy shouts as she springs from her seat, confronting the bandits. You stand beside her, ready for combat. Your assailants doesn’t seem to be experienced riders, as they choose to dismount to face you. The four highwaymen close in on you, blocking off any escape.", parse);
            Text.NL();
            Text.Add("<i>“You guys take care of that one, Gwendy is mine,”</i> the leader growls a short order, pulling his blade.", parse);
            Text.Flush();

            const enemy = new Party();
            enemy.AddMember(new Bandit(Gender.male));
            enemy.AddMember(new Bandit(Gender.male));
            enemy.AddMember(new Bandit(Gender.male));
            enemy.AddMember(new Bandit(Gender.female));
            const enc = new Encounter(enemy);

            enc.onVictory   = () => {
                SetGameState(GameState.Event, Gui);
                Text.Clear();
                Text.Add("You round up the defeated bandits, tying them up with some rope from the cart. They look surly, but not overly dismayed by their situation. Gwendy steps forward, taking charge of questioning them.", parse);
                Text.NL();
                Text.Add("<i>“How the fuck do you know my name, bastard?”</i> she demands, holding the leader of the bandits at swordpoint. <i>“Who are you people?”</i>", parse);
                Text.NL();
                Text.Add("<i>“Just the friendly neighborhood watch cleaning out the trash,”</i> he replies mockingly.", parse);
                Text.NL();
                Text.Add("<i>“Answer me, why did you attack us?”</i>", parse);
                Text.NL();
                Text.Add("<i>“What you gonna do, cut me down like some murderer? You don’t have it in you, girlie. I told you before, you are not your father.”</i> The bandit grunts, spitting on the ground.", parse);
                Text.NL();
                Text.Add("<i>“We’re just doing what we were paid to do,”</i> one of the others offer, eyeing you nervously.", parse);
                Text.NL();
                Text.Add("<i>“Who hired you, and why?”</i> Gwendy continues, unperturbed. Her blade pricks the bandit’s skin, drawing a tiny drop of blood.", parse);
                Text.NL();
                Text.Add("<i>“Haven’t figured that out yet?”</i> the leader sneers. <i>“’Sides, wouldn’t make any difference if I told ya. These aren’t people you can touch, little gutter rat.”</i> For that, he earns a swift kick in the side, dumping him to the ground wheezing.", parse);
                Text.NL();
                Text.Add("<i>“Get out of here, and stay away from me, my friends and my farm!”</i> Gwendy growls, a dangerous glint in her eyes. The bandits exchange glances, then run for it.", parse);
                Text.NL();
                Text.Add("<i>“Don’t think I could have suffered their company all the way to Rigard,”</i> the girl explains shortly, wiping off her sword.", parse);
                Text.Flush();

                gwendy.relation.IncreaseStat(100, 5);

                Gui.Callstack.push(() => {
                    MarketScenes.GoToMarketFirstAfterBandits(true);
                });

                Gui.NextPrompt(() => {
                    Encounter.prototype.onVictory.call(enc);
                });
            };
            enc.onLoss      = () => {
                SetGameState(GameState.Event, Gui);
                Text.Clear();
                Text.Add("The bandits have defeated you, despite of the fight you put up. The sole female pins you down, putting a dagger to your throat. The leader has sauntered over to Gwendy, who is kneeling on all fours, gritting her teeth in rage.", parse);
                Text.NL();
                Text.Add("<i>“Told you it’s no use resisting, girlie,”</i> the bandit guaffs, pushing down the farm girl’s head into the dirt with his boot. <i>“The fuck do you think you are doing out here anyway, Gwendy? Got bored with getting railed by horsecock all day?”</i>", parse);
                Text.NL();
                Text.Add("<i>“How the fuck do you know my name, bastard?”</i> Gwendy groans. <i>“Were you waiting for me?”</i>", parse);
                Text.NL();
                Text.Add("<i>“Mind your filthy mouth, slut.”</i> The bandit callously delivers a kick to her stomach, making the girl cry out in pain.", parse);
                Text.NL();
                Text.Add("<i>“Boss, let's not lose sight of why we are here,”</i> the woman holding you down calls. The bandit leader nods, waving to his companions. <i>“The cart.”</i>", parse);
                Text.NL();
                Text.Add("<i>“Stay away from that, you damn cocksuckers!”</i> Gwendy screams as the two remaining assailants stalk around to the back of the wagon, pulling out the contents and scattering them carelessly on the ground.", parse);
                Text.NL();
                Text.Add("<i>“Thanks for reminding me,”</i> the bandit leader grabs the farmer by her braid, dragging her to her feet. <i>“Let’s see who the real cocksucker is here.”</i> Saying that, he pulls out his stiffening dick, rubbing it on Gwendy’s freckled cheek.", parse);
                Text.NL();
                Text.Add("<i>“Like hell I wi-”</i> Gwendy’s angry response is cut of by a sharp slap.", parse);
                Text.NL();
                parse.hisher = player.mfFem("his", "her");
                Text.Add("<i>“Listen closely now,”</i> The bandit hisses. <i>“You are going to suck my cock until I cum. You are going to drink it all down. If I feel even a nibble of teeth, your friend gets [hisher] throat slit. Got it?”</i>", parse);
                Text.NL();
                Text.Add("The woman holding you down rolls her eyes. <i>“Can you stop thinking with your cock for one fucking second?”</i> She gestures to the other two, who are returning from the back of the cart. <i>“Our job here is done, let's get out of here.”</i>", parse);
                Text.NL();
                Text.Add("The leader throws her a curse, but reluctantly pulls his pants back up, joining his companions as they jump up on their horses.", parse);
                Text.NL();
                Text.Add("<i>“We’re coming for your farm next, girlie!”</i> He shouts over his shoulder as they ride off, leaving the two of you behind to recover. You stumble over to Gwendy, helping her to her feet. She is shaking, but with rage, not fear.", parse);
                Text.NL();
                Text.Add("<i>“You give that a fucking try, you assholes!”</i> she shouts after them.", parse);
                Text.NL();
                Text.Add("<i>“Shit!”</i> she groans, surveying the mess that is her cargo. The marauders did a rough job of it, but the sight of smashed and soiled vegetables and spilled milk is disheartening. You help her save what can be saved, working in silence beside the fuming farmer.", parse);
                Text.Flush();

                Gui.Callstack.push(() => {
                    MarketScenes.GoToMarketFirstAfterBandits(false);
                });

                Gui.NextPrompt(() => {
                    Encounter.prototype.onLoss.call(enc);
                });
            };
            enc.canRun      = false;

            enc.Start();
        });
    }

    export function GoToMarketFirstAfterBandits(won: boolean) {
        const player: Player = GAME().player;
        const party: Party = GAME().party;
        const rigard = GAME().rigard;
        const miranda: Miranda = GAME().miranda;

        const parse: IParse = {
            playername : player.name,
        };

        party.location = WORLD().loc.Plains.Gate;

        Text.Clear();
        Text.Add("You ask her if you should head back to the farm, in light of what happened.", parse);
        Text.NL();
        Text.Add("<i>“No, I’m not going to give them that,”</i> she says tersely. <i>“I’m taking this damn haul to market, and I’m gonna sell it.”</i> You ask her if she know who they were, they seemed to know her.", parse);
        Text.NL();
        Text.Add("<i>“I don’t know them specifically,”</i> she explains, <i>“but I suspect who they are working for. If it is who I think it is, this is just another strike for the record. This guy has a huge grudge against my father for some reason, and since Dad is dead he wants to take it out on me and my farm instead.”</i>", parse);
        Text.NL();
        Text.Add("You’ve gotten the cart in order again, and set out for Rigard. As you ride, you try to cheer her up and take her mind off the assault. After a while, she starts to loosen up, even cracking a smile now and then at your jokes.", parse);
        Text.NL();
        Text.Add("<i>“Thanks for your company, [playername],”</i> she simply says.", parse);
        Text.NL();
        Text.Add("Finally coming to the capital’s main gates, the two of you are halted by a pair of bored-looking guards leaning on their halberds as they wait for visitors. They speak with a flat and dull voice, greeting you in an unenthusiastic manner, as they ask for your papers.", parse);
        Text.NL();
        if (rigard.Visa()) {
            Text.Add("Both you and Gwendy pull the papers out and let the guards inspect them. They hand them back with lackluster approval, but let you in nonetheless.", parse);
        } else {
            Text.Add("Gwendy holds her papers out for the guards, which they approve rather quickly. When they ask you for yours, Gwendy explains to them that you’re a farm hand that came to accompany her for her business today. ", parse);
            Text.NL();
            Text.Add("She also tells them you’ll get a visa as soon as you have finished in the market district, which seems to work as the guards shrug their shoulders and let you pass. You murmur a thank you, but she waves it off.", parse);
            Text.NL();
            Text.Add("<i>“I already told you, I’ll cover for you. You’re just going to have to pay me back is all.”</i> That last part makes you feel a bit nervous, but what’s done is done.", parse);
        }

        if (!party.InParty(miranda)) {
            Text.NL();
            Text.Add("<i>“Hold a minute,”</i> a familiar voice calls out behind you. Gwendy freezes up as Miranda the guardswoman approaches, her look turning from rebellious to incredulous when the dog-morph ignores her and walks up to you. <i>“Thought I recognized you, luv,”</i> she grins up at you.", parse);
            Text.NL();
            if (miranda.flags.Met >= MirandaFlags.Met.TavernAftermath) {
                Text.Add("<i>“Why, [playername], back for more already?”</i> the guardswoman jests. <i>“You know where to find me - I’ve got a special gift waiting, just for you.”</i> The last proposal is delivered with a sultry wink, the faint bulge beneath her tight leather armor giving you an idea about just what kind of gift she is alluding to. She briefly inspects Gwendy, summarily dismissing her. <i>“Don’t bother bringing the hussy tho. Not my type.”</i>", parse);
            } else {
                Text.Add("<i>“I see you took my advice and scoured the farms for someone to help you in, [playername],”</i> Miranda nods, giving Gwendy a brief glance. <i>“Didn’t know you had a thing for blonde bimbos.”</i>", parse);
            }
            Text.NL();
            Text.Add("<i>“P-pardon me?!”</i> Gwendy splutters, more surprised than angry at first. <i>“Just who the hell do you think you are, bitch?”</i> Miranda’s eyes narrow, slightly taken aback by the vehement response.", parse);
            Text.NL();
            Text.Add("<i>“I’m the law, that’s who I am,”</i> she growls, showing her teeth to the farmer. <i>“And you’ll behave while you are in my city, or you’ll regret it.”</i> The guardswoman looks back to you one last time before returning to her post. <i>“Come by The Maidens’ Bane when you are tired of blondie, I’ll show you a good time.”</i> With that, Miranda saunters off, leaving you with the fuming farm girl.", parse);
            Text.NL();
            Text.Add("<i>“[playername], how come you know that bitch?”</i> Gwendy inquiries intently, her fists balled up tightly as she steers the cart into town. You try to keep your response rather vague so as not to upset her further, but she doesn’t look like she is very mollified by your evasive answers. The farmer manages to coax a name from you at the very least.", parse);
            Text.NL();
            Text.Add("<i>“Miranda, huh,”</i> she glowers. <i>“Yet another reason to dislike this stupid city.”</i>", parse);
            Text.NL();
            Text.Add("...Looks like hate at first sight. Better not stand between these two if they ever clash again.", parse);
        }
        TimeStep({minute: 30});
        Text.Flush();

        Gui.NextPrompt(() => {
            Text.Clear();
            parse.bumpkin = rigard.Access() ? ", looking around left and right in wonder at the sheer size of the city and the variety of its inhabitants" : "";
            Text.Add("You make your way inside the capital without further incident[bumpkin]. Gwendy takes a left, heading down a broad, bustling road, slowly weaving her way past the crowds. Eventually, the two of you reach the market district. The houses here look richer than the ones near the gates, and there is a greater number of shops and restaurants. The closer to the market you get, the more street vendors you see lining the sides of the road.", parse);
            Text.NL();
            Text.Add("Your cart pulls into a large square, packed with merchant stalls and bustling with activity. Gwendy skillfully navigates the masses and pulls into an empty lot, hopping down and gesturing you to join her at the back.", parse);
            Text.NL();
            if (won) {
                Text.Add("<i>“Those bandits cost us some precious time,”</i> the farm girl tells you, instructing you to unload the wares and place them in front of the cart. <i>“We’ll just have to make up for it in presentation. I intend to leave here with my pockets filled and my baskets empty.”</i>", parse);
            } else {
                Text.Add("<i>“Well, this sucks,”</i> Gwendy sighs, surveying the wares still left. <i>“This is going to take a whole lot of convincing to get rid of, and even if we manage to sell it all, we’ll still leave with light pockets. Let’s just make the best we can of the situation.”</i>", parse);
            }
            Text.NL();

            const haul = {
                quantity : 1,
                quality  : 0.5,
                badenc   : "bandits",
                enclost  : !won,
            };

            MarketScenes.Market(haul, MarketScenes.GoToMarketFirstFinale);
        });
    }

    /*
    * parameters:
    * haul : {
    *  quantity
    *  quality
    *  badenc
    *  enclost
    * }
    */
    export function Market(haul: any, next: CallableFunction) {
        const player: Player = GAME().player;
        const party: Party = GAME().party;
        const gwendy: Gwendy = GAME().gwendy;
        const farm = GAME().farm;

        const parse: IParse = {
            playername : player.name,
            enemy      : haul.badenc,
            ear() { return player.EarDesc(); },
        };

        const humanity = player.Humanity();

        party.location = WORLD().loc.Rigard.ShopStreet.Street;
        let score = 0;

        Text.Add("<i>“Alright, [playername]. Put on your best smile and let’s get this gig started,”</i> Gwendy declares with a smile of her own. ", parse);
        if (haul.badenc) {
            Text.Add("Despite the earlier events of the day, Gwendy is just as enthusiastic as she’d be in any other day. ", parse);
        }
        Text.Add("Encouraged by her cheerful attitude, you join her in shouting to get the attention of the masses.", parse);
        Text.NL();

        const chacheck = player.Cha() + (20 * humanity) + Math.random() * 20;
        if (chacheck < 40) {
            Text.Add("Unfortunately, your best efforts aren't good enough. Your statements lack any conviction, your presentation is awful, and you frankly insult more than one person, which only furthers their reluctance to approach the cart and start dealing with you.", parse);
            if (humanity < 0.95) {
                Text.Add(" It doesn't help matters that you see humans casting blatantly disdainful looks at your inhuman features.", parse);
            }
        } else if (chacheck < 70) {
            Text.Add("You don't do too badly. You make some efforts at presentation, assuring those who are passing by of the good quality of your wares, keeping a polite tone and drawing a small, steady stream of customers to check out your wares.", parse);
            if (humanity < 0.95) {
                Text.Add(" Though a lot of the more uppity customers cast suspicious looks at your inhuman features, a small number of them still decide to approach you, no matter their personal prejudices.", parse);
            }
            score += 1;
        } else if (chacheck < 100) {
            Text.Add("Your efforts are very effective, if you do say so yourself. With a stream of witty dialogue and well-aimed compliments, back by elaborate assurances of the quality and bargain prices of your wares, you have a steady flow of customers coming to check you out.", parse);
            if (humanity < 0.95) {
                Text.Add(" Your inhuman features do attract some discriminating stares, there's no denying that. But so eloquent is your presentation that far more eventually swallow their prejudice and approach then staunchly refuse to have any dealings with you.", parse);
            }

            score += 2;
        } else {
            Text.Add("You were born to be a salesman. People actually switch over from Gwendy's line to instead talk to you, so attractive is your presentation. You keep up a steady stream of compliments, wits and charm, offer assurances and well-aimed ‘free samples’, and otherwise have the crowd eating out of your hand.", parse);
            if (humanity < 0.95) {
                Text.Add(" Even the prejudice against non-humans doesn't keep your customers away, your charms so extensive that everyone swallows their pride to see what you have to offer.", parse);
            }
            score += 3;
        }
        Text.NL();

        const intcheck = player.Int() + (20 * humanity) + Math.random() * 20;

        if (intcheck < 40) {
            Text.Add("You find yourself struggling to handle yourself in the resulting haggling sessions. In the end, you're lucky to make even, never mind making a profit! You can't bring yourself to look at Gwendy, but you can feel her disappointment all the same.", parse);
            if (humanity < 0.95) {
                Text.Add(" You hear more than a few prejudiced customers snickering to themselves about ‘stupid morphs’, further confirming your suspicions that you were duped out of receiving fair price for your wares.", parse);
            }
        } else if (intcheck < 70) {
            Text.Add("Try as your customers might, you are no fool, and you find yourself making a nice little profit on the side in exchange for your wares. A glimpse out of the corner of your eye reveals Gwendy giving you a casual nod of approval for your efforts.", parse);
            if (humanity < 0.95) {
                Text.Add(" You can hear grumbles about losing their cash to a morph from some of the more prejudiced customers, as well as the occasional gloating when such an individual gets the better of you.", parse);
            }
            score += 1;
        } else if (intcheck < 100) {
            Text.Add("Your expertise at spotting a bargain or a bartering tell means you are able to outwit most of your customers and ensure they end up paying the price you ask, or close to it, at least. A very tidy profit is the end result of your sales. Whenever you glance in Gwendy's direction, she's smiling happily at the results of your sales pitching.", parse);
            if (humanity < 0.95) {
                Text.Add(" The grumblings of angry bigots echo in your [ear]s as you repeatedly best them.", parse);
            }
            score += 2;
        } else {
            Text.Add("You pounce on every tell, gauge every reaction to the prices you're asking, and always walk away from a deal with a hefty profit. On the fly, you make up fictitious promotions and flash sales, maximizing your profits whilst at the same time keeping your customers from getting too disgruntled. It's amazing how many people walk away happily, thinking they have a bargain, when in reality you're the one who's got the better deal. Gwendy herself watches you out of the corner of her eye, amazed at how well you're doing - better than she is, even.", parse);
            if (humanity < 0.95) {
                Text.Add(" Though there's still some grumbling from the bigots about your success, the promotions and sales you offer keep feathers smoothed so successfully that nobody really objects to you, no matter how prejudiced.", parse);
            }
            score += 3;
        }
        Text.NL();
        Text.Add("Eventually, your goods are all sold off and it's time for Gwendy to close her stall and call it a day. You help her with the final cleanup, and then join her in counting out the day's profits.", parse);
        if (haul.enclost) {
            Text.Add(" No matter how good your efforts, you can only do so well with the tattered remains of the original haul. Once again, you curse the [enemy] for ruining your chances of success.", parse);
            score /= 2;
        }
        Text.NL();
        if (score < 1) {
            Text.Add("It's obvious from a casual glance that there's not a lot of money here. Gwendy looks at the paltry sum you’ve made and sighs. <i>“Well, I suppose it could’ve been worse. At least we got enough to pay for replacements.”</i> She pockets the coins, handing you a few. <i>“Here’s your cut, thanks for the help,”</i> she says patting you on the shoulder.", parse);
            Text.NL();
            Text.Add("You can’t shake the feeling that you’ve let her down though...", parse);
        } else if (score < 3) {
            Text.Add("The sum of cash the two of you eventually count out is quite a decent one. Gwendy looks pleased with the outcome. <i>“Not bad!”</i> she declares happily. <i>“We can buy replacements and even made some profit. Thanks a lot of the help, [playername],”</i> she says, counting a few coins and handing them over. <i>“Here’s your cut,”</i> she says, smiling.", parse);
            Text.NL();
            Text.Add("You accept the offered coins while she pockets the rest.", parse);
        } else if (score < 5) {
            Text.Add("It doesn't take you long to realize you've more than achieved a basic profit from today's dealings. Gwendy smiles happily. <i>“Now this is what I call a successful run, [playername],”</i> she declares, procuring a bag to stash all the gold. <i>“And it was all thanks to you!”</i> she adds.", parse);
            Text.NL();
            Text.Add("You thank her for her kind words, accepting the praise with your usual modesty.", parse);
            Text.NL();
            Text.Add("She stacks the gold neatly in a few piles, separating a couple and pushing it toward you. <i>“Your cut, partner!”</i> she grins, bagging the rest.", parse);
            Text.NL();
            Text.Add("You accept the coins from her graciously, adding them to your purse. A very nice sum indeed.", parse);
        } else {
            Text.Add("The day's profits are staggering; the two of you made more money than Gwendy could in three regular runs by herself.", parse);
            Text.NL();
            Text.Add("<i>“Wow… Someone’s got quite the silver tongue, pulling all those customers to our stall,”</i> Gwendy remarks sidling up to gently bump your hips with the side of hers. Your body rocks slightly at the impact, and you twist around to look her in the eyes, smiling in pride as you do so.", parse);
            Text.NL();
            Text.Add("<i>“I think this calls for a celebration,”</i> she says, tracing a finger around your collarbone. Before you can formulate a reply, she pulls you into a deep kiss, tongue pushing and twisting against your own.", parse);
            Text.NL();
            if (player.SubDom() - gwendy.SubDom() > 0) {
                Text.Add("You waste no time in hungrily pulling her to you, rapaciously consuming her lips in return even as your tongue wrestles hers into submission.", parse);
            } else {
                Text.Add("Eagerly, you surrender yourself to her, allowing her to molest your mouth with her tongue, moaning softly in pleasure at her ministrations.", parse);
            }
            Text.Add(" Breaking the kiss, she giggles.", parse);
            Text.NL();
            Text.Add("<i>“Good to see that silvery tongue of yours isn’t just good for talking,”</i> she bats her eyes flirtatiously. <i>“But let’s save the celebration for later; right now, help me bag all this gold. You can keep that mound as your cut.”</i> She points to a nearby pile of gold. <i>“I’m really glad you came along, [playername].”</i>", parse);
            Text.NL();
            Text.Add("The pleasure is all yours, you reply, already taking your indicated share.", parse);
        }
        Text.NL();
        Text.Add("With the day's wages counted out and divvied up, you both turn your attention to gathering up your various sundries. After Gwendy makes whatever purchases she needs to for herself, and you share a light meal from another one of the stalls, the two of you hitch up the cart to the horse again and start driving slowly back to Gwendy's farm.", parse);
        Text.NL();

        // Translate score into coins
        haul.quantity = haul.quantity || 0;
        haul.quality  = haul.quality || 0;
        let produce = haul.quantity * haul.quality;
        if (haul.enclost) {
            produce *= (1 - (Math.random() * 0.5));
        }
        const total = Math.floor(produce * (1 + score) * 5000);
        const coin  = Math.floor(Math.min(total * 0.1, 300));
        const gcoin = Math.floor(total - coin);

        parse.gcoin = gcoin.toString();
        parse.coin  = coin.toString();

        Text.Add("<b>Gwendy gains [gcoin] coins for the farm!</b>", parse);
        Text.NL();
        Text.Add("<b>You receive [coin] coins!</b>", parse);
        Text.Flush();

        farm.coin  += gcoin;
        party.coin += coin;

        TimeStep({hour: 4});

        Gui.NextPrompt(next);
    }

    export function GoToMarketFirstFinale() {
        const player: Player = GAME().player;
        const party: Party = GAME().party;
        const gwendy: Gwendy = GAME().gwendy;
        const rigard = GAME().rigard;

        const parse: IParse = {
            playername : player.name,
        };

        Text.Clear();
        if (!rigard.Visa()) {
            Text.Add("<i>“Oh, right, I promised I would get you a pass!”</i> Gwendy says, hopping off the cart and waving for you to follow her. <i>“This town has a thing for bureaucracy, and if you want to enter - not that I know why you would - you have to have the proper papers.”</i>", parse);
            Text.NL();
            Text.Add("She leads you to a booth on the outskirts of the merchant’s district, manned by a fussy administrator. Gwendy helps you fill out the necessary paperwork, signing the application and showing her own visa in order to vouch for you. The official takes his time looking through the documents, eventually accepting them and writing out your visa.", parse);
            Text.NL();
            Text.Add("<b>Acquired citizen’s visa!</b>", parse);
            Text.NL();
            Text.Add("<i>“With this, you can enter and exit the city on your own any time you want,”</i> Gwendy explains. <i>“Given the gates are open, that is.”</i> The two of you make your way back to the empty cart, and prepare to leave.", parse);
            Text.NL();

            rigard.flags.Visa = 1;

            TimeStep({minute: 30});
        }
        Text.Add("The trip back is considerably less eventful than the morning was. The two of you are on your toes, especially when passing through the forested area, but there are no bandits in sight. You both let out a sigh of relief as you leave it behind you, continuing over the flat plains toward the farm.", parse);
        Text.NL();
        Text.Add("A significant amount of time later, you finally roll into the yard in front of Gwendy’s derelict barn. You help her stash the cart and care for the horse, before both of you collapse on a stack of hay, exhausted after the long day.", parse);
        Text.NL();
        Text.Add("<i>“Thanks a lot for the help, [playername],”</i> Gwendy yawns, stretching. <i>“For a lot of things. Who knows what would have happened if you weren’t there...”</i> The farm girl suddenly looks very vulnerable, reminding you of her young age.", parse);
        Text.NL();
        Text.Add("<i>“I… I need to think a bit,”</i> Gwendy muses as she looks up at the sky. <i>“This place could use some better security, perhaps a guard dog or something. I just feel that sleeping alone is going to be difficult for a while, with those sorts hanging around...”</i> she trails off, the invitation clear.", parse);
        Text.Flush();

        party.LoadActiveParty();
        party.location = WORLD().loc.Farm.Fields;
        TimeStep({hour: 2});

        gwendy.relation.IncreaseStat(100, 5);

        // [Sleep][Decline]
        const options: IChoice[] = [];
        options.push({ nameStr : "Sleep",
            func() {
                Text.Clear();
                Text.Add("<i>“Thanks,”</i> she whispers, giving you a peck on the cheek. You follow closely behind the beautiful farmer, climbing up the ladder to the loft. You have quite the nice view as you make your way up, Gwendy’s well-shaped ass wiggling invitingly just above you. There is an awkward silence as you reach the ledge. The farm girl eyes the bed suggestively.", parse);
                Text.NL();
                Text.Add("<i>“Well, we could just get some sleep. Or...”</i>", parse);
                Text.Flush();

                party.location = WORLD().loc.Farm.Loft;

                GwendyScenes.LoftSexPrompt();
            }, enabled : true,
            tooltip : "Join her in the loft.",
        });
        options.push({ nameStr : "Decline",
            func() {
                Text.Clear();
                Text.Add("<i>“It’s alright, I understand,”</i> Gwendy says, though she looks a bit lonely. <i>“See you around, I suppose?”</i> You nod, promising you’ll return later.", parse);
                if (party.Num() > 1) {
                    Text.NL();
                    const p1 = party.Get(1);
                    parse.comp = party.Num() > 2 ? "your companions" : p1.name;
                    parse.himher = party.Num() > 2 ? "them" : p1.himher();
                    Text.Add("You call for [comp], telling [himher] that it is time for you to leave. As you walk, you explain the events of the day to [himher].", parse);
                }
                Text.Flush();

                MoveToLocation(WORLD().loc.Plains.Crossroads, {minute: 30});
            }, enabled : true,
            tooltip : "Thank her for the offer, but you have other things to do.",
        });
        Gui.SetButtonsFromList(options);
    }
}
