
import { Item, ItemType } from "../item";

const cactoid = new Item("quest0", "Cactoid", ItemType.Quest);
cactoid.price = 0;
cactoid.Short = () => "A live Cactoid";
cactoid.Long  = () => "A small desert creature that looks like a turtle, but with spiny needles on its back.";

const redAlgae = new Item("quest1", "Red algae", ItemType.Quest);
redAlgae.price = 0;
redAlgae.Short = () => "A red algae";
redAlgae.Long  = () => "A red algae, gathered from the lake.";

const golHusk = new Item("quest2", "Gol husk", ItemType.Quest);
golHusk.price = 0;
golHusk.Short = () => "A Gol husk";
golHusk.Long  = () => "The husk looks like it once belonged to a large insectoid creature.";

const scepter = new Item("quest3", "Scepter", ItemType.Quest);
scepter.price = 0;
scepter.Short = () => "Lagon's scepter";
scepter.Long  = () => "There is a large gemstone set into the scepter, which looks to be of fine craftmanship.";

const violin = new Item("quest4", "Violin", ItemType.Quest);
violin.price = 0;
violin.Short = () => "Cveta's Violin";
violin.Long  = () => "An incredibly expensive instrument you bought from Dio Rintell in Rigard on the behest of Cveta.";

const ginseng = new Item("quest5", "Ginseng", ItemType.Quest);
ginseng.price = 0;
ginseng.Short = () => "Fresh Ginseng";
ginseng.Long  = () => "A potent healing herb.";

const nightshade = new Item("quest6", "Nightshade", ItemType.Quest);
nightshade.price = 0;
nightshade.Short = () => "Nightshade";
nightshade.Long  = () => "A potent poisonous plant.";

const outlawLetter = new Item("quest7", "Outlaws' letter", ItemType.Quest);
outlawLetter.price = 0;
outlawLetter.Short = () => "Outlaws' letter";
outlawLetter.Long  = () => "The sealed letter that the Outlaws asked you to deliver to their contact in Rigard.";

const outlawLockpicks = new Item("quest8", "Outlaws' tools", ItemType.Quest);
outlawLockpicks.price = 0;
outlawLockpicks.Short = () => "Outlaws' tools";
outlawLockpicks.Long  = () => "A set of odd tools the Outlaws sent you to deliver to Elodie, one of their contacts in Rigard.";

const outlawPoison = new Item("quest9", "Poison", ItemType.Quest);
outlawPoison.price = 0;
outlawPoison.Short = () => "Poison";
outlawPoison.Long  = () => "A vial of nasty - though non-lethal - poison intended for the lady Katara Heydrich, on behalf of Vaughn.";

const outlawAphrodisiac = new Item("quest10", "Aphrodisiac", ItemType.Quest);
outlawAphrodisiac.price = 0;
outlawAphrodisiac.Short = () => "Aphrodisiac";
outlawAphrodisiac.Long  = () => "A vial of potent aphrodisiac intended for the lady Katara Heydrich, on behalf of Vaughn.";

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
