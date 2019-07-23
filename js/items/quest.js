
import { Item, ItemType } from '../item';

let QuestItems = {};

QuestItems.Cactoid = new Item("quest0", "Cactoid", ItemType.Quest);
QuestItems.Cactoid.price = 0;
QuestItems.Cactoid.Short = function() { return "A live Cactoid"; }
QuestItems.Cactoid.Long  = function() { return "A small desert creature that looks like a turtle, but with spiny needles on its back."; }

QuestItems.RedAlgae = new Item("quest1", "Red algae", ItemType.Quest);
QuestItems.RedAlgae.price = 0;
QuestItems.RedAlgae.Short = function() { return "A red algae"; }
QuestItems.RedAlgae.Long  = function() { return "A red algae, gathered from the lake."; }

QuestItems.GolHusk = new Item("quest2", "Gol husk", ItemType.Quest);
QuestItems.GolHusk.price = 0;
QuestItems.GolHusk.Short = function() { return "A Gol husk"; }
QuestItems.GolHusk.Long  = function() { return "The husk looks like it once belonged to a large insectoid creature."; }

QuestItems.Scepter = new Item("quest3", "Scepter", ItemType.Quest);
QuestItems.Scepter.price = 0;
QuestItems.Scepter.Short = function() { return "Lagon's scepter"; }
QuestItems.Scepter.Long  = function() { return "There is a large gemstone set into the scepter, which looks to be of fine craftmanship."; }

QuestItems.Violin = new Item("quest4", "Violin", ItemType.Quest);
QuestItems.Violin.price = 0;
QuestItems.Violin.Short = function() { return "Cveta's Violin"; }
QuestItems.Violin.Long  = function() { return "An incredibly expensive instrument you bought from Dio Rintell in Rigard on the behest of Cveta."; }

QuestItems.Ginseng = new Item("quest5", "Ginseng", ItemType.Quest);
QuestItems.Ginseng.price = 0;
QuestItems.Ginseng.Short = function() { return "Fresh Ginseng"; }
QuestItems.Ginseng.Long  = function() { return "A potent healing herb."; }

QuestItems.Nightshade = new Item("quest6", "Nightshade", ItemType.Quest);
QuestItems.Nightshade.price = 0;
QuestItems.Nightshade.Short = function() { return "Nightshade"; }
QuestItems.Nightshade.Long  = function() { return "A potent poisonous plant."; }

QuestItems.OutlawLetter = new Item("quest7", "Outlaws' letter", ItemType.Quest);
QuestItems.OutlawLetter.price = 0;
QuestItems.OutlawLetter.Short = function() { return "Outlaws' letter"; }
QuestItems.OutlawLetter.Long  = function() { return "The sealed letter that the Outlaws asked you to deliver to their contact in Rigard."; }

QuestItems.OutlawLockpicks = new Item("quest8", "Outlaws' tools", ItemType.Quest);
QuestItems.OutlawLockpicks.price = 0;
QuestItems.OutlawLockpicks.Short = function() { return "Outlaws' tools"; }
QuestItems.OutlawLockpicks.Long  = function() { return "A set of odd tools the Outlaws sent you to deliver to Elodie, one of their contacts in Rigard."; }

QuestItems.OutlawPoison = new Item("quest9", "Poison", ItemType.Quest);
QuestItems.OutlawPoison.price = 0;
QuestItems.OutlawPoison.Short = function() { return "Poison"; }
QuestItems.OutlawPoison.Long  = function() { return "A vial of nasty - though non-lethal - poison intended for the lady Katara Heydrich, on behalf of Vaughn."; }

QuestItems.OutlawAphrodisiac = new Item("quest10", "Aphrodisiac", ItemType.Quest);
QuestItems.OutlawAphrodisiac.price = 0;
QuestItems.OutlawAphrodisiac.Short = function() { return "Aphrodisiac"; }
QuestItems.OutlawAphrodisiac.Long  = function() { return "A vial of potent aphrodisiac intended for the lady Katara Heydrich, on behalf of Vaughn."; }

export { QuestItems };
