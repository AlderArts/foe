import { WorldTime, TimeStep, GAME, MoveToLocation, WORLD } from "../GAME";
import { Text } from "../text";
import { Gui } from "../gui";
import { Gender } from '../body/gender';
import { Race } from "../body/race";
import { Color } from "../body/color";
import { Sex } from "../entity-sex";
import { SetGameState, GameState } from "../gamestate";
import { GwendyScenes } from "../event/farm/gwendy-scenes";
import { Event, Link } from '../event';
import { EncounterTable } from '../encountertable';
import { LaylaScenes } from '../event/farm/layla-scenes';
import { IngredientItems } from '../items/ingredients';
import { Season } from '../time';
import { RoamingScenes } from '../event/roaming';
import { DreamsScenes } from '../event/dreams';
import { InitMarket } from "./farm-market";
import { Party } from "../party";


export function InitFarm() {
    WORLD().SaveSpots["GwendysLoft"] = FarmLoc.Loft;
    InitMarket(GwendyScenes);
};

/*
 * ----------------------
 * FARM INTRO SEGMENT
 * ----------------------
 */
export namespace FarmScenesIntro {
    let hasBucket : boolean;
    let talkedAboutGwendy : boolean;
    let talkedAboutBarn : boolean;
    let talkedAboutAlone : boolean;
    let flirtGwendy : boolean;
    let fuckedDanie : boolean;

    export function Start() {
        TimeStep({minute: 15});
        Text.Clear();

        var parse : any = {};

        Text.Add("While trekking along the rolling grasslands of the plains, you briefly wonder what else might lie out here, until you spot a foreign structure with a muddy pathway leading toward it. In the distance, you see what appears to be an old and worn building. Although from here you are not sure what it is, you feel compelled to go out there and have a look.", parse);
        Text.Flush();

        //[Approach][Nah]
        var options = new Array();
        options.push({ nameStr : "Approach",
            func : FarmScenesIntro.Approach, enabled : true,
            tooltip : "Approach the building and try to find out what it is."
        });
        options.push({ nameStr : "Nah",
            func : function() {
                Text.NL();
                Text.Add("Deciding to not explore the distant building, you continue on your journey.", parse);
                Text.Flush();
                Gui.NextPrompt();
            }, enabled : true,
            tooltip : "You've got other things to do. The building isn't going anywhere."
        });
        Gui.SetButtonsFromList(options);
    }

    export function Approach() {
        let player = GAME().player;
        let party : Party = GAME().party;
        let gwendy = GAME().gwendy;

        party.location = FarmLoc.Fields;
        TimeStep({minute: 15});
        Text.Clear();

        gwendy.flags["Met"] = 1;

        var parse : any = {
            handsomecute : player.body.femininity.Get() > 0 ? "cute" : "handsome",
            playername   : player.name
        };

        if(party.Two()) {
            Text.Add("[name] seems to be doing good, refreshed by the passing breeze. With that, you head toward your destination.", { name: party.Get(1).name });
            Text.NL();
        }
        else if(!party.Alone()) {
            Text.Add("Facing your group, you see they are fine, looking a bit refreshed by the passing breeze. With that, you head forward to your destination.", parse);
            Text.NL();
        }

        Text.Add("The building is a fair distance away, and you vaguely wonder how much longer it will take you to reach it. Much to your relief, you reach it quickly, and are immediately rewarded with its identity. It turns out to be a timeworn barn in apparent danger of collapsing, if the patchwork repairs are any indication.", parse);
        Text.NL();
        Text.Add("To its sides, you see a variety of animals quietly grazing on the rather fertile-looking fields. Another look reveals various other life around as well. The occasional equine and dog-morph tend to menial tasks, such as moving hay and sheaf, or watering cattle.", parse);
        if(party.Two()) {
            var member = party.Get(1);
            Text.Add(" You decide to split up for a while, and [name] heads off to explore the farm for [himher]self, leaving you alone.", { name: member.name, himher : member.himher() });
        }
        else if(!party.Alone()) {
            Text.Add(" Your party disperses, each of you going separate ways to see what else lies on the farm for themselves.", parse);
        }
        Text.NL();
        Text.Add("The most distinct person visible from this mix of races has to be the human girl carrying two wooden buckets of water, each at the end of a wooden pole she skillfully hoists upon her shoulders. At a brief glance, she seems rather cute, with freckles spread lightly across her cheeks and bare shoulders, while her taut muscles complement her lean and sexy body. Her most notable trait, besides her short shorts and a crop top, is the long blonde braid reaching past her butt and tied with a blue ribbon, a much deeper shade than the vibrant blue of her eyes. As you look at her, she spots you and approaches with a friendly smile on her face, still carrying the two buckets of water.", parse);
        Text.NL();
        Text.Add("<i>“Well, how do you do, stranger?”</i> The girl asks as she stands before you, the contents of the bucket shaking a bit as she comes to a halt. <i>“Can't say I've seen you around here before. And I wouldn't forget a face as [handsomecute] as yours.”</i> You are taken slightly aback by the rather frank response, but the girl doesn't seem to notice. <i>“The name's Gwendy, if you're wondering what to call me. What's yours?”</i> You tell her your name, and she repeats it, as if for good measure. While the two of you get acquainted, she occasionally shuffles her weight a bit to shift her burden from one side to the other.", parse);
        Text.NL();
        Text.Add("Though she does not voice a complaint or ask for help, it would be common courtesy to lend a hand to the friendly farm girl.", parse);

        hasBucket = false;
        Text.Flush();

        //[Sure][Guess so][Nah]
        var options = new Array();
        options.push({ nameStr : "Sure",
            func : function() {
                Text.Clear();
                player.strength.IncreaseStat(40, 1);
                gwendy.relation.IncreaseStat(100, 5);

                Text.Add("You grab a bucket of water from one side of the pole to give the poor girl a break, holding the pole in place for a moment to make sure the other bucket doesn't throw off her balance. She's surprised at first, but just chuckles when she sees you struggle to grip the uncomfortable handle.", parse);
                Text.NL();
                Text.Add("Taking the other bucket in both hands, she bumps her hip into yours playfully. <i>“Thanks for taking a load off my hands. It's a bit hard to find able help at moment's notice... but if you don't mind, could you follow me since you're so willing to help?”</i>", parse);
                Text.NL();
                Text.Add("Gwendy walks in front of you with a swagger, giving you a nice view of her backside in motion. With a peek over her shoulder, she casts a sultry look your way before moving on. A slight victorious smile briefly tugs at the corner of your mouth while following the flirty girl, already wondering what else there could be.", parse);

                hasBucket = true;

                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.EnterBarn);
            }, enabled : true,
            tooltip : "She has been kind and even gave you a compliment. Give her a hand!"
        });
        options.push({ nameStr : "Guess so",
            func : function() {
                Text.Clear();
                Text.Add("You offer a hand to her and ask if you could hold a bucket. She gives you a smirk before shuffling her weight once more. <i>“No one's forcing you to do anything, [playername]. I'm fine for now. Still, if you'd like to help, please follow me.”</i>", parse);
                Text.NL();
                Text.Add("She begins to saunter off, moving with a sway that accentuates her toned, full thighs. Well, she said she wants your help, and she is cute, so what could be the harm in following to see what she wants?", parse);

                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.EnterBarn);
            }, enabled : true,
            tooltip : "Well, you have nothing better to do... offer her a hand?"
        });
        options.push({ nameStr : "Nah",
            func : function() {
                Text.Clear();
                gwendy.relation.DecreaseStat(-100, 5);
                Text.Add("Well, as pretty as she may be, Gwendy should be more than capable of handling her own chores. She seems to have managed so far, so she'll be fine on her own for now. Your attitude becomes apparent to the girl as she shuffles once more, the buckets threatening to spill, but thanks to her balance and skill the crisis is averted.", parse);
                Text.NL();
                Text.Add("She looks at you with slight annoyance before saying, <i>“If I wanted a stone, I wouldn't be talking to you. Still, you're a visitor, so I'll try to be accommodating, even if you aren't the most friendly sort. Follow me, I might be able to find something for you to do that you won't mind.”</i>", parse);
                Text.NL();
                Text.Add("Though she says that, it is true you are not exactly being the nicest person right now, so her irritation is understandable. Still, what could there be for you to do? Curious, you decide to follow her and find out. You hope she means to let you tap her for a bit.", parse);

                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.EnterBarn);
            }, enabled : true,
            tooltip : "You just came for the sake of it; you don't really have any inclination to help out."
        });
        Gui.SetButtonsFromList(options);
    }

    export function EnterBarn() {
        let party : Party = GAME().party;

        party.location = FarmLoc.Barn;
        TimeStep({minute: 10});

        var parse : any = {};

        Text.Clear();

        Text.Add("Following the girl into the barn, the first sight to strike you is the animals. It is almost like a zoo in here: horses, cows, sheep, and goats, alongside chickens, ducks, rabbits, and pigs. The collection is quite impressive and you say as much to Gwendy.", parse);
        Text.NL();
        Text.Add("She casually laughs it off while pouring the water into a trough for the pigs. <i>“Shoot, this is just another day in the life of a farmer for me. Tending to these guys is all I do, and I'm good at it. But enough of that,”</i> she says as the last of the water empties from the bucket, casting it aside neatly in a corner. <i>“Come with me, there's something I want you to see.”</i> With a happy turn, she heads for the back.", parse);
        Text.NL();

        if(hasBucket) {
            Text.Add("Before you go any further, Gwendy asks you to pour the bucket you carried into the trough for the cattle before following her to the back of the barn. You quickly do so, more than eager to help her out. Afterward, you the put the empty pail in the corner.", parse);
            Text.NL();
        }

        Text.Add("At the back of the barn, you see Gwendy standing next to a ladder leading to the upper floor, hay and straw jutting from the entryway. Gwendy begins climbing without a word, and you follow suit.", parse);

        Text.Flush();
        Gui.NextPrompt(FarmScenesIntro.EnterLoft);
    }

    export function EnterLoft() {
        let party : Party = GAME().party;

        party.location = FarmLoc.Loft;
        TimeStep({minute: 5});
        Text.Clear();

        var parse : any = {};

        Text.Add("Upon reaching the top, you are greeted with the homely sight of furniture spread somewhat clumsily around the place. There is a simple unmade bed with a rather worn, but comfy-looking, quilt resting atop it, and two pillows at the head. A pair of simple wooden drawers lie under the bed, and what looks to be the strap of a bra juts out from one of them. A dresser with a mirror sits close to a round wooden table with two chairs, and a small washtub is under the table filled with dirty dishes. A few essentials that come to mind, like a toilet, are missing, but you believe you saw an outhouse on the way here.", parse);
        Text.NL();
        Text.Add("As you finish looking around her room, your attention returns to Gwendy, who has a slightly embarrassed look on her face. <i>“I don't usually get company, so pardon the mess. Anyways, this is my simple abode, where my day starts and ends.”</i> She spreads her arms for emphasis. <i>“At least, this is where I stay most of the time. I have another smaller house close-by, but it's usually easier to just stay here on the ranch. Maybe I'll show you, if you want.”</i> Though she offers, the expression on her face suggests she would rather not deal with that right now.", parse);
        Text.NL();
        Text.Add("<i>“Well, I'm a bit busy today, but if you want to talk for a bit, I don't mind taking some time off for that... not that spending time with someone like you is ever a bad thing.”</i> She stands before you, her hands behind her back, waiting for your response.", parse);

        talkedAboutGwendy = false;
        talkedAboutBarn   = false;
        talkedAboutAlone  = false;
        flirtGwendy       = false;

        FarmScenesIntro.GwendyQuestions1();
    }

    export function GwendyQuestions1() {
        let player = GAME().player;

        var parse : any = {
            race : function() { return player.body.Race().Short(player.Gender()); }
        };

        Text.Flush();

        //[Sure][Guess so][Nah]
        var options = new Array();
        if(!talkedAboutGwendy) {
            options.push({ nameStr : "Gwendy",
                func : function() {
                    Text.Clear();
                    Text.Add("You tell her you'd like to know more about her, since it seems she manages the farm by herself. She smiles proudly before inviting you to sit at the table. <i>“Where do I start with this?”</i> she murmurs, looking off into the distance.", parse);
                    Text.NL();
                    Text.Add("After preparing herself a bit, she clears her throat and, standing up, spreads her arms in a dramatic manner. <i>“Welcome to Gwendy's Farm, the best one there is on this side of the plains! As you can see, I'm the proud owner of this facility, working day and night to make sure things are working right!”</i> Sitting down from that, she leans in a bit to see how you liked her little performance. <i>“It isn't often I get to boast like that, so I like to grab the chance when I have it. Like I said, I'm the owner of this barn, and I've been on the job as long as I can remember.”</i>", parse);
                    Text.NL();
                    Text.Add("You smile, and tell her she looks rather young to be managing an entire farm by herself. <i>“Hey, what can I say? Some people just know how to do what they need... though it does get a bit troublesome with these bandits roaming around from time to time. For all the kingdom says about helping its citizens, they really haven't done much in terms of making things easier for me.”</i> She ends on a bit of a huff, but she brightens up again as she returns her attention to you. <i>“So, what else do you want to know?”</i>", parse);
                    talkedAboutGwendy = true;
                    FarmScenesIntro.GwendyQuestions1();
                }, enabled : true,
                tooltip : "Try to get to know the farm girl better."
            });
        }
        if(!talkedAboutBarn) {
            options.push({ nameStr : "Barn",
                func : function() {
                    Text.Clear();
                    Text.Add("Though you admire the girl's obvious effort in maintaining the farm, you can't help but note the declining state of the barn. Gwendy's happy expression becomes a bit more somber when you point that out. You try to take your words back, but the girl shakes her head at your apologies. <i>“It's alright, I know that it's shabby. Even with trying to do repairs when I can, I don't have enough time and money to do that and keep paying these taxes <b>and</b> chase off the fools who come and make trouble... Still, I do what I can to keep it functioning at least. That's the duty of a farmer, right?”</i> Even though she ends with a somewhat positive tone, the pain of dealing with a farm on the brink of collapse is apparent on her face. <i>“Well, it is what it is, but I promise I will have this place up and running, even if it takes me the rest of my life to do it!”</i>", parse);
                    Text.NL();
                    Text.Add("Looking over the barn once more, it becomes obvious that accomplishing that would be almost miraculous, but perhaps you could lend a hand or two to revive this place? It would definitely win the favor of the farm girl for you...", parse);
                    talkedAboutBarn = true;
                    FarmScenesIntro.GwendyQuestions1();
                }, enabled : true,
                tooltip : "This barn has seen better days..."
            });
        }
        if(!talkedAboutAlone) {
            options.push({ nameStr : "Alone?",
                func : function() {
                    Text.Clear();
                    Text.Add("Curiously, you point out that she's the only human on a farm full of animals and morphs. Doesn't that make her feel a bit secluded?", parse);
                    Text.NL();
                    Text.Add("<i>“Well... to be honest, I'm not really alone. The morphs and animals here keep me company everyday. There's always work to do, so I get to work alongside them from time to time. As for other humans, I deal with enough of those guys as it is. Damn bandits and kingsmen,”</i> she mutters as she runs a hand through her hair. <i>“Anyway, I'm never truly alone, so it's not too bad...”</i>", parse);
                    Text.NL();
                    Text.Add("She looks at you with a questioning look before asking:", parse);
                    Text.NL();
                    if(player.body.Race() == Race.Human)
                        Text.Add("<i>“Why, were you thinking of coming around a bit more to keep me company, as a fellow human?”</i> She asks the question in an innocent enough tone, but her eyes look at you with some expectancy. You tease her, saying that you might just do that, if she doesn't mind. At that, she giggles before casting a flirtatious glance at you. <i>“Oh, I wouldn't mind at all. It might be a bit more fun with you around.”</i>", parse);
                    else
                        Text.Add("<i>“Thinking about introducing me to a few other humans... or maybe getting to know me a little better, as a [race]?”</i> Her question intrigues you, but you say it was simple curiosity, though you might come around more if she doesn't mind having a friend that isn't a regular on the ranch. <i>“Well, thanks, I'd appreciate that. You'd better follow through and visit often!”</i>", parse);
                    talkedAboutAlone = true;
                    FarmScenesIntro.GwendyQuestions1();
                }, enabled : true,
                tooltip : "You must admit, she doesn't look to have friends of the regular variety."
            });
        }
        if(options.length > 0)
            Gui.SetButtonsFromList(options);
        else
            FarmScenesIntro.GwendyQuestions2();
    }

    export function GwendyQuestions2() {
        let player = GAME().player;
        let party : Party = GAME().party;
        let gwendy = GAME().gwendy;
        let farm = GAME().farm;
        let danie = GAME().danie;
        let adrian = GAME().adrian;

        var parse : any = {
            playername : player.name,
            breastDesc : function() { return player.FirstBreastRow().Short(); }
        }

        Text.Flush();

        //[Flirt][Help][Leave]
        var options = new Array();
        if(!flirtGwendy) {
            options.push({ nameStr : "Flirt",
                func : function() {
                    Text.Clear();
                    flirtGwendy = true;

                    Text.Add("Trying your best to appear suave, you lean in a bit and compliment her looks, saying that despite the rigorous and demanding work of the farm, she sure keeps quite the figure.", parse);
                    Text.NL();
                    Text.Add("She chuckles before setting both elbows on the table and resting her chin on her hands. <i>“Well, what can I say? If you've got it, flaunt it, right? No sense in being too modest, especially when you're out in the fields working all the time.”</i> You admit she has a point, but at the same time you doubt that you could be prudent and productive with her working beside you.", parse);
                    Text.NL();
                    Text.Add("<i>“Well, since you say I have a nice body, mind telling me what's your favorite part?”</i> That was a bit unexpected, but it looks like you're on the spot now. What do you choose?", parse);
                    Text.Flush();
                    /*
                    * Options
                    */
                    //[Breasts][Hair][Ass][Lips][Body]
                    var options = new Array();
                    options.push({ nameStr : "Breasts",
                        func : function() {
                            Text.Clear();
                            player.AddLustFraction(0.2);
                            gwendy.relation.IncreaseStat(100, 5);
                            Text.Add("You point out her breast are her most prominent feature, the bountiful beauties tempting any who look to reach out and touch. She smiles at your answer before cupping a hand under each breast and shaking them with alternating movements.", parse);
                            Text.NL();
                            Text.Add("<i>“So, you like looking at my lovely ladies, I see. Can't say I blame you. It isn't too often I see another person around here with boobs like mine. But I bet you want to do <b>something else</b> instead of looking at them...”</i> Gwendy looks at you seductively before removing her hands from her breasts. Although her tease was short, it still stirred something within you.", parse);
                            FarmScenesIntro.GwendyQuestions2();
                        }, enabled : true,
                        tooltip : "Girl's got a nice pair of breasts!"
                    });
                    options.push({ nameStr : "Hair",
                        func : function() {
                            Text.Clear();
                            player.AddLustFraction(0.1);
                            gwendy.relation.IncreaseStat(100, 3);
                            Text.Add("You answer just as she moves a lock of hair out of her face. She's a bit surprised by your choice, but accepts the compliment nonetheless. <i>“I can see why you'd pick that, though I honestly thought you'd say something a little more... perverse? Still...”</i> ", parse);
                            Text.NL();
                            Text.Add("She runs her fingers through her silky hair before tucking a stray strand behind her ear, which draws out a bit more beauty from her already cute face. <i>“Momma always told me to aim to please, so I'm glad you like my hair.”</i>", parse);
                            FarmScenesIntro.GwendyQuestions2();
                        }, enabled : true,
                        tooltip : "Her hair is so pretty! You're kind of jealous."
                    });
                    options.push({ nameStr : "Ass",
                        func : function() {
                            Text.Clear();
                            player.AddLustFraction(0.3);
                            gwendy.relation.IncreaseStat(100, 5);
                            Text.Add("That ass. Gwendy actually blushes as you say that, taken slightly aback by your bold response. <i>“You sure know how to make a girl feel great about her body,”</i> she teases as her embarrassment eases away. <i>“I thought I felt someone staring at my butt, but to think you would admit to it so openly... I guess I can't blame you, especially when you consider what I wear.”</i> ", parse);
                            Text.NL();
                            Text.Add("As if to add emphasis on this point, she stands up and turns around while looking over her shoulder, throwing you a sexy look. Before you question what she's doing, she places her hands on her butt and gives it a little shake, making her ass jiggle wondrously. Seeing the look of appreciation on your face, she laughs a bit before sitting back down. <i>“Don't get too excited there, I was just showing you what you liked was all.”</i>", parse);
                            FarmScenesIntro.GwendyQuestions2();
                        }, enabled : true,
                        tooltip : "Baby got back!"
                    });
                    options.push({ nameStr : "Lips",
                        func : function() {
                            Text.Clear();
                            player.AddLustFraction(0.1);
                            gwendy.relation.IncreaseStat(100, 2);
                            Text.Add("You say her lips are undoubtedly the most alluring part of her. At this, she tilts her head to the side while looking at you with a sultry gaze through half-lidded eyes. <i>“Is that so? I wonder what you're imagining me doing with those lips of mine?”</i> In an effort to turn the insinuations back on her, you quip, saying the only person with dirty thoughts is her.", parse);
                            Text.NL();
                            Text.Add("<i>“Is that so? You might be right, but we'll never know, now will we?”</i> As she says that, she runs her tongue slowly over sumptuous lips, making them glossy and attractive. <i>“Oh well, I got my answer, so I'll be a bit more appreciative of these lips then.”</i> As she finishes, she blows a kiss to you, a playful smile on her face.", parse);
                            FarmScenesIntro.GwendyQuestions2();
                        }, enabled : true,
                        tooltip : "Those lips bring many thoughts to your mind..."
                    });
                    options.push({ nameStr : "Body",
                        func : function() {
                            Text.Clear();
                            player.AddLustFraction(0.4);
                            gwendy.relation.IncreaseStat(100, 8);
                            Text.Add("Unable to pick just one part on the sexy girl, you decide to say she's simply hot. <i>“Oh! Thank you, [playername]. Though I was expecting you to have a particular favorite, to be honest... but this just makes it easier for me to mess with you a little more!”</i>", parse);
                            Text.NL();
                            Text.Add("As she says that, Gwendy moves from her seat to your lap, a perverted smile on her face, as she wraps her arms around your neck. <i>“Since you can't decide, let me just give you a treat as a thank you...”</i> Leaning in, she presses her lips against yours while her lovely chest closes against your [breastDesc]. Meanwhile, in your lap, she grinds a bit, causing her ass to lightly brush against your crotch. All in all, she's doing more than teasing, but you don't mind at all.", parse);
                            Text.NL();
                            Text.Add("Before it goes any further though, Gwendy breaks the kiss and stops her lap dance. Getting up, she slowly walks back to her seat, tantalizingly shaking her ass. When she sits back down, she smiles and says, <i>“By the way, I like you too... all of you, if you couldn't tell.”</i>", parse);
                            FarmScenesIntro.GwendyQuestions2();
                        }, enabled : true,
                        tooltip : "She's got it all, honestly."
                    });
                    Gui.SetButtonsFromList(options);
                }, enabled : true,
                tooltip : "The girl seems to flirt with you a bit, so why not flirt back?"
            });
        }
        options.push({ nameStr : "Help",
            func : function() {
                Text.Clear();
                // Boons!
                for(var i = 0; i < party.members.length; i++) {
                    var c = party.members[i];
                    c.strength.IncreaseStat(30, 2);
                    c.stamina.IncreaseStat(30, 2);
                    c.dexterity.IncreaseStat(30, 2);
                }

                gwendy.relation.IncreaseStat(100, 5);
                Text.Add("<i>“Wanna help, huh? Well, I know I mentioned it earlier, but it wouldn't be right of me to impose on you like that.”</i> You insist on helping, saying you have more than enough time to help out the person that greeted you so kindly and welcomed you to the farm. She looks a little unconvinced, but she shrugs her shoulders and says, <i>“Alright, if you say so. But in that case, don't complain about the work once we get started!”</i> With that, the girl stands up from the table and climbs back down the ladder. You follow behind.", parse);

                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.HelpAdrian);
            }, enabled : true,
            tooltip : "Offer a hand around the farm."
        });
        // TODO!!! Leave loiter
        options.push({ nameStr : "Leave",
            func : function() {
                Text.Clear();

                Text.Add("You tell Gwendy that you're fine for now, but thank her for welcoming you into her room. She casts a questioning glance at you, but doesn't ask anything. <i>“Alright then, if that's what you want. I've things to do myself, so I'm leaving now. Of course, you can still check out the farm if you'd like, but I won't be there to help you get around. Other than that, see ya!”</i>", parse);
                Text.NL();
                Text.Add("Standing up, she saunters away teasingly before climbing down the ladder, and you follow her promptly, not wanting to catch any accusations of loitering or doing anything else untoward in her room.", parse);
                Text.NL();
                Text.Add("You look over the farm once more, but decide that right now you're too busy with current events to dawdle around.", parse);
                Text.NL();

                if(party.Two()) {
                    var member = party.Get(1);

                    Text.Add("You call [name] back, telling [himher] it's time to go. [HeShe] returns swiftly, already looking forward to the next visit.", { name: member.name, himher : member.himher(), HeShe : member.HeShe() });
                    Text.NL();
                }
                else if(!party.Alone()) {
                    Text.Add("You call your party back, telling them it's time to go. They return swiftly, already looking forward to the next visit.", parse);
                    Text.NL();
                }

                danie.flags["Met"] = 1;
                adrian.flags["Met"] = 1;

                parse["party"] = party.Two() ? " and your companion" : !party.Alone() ? " and your companions" : "";

                Text.Add("As you leave, you see a strapping example of an equine tending to the flowerbed at the entrance of the farm. Politely, you wave at him before introducing yourself[party]. He stands up, introducing himself as Adrian. He seems kind of shy, but you figure you can get to know him later.", parse);
                Text.NL();
                Text.Add("Before you can talk with him more, a sheep girl with a dark coat of fur falls between the two of you, apparently tripping on something. Adrian hurries forward to help her, gently scolding the girl. From their exchange, you find out that her name is Danie, and that she is another denizen of the farm.", parse);
                Text.NL();
                Text.Add("You chuckle a bit at the two, happy to meet some interesting characters here before leaving. Still, as much as you’d like to get to know them, you pardon yourself with a wave.", parse);
                Text.NL();

                Text.Add("With that, you head out for your next destination.", parse);
                Text.NL();
                farm.flags["Visit"] = 1;
                Text.Add("<b>Found Gwendy's Farm (can now be visited from plains)</b>");
                Text.Flush();

                TimeStep({minute: 20});

                Gui.NextPrompt(function() {
                    MoveToLocation(WORLD().loc.Plains.Crossroads, {minute: 30});
                });
            }, enabled : true,
            tooltip : "It is time to get going, you have other matters to attend."
        });
        Gui.SetButtonsFromList(options);
    }

    export function HelpAdrian() {
        let player = GAME().player;
        let party : Party = GAME().party;
        let adrian = GAME().adrian;

        party.location = FarmLoc.Barn;
        TimeStep({minute: 10});
        Text.Clear();

        adrian.flags["Met"] = 1;

        var parse : any = {
            playername : player.name,
            buttDesc   : function() { return player.Butt().Short(); }
        };

        Text.Add("Getting off the ladder, you are met with the butt-end of a pitchfork as you face the perky girl. Next to her is a rather tall equine-morph, having easily a foot over the girl. He is quite the specimen, too. He has a well-toned body with short, silky brown fur coating the bulging muscles of his bare chest, and a flowing, dark brown mane falling a little past his shoulders to emphasize his equine physique. He is wearing a pair of trousers made from rough cloth, hiding his presumably equine genitals.", parse);
        Text.NL();
        Text.Add("<i>“Hey, [playername], quit staring off into space! We've got work to do!”</i> Gwendy commands as she presses the pitchfork into your hand. <i>“I see you've taken notice of Adrian, here. He's a farmhand who helps me out on occasion, so he's familiar with the pace of things around here. Anyway, let's get started. The two of you can work on getting the hay up while I tend to the cows. Afterward, we'll take care of whatever else comes up.”</i>", parse);
        Text.NL();

        if(party.Two()) {
            var member = party.Get(1);

            Text.Add("You call out to [name], hoping [heshe] will lend a hand with the coming chores. When [heshe] arrives in response to your call, you explain to [himher] you need [himher] to help around the farm and direct [himher] to Gwendy for instructions. She gives [name] a task and sends [himher] on [hisher] way, leaving Gwendy with a happy smile on her face.",
            {
                name   : member.name,
                heshe  : member.heshe(),
                himher : member.himher(),
                hisher : member.hisher()
            });
            Text.NL();
        }
        else if(!party.Alone()) {
            Text.Add("You call out to your companions, hoping they will lend a hand with the coming chores. When they arrive in response to your call, you explain to them you need them to help around the farm and direct them to Gwendy for instructions. She gives everyone a task and sends them on their way, leaving Gwendy with a happy smile on her face.", parse);
            Text.NL();
        }

        Text.Add("Finished with her instructions, Gwendy goes to tend to the cows, leaving you and Adrian looking at one another in awkward silence before he walks off without a word. You follow on his heels to make sure you do not get lost.", parse);
        Text.NL();
        Text.Add("The two of you stop at a field littered with cut, dried hay, and Adrian begins slowly raking the grass into piles and then bundles. When he finishes with a bundle, it is about waist-high, giving you an idea of what your own work should look like. Squaring your shoulders, you get to it.", parse);
        Text.Flush();

        //[Talk][Flirt][Gwendy][Just work]
        var options = new Array();
        options.push({ nameStr : "Talk",
            func : function() {
                Text.Clear();
                adrian.subDom.IncreaseStat(100, 3);
                Text.Add("While working on a rather unwieldy pile, you call Adrian over for assistance. He looks over and sighs as he walks over, lifting the pile by himself. You offer some thanks, but he waves it off before getting back to his own work. In an effort to get to know your co-worker better, you try to talk to him, but he remains silent.", parse);
                Text.NL();
                Text.Add("Finally, after what seems like thirty minutes of continuous effort, the equine finally decides to speak a few words. <i>“Thank you... for helping me out. I'm sorry if I didn't talk too much but... you're kind of cool. Hope we can work together again, sometime.”</i> That is all he says before he goes to work on a separate pile. Well, it seems that he was sincere in his response, which makes you glad you managed to talk before delving back into work.", parse);
                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.HelpAdrianFinished);
            }, enabled : true,
            tooltip : "Try to get to know him."
        });
        options.push({ nameStr : "Flirt",
            func : function() {
                Text.Clear();
                adrian.subDom.DecreaseStat(-100, 5);
                Text.Add("In an attempt to win the attention of the equine, you pretend you are having trouble lifting the piles of hay. Calling him over to help while holding on to the pitchfork, you relish the feeling of him wrapping his strong arms around you, his muscles flexing as he works with you.", parse);
                Text.NL();
                Text.Add("This process continues for a while, you pretending to be incompetent and having him come to your aid. However, in your last attempt, you wait until he is close behind you before rubbing your [buttDesc] against his groin.", parse);
                Text.NL();
                Text.Add("The result is Adrian letting out a shocked gasp as he lets go of the pitchfork and stumbles backward. Looking back, you see a shameful look in his eyes as he hurries back to his pile, ignoring you for the remainder of the job. Seems you may have been a little too forceful with the boy, but now you know to play it slow with the shy guy if you want things to go further.", parse);
                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.HelpAdrianFinished);
            }, enabled : true,
            tooltip : "Why not? He is cute and silent."
        });
        options.push({ nameStr : "Gwendy",
            func : function() {
                Text.Clear();
                adrian.subDom.IncreaseStat(100, 5);
                Text.Add("After working for a solid thirty minutes, you take a small break to unwind from the rigors of lifting and raking. Adrian likewise pauses in his work, leaning on his pitchfork. Taking the moment to make small talk, you ask him what he thinks of Gwendy.", parse);
                Text.NL();
                Text.Add("To your surprise, a tint of rose races across his face at the question. <i>“G-Gwendy is cool, I guess,”</i> Adrian manages to get out, while staring intently at the ground. Odd, you were not expecting the macho-looking Adrian to be so shy around this topic, but it might be somewhat understandable.", parse);
                Text.NL();
                Text.Add("Though unprovoked, Adrian gets back to answering your inquiry. <i>“O-of course, someone like Gwendy is popular with everyone on the farm. I like spending time with her, too - especially when we work together.”</i> Before you can question the boy further, he goes back to work, trying to hide his blushing. You smile before doing the same, noting his attraction and admiration for the lone farmer. You might be able to get along with this guy.", parse);
                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.HelpAdrianFinished);
            }, enabled : true,
            tooltip : "Ask him what he thinks of Gwendy."
        });
        options.push({ nameStr : "Just work",
            func : function() {
                Text.Clear();
                Text.Add("Well, Gwendy did say she had a schedule to keep, and you did say you would help, so you leave Adrian alone for the time being. If anything, you can take the opportunity to talk when dust is not threatening to clog your lungs.", parse);
                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.HelpAdrianFinished);
            }, enabled : true,
            tooltip : "There is too much to do, no time to play!"
        });
        Gui.SetButtonsFromList(options);
    }

    export function HelpAdrianFinished() {
        let player = GAME().player;

        Text.Clear();
        TimeStep({hour: 1});

        var parse : any = {
            playername : player.name,
            buttDesc   : function() { return player.Butt().Short(); }
        };

        if(player.stamina.Get() < 25) {
            Text.Add("You struggle to get as much done as the equine, who does his task with very little apparent effort. For every pile you make, he is working a third. You feel a bit embarrassed, but press on, if only to maintain your dignity.", parse);
        }
        else {
            Text.Add("It is a bit of a hassle, but you manage to keep somewhat of an even pace with Adrian. Despite his skill at this, he is rather slow about it, but makes up for it by making monstrous piles that easily dwarf yours. Still, all in all, the two of you mass together quite a number of haystacks before calling it a day.", parse);
        }
        Text.NL();
        Text.Add("After an hour or so of backbreaking raking and piling, the field appears to be done. Wiping the sweat off your forehead, you look around to see what Adrian is up to. He seems to be busy moving the piles into larger ones under what looks to be some type of canopy, likely where the hay will be stored to await further processing.", parse);
        Text.NL();
        Text.Add("You set out to assist him, but he holds a hand out and insists in a deep voice, <i>“Go to Gwendy for something else, I can handle this on my own, [playername].”</i> To be honest, you would not mind working on something else, so you follow his instructions.", parse);
        Text.NL();
        Text.Add("Going to the stalls, you find the girl gently working a cow's udders, steadily filling a milk pail with practiced movements. Nearby, you notice she already has a dozen or more such pails filled to the brim, yet she is still tirelessly going, with cows and cow girls looking on in anticipation.", parse);
        Text.NL();
        Text.Add("Stopping her for just a moment, you ask her what else she would like you to do. <i>“Well, I didn't really expect for you to be done so soon, but I suppose this is for the best. The faster we finish, the better, after all.”</i>", parse);
        Text.NL();
        Text.Add("Standing up to stretch, Gwendy looks you in the eyes and smiles. <i>“Alright, your next job is tending the sheep. They have yet to be fed and watered, and I need to bring them in before nightfall, so if you wouldn't mind...”</i> After a few instructions on where they are and what to do before you go, Gwendy gives you a quick peck on the cheek.", parse);
        Text.NL();
        Text.Add("<i>“That's for being such a great help. There might be more if you can keep it up!”</i> She gives a brief pat to your [buttDesc] before going back to her duties, leaving you to yours.", parse);
        Text.Flush();
        Gui.NextPrompt(FarmScenesIntro.MeetDanie);
    }

    export function MeetDanie() {
        let player = GAME().player;
        let party : Party = GAME().party;
        let danie = GAME().danie;

        Text.Clear();
        party.location = FarmLoc.Fields;
        TimeStep({minute: 5});

        danie.flags["Met"] = 1;

        var parse : any = {
            playername : player.name,
            eyeColor   : Color.Desc(player.Eyes().color),
            mistermiss : player.body.Gender() == Gender.male ? "mister" : "miss",
            MisterMiss : player.body.Gender() == Gender.male ? "Mister" : "Miss"
        };
        parse = player.ParserTags(parse);

        Text.Add("Heading out to the pasture, you are greeted with the bleating of sheep as they lazily graze about. In the mix, you see a few sheep people, walking and conversing as if it was the most normal thing in the world. It is an odd sight, seeing a bunch of wool-clad people with sheep horns curving down the sides of their faces, but this <i>is</i> Eden after all. This is just another oddity you have to get used to, right?", parse);
        Text.NL();
        Text.Add("In any event, you set about rounding up the sheep to feed and water when a dark-skinned sheep girl with gray wool approaches you, her curious, stormy eyes looking into your own [eyeColor] ones. <i>“Hi there,”</i> the sheep girl says in a sweet voice.", parse);
        Text.NL();
        Text.Add("There is a brief moment of silence as the two of you look at one another before she grabs your hand and drags you toward the prairie where the other sheep people are. You pull back a bit and try to tell the girl that you are busy with something, but she is not listening. <i>“I can't wait to show you to my friends, [mistermiss]!”</i> Well, it seems you are along for the ride, and she is not exactly stopping you from working as you do have to round up the sheep from around the pasture. As the eager sheep girl leads on, you take in her appearance, noting her similarities to the others.", parse);
        Text.NL();
        Text.Add("The sheep girl has curly gray hair, styled in a cute little bob barely passing her shoulders, with two horns curving slightly down the length of either side of her human face. Her body is almost fully exposed, the few exceptions being what seems to be a fuzzy collar around her neck, the fur bracelets around her wrists, and the knee-high fur going down her lower legs. Though mostly having a human appearance, she has sheep-like ears jutting from her hair, a short sheep tail resting above the crack of her butt, and hooves in place of feet.", parse);
        Text.NL();
        Text.Add("Before you know it, the girl has stopped, and you now stand before a group of sheep people, all of whom look at you with evident happiness. <i>“[MisterMiss], these are my friends! Let's introduce ourselves to each other.”</i> You try to tell the girl, yet again, that you cannot goof around right now, but it seems the other sheep just follow her decree to introduce one another, and you decide you might as well go along and get the most out of it.", parse);
        Text.NL();
        Text.Add("They all seem like nice people, and the girl that brought you out here, whose name you find out is Danie, cheerfully chats with her peers about minor matters that fail to catch your interest. Taking advantage of the situation, you start slinking slowly away when Danie spots you. <i>“Hey, where are you going, [playername]? I thought we were going to play?”</i> As gently as you can, you explain that you have work to do, so you cannot play right now. You have to give food and water to all of the sheep, and maybe more work after that.", parse);
        Text.NL();
        Text.Add("Danie looks a bit sad upon hearing this, but her attitude brightens the moment she speaks up again. <i>“Do you mind if I come along with you? I want to stick with you for a bit.”</i>", parse);

        fuckedDanie = false;
        Text.Flush();
        //[Yes][No]
        var options = new Array();
        options.push({ nameStr : "Yes",
            func : function() {
                Text.Clear();
                danie.relation.IncreaseStat(100, 5);
                player.AddLustFraction(0.2);
                Text.Add("You tell the sheep girl she can join you while you work, and she gives a happy squeal. It should not be too bad, as long as you make sure the two of you do not stray off course.", parse);
                Text.NL();
                Text.Add("Picking up the supplies from before the escapade with Danie, you begin feeding the sheep and sheep folk. As you go about it, Danie walks beside you in companionable silence, looking up at you, her eyes filled with wonder. It seems she is content with just being around you, which is sort of a relief.", parse);
                Text.NL();
                Text.Add("While you are feeding a group of sheep, you notice Danie chasing a butterfly, her hands spread wide as she goes after it. The scene unfolding is an adorable sight... until she trips over a rock. Her fall, while by no means dangerous or threatening, does reveal the slit of her cunt and her puckered back entrance, both a subtle shade lighter than her skin tone. You quickly avert your eyes from the sight, and the sheep girl soon returns to your side, allowing you to check up on her just in case while avoiding meeting her eyes. Fortunately, the girl is still bright and perky, and seems unaware of her exposure.", parse);
                Text.NL();
                Text.Add("Trying to get the event out of mind, you do your best to hurry with the chores, trying to keep the girl from having any further mishaps, and you from seeing any more from her accidental exposures. It seems your plan is working as Danie watches you in fascination, and hopefully with no opportunity for getting into any more trouble.", parse);
                Text.NL();
                Text.Add("You sigh with relief as you come to the last group, a bunch of sheep people just gabbing while you bring their share of food. All goes well and you finish with the feeding, and, as a bonus, Danie has not gotten into trouble. You call the girl over and she starts skipping to your side. Unfortunately, before she can get there, she trips over an upturned root and, while flailing to try and catch herself, knocks you down and lands on top of you. The two of you lie like that for a moment, her warm, nude body pressing against you.", parse);
                Text.NL();
                Text.Add("Danie finally gets off of you, looking down with an apologetic expression. <i>“Sorry, [playername]! I didn't mean to hurt you!”</i> She offers a hand, but you have gotten up before she can do anything. Still worried, she gently touches your body to check for injuries, her soft, warm fingers gliding gracefully over any exposed skin. Satisfied with her search, she grabs your hand and pulls you back toward the barn, where you should continue your work.", parse);
                Text.NL();
                Text.Add("Danie leads the way calmly, for once refraining from chasing flying objects or wandering off to play around with a few of her friends who call out to her. As she lead the way, you are given quick smiles and shy glances over her shoulder - as well as treated to a full view of her body. Whether you like it or not, the sheep girl stays directly in front of you, and you can do little but appreciate her curvy figure.", parse);
                Text.NL();
                Text.Add("She is clearly in her prime, with wide hips and a plump, juicy bottom. Her thighs are thick and voluptuous, and you can almost imagine her rear spilling over in your hands. It does not help that she is as soft as cotton, the girl having practically no muscle definition on her. Despite this, it is not that she is fat or chubby - just cute, soft, and cuddly with a bouncing rear. Her breasts, from what you can tell, would just barely overlap your [hand]s, if you were to grasp them.", parse);
                Text.NL();
                Text.Add("<i>“We're here!”</i> Danie proudly announces as you reach the barn. She turns to look at you when, lo and behold, she manages to trip over her own feet. Once more, the two of you fall, this time with you on top of her.", parse);
                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.HornyDanie);
            }, enabled : true,
            tooltip : "Why not? She might actually be of help."
        });
        options.push({ nameStr : "No",
            func : function() {
                Text.Clear();
                danie.relation.DecreaseStat(-100, 5);
                Text.Add("As sweet as she is, you can't take the time to look after her and do your job at the same time, so you tell her no. Maybe when you're free you can come and play, but you have a job and you need to do it as quickly as possible. ", parse);
                Text.NL();
                Text.Add("She looks dispirited and a little devastated, but smiles nonetheless and says, <i>“It was nice meeting you though, [playername]. Hopefully, next time you won't be too busy.”</i> Looking at you one last time with the same sweet smile, she turns around and rejoins her friends.", parse);
                Text.NL();
                Text.Add("She took that rather well and you're still acquainted with her, which is good. Still, this is how things are right now. Work first, play later, right?", parse);
                Text.NL();
                Text.Add("After an hour of herding, feeding and watering all the sheep and sheep-like residents, you dust your hands off and call it a day.", parse);
                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.ReturnToGwendy);
            }, enabled : true,
            tooltip : "You don't need any distractions, so you tell the girl so."
        });
        Gui.SetButtonsFromList(options);
    }

    export function HornyDanie() {
        let player = GAME().player;
        let danie = GAME().danie;

        Text.Clear();
        player.AddLustFraction(0.5);

        var parse : any = {
            playername      : player.name,
            erectionwetness : player.FirstCock() ? "erection" :
                            player.FirstVag()  ? "wetness" : "arousal"
        };

        Text.Add("This is not a good position for you, aroused as you are. You try to hide the [erectionwetness] in your groin, but you are sure Danie can feel it. Much to your dismay, she remarks that there she feels something odd against her stomach, and you quickly get up. Mentally calming yourself, you try to preserve your dignity as you offer her a hand up.", parse);
        Text.NL();
        Text.Add("The sheep girl looks at you attentively. You really should get going, but talking to her for a bit would probably not hurt...", parse);
        Text.Flush();

        //[Talk][Leave]
        var options = new Array();
        options.push({ nameStr : "Talk",
            func : function() {
                Text.Clear();
                danie.relation.IncreaseStat(100, 5);
                Text.Add("Asking her if she is okay, you are caught off guard as she jumps on you, giving you a quick hug. <i>“I'm alright, [playername]! Thank you for asking!”</i> She backs up a bit suddenly, leaving you looking at her in confusion while she stares back with a guilty look. <i>“You must think I'm such a klutz, causing us to trip like that... I know I'm a bit clumsy, but I didn't mean to hurt you. Sorry...”</i>", parse);
                Text.NL();
                Text.Add("It is clear that the girl feels awful, but you quickly assure the girl that everything is fine, you were not hurt in the slightest. She looks elated upon hearing that, but seems to still have lingering doubts. <i>“Are you sure you're okay? You look troubled... I felt something weird before, when you were on top of me.”</i> ", parse);
                Text.NL();
                Text.Add("In a decidedly sheepish tone, you confess to your aroused state. With a bright smile, she grabs your hand and pulls you after her. <i>“Okay, let's fix that together!”</i> You are not sure what she means by 'fix that', but she seems intent on helping either way.", parse);
                Text.NL();
                Text.Add("Danie brings you to her personal stall, which is surprisingly nice and roomy place containing a small washtub, a simple stool, and a straw bed. It honestly looks cozy, but you do not get much time to look around before Danie sits you on the stool. <i>“Alright, [playername]. Can you tell what sort of problem this is?”</i>", parse);
                Text.NL();
                Text.Add("You are not sure how to explain it to her, but you manage to say you are rather aroused. From her expression, she really does not seem to get it, or she is slowly trying to digest what you said, so in an attempt to clarify, you tell her in simpler terms that you are horny. As she realizes what you meant all along, her face is engulfed in a spread of scarlet, the red a clear contrast to her dusky skin.", parse);
                Text.NL();
                Text.Add("She actually begins trembling at this, but still manages to talk to you. <i>“W-well, that's the problem? U-um, h-how can I help with that?”</i> It seems that despite her nervousness, she's still willing to help you out with your 'problem'. That said, a few options come to mind.", parse);
                Text.Flush();
                FarmScenesIntro.DanieFuckOptions();
            }, enabled : true,
            tooltip : "Well, she seems to like being around you, why not talk to her for a bit?"
        });
        options.push({ nameStr : "Leave",
            func : function() {
                Text.Clear();
                danie.relation.DecreaseStat(-100, 5);
                Text.Add("You just barely recovered from your aroused state, and you really don't need anything to push you back into it at this point. It pains you to admit it, but you're going to have to leave the girl. Knowing her attitude and behavior, she will likely be a little crushed, but you can explain the next time you see her... you hope, at least.", parse);
                Text.NL();
                Text.Add("Excusing yourself, you leave the disappointed sheep girl behind you. Glancing over your shoulder, you notice that she has already found something else to distract her.", parse);
                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.ReturnToGwendy);
            }, enabled : true,
            tooltip : "As you are now, that would only invite unnecessary trouble."
        });
        Gui.SetButtonsFromList(options);
    }

    export function DanieFuckOptions() {
        let player = GAME().player;
        let danie = GAME().danie;

        var cocksInVag = player.CocksThatFit(danie.FirstVag());
        var cocksInAss = player.CocksThatFit(danie.Butt());

        var parse : any = {
            playername : player.name
        };

        //[Sure][Guess so][Nah]
        var options = new Array();
        if(player.FirstCock()) {
            options.push({ nameStr : "Blowjob",
                func : FarmScenesIntro.DanieOralSex,
                obj : true,
                enabled : true,
                tooltip : "Oral seems to be the safest option, honestly. Give her a taste of your cock."
            });
            options.push({ nameStr : "Vaginal",
                func : FarmScenesIntro.DanieVaginalSex, enabled : cocksInVag.length > 0,
                tooltip : "Introduce the sheep to your pork sword, y'know?"
            });
            options.push({ nameStr : "Anal",
                func : FarmScenesIntro.DanieAnalSex, enabled : cocksInAss.length > 0,
                tooltip : "You must admit, you wonder if she'd mind some butt fun."
            });
        }
        if(player.FirstVag()) {
            options.push({ nameStr : "Cunnilingus",
                func : FarmScenesIntro.DanieOralSex,
                obj : false,
                enabled : true,
                tooltip : "Oral seems to be the safest option, honestly. Have her eat you out."
            });
        }
        options.push({ nameStr : "Nevermind",
            func : function() {
                Text.Clear();
                player.AddLustFraction(-0.2);
                Text.Add("You tell the helpful girl that this isn't something she needs to concern herself with. Before she can protest, you stand up and tell her to stay here. It's bad enough that you are aroused, but you do not want to do anything irreversible just because you can barely keep your pants on.", parse);
                Text.NL();
                Text.Add("It seems she understands, and politely accepts your decision. <i>“Alright, [playername], I see. But... don't hesitate to find me if you have a problem. Promise me that, okay?”</i> You reluctantly agree, but you don't have too much time to spare, so you say goodbye to Danie before heading off to finish work.", parse);
                Text.Flush();
                Gui.NextPrompt(FarmScenesIntro.ReturnToGwendy);
            }, enabled : true,
            tooltip : "It isn't her problem, so no need to force anything on her."
        });
        Gui.SetButtonsFromList(options);
    }

    export function DanieOralSex(bits : boolean) {
        let player = GAME().player;
        let danie = GAME().danie;

        Text.Clear();
        fuckedDanie = true;
        danie.relation.IncreaseStat(100, 10);
        danie.slut.IncreaseStat(100, 5);

        // IF bits == true, cock, else vag

        var parse : any = {
            playername : player.name,
            cockDesc   : function() { return player.FirstCock().Short(); },
            cuntDesc   : function() { return player.FirstVag().Short(); },
            clitDesc   : function() { return player.FirstVag().ClitShort(); }
        };

        Text.Add("You tell the sheep girl to get on her knees. She looks at you with a hint of fear, but does as told. <i>“W-what are we going to do, [playername]?”</i> she asks with understandable nervousness.", parse);
        Text.NL();
        Text.Add("Her uncertainty makes you feel a bit uneasy about proceeding, and you ask the girl if she really wants to help out this way. Though her tone is shy, she nods, telling you she's willing to help however she can. <i>“I... I'm not going to back away now.”</i>", parse);
        Text.NL();
        Text.Add("With that resolved, you undo your pants to reveal ", parse);

        if(player.body.Gender() == Gender.herm) {
            Text.Add("both sets of sexes, a small bit of confusion on Danie's face as she comments, <i>“Umm, [playername], I didn't know you had both of these! It's going to be hard if I have to do both...”</i> You chuckle slightly and tell her that it isn't necessary as you decide on ", parse);
        }

        // MALE/HERM: BLOWJOB
        if(bits) {
            Text.Add("your [cockDesc], which springs out erect and ready for what's to come. Danie actually lets out a cute whimper as she inches closer to it, apparently understanding what to do.", parse);
            Text.NL();

            // Big cock
            if(player.FirstCock().length.Get() >= 30) {
                Text.Add("Uncertain, she grabs it with her warm, supple fingers. <i>“T-this...is way too big! I don't know if this is a good idea anymore.”</i>", parse);
                Text.NL();
                Text.Add("Her thoughts coincide with yours, as you wonder how the girl would be able to take something so large with a mouth as petite as hers.", parse);
                Text.NL();
                Text.Add("Still, she shuffles a little on her knees before moving closer, though her hands move from your crotch and [cockDesc] to her hand-filling tits. Your eyes widen in wonder as Danie straightens up before squeezing your [cockDesc] in her cleavage. <i>“I-is this okay with you? I'm sorry I can't use my mouth, but this is the best I can do.”</i>", parse);
                Text.NL();
                Text.Add("You hardly register her question as your senses are overwhelmed by the softness and heat of her breasts. Giving her a weak nod, the girl to continues what she was doing as you grab the stool with both your hands to stop yourself from jumping her.", parse);
                Text.NL();
                Text.Add("Understanding your silent approval, she hums as she begins rubbing her breasts up and down the length of your [cockDesc]. As she continues, pre leaks from the tip of your dick, dripping down its length and lubricating the girl's cleavage, making the tit fuck easier.", parse);
                Text.NL();
                Text.Add("Eventually, she speeds up the tempo, working faster and faster to get you off, her breasts slapping against your lap while squeaking and squishing noises emanate from the lewd act. Unable to bear the girl's efforts any longer, you cum, spurting your fluids onto her face, hair and breasts. Danie squeals in shock, but she continues her ministrations until your orgasm subsides.", parse);
                Text.NL();
                Text.Add("When you finish, it looks like the girl is glazed with a fine coat of spunk, making her look rather degraded. Still, she seems rather upbeat, happy that you seem relieved, as your [cockDesc] grows flaccid between her tits. <i>“Are you all good now, [playername]? Is there anything else I can do to help?”</i> You look at her with a relieved face and tell her she's done enough for you.", parse);
            }
            else { // Less than x cm cock
                Text.Add("She grabs it with her warm, supple fingers, leaving you to relish the feeling as she says, ", parse);
                if(player.FirstCock().length.Get() >= 20) {
                    Text.Add("<i>“W-whoa, this is kind of big! B-but if I need to help you, I'll do what I can... ”</i>", parse);
                }
                else {
                    Text.Add("<i>“I think I can handle this, [playername]. It shouldn't be a problem!”</i>", parse);
                }
                Text.NL();
                Text.Add("With slow grace, inching it closer to her mouth, she parts her cute lips wide and wraps them around the head of your [cockDesc], with some trepidation. A tingle surges through you upon being greeted with the girl's hot and moist tongue, and it takes some restraint to stop yourself from plowing her face then and there.", parse);
                Text.NL();
                Text.Add("Danie pushes slowly down on the rest of your shaft, as her thick tongue laps and wraps around your length, her stormy eyes looking up at yours. As you look down at her, you see her fear slowly receding as she begins bobbing her head slightly, taking in more and more of you, until her nose is bumping against your groin.", parse);
                Text.NL();
                Text.Add("Slowly building speed, her tongue strokes and presses against your [cockDesc], and you're all but ready to burst as she bobs, sucks and licks along your shaft. Occasionally, you spot Danie looking up at you happily, thrilled that her efforts are making you feel better. Such a sweet girl...", parse);
                Text.NL();
                Text.Add("Unable to deny your mounting pleasure, you grab her horns and push yourself as far as possible into her, making her gag as you take control and fuck her pretty face. You don't last long with the spasming sensations of her throat, and unload your built-up package down her throat, the thick fluid being sucked and drained as you pump it out.", parse);
                Text.NL();
                Text.Add("When you finish, you withdraw from the girl, and she gasps a bit for air while some white residue slowly runs down the corners of her mouth. As she recovers from her coughing fit, she looks at you and asks, <i>“A-are you better now, [playername]? Do you need something else?”</i>", parse);
                Text.NL();
                Text.Add("You shake your head and tell the girl she's done enough, to which she smiles before hugging you, her breasts enveloping your face. <i>“Yay, I'm glad I could help then!”</i> Maybe spending some time with Danie wasn't so bad, if she's this enthusiastic to 'help' your problems...", parse);
            }
        }
        // FEMALE/HERM: CUNNILINGUS
        else {
            Text.Add("your [cuntDesc], already wet and ready as Danie looks at it expectantly. <i>“Okay, I think I can help with this!”</i> she says with what sounds like an upbeat voice.", parse);
            Text.NL();
            Text.Add("She moves closer, still a little uneasy, though not voicing any complaints. With a tentative lick, her thick tongue strokes gently over your [clitDesc], making you twitch with lust. She surprises you by pushing her flexible organ further, and you can feel the first inch or so delve into your cleft. A whimpering moan escapes your lips.", parse);
            Text.NL();
            Text.Add("The noise makes Danie look up at you, her eyes asking if it hurts you, but in small moans you coax her to continue. It seems the girl is rather agile with her tongue. It moves with remarkable grace, and as the thick muscle touches and caresses your vaginal walls, you tremble at her slightest touch. A small part of you is left wondering if she's had practice, but the thought vanishes in a flash of pleasure as her nose brushes against your [clitDesc] yet again.", parse);
            Text.NL();
            Text.Add("Now that your [cuntDesc] is gushing fluids, the girl's mouth and fur collar are getting completely soaked, though she keeps working without complaint. Time and time again, she looks up at you with those sweet eyes to see if you're alright, and all you can do is give her a look of approval, though each time she does, it drives you closer to the edge.", parse);
            Text.NL();
            Text.Add("Once more, she looks up, and you give in to your pleasure, squirting girl-cum on her face in a shuddering orgasm. Her tongue stays in you, clamped in place by your vaginal muscles as you wring and writhe. When you calm down, you see Danie is still on her knees, now drenched in your fluids. You ask if <i>she</i> is okay, to which she cheerfully replies, <i>“I'm fine as long as I can help you, [playername]!”</i> You smile and pat the girl on the head, earning you a happy laugh from her.", parse);
        }

        player.AddLustFraction(-1);
        player.AddSexExp(3);
        danie.AddSexExp(3);
        Sex.Blowjob(danie, player);

        Text.Flush();
        Gui.NextPrompt(FarmScenesIntro.ReturnToGwendy);
    }

    export function DanieVaginalSex() {
        let player = GAME().player;
        let danie = GAME().danie;

        Text.Clear();
        danie.relation.IncreaseStat(100, 15);
        danie.slut.IncreaseStat(100, 5);
        fuckedDanie = true;

        var cocksInVag = player.CocksThatFit(danie.FirstVag());

        var p1Cock = player.BiggestCock(cocksInVag);

        var parse : any = {
            playername : player.name,
            cockDesc   : function() { return p1Cock.Short(); },
            cuntDesc   : function() { return danie.FirstVag().Short(); },
            breastDesc : function() { return player.FirstBreastRow().Short(); }
        };

        Text.Add("You ask your new friend to come closer as you undo your pants. She looks a little worried, but approaches nonetheless. Pulling your [cockDesc] out, you tell her that you want to use her cunt right now to help yourself out. <i>“U-um, okay, b-but can I ask you a question, [playername]?”</i> The girl seems a tad more nervous than you expected, and you tell her that of course she can. <i>“I've never done anything like this before, s-so...I'm wondering, is this going to hurt?”</i>", parse);
        Text.NL();
        Text.Add("Huh? The girl is a virgin? Your surprise is met with a blush from Danie as she looks at the ground and draws circles in the dirt with her hoof. <i>“I... I never thought about doing stuff like this. It's so sudden, b-but I don't mind if it's to help you out, [playername].”</i> You ask if she would rather do something else, but Danie insists that you stick to your choice. <i>“Really, it's okay, but can you please be gentle?”</i>", parse);
        Text.NL();
        Text.Add("With that settled, you instruct Danie to sit on your lap as you stroke your [cockDesc] to full erection. As she straddles you, you rub your member against her sex, making both it and her [cuntDesc] nice and slick, as well as rewarding you with a light moan from the girl. Grabbing her hips, you instruct Danie to rise as you align your [cockDesc] with her [cuntDesc] before slowly guiding the sheep girl down.", parse);
        Text.NL();
        Text.Add("Danie hisses through clenched teeth, and her face scrunches up in pain as you push into her, trying not to cause too much discomfort. But before long, you're all the way in, and Danie lets out a small sigh of relief as she sinks further down.", parse);
        Text.NL();

        // Plow that virginity
        Sex.Vaginal(player, danie);
        player.Fuck(p1Cock, 5);
        danie.FuckVag(danie.FirstVag(), p1Cock);

        Text.Add("You look into her eyes to see how she's doing, but it seems she's a lot better off than you expected, eyes glowing with lust, replacing the previous innocent light. She wraps her arms around your neck and begins bouncing up and down slowly, causing quiet moans to escape you. <i>“There's no need to dillydally, right? I have to help you, [playername],”</i> Danie tells you, the heat evident in her voice, as she presses her hand-consuming tits against your [breastDesc]. You nod in agreement, and she begins moving faster and faster. It seems Danie wants to decide the pace, so you reach around and squeeze her big, soft butt, making her let out a moan.", parse);
        Text.NL();
        Text.Add("The two of you continue for a while, Danie controlling the pace while you tease and play with her body. Playtime is cut short, however, when Danie's back arches and she lets loose a shrill cry that you're sure everyone on the farm can hear. You have no time to worry about that as a sudden rush of fluids soaks your lap, while your [cockDesc] is assaulted by the contractions of her [cuntDesc].", parse);
        Text.NL();
        Text.Add("The delightfully tight tunnel rhythmically clamps down, milking your [cockDesc] for cum, and you are happy to oblige. Grabbing her rear, you thrust as far as you can into her before releasing yourself, warm fluids coating her insides. When the two of you settle down from your orgasm, Danie casts a happy look at you before hugging you tightly. <i>“That felt really good, [playername]! I'm glad I could help you, too!”</i> Well, it seems the ewe doesn't mind too much that you've taken her virginity. Maybe she isn't a bad person to come to whenever you have problems like these...", parse);

        player.AddLustFraction(-1);

        Text.Flush();
        Gui.NextPrompt(FarmScenesIntro.ReturnToGwendy);
    }

    export function DanieAnalSex() {
        let player = GAME().player;
        let danie = GAME().danie;

        Text.Clear();
        danie.relation.IncreaseStat(100, 20);
        danie.slut.IncreaseStat(100, 10);
        fuckedDanie = true;

        var cocksInAss = player.CocksThatFit(danie.Butt());

        var p1Cock = player.BiggestCock(cocksInAss);

        var parse : any = {
            playername : player.name,
            cockDesc   : function() { return p1Cock.Short(); },
            anusDesc   : function() { return danie.Butt().AnalShort(); },
            buttDesc   : function() { return danie.Butt().Short(); }
        };

        Text.Add("Gathering some courage, you ask Danie if she'd mind letting you use her ass for your problems. She frowns a bit as she asks, <i>“What do you mean, use my ass?”</i> In as short a way as possible, you explain that you would like to have a little fun with her butt. She blushes even harder than when you told her you were horny, but she complies with the plan. Turning around, she presents her tush to you, though it's evident that she is exceptionally nervous. Concerned, you ask why.", parse);
        Text.NL();
        Text.Add("<i>“I-it's just this is the first time I'm doing something like this. I'm a little scared, but if it'll help you out... I... I don't mind doing it.”</i> Well, that was unexpected, but you can tell she's being sincere. To ease her tension, you tell her softly that it'll be fine, she just has to relax and trust you. <i>“Alright, if you say so, [playername]. I can trust you,”</i> she says as she looks at you, her eyes showing determination.", parse);
        Text.NL();
        Text.Add("You smile calmly as you grab her thighs, gently pulling her closer before spreading her cheeks and kissing her [anusDesc], making her tail to brush against your nose as it twitches. The girl moans in surprise as you continue to kiss, coat, and tease her [anusDesc] until it's nearly dripping with your saliva. Finally prepared, you guide her down to your [cockDesc] and push against her, grimacing as you work against the resistance, until you slide in.", parse);
        Text.NL();

        Sex.Anal(player, danie);
        player.Fuck(p1Cock, 5);
        danie.FuckAnal(danie.Butt(), p1Cock);

        Text.Add("Danie lets out a cute, prolonged whimper and her tail flits some more while you take a moment to get accustomed to one another. Turns out she was right about being a virgin; her [anusDesc] is quite possibly hotter than anything you've felt so far, and so tight that it actually hurts a bit to just sit there. After a minute or so, you give an experimental push, at which Danie lets out another whimper as she takes more of your [cockDesc] inside. The process continues until your groin is flush against her [buttDesc], her tail continuing to wag, brushing against your stomach.", parse);
        Text.NL();
        Text.Add("Picking up the pace, you begin moving her up and down your shaft, with her making enticing whimpers, moans, and coos. You grin slightly as you watch Danie's facial expression switch between wonder, delight, and lust, one of her hands digging into the cleft between her legs as she begins to frig herself. You give her a light spank, making her jolt and cause a ripple to spread through her body, making it jiggle wondrously. The sheep girl begins to make cute bleating noises, delirious with pleasure.", parse);
        Text.NL();
        Text.Add("Her ass is hot as only Aria knows what, and seems to have adjusted to your [cockDesc]'s girth, letting you move smoother and faster. Her butt repeatedly smacks against your groin now, causing the sounds of your act to carry to anyone in the vicinity. You give Danie another spank and call out to ask her how she feels, but she is long lost in a world of lust, her tail wagging nonstop while her tongue lolls out of her mouth. The sight drives you close to the edge, but you hold back.", parse);
        Text.NL();
        Text.Add("However, that effort is wasted as Danie suddenly cries out, her [anusDesc] crushing down on your [cockDesc] as she cums. With her back door gripping and squeezing your overstimulated member, you can't help but to release your load. With one last shallow thrust, your dam bursts, filling her with your seed. When you both finish, you pull out of her, semen following you and dripping down from her ass.", parse);
        Text.NL();
        Text.Add("Checking on the girl, you find she's still dazed and glossy-eyed, with a dopey smile on her face. Seems either you went overboard, or she really enjoyed herself just now. In any event, you get the girl on her bed before leaving, thanking her for helping you out.", parse);

        player.AddLustFraction(-1);

        Text.Flush();
        Gui.NextPrompt(FarmScenesIntro.ReturnToGwendy);
    }

    export function ReturnToGwendy() {
        let player = GAME().player;
        let party : Party = GAME().party;
        let farm = GAME().farm;

        Text.Clear();
        TimeStep({hour: 2});

        var parse : any = {
            playername : player.name
        };

        Text.Add("Although your first day with the sheep was rather frantic, you can't say you didn't enjoy it. Meeting Danie, while a little frustrating, made a good impression on you, especially considering her sweet and innocent attitude. Maybe you can visit her later and spend more time with her? For now, you decide to head back to Gwendy.", parse);
        Text.NL();
        Text.Add("You find the farmer humming to herself while watering a vegetable patch. When you approach her, she smiles at you and says, <i>“Well then, didn't think you'd finish with the sheep already. Or did someone decide to have a little <b>fun</b> with the flock?”</i> ", parse);
        Text.NL();

        if(fuckedDanie) {
            Text.Add("A nervous chuckle escapes your lips as you deny performing any such actions. A knowing smile graces Gwendy's face as she comes closer and theatrically sniffs at you. <i>“You might say you haven't, but you smell an awful lot like sheep for someone just feeding them... but I won't worry you about it. I think I can trust someone who's willing to help a gal out.”</i> You squirm under her gaze, but she soon backs off.", parse);
        }
        else {
            Text.Add("You cast an indignant look at her, but she just chuckles. <i>“Calm down, silly. I know you're not the type to do something like that. Still, you have no idea how much help you were today. I appreciate it, and I hope you'll come by more often, even just to visit.”</i>", parse);
        }

        Text.Add(" The girl steps back and gives you a peck on the cheek. <i>“Take care, hun! I'll be expecting you every once in a while, okay?”</i>", parse);
        Text.NL();
        Text.Add("You nod in affirmation before turning and walking off the ranch.", parse);
        Text.NL();

        if(party.Two()) {
            var member = party.Get(1);

            Text.Add("You call for [name], telling [himher] you are heading back out.", { name: member.name, himher : member.himher() });
            Text.NL();
        }
        else if(!party.Alone()) {
            Text.Add("You call out to your party, telling them you are heading back out.", parse);
        }

        Text.NL();
        farm.flags["Visit"] = 1;
        Text.Add("<b>Found Gwendy's Farm (can now be visited from plains).</b>");
        Text.Flush();
        Gui.NextPrompt(function() {
            MoveToLocation(WORLD().loc.Plains.Crossroads, {minute: 30});
        });
    }
}


// Create namespace
let FarmLoc = {
	Fields : new Event("Plains: Gwendy's farm"),
	Barn   : new Event("The barn"),
	Loft   : new Event("Gwendy's loft")
}


FarmLoc.Loft.events.push(new Link(
	"Gwendy", function() {
		let gwendy = GAME().gwendy;
		return gwendy.IsAtLocation(FarmLoc.Loft);
	}, true,
	function() {
		let gwendy = GAME().gwendy;
		if(gwendy.IsAtLocation(FarmLoc.Loft)) {
			Text.Add("Gwendy is here.");
		}
		else
			Text.Add("Gwendy doesn't seem to be in at the moment.");			
		Text.NL();
	},
	GwendyScenes.LoftPrompt
));
FarmLoc.Barn.events.push(new Link(
	"Gwendy", function() {
		let gwendy = GAME().gwendy;
		return gwendy.IsAtLocation(FarmLoc.Barn);
	}, true,
	function() {
		let gwendy = GAME().gwendy;
		if(gwendy.IsAtLocation(FarmLoc.Barn)) {
			Text.Add("Gwendy is here.");
		}
		else
			Text.Add("Gwendy doesn't seem to be here at the moment.");			
		Text.NL();
	},
	GwendyScenes.BarnPrompt
));
FarmLoc.Fields.events.push(new Link(
	"Gwendy", function() {
		let gwendy = GAME().gwendy;
		return gwendy.IsAtLocation(FarmLoc.Fields);
	}, true,
	function() {
		let gwendy = GAME().gwendy;
		if(gwendy.IsAtLocation(FarmLoc.Fields)) {
			Text.Add("Gwendy is here.");
		}
		else
			Text.Add("Gwendy doesn't seem to be here at the moment.");			
		Text.NL();
	},
	GwendyScenes.FieldsPrompt
));


//
// Gwendy's farm, the fields
//
FarmLoc.Fields.description = function() {
	Text.Add("Fields.");
	Text.NL();
}

// Set up Layla events
FarmLoc.Fields.onEntry = function(x : any, from : any) {
	if(from == WORLD().loc.Plains.Crossroads) {
		if(LaylaScenes.FarmMeetingTrigger(true)) return;
	}
	Gui.PrintDefaultOptions();
}

FarmLoc.Fields.enc = new EncounterTable();
FarmLoc.Fields.enc.AddEnc(function() {
	return function() {
		let party : Party = GAME().party;
		Text.Clear();

		Text.Add("Not having much else to do, you wander the fields for a few minutes. You pick up a particularly fresh bundle of grass. Who knows, could be useful for something.");
		Text.NL();
		Text.Add("You pick up some fresh grass.", null, 'bold');
		party.inventory.AddItem(IngredientItems.FreshGrass);

		TimeStep({minute: 15});
		Text.Flush();
		Gui.NextPrompt();
	};
}, 1.0, function() { return WorldTime().season != Season.Winter; });

FarmLoc.Fields.enc.AddEnc(function() {
	return RoamingScenes.FlowerPetal;
}, 1.0, function() { return WorldTime().season != Season.Winter; });

FarmLoc.Fields.enc.AddEnc(function() {
	return function() {
		let party : Party = GAME().party;
		Text.Clear();

		Text.Add("Not having much else to do, you wander the fields for a few minutes. You pick up a pretty flower. Who knows, could be useful for something.");
		Text.NL();
		Text.Add("You pick up a Foxglove.", null, 'bold');
		party.inventory.AddItem(IngredientItems.Foxglove);

		TimeStep({minute: 15});

		Text.Flush();
		Gui.NextPrompt();
	};
}, 1.0, function() { return WorldTime().season != Season.Winter; });

FarmLoc.Fields.links.push(new Link(
	"Crossroads", true, true,
	null,
	function() {
		MoveToLocation(WORLD().loc.Plains.Crossroads, {minute: 30});
	}
));
FarmLoc.Fields.links.push(new Link(
	"Barn", true, true,
	null,
	function() {
		MoveToLocation(FarmLoc.Barn, {minute: 5});
	}
));

//
// Gwendy's barn
//
FarmLoc.Barn.description = function() {
	Text.Add("Barn.");
	Text.NL();
}
FarmLoc.Barn.links.push(new Link(
	"Fields", true, true,
	null,
	function() {
		MoveToLocation(FarmLoc.Fields, {minute: 5});
	}
));
FarmLoc.Barn.links.push(new Link(
	"Loft", true, true,
	null,
	function() {
		MoveToLocation(FarmLoc.Loft, {minute: 5});
	}
));

//
// Gwendy's loft
//
FarmLoc.Loft.SaveSpot   = "GwendysLoft";
FarmLoc.Loft.safe       = function() { return true; };
FarmLoc.Loft.description = function() {
	Text.Add("Gwendy's loft. ");
	Text.NL();
}
FarmLoc.Loft.links.push(new Link(
	"Climb down", true, true,
	null,
	function() {
		MoveToLocation(FarmLoc.Barn, {minute: 5});
	}
));

FarmLoc.Loft.SleepFunc = function() {
	let party : Party = GAME().party;

	var parse : any = {

	};

	SetGameState(GameState.Event, Gui);

	Text.Clear();

	//TODO
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("You head off to bed", parse);
	Text.NL();
	Text.Add("", parse);

	Text.Flush();

	var func = function(dream : any) {
		TimeStep({hour: 8});
		party.Sleep();

		if(LaylaScenes.FarmMeetingTrigger(false)) return;

		//TODO
		Text.Add("You wake up, feeling rested and refreshed.", parse);

		Text.Flush();
		Gui.PrintDefaultOptions(true);
	}

	Gui.NextPrompt(function() {
		Text.Clear();

		DreamsScenes.Entry(func);
	});
}


export namespace FarmScenes {
    
};


export { FarmLoc };
