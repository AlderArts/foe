import { GetDEBUG } from "../../../app";
import { Alchemy } from "../../alchemy";
import { GAME, GameCache, TimeStep } from "../../GAME";
import { Gui } from "../../gui";
import { AlchemySpecial } from "../../items/alchemyspecial";
import { Party } from "../../party";
import { Text } from "../../text";
import { TFItem } from "../../tf";
import { GlobalScenes } from "../global";
import { RosalinFlags } from "../nomads/rosalin-flags";
import { TerryFlags } from "../terry-flags";
import { GolemFlags } from "./golem-flags";
import { Jeanne } from "./jeanne";

export namespace JeanneScenes {
    let TerryScenes: any;
    export function INIT(terryScenes: any) {
        TerryScenes = terryScenes;
    }

    let talkedGolem  = false;
    let talkedJeanne = false;
    let talkedGem    = false;

    // Interaction
    export function Interact() {
        const jeanne = GAME().jeanne;

        const parse: any = {};
        Text.Clear();
        Text.Add("Jeanne greets you as you approach her, politely inquiring what’s on your mind. The gorgeous elven magician flicks her long, pink hair over her shoulder, smiling seductively.", parse);
        Text.NL();
        Text.Add("She is of average height, but quite curvaceous, her wide hips and very generous breasts further accentuating her beautiful female form. The elf is dressed in a tight-fitting silken robe which rustles slightly every time she moves.", parse);

        if (GetDEBUG()) {
            Text.NL();
            Text.Add("DEBUG: relation: " + jeanne.relation.Get(), null, "bold");
            Text.NL();
            Text.Add("DEBUG: subDom: " + jeanne.subDom.Get(), null, "bold");
            Text.NL();
            Text.Add("DEBUG: slut: " + jeanne.slut.Get(), null, "bold");
            Text.NL();
        }

        Text.Flush();
        JeanneScenes.InteractPrompt();
    }

    export function InteractPrompt() {
        const player = GAME().player;
        const jeanne = GAME().jeanne;
        const terry = GAME().terry;
        const party: Party = GAME().party;

        const parse: any = {};
        // [Talk][Golem][Sex]
        const options = new Array();
        options.push({ nameStr : "Talk",
            func : JeanneScenes.Talk, enabled : true,
            tooltip : "Seek the magician's advice.",
        });
        options.push({ nameStr : "Alchemy",
            func() {
                Text.Clear();
                Text.Add("<i>“Certainly,”</i> Jeanne replies. <i>“Understand that I cannot sell you much, but if you bring me the right ingredients, perhaps I can help you.”</i> She frowns slightly. <i>“Just know there are certain recipes I will not make for you.”</i>", parse);
                if (player.alchemyLevel > 0) {
                    Text.NL();
                    Text.Add("You’ll be sure to take notes so you can replicate the procedure later.", parse);
                }
                Text.NL();

                Alchemy.Prompt(jeanne, party.inventory, JeanneScenes.AlchemyBack, JeanneScenes.AlchemyCallback, true);
            }, enabled : true,
            tooltip : "Ask to make use of Jeanne’s services as an alchemist.",
        });
        if (party.InParty(terry) && (terry.flags.TF & TerryFlags.TF.Jeanne)) {
            options.push({ nameStr : "Terry TF",
                func() {
                    Text.Clear();
                    Text.Add("<i>“Sure, what would you like me to prepare?”</i>", parse);
                    Text.Flush();
                    TerryScenes.JeanneTFPrompt();
                }, enabled : true,
                tooltip : "Ask Jeanne to help you make some transformatives for Terry.",
            });
        }
        /*
        options.push({ nameStr : "Nah",
            func : () => {
                Text.Clear();
                Text.Add("", parse);
                Text.NL();
                Text.Flush();
            }, enabled : true,
            tooltip : ""
        });
        */
        Gui.SetButtonsFromList(options, true);
    }

    export function AlchemyCallback(item: TFItem) {
        const player = GAME().player;
        const jeanne = GAME().jeanne;
        const party: Party = GAME().party;

        const parse: any = {};

        Text.Clear();
        if (item === AlchemySpecial.AnusolPlus) {
            Text.Add("<i>“Just wait for a bit and I will have your potion ready,”</i> she says, walking off towards her alchemical supplies.", parse);
            Text.NL();
            Text.Add("True to her word, it only takes a few moments for her to finish preparing the mixture. It’s a clear blue liquid, thick and slimy, but with a fragrant scent. The bottle she presents you with is clearly labeled ‘Anusol+’.", parse);
            Text.NL();
            Text.Add("You thank Jeanne and pocket the bottle.", parse);
        } else {
            Text.Add("<i>“Here you go,”</i> Jeanne tells you as she hands over the finished potion. <i>“Just be wary of the effects it may have on you. Anything else?”</i>", parse);
        }
        Text.NL();

        player.AddAlchemy(item);

        party.Inv().AddItem(item);

        Alchemy.Prompt(jeanne, party.inventory, JeanneScenes.AlchemyBack, JeanneScenes.AlchemyCallback, true);
    }

    export function AlchemyBack() {
        const parse: any = {};

        Text.Clear();
        Text.Add("<i>“Do come back if there is anything else I can help you with.”</i>", parse);
        Text.Flush();

        JeanneScenes.InteractPrompt();
    }

    export function Talk() {
        const player = GAME().player;
        const terry = GAME().terry;
        const rosalin = GAME().rosalin;
        const jeanne = GAME().jeanne;
        const party: Party = GAME().party;

        const parse: any = {
            playername : player.name,
        };

        // [Gem][Magic][Alchemy][Elves][Jeanne][Golem][Rosalin][Terry]
        const options = new Array();
        options.push({ nameStr : "Gem",
            func() {
                Text.Clear();
                Text.Add("<i>“Alliser’s gem is a prize fit for kings,”</i> Jeanne explains. <i>“Its true powers are only revealed through its magic, though, and now that you have bonded yourself to it, only you can access this.”</i>", parse);
                Text.NL();
                Text.Add("<i>“Never give the gem to someone else, not even someone you trust, as it could potentially be used to harm you. The stronger the gem becomes, the stronger this connection will be.”</i>", parse);
                Text.NL();

                if (GlobalScenes.PortalsOpen()) {
                    Text.Add("<i>“After what happened, I can understand if you do not want anything to do with these portals any longer, but it is vital that we are able to find out what caused the portals to disappear in the first place. Lately, I have felt it growing stronger...”</i>", parse);
                } else if (player.summons.length > 0) {
                    Text.Add("<i>“With the help of the spirit of the forest, the stone should have enough power to allow us to open a portal. Meet me near the old mound at the crossroads, and we will test my theory.”</i>", parse);
                } else {
                    Text.Add("<i>“Once the stone has enough power, it may be able to reopen the portals again, and that will allow us to investigate what is threatening Eden. I have been unable to find the source of this threat up until now, it is very elusive. I believe it to be external to our world.”</i> The magician looks worried.", parse);
                    Text.NL();
                    Text.Add("<i>“Please hurry in finding a source of power, we need to commune with one of the more powerful, helpful spirits - and soon. Perhaps Lady Aria, if she can be reached. From what you have told me, she knows of the danger that looms over us.”</i>", parse);
                    Text.NL();
                    Text.Add("<i>“Travel deep inside the forest, under the branches of the Great Tree, and find the dryads' glade. There you will find an old and wise being known as the Mother Tree, a dear friend of mine. She will know of a way to help you, just tell her that I sent you.”</i>", parse);
                }
                Text.Flush();

                JeanneScenes.Talk();
            }, enabled : true,
            tooltip : "Discuss the gemstone with Jeanne.",
        });
        options.push({ nameStr : "Magic",
            func() {
                Text.Clear();

                if (!GlobalScenes.MagicStage1()) {
                    Text.Add("<i>“It is a lengthy process, but yes, I can help you. Perhaps… the gem you carry will make this easier.”</i> Jeanne instructs you to take out the stone, and hold it in both hands. She places her own slender hands on top of yours, the beautiful elf’s warmth making your heart race a bit faster.", parse);
                    Text.NL();
                    Text.Add("<i>“The fundamentals of magic is focus, knowing how to channel the energies in and around you and mold them to your will,”</i> the magician explains. <i>“Learn to feel the ebb and flow, become the fulcrum upon which the energy spins...”</i>", parse);
                    Text.NL();
                    Text.Add("As she speaks, you feel a throbbing warmth suffusing your hands, as if the magician’s heartbeat was magnified tenfold. Is she attempting to aid you by focusing her own magic? The gem in your grasp responds, the light within pulsing in time with Jeanne’s heart.", parse);
                    Text.NL();
                    Text.Add("It takes time - perhaps an hour or so - but more and more, you begin to sense the energy that she spoke of. The warmth surrounding your hands is only the tip of the iceberg; you can see trickles of it flowing around you wistfully, curling around your limbs and surging through your veins.", parse);
                    Text.NL();
                    Text.Add("When you look up to meet the magician’s eyes, she is beaming at you. In your heightened state of focus, the elf is literally glowing with power, surrounded by a pulsing aura the same pink color as her hair.", parse);
                    Text.NL();
                    Text.Add("<i>“Good, good!”</i> she congratulates you on your progress. <i>“You should spend some time every day repeating this until you can summon this state in an instant.”</i> Jeanne stretches out her hands in front of her, forming a rough sphere. Between them, the magic molds into a compact orb, swirling and changing until it is a ball of fire.", parse);
                    Text.NL();
                    Text.Add("<i>“Elemental magic is the simplest to start with,”</i> she continues, <i>“but it is by no means the full extent of this power. Once you have gathered the necessary energy and molded it into an appropriate form, you must trigger its release. Some can do it with merely a hand movement or the blink of an eye, but for beginners, the spoken word helps channel the magic - like so.”</i>", parse);
                    Text.NL();
                    Text.Add("<i>“Fireball!”</i> she snaps, sending the burning orb flying from her hands and hurtling out a window. <i>“To what extent you can control this, and how much energy you can gather, is limited only by your experience and your focus,”</i> she continues, raising a hand to catch the ball of fire again as it zips back in through another window. Exhaling, she disperses the magic harmlessly.", parse);
                    Text.NL();
                    Text.Add("Jeanne instructs you to practice on your own, while she fetches a few scrolls. <i>“Once you have the basics down, look through these in order to apply it,”</i> she shows you the scrolls, explaining what the symbols mean and how they relate to each other. It strikes you what a competent teacher she is, and how natural it all seems to be. In no time at all, you are juggling your own fireball between your hands, marveling at how easy the task is.", parse);
                    Text.NL();
                    Text.Add("<i>“I would say we have done enough for today,”</i> Jeanne concludes, after the two of you have spent several hours practicing your new skills. <i>“Look over the scrolls I gave you, and take time to apply these basic skills. I have more to teach you later, but I need a foundation to build on.”</i>", parse);
                    Text.NL();
                    Text.Add("<b>Unlocked the Mage job.</b><br>", parse);
                    Text.Add("<b>Unlocked the Mystic job.</b><br>", parse);
                    Text.Add("<b>Unlocked the Healer job.</b>", parse);
                    Text.NL();
                    Text.Add("You thank her for her time, stretching awkwardly. Time ended up just flying by.", parse);

                    TimeStep({hour: 8});

                    GameCache().flags.LearnedMagic = 2;
                } else if (GameCache().flags.LearnedMagic === 1) {
                    Text.Add("<i>“Hmm, I sense that you have already had a teacher - of sorts,”</i> Jeanne muses, studying you. <i>“That will make moving beyond the first steps easier for you.”</i> The elven magician quickly reviews what Magnus has taught you, remarking on your affinity with the gemstone, and how it helped you realize how to tap your inner energy.", parse);
                    Text.NL();
                    Text.Add("<i>“Your teaching has been rough, but I can sense your potential.”</i> She ponders your original question, tapping her chin. <i>“Can you show me what you can do?”</i>", parse);
                    Text.NL();
                    if (!Jeanne.ReadyForMagicTeaching()) {
                        Text.Add("You try to recall Magnus’ teachings, and focus your mind, summoning a ball of energy between your hands. Almost immediately, Jeanne is shaking her head.", parse);
                        Text.NL();
                        Text.Add("<i>“The idea is correct, but your form is sloppy. Let me give you a few pointers...”</i> You spend the next few hours listening to the magician - a much better teacher than Magnus ever was - explain and show the finer points of using magic to you.", parse);
                        Text.NL();
                        Text.Add("At last, she seems happy with your results. <i>“It is a good start, but you will need to practice more before I can teach you anything more advanced.”</i> You thank her for her time, your head spinning slightly from all the new information.", parse);

                        TimeStep({hour: 3});
                    } else {
                        Text.Add("With practiced ease, you focus your mind, summoning a ball of energy between your hands.", parse);
                        Text.NL();
                        Text.Add("<i>“Very good! Your form is slightly off, but you have developed a style of your own, I can tell. I will give you a few pointers, but you are almost ready to take the next step.”</i>", parse);
                        Text.NL();
                        Text.Add("Jeanne spends the next hour or so pointing out how you can improve on your magic skills and make them more efficient. The sheer amount of information that Magnus glossed over or muddled up is staggering, but your extensive experience of channeling magic helps you significantly.", parse);
                        Text.NL();
                        Text.Add("<i>“The next step will take significantly longer, so come back once you are ready,”</i> Jeanne instructs you, commending you for your quick progress.", parse);

                        TimeStep({hour: 1});
                    }

                    GameCache().flags.LearnedMagic = 2;
                } else if (GameCache().flags.LearnedMagic === 2) {
                    if (!Jeanne.ReadyForMagicTeaching()) {
                        Text.Add("<i>“Yes, I can teach you more about the arts of magic, but not until you have engrained the foundations into your mind and spirit,”</i> Jeanne explains. <i>“Only experience can take you further on this road.”</i>", parse);
                        Text.NL();
                        Text.Add("<b>Return once you’ve attained at least nine levels of mastery combined in the Mage, Mystic and Healer jobs.</b>", parse);
                    } else {
                        Text.Add("<i>“I think you have progressed far enough to partake of my lessons,”</i> the magician announces. <i>“We shall begin at once, as time is short.”</i> She instructs you to sit down, facing her.", parse);
                        Text.NL();
                        Text.Add("<i>“Now that you have learned the fundamentals of magic, I can teach you more advanced techniques. First, I have prepared these scrolls for you, in case you would like to proceed down the path of pure magic. The spells are more complex than you are used to, but the general idea is the same.”</i> She hands you a set of scrolls, detailing several new spells for you to learn.", parse);
                        Text.NL();
                        Text.Add("<b>Unlocked the Elementalist job.</b><br>", parse);
                        Text.Add("<b>Unlocked the Warlock job.</b>", parse);
                        Text.NL();
                        Text.Add("<i>“I will let you learn these yourself, if you find them interesting. What I wanted to introduce you to is how magic can be combined with other disciplines in order to enhance them.”</i> Jeanne spends some time outlining how magic can be used in order to power up your physical attacks, adding an elemental punch to your blows. <i>“Sword mages are very powerful warriors, especially against elemental foes,”</i> she concludes. <i>“Of course, you’d have to be both a proficient fighter and magician in order to apply these techniques to actual combat.”</i>", parse);
                        Text.NL();
                        Text.Add("<b>Unlocked the Runic Knight job.</b>", parse);
                        Text.NL();
                        Text.Add("<i>“Next, I believe that you have been introduced to using seduction in order to distract and mislead your enemies.”</i> You raise your eyebrow a bit at using magic for sex, but Jeanne seems unperturbed. <i>“Do not belittle the power of emotion,”</i> she tells you. <i>“One must have focus in order to weave and channel magic, but strong feelings - anger, determination, and yes, lust - can increase the power of a spell exponentially.”</i>", parse);
                        Text.NL();
                        Text.Add("<i>“To start with, try to use spells intended to muddle the minds of your foes. Fuel your magic with your own emotions and transfer them to the unsuspecting enemy. I have found that someone thinking with their libido is far more… agreeable, compared to one suffused with rage.”</i> She hands you yet another scroll, the contents of which makes you blush faintly.", parse);
                        Text.NL();
                        Text.Add("<b>Unlocked the Hypnotist job.</b><br>", parse);
                        Text.Add("<b>Unlocked the Eromancer job.</b>", parse);
                        Text.NL();
                        Text.Add("<i>“I could spend more time to explain how to each of the disciplines work, and additional spells you could apply, but you would be better served by applying what I have shown you.”</i> Jeanne looks troubled. <i>“Had things been different, you could have taken your time to study this for a few years, but time is not a luxury we possess.”</i>", parse);
                        Text.NL();
                        Text.Add("With that, the magician leaves you to your scrolls.", parse);

                        GameCache().flags.LearnedMagic = 3;
                    }
                }
                Text.Flush();

                JeanneScenes.Talk();
            }, enabled : GameCache().flags.LearnedMagic < 3,
            tooltip : "Jeanne is a magic teacher, isn’t she? Could she teach you about magic?",
        });
        /*
        options.push({ nameStr : "Alchemy",
            func : () => {
                Text.Clear();
                Text.Add("", parse);
                Text.NL();
                Text.Flush();

                JeanneScenes.Talk();
            }, enabled : true,
            tooltip : ""
        });
        */
        options.push({ nameStr : "Elves",
            func() {
                Text.Clear();
                Text.Add("<i>“I no longer keep in touch with my kin. Any I considered family are long dead, centuries upon centuries ago.”</i> There is a twinge of sadness in her composure, but it quickly fades. <i>“Do I miss some of them? Of course I do… but I have no regrets about my decisions.”</i>", parse);
                Text.NL();
                Text.Add("<i>“Elves have no special relation to their parents. As we grow up, we are raised by the community as a whole. I had friends, even lovers… but none that understood the deep thirst for knowledge that I had. After a few decades, I could no longer stay among them.”</i>", parse);
                Text.NL();
                Text.Add("<i>“Compared to the bustling activity of the city, the elven villages are very different. Serene - almost stagnant in the eyes of humans - we live as if in a different world. I could not stand living like that, not with the whole world out there just waiting.”</i>", parse);
                Text.NL();
                Text.Add("<i>“I returned to my people in their time of need. The corruption spreading from a strange world turned or killed many of my kin, and it was only at great cost that we were able to fight it off. It was a horrible time, and the wounds will take centuries to heal.”</i>", parse);
                Text.NL();
                Text.Add("It doesn’t look like she wants to talk more about it, so you drop the subject.", parse);
                Text.Flush();

                JeanneScenes.Talk();
            }, enabled : true,
            tooltip : "Ask Jeanne if she has any dealings with the elves anymore. How was it growing up among them?",
        });
        options.push({ nameStr : "Jeanne",
            func() {
                Text.Clear();
                if (jeanne.flags.bg === 0) {
                    Text.Add("<i>“There is hardly time to tell all of it. I have lived a long life, both here on Eden and in other worlds.”</i> Jeanne ponders your question. <i>“Where to start…?”</i>", parse);
                    jeanne.flags.bg = 1;
                } else {
                    Text.Add("<i>“My past is not that important, there are greater troubles afoot,”</i> Jeanne reprimands you. <i>“But if you ask, I shall tell you the tale again.”</i>", parse);
                }
                Text.NL();
                Text.Add("<i>“I was born among the elves here on Eden, but did not stay with them long. Learning the secrets of the arcane - magic, alchemy, the nature of spirits - I traveled to many places and visited many different realms.”</i>", parse);
                Text.NL();
                Text.Add("<i>“Teaching has always been a passion of mine. I was one of the founders of the Academy of Higher Arts, centuries ago. I left there in order to further my own research - oh, I do not know - two hundred years ago?”</i>", parse);
                Text.NL();
                Text.Add("Why did she choose Rigard as her home?", parse);
                Text.NL();
                Text.Add("<i>“I traveled for many years before I settled down here. This particular spot is highly attuned to magic, and is close to several other interesting areas, such as the crossroads. That there happened to be a castle built here already was merely an inconvenience. I offer my services to whoever happens to be in power, in exchange for them leaving me alone.”</i>", parse);
                Text.NL();
                Text.Add("How is that working out for her?", parse);
                Text.NL();
                Text.Add("<i>“Rewyn is not an easy king to deal with, I will grant you that. The past twenty years have been… taxing.”</i> Jeanne shrugs. <i>“No matter. He will be gone in another thirty or forty years, given that Eden has that long.”</i>", parse);
                Text.NL();
                Text.Add("<i>“There is another reason that I remain here,”</i> she continues, looking troubled. <i>“There is some strange magic brewing beneath this town, and I have been unable to discern what it is. Something powerful, something buried deep… It is not good, whatever it is. I have led expeditions into the catacombs below the castle, but it goes deeper yet.”</i>", parse);
                Text.Flush();

                JeanneScenes.Talk();
            }, enabled : true,
            tooltip : "Ask Jeanne for her story.",
        });
        parse.himher = terry.himher();
        if (party.InParty(terry) && terry.flags.TF & TerryFlags.TF.TriedItem && !(terry.flags.TF & TerryFlags.TF.Jeanne)) {
            options.push({ nameStr : "Terry",
                func : TerryScenes.JeanneTFFirst, enabled : true,
                tooltip : Text.Parse("Ask Jeanne if she can help you with Terry’s collar, and figure out why it seems to make [himher] immune to transformative effects.", parse),
            });
        }
        /*
        options.push({ nameStr : "Golem",
            func : () => {
                Text.Clear();
                Text.Add("", parse);
                Text.NL();
                Text.Flush();

                JeanneScenes.Talk();
            }, enabled : true,
            tooltip : ""
        });
        */
        if (rosalin.flags.Met !== 0) {
            options.push({ nameStr : "Rosalin",
                func() {
                    Text.Clear();
                    Text.Add("<i>“Ah, her.”</i> Jeanne frowns, looking a bit sad. <i>“You may have noticed that I live alone here. I used to have disciples, since teaching is a passion of mine. Rosalin… changed that. She was always a problematic child, causing quite a bit of trouble for her poor parents. From what I hear, her brief venture into the culinary realm almost put her father on the brink of death.”</i>", parse);
                    Text.NL();
                    Text.Add("<i>“I took pity on her and accepted her as my student, but she was more interested in making strange transformative potions than learning some common sense. At first, she confined her experiments to herself. Oh, I cannot even recall how often I had to mix a remedy to prevent something the little girl had swallowed from doing permanent damage to her. I finally decided to let her keep her feline tail and ears, but it only served to encourage her.”</i>", parse);
                    Text.NL();
                    Text.Add("<i>“Some time later, she convinced another one of the students to try something she brewed. It was for some stupid reason, the poor youngster was feeling insecure about his body… The next day, he woke up with a cock that was bigger than he was.”</i> She shakes her head. <i>“I was able to somewhat reduce the effects, but he will not have any more worries about his member being too small, that is for sure.”</i>", parse);
                    Text.NL();
                    Text.Add("<i>“One thing that always characterized Rosalin was her recklessness. The girl would never think things through before enacting them. There was another… incident, one that ended her time as a student, and if not for her noble birth and my urgings, might have had her hang. After the first boy was sent home, there were some complaints, sure, but nothing major. I of course warned the students about this, but you can guess how well that turned out.”</i> The magician rolls her eyes.", parse);
                    Text.NL();
                    Text.Add("<i>“<b>Every</b> male student nodded and agreed meekly, and then ran straight to the aspiring alchemist to get his own dose of cock-enhancer. I should have seen that coming, I suppose. The next batch of Rosalin’s potion had some rather nasty side effects though. Luckily, no one died, but some of those kids will never be the same… and some are permanent residents of the royal stables.”</i> Jeanne doesn’t seem to want to further explain what happened.", parse);
                    Text.NL();
                    Text.Add("<i>“In the end, I managed to convince everyone involved that exiling her from the city would be enough of a punishment. Some of those boys had been the sons of rather prominent nobles at court. Additionally, I was no longer allowed to accept students. It has been… lonely, since then.”</i> She sighs heavily.", parse);
                    Text.NL();
                    Text.Add("<i>“I do hope the girl is alive and well though, and that she has settled down.”</i>", parse);
                    Text.NL();
                    Text.Add("About that...", parse);
                    Text.Flush();

                    JeanneScenes.Talk();
                }, enabled : true,
                tooltip : "Ask the court mage about her former pupil.",
            });

            if (party.Inv().QueryNum(AlchemySpecial.Anusol) && rosalin.flags.Anusol < RosalinFlags.Anusol.ShowedJeanne) {
                options.push({ nameStr : "Rosalin’s pot",
                    tooltip : "You wonder what Jeanne would have to say about this new potion of Rosalin’s. Maybe showing it to her would be a good idea?",
                    func() {
                        rosalin.flags.Anusol = RosalinFlags.Anusol.ShowedJeanne;
                        jeanne.recipes.push(AlchemySpecial.AnusolPlus);

                        Text.Clear();
                        Text.Add("Reaching into your belongings, you draw forth a bottle of Anusol and offer it to the elven mage.", parse);
                        Text.NL();
                        Text.Add("<i>“This looks familiar. Where did you get this?”</i>", parse);
                        Text.NL();
                        Text.Add("You explain to her that it’s a custom brew you got from Rosalin.", parse);
                        Text.NL();
                        Text.Add("The elven mage sighs. <i>“I should have known. Let me take a look,”</i> she says, taking the bottle off your hands a pouring a small bit into a beaker. Jeanne examines the potion, distilling it and separating the contents before analyzing and mixing them back together.", parse);
                        Text.NL();
                        Text.Add("<i>“My silly apprentice… always adding that customary ‘extra punch’ to her mixes. This mixture will not do much for you. Might make your ass more sensitive, and possibly wetter, but that is as far as it will go. If she really wanted to augment it, she should have mixed it with something more adequate...”</i>", parse);
                        Text.NL();
                        Text.Add("You blink in surprise; does Jeanne really mean this potion could have an effect even stronger than the one it already has?", parse);
                        Text.NL();
                        Text.Add("<i>“You sound interested. You realize that if we were to actually augment this potion’s potency you would wind up turning your anus into a vagina, right? And I am not talking about just the way it feels, but a functional one. You could even get pregnant if you’re careless.”</i>", parse);
                        Text.NL();
                        Text.Add("You can’t conceal your surprise at the elf’s words; would such a transformation actually be possible?! You can’t imagine a person actually getting pregnant by their anus...", parse);
                        Text.NL();
                        Text.Add("<i>“It might be awkward at first. The anus is much tighter than a vagina, and we would have to add something to help with capacity and dilation. However, it is certainly possible.”</i>", parse);
                        Text.NL();
                        Text.Add("Your tongue idly flicks over your lips as you consider the possibility. Then, almost despite yourself, you inquisitively ask just what she’d need to make a stronger version of this potion.", parse);
                        Text.NL();
                        Text.Add("<i>“Just bring the ingredients for Gestarium or a potion I can distill, and I will see about undoing my apprentice’s mistake.”</i>", parse);
                        Text.NL();
                        Text.Add("Nodding to show you understand, you thank her. So, Anusol and Gestarium for an enhanced Anusol potion? You’ll need to remember that.", parse);
                        Text.Flush();

                        JeanneScenes.Talk();
                    }, enabled : true,
                });
            }
        }

        Gui.SetButtonsFromList(options, true, JeanneScenes.InteractPrompt);
    }

    export function First() {
        const player = GAME().player;
        const kiakai = GAME().kiakai;
        const jeanne = GAME().jeanne;
        const party: Party = GAME().party;

        const parse: any = {
            playername : player.name,
            name() { return kiakai.name; },
            hisher() { return kiakai.hisher(); },
        };

        jeanne.flags.Met = 1;

        Text.Clear();
        Text.Add("You make the trek up the final set of stairs into a large laboratory, every nook and cranny the home of some strange arcane device or alchemical concoction. Parchments and books are strewn about on tables and chairs, and a half-eaten meal is growing cold, forgotten on a bookshelf.", parse);
        Text.NL();
        Text.Add("At any other time, you might be fascinated to look closer at the various artifacts, find out what they are for, but right now, they form but a pale backdrop to the person standing in the middle of the room, poring over some documents thoughtfully. She is quite obviously not human; her unreal, exotic beauty visible in her long, pink hair and pointed ears. She is wearing a flimsy robe that does little to hide her shapely body, barely able to contain her huge breasts.", parse);
        Text.NL();
        Text.Add("The elven magician finally notices you, looking up and down at you through her thick lashes. She frowns slightly, clearly not expecting visitors. Turning to face you, her breasts bounce seductively.", parse);
        Text.NL();
        Text.Add("<i>“I do not recognize you,”</i> she says, her melodious voice sounding puzzled, <i>“are you from the castle?”</i> You tell her that you’re not, and explain why you are here, and who you are.", parse);
        Text.NL();
        Text.Add("<i>“I am indeed the court magician, Jeanne,”</i> the elf tells you, smoothing her dress. <i>“And how can I help you, [playername]?”</i>", parse);
        if (party.InParty(kiakai)) {
            Text.NL();
            Text.Add("Behind you, [name] peeks out, looking at the beautiful elf shyly. The magician smiles warmly at your companion, acknowledging [hisher] presence.", parse);
        }
        Text.Flush();

        talkedGolem  = false;
        talkedJeanne = false;
        talkedGem    = false;

        JeanneScenes.FirstPrompt();
    }

    export function FirstPrompt() {
        const golem = GAME().golem;
        const parse: any = {};
        // [Golem][Jeanne][Gem]
        const options = new Array();
        if (talkedGolem === false) {
            options.push({ nameStr : "Golem",
                func() {
                    Text.Clear();
                    Text.Add("<i>“I was sure I sealed the tower,”</i> the elf says, looking perplexed. <i>“You say that you were attacked by a golem…?”</i> It looks like understanding slowly dawns on her, and she looks a bit apprehensive.", parse);
                    Text.NL();
                    Text.Add("<i>“Tell me, it did not… do anything to you, did it?”</i>", parse);
                    Text.NL();
                    if (golem.flags.Met === GolemFlags.State.Won_prevLoss) {
                        Text.Add("Your blush must speak volumes, as the magician looks apologetic. <i>“I was afraid of that,”</i> she says in a small voice. <i>“I must have forgotten to deactivate the carnal spell on it.”</i>", parse);
                    } else {
                        Text.Add("You recount how you were attacked, but managed to defeat the guardian. To your surprise, the magician looks almost relieved.", parse);
                        Text.NL();
                        Text.Add("<i>“Ah, good, good. I think I have figured out what it was.”</i>", parse);
                    }
                    Text.NL();
                    Text.Add("<i>“I do apologize for that,”</i> she bows her head, looking genuinely sorry. <i>“I have so much to do these days… but I still should not let stray magic linger - especially not of that kind.”</i>", parse);
                    Text.NL();
                    Text.Add("<i>“If you wish, we can speak more about her later.”</i>", parse);
                    Text.Flush();

                    talkedGolem = true;
                    JeanneScenes.FirstPrompt();
                }, enabled : true,
                tooltip : "Ask Jeanne about the golem guarding the tower.",
            });
        }
        if (talkedJeanne === false) {
            options.push({ nameStr : "Jeanne",
                func() {
                    Text.Clear();
                    Text.Add("<i>“It matters little to me who rules in Rigard, I have been here longer than they.”</i> The beautiful elf gestures to the laboratory around her. <i>“I’ve lived here for centuries, long before the current king came along with his silly ideas; I will stay here, long after he is gone. There is so very much to learn about the world, and as long as the royals provide me with materials and stay out of my way, I give them advice.”</i>", parse);
                    Text.NL();
                    Text.Add("For centuries? The woman looks like she is in her thirties, mature but still possessing a stunning beauty. Once again, you are reminded that the age of elves cannot be judged by their looks. There is an iron glint in the magician's eyes as she adds: <i>“And if they do not like it, getting rid of me is going to be more trouble than it is worth.”</i>", parse);
                    Text.NL();
                    Text.Add("<i>“My research spans many fields, but I mainly study the properties of magic and alchemy.”</i>", parse);
                    Text.Flush();

                    talkedJeanne = true;
                    JeanneScenes.FirstPrompt();
                }, enabled : true,
                tooltip : "Ask why an elf is serving the king of Rigard.",
            });
        }
        if (talkedGem === false) {
            options.push({ nameStr : "Gem",
                func() {
                    Text.Clear();
                    Text.Add("When you pull out the purple gemstone you carry, Jeanne’s eyes almost bulge in surprise.", parse);
                    Text.NL();
                    Text.Add("<i>“W-where in the… How- how did you find something like this?”</i> The solemn magician is suddenly giddy like a little girl. <i>“This is an amazing device… and a very important one too.”</i>", parse);
                    Text.NL();
                    Text.Add("In response to your puzzled look, she explains: <i>“This gem is a key. It has very little power left, but filled with enough magic, it could reopen the pathways to other realms!”</i> The magician quickly clears a spot on a nearby table, reverently placing the gemstone on it.", parse);
                    Text.NL();
                    Text.Add("<i>“I have seen something like this before; I would recognize the craftsmanship anywhere. This jewel was crafted by Alliser, the sage. He lived on Eden long, long ago, but suddenly disappeared while exploring a portal. I have never met the man, but his work is legendary.”</i> You confirm that the gem does indeed seem to have the power to open portals, but that you have no idea how it works - and from your previous experiences, you are not sure that you’d like to do so.", parse);
                    Text.NL();
                    Text.Add("<i>“You have met Uru and Aria? Those are very powerful spirits, you should be happy to still be alive! I am just glad that the old one has been sealed, and can no longer enter our world.”</i>", parse);
                    Text.NL();
                    Text.Add("You ask her what you can do with the gem.", parse);
                    Text.NL();
                    Text.Add("<i>“Right now, not much I am afraid. The gem can store large amounts of magical power, but for it to be useful, you will need a more permanent energy source.”</i> She quickly scrawls down some notes on a parchment. <i>“You seem to be a resourceful person. I need you to go to the dryads' glade in the forest and talk to the Mother Tree. She should be able to help you if you explain your cause.”</i> Jeanne briefly explains how to find the hidden glade.", parse);
                    Text.NL();
                    Text.Add("<i>“It is very important that you keep the gem safe. While it is invaluable, trying to sell it would not be a good idea. I sense a strong bond between you and this stone… I do not think anyone other than you could bring out its full potential. Another thing that I am afraid of is that should the gem falls into the wrong hands, it may even bring harm to you.”</i>", parse);
                    Text.NL();
                    Text.Add("Hmm. Perhaps you should stop just showing this thing to everyone you meet.", parse);
                    Text.Flush();

                    talkedGem = true;
                    JeanneScenes.FirstPrompt();
                }, enabled : true,
                tooltip : "Ask the magician about the gemstone you carry.",
            });
        }
        if (options.length > 0) {
            Gui.SetButtonsFromList(options);
        } else {
            Gui.NextPrompt(JeanneScenes.FirstCont);
        }
    }

    export function FirstCont() {
        const player = GAME().player;
        const parse: any = {
            playername : player.name,
        };

        Text.Clear();
        Text.Add("<i>“Right now, getting a source of power for the gem is vital. I have been observing the recent events concerning the portals on Eden. Their disappearance is very worrying… and could have dire consequences. Something is stirring on Eden, and it seems to be absorbing magical power at a frightening rate. I have tried finding out what is causing this, but certain avenues previously available to me are no longer open since the portals closed.”</i>", parse);
        Text.NL();
        Text.Add("<i>“I would like more time to study the gem, and study you, but time is short. Once you have found a source of power for the keystone, meet me at the monument near the crossroads. It is a place of power, and might make summoning a portal easier. Please hurry, [playername].”</i>", parse);
        Text.NL();
        Text.Add("You thank her for her help, she’s given you a lot to think about.", parse);
        Text.Flush();

        TimeStep({minute: 30});
        Gui.NextPrompt();
    }

}
