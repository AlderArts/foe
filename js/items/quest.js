
import { Item, Items, ItemType } from '../item';

Items.Quest = {};

Items.Quest.Cactoid = new Item("quest0", "Cactoid", ItemType.Quest);
Items.Quest.Cactoid.price = 0;
Items.Quest.Cactoid.Short = function() { return "A live Cactoid"; }
Items.Quest.Cactoid.Long  = function() { return "A small desert creature that looks like a turtle, but with spiny needles on its back."; }

Items.Quest.RedAlgae = new Item("quest1", "Red algae", ItemType.Quest);
Items.Quest.RedAlgae.price = 0;
Items.Quest.RedAlgae.Short = function() { return "A red algae"; }
Items.Quest.RedAlgae.Long  = function() { return "A red algae, gathered from the lake."; }

Items.Quest.GolHusk = new Item("quest2", "Gol husk", ItemType.Quest);
Items.Quest.GolHusk.price = 0;
Items.Quest.GolHusk.Short = function() { return "A Gol husk"; }
Items.Quest.GolHusk.Long  = function() { return "The husk looks like it once belonged to a large insectoid creature."; }

Items.Quest.Scepter = new Item("quest3", "Scepter", ItemType.Quest);
Items.Quest.Scepter.price = 0;
Items.Quest.Scepter.Short = function() { return "Lagon's scepter"; }
Items.Quest.Scepter.Long  = function() { return "There is a large gemstone set into the scepter, which looks to be of fine craftmanship."; }

Items.Quest.Violin = new Item("quest4", "Violin", ItemType.Quest);
Items.Quest.Violin.price = 0;
Items.Quest.Violin.Short = function() { return "Cveta's Violin"; }
Items.Quest.Violin.Long  = function() { return "An incredibly expensive instrument you bought from Dio Rintell in Rigard on the behest of Cveta."; }

Items.Quest.Ginseng = new Item("quest5", "Ginseng", ItemType.Quest);
Items.Quest.Ginseng.price = 0;
Items.Quest.Ginseng.Short = function() { return "Fresh Ginseng"; }
Items.Quest.Ginseng.Long  = function() { return "A potent healing herb."; }

Items.Quest.Nightshade = new Item("quest6", "Nightshade", ItemType.Quest);
Items.Quest.Nightshade.price = 0;
Items.Quest.Nightshade.Short = function() { return "Nightshade"; }
Items.Quest.Nightshade.Long  = function() { return "A potent poisonous plant."; }

Items.Quest.OutlawLetter = new Item("quest7", "Outlaws' letter", ItemType.Quest);
Items.Quest.OutlawLetter.price = 0;
Items.Quest.OutlawLetter.Short = function() { return "Outlaws' letter"; }
Items.Quest.OutlawLetter.Long  = function() { return "The sealed letter that the Outlaws asked you to deliver to their contact in Rigard."; }

Items.Quest.OutlawLockpicks = new Item("quest8", "Outlaws' tools", ItemType.Quest);
Items.Quest.OutlawLockpicks.price = 0;
Items.Quest.OutlawLockpicks.Short = function() { return "Outlaws' tools"; }
Items.Quest.OutlawLockpicks.Long  = function() { return "A set of odd tools the Outlaws sent you to deliver to Elodie, one of their contacts in Rigard."; }

Items.Quest.OutlawPoison = new Item("quest9", "Poison", ItemType.Quest);
Items.Quest.OutlawPoison.price = 0;
Items.Quest.OutlawPoison.Short = function() { return "Poison"; }
Items.Quest.OutlawPoison.Long  = function() { return "A vial of nasty - though non-lethal - poison intended for the lady Katara Heydrich, on behalf of Vaughn."; }

Items.Quest.OutlawAphrodisiac = new Item("quest10", "Aphrodisiac", ItemType.Quest);
Items.Quest.OutlawAphrodisiac.price = 0;
Items.Quest.OutlawAphrodisiac.Short = function() { return "Aphrodisiac"; }
Items.Quest.OutlawAphrodisiac.Long  = function() { return "A vial of potent aphrodisiac intended for the lady Katara Heydrich, on behalf of Vaughn."; }
