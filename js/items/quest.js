
Items.Quest = {};

Items.Quest.Cactoid = new Item("quest0", "Cactoid");
Items.Quest.Cactoid.price = 0;
Items.Quest.Cactoid.Short = function() { return "A live Cactoid"; }
Items.Quest.Cactoid.Long  = function() { return "A small desert creature that looks like a turtle, but with spiny needles on its back."; }

Items.Quest.RedAlgae = new Item("quest1", "Red algae");
Items.Quest.RedAlgae.price = 0;
Items.Quest.RedAlgae.Short = function() { return "A red algae"; }
Items.Quest.RedAlgae.Long  = function() { return "A red algae, gathered from the lake."; }

Items.Quest.GolHusk = new Item("quest2", "Gol husk");
Items.Quest.GolHusk.price = 0;
Items.Quest.GolHusk.Short = function() { return "A Gol husk"; }
Items.Quest.GolHusk.Long  = function() { return "The husk looks like it once belonged to a large insectoid creature."; }
