
function CombatItem(id, name) {
	Item.call(this, id, name);
	this.targetMode = TargetMode.Ally;
	this.consume = true;
}
CombatItem.prototype = new Item();
CombatItem.prototype.constructor = CombatItem;

CombatItem.prototype.UseCombat = function(inv, encounter, caster, target) {
	if(inv && this.consume) {
		inv.RemoveItem(this);
	}
	
	this.UseCombatInternal(encounter, caster, target);
}
CombatItem.prototype.UseCombatInternal = function(encounter, caster, target) {
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}



Items.Combat = {};

Items.Combat.HPotion = new CombatItem("pot0", "H.Potion");
Items.Combat.HPotion.price = 25;
Items.Combat.HPotion.Short = function() { return "Health potion"; }
Items.Combat.HPotion.Long = function() { return "A weak health potion."; }
Items.Combat.HPotion.targetMode = TargetMode.Ally;
Items.Combat.HPotion.UseCombatInternal = function(encounter, caster, target) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

Items.Combat.DecoyStick = new CombatItem("decoy0", "Decoy");
Items.Combat.DecoyStick.price = 250;
Items.Combat.DecoyStick.Short = function() { return "A decoy stick"; }
Items.Combat.DecoyStick.Long = function() { return "A stick containing the shards of an enchanted mirror, when broken it will generate illusory copies of the user, confusing targets."; }
Items.Combat.DecoyStick.targetMode = TargetMode.Self;
Items.Combat.DecoyStick.UseCombatInternal = function(encounter, caster) {
	var parse = {
		Name : caster.NameDesc(),
		name : caster.nameDesc(),
		s    : caster.plural() ? "" : "s",
		has  : caster.has()
	};
	
	Text.Clear();
	Text.Add("[Name] grab[s] a decoy stick and breaks it. A flash of light emanates, and when it subsides [name] [has] split into four copies.", parse);
	Text.Flush();
	
	Status.Decoy(caster, {copies: 3});
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}