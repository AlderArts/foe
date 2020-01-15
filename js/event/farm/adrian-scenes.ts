import * as _ from "lodash";
import { GAME, TimeStep, WORLD, WorldTime } from "../../GAME";
import { Gui } from "../../gui";
import { IChoice } from "../../link";
import { ILocation } from "../../location";
import { GP } from "../../parser";
import { Text } from "../../text";
import { Time } from "../../time";
import { Player } from "../player";
import { Adrian } from "./adrian";
import { AdrianFlags } from "./adrian-flags";

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
        const jealous = adrian.Jealousy() >= 30 || Taunted;
        return { Shy, Dom, Sub, Seduced, Taunted, Humiliated, Encouraged, slut, friend, jealous };
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
                Text.Out(`Adrian is moving about the barn, hard at work. As usual, he’s misplaced his shirt somewhere. No one seems to be complaining about it.`);
            } else {
                Text.Out(`Adrian appears to have retired to his quarters for the night.`);
            }
            Text.NL();
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

        Prompt();
    }

    export function Prompt() {
        const adrian: Adrian = GAME().adrian;
        const { Dom, Sub, jealous, friend, slut } = _AdrianState();
        Text.Flush();

        const options: IChoice[] = [{ nameStr : "Talk",
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
			tooltip : "Attempt to engage Adrian in conversation.",
		}, { nameStr : "Work",
            func : () => {
                Text.Clear();
                Work();
            }, enabled : adrian.workTimer.Expired(),
            tooltip : "Gwendy needs help around the farm, and maybe the best way to get closer to the stoic equine is to help him out in his work?",
        }, /* TODO { nameStr : "Talk",
            func : () => {
                Text.Clear();
                Text.Out(``);
                TalkPrompt();
            }, enabled : true,
            tooltip : "",
        }*/];

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

        const variations = [
            `At your inquiry whether he needs help, Adrian gives you a wordless nod, gesturing for you to join him in his tasks.`,
            `Adrian replies to your offer of help with a wordless nod, gesturing for you to follow after him.`,
            `The equine farmhand looks like he could use some help. After briefly considering your offer, Adrian gestures for you to follow.`,
        ];
        if (Shy && jealous) {
            variations.push(`“…Just don’t get in the way, got it?” Without another word, Adrian trudges off, gesturing for you to follow.`);
            variations.push(`“Not that I need the help… but fine. Grab that, will you?” Adrian instructs you, his tone of voice expressing clear doubt in your abilities.`);
            variations.push(`“…Fine. This way.” Without another word, he turns his back on you and trudges off. You follow, somewhat miffed at his attitude.`);
        }
        if (Dom || (Shy && friend)) {
            variations.push(`“Nice timing… need some help with something. You up for it?” Adrian turns and gestures for you to follow him.`);
            variations.push(`“${pc.name}, give me a hand here?” Adrian motions you closer.`);
            variations.push(`“Come here, ${pc.name}. I could use a hand.” Adrian waves you over, indicating the task.`);
        }
        if (Dom) {
            variations.push(`“I need you for something. We can chat more after, come along.” With that, Adrian trudges off, leaving you to scamper after him.`);
            variations.push(`“Mind helping out for a bit?” Adrian puts a familiar hand on your back, gently nudging you along. “This’ll take a while, but afterward, if you’re up for it, maybe we could… Well, time enough for that later.”`);
        }
        if (Sub) {
            variations.push(`“S-So… I could use some help… do you think…?” Adrian shuffles on his hooves nervously.`);
            variations.push(`The equine farmhand looks a little crestfallen, so you inquire why. “W-Well, you see…” Adrian goes on to tell you about some tasks that he needs to complete, but he’s running behind. “P-Please, could you help? Mistress Gwendy will be f-furious…”`);
            variations.push(`“I s-should get back to work. You shouldn’t l-loiter either, Mistress Gwendy will… punish us.” Though Adrian doesn’t look like he’s averse to the prospect, he nonetheless insists on enlisting your help in his chores.`);
        }
        Text.Out(`${_.sample(variations)}`);
        Text.NL();
        _.sample([() => {
            Text.Out(`You spend some time helping him move ${_.sample([`seemingly endless bales of hay`, `a pile crates packed with produce`, `a rather large tree that has fallen on the fields`])}, the two of you grunting and straining with the effort. Before long, you are clammy with sweat from the hard work.`);
        }, () => {
            Text.Out(`Handing you a pitchfork, he guides you in cleaning up a number of the empty stalls in the barn. It’s rough and smelly work, but you bite down, determined to do as well as the equine farmhand.`);
        }, () => {
            Text.Out(`Together, the two of you toil in the fields for several hours, and by the end of it your arms are aching from the hard work. The farmhand seems as stoic as ever, though you do catch a hint of gratitude in easing his burden.`);
        }, () => {
            Text.Out(`The two of you spend a few hours performing some much needed repairs on the farm, patching up the barn and mending a broken fence. The equine appears to be quite handy with a hammer, though he’s clearly no master carpenter.`);
        }])();
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
}
