
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
