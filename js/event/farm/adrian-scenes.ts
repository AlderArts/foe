import * as _ from "lodash";
import { GetDEBUG } from "../../../app";
import { BreastSize } from "../../body/breasts";
import { EncounterTable } from "../../encountertable";
import { Sex } from "../../entity-sex";
import { EntityStorage, GAME, TimeStep, WORLD, WorldTime } from "../../GAME";
import { Gui } from "../../gui";
import { IChoice } from "../../link";
import { Rigard } from "../../loc/rigard/rigard";
import { ILocation } from "../../location";
import { GP } from "../../parser";
import { Party } from "../../party";
import { Text } from "../../text";
import { Time } from "../../time";
import { Player } from "../player";
import { Adrian } from "./adrian";
import { AdrianFlags } from "./adrian-flags";
import { Gwendy } from "./gwendy";

export namespace AdrianScenes {
    export function _AdrianState() {
        const adrian: Adrian = GAME().adrian;
        const Shy = adrian.flags.Met === AdrianFlags.Met.Shy;
        const Dom = adrian.flags.Met === AdrianFlags.Met.Dom;
        const Sub = adrian.flags.Met === AdrianFlags.Met.Sub;
        const slut = adrian.Slut() >= 30 && adrian.Slut() > adrian.Relation();
        const friend = adrian.Relation() >= 30 && adrian.Relation() >= adrian.Slut();
        const Taunted = (adrian.flags.Flags & AdrianFlags.Flags.Taunted) !== 0;
        const Humiliated = (adrian.flags.Flags & AdrianFlags.Flags.Humiliated) !== 0;
        const Encouraged = (adrian.flags.Flags & AdrianFlags.Flags.Encouraged) !== 0;
        const Seduced = (adrian.flags.Flags & AdrianFlags.Flags.Seduced) !== 0;
        const SeducedGwendySaw = (adrian.flags.SeduceCnt >= 3);
        const jealous = adrian.Jealousy() >= 30 || Taunted;
        return { Shy, Dom, Sub, Seduced, SeducedGwendySaw, Taunted, Humiliated, Encouraged, slut, friend, jealous };
    }

    export function AdrianDesc(location: ILocation) {
        const adrian: Adrian = GAME().adrian;
        const world = WORLD();
        // Workday (Fields)
        if (adrian.IsAtLocation(location) && location === world.loc.Farm.Fields) {
            Text.Out(`Adrian is tirelessly working in the fields. The horse morph looks unperturbed despite the heavy labor. ${GP.season(
                `He’s shirtless, allowing you to fully appreciate his well defined muscles`,
                `His shirtless, muscular upper body is glistening in the warm rays of the sun`,
                `You can see the outline of his muscles flexing beneath his sleeveless roughspun shirt`,
                `Despite the cold weather, he wears relatively light clothing, allowing you to appreciate his well defined muscles`)}.`);
            Text.NL();
        // Workday (Barn)
        } else if (location === world.loc.Farm.Barn) {
            if (adrian.IsAtLocation(location)) {
                if (adrian.IsAsleep()) {
                    Text.Out(`Adrian appears to have retired to his quarters for the night.`);
                } else {
                    Text.Out(`Adrian is moving about the barn, hard at work. As usual, he’s misplaced his shirt somewhere. No one seems to be complaining about it.`);
                }
                Text.NL();
            }
        }
    }

    // tslint:disable-next-line: variable-name
    let _sexed: boolean;
    // tslint:disable-next-line: variable-name
    let _denial: boolean;

    export function Approach() {
        const player: Player = GAME().player;
        const pc = player.Parser;
        const adrian: Adrian = GAME().adrian;
        const first = adrian.flags.Met === AdrianFlags.Met.NotMet;
        const { Dom, Sub, jealous, friend, slut } = _AdrianState();

        _sexed = false;
        _denial = false; // TODO: Retain?

        Text.Clear();
        if (first) {
            Text.Out(`Deciding to try talking to Gwendy’s stoic and silent equine farmhand again, you wander over to where Adrian is toiling away at his tasks. The horse morph stiffens slightly as you wave to him, giving you a sidelong glance, but no response to your greeting. Just when things start to turn uncomfortable, he shifts his considerable bulk, putting down the tools of his trade and slowly turning to face you. He wipes the sweat from his brow, momentarily allowing you a glimpse of his eyes before his shaggy mane covers them again. They are a dark brown, bordering on black.

            “…Gwendy told you to help me again?” You shake your head, saying that you just wanted to talk with him for a bit. The farmhand shuffles his hooves, looking at a loss. “…About?”

            This is going to be a bit more difficult than you thought.`);

            adrian.flags.Met = AdrianFlags.Met.Shy;
        } else if (Dom) {
            Text.Out(`Adrian gives you a gruff grunt as you approach, putting down what he’s currently working with. The muscular stallion turns slowly, a slow smile playing on his lips. “Hey, ${pc.name}. Fancy seeing you around.”`);
        } else if (Sub) {
            Text.Out(`Adrian flutters an uncertain look in your direction as you approach, fidgeting nervously. “H-Hey… Did you need me for s-something?” The passive equine blushes, trying and failing to not sound eager about your potential plans for him.`);
        } else if (jealous) {
            Text.Out(`The shy equine farmhand gives you a guarded look as you approach, and doesn’t acknowledge you with more than a grunt.`);
        } else if (friend) {
            Text.Out(`The shy equine farmhand graces you with a nod as you approach. “Hey… ${pc.name}.” You wait for him to follow up on that thought, but he doesn’t. Eventually, he puts down what he’s working with, turning to you.`);
        } else if (slut) {
            Text.Out(`The shy equine farmhand blushes and looks away as you approach. “H-Hey…” he falters, pausing in his work, seemingly distracted by your presence. Even having acknowledged you, the muscular horse morph doesn’t meet your eyes.`);
        } else { // Shy
            Text.Out(`The stoic equine farmhand doesn’t look up from his tasks as you approach; you gain a grunt of acknowledgement, but not much else. You watch him for a little bit before he seems to become uncomfortable, pausing in his work. “Yes?”`);
        }

        if (GetDEBUG()) {
            const state = adrian.flags.Met;
            const Dom = state === AdrianFlags.Met.Dom;
            const Sub = state === AdrianFlags.Met.Sub;
            Text.NL();
            Text.Out(`<b>DEBUG: State = ${Dom ? `Dom` : Sub ? `Sub` : `Shy`}

            relation: ${adrian.Relation()}

            DEBUG: jealousy: ${adrian.Jealousy()}

            DEBUG: slut: ${adrian.Slut()}</b>`);
            Text.NL();
        }

        Prompt();
    }

    export function Prompt() {
        const player: Player = GAME().player;
        const pc = player.Parser;
        const adrian: Adrian = GAME().adrian;
        const { Shy, Dom, Sub, jealous, friend, slut, Seduced } = _AdrianState();
        Text.Flush();

        let options: IChoice[] = [
            {
                nameStr : `Talk`,
                func : () => {
                    Text.Clear();
                    if (Dom) {
                        Text.Out(`“Yeah?” The stallion flicks his ear as he reclines. “Go on.”`);
                    } else if (Sub) {
                        Text.Out(`“O-Oh… what did you want to t-talk about?” Adrian lowers his eyes, awaiting your reply.`);
                    } else if (jealous) {
                        Text.Out(`“…If you’re quick about it. I got… things to do.” Adrian looks away from you.`);
                    } else if (friend) {
                        Text.Out(`“What… did you want to talk about?” Adrian flicks his ear, looking to you.`);
                    } else if (slut) {
                        Text.Out(`“A-Ah. Of course. Talk.” Adrian shuffles his hooves. “What… did you want to talk about?”`);
                    } else { // Shy
                        Text.Out(`There’s a long silence to your request. Finally, Adrian gives a shrug. “…Sure.”`);
                    }
                    TalkPrompt();
                }, enabled : true,
                tooltip : `Attempt to engage Adrian in conversation.`,
            }, {
                nameStr : `Work`,
                func : () => {
                    Text.Clear();
                    Work();
                }, enabled : adrian.workTimer.Expired(),
                tooltip : `Gwendy needs help around the farm, and maybe the best way to get closer to the stoic equine is to help him out in his work?`,
            }, {
                nameStr : `Flirt`,
                func : () => {
                    Text.Clear();
                    Text.Out(`You purse your ${pc.lips}, eyeing the ${Dom ? `stallion` : `stoic farmhand`} up and down speculatively.`);
                    Text.NL();
                    if (Dom) {
                        Text.Out(`“See something you like?” Adrian smirks back, enjoying your attention.`);
                    } else if (Sub) {
                        Text.Out(`“U-Uhm, ${pc.name}?” Adrian blushes under your gaze, shuffling his hooves nervously.`);
                    } else { // Shy
                        Text.Out(`“W-What?” Adrian flicks his tail nervously.`);
                    }
                    FlirtPrompt();
                }, enabled : true,
                tooltip : `The farmhand is doing such hard work… why don’t you… encourage him a bit?`,
            },
        ];

        if (Seduced || !Shy) {
            options = _.concat(options, {
                nameStr : `Sex`,
                func : () => {
                    Text.Clear();
                    if (Dom) {
                        Text.Out(`“Some fun, eh?” The stallion flashes you a knowing grin. “Always. Anything… specific you had in mind?” Adrian gently caresses your side, his hand settling on your ${pc.butt} and giving it a familiar squeeze.`);
                    } else if (Sub) {
                        Text.Out(`“A-Ah… i-if you want to…” Adrian blushes, making only a token attempt to hide his excitement. “W-What shall we… do?” He certainly seems up for a bit of fun.`);
                    } else if (adrian.Jealousy() >= 50) {
                        Text.Out(`“F-Fuck off.” Adrian growls. “If you’re just going to make fun of me, I have better things to do.” With that, he walks away, looking sour.`);
                        Text.Flush();
                        adrian.interactTimer = new Time(0, 0, 0, 3, 0);
                        Gui.NextPrompt();
                        return;
                    } else { // Shy
                        Text.Out(`“W-What did you have in mind…?” Adrian shuffles his hooves, blushing at your proposition. Just a bit of suggestion and he’ll be putty in your ${pc.hand}s.`);
                    }
                    SexPrompt();
                }, enabled : true,
                tooltip : `So… is the ${Dom ? `stallion` : `farmhand`} up for a bit of fun?`,
            });
        }
        if (GetDEBUG()) {
            options = _.concat(options, [{
                nameStr : `RESET`,
                func : () => {
                    Text.Clear();
                    Text.Out(`<b>Warning! This is a debug option intended for testing, it will reset Adrian's state! Proceed?</b>`);
                    Text.Flush();
                    const debugOpts: IChoice[] = [
                        {
                            nameStr: `Yes, reset`,
                            func: () => {
                                Text.Clear();
                                Text.Out(`Just like that, Adrian forgets about all of your prior interactions...`);
                                Text.Flush();

                                const adrian: Adrian = GAME().adrian;
                                // Restore player/party
                                _.remove(EntityStorage(), (e) => {
                                    return e === adrian;
                                });
                                GAME().adrian = new Adrian();
                                EntityStorage().push(GAME().adrian);

                                Gui.NextPrompt();
                            }, enabled: true, tooltip: `Yes, reset horsie.`,
                        },
                        {
                            nameStr: `No, abort`,
                            func: () => {
                                Text.Clear();
                                Text.Out(`Adrian gives you a nervous look. “W-What are you playing around with there, ${pc.name}?”`);
                                Prompt();
                            }, enabled: true, tooltip: `No, leave horsie as he is.`,
                        },
                    ];
                    Gui.SetButtonsFromList(debugOpts);
                }, enabled : true,
                tooltip : ``,
                },
            ]);
        }
        /* TODO
            {
                nameStr : `Talk`,
                func : () => {
                    Text.Clear();
                    Text.Out(``);
                    TalkPrompt();
                }, enabled : true,
                tooltip : ``,
            }
        */

        Gui.SetButtonsFromList(options, true, () => {
            Text.Clear();
            Text.Out(`You bid Adrian farewell, stating that you have other business to attend.`);
            if (Dom) {
                Text.NL();
                Text.Out(`${_sexed || _denial ? `“See you around… and come back when you want some more fun.” The stallion flashes you a knowing grin. He’s certainly changed from when you first met him.` : `“Later, then.” The stallion gives you a nod, returning to what he was doing prior to your intrusion.`}`);
            } else if (Sub) {
                Text.NL();
                Text.Out(`${_sexed ? `“T-Thank you… for, you know,” he mumbles, blushing. “W-We could… do that again sometime?” You scratch him behind the ear, assuring him that you’ll be back for more later.` : _denial ? `“B-Bye,” he mumbles, blushing. You can see him still pitching a tent from your teasing; he’s no doubt going to run off somewhere to take care of that on his own. You give him a sly smile, brushing against him as you head out.` : `The horse morph nods, blushing slightly as you brush against him heading off. “I-I should get back to work.” He looks a bit disappointed to see you leave so soon.`}`);
            } else {
                Text.Out(` ${_sexed || _denial ? `The horse morph blushes as you brush against him. “S-See you around…” You grin. You definitely will.` : `The horse morph gives you a non-committal grunt, returning to what he was doing prior to your intrusion.`}`);
            }
            Text.Flush();
            Gui.NextPrompt();
        });
    }

    export function Work() {
        const adrian: Adrian = GAME().adrian;
        const player: Player = GAME().player;
        const pc = player.Parser;
        const { Dom, Sub, Shy, Seduced, jealous, friend } = _AdrianState();

        let variations = [
            `At your inquiry whether he needs help, Adrian gives you a wordless nod, gesturing for you to join him in his tasks.`,
            `Adrian replies to your offer of help with a wordless nod, gesturing for you to follow after him.`,
            `The equine farmhand looks like he could use some help. After briefly considering your offer, Adrian gestures for you to follow.`,
        ];
        if (Shy && jealous) {
            variations = _.concat(variations, [
                `“…Just don’t get in the way, got it?” Without another word, Adrian trudges off, gesturing for you to follow.`,
                `“Not that I need the help… but fine. Grab that, will you?” Adrian instructs you, his tone of voice expressing clear doubt in your abilities.`,
                `“…Fine. This way.” Without another word, he turns his back on you and trudges off. You follow, somewhat miffed at his attitude.`,
            ]);
        }
        if (Dom || (Shy && friend)) {
            variations = _.concat(variations, [
                `“Nice timing… need some help with something. You up for it?” Adrian turns and gestures for you to follow him.`,
                `“${pc.name}, give me a hand here?” Adrian motions you closer.`,
                `“Come here, ${pc.name}. I could use a hand.” Adrian waves you over, indicating the task.`,
            ]);
        }
        if (Dom) {
            variations = _.concat(variations, [
                `“I need you for something. We can chat more after, come along.” With that, Adrian trudges off, leaving you to scamper after him.`,
                `“Mind helping out for a bit?” Adrian puts a familiar hand on your back, gently nudging you along. “This’ll take a while, but afterward, if you’re up for it, maybe we could… Well, time enough for that later.”`,
            ]);
        }
        if (Sub) {
            variations = _.concat(variations, [
                `“S-So… I could use some help… do you think…?” Adrian shuffles on his hooves nervously.`,
                `The equine farmhand looks a little crestfallen, so you inquire why. “W-Well, you see…” Adrian goes on to tell you about some tasks that he needs to complete, but he’s running behind. “P-Please, could you help? Mistress Gwendy will be f-furious…”`,
                `“I s-should get back to work. You shouldn’t l-loiter either, Mistress Gwendy will… punish us.” Though Adrian doesn’t look like he’s averse to the prospect, he nonetheless insists on enlisting your help in his chores.`,
            ]);
        }
        Text.Out(_.sample(variations));
        Text.NL();
        _.sample([
            () => {
                Text.Out(`You spend some time helping him move ${_.sample([`seemingly endless bales of hay`, `a pile crates packed with produce`, `a rather large tree that has fallen on the fields`])}, the two of you grunting and straining with the effort. Before long, you are clammy with sweat from the hard work.`);
            }, () => {
                Text.Out(`Handing you a pitchfork, he guides you in cleaning up a number of the empty stalls in the barn. It’s rough and smelly work, but you bite down, determined to do as well as the equine farmhand.`);
            }, () => {
                Text.Out(`Together, the two of you toil in the fields for several hours, and by the end of it your arms are aching from the hard work. The farmhand seems as stoic as ever, though you do catch a hint of gratitude in easing his burden.`);
            }, () => {
                Text.Out(`The two of you spend a few hours performing some much needed repairs on the farm, patching up the barn and mending a broken fence. The equine appears to be quite handy with a hammer, though he’s clearly no master carpenter.`);
            },
        ])();
        Text.NL();
        adrian.relation.IncreaseStat(50, 3);
        adrian.relation.IncreaseStat(100, 4);

        let walkoff = false;

        const scenes = [() => {
            Text.Out(`“…Not like that. Here, like so…” Seeing you flounder, Adrian patiently leads you through the tasks at hand, showing you some simple tricks to help you work more efficiently. When you thank him and comment on how knowledgeable he is, he blushes faintly.

            “‘S not much…” He pauses, wiping his brow. “Besides, if you botched it, I’d have to do it over again.” The tall equine flexes his shoulders, muscles rearranging themselves like a wave across his back. “Stick around long enough, you’ll learn it.”`);
        }, () => {
            Text.Out(`As you work, you ply Adrian with questions about the farm, and though he’s initially reluctant to answer, the farmhand eventually relents. “Gwendy taught me most of this herself… she grew up here, taught by her old man in turn. Never met him.” The morph slowly chews on a straw, pondering life.

            “Some, I learnt back home.” You wait to see if there’s more, but the equine seems socially spent for the time being. Maybe you can get him to share more next time.`);
        }, () => {
            Text.Out(`Before, he mentioned his home. What was that place like?

            “Village up in the hills, far from the big city,” Adrian grunts. “Called Horkhan. Named after… doesn’t matter.” He toils along you for some time in silence. “Most the other youths wanted to become warriors. Wasn’t for me.”`);
            Text.NL();
            if (Seduced) {
                Text.Out(`That’s where the girlfriend he mentioned was from as well?

                “W-Wha…?” Adrian’s cheeks flush. “…Yes.” He doesn’t seem to want to elaborate further, and you’re eventually forced to change the topic.`);
                adrian.slut.IncreaseStat(100, 1);
                Text.NL();
            }
            Text.Out(`Does he ever think about going back?

            “Don’t have much tying me to that place. Mum and Dad are long gone. ‘Sides, I’m needed here.” He wipes his brow, looking off into the distance. “Heard about… trouble in that direction as of late. Talk of some kind of warlord, I think.”`);
        }, () => {
            Text.Out(`Before you part, you ask the farmhand about his time here on the farm.

            “Went out the highlands with not much to my name, no skill to ply… Tried finding work, but wasn’t until I reached the farm that I stayed on for more than a week or two. Been here since. Like it here.”

            For one of so few words, that surely is high praise, indicative of his opinion of this place.`);
        }, () => { // REPEAT
            Text.Out(`Just as you are finishing up, you strike a conversation with the farmhand, and the topic finds its way to the farm owner herself, Gwendy. `);
            if (Dom) {
                Text.Out(`“Soon as I laid eyes on her, I knew I wanted her… just couldn’t say it. Seems silly now, all things considered.” He chuckles, blushing faintly.

                “I used to be hung up on a lot of things. I think I’m starting to get over it, though.”

                You’d say he’s getting there, certainly.

                “As for Gwendy… the girl means the world to me. She’s always been the strong one for those around her… I’ll continue supporting her.”`);
            } else if (Sub) {
                Text.Out(`“M-Mistress Gwendy was very k-kind in taking me in… No one else wanted to p-put up with me, said I was w-weird…” He trails off.

                And is he happy with how things turned out, in the end?

                “U-Uhm…” He blushes brightly. “Y-Yes! As long as I can b-be with her… I don’t mind h-how…” Adorable.`);
            } else if (jealous) {
                Text.Out(`“…Don’t think she’s just some gal. She held this place together, alone, for years.” Adrian’s tone is flat. “Many tried to take advantage of her… she always comes out on top. Always.”`);
                walkoff = true;
            } else { // Shy
                Text.Out(`“Miss Gwendy… she’s…” Adrian falters, stumbling on his words. “I want to… support her, however I can. I want…” He shakes himself, clearing his head.

                He wants… what?`);
                Text.NL();
                if (adrian.flags.EPlus === AdrianFlags.EPlus.NotStarted && adrian.Relation() >= 50) {
                    Text.Out(`He looks at you thoughtfully. “I… n-need to talk with you about something, when you have time.” His gaze flickers about nervously. “Not now. Find me later.”`);
                } else {
                    Text.Out(`“N-Nevermind…”`);
                }
            }
        }];

        const sceneId = adrian.flags.TalkWork;
        if (sceneId < scenes.length - 1) { adrian.flags.TalkWork = sceneId + 1; }

        // Play scene
        scenes[sceneId]();

        Text.NL();
        Text.Out(walkoff ? `On that somewhat ominous note, Adrian gets up and leaves.` : `Adrian gives you a nod before heading off on other duties.`);

        Text.Flush();

        TimeStep({hour: 3});
        // Set timer for next day
        adrian.workTimer = new Time(0, 0, 0, 24 - WorldTime().hour);

        Gui.NextPrompt();
    }

    export function TalkPrompt() {
        const adrian: Adrian = GAME().adrian;
        const { Dom, Sub, jealous, friend, slut } = _AdrianState();
        Text.Flush();
        const options: IChoice[] = [{ nameStr : "Farm",
            func : () => {
                Text.Clear();
                Text.Out(`“…Hmm.”

                For a while, this is the only response you glean from him. Adrian stares off into the distance, slowly chewing on a straw. “…Came down from the highlands few years back, looking for work. Found it. Lived here for some time now.”

                …

                “…”

                …

                “…It’s nice.”`);
                Text.NL();
                if (Dom) {
                    Text.Out(`Especially with the perks that come with the job?

                    “Can’t lie. I certainly don’t mind it.” The muscular farmhand flashes you a grin. “I came to earn a living… but Miss Gwendy is what made me stay on. She took care of me… now it’s my turn to take care of her.”`);
                } else if (Sub) {
                    Text.Out(`Nice is all it is?

                    “W-Well…” The farmhand blushes, his tail swishing nervously. “Mistress Gwendy… she takes g-good care of me…”

                    Well, there’s no doubt about that. It sounds like Adrian has found his place.`);
                } else { //
                    Text.Out(`He doesn’t look like he’s going to volunteer anything else.`);
                }
                adrian.relation.IncreaseStat(10, 1);
                TimeStep({minute: 10});
                TalkPrompt();
            }, enabled : true,
            tooltip : "Ask Adrian about the farm, what he thinks of it and how he came to be here.",
        }, { nameStr : "Gwendy",
            func : () => {
                Text.Clear();
                if (Dom) {
                    Text.Out(`“Miss Gwendy has had it rough… I wanna help ease her burden.” Adrian flexes his muscles subconsciously, smiling as he stares off into the distance. “She’s… put much in this farm. I’m going to make it so that she succeeds.”

                    And on a more… personal level?

                    “…She seems to like having me around.” Subtle humor there from the stoic farmhand. Gwendy’s hardly been able to keep her eyes off him since the changes occurred. “Been helping her… relieve some stress.” He at least has the decency to blush.`);
                } else if (Sub) {
                    Text.Out(`As soon as the topic turns to the futa farmgirl, Adrian starts fidgeting, shuffling his hooves nervously. He looks around, just on the off chance that she’s within hearing.

                    “Uhm… Mistress Gwendy i-is…”

                    Yeah?

                    “…S-She’s always been there for me. I n-need to show her my g-gratitude.”

                    You smirk at that. Funny way he has of showing gratitude. He shirks a bit under your scrutiny, flicking some hair out of his eyes. He certainly doesn’t seem to mind his new duties.

                    “Y-Yeah…” He blushes. “S-Serving unde- with! With… Mistress is… what I want to d-do.”

                    It’s perhaps not what the shy farmhand was hoping for when he came here to the farm and got to know Gwendy, but he nonetheless seems to have embraced their new relationship.`);
                } else if (jealous) {
                    Text.Out(`“W-What about her?” Adrian gives you a sidelong glance, eyes narrowing.

                    Well… what does he think about her?

                    “…I think she’s strong. Dependable. Knows who her true friends are.”

                    With the almost hostile way Adrian is looking at you, it might be best to not continue this line of questioning at the moment.`);
                } else if (friend) {
                    Text.Out(`“She’s… always been there for me ’n the others.” Adrian gives you a wistful smile. “Miss Gwendy… she always pours her heart into everything she does. I… I want to help her succeed.”

                    Must not be the easiest, considering the state of the farm. What about on a more personal level? What does he think of her as a person?

                    “I-I… uh…” The farmhand falters, suddenly self-conscious. “T-There’s always work to do on the farm… we don’t… talk like that, often. S-She’s always been nice to me though!”

                    His feelings couldn’t have been more obvious even if he had them tattooed to his forehead, though it doesn’t look like he’s mustered the courage to confess them to the unwitting farmgirl as of yet.`);
                } else if (slut) {
                    Text.Out(`“She… Miss Gwendy is…” Adrian squirms a bit under your gaze. “I’ve always admired her conviction… and how easily she expresses herself. I wish I could…” He looks away, blushing.

                    His feelings couldn’t have been more obvious even if he had them tattooed to his forehead, though it doesn’t look like he’s mustered the courage to confess them to the unwitting farmgirl as of yet.

                    …He wishes he could what? Tell her how he feels?

                    “Uhm… I-I don’t think… she thinks of me t-that… way. N-Not like you do.”`);
                } else { //
                    Text.Out(`“…She’s nice. Works very hard.” Adrian blows a lock of hair out of his eyes. It slowly flutters back to where it was. “Always treated me and the others good.”

                    …Just good?

                    The farmhand stares at you blankly. You shrug, dropping the subject. For now, he doesn’t seem comfortable sharing more with you.`);
                }
                adrian.relation.IncreaseStat(10, 1);
                TimeStep({minute: 10});
                TalkPrompt();
            }, enabled : true,
            tooltip : Dom ? `Ask Adrian about Gwendy and their relationship.` : Sub ? `Ask Adrian about his Mistress.` : `Ask Adrian about the owner of the farm, Gwendy.`,
        }, /* TODO { nameStr : "Talk",
            func : () => {
                Text.Clear();
                Text.Out(``);
                TimeStep({minute: 10});
                TalkPrompt();
            }, enabled : true,
            tooltip : "",
        }*/];

        Gui.SetButtonsFromList(options, true, () => {
            Text.Clear();
            Text.Out(`Having no further questions, you turn the conversation to other topics.`);
            Text.NL();
            if (Dom) {
                Text.Out(`“Had something specific in mind?” The stallion gives you a knowing smile, his muscles flexing as he shifts his weight.`);
            } else if (Sub) {
                Text.Out(`“Ah, w-what else did you want with me…?” Adrian shuffles his hooves, throwing a furtive glance at you.`);
            } else { //
                Text.Out(`The equine merely shrugs.`);
            }
            Prompt();
        });
    }

    export function FlirtPrompt() {
        const player: Player = GAME().player;
        const pc = player.Parser;
        const adrian: Adrian = GAME().adrian;
        const gwendy: Gwendy = GAME().gwendy;
        const { Shy, Dom, Sub, jealous, Encouraged, Taunted, Seduced } = _AdrianState();
        Text.Flush();

        let options: IChoice[] = [
            { nameStr: `Compliment`,
                func: () => {
                    Text.Clear();
                    let variations = [
                        `The farmhand sure is dependable. Gwendy sure is lucky to have such a resourceful, loyal and handsome fellow in her employ. Who knows what state the farm would be in without his presence?`,
                        `From what you’ve seen, the farmhand works tirelessly on the farm, always throwing Gwendy a helping hand when she needs one. Seems like his glistening muscles are always the first things to greet you when you arrive here.`,
                        `The farmhand seems a natural at this kind of work; strong, tireless and dependable. From what you’ve seen, he very seldom takes a break from his work, yet you’ve never seen him complain. You’re sure that everyone on the farm, including Gwendy herself, really appreciates everything he does.`,
                    ];
                    if (Dom) {
                        variations = _.concat(variations, [
                            `The farmhand was always strong and dependable, but since the changes, he’s truly become a pillar here at the farm. Whether it’s hard work or… easing tension, the stallion never fails to be there for everyone else.`,
                            `There can’t be any doubts that the farmhand is the hardest worker here on the farm… in more ways than one. Not that you think any of the girls here mind, rather the opposite.`,
                        ]);
                    }
                    if (Sub) {
                        variations = _.concat(variations, [
                            `With Adrian here, Gwendy surely has no need for worry. A tireless worker, a loyal companion and a sexy little plaything when the urge strikes her… she got herself quite a catch.`,
                            `The equine farmhand is doing so much work for the farm, both in keeping it up and running and in keeping his mistress in high spirits.`,
                        ]);
                    }
                    Text.Out(_.sample(variations));
                    Text.NL();
                    if (Dom) {
                        Text.Out(_.sample([
                            `“Thanks, ${pc.name}. You’re not so bad yourself, you know?” Adrian throws you a smile.`,
                            `“Such a flatterer.” Adrian grins at you. “Not that I mind.”`,
                            `“Appreciated.” Adrian gives you a sidelong smile. “If you got something more on your mind tho… don’t hesitate. Lately, when I get such praise from others, the follow-up has been quite… enjoyable.”`,
                            `“Thanks, ${pc.name}.” The formerly shy equine barely bats an eye accepting your compliment. “Gotta do what I can to help Gwendy, you know?”`,
                            ]));
                    } else if (Sub) {
                        Text.Out(_.sample([
                            `“Mm… t-thanks, ${pc.name}.” Adrian blushes prettily. “Y-You are exaggerating…”`,
                            `“A-Ah… it’s not like I’m that g-great…” Adrian blushes, looking away from you.`,
                            `“I-I just want to help her… y-you know?” Adrian blushes. You’re sure that Gwendy frequently appreciates a hand, and more than that, from the timid equine.`,
                            `Adrian blushes and bows his head to you. “T-Thanks…” He flicks his tail, almost like a puppy who got a treat.`,
                            ]));
                    } else {
                        let reply = [
                            `“Uhh… thanks?” Adrian blinks at your comment, flicking his ear. He looks somewhat pleased.`,
                            `“…” Adrian blushes faintly at your comment and looks away.`,
                            `“O-Oh… thanks. I think.” Adrian gives you a sidelong glance, flicking his tail nervously.`,
                        ];
                        if (jealous) {
                            reply = _.concat(reply, [
                                `“…I should get back to work.” Adrian blushes faintly as he turns away from you.`,
                                `“…” Adrian eyes you suspiciously, as if trying to find a hidden barb in your compliment. When no jab follows, he turns back to his tasks.`,
                            ]);
                        }
                        Text.Out(_.sample(reply));
                    }
                    adrian.slut.IncreaseStat(20, 2);
                    TimeStep({minute: 10});
                    FlirtPrompt();
                }, enabled: true, tooltip: `Express your appreciation of Adrian’s hard work and handsome looks.`,
            }, { nameStr: `Tease`,
                func: () => {
                    Text.Clear();
                    let variations = [
                        `Seeing Adrian’s bulging muscles up close like this makes you appreciate why he so seldom wears a shirt. Quite a sly devil he is. Quite possibly, the denizens of the farm wouldn’t mind him taking off a little more if the heat becomes ‘too much’. You sure wouldn’t, and you tell him as much.`,
                        `Such a strapping fellow as Adrian must cause quite a stir on the farm. It’s a wonder anyone else gets any work done, with him wandering around shirtless all over the place.`,
                        `So… does Adrian get a lot of propositions, flaunting that body of his so casually? Those chiseled abs of his should be enough to give anyone pause, and equines… well, let’s just say they have a reputation in the downstairs department.`,
                    ];
                    if (Shy) {
                        variations = _.concat(variations, [
                            `With a mysterious smile, you watch Adrian for a while as he works, finally prompting a response from the taciturn farmhand: “W-What?” Oh, nothing, just enjoying the view. Surely you are not the first one to appreciate his chiseled body?`,
                        ]);
                    } else if (Sub) {
                        variations = _.concat(variations, [
                            `You blatantly eye Adrian up and down, whistling appreciatively. As equines go, he’s quite the specimen… muscles strong enough to pull a plow, abs you could chop wood on, an ass chiseled by a sculptor. A feast for the eyes.`,
                            `Hehe… you can see why Gwendy ‘appreciates’ Adrian so much. Despite a muscular frame that would look intimidating on anyone else, there’s something about him that just screams ‘prey’. The equine shifts nervously as you trail a finger down his chiseled side, your ${pc.hand} coming to rest on his butt. Truly delectable.`,
                        ]);
                    } else if (Dom) {
                        variations = _.concat(variations, [
                            `Mm… with a body like this, there’s no question why Adrian draws eyes wherever he goes. You lick your lips as your gaze wanders his body, appreciating his well defined muscles and handsome mane of hair. Eventually, you realize you are staring at the sizable bulge on his crotch, mesmerized. “Something caught your eye, ${pc.name}?” Yes, something has.`,
                            `You have to wonder… with his new, more liberated view on sex, and everyone looking to get a piece of him… does he ever get anything done anymore? Adrian throws you a smile. “It’s not that bad. They tend to need some time to recover in between.” Touché.`,
                        ]);
                    }
                    Text.Out(_.sample(variations));
                    Text.NL();
                    if (Dom) {
                        Text.Out(_.sample([
                            `The stallion chuckles. “Such words would have made me blush not that long ago.” He grins, his muscles flexing subconsciously as he shifts his weight. “Doesn’t bother me too much no more… it’s nice to be appreciated.”`,
                            `“Heh. If I didn’t know better, I’d think you were coming on to me, ${pc.name}.” Adrian holds your gaze for a while, eventually forcing you to avert your eyes. “Are you? If so, no need to beat around the bush so much… there’s too much work to waste time on idle chit-chat.”`,
                            `The equine gives you a mock bow. “I live to serve.”`,
                            `The stallion endures your admiring gaze unperturbed, even going as far to pause in his work and stretch, making the muscles of his arms and chest ripple. The sight is hypnotizing. “Hmm? Did you ask something?” You shake yourself back to reality. Right… what did you want again?`,
                            ]));
                    } else if (Sub) {
                        Text.Out(_.sample([
                            `The farmhand blushes brightly, shuffling his hooves. He hastily steps past you, stammering that he needs to fetch something. You smile coyly as you look after him. As he goes to retrieve some random object, he bends over and arches his back prettily for you. You’re not sure if it’s on purpose or if he does it subconsciously. Either way, it’s a nice view.`,
                            `The farmhand tries to stammer a reply, but fails to form anything resembling coherency. Instead, he contents himself with blushing prettily, giving you an embarrassed smile. Good boy.`,
                            `“Ah… uhm…” The farmhand falters, blushing and lowering his eyes rather than answering. The way he squirms is really cute, and no one has even shoved a cock up his ass. Yet.`,
                            ]));
                    } else { // Shy
                        let reply = [
                            `“Y-You’ve got it wrong…” The farmhand blushes, looking away from you.`,
                            `“I-I… uhm…” The farmhand stammers, taken aback by your blatant flirting. “T-That’s not how it is…”`,
                            `For a moment, the farmhand just gapes at you. Finally catching his tongue, he mutters something about you speaking nonsense, very pointedly avoiding your eyes.`,
                        ];
                        if (jealous) {
                            reply = _.concat(reply, [
                                `“N-Not everyone thinks like that!” The farmhand snaps, shuffling his hooves uncomfortably. He avoids meeting your eyes, but can’t hide his red cheeks from you.`,
                            ]);
                        }
                        Text.Out(_.sample(reply));
                    }
                    adrian.slut.IncreaseStat(30, 3);
                    TimeStep({minute: 10});
                    FlirtPrompt();
                }, enabled: true, tooltip: `Give Adrian some sexual compliments. He’s quite pleasant to the eye after all.`,
            },
        ];

        if (Shy && !Seduced && !Taunted) {
            options = _.concat(options, {
                nameStr : `Seduce`,
                func : Seduction, enabled : true,
                tooltip : `Be more overt and physical in your flirting with the equine farmhand. You’re going to get into his pants one way or the other.`,
            });
        }

        const talkedGwendy = (adrian.flags.Flags & AdrianFlags.Flags.TalkedGwendy) !== 0;
        if (!talkedGwendy) {
            options.push({ nameStr: `Gwendy`,
            func: () => {
                adrian.flags.Flags |= AdrianFlags.Flags.TalkedGwendy;
                Text.Clear();
                Text.Out(`You sidle up to Adrian, watching him work for a while. So… you’ve been wondering. He has the hots for Gwendy?

                “W-What?” The farmhand sputters at the question, completely caught off-guard. “I don’t… W-Why would you s-say that?”`);
                Text.Flush();
                // [Challenge][Encourage][Drop it]
                const opts: IChoice[] = [
                    {
                        nameStr: `Lay claim`,
                        func: () => {
                            Text.Clear();
                            Text.Out(`Please. His infatuation with her is obvious for anyone with eyes to see. Considering how forward Gwendy is, you’d have guessed the two of them would have tousled in the hay at least a few times… but the look on his face tells you this isn’t the case. She turned him down then?`);
                            ClaimEntrypoint();
                        }, enabled: true, tooltip: `You’ve your own designs on Gwendy… and you don’t think the farmhand measures up to much.`,
                    },
                    {
                        nameStr: `Encourage`,
                        func: () => {
                            Text.Clear();
                            Text.Out(`You smoothly brush over your initial comment, saying that you just made an assumption. They do look rather good together, after all.`);
                            EncourageEntrypoint();
                        }, enabled: true, tooltip: `Ah… perhaps you misread the situation. Still, you feel he could use a nudge in the right direction; encourage him to pursue Gwendy.`,
                    },
                    {
                        nameStr: `Drop it`,
                        func: () => {
                            Text.Clear();
                            Text.Out(`Never mind… it’s not important. Perhaps you misread the situation.

                            The rather worried look on Adrian’s face tells you that there’s no way you did, rather you hit the bullseye. You hurry to assure him you won’t share your offhand thought with the farmer herself, which seems to mollify him somewhat.`);
                            FlirtPrompt();
                        }, enabled: true, tooltip: `Never mind… he doesn’t seem comfortable talking about this.`,
                    },
                ];
                Gui.SetButtonsFromList(opts);
            }, enabled: true, tooltip: `You’ve seen Adrian pining after Gwendy like a lost puppy… how’s that working out for him?`});
        } else {
            // Lay claim, Taunt, Encourage
            if (!Taunted) {
                options = _.concat(options, {
                    nameStr: `Lay claim`,
                    func: () => {
                        Text.Clear();
                        Text.Out(`“What?” Adrian gives you a guarded look as you give him a faint smile.`);
                        Text.NL();
                        if (Encouraged) {
                            Text.Out(`Well… you know that chat you had about Gwendy before? You’ve done some thinking, and seeing that he hasn’t really made any moves despite knowing her for so long, you figure that you might as well have a go at it instead. Adrian stares at you, not quite processing what he’s hearing.`);
                        } else {
                            Text.Out(`Oh, nothing much… just that you don’t really buy Adrian’s offhand denouncement as to his aspirations on the farmer. He clearly fancies her.

                            “T-This again?” Adrian snorts, avoiding your gaze.

                            Come now. It’s not exactly hard to see for anyone with eyes that he’s pining after her like a lost puppy. She must have turned him down then? With how forward the farmer is, you’d have guessed the two of them would have tousled in the hay at least a few times… but the look on his face tells you this isn’t the case.`);
                        }
                        ClaimEntrypoint();
                    }, enabled: true, tooltip: `Tell Adrian that you’ve got aspirations on Gwendy, and that you’re not very worried about his own feelings for her.`,
                });
            }
            if (!Sub) {
                options = _.concat(options, {
                    nameStr: `Encourage`,
                    func: () => {
                        Text.Clear();
                        if (Dom) {
                            Text.Out(`So, how are things going between him and Gwendy?

                            ${_.sample([
                                `“Can’t complain.” Adrian gives you a grin. “She’s been quite intense lately. I keep up with her, but only just. She’s quite a woman, she is.” He scratches the back of his head. “Fucking on a regular basis like this isn’t something I’d imagine happening in a thousand years when I first laid eyes on her.”`,
                                `“Much better than I’d ever imagined. That girl… she’s wild.” Adrian gives you a grin. The two of them are a couple, then. “Well… we talked, and both of us want to explore things a bit more… I guess you’d call it an open relationship.” Not words you’d have imagined coming out of his mouth when you first met him. “Me neither.”`,
                                `“Why don’t you ask her?” Adrian grins. “I’ve got nothing to complain about, my side of things. Judging by the things she calls out when we… you know… I’d say she’s enjoying things too.”`,
                                `“Knowing I got a nice warm bed with a nice warm woman in it waiting after a hard days work… works wonders for motivation.” You didn’t think that was ever a problem for him, considering how long he’s stood by Gwendy. “It wasn’t… but I don’t mind the new benefits to the job.”`,
                            ])}`);
                        } else if (Taunted) {
                            Text.Out(`So, how are his aspirations to Gwendy’s heart going? A stud like him has surely made some headway…

                            “Y-You’re just messing with me.” Adrian grumbles, throwing you a glare. “I w-won’t listen to you.”

                            With that, the emotionally stung farmhand turns and trudges away from you, a surly look on his face.`);

                            adrian.slut.IncreaseStat(30, 1);
                            adrian.jealousy.IncreaseStat(20, 1);
                            adrian.relation.DecreaseStat(0, 1);

                            adrian.interactTimer = new Time(0, 0, 0, 3, 0);
                            Text.Flush();
                            Gui.NextPrompt();
                        } else if (!Encouraged) {
                            Text.Out(`You take a seat next to Adrian, pondering how to broach the subject of his feelings for Gwendy. Seeing him pining for her like that without any positive response from her is a bit painful… You nudge him lightly to get his attention.

                            “Hnf?”

                            So… you’ve been thinking a bit about the conversation you had before. You apologize again for making a mistake as to his intentions with Gwendy… it’s just that in your eyes, the two of them would be a good match.`);
                            EncourageEntrypoint();
                        } else { // (Shy, encouraged)
                            Text.Out(`So… how are things between him and Gwendy? Did he bring up what you talked about?

                            “W-Well… I don’t want to, you know, rush things…” Adrian blushes, looking around to verify that Gwendy is out of earshot.

                            You spend some time gently building Adrian’s confidence, though you suspect he might need some more… personal encouragement in order to get over his hangups in regards to the farmgirl.`);

                            adrian.slut.IncreaseStat(30, 2);
                            adrian.relation.IncreaseStat(40, 3);

                            TimeStep({minute: 10});
                            FlirtPrompt();
                        }
                    }, enabled: true, tooltip: `Encourage the farmhand to pursue his romantic feelings for Gwendy.`,
                });
            }
            if (Sub || Taunted) {
                options.push({
                    nameStr: `Taunt`,
                    func: () => {
                        Text.Clear();
                        if (Sub) {
                            const party: Party = GAME().party;
                            Text.Out(`Adrian blushes at your blunt question, lowering his eyes.`);
                            if (gwendy.IsAtLocation(party.location)) {
                                Text.Out(` He starts mumbling a response, before suddenly going very quiet, staring past you. You hear a rustle behind you.

                                “Don’t mind me, go on. What were you about to say?” Gwendy’s teasing tone tells you that she’s well aware; she’s probably been listening in on your conversation. Backed into a corner by the two of you, the submissive farmhand quickly crumbles, haltingly professing how lucky he is to be where he is.

                                “Mm… I think our boy deserves a reward for such honesty, don’t you, ${pc.name}? What say you to a little tousle in the hay?” Gwendy makes the offer casually, her hungry look and tenting pants making it clear that she intends to have some fun even if you decline.`);

                                Text.Flush();
                                // [Threesome][Decline]
                                const opts: IChoice[] = [
                                    {
                                        nameStr: `Threesome`,
                                        func: () => {
                                            // TODO PLACEHOLDER
                                            Text.Clear();
                                            Text.Out(`You smile back at her, nodding. The two of you grab an arm each, hauling the blushing equine back to Gwendy’s loft, where the two of you rip his clothes off and takes turns showing your appreciation for him. By the end of it, the entire place is a mess, and Adrian is barely able to walk.

                                            After cleaning up, you say your farewells to the snuggling pair, heading back out on your adventures.`);

                                            TimeStep({hour: 3});

                                            // TODO
                                            player.OrgasmCum();
                                            adrian.OrgasmCum();
                                            gwendy.OrgasmCum();

                                            // TODO
                                            player.Fuck(undefined, 2);
                                            adrian.Fuck(undefined, 2);
                                            gwendy.Fuck(undefined, 2);

                                            adrian.interactTimer = new Time(0, 0, 0, 3, 0);
                                            gwendy.cleanTimer = new Time(0, 0, 0, 3, 0);

                                            Text.Flush();
                                            Gui.NextPrompt();
                                        },
                                        enabled: true, tooltip: `Share the farmhand with his mistress.`,
                                    },
                                    {
                                        nameStr: `Decline`,
                                        func: () => {
                                            Text.Clear();
                                            Text.Out(`You turn down the offer, having other places to be and other people to do.

                                            “Suit yourself.” Gwendy shrugs amicably before turning to Adrian. “Now… I find myself wanting to hear you elaborate a bit on how devoted to me you really are… up in the loft. Get moving.” She points imperiously, and the farmhand happily scampers to obey, throwing you an apologetic glance. From the way that Gwendy is threatening to punch a hole in her trousers with her erection, you think they’ll be at it for a while.`);

                                            // TODO
                                            adrian.Fuck(undefined, 2);
                                            gwendy.Fuck(undefined, 2);

                                            adrian.interactTimer = new Time(0, 0, 0, 3, 0);
                                            gwendy.cleanTimer = new Time(0, 0, 0, 3, 0);

                                            Text.Flush();
                                            Gui.NextPrompt();
                                        },
                                        enabled: true, tooltip: `Decline the offer, let them have their own fun.`,
                                    },
                                ];
                                Gui.SetButtonsFromList(opts);
                            } else {
                                Text.NL();
                                Text.Out(_.sample([
                                    `“M-Mistress Gwendy treats me r-really good, I don’t have a-anything to complain about…” Oh, you’ve no doubts about that. You’ve seen him doing the funny walk enough to figure that he’s being treated <b>really</b> well by the farmer.`,
                                    `“I… I’m happy with how t-things are. As long as I can b-be with her…” Even if that means being the bottom of their relationship? “E-Even so…” The farmhand blushes even more brightly.`,
                                    `“M-Mistress showed me how I really am… I’m grateful.” Even if he can’t have her for himself? “Ah… G-Gwendy can decide on her own whom she s-sleeps with. I… I don’t mind.” He shuffles his hooves. You’re not so sure he’s telling the truth, but he seems to have accepted to take whatever the farmer gives him. Even if that happens to be a horsecock significantly larger than his own right up the butt.`,
                                    ]));
                                TimeStep({minute: 10});
                                FlirtPrompt();
                            }
                        } else {
                            Text.Out(`Any luck in his romantic aspirations to his employer?

                            “…F-Fuck off.” The farmhand glares at you and trudges off. So touchy.`);

                            adrian.slut.IncreaseStat(30, 1);
                            adrian.jealousy.IncreaseStat(30, 2);
                            adrian.relation.DecreaseStat(0, 5);

                            adrian.interactTimer = new Time(0, 0, 0, 3, 0);
                            Text.Flush();
                            Gui.NextPrompt();
                        }
                    }, enabled: true, tooltip: `Adrian’s still pining after Gwendy like a lost puppy… how’s that working out for him? ${Sub ? `At least he’s getting some tail now… if maybe not in the way that he’d hoped for.` : `You’ve your own designs on her… and you don’t think the farmhand measures up to much.`}`,
                });
            }
        }

        Gui.SetButtonsFromList(options, true, () => {
            Text.Clear();
            Text.Out(`Enough horsing around… for now. Adrian shrugs, scratching his neck.`);
            Text.Flush();
            Prompt();
        });
    }

    export function ClaimEntrypoint() {
        const adrian: Adrian = GAME().adrian;
        const gwendy: Gwendy = GAME().gwendy;
        adrian.flags.Flags |= AdrianFlags.Flags.Taunted;
        Text.NL();
        Text.Out(`“G-Gwendy isn’t like that!” The farmhand’s stoic mask cracks for a moment. “S-She wouldn’t let anyone jump into her bed just like that!”`);
        Text.NL();
        if (gwendy.Sexed()) {
            Text.Out(`Well… you’d beg to differ. You give the agitated equine a slight smile. Guess you’re not just anyone, in that case. You’ve done a fair bit more than just jumping into her bed, by this point, and Gwendy has been more than enthusiastic about it.`);
            adrian.jealousy.IncreaseStat(100, 10);
        } else {
            Text.Out(`Well… as to that, you think she’ll come around on you pretty soon. She’s been pretty friendly with you so far, and she’s rather nice on the eyes… If he has an issue with it, he’ll just has to take it up with her, won’t he?`);
            adrian.jealousy.IncreaseStat(100, 5);
        }
        Text.NL();
        Text.Out(`“…” Adrian glares at you, looking quite hurt. He trudges past you, jaw set. “…I’ve had enough of this. I need to work.” You look after his receding back. Maybe you could have handled that a bit more gracefully.`);

        TimeStep({minute: 15});
        adrian.interactTimer = new Time(0, 0, 1, 0, 0);
        adrian.slut.IncreaseStat(30, 3);
        adrian.relation.DecreaseStat(0, 100);

        Text.Flush();
        Gui.NextPrompt();
    }

    export function EncourageEntrypoint() {
        const adrian: Adrian = GAME().adrian;
        adrian.flags.Flags |= AdrianFlags.Flags.Encouraged;

        Text.NL();
        Text.Out(`“R-Really? You think so? Uh… I mean…” Adrian falters, clearly flustered.

        Really. How come that the two of them don’t have that kind of relationship after all this time?

        “Uhm… I don’t think s-she sees me that way…” The farmhand shuffles his hooves nervously and glances around, perhaps worried about Gwendy overhearing your conversation.

        “I… I don’t really know how I’d… she’d just laugh at me.” He shakes his head, the hulking equine blushing like a teenage girl. Looks like he needs some more encouragement.

        Nonsense. A stud like him is quite a catch, and Gwendy can’t be unaware of this. The two of them have been together for so long, there must be some sexual tension brewing between them. You’re sure that the farmer won’t be adverse to a bit of fooling around, if nothing else… and who knows where things might go from there?

        “I… I’ll think about it.” Adrian mumbles, his face red as a beet. “T-Thanks…” The last word is a muttered whisper as he brushes past you, returning to his work with a lot of things on his mind.`);

        adrian.slut.IncreaseStat(100, 5);
        adrian.relation.IncreaseStat(100, 2);
        adrian.interactTimer = new Time(0, 0, 0, 3, 0);

        Text.Flush();
        Gui.NextPrompt();
    }

    export function Seduction() {
        const player: Player = GAME().player;
        const pc = player.Parser;
        const adrian: Adrian = GAME().adrian;
        const seduceCnt: number = adrian.flags.SeduceCnt;
        const slut = adrian.Slut();

        const { shortstackPC, tallPC } = player.HeightDiff(adrian);

        Text.Clear();
        if (seduceCnt === 0) {
            adrian.flags.SeduceCnt++;
            Text.Out(`You settle down next to Adrian as he works, letting your eyes wander freely over his muscular body, but letting him initiate further conversation. Eventually, he caves, throwing you a perturbed look. “W-What?”

            Oh, nothing. You were just wondering about how to perform a particular task… maybe he can show you?

            “Alright… like so…” Adrian turns back to what he’s working on, patiently showing you the steps. You lean in, your ${pc.skin} pressing against his arm innocently. Adrian starts a bit, but continues his terse explanation. You shuffle around to get a better look, rubbing against him as often as you can. The bewildered farmhand tenses up as you bend forward, your ${pc.butt} lightly brushing against the bulge in his crotch.

            …Maybe you are pushing him a little too fast. Acting as if nothing is up, you brush yourself off and get up. You hold his gaze as long as you dare, your fingers tracing down his forearm as you pause to thank the farmhand for his help. “A-Ah… no problems, ${pc.name}.”

            Adrian continues to give you odd looks for a while, but you refuse to acknowledge them, chatting amicably with the confused farmhand. Slow and easy does it.`);

            TimeStep({minute: 10});
            adrian.relation.IncreaseStat(20, 1);
            adrian.slut.IncreaseStat(50, 4);
            adrian.interactTimer = new Time(0, 0, 0, 3, 0);
        } else if (seduceCnt === 1 && slut >= 10) {
            adrian.flags.SeduceCnt++;
            Text.Out(`It’s time to push things a bit further with Adrian. He seems to enjoy talking about his work, so you bring the subject back to that, asking innocent questions about how to do this and that task around the farm. All the while, you hound his steps closely, being sure to brush against and touch him every chance you get.

            By the end of the prolonged demonstration, Adrian is shuffling his hooves uncomfortably, looking a bit confused. “Is… ah… everything alright, ${pc.name}?”

            Of course it is! You thank him for helping you understand his work better. He’s such a dependable farmhand. In fact… “Uh… yes?” ${shortstackPC ? `You look up at the tall equine, feigning irritation as you motion for him to bend down so your eyes are level. He complies, looking a bit confused, but his eyes widen as you plant a kiss on his offered cheek.` : tallPC ? `You lean down, giving the farmhand a kiss on the cheek.` : `You lean in, giving the farmhand a kiss on the cheek.`}

            “W-What was that?!” Adrian stumbles back from you, looking more than a bit confused at your actions.

            Ah… did you go too far? It was just as thanks for his help. Did he not like it?

            “Well… uh…” Adrian blinks. “A-Anyways, I need to get back to my work.” You smile as he wanders off, occasionally touching his cheek where your lips grazed him.`);

            TimeStep({minute: 10});
            adrian.relation.IncreaseStat(20, 1);
            adrian.slut.IncreaseStat(50, 4);
            adrian.interactTimer = new Time(0, 0, 0, 3, 0);
        } else if (seduceCnt === 2 && slut >= 20) {
            adrian.flags.SeduceCnt++;
            const party: Party = GAME().party;
            const Fields = party.location === WORLD().loc.Farm.Fields;
            Text.Out(`For once, Adrian seems to not be completely caught up in work, so you take the opportunity to see if you can push things along a bit further with him. You ask if he’s up for a short break, to which he nods${Fields  ? `, wiping his brow as he follows you into the barn` : ``}. Finding a pile of hay to recline on, you have a seat, patting a place next to you for him to sit down. No sooner has he taken a seat than you’ve snuggled up against him, your body boldly pressing against his.

            “${pc.name}…? Uh…” You brush off his complaints, saying that you’re bushed and need some rest, and he’s a comfy pillow. A muscular, slightly smelly pillow. Ignoring his protests, you lean into him, your ${pc.hand} playing idly with his abs. Adrian seems tense at first, but soon he relaxes, getting used to your petting.

            “U-Uhm… that’s…” Adrian stutters, a tremor running through his body as your ${pc.hand} trails lower and lower, coming to rest on the considerable bulge between his legs. You can feel his heart hammering like crazy against you.

            Shh. Pillows don’t talk. You smile to yourself as, after a moment’s hesitation, he reclines back, allowing you to continue exploring his body. Before long, the farmhand’s manhood is stirring, roused by your playful teasing. Judging by the size of the tent in his roughspun pants, his cock is at least a foot in length. Not massive, considering his equine heritage, but respectable nonetheless. You trace your hand down his impressive girth, coaxing a stifled moan from Adrian. By this point, he’s rock hard.

            You are the first one to realize you have an audience. Gwendy has just stepped into the barn, pausing on the precipice as she spots the two of you. At first, her expression is one of shock, but it’s quickly replaced by a sultry smile which you mirror. She leans against the doorway, crossing her arms as she enjoys the show.

            Adrian suddenly starts, jumping to his feet with such force that you’re tousled head over ${pc.naga(`tail`, `heel`)} into the haystack. Babbling an incoherent excuse, Adrian storms past Gwendy and out of the barn, his hands covering his tent. You emerge from the pile of hay, straws falling from your ${pc.hair}.

            For a moment, you and the farmer stare at each other. Then, she starts giggling, and before long the two of you are laughing uproariously. Wiping tears from her eyes, the blonde admonishes you weakly.

            “D-Didn’t take you long to corrupt my most loyal farmhand. You can play around, just… haha… just make sure he’s able to function, ‘kay?” Chuckling to herself, Gwendy goes about her business.`);
            TimeStep({minute: 10});
            adrian.relation.IncreaseStat(20, 1);
            adrian.slut.IncreaseStat(50, 4);
            adrian.interactTimer = new Time(0, 0, 0, 3, 0);
        } else if (seduceCnt === 3 && slut >= 30) {
            Text.Out(`Adrian eyes you apprehensively as you suggest the two of you venture somewhere private, but follows wordlessly, pointing to the part of the barn where he has his quarters. The inside is small and cozy, even more so than Gwendy’s own loft, which is directly above the equine farmhand’s living space.

            You sigh contentedly as you recline on the straw mattress that form his bedding, drinking in your prey. He shuffles back and forth on his hooves nervously, towering over you in the dim light. “Uh… about last time… you’ve been acting… weird, ${pc.name}. I…” He trails off, watching you intently. You can see the bulge of his cock begin to swell in his pants as he walks through the trajectory of your earlier flirting in his head.

            Are you going to do this?`);

            Text.Flush();
            // [Free his cock][Bail]
            const opts: IChoice[] = [
                {
                    nameStr: `Free his cock`,
                    func: () => {
                        adrian.flags.SeduceCnt++;
                        Text.Clear();
                        Text.Out(`Weird…? No, there’s nothing weird about this. You slowly rise, closing in on the equine farmhand. He tenses, then relaxes as you trail your hands down his sides, going as far as to ${tallPC ? `raise his head to meet your passionate kiss` : shortstackPC ? `lean down in order to kiss you` : `lean in to kiss you`}. You can feel his stiff member pressing against you, aching to be released from the confines of his pants.

                        Just as you hook your fingers into the hem of his roughspun leggings and start to pull them down, Adrian suddenly stops you, blushing furiously. What’s the matter?`);
                        CockReveal(SeductionCockRevealOptions);
                    }, enabled: true, tooltip: `No looking back, you want to get your hands on that bad boy stirring in his pants as soon as you can.`,
                },
                {
                    nameStr: `Bail`,
                    func: () => {
                        Text.Clear();
                        Text.Out(`On second thought… you just wanted to… talk. The excuse sounds lame even as it leaves your lips, but the farmhand looks somewhat relieved. You spend the next half hour or so talking with Adrian about random things. In the end, the horse-morph seems more relaxed, though a trace of the sexual tension between you still hangs in the air.

                        You need to figure out what you want from this yourself before you decide to take this further.`);

                        TimeStep({minute: 30});
                        adrian.relation.IncreaseStat(30, 2);
                        adrian.interactTimer = new Time(0, 0, 0, 3, 0);
                        Text.Flush();
                        Gui.NextPrompt();
                    }, enabled: true, tooltip: `For whatever reason, something tells you that he - or perhaps you - aren’t ready for this kind of thing quite yet.`,
                },
            ];

            Gui.SetButtonsFromList(opts);

            return; // Prevents ending enc
        } else {
            Text.Out(`Adrian has a slightly harried look as you close in on him, and quickly finds a way to excuse himself before you can corner him. You purse your lips thoughtfully as the shy farmhand hurriedly makes himself scarce. Maybe you are pushing him a little too fast. You should build up his confidence more before you try to get him to have sex with you.`);
            TimeStep({minute: 5});
        }
        Text.Flush();
        Gui.NextPrompt();
    }

    export function CockReveal(setOpts: CallableFunction) {
        const adrian: Adrian = GAME().adrian;
        const rigard: Rigard = GAME().rigard;
        const blownBarnaby = rigard.BlownBarnaby();

        adrian.flags.SeduceCnt = 0; // Clear to reduce save size
        adrian.flags.Flags |= AdrianFlags.Flags.Seduced; // Open up sex options

        Text.NL();
        Text.Out(`“Ah… it’s… sorry, this is r-really embarrassing.” Adrian looks away from you, face beet red. “I… uh… I’ll show you… just… don’t expect too much.” You give him an odd look. “I… well… the last time I showed it to a girl… she… kinda laughed.”

        Hushing him, you look into his eyes, seeking permission. After gulping, he nods silently. You slowly begin to pull down the hem of his pants, bit by bit, revealing inch after inch of pink horsecock, until the entire thing jumps free, jutting proudly from his crotch. “I… I know it’s small… sorry…” Adrian mumbles.

        Small is… not the word you’d use. The thing must be at least a foot long: closer to fourteen inches, and girthy to boot. Crowned by a flared head, the veiny shaft is encircled by a thick median ring halfway down. Below the sheath where the pink cockflesh fades into his silky brown fur, two hefty balls the size of apples hang. It’s a member that anyone would envy - any human at least.${blownBarnaby ? ` Still, it’s not the biggest horsecock you’ve ever seen - at the very least he’s smaller than Barnaby the bartender, over at the Maidens’ Bane.` : ``}

        By any chance, did his girlfriend happen to also be a horse-morph?

        “S-She wasn’t my girlfriend… I think. Yes, she’s equine. She was from my village. S-So… how is it?”

        Well… do you want to boost his confidence a little?`);
        Text.Flush();

        setOpts();
    }

    export function SeductionCockRevealOptions() {
        const adrian: Adrian = GAME().adrian;
        const player: Player = GAME().player;
        const pc = player.Parser;

        // tslint:disable-next-line: variable-name
        let _tease: boolean;
        // tslint:disable-next-line: variable-name
        let _intimidated: boolean;

        // [Tease][Reassure][Intimidated]
        const opts: IChoice[] = [
            {
                nameStr: `Tease`,
                func: () => {
                    Text.Clear();
                    Text.Out(`Don’t worry about it, you assure the apprehensive farmhand. It’s actually kinda cute. Maybe you’re used to bigger, but cocks come in all shapes and sizes. He shouldn’t worry about it so much. You give him a sly smile as you cradle his thick shaft in your ${pc.palm}. He turns his head, looking crestfallen and embarrassed rather than reassured.

                    “It’s okay… you don’t have to sugarcoat it. D-Do you still want to…?”`);
                    _tease = true;
                    adrian.relation.DecreaseStat(0, 3);
                    Gui.PrintDefaultOptions();
                }, enabled: true, tooltip: `Well… it’s maybe not up to your usual standards, but it’ll do.`,
            },
            {
                nameStr: `Reassure`,
                func: () => {
                    Text.Clear();
                    Text.Out(`You gently tell him that while his maybe-girlfriend might have been used to bigger sizes, he’s by no means small. In fact, with most men it wouldn’t even be a competition, both when it comes to length and girth.

                    “I-Is that so?” Adrian looks slightly reassured, but still slightly apprehensive. “Are you sure? You don’t have to… for my sake…”`);
                    adrian.relation.IncreaseStat(100, 5);
                    Gui.PrintDefaultOptions();
                }, enabled: true, tooltip: `His cock would put most men to shame. He shouldn’t be so self-conscious.`,
            },
            {
                nameStr: `Intimidated`,
                func: () => {
                    Text.Clear();
                    Text.Out(`Truth be told… it’s the other way around. You gulp hesitantly as you study the massive member, cradling it in your ${pc.palm}. It’s heavy, and gives off a thick musk. You tell him that it’s among the bigger ones you’ve seen, and that he definitely shouldn’t be ashamed of it… rather, you’re not sure you’re going to be able to handle it.

                    “A-Ah… we can stop if you want…?”`);
                    adrian.slut.IncreaseStat(100, 4);
                    adrian.relation.IncreaseStat(100, 2);
                    _intimidated = true;
                    Gui.PrintDefaultOptions();
                }, enabled: true, tooltip: `Not only is he big… he might be a bit too big for you.`,
            },
        ];

        Gui.Callstack.push(() => {
            const { friend } = _AdrianState();
            Text.NL();
            Text.Out(`You cut him off by giving his cock a light squeeze, making his nervous insecurity trail off into a weak moan. The flared head of the throbbing shaft presses against your ${pc.belly}, leaving a sticky trail of pre in its wake. You stare into his dark eyes. You want to…`);

            Text.Flush();
            const p1cock = player.BiggestCock();
            const humiliate = _tease && p1cock && p1cock.Len() >= 32; // >=16"
            // [Handjob][Blowjob][Humiliate][Stop]
            const opts2: IChoice[] = [
                {
                    nameStr: `Handjob`,
                    func: () => {
                        Text.Clear();
                        Text.Out(`You smile up at him as you lower yourself down${pc.haslegs(` to your knees`)}, caressing his length with your ${pc.hand}s.

                        “Ah… that feels n-nice… what are you…?”

                        You’re going to get him off, that’s what you’re going to do, and you won’t have any more backtalk.${_tease ? ` He better be grateful to you for doing this, in spite of his… inadequacy.` : ``}`);
                        HandjobEntrypoint();
                    }, enabled: true, tooltip: `…Get him off with your hands. Considering his girth, you’re going to need more than one.`,
                },
                {
                    nameStr: `Blowjob`,
                    func: () => {
                        Text.Clear();
                        Text.Out(`You smile up at him as you lower yourself down${pc.haslegs(` to your knees`)}, coaxing a moan from him as you drag your ${pc.tongue} along his equine member, tasting his musk and pre.${_tease ? ` After all… even if he’s got a small cock, those balls of his look like they contain some quite delectable filling. As long as he can hold out, you won’t be <b>too</b> disappointed.` : ``}

                        “Ah… that feels… hng… nice…” Adrian sighs contentedly as you play with him.

                        You’re just getting started.`);
                        BlowjobEntrypoint();
                    }, enabled: true, tooltip: `…Get him off with your mouth. Hopefully you can take his girth…`,
                },
                {
                    nameStr: `Humiliate`,
                    func: () => {
                        player.SetPreferredCock(p1cock);
                        const c = new GP.Plural(player.NumCocks() > 1);
                        Text.Clear();
                        Text.Out(`Your sly smirk widens. Do you still want to…? It looks like the farmhand needs to be put in his place. Your grip tightens around his shaft as you press it up against his stomach.

                        “Ugh… ${pc.name}? What are you…?” Adrian winces at the rough treatment, looking confused. “I… I thought…”

                        Poor boy. That girl had it right… he’s nothing to write home about. How about you show him a real dick? Still keeping his puny horsecock trapped, you shift your clothes out of the way, releasing your swelling ${pc.cocks}.

                        “Is that…? Ahh…” Yeah. That’s your ${pc.cocks}, pressing against the underside of his balls, ${c.itsTheir} girth extending between his thighs… does he want to see ${c.itThem}? “I…”

                        Heedless to his response, you slowly pull up your shaft${c.s}, pressing ${c.itThem} against Adrian’s much smaller cock. <b>This</b> is what she was looking for… and what he couldn’t provide. So… which does he think is better? The farmhand doesn’t respond, biting his lips as you grind your ${pc.cock} against his own erection.

                        Which… does he think that Gwendy would like more? Adrian suddenly stiffens, shoving you away from him. ${friend ? `He looks hurt. “W-What the hell?! I thought you were my f-friend… g-get away from me!”` : `For a moment, you think he might punch you, but he just growls for you to leave`}.

                        Well… his loss. You were going to offer him the chance to service you, but if he’s going to be that way… You shrug, calmly replacing your gear. Before leaving, you toss him a kiss over your shoulder, wishing him good luck in tending to his stiffy. While you might have burned some bridges here, it might be fun to see what he does going forward.`);

                        adrian.interactTimer = new Time(0, 0, 2, 0, 0);
                        adrian.relation.DecreaseStat(0, 10);
                        adrian.jealousy.IncreaseStat(50, 100);

                        Text.Flush();
                        Gui.NextPrompt();
                    }, enabled: humiliate, tooltip: `…Show him what a real cock looks like. He thinks that Gwendy will be impressed by that thing? Straight up bully him.`,
                },
                {
                    nameStr: `Stop`,
                    func: () => {
                        Text.Clear();
                        Text.Out(`On second thought… this has gone far enough.${_intimidated ? ` You… need some more time to prepare, mentally, if you’re to take something as big as that.` : _tease ? ` You need some time to ponder if his lacking size will be an issue for you.` : ``} Maybe you can continue this later?

                        “S-Sure…” Adrian looks disappointed and more than a little embarrassed as he pulls up his pants again. No doubt he’ll be ‘busy’ for a while. You take your leave, wondering to yourself where you want to take this next.`);

                        adrian.interactTimer = new Time(0, 0, 0, 3, 0);
                        Text.Flush();
                        Gui.NextPrompt();
                    }, enabled: true, tooltip: `…Stop here, for now.`,
                },
            ];
            Gui.SetButtonsFromList(opts2);
        });

        Gui.SetButtonsFromList(opts);
    }

    export function SexPrompt() {
        const player: Player = GAME().player;
        const pc = player.Parser;
        const { Dom, Sub } = _AdrianState();
        Text.Flush();
        const options: IChoice[] = [
            {
                nameStr: `Give Handjob`,
                func: () => {
                    Text.Clear();
                    Text.Out(`You trail a hand down Adrian’s toned front, settling on the hem of his pants. The roughspun cloth is only loosely tied around his hips with a piece of rope, the only thing currently containing his girthy horsemeat.`);
                    Text.NL();
                    if (Sub) {
                        Text.Out(`Feeling frisky, you lean in closer, pressing yourself against the flustered equine and sneaking a naughty ${pc.hand} inside his pants. The submissive farmhand shivers, whimpering as you close your fingers around his soft member. You trail down his shaft, cupping his heavy balls.

                        “A-Ahh…” The equine moans softly as you continue to play with him, his weak protests belied by the rapid swelling of his horsecock. Before long, he’s straining against the confines of his trousers, melting like putty under your teasing. “P-Please… I w-want to…”

                        You squeeze his balls lightly. He wants… what?

                        “I want… you to t-tease me… play with my c-cock…” A damp stain is forming on the fabric of his pants where the flared head of aforementioned cock grinds. Well, he is being a rather good boy… and you were planning to do that anyways. You continue to pet his now painfully hard dick, showing little regard for the ruin it’s making of his pants. He can worry about laundry in his own time. Finally, you start lowering yourself${pc.haslegs(` to your ${pc.knees}`)}, easing his rope belt and pulling down his trousers as you go.

                        You lick your lips, smiling as Adrian’s horsecock flops free, the flared head throbbing and dripping with pre. The equine leans back, a hesitant hand running up his muscular stomach. He smells of repressed desire and eagerness, and seems more than happy to let you take the lead.`);
                    } else if (Dom) {
                        Text.Out(`“You know what you want… that’s nice. Saves some time.” Adrian helps guide your hand to his crotch, tracing the shape of his massive bulge. Even through his pants, you can feel the heat from his stirring member. Hooking a finger in his loose belt, you slowly lower yourself${pc.haslegs(` to your ${pc.knees}`)}, pulling his trousers down together with you in the process.

                        Your eyes lock on the girthy pillar of cockflesh between his legs. It just goes on and on and on… you hold your breath as you reveal inch after inch of pink meat, suppressing a gasp as the entire thing flops free. It’s all you can do to lean back, narrowly avoiding getting slapped in the face with it. You look up, your view of Adrian obscured by… Adrian.

                        The equine nudges his hips forward, gently pressing the undercarriage of his enormous member against your forehead, draping the heavy shaft over you and pushing your head up against his musky testicles. “Ya doing alright down there, ${pc.name}?” he murmurs, slowly rubbing himself against you. “This is nice… but I know you can do better.”`);
                    } else { // Shy
                        Text.Out(`“O-Oh…” The equine falters and grows silent as you rub the ${pc.palm} of your ${pc.hand} against the front of his trousers, feeling up the shape of his stirring member. He scratches the back of his neck, glancing around nervously, but he’s certainly not telling you to stop. Emboldened, you slip your ${pc.hand} into his pants and start to play with him, fingers tracing the horsecock to its root and cupping his balls.

                        Gliding up to his side, you wrap one arm around the morph’s back, using the other to grasp his erection and pull it out, widening Adrian’s belt as you do. The shaft has engorged to its full fourteen inch length, betraying his excitement. No longer held up by his loose belt, the equine’s pants fall to the ground, forgotten.

                        You give him a few more strokes before moving back in front of him and lowering yourself${pc.haslegs(` to your ${pc.knees}`)}, seeking to get a closer look. Adrian shifts his weight, grunting softly. “Um… you can go on… I don’t… mind.”`);
                    }
                    HandjobEntrypoint();
                }, enabled: true, tooltip: `How about he whip out that horsecock for you to play with?`,
            },
            {
                nameStr: `Give Blowjob`,
                func: () => {
                    Text.Clear();
                    Text.Out(`You lean in, nuzzling up to Adrian and planting a kiss on his lips. While initially surprised, he quickly warms to the prospect, ${Dom ? `confidently` : `hesitantly`} engaging you in some good old tongue wrestling. While he’s distracted, you sneak one of your ${pc.hand}s into his trousers, caressing the girthy horsecock hidden therein. The mere thought that you will soon have your lips wrapped around it makes you salivate and throw yourself more passionately into your tongue play with the equine farmhand.`);
                    Text.NL();
                    if (Sub) {
                        Text.Out(`The submissive equine eagerly grinds his crotch back into your hand, letting out a moaning gasp when you pull his pants down to his knees and free his swelling dick. You break your kiss, tenderly stroking his chin and leaving a trail of his sticky pre on it before sinking down${pc.haslegs(` to your ${pc.knees}`)}, putting you level with his juicy fuckstick.

                        You grasp his member firmly by the base, using your ${pc.tongue} to lick and lap at it, coaxing it to full hardness. The smell and taste of him is intoxicating, his mewls and whinnies urge you to ravage him further. Best of all is the look in those big dark eyes when you look up at him: they tell you more clearly than any words could that the boy is yours to play with, however you want.`);
                    } else if (Dom) {
                        Text.Out(`Adrian pulls you into a tight embrace, grinding his tongue against yours and grunting encouragement to you as you play with his growing erection. When he finally lets you surface for air, he gently but firmly presses you down${pc.haslegs(` on your ${pc.knees}`)} between his legs, breathing heavily as he frees his engorged trouser snake.

                        The thing is truly massive; a good twenty inches of throbbing cockflesh jutting out proudly from his crotch and draping itself over your face. His full equine balls smell enticing, sloshing as they are with potent cum… cum you want to taste sooner rather than later. You are about to have your wish come true, as the farmhand drags his girthy shaft across your features, rutting against your upturned face. “C’mon… tongue out… this is what you want, isn’t it?”

                        Mesmerized, you obey his command, sloppily licking and lapping at his massive horsecock with your ${pc.tongue}, hands playing with his balls. Once you’ve thoroughly familiarized yourself with his dick from root to stem, you position yourself in front of his pre dripping flared crown, planting a big kiss on it. “Good ${pc.mfFem(`boy`, `girl`)}, ${pc.name},” the farmhand grunts, patting your head fondly. “Go on… no need to hold back.” You don’t need telling twice.`);
                    } else {
                        Text.Out(`Adrian follows your flow as best as he can, but the big equine is hesitant, not being fully used to this kind of intimacy yet. You debate taking it slow with him, but whatever qualms or hang ups he has, they are overshadowed by the primal instincts of his body: the way his massive dick is threatening to rip out of his pants speak louder than words what the horse morph desires.

                        Pulling back, you smile sweetly at him as you lower yourself down${pc.haslegs(` to your ${pc.knees}`)}, casually pulling his trousers down to his knees and freeing his erection. Fourteen inches of thick, juicy horsecock calls to your ${pc.tongue}, and before Adrian can mouth a protest, you heed its call, sensually licking and lapping at his length. The farmhand is blushing brightly, embarrassed beyond belief, yet unable to pull back and break eye contact. Breathing heavily, he meekly allows you to continue playing with his manhood, whinnying as you drag your ${pc.tongue} along it from root to stem.

                        “A-Ah… that’s… ooh…” If he’s excited by this much, he’ll be ecstatic before long: you’re only getting started. Taking a firm hold of his dick with both ${pc.hand}s, you pull back, open mouth hovering just in front of his flared crown, your breath hot on his glans. A barely imperceptible nod from the nervous equine gives you all the encouragement you need.`);
                    }
                    BlowjobEntrypoint();
                }, enabled: true, tooltip: `You can’t wait to wrap your lips around that juicy horsecock and test the capacity of your throat.`,
            },
            /* TODO
            {
                nameStr: ``,
                func: () => {

                }, enabled: true, tooltip: ``,
            }, */
        ];
        // TODO Custom back? Could be useful for other places SexPrompt is used.
        Gui.SetButtonsFromList(options, true, () => {
            Text.Clear();
            if (Dom) {
                Text.Out(`“Ya sure? You look like you could use some… fun.” He flashes you a grin. “If you change your mind… well, you know where to find me.”`);
            } else if (Sub) {
                Text.Out(`“Mmh…? You don’t want to…?” Adrian looks slightly disappointed with your change of heart.`);
            } else {
                Text.Out(`“Ah… okay.” If the farmhand is disappointed, he hides it really well.`);
            }
            Prompt();
        });
    }

    export function HandjobEntrypoint() {
        const player: Player = GAME().player;
        const pc = player.Parser;
        const adrian: Adrian = GAME().adrian;
        const { Dom, slut } = _AdrianState();
        _sexed = true;

        Text.NL();
        Text.Out(`Time to give the farmhand a hand. Smiling up at the ${Dom ? `confident` : `nervous`} equine, you wrap your digits around his stiff horsecock and start to slowly jerk him off, fingers playing lightly along its length. Adrian sighs contentedly, closing his eyes and leaning back, letting you run the show${Dom ? ` for the time being` : ``}.`);
        Text.NL();

        player.Fuck(undefined, 2);
        adrian.Fuck(adrian.FirstCock(), 2);

        let scenes = [
            () => {
                Text.Out(`You turn your attention fully to your latest plaything, seizing it with both ${pc.hand}s and forming a circle with your fingers. The equine bucks his hips as you put your improvised cocksleeve to use, massaging the entirety of his length from root to flared stem. He seems to be particularly sensitive around the glans; each time you reach the crown of his cock, a twitch runs through the entire shaft, letting a glob of pre shake loose and drip down your ${pc.hand}s, lubricating him.`);
                Text.NL();
                if (Dom || slut) {
                    Text.Out(_.sample([
                        `“Fuck… you sure know your way around, ${pc.name},” Adrian grunts, gently thrusting his hips to meet your movements. “Hope you won’t mind the mess…”`,
                        `“That’s a good little… slut,” Adrian grunts. It’s cute that despite his boost in confidence, he’s still somewhat hesitant to talk dirty. “K-Keep going like this, and I’ll have a gift for you soon…”`,
                        `“Mm… work that cock…” Adrian grunts, gently caressing your ${pc.hair} while you jack him off. “Good… hrn… ${pc.mfFem(`boy`, `girl`)}.”`,
                    ]));
                } else {
                    Text.Out(_.sample([
                        `“Mmm… o-oh…” Adrian whinnies as he lets you have your way with his junk, biting his lip cutely.`,
                        `“A-Ah… that feels s-so good…” Adrian lets out a muffled moan, biting his lip. “M-Maybe a bit… s-slower?” Well, that’s up to you, not to him.`,
                        `“A-Ah… that’s… oh!” Adrian whimpers as you tease and prod him, slowing down and speeding up in an unpredictable manner.`,
                    ]));
                }
            },
            () => {
                Text.Out(`You press the equine’s massive shaft up toward his belly, holding it in place and lightly playing with it with one ${pc.hand}. This leaves your other one free to toy with the heavy ball sack hanging between Adrian’s legs, full of juicy horse spunk. You carefully cup the smooth spheres, feeling their weight. When he goes off, he’s going to make a giant mess, that’s for sure.`);
                Text.NL();
                if (Dom || slut) {
                    Text.Out(_.sample([
                        `“Mmm… someone getting thirsty?” The farmhand chuckles, petting your ${pc.hair}. “If so, I’ve got something good saved up, just for you…”`,
                        `“Mmm… that’s good… I’m a bit… pent up… gonna be a big one for you…” The farmhand grunts, grinding against your ${pc.hand}.`,
                        `“That’s right… if you continue being a good ${pc.mfFem(`boy`, `girl`)}, all of that c-cum will be yours,” the farmhand grunts, giving his horsecock a tug.`,
                    ]));
                } else {
                    Text.Out(_.sample([
                        `“C-Careful… ohhh…” The farmhand whinnies, stomping the ground with one hoof as you caress his jewels.`,
                        `“Mph…” The farmhand whinnies nervously, biting his lip cutely. A single spurt of pre discharges from his twitching horsecock, slowly dripping down its length, coating your ${pc.hand}.`,
                        `“I-I think… A-Ahh…!” The farmhand is cut off abruptly as you give him a warning squeeze. He doesn’t need to think right now; you’ll handle that for him.`,
                    ]));
                }
                Text.NL();
                Text.Out(`Much to his enjoyment, you continue to massage his sloshing sperm silos, driving him ever closer to his climax.`);
            },
        ];
        if (Dom) {
            scenes = _.concat(scenes, () => {
                Text.Out(`“Mmm… hold like that for a bit… yeah, good ${pc.mfFem(`boy`, `girl`)}.” Following Adrian’s grunted instructions, you form a tight cocksleeve with your fingers, trapping his girth in your ${pc.hand}s. The farmhand starts to slowly rut against you, see-sawing a good foot of his massive horsecock back and forth through the gentle embrace of your digits.

                He starts to pick up speed, sloppily fucking your ${pc.hand}s and depositing his sticky pre all over your ${pc.hair} and ${pc.face}. “F-Fuck, your ${pc.hand}s are smooth…” the equine groans. “H-Here… feel that?” He takes half a step forward, forcing your hands to the root of his member, letting the rest of it flop heavily onto your head. It pulses and twitches erratically, and your nostrils are filled with the heady smell from his balls.

                After giving you a whiff, Adrian backs up, encouraging you softly as he lets you jerk him off.`);
                player.subDom.DecreaseStat(-50, 1);
            });
        }
        _.sample(scenes)();
        Text.Out(` You can tell he’s getting close. Question is if you’re done with him yet?`);

        Text.Flush();
        // [Facial][Blowjob][Denial]
        const options: IChoice[] = [
            {
                nameStr: `Facial`,
                func: () => {
                    Text.Clear();
                    Text.Out(`Using both of your ${pc.hand}s and all the tricks you can muster, you push the equine farmhand to the brink of climaxing, playing with both his throbbing shaft and his twitching balls. Adrian groans in pleasure, his breath coming in short bursts. He lets out a whinny and bites down on his lower lip, trying to last just a little bit longer.

                    Shifting your weight around so that you are in his direct line of fire, you focus your attention on his glans. You speed up your coaxing until you can see his flared head starting to expand… you open your mouth and leave your tongue hanging, looking up at him as you hungrily await his cock batter.`);
                    adrian.OrgasmCum();
                    Text.NL();
                    Text.Out(`Strand after strand of hot cum spew out from Adrian’s twitching${Dom ? ` monster` : ``} cock, landing in a sticky mess all over your ${pc.hair}, ${pc.face} and ${pc.tongue}. By the time he’s finished, you have a thick coating of equine seed covering your upper body, slowly dripping down to the ground.`);
                    Text.NL();
                    if (Dom || slut) {
                        Text.Out(_.sample([
                            `“Hah… not bad…” Adrian takes a shuddering breath, idly shaking a few more drops out of his meat to top your icing. “That… looks good on you.” He grins, rubbing the undercarriage of his cock against your face. You smile back at him.`,
                            `“That was… quite a bit of fun.” Adrian grins down at you, rubbing his cock against your face and smearing his cum all over your ${pc.skin}. “If ya feel like… doing something more, don’t hesitate to ask.”`,
                            `“Mmm… that’s a good… mare…” Adrian sighs contentedly, admiring the mess he’s made of your face. “So pretty…” You blush faintly.`,
                        ]));
                    } else {
                        Text.Out(`${_.sample([
                            `“A-Ahh… hah… that was… wow…”`,
                            `“I-I… ${pc.name}, that w-was… hah…”`,
                            `“Mph… hah… s-sorry for the… uhm…”`,
                        ])} Adrian struggles for words, breathing heavily after his messy climax. You give him a smile and a wink. Anytime.`);
                    }
                    Text.NL();
                    Text.Out(`Cleaning up takes some effort, but with a bucket of water, soap and a towel lent by the farmhand, you manage to get most of his spunk off you - enough to walk around in public at least. You can still taste him on your tongue, a constant reminder of your naughty frolicking. The two of you restore your clothes, Adrian ${Dom ? `taking some time to languidly stretch, showing off his flexing muscles` : `glancing around himself nervously as if expecting Gwendy to jump out of the woodworks anytime and scold him for neglecting his duties`}.`);

                    TimeStep({minute: 45});

                    player.slut.IncreaseStat(50, 1);
                    adrian.slut.IncreaseStat(50, 3);
                    player.AddLustFraction(0.3);
                    _denial = false;

                    Prompt();
                }, enabled: true, tooltip: `Let him finish and spew his load all over your face.`,
            },
            {
                nameStr: `Blowjob`,
                func: () => {
                    Text.Clear();
                    Text.Out(`You cease your toying and teasing, ${pc.hand}s trailing up the equine farmhand’s shaft, gathering a dollop of pre from his twitching crown. Letting go of the bobbing member entirely, you give him a mischievous grin as you slurp it up. Delicious.

                    “H-Hmm…? ${pc.name}? I was close…” Adrian huffs, looking down at you past the trunk of his massive throbbing horsecock. You stare back at him with a hungry look in your eyes. You’re not done with him yet, not by a long shot.`);
                    _denial = true;

                    BlowjobEntrypoint();
                }, enabled: true, tooltip: `It’d be a shame to let all of that cum go to waste… take him in your mouth.`,
            },
            {
                nameStr: `Denial`,
                func: () => {
                    Text.Clear();
                    Text.Out(`The ${Dom ? `stallion` : `equine`} is about to blow his load when you constrict your ${pc.hand}s around the root of his shaft, squeezing his cumchute tight and preventing his climax.`);
                    Text.NL();
                    const denyDenial = Dom && player.SubDom() < 50 && (_.random(1, 60) >= player.SubDom());
                    if (denyDenial) {
                        Text.Out(`“Ngh… you naughty little… tease…” Adrian grunts, glowering down at you. “Don’t play around… I’m gonna get off, the only question is how.” You blush, intimidated by the close proximity of his massive member and the heavy musk emanating from his gonads. You should do what he says…`);
                        player.subDom.DecreaseStat(0, 1);
                        Text.Flush();

                        _.last(options).enabled = false;
                        Gui.SetButtonsFromList(options);
                    } else {
                        Text.Out(`Adrian whinnies, shifting his hooves to free himself, but you keep your grip, smiling up at him wickedly. Who said that he could cum? “B-But…! S-So close…” You stifle his protests, keeping him restrained until the twitching of his horsecock has died down. He winces as you give his swollen balls a pat. Good boy… but you have some other business to take care of. You’re sure he can take care of himself… right?

                        ${Dom ? `“Oh… I’m sure I can find someone else interested in helping out with this… little issue.” Adrian flashes you a grin, almost making you regret your choice.` : `“Ah… but I thought…” he blushes, hanging his head. “O-Okay…” Though he attempts to look disappointed, a twitch from his neglected cock tells you that your treatment excites him.`} You and the equine farmhand restore your clothes, Adrian sporting quite a prominent tent on the front of his pants.`);

                        adrian.slut.IncreaseStat(75, 2);
                        player.subDom.IncreaseStat(50, 1);
                        TimeStep({minute: 45});
                        _denial = true;

                        Prompt();
                    }
                }, enabled: player.SubDom() >= 20, tooltip: `You’ve toyed with him enough for now… but he doesn’t get to cum.${Dom ? ` The stallion might have other opinions about this.` : ``}`,
            },
        ];
        Gui.SetButtonsFromList(options);
    }

    export function BlowjobEntrypoint() {
        const player: Player = GAME().player;
        const pc = player.Parser;
        const adrian: Adrian = GAME().adrian;
        const { Dom, Sub, Shy } = _AdrianState();
        _sexed = true;

        Text.NL();
        Text.Out(`Adrian tenses up as your greedy lips envelop the head of his cock. Your jaw aches trying to accommodate his girth, but the taste of his thick pre-cum is worth the discomfort. You let your ${pc.tongue} play across his flared tip, swirling up and swallowing any stray globs of pre. Nursing and suckling his head and cumslit, you let your ${pc.hand}s work their magic on his length, slick fingers gently caressing his veiny shaft, reaching down to cup and feel his heavy balls.${_denial ? ` After all your teasing, he’s desperate for release.` : ``}`);
        Text.NL();

        Sex.Blowjob(player, adrian);
        player.FuckOral(player.Mouth(), adrian.FirstCock(), 2);
        adrian.Fuck(adrian.FirstCock(), 2);

        // TODO
        const beginner = player.sex.gBlow < 10;
        const inexperienced = player.sex.gBlow < 30;
        const master = !inexperienced;

        if (beginner) {
            Text.Out(`Trying to pleasure a dick as large as Adrian’s is no easy feat for someone as inexperienced as you; you can barely get more than two inches of the equine’s tree trunk into your mouth. The best you manage is making out with his crown, letting your ${pc.tongue} lap at his glans. Your mouth is filled to the brim with pink cockflesh, and even the small fraction of him that you are able to take presses uncomfortably against the back of your throat.`);
        } else if (inexperienced) {
            Text.Out(`Even for a seasoned cock-sucker like you, trying to blow such a thick shaft is quite the challenge. You manage to get a few inches of him inside your mouth before meeting resistance, but you don’t let yourself get discouraged. You twist this way and that, letting your ${pc.tongue} work every square inch of your lover’s juicy fuckstick and lapping up as much of his nut batter as you can.`);
        } else {
            Text.Out(`Once the initial discomfort has eased, your experience sets in. You know your way around a cock, and Adrian’s about to get his blown by a pro. Its sheer girth is an issue, but not one that you’ll allow getting in your way. You twist this way and that, letting your ${pc.tongue} work every square inch of your lover’s juicy fuckstick, before easing the back of your throat, pushing your head forward and taking in several more inches of the hung horse morph.`);
        }
        Text.NL();
        Text.Out(`Adrian groans in appreciation of your oral ministrations, ${Sub ? `squirming meekly` : `caressing your ${pc.hair}`} as you bob up and down on his horsecock. Your saliva drips and trails down the length of his shaft, giving it a slick, lewd sheen, courtesy of your prick polishing.`);
        Text.NL();

        const scenes = new EncounterTable();
        scenes.AddEnc(() => {
            Text.Out(`Surfacing for air, you gasp, throwing the farmhand a smoldering look as you lick your lips. You jerk him off sensually as you plant kisses all the way down his equine phallus, lapping and licking his ballsack. Closing your eyes to flood your senses of touch, taste and smell, you take one of his huge testicles into your mouth and suck it, eliciting further grunts of approval from its owner.

            You alternate between suckling at his head and worshipping his balls, caressing, licking, sucking, lavishing in the teeming cum repositories. ${Sub ? `Almost seems a shame that most of the virile horse’s seed these days splatters to the ground uselessly during one of Gwendy’s prostate pounding sessions… maybe you can offer him a different kind of release?` : `The kind of load these bad boys are packing could get a girl pregnant just by looking at it.`} You greedily slurp at his nuts one last time, before returning to licking his flared head, mouth open in anticipation.`);
        }, 1.0, true);
        scenes.AddEnc(() => {
            Text.Out(`The talents of your mouth and your tongue are far from the only thing in your arsenal, however. You shift your weight forward and upward, pressing the sloppily lubed up girth of his thick rod into the soft valley formed by your cleavage. Using your ${pc.breasts}, you massage and play with him, saliva and pre mixing and splattering onto your ${pc.skin}.

            ${player.HasBreastsBiggerThan(BreastSize.Large) ? `Even a cock as large as Adrian’s easily vanishes between your huge boobs, swallowed by titflesh on all sides. You work him for a few minutes, relishing in the turgid heat pressing against your body.` : `You pinch and tease your ${pc.nips} as you embrace his turgid length in your bosom, moaning softly around his cock.`} When you start feeling him growing close to his climax, you press your ${pc.breasts} together, surfacing for air and gasping in anticipation, ${pc.tongue} lolling hungrily just in front of his flared head.`);
        }, 1.0, player.HasBreastsBiggerThan(BreastSize.Medium));
        scenes.AddEnc(() => {
            Text.Out(`Just as you are starting to get into it, you feel Adrian’s hand on the back of your head. ${inexperienced ? `Your eyes go wide. No no no no… none of your muffled protest are heeded, as the stallion slowly but surely feeds you more and more dick, far beyond your capacity. Each gentle thrust of his hips pushes his shaft another half inch down into so far untouched parts of your gullet, making you gag and gulp. No matter how much you try, his hand stays firm, allowing you the occasional desperate draft of air through your nostrils, but never leaving your throat empty.` : `Your eyes widen as you realize what the previously so timid farmhand is up to… and you are in to it. Relaxing your throat with practiced ease, you let him enter it, greedily swallowing inch after inch of his massive girth.`}

            A few minutes of deepthroating later, the morph finally allows you to surface for air, and you gasp and cough, throwing him a smoldering glare. “C’mon… you’re not done.” ${player.SubDom() >= 50 ? `You give his balls a warning squeeze. He’s taking himself a few too many liberties here… but you’re too turned on to care.` : `You meekly allow yourself to be manhandled, opening your mouth wide as Adrian drags his cock over your upturned features, leaving a sticky trail in its wake.`} You return to licking and lapping at his flared head, looking up eagerly in anticipation of what he’ll do next.`);
            player.subDom.DecreaseStat(-75, 1);
        }, _denial ? 3.0 : 1.0, Dom);
        const isDommy = (subdom: number) => subdom >= 50 ? 2 : subdom < 10 ? 0 : (subdom - 10) / 20.0;
        scenes.AddEnc(() => {
            Text.Out(`You surface briefly to tease the farmhand, telling him that you hope he isn’t gonna pop already… you are just getting started. Before he can respond, you go down on him again, this time allowing his flared head entry into your well-trained throat. The equine gives a muffled groan as you deepthroat him, too overwhelmed to give you any coherent answer.

            For a few minutes, you continue to rock Adrian’s world with your expert cocksucking skills. You hum and moan around his massive shaft, the vibrations sending shivers all the way up his spine. There’s a warm sensation lower down in your throat as he deposits another batch of fresh pre. You pull up to get a taste, whisking your ${pc.tongue} around his flared head as you look up at him in anticipation.`);
        }, 1.0 + isDommy(player.SubDom()), master);

        scenes.Get();

        Text.NL();

        let variations = [
            `“M-Mhm… that feels so… good…” Adrian moans, shifting his hips.`,
            `“O-Ohh… ${pc.name}... a-almost there… f-fuck…” Adrian groans, `,
        ];
        if (Dom) {
            variations = _.concat(variations, [
                `“Mmm… fuck, you’re good with that tongue of yours… hrmf… gonna…” Adrian grunts, pawing at the ground.`,
                `“Mmm… that’s a good… mare… g-get ready…” Adrian grunts, muscles tensing.`,
            ]);
        } else if (Sub) {
            variations = _.concat(variations, [
                `Adrian whinnies desperately, stamping the ground with one of his hoofs. “A-Ahhh! C-Can’t…!”`,
                `“I-I won’t h-hold much longer… I-I… Ahhh!!!” Adrian moans weakly, his legs trembling.`,
            ]);
        }

        Text.Out(`${_.sample(variations)} You can feel a twitch running through his member. The eye of his cumslit winks at you, heralding his impending climax.`);

        let deepOdds = _denial ? 50 : 25;
        if (player.SubDom() >= 50) {
            deepOdds -= player.SubDom() - 50;
        } else if (player.SubDom() < 0) {
            deepOdds -= player.SubDom();
        }
        const deepthroat = Dom && _.random(1, 100) < deepOdds;
        if (deepthroat) {
            Text.NL();
            Text.Out(`Just as you are pondering how you want to finish the stallion off, you find that your decision has been made for you. With little regard for your comfort - or anything else excluding his pleasure - the dominant stud places a firm hand on the back of your head and thrusts his hips forward, burying his massive girth in your esophagus. Adrian’s eyes are closed, and the farmhand is grunting and moaning to himself, rutting faster and faster as he nears his orgasm. ${master ?
                `You are surprised at his rough manhandling at first, but quickly adapt to his rapid pace, eagerly deepthroating your dominant lover` :
                `Any feeble protests from your side are completely ignored by the dominant farmhand, who proceeds to throatfuck you with gusto. You eventually resign yourself to your fate, left with little choice to do otherwise`}.`);
            BlowjobDeepthroatEntrypoint(true);
        } else {
            Text.Flush();
            // [Cum shower][Deepthroat][Outside][Denial]
            const options: IChoice[] = [
                {
                    nameStr: `Cum shower`,
                    func: () => {
                        Text.Clear();
                        Text.Out(`That’s it, that’s a good stud… you want this so badly… You smile, stroking him sensually, coaxing him to stop holding back, to give it all to you. ${Sub ? _.sample([
                            `Adrian whinnies, hooves pawing at the ground as you grasp his member firmly. “I… I need to… hahh… can I c-cum, ${pc.name}? P-Please let me… hngh…!”`,
                            `“A-Ahh… p-please, I need to cum!” Adrian bites his lip, gasping and giving you a sultry look. No need for him to worry… you’ve worked too hard for this to let him off easy now. You grab hold of his member firmly, rapidly jacking him off. “F-Fuck… ${pc.name}, t-thank youuu…!”`,
                        ]) : Dom ? _.sample([
                            `Adrian smirks down at you, caressing your ${pc.hair} as he grabs hold of his member, guiding it to point directly at you. “You want it that much…? Better not regret this… gonna be a big one… hng!”`,
                            `“Mmm… you look good down there, m-mare…” Adrian huffs, slowly jerking himself off as he points his spunk cannon at your expectant ${pc.face}. “Where you belong, in front of my dick… hngh!”`,
                        ]) : _.sample([
                            `Adrian whinnies, blushing down at you like he doesn’t know what to do… not that it matters. You grasp hold of his member firmly. His body will give you want you need. “A-Ahh… ${pc.name}, I… c-cumming…!”`,
                            `“A-Ahh! I-It’s coming… mph…” Adrian bites down on his lip, trembling as you firmly grasp his member, jacking him off to completion. “I-I… hngh!”`,
                        ])} He tenses up, cockhead flaring. You close your eyes just as the first wave of his massive load hits you.`);
                        adrian.OrgasmCum();

                        Text.NL();
                        Text.Out(`The farmhand must have been pretty pent up: the stream of seed pumped from his balls seem almost endless. In just a few blasts, your entire front - ${pc.face}, ${pc.hair} and ${pc.breasts} alike - are thoroughly coated in thick white strands of potent horse jizz. You cough, surprised for a moment as a single discharge of his bloated nuts all but flood your open mouth.

                        You languish in his hot, sticky spunk basting, feeling more and more of it soaking your ${pc.skin}, like you’re being given a very lewd spa treatment. He’s utterly drenched you, and his scent fills your nostrils, overpowering your sense of smell. You languidly lick your lips and swallow, lavishing his taste.

                        Eventually, the deluge relents. Adrian sighs happily, most of his nut batter successfully transferred from his balls to you and everything in a five foot radius of you. You peek an eye open, wiping a strand of stray spunk from your brow.`);
                        Text.NL();
                        let variations = [
                            `“T-Thanks…” The horse-morph lets out a shuddering gasp, coming down from his high. He gives his softening beast a jerk, shaking out the last of his load to splatter on the ground.`,
                            `The horse-morph grunts, shaking the last drops of cum from his softening member. “That was… hah… thanks.” He blushes, looking away from the mess he’s made of you.`,
                        ];
                        if (Dom) {
                            variations = _.concat(variations, [
                                `“Mm… a pretty mess you are.” The horse-morph grins at you. “I don’t mind seeing you like this… though I bet you’d look even better with your belly f-full with my cum.” You blush a little at that. “Maybe next time, eh?”`,
                                `“Fuck, I needed that… good job, ${pc.name}.” The horse-morph smiles at you, patting your ${pc.hair} fondly. “Knew I could count on you to get me off… l-looking forward to next time.” He holds out his sticky fingers for you, letting you lick him clean.`,
                            ]);
                        } else if (Sub) {
                            variations = _.concat(variations, [
                                `“S-Sorry about that… here, let me h-help.” The horse-morph leans down to clean up the worst of the mess, dirtying himself in the progress. You smile to yourself as he licks your fingers clean of his own spunk. Despite his demure act, he sure doesn’t balk at debasing himself when prompted.`,
                            ]);
                        }
                        Text.Out(`${_.sample(variations)}

                        Adrian brings out a bucket of water and a towel, letting you wash the worst of it away, but even so it takes more than a few rinses to get all of it out. It’s quite some time until you consider yourself presentable, by which point the farmhand has restored his clothing and looks to be ready for work again. You put on your gear again, but can’t help feeling even more horny.`);

                        adrian.slut.IncreaseStat(75, 4);
                        TimeStep({hour: 1});
                        player.AddLustFraction(0.5);
                        _denial = false;

                        Prompt();
                    }, enabled: true, tooltip: `Jerk him to completion and have him mark you with his seed.`,
                },
                {
                    nameStr: `Deepthroat`,
                    func: () => {
                        Text.Clear();
                        Text.Out(`${Dom ? `“Mmm… that’s a good… little mare…” The farmhand smiles approvingly as you sensually wrap your lips tightly around his dick and grasp him tightly by the hips, pushing him deep into the back of your mouth` : `“W-Woah…” The farmhand looks down at you with wide eyes as you easily swallow his huge dick`}, hungrily devouring his member. You start rapidly bobbing your head on his cock, massaging his entire length with your throat, eliciting eager moans from your lover.`);
                        BlowjobDeepthroatEntrypoint(false);
                    }, enabled: master, tooltip: `Take him deep in your throat and swallow every drop of his hot load.`,
                },
                {
                    nameStr: `Outside`,
                    func: () => {
                        Text.Clear();
                        const { tallPC, shortstackPC } = player.HeightDiff(adrian);
                        Text.Out(`The ${Dom ? `stallion` : `farmhand`} looks just about ready to blow, and judging by the size of his swollen balls, it’ll be a big one. You smoothly rise, leaning into Adrian’s side and whispering sweet nothings to him as you jerk off his throbbing member, getting out of its line of fire.`);
                        Text.NL();
                        if (Sub) {
                            const c = new GP.Plural(player.NumCocks() > 1);
                            Text.Out(`“N-Ngh… y-you… stopped…?” The horse-morph whimpers, looking ${tallPC ? `up` : shortstackPC ? `down` : `sideways`} at you. Fufu… he thought you’d swallow his mess? Maybe if he’s a good boy you’ll consider it… for now, you’ve got something else in mind.

                            You work his shaft relentlessly, caressing the massive saliva-slickened pillar of cockflesh. ${pc.hascock(`Your ${pc.cocks} rub${c.notS}`, `You rub your sopping wet ${pc.vag}`)} against his muscular thigh through your undergarments, as your free hand sneaks up behind the preoccupied equine. He wants to cum…? You suddenly let go of his twitching dick, which bobs up and down, dripping sloppy pre on the ground. Well… go right ahead!

                            Adrian whinnies loudly as you plant a sharp slap on his exposed buttocks. The unexpected stimulation is the last drop for the farmhand, and you watch mirthfully as his horsecock twitches, firing off rope after rope of thick seed that splashes uselessly on the ground.${player.SubDom() >= 60 ?
                            ` There’s a good boy… but good boys clean up their messes, right? The submissive equine’s eyes widen as you bring your cum slick fingers to his lips, presenting them for licking. After only a moment’s hesitation, he complies, eagerly suckling at your digits.` :
                            ``} You pat him on the cheek, cooing at him encouragingly as he shudders, riding out his orgasm.`);
                        } else if (Dom) {
                            Text.Out(`“C’mere, you… mmph…” Adrian hungrily pulls you into a sloppy kiss while you jack him off, your tongues fencing with each other even as he starts pumping out his seed. You can feel his girthy phallus twitching in your ${pc.hand}, hot cum spraying from its flared head and dripping down on your fingers.

                            You lean into his kiss, riding out his messy orgasm. “Mmm… that’s a good ${pc.mfFem(`boy`, `girl`)},” the stallion praises you, nuzzling against you and playfully nibbling your neck. “You made quite the mess…” He trails off suggestively, wearing a ghost of a smile.

                            ${player.Slut() >= 40 ? `You lean back, looking deep into his eyes as you slowly raise your sticky ${pc.hand} to your lips and sensually lick yourself clean.` : `You blush, looking away from him. You hurriedly wipe your hand of his sticky seed.`} The equine chuckles, patting your ${pc.hair}.`);
                        } else {
                            Text.Out(`It’s not long before the equine succumbs to your fervent handjob, spraying the ground in front of him with rope after rope of his thick seed. You keep tugging at his horsecock until he’s thoroughly spent.

                            “Unf… haah… t-thanks… that felt… nice.” The farmhand blushes, looking away, quite flustered after his climax. “M-Maybe next time, you can f-finish me off with your… m-mouth?” Next time, huh? He sure is growing bold, isn’t he? He blushes even brighter. You say you’ll think about it, petting his softening member familiarly.`);
                        }
                        adrian.OrgasmCum();
                        Text.NL();
                        Text.Out(`The two of you slowly come down from your high, rinsing yourselves with some water and restoring your clothes to a somewhat presentable state. You left quite a mess… but it was worth it.`);

                        adrian.slut.IncreaseStat(75, 2);
                        TimeStep({hour: 1});
                        player.AddLustFraction(0.3);
                        _denial = false;

                        Prompt();
                    }, enabled: true, tooltip: `Move out of the way and have him spew his seed on the ground while you jerk him off.`,
                },
                {
                    nameStr: `Denial`,
                    func: () => {
                        Text.Clear();
                        Text.Out(`You give Adrian a sultry smile as your hand constricts sharply around his root, squeezing his cumchute closed tight. The farmhand’s horsecock twitches desperately, his nuts churning with repressed need. You wag your finger. Naughty horsies don’t get to cum as easily as that… You’ve had your fun, you’re sure he can find some way to solve this issue on his own, right?`);
                        Text.NL();

                        const denyDenial = Dom && player.SubDom() < 60 && (_.random(1, 70) >= player.SubDom());

                        if (Dom && _denial) {
                            Text.Out(`“Ngh… that does it!” Adrian growls, slapping your hand away. You gasp as he glowers down at you. “I think someone is in n-need of a lesson!” Oh? And whatever punishment does the stallion have in store for his misbehaving little mare?

                            Rather than answering, the muscular equine just tosses you up over one shoulder as if you were a sack of grain. Adrian carries you through the barn, ignoring the surprised stares of farmhands and livestock alike.`);
                            // TODO Leadin
                            DomProperFuckedEntrypoint();
                        } else if (denyDenial) {
                            Text.Out(`“Ngh… don’t think I’ll let something like that slide…” Adrian grunts, glowering down at you. “I’m gonna get off, the only question is how.” You blush and ease your grip, licking your lips and getting a taste of his potent cum. His cock is bobbing in front of you, juicy, enticing and full of delicious horse spunk. You should probably do what he says…`);
                            player.subDom.DecreaseStat(0, 1);
                            Text.Flush();

                            _.last(options).enabled = false;
                            Gui.SetButtonsFromList(options);
                        } else {
                            Text.Out(`“B-But…! Ngh…” You chuckle at his struggling, but remain unrelenting. Maybe next time… if he keeps being a good boy. The equine shudders, his dick slowly softening. His balls remain swollen and heavy, denied their purpose. He’ll probably be feeling this one for a while…

                            ${Dom ?
                                `“Hrm… ya got spunk, ${pc.name},” Adrian rumbles, giving you a playful punch on the shoulder. “I’m gonna give you a warning… I’m gonna need to take care of this, at that’ll mean fucking whoever I run into next. If you want to stay on your high horse… better stay out of my way for a while, got it? Or, you know, don’t.” His confident smirk reduces the weight somewhat of your show of power. Still, he relents. For now.` : Sub ?
                                `“H-Hah… I… alright.” Adrian whinnes, hanging his head. You give his balls a friendly pat, making the hulking equine shiver. Good, he knows his place. You’ll be back to play with him later… when you feel like it. He nods meekly, though you catch him looking around for Gwendy, maybe in the hopes that she’ll ‘reprimand’ him.` :
                                `“I-I was so close… why d-did you…?” Adrian glowers at you accusingly. Come on now… you’ve been nice to him; shouldn’t he return the favor now and then? His eyes widen slightly at that. “I… ugh.” He shakes his head and looks away, blushing at your knowing grin.`} You and the farmhand restore your clothes, the horse-morph still sporting quite a prominent tent on the front of his pants.`);

                            adrian.slut.IncreaseStat(75, 2);
                            player.subDom.IncreaseStat(60, 1);
                            player.AddLustFraction(0.1);
                            TimeStep({hour: 1});
                            _denial = true;

                            Prompt();
                        }
                    }, enabled: player.SubDom() >= 30, tooltip: `${Dom ? (_denial ? `You’ve been blue balling the stallion for a while now… let’s see how far you can push him before he pushes back.` : `Deny the stallion his pleasure. He might have something to say about it… but that could also be rather fun.`) : `He doesn’t get to cum today, no matter how much he begs.`}`,
                },
            ];
            Gui.SetButtonsFromList(options);
        }
    }

    export function BlowjobDeepthroatEntrypoint(forced: boolean) {
        const adrian: Adrian = GAME().adrian;
        const player: Player = GAME().player;
        const pc = player.Parser;
        const { Dom } = _AdrianState();

        Text.NL();
        if (Dom) {
            Text.Out(`${_.sample([
                `“Mmm… fuck, your mouth is good, ${pc.name}... just a little longer…”`,
                `“Ngh… gonna blow my load soon… gonna fill you up, ${pc.name}...”`,
                `“F-Fuck, that feels good… ngh… your reward is coming… just a little more…”`,
                `“Mmm… your throat is the best, ${pc.name}... gonna give you your treat…”`,
                ])} Adrian grunts, grinding his girth into you as deep as it will go.`);
        } else {
            Text.Out(`${_.sample([
                `“A-Ahh… ${pc.name}... I’m gonna… ngh!”`,
                `“H-Hah… h-holy S-Spirits… c-cumming…!”`,
                `“Ahh! C-Can’t hold it any l-longer… ${pc.name}... I’m… gonna…!”`,
                `“Ngh! Ahh… s-sorry, I’m gonna… ahh… here it c-comes!”`,
                ])} Adrian twitches and tenses up. The farmhand muffles his high pitched whinny with his hand, biting down on his lip.`);
        }
        Text.Out(` You can feel his shaft throbbing in your throat urgently, expanded by an endless flood of hot horse seed pumped directly from his swollen nuts. Your bowels are blasted by his thick load, which quickly bloats your stomach, threatening to overflow it.`);

        player.AddSexExp(1);
        adrian.OrgasmCum();

        Text.NL();
        if (forced) {
            Text.Out(`You’re fading, choking on close to twenty inches of horsecock, feebly tapping the stallion’s thigh for relief. By the time he acknowledges your plight, you’ve almost blacked out. With excruciating slowness, Adrian withdraws his massive member, flopping it messily against your ${pc.face} as you cough and gasp for air, drooling cum everywhere.

            ${_.sample([
                `“Sorry… lost control there for a bit. Heh.” His wide grin somewhat takes away from the sincerity of his apology.`,
                `“Ahh… I needed that. Sorry if I was a bit rough - you’ll get used to it with some more practice.” Judging by his wide grin, he’d be more than happy to help out in that regard.`,
                `“Good job, ${pc.name}.” The grinning farmhand reaches down to pat you on the head. “I knew you could do it.”`,
            ])} You glower up at him, wiping a glob of messy spunk from your lips.`);
            player.subDom.DecreaseStat(-75, 1);
        } else {
            Text.Out(`You savor every drop, nursing and suckling the ${Dom ? `stallion` : `horse boy`}’s shaft as he comes down from his high. When you slowly pull yourself off him, sucking every inch spotless as you go. You smirk up at him and swallow the last of his cum, licking your lips and feeling thoroughly satisfied.`);
        }
        Text.NL();
        Text.Out(`${Dom ? `Adrian wipes himself off before tossing you a slightly cum soaked towel` :
        `Adrian helps you clean up`}, and the two of you restore your clothes to the best of your abilities. Little can be done about the heavy smell of sex reeking from you, though.`);

        adrian.slut.IncreaseStat(75, 5);
        TimeStep({hour: 1});
        player.AddLustFraction(0.3);
        _denial = false;

        Prompt();
    }

    export function DomProperFuckedEntrypoint() {
        const player: Player = GAME().player;
        const adrian: Adrian = GAME().adrian;
        // TODO PLACEHOLDER
        Text.NL();
        Text.Out(`Giving you little chance to protest, the stallion straps you into one of the stalls, securing you with thick ropes. Over the course of the next couple of hours, he proceeds to fuck you with gusto, leaving you a ruined mess as reward for your transgression. When you’re finally let go, you wobble away, followed by the knowing eyes of the other farmhands.`);

        Sex.Anal(adrian, player);
        player.FuckAnal(player.Butt(), adrian.FirstCock(), 3);
        if (player.FirstVag()) {
            Sex.Vaginal(adrian, player);
            player.FuckVag(player.FirstVag(), adrian.FirstCock(), 0);
        }

        TimeStep({hour: 5});
        player.OrgasmCum(3);
        player.subDom.DecreaseStat(-100, 3);
        adrian.slut.IncreaseStat(100, 7);

        Text.Flush();
        Gui.NextPrompt();
    }
}
