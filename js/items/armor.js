Items.Armor = {};

Items.Armor.LeatherChest = new Item("chest0", "L.chest");
Items.Armor.LeatherChest.price = 40;
Items.Armor.LeatherChest.Short = function() { return "leather chest"; }
Items.Armor.LeatherChest.Long = function() { return "a simple leather breastplate"; }
Items.Armor.LeatherChest.EquipType = ItemType.TopArmor;
Items.Armor.LeatherChest.effect.defMod = 0.1;
Items.Armor.LeatherChest.effect.stamina = 1;

Items.Armor.BanditChest = new Item("chest1", "B.chest");
Items.Armor.BanditChest.price = 62;
Items.Armor.BanditChest.Short = function() { return "Bandit chest"; }
Items.Armor.BanditChest.Long = function() { return "a simple shirt that leather armor on the shoulders and the chest area, worn by bandits. (The bandits who are obsessed with their appearance"; }
Items.Armor.BanditChest.EquipType = ItemType.TopArmor;
Items.Armor.BanditChest.effect.defMod = 0.1;
Items.Armor.BanditChest.effect.stamina = 1;

Items.Armor.FurryChest = new Item("chest2", "F.jacket");
Items.Armor.FurryChest.price = 4;
Items.Armor.FurryChest.Short = function() { return "furry jacket"; }
Items.Armor.FurryChest.Long = function() { return "A jacket made with feline fur, doesn't provide much protection but you feel faster wearing it."; }
Items.Armor.FurryChest.EquipType = ItemType.TopArmor;
Items.Armor.FurryChest.effect.defMod = 0.04;
Items.Armor.FurryChest.effect.stamina = 0.7;
Items.Armor.FurryChest.effect.dexterity = 1.2;

Items.Armor.RustyChest = new Item("chest3", "R.chest");
Items.Armor.RustyChest.price = 40;
Items.Armor.RustyChest.Short = function() { return "Rusty metal chest"; }
Items.Armor.RustyChest.Long = function() { return "A rusty metal breastplate, still durable though."; }
Items.Armor.RustyChest.EquipType = ItemType.TopArmor;
Items.Armor.RustyChest.effect.defMod = 0.4;
Items.Armor.RustyChest.effect.stamina = 1.3;

Items.Armor.ShinyChest = new Item("chest4", "S.chest");
Items.Armor.ShinyChest.price = 200;
Items.Armor.ShinyChest.Short = function() { return "Shiny metal chest"; }
Items.Armor.ShinyChest.Long = function() { return "A metal breastplate that is brand new. You can your reflection on the metal breastplate."; }
Items.Armor.ShinyChest.EquipType = ItemType.TopArmor;
Items.Armor.ShinyChest.effect.defMod = 1.7;
Items.Armor.ShinyChest.effect.stamina = 0.7;

Items.Armor.ChainmailChest = new Item("chest4", "C.chest");
Items.Armor.ChainmailChest.price = 285;
Items.Armor.ChainmailChest.Short = function() { return "Chainmail chest"; }
Items.Armor.ChainmailChest.Long = function() { return "A breastplate that is made out of chainmail. provides excellent protection against physical attacks."; }
Items.Armor.ChainmailChest.EquipType = ItemType.TopArmor;
Items.Armor.ChainmailChest.effect.defMod = 2.6;
Items.Armor.ChainmailChest.effect.stamina = 1.2;

Items.Armor.DragonChest = new Item("chest5", "D.chest");
Items.Armor.DragonChest.price = 40000;
Items.Armor.DragonChest.Short = function() { return "dragon chest"; }
Items.Armor.DragonChest.Long = function() { return "A breastplate crafted from the scales of a destructive dragon. (taken from drake's ass)"; }
Items.Armor.DragonChest.EquipType = ItemType.TopArmor;
Items.Armor.DragonChest.effect.defMod = 9.5;
Items.Armor.DragonChest.effect.stamina = 7;

Items.Armor.EnCrystalChest = new Item("chest5", "ED.chest");
Items.Armor.EnCrystalChest.price = 485;
Items.Armor.EnCrystalChest.Short = function() { return "Enchanted Crystal chest"; }
Items.Armor.EnCrystalChest.Long = function() { return "A leather shirt covered with enchanted crystals, provides you great protection against magic. (don't fall near lava)"; }
Items.Armor.EnCrystalChest.EquipType = ItemType.TopArmor;
Items.Armor.EnCrystalChest.effect.defMod = 1.2;
Items.Armor.EnCrystalChest.effect.stamina = 0.6;
Items.Armor.EnCrystalChest.effect.spirit = 1.9;
Items.Armor.EnCrystalChest.effect.intelligence = 0.7;

Items.Armor.FancyShirt = new Item("chest6", "F.Shirt");
Items.Armor.FancyShirt.price = 49;
Items.Armor.FancyShirt.Short = function() { return "Fancy Shirt"; }
Items.Armor.FancyShirt.Long = function() { return "A V-neck shirt made with the finest of materials, decorative patterns can be seen around the shirt. "; }
Items.Armor.FancyShirt.EquipType = ItemType.TopArmor;
Items.Armor.FancyShirt.effect.defMod = 0.1;
Items.Armor.FancyShirt.effect.charisma = 0.8;

Items.Armor.LeatherPants = new Item("pants0", "L.Pants");
Items.Armor.LeatherPants.price = 20;
Items.Armor.LeatherPants.Short = function() { return "leather pants"; }
Items.Armor.LeatherPants.Long = function() { return "a pair of simple leather pants"; }
Items.Armor.LeatherPants.EquipType = ItemType.BotArmor;
Items.Armor.LeatherPants.effect.defMod = 0.1;
Items.Armor.LeatherPants.effect.stamina = 1;

Items.Armor.ChainmailPants = new Item("pants1", "C.Pants");
Items.Armor.ChainmailPants.price = 276;
Items.Armor.ChainmailPants.Short = function() { return "Chainmail pants"; }
Items.Armor.ChainmailPants.Long = function() { return "a pair of leather pants that is covered with chainmail from top to bottom, For maximum protection. (especially in the crotch area)"; }
Items.Armor.ChainmailPants.EquipType = ItemType.BotArmor;
Items.Armor.ChainmailChest.effect.defMod = 2.3;
Items.Armor.ChainmailChest.effect.stamina = 0.9;
Items.Armor.ChainmailChest.effect.dexterity = 1.2;

Items.Armor.BanditPants = new Item("pants2", "B.Pants");
Items.Armor.BanditPants.price = 32;
Items.Armor.BanditPants.Short = function() { return "Bandit pants"; }
Items.Armor.BanditPants.Long = function() { return "a pair of leather pants that has protection around the knees and the feet, worn by bandits bandits."; }
Items.Armor.BanditPants.EquipType = ItemType.BotArmor;
Items.Armor.BanditPants.effect.defMod = 0.8;
Items.Armor.BanditPants.effect.stamina = 1.4;
Items.Armor.BanditPants.effect.dexterity = 0.9;

Items.Armor.ScalePants = new Item("pants3", "S.Pants");
Items.Armor.ScalePants.price = 20;
Items.Armor.ScalePants.Short = function() { return "Scales pants"; }
Items.Armor.ScalePants.Long = function() { return "A pair of simple pants made using lizard scales."; }
Items.Armor.ScalePants.EquipType = ItemType.BotArmor;
Items.Armor.ScalePants.effect.defMod = 0.5;
Items.Armor.ScalePants.effect.intelligence = 1.4;
Items.Armor.ScalePants.effect.spirit = 1.2;

Items.Armor.LovelyPants = new Item("pants4", "L.Pants");
Items.Armor.LovelyPants.price = 50;
Items.Armor.LovelyPants.Short = function() { return "Lovely pants"; }
Items.Armor.LovelyPants.Long = function() { return "A pair of dark colored pants with a golden belt buckle, the highest fashion in Rigard."; }
Items.Armor.LovelyPants.EquipType = ItemType.BotArmor;
Items.Armor.LovelyPants.effect.defMod = 0.1;
Items.Armor.LovelyPants.effect.charisma = 0.6;

Items.Armor.WornoutRobes = new Item("robe0", "W.Robes");
Items.Armor.WornoutRobes.price = 2;
Items.Armor.WornoutRobes.Short = function() { return "Worn out robes"; }
Items.Armor.WornoutRobes.Long = function() { return "A worn out robe, there are holes and stitches all around the robe."; }
Items.Armor.WornoutRobes.EquipType = ItemType.FullArmor;
Items.Armor.WornoutRobes.effect.defMod = 0;
Items.Armor.WornoutRobes.effect.spirit = 0.03;
Items.Armor.WornoutRobes.effect.intelligence = 0.05;
Items.Armor.WornoutRobes.effect.MaxMana = 5;

Items.Armor.SimpleRobes = new Item("robe1", "S.Robes");
Items.Armor.SimpleRobes.price = 40;
Items.Armor.SimpleRobes.Short = function() { return "simple robes"; }
Items.Armor.SimpleRobes.Long = function() { return "simple cloth robes"; }
Items.Armor.SimpleRobes.EquipType = ItemType.FullArmor;
Items.Armor.SimpleRobes.effect.defMod = 0;
Items.Armor.SimpleRobes.effect.intelligence = 1;
Items.Armor.SimpleRobes.effect.spirit = 1;

Items.Armor.IronSuit = new Item("robe2", "I.Suit");
Items.Armor.IronSuit.price = 9999;
Items.Armor.IronSuit.Short = function() { return "Iron suit"; }
Items.Armor.IronSuit.Long = function() { return "A full body armor that has a triangular chest piece that glows when magic flows into it. (made by <i>\"Alderarts Productions\"</i>)"; }
Items.Armor.IronSuit.EquipType = ItemType.FullArmor;
Items.Armor.IronSuit.effect.defMod = 5;
Items.Armor.IronSuit.effect.strength = 7;
Items.Armor.IronSuit.effect.spirit = 4;
Items.Armor.IronSuit.effect.stamina = 6;
Items.Armor.IronSuit.effect.dexterity = 6;

Items.Armor.SlimeRobes = new Item("robe3", "Sl.Robes");
Items.Armor.SlimeRobes.price = 1;
Items.Armor.SlimeRobes.Short = function() { return "slime robes"; }
Items.Armor.SlimeRobes.Long = function() { return "A robe made entirely out of slime. (why would you wear this?)"; }
Items.Armor.SlimeRobes.EquipType = ItemType.FullArmor;
Items.Armor.SlimeRobes.effect.defMod = 0;
Items.Armor.SlimeRobes.effect.libido = 3;
Items.Armor.SlimeRobes.effect.charisma = 2.3;

Items.Armor.WizardRobes = new Item("robe4", "W.Robes");
Items.Armor.WizardRobes.price = 400;
Items.Armor.WizardRobes.Short = function() { return "Wizard robes"; }
Items.Armor.WizardRobes.Long = function() { return "A robe worn by a powerful wizard long ago."; }
Items.Armor.WizardRobes.EquipType = ItemType.FullArmor;
Items.Armor.WizardRobes.effect.defMod = 0.05;
Items.Armor.WizardRobes.effect.intelligence = 1.8;
Items.Armor.WizardRobes.effect.spirit = 2;

Items.Armor.MerlinRobes = new Item("robe5", "M.Robes");
Items.Armor.MerlinRobes.price = 500;
Items.Armor.MerlinRobes.Short = function() { return "Merlin robes"; }
Items.Armor.MerlinRobes.Long = function() { return "Only those who mastered magic and learned the deepest secrets of the world can wear this."; }
Items.Armor.MerlinRobes.EquipType = ItemType.FullArmor;
Items.Armor.MerlinRobes.effect.defMod = 0.03;
Items.Armor.MerlinRobes.effect.intelligence = 4.8;
Items.Armor.MerlinRobes.effect.spirit = 5;
Items.Armor.MerlinRobes.effect.MaxMana = 50;

Items.Armor.GolemArmor = new Item("robe6", "G.Armor");
Items.Armor.GolemArmor.price = 560;
Items.Armor.GolemArmor.Short = function() { return "Golem Armor"; }
Items.Armor.GolemArmor.Long = function() { return "An armor worn by golem warriors, provides the best protection but feels very heavy. (is there a smaller size than this?"; }
Items.Armor.GolemArmor.EquipType = ItemType.FullArmor;
Items.Armor.GolemArmor.effect.defMod = 3.03;
Items.Armor.GolemArmor.effect.dexterity = -9;
Items.Armor.GolemArmor.effect.stamina = 9;
Items.Armor.GolemArmor.effect.MaxHp = 100;

Items.Armor.StylizedClothes = new Item("cloth0", "S.Clothes");
Items.Armor.StylizedClothes.price = 50;
Items.Armor.StylizedClothes.Short = function() { return "stylized clothes"; }
Items.Armor.StylizedClothes.Long = function() { return "stylish clothes, with an alluring cut"; }
Items.Armor.StylizedClothes.EquipType = ItemType.FullArmor;
Items.Armor.StylizedClothes.effect.defMod = 0;
Items.Armor.StylizedClothes.effect.charisma = 1;
Items.Armor.StylizedClothes.effect.libido = 1;

Items.Armor.SummerDress = new Item("cloth1", "S.Dress");
Items.Armor.SummerDress.price = 30;
Items.Armor.SummerDress.Short = function() { return "Summer Dress"; }
Items.Armor.SummerDress.Long = function() { return "A bright colored knee-length dress with a decorative knot around the waist. (perfect for a stroll at the beach)"; }
Items.Armor.SummerDress.EquipType = ItemType.FullArmor;
Items.Armor.SummerDress.effect.defMod = 0;
Items.Armor.SummerDress.effect.charisma = 0.7;
Items.Armor.SummerDress.effect.libido = 0.4;
