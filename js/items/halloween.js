
Items.Halloween = {};

Items.Halloween.SkimpyCostume = new Item("hw0", "Costume", ItemType.Armor);
Items.Halloween.SkimpyCostume.price = 0;
Items.Halloween.SkimpyCostume.sDesc = function() { return "skimpy costume"; }
Items.Halloween.SkimpyCostume.lDesc = function() { return "a skimpy costume"; }
Items.Halloween.SkimpyCostume.Short = function() { return "Skimpy costume"; }
Items.Halloween.SkimpyCostume.Long = function() { return "Clothing you found inside the tent you woke up in. It beats being naked, but not by much. To be honest you can’t be sure this isn’t some kind of kinky costume the previous owner wore during one of their sexual escapades, but still, little protection is better than <i>no</i> protection at all. The undies have a small slot for inserting a dildo, effectively doubling up as a strap-on."; }
Items.Halloween.SkimpyCostume.subtype = ItemSubtype.FullArmor;