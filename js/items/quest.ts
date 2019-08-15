
import { Item, ItemType } from "../item";

const cactoid = new Item("quest0", "Cactoid", ItemType.Quest);
cactoid.price = 0;
cactoid.Short = function() { return "A live Cactoid"; };
cactoid.Long  = function() { return "A small desert creature that looks like a turtle, but with spiny needles on its back."; };

const redAlgae = new Item("quest1", "Red algae", ItemType.Quest);
redAlgae.price = 0;
redAlgae.Short = function() { return "A red algae"; };
redAlgae.Long  = function() { return "A red algae, gathered from the lake."; };

const golHusk = new Item("quest2", "Gol husk", ItemType.Quest);
golHusk.price = 0;
golHusk.Short = function() { return "A Gol husk"; };
golHusk.Long  = function() { return "The husk looks like it once belonged to a large insectoid creature."; };

const scepter = new Item("quest3", "Scepter", ItemType.Quest);
scepter.price = 0;
scepter.Short = function() { return "Lagon's scepter"; };
scepter.Long  = function() { return "There is a large gemstone set into the scepter, which looks to be of fine craftmanship."; };

const violin = new Item("quest4", "Violin", ItemType.Quest);
violin.price = 0;
violin.Short = function() { return "Cveta's Violin"; };
violin.Long  = function() { return "An incredibly expensive instrument you bought from Dio Rintell in Rigard on the behest of Cveta."; };

const ginseng = new Item("quest5", "Ginseng", ItemType.Quest);
ginseng.price = 0;
ginseng.Short = function() { return "Fresh Ginseng"; };
ginseng.Long  = function() { return "A potent healing herb."; };

const nightshade = new Item("quest6", "Nightshade", ItemType.Quest);
nightshade.price = 0;
nightshade.Short = function() { return "Nightshade"; };
nightshade.Long  = function() { return "A potent poisonous plant."; };

const outlawLetter = new Item("quest7", "Outlaws' letter", ItemType.Quest);
outlawLetter.price = 0;
outlawLetter.Short = function() { return "Outlaws' letter"; };
outlawLetter.Long  = function() { return "The sealed letter that the Outlaws asked you to deliver to their contact in Rigard."; };

const outlawLockpicks = new Item("quest8", "Outlaws' tools", ItemType.Quest);
outlawLockpicks.price = 0;
outlawLockpicks.Short = function() { return "Outlaws' tools"; };
outlawLockpicks.Long  = function() { return "A set of odd tools the Outlaws sent you to deliver to Elodie, one of their contacts in Rigard."; };

const outlawPoison = new Item("quest9", "Poison", ItemType.Quest);
outlawPoison.price = 0;
outlawPoison.Short = function() { return "Poison"; };
outlawPoison.Long  = function() { return "A vial of nasty - though non-lethal - poison intended for the lady Katara Heydrich, on behalf of Vaughn."; };

const outlawAphrodisiac = new Item("quest10", "Aphrodisiac", ItemType.Quest);
outlawAphrodisiac.price = 0;
outlawAphrodisiac.Short = function() { return "Aphrodisiac"; };
outlawAphrodisiac.Long  = function() { return "A vial of potent aphrodisiac intended for the lady Katara Heydrich, on behalf of Vaughn."; };

export namespace QuestItems {
    export const Cactoid = cactoid;
    export const RedAlgae = redAlgae;
    export const GolHusk = golHusk;
    export const Scepter = scepter;
    export const Violin = violin;
    export const Ginseng = ginseng;
    export const Nightshade = nightshade;
    export const OutlawLetter = outlawLetter;
    export const OutlawLockpicks = outlawLockpicks;
    export const OutlawPoison = outlawPoison;
    export const OutlawAphrodisiac = outlawAphrodisiac;
}
