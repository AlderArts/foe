import { Race } from "../../body/race";
import { EncounterTable } from "../../encountertable";
import { Entity } from "../../entity";
import { GAME, TimeStep, WORLD } from "../../GAME";
import { Gui } from "../../gui";
import { IChoice } from "../../link";
import { BurrowsFlags } from "../../loc/burrows-flags";
import { Party } from "../../party";
import { PregnancyHandler } from "../../pregnancy";
import { Text } from "../../text";
import { VenaFlags } from "./vena-flags";

export namespace VenaScenes {

    export function Impregnate(mother: Entity, father: Entity, slot?: number) {
        const vena = GAME().vena;
        mother.PregHandler().Impregnate({
            slot   : slot || PregnancyHandler.Slot.Vag,
            mother,
            father,
            race   : Race.Rabbit,
            num    : 5,
            time   : (mother === vena) ? 24 : 20 * 24,
            load   : 4,
        });
    }

    export function PitApproach() {
        const burrows = GAME().burrows;

        const parse: any = {

        };

        Text.Clear();
        Text.Add("You make your way to the bottom of the Pit, treading carefully on the slippery ground and sidestepping fornicating bunnies. At the center of the chamber, the lagomorph matriarch spends her time in blissful ecstasy, forever caught up in the carnal cycle of impregnation and birth.", parse);
        Text.NL();

        if (burrows.BruteActive()) {
            Text.Add("Vena is huge - she was large for a bunny when you first arrived to the Burrows, but it’s nothing when compared to her current amazonian form. At six foot seven, most of her children are dwarfed by her size. Her limbs are bulging with taut muscles only barely hidden by her white fur, though her overall frame is still very feminine and rounded. The hulking matriarch has hips and breasts fit for a breeder, and her stomach is swollen with a growing litter as always. Around her neck, her fur thickens, forming a fluffy collar.  Her hair is very long, almost reaching her ankles, and a pair of floppy rabbit ears lay flat against her back.", parse);
            Text.NL();
            Text.Add("Since her transformation, the broodmother has gained even more stamina than before, and is easily keeping up with her multitude of partners.", parse);
            if (burrows.HermActive()) {
                Text.Add(" Between her legs, Vena has one of the biggest cocks you’ve ever seen. Even for her huge frame, the over two feet long monstrosity looks ridiculously oversized.", parse);
            }
        } else {
            Text.Add("Vena is tall for a bunny - about the same size as Lagon, but her features are softer and more feminine. The breeder has immense hips and breasts, well equipped to handle her perpetual pregnancy. Soft fur matted with sweat and sexual fluids covers her motherly form, with a thick fluffy collar surrounding her neck. Her white hair is long, almost reaching her ankles. A pair of huge, floppy rabbit ears lay flat against her back.", parse);
            if (burrows.HermActive()) {
                Text.Add(" Between her legs, Vena has a nine inch cock in place of her clit, protruding from just above her pussy.", parse);
            }
        }
        Text.NL();

        const scenes = new EncounterTable();
        scenes.AddEnc(() => {
            Text.Add("When you approach, the bunny is receiving a thorough fucking by half a dozen of her children. The matriarch is on her knees in the pool of spunk, stifling moans as an acrobatic trio of males are pummeling away at her pussy and ass. Her remaining sons are hovering around her awaiting their turn, stroking themselves.", parse);
        }, 1.0, () => true);
        scenes.AddEnc(() => {
            parse.c = burrows.HermActive() ? "lips glued around Vena’s cock" : "lapping at Vena’s clit";
            Text.Add("The bunny is on her back, her hips raised to give her two sons a better angle as they rail her. Two female lagomorphs suckle at her massive breasts, while a third is straddling her stomach, [c]. She looks up at the new arrival expectantly.", parse);
        }, 1.0, () => true);
        scenes.AddEnc(() => {
            Text.Add("For the moment, there is a lull in the onslaught of her children. The matriarch is curled up on her side, cradling three of her sleeping daughters. Behind her, one of her sons is resting with his arms around her midsection, cock stuffed into her snatch. The entire group is covered in cum from their recent coitus.", parse);
        }, 1.0, () => true);
        scenes.AddEnc(() => {
            parse.child = Math.random() < 0.5 ? "son" : "daughter";
            Text.Add("Vena is up on her knees, pounding her length into one of her eager [child]s even as she’s is in turn fucked from behind. As you approach, the matriarch cries out, giving her [child] a bellyful of hot bunny cream. She pulls out, shooting a few more strands of sloppy spunk on the collapsed figure, her cock glistening with sexual juices. She looks at you expectantly, licking her lip.", parse);
        }, 1.0, () => burrows.HermActive());

        scenes.Get();

        Text.NL();
        if (burrows.BrainyActive()) {
            Text.Add("<i>“You… different than the others… you here to make me feel good? Give me lots of children?”</i> There’s a flicker of recognition in her eyes as they meet yours, but it’s overshadowed by the veil of insatiable lust fogging her mind. <i>“I… need!”</i>", parse);
        } else {
            Text.Add("<i>“Ahh… you… different. Fuck me?”</i> There’s no sense of recognition in her eyes; you’re just another fucktoy come to use and pleasure her. From her rapt, ecstatic expression, she couldn’t be any happier.", parse);
        }
        Text.Flush();
        TimeStep({minute: 5});

        VenaScenes.PitPrompt();
    }

    export function PitPrompt() {
        const burrows = GAME().burrows;
        const parse: any = {

        };

        const options: IChoice[] = [];
        options.push({ nameStr : "Talk",
            func() {
                Text.Clear();
                TimeStep({minute: 5});
                Text.Add("You make an attempt at catching Vena’s attention, trying to divert her mind from sex for a few moments. Caressing her cheek, you ask if she wants to answer a few questions.", parse);
                Text.NL();
                if (burrows.BrainyActive()) {
                    Text.Add("<i>“What… talk about?”</i> she responds, cocking her head to the side.", parse);
                    Text.Flush();

                    VenaScenes.PitTalkPrompt();
                } else {
                    Text.Add("<i>“Mm… talk… fuck?”</i> she pants quizzically. Some of her children take up on the call, and she’s quickly distracted with more pressing matters. You make another frustrated attempt to get her focused, but she’s too far gone.", parse);
                    Text.Flush();

                    VenaScenes.PitPrompt();
                }
            }, enabled : true,
            tooltip : "You’re not sure how much good it’ll do, but trying to get her attention can’t hurt.",
        });
        /* TODO
        options.push({ nameStr : "name",
            func : () => {
                Text.Clear();
                Text.Add("", parse);
                Text.NL();
                Text.Flush();
            }, enabled : true,
            tooltip : ""
        });
        */
        Gui.SetButtonsFromList(options, true, () => {
            Text.Clear();
            Text.Add("You are already forgotten as you step away from the matriarch, a swarm of her offspring flowing in demanding attention and sex.", parse);
            Text.NL();

            Gui.PrintDefaultOptions(true);
        });
    }

    export function PitTalkPrompt() {
        const roa = GAME().roa;
        const ophelia = GAME().ophelia;
        const burrows = GAME().burrows;
        const party: Party = GAME().party;

        const parse: any = {

        };

        // [Herself][Lagon][Ophelia][Roa][The Pit][Back]
        const options: IChoice[] = [];
        options.push({ nameStr : "Herself",
            func() {
                Text.Clear();
                Text.Add("<i>“Vena is loyal slut,”</i> she boasts proudly. <i>“Makes lots and lots of babies for my mate.”</i>", parse);
                Text.NL();
                Text.Add("Does she like it here? Would she want to return to the way she was before?", parse);
                Text.NL();
                Text.Add("<i>“Don’t… remember before.”</i> She struggles, trying to concentrate. <i>“Vena feels good here. Warm and safe, always lots of sex!”</i>", parse);
                Text.Flush();
                TimeStep({minute: 5});
            }, enabled : true,
            tooltip : "Ask Vena about herself and her past.",
        });
        options.push({ nameStr : "Lagon",
            func() {
                Text.Clear();
                Text.Add("<i>“Vena loves her mate,”</i> the matriarch replies staunchly. <i>“Births many children for him!”</i> She isn’t lying, you can tell, she really does feel this way about the tyrant king. Perhaps she doesn’t understand her current circumstances.", parse);
                Text.NL();
                Text.Add("<i>“Vena and Lagon were together from beginning. Happy family, lots of children. We have many more now.”</i>", parse);
                Text.NL();
                Text.Add("Well… that’s certainly an understatement.", parse);
                Text.Flush();
                TimeStep({minute: 5});
            }, enabled : true,
            tooltip : "How does she feel about Lagon? How did he rise to his throne?",
        });
        options.push({ nameStr : "Ophelia",
            func() {
                Text.Clear();
                Text.Add("<i>“Good girl,”</i> Vena says proudly. <i>“Helps her father much. Want to see more of her...”</i>", parse);
                Text.NL();
                if (burrows.LagonDefeated()) {
                    Text.Add("You try to explain that Lagon isn’t in charge anymore, Ophelia is, but Vena doesn’t seem to grasp the concept.", parse);
                } else if (ophelia.InPartyAndBroken()) {
                    Text.Add("The matriarch gives Ophelia a happy squee, embracing her. <i>“Me here, mother!”</i> It’s actually quite touching.", parse);
 }
                Text.Flush();
                TimeStep({minute: 5});
            }, enabled : true,
            tooltip : "How does she feel about her daughter Ophelia?",
        });
        if (burrows.flags.Access >= BurrowsFlags.AccessFlags.Stage3) {
            options.push({ nameStr : "Roa",
                func() {
                    Text.Clear();
                    Text.Add("<i>“Roa is good boy!”</i> Vena replies. <i>“Often kept me company here in Pit.”</i> She licks her lips, and one of her hands absently strays to her massive cock. <i>“Would… love keep him company again.”</i>", parse);
                    if (party.InParty(roa)) {
                        Text.NL();
                        Text.Add("<i>“I’m here, mother,”</i> Roa reassures her, petting the larger bunny. You catch his gaze drifting to his mother’s erection, the slutty little trap eyeing it hungrily.", parse);
                    }
                    Text.Flush();
                    TimeStep({minute: 5});
                }, enabled : true,
                tooltip : "Does she remember her son, Roa?",
            });
        }
        options.push({ nameStr : "The Pit",
            func() {
                Text.Clear();
                Text.Add("<i>“This my home, everyone nice here,”</i> she proclaims, nuzzling her children. <i>“They care for Vena, give me all the food and warmth and sex I need.”</i>", parse);
                Text.Flush();
                TimeStep({minute: 5});
            }, enabled : true,
            tooltip : "How does she like it here?",
        });
        Gui.SetButtonsFromList(options, true, () => {
            Text.Clear();
            Text.Add("<i>“...We fuck now?”</i> Vena looks at you hopefully.", parse);
            Text.Flush();

            VenaScenes.PitPrompt();
        });
    }

    export function RestoreEntrypoint(fight: boolean) {
        const player = GAME().player;
        const party: Party = GAME().party;
        const ophelia = GAME().ophelia;
        const vena = GAME().vena;
        const burrows = GAME().burrows;

        const parse: any = {
            playername : player.name,
        };

        vena.flags.Met |= VenaFlags.Met.Restored;
        burrows.flags.Access = BurrowsFlags.AccessFlags.QuestlineComplete;

        ophelia.relation.IncreaseStat(100, 25);
        party.location = WORLD().loc.Burrows.Pit;

        Text.Add("There’s an air of anticipation as your party reaches the Pit. Ophelia is in front, smiling giddily and cradling the scepter to her breast, and at least a dozen guards follow behind her. Gradually, the moans and groans of the orgy recede, bunnies pausing mid-coitus as everyone’s attention focuses on you. The procession makes its way down into the center of the Pit, Ophelia stopping and drawing a nervous breath before approaching her mother.", parse);
        Text.NL();
        Text.Add("Vena is, for once, not being fucked by a half dozen of her children. The pregnant matriarch lies curled up in a ball, snuggling peacefully with her latest partners as she takes a much needed nap. The alchemist looks a bit apprehensive as she gently rouses her mother from her slumber, softly caressing her cheek.", parse);
        Text.NL();
        Text.Add("<i>“Finally, I can return you to your old self, mother,”</i> Ophelia whispers fondly, awkwardly patting the matriarch before rising to her feet. Turning to face the captivated audience, the alchemist takes tone and addresses her people. ", parse);
        const comp = party.Num() === 2 ? party.Get(1).name : player.mfTrue("his", "her") + " friends";
        parse.c = party.Num() > 1 ? Text.Parse(" and " + comp, parse) : "";
        if (fight) {
            Text.Add("<i>“Brothers and sisters! Lagon’s tyranny is at an end; he’s been brought low through the heroic efforts of [playername][c]. No longer will father’s hateful ambition drive us forward!”</i> The confused rabbits titter nervously among themselves. Surely this is some sort of test; nobody can defeat Lagon…", parse);
            Text.NL();
            Text.Add("<i>“My guards will testify to the truth of this; father has been defeated. And an even grander prize is this!”</i> Ophelia triumphantly raises the scepter over her head.", parse);
        } else {
            parse.s = party.Num() > 1 ? "s" : "";
            Text.Add("<i>“Brothers and sisters! At my side stands [playername][c], the one[s] who defeated my father! I’ve done my best to lead our people in his absence, but it’s a task outside my capabilities. Thankfully, [playername] has brought us another prize,”</i> Ophelia proclaims, triumphantly raising the scepter over her head.", parse);
        }
        Text.Add(" <i>“With this, Vena can be cured, and things can go back to how they were before!”</i>", parse);
        Text.NL();
        Text.Add("You shift uncomfortably under the unblinking stares of the lagomorphs. Something in your gut tells you that more than a few of them would have been just fine with the old order of things, and the only thing keeping them back is the fact that the undefeated Lagon fell to your hand. You really hope this is going to work.", parse);
        Text.NL();
        Text.Add("<i>“Lagon… gone?”</i> Vena asks, her voice wavering, tears in her eyes as she tries to process the concept. <i>“M-my mate...”</i> Ophelia hugs her, trying to calm her down.", parse);
        Text.NL();
        Text.Add("<i>“Don’t worry, mother. He won’t hurt you anymore.”</i> Catching the anguished note in Vena’s voice, the alchemist hurries to add: <i>“He’s alive and well.”</i> She sounds a little less sure of herself as she disentangles herself from her mother and turns to face you. <i>“W-we did the right thing, didn’t we?”</i> she asks in a small voice.", parse);
        Text.NL();
        Text.Add("You nod resolutely; this was the only way, and Lagon got what he had coming. Now would be a good time to work the scepter’s magic, unless you want another rebellion on your hands. <i>“R-right.”</i> Ophelia gulps, kneeling before the lagomorph matriarch, touching the stone fastened in the scepter to Vena’s forehead. ", parse);
        if (fight) {
            Text.Add("<i>“It’s more difficult than with father,”</i> Ophelia scowls in concentration. <i>“Breaking is easier than mending.”</i>", parse);
        } else {
            Text.Add("<i>“I’ve studied the scroll a thousand times, but actually doing it is different,”</i> Ophelia scowls in concentration.", parse);
        }
        Text.NL();
        Text.Add("You can almost see the memories flit by in Vena’s eyes as the foggy haze on her mind slowly lifts, the stone counteracting the effects of the alchemy. Gradually, the matriarch’s gaze grows clearer and steadier as the scepter works its magic. Ophelia’s eyes are shut in silent prayer as her hands flit over the rod, pressing and turning spots on it in an intricate pattern. Finally, she lets it drop to her side, looking up at her mother apprehensively.", parse);
        Text.NL();
        Text.Add("Vena slowly gets up on her feet and looks around herself in wonder, studying her powerful body and patting her pregnant belly, her gaze wandering over the silent crowd. Realization finally comes when she looks down at her anxious daughter, and her eyes fill with tears. <i>“O-Ophelia, my dear daughter...”</i>", parse);
        Text.NL();
        Text.Add("<i>“Mother!”</i> the lagomorph wails, throwing herself into Vena’s arms, hugging her tightly. A cheer goes up from the surrounding lagomorphs, the tension in the cavern finally cleared. You let out a relieved sigh, relaxing a bit.", parse);
        Text.NL();
        Text.Add("Mother and daughter are gushing over each other, reunited at last after being separated by the veil of alchemy for so long.", parse);
        Text.NL();
        Text.Add("<i>“Tell me everything,”</i> Vena settles down, putting the much smaller rabbit in her lap. The alchemist starts to hastily tell her the tale of how Lagon drugged her and put her here in order to usurp control over the burrows, how he forced Ophelia to further transform Vena in order to breed his army. She is crying freely, blubbering about how sorry she is, how this was all her fault, but Vena hushes her, caressing her hair gently.", parse);
        Text.NL();
        Text.Add("<i>“I know you were not to blame, dear one,”</i> she reassures her gently. <i>“Oh my daughter, the things you’ve had to endure… how could you ever forgive me...”</i>", parse);
        Text.NL();
        Text.Add("<i>“Just having you back is enough,”</i> Ophelia sniffles as she snuggles close, wearing a happy smile. The matriarch waves you closer, patting her daugher on the head.", parse);
        Text.NL();
        Text.Add("<i>“You must be [playername],”</i> she smiles warmly, greeting you. <i>“I don’t know how I could repay you for what you’ve done...”</i> ", parse);
        if (vena.flags.Sex !== 0) {
            Text.Add("Well, you’re sure you can discuss it later. This isn’t exactly the first time you’ve met, so to speak. <i>“Yes, the memories are coming back to me,”</i> she smiles at you fondly. <i>“I’m sure we can pick it up at a more appropriate time, but there are other matters at hand.”</i>", parse);
        } else {
            Text.Add("You can discuss it later, and perhaps in a better place. <i>“You are of course right, there is an urgent matter to take care of before anything else.”</i>", parse);
        }
        Text.NL();
        Text.Add("Vena turns to her daughter, wiping the tears from her fuzzy cheek. <i>“Ophelia, what of your father?”</i> Suddenly apprehensive, the alchemist lowers her gaze.", parse);
        Text.NL();
        Text.Add("<i>“Even weakened as he is, I- I’m afraid of him. He’s chained up in his throne room for now, but I don’t know what we’ll do with him...”</i> She looks up sadly. <i>“Things can’t return to how they were before, can they?”</i>", parse);
        Text.NL();
        Text.Add("<i>“No, daughter, they can’t,”</i> Vena agrees, shaking her head. Steeling herself, she gets up. <i>“Better get this over with. I think my other children can handle themselves for a while.”</i> Sure enough, the cheery mood in the Pit has lit a new fire in the orgy. The matriarch waves for you to follow her, her daughter hanging on to her arm and her guards close in tow as she heads toward the throne room.", parse);
        Text.Flush();

        TimeStep({hour: 1});
        Gui.NextPrompt(() => {
            party.location = WORLD().loc.Burrows.Throne;

            Text.Clear();
            Text.Add("As you walk, Vena asks terse questions to you and Ophelia, slowly filling herself in on the going-ons in the burrows in her mental absence. Her expression grows grimmer and more determined by the minute. <i>“My mate has a lot to answer for, it seems.”</i>", parse);
            Text.NL();
            Text.Add("Your party finally arrives in the throne room, the eyes of the harem turning to watch you incredulously as Vena strides into the hall. With her new amazonian frame, she strikes quite an impressive figure only accentuated by the massive behemoth hanging between her legs, which draws the hungry eyes of her sons and daughters.", parse);
            Text.NL();
            Text.Add("<i>“Time enough for that later, children,”</i> she waves them away dismissively. <i>“Where is my mate?”</i> ", parse);
            if (fight) {
                Text.Add("One of her sons wordlessly points toward one of the walls, where Lagon is chained.", parse);
            } else {
                Text.Add("On Ophelia’s command, some of the guards run off and fetch Lagon from his cell.", parse);
            }
            Text.Add(" Gathering herself, the lagomorph matriarch walks up to the fallen king. She stands over him; the hulking amazon regarding her mate’s diminished form.", parse);
            Text.NL();
            Text.Add("<i>“Did it have to come to this, love?”</i> she asks sadly. <i>“I often tried to dissuade you of your hubris… why, <b>why</b> could you not have been content with what you had?”</i> Slowly, Lagon raises his head, staring defiantly at Vena.", parse);
            Text.NL();
            Text.Add("<i>“So they’ve managed to drag you back? It seems like my rebellious daughter’s alchemy isn’t what it’s cracked up to be.”</i> He chuckles harshly. <i>“You’re taking the words right out of my mouth.”</i> The broken king turns his gaze toward Ophelia. <i>“Both of you should have stayed put and be content with your lot. You’d never have to worry again, just let go of everything and be my loyal, diligent breeding sluts. Instead, you betrayed me.”</i> His eyes are filled with fury and the alchemist takes a fearful step back, despite the metal chains restraining his body.", parse);
            Text.NL();
            Text.Add("<i>“<b>You</b> betrayed <b>me</b> in pursuit of your mad ambition,”</i> Vena snaps back. <i>“Face it, it’s <b>over</b>. I’ll make sure you never get a chance to rise again.”</i>", parse);
            Text.NL();
            Text.Add("<i>“Oh, and how do you plan to do that? By taking my place? My way is the only way to lead our kind to glory.”</i> Lagon laughs as the matriarch recoils from him, shaken by his words. <i>“It’s still not too late to cower down and return to the Pit, let go of all your worries and let your king rule you again. You know your body craves it.”</i>", parse);
            Text.NL();
            Text.Add("<i>“Mother...”</i> Ophelia grabs Vena’s hand, offering her comfort and strength. Slowly, the amazonian lagomorph recovers her composure.", parse);
            Text.NL();
            Text.Add("<i>“No. Your words are foul poison and I’ll no longer listen to them. You’re no longer the man I loved. You’ve become nothing more than a twisted and spiteful beast.”</i> As the words spill out, her voice grows stronger and more confident. <i>“You’re so worried with your quest for power that you have all but forgotten what really matters. Your family.”</i>", parse);
            Text.NL();
            Text.Add("Lagon bursts out laughing, hysterically. <i>“Family!? Always the simpleton Vena, you could never see what’s beyond the here and now. Always getting in my way. Don’t you see? Our future is on the surface, and the others would never accept our ascension. They would send armies to crush us, unless we crush them first! Are you so stupid you cannot even see this much!?”</i> he asks enraged.", parse);
            Text.NL();
            Text.Add("The lapin recoils at his words, but she easily regains her composure this time. For a moment you catch a glimpse of tears forming in Vena’s eyes as she looks overcome with sadness. But it quickly disappears as her expression turns to one of pity.", parse);
            Text.NL();
            Text.Add("<i>“Your ambition ends here and now, dear; no longer shall our kind strive for mastery over the lands above. You shall remain in chains until I decide what to do with you. Take him away.”</i> Before the stunned Lagon has a chance to respond, she turns her back to him, returning to your side with Ophelia. With a tired expression on her face, the lagomorph matriarch takes her place on her throne as guards drag her mate away.", parse);
            Text.NL();
            Text.Add("<i>“What now, mother?”</i> Ophelia asks, her voice rife with uncertainty.", parse);
            Text.NL();
            Text.Add("<i>“Now, my daughter, we right the wrongs that Lagon has wrought. We rule.”</i> The matriarch turns her eyes to you. <i>“Champion, I don’t know how I can thank you for what you’ve done. You may keep the scepter; I think it will do more good in your hands than in ours. If there’s something you need from us, ask it; if there’s something you need from Lagon’s hoard, it’s yours to take.”</i> She regales you with a smile. <i>“We truly are indebted to you.”</i> Growing more grim, the matriarch adds: <i>“There’s also the matter of my mate. As you were instrumental in his downfall, I’d like to hear your opinion of what should be done with him.”</i>", parse);
            Text.NL();
            Text.Add("<i>“Now, if you'll excuse me, there is much to be done.”</i>", parse);
            Text.NL();
            Text.Add("You leave the lagomorphs to their business, promising that you’ll return once things have quieted down.", parse);
            Text.Flush();

            TimeStep({hour: 1});

            Gui.NextPrompt();
        });
    }
}
