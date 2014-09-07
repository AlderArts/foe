

// Namespace that item prototypes are kept in
Items = {};
ItemIds = {};

ItemType = {
	None      : -1,
	Weapon    : 0,
	TopArmor  : 1,
	BotArmor  : 2,
	FullArmor : 3,
	Accessory : 4,
	Acc1      : 5,
	Acc2      : 6,
	StrapOn   : 7
};

function Item(id, name) {
	this.id     = id;
	this.name   = name;
	this.image  = new Image(); // TODO
	this.price  = 0;
	// Alchemical recipe, an array of {it: Item, num: Number} pairs
	this.Recipe = [];
	//function(target)
	this.Use        = null;
	this.EquipType  = ItemType.None;
	/* 
	 * effect = {
	 * 	 maxHp
	 *   maxSp
	 *   maxLust
	 *   strength
	 *   stamina
	 *   dexterity
	 *   intelligence
	 *   spirit
	 *   libido
	 *   charisma
	 * 
	 *   atkMod
	 *   defMod
	 * }
	 */
	this.effect = {};
	
	ItemIds[id] = this;
}

//function(target)
Item.prototype.Equip = function(target) {
	if(this.effect.maxHp)        target.maxHp.bonus         += this.effect.maxHp;
	if(this.effect.maxSp)        target.maxSp.bonus         += this.effect.maxSp;
	if(this.effect.maxLust)      target.maxLust.bonus       += this.effect.maxLust;
	
	if(this.effect.strength)     target.strength.bonus      += this.effect.strength;
	if(this.effect.stamina)      target.stamina.bonus       += this.effect.stamina;
	if(this.effect.dexterity)    target.dexterity.bonus     += this.effect.dexterity;
	if(this.effect.intelligence) target.intelligence.bonus  += this.effect.intelligence;
	if(this.effect.spirit)       target.spirit.bonus        += this.effect.spirit;
	
	if(this.effect.libido)       target.libido.bonus        += this.effect.libido;
	if(this.effect.charisma)     target.charisma.bonus      += this.effect.charisma;
	
	if(this.effect.atkMod)       target.atkMod += this.effect.atkMod;
	if(this.effect.defMod)       target.defMod += this.effect.defMod;
	
	// Elemental attack
	target.elementAtk.Add(new DamageType({
		pSlash   : this.effect.apSlash,
		pBlunt   : this.effect.apBlunt,
		pPierce  : this.effect.apPierce,
		mVoid    : this.effect.amVoid,
		mFire    : this.effect.amFire,
		mIce     : this.effect.amIce,
		mThunder : this.effect.amThunder,
		mEarth   : this.effect.amEarth,
		mWater   : this.effect.amWater,
		mWind    : this.effect.amWind,
		mLight   : this.effect.amLight,
		mDark    : this.effect.amDark,
		mNature  : this.effect.amNature,
		lust     : this.effect.alust
	}));
	
	// Elemental defense
	target.elementDef.Add(new DamageType({
		pSlash   : this.effect.dpSlash,
		pBlunt   : this.effect.dpBlunt,
		pPierce  : this.effect.dpPierce,
		mVoid    : this.effect.dmVoid,
		mFire    : this.effect.dmFire,
		mIce     : this.effect.dmIce,
		mThunder : this.effect.dmThunder,
		mEarth   : this.effect.dmEarth,
		mWater   : this.effect.dmWater,
		mWind    : this.effect.dmWind,
		mLight   : this.effect.dmLight,
		mDark    : this.effect.dmDark,
		mNature  : this.effect.dmNature,
		lust     : this.effect.dlust
	}));
}

Item.prototype.sDesc = function() { return this.name; }
Item.prototype.lDesc = function() { return this.name; }
Item.prototype.Short = function() { return this.name; }
Item.prototype.Long = function()  { return this.name; }

// Used as entrypoint for PC/Party (active selection)
Item.prototype.OnSelect = function(inv, encounter, caster, backPrompt) {
	var item = this;
	// TODO: Buttons (use portraits for target?)
	if(this.targetMode == TargetMode.Self) {
		this.UseCombat(inv, encounter, caster);
	}
	else if(this.targetMode == TargetMode.Ally) {
		var target = new Array();
		for(var i=0,j=party.members.length; i<j; i++){
			var t = party.members[i];
			if(t.Incapacitated()) continue;
			target.push({
			  	nameStr : t.name,
			  	func    : function(t) {
			  		item.UseCombat(inv, encounter, caster, t);
			  	},
			  	enabled : true,
			  	obj     : t
			});
		};
		
		Gui.SetButtonsFromList(target, true, backPrompt);
	}
	else if(this.targetMode == TargetMode.AllyNotSelf) {
		var target = new Array();
		for(var i=0,j=party.members.length; i<j; i++){
			var t = party.members[i];
			// Skip self
			if(t == caster) continue;
			if(t.Incapacitated()) continue;
			target.push({
			  	nameStr : t.name,
			  	func    : function(t) {
			  		item.UseCombat(inv, encounter, caster, t);
			  	},
			  	enabled : true,
			  	obj     : t
			});
		};
		
		Gui.SetButtonsFromList(target, true, backPrompt);
	}
	else if(this.targetMode == TargetMode.AllyFallen) {
		var target = new Array();
		for(var i=0,j=party.members.length; i<j; i++){
			var t = party.members[i];
			// Skip self (as you are obviously not fallen)
			if(t == caster) continue;
			if(!t.Incapacitated()) continue;
			target.push({
			  	nameStr : t.name,
			  	func    : function(t) {
			  		item.UseCombat(inv, encounter, caster, t);
			  	},
			  	enabled : true,
			  	obj     : t
			});
		};
		
		Gui.SetButtonsFromList(target, true, backPrompt);
	}
	else if(this.targetMode == TargetMode.Enemy) {
		var enemies = encounter.enemy.members;
		var target = new Array();
		for(var i=0,j=enemies.length; i<j; i++){
			var t = enemies[i];
			if(t.Incapacitated()) continue;
			target.push({
			  	nameStr : t.name,
			  	func    : function(t) {
			  		item.UseCombat(inv, encounter, caster, t);
			  	},
			  	enabled : true,
			  	obj     : t
			});
		};
		
		Gui.SetButtonsFromList(target, true, backPrompt);
	}
	else if(this.targetMode == TargetMode.Party) {
		this.UseCombat(inv, encounter, caster, party);
	}
	else if(this.targetMode == TargetMode.Enemies) {
		this.UseCombat(inv, encounter, caster, encounter.enemy);
	}
	// Fallback
	else
		encounter.CombatTick();
}

// Inventory
function Inventory() {
	this.items = []; // {it : Item, num : 1} pair
}

Inventory.prototype.ToStorage = function() {
	var storage = [];
	for(var i = 0; i < this.items.length; i++) {
		storage.push(
			{	it: this.items[i].it.id,
				num: this.items[i].num});
	}
	return storage;
}

Inventory.prototype.FromStorage = function(storage) {
	this.items = [];
	for(var i = 0; i < storage.length; i++) {
		this.items.push(
			{	it: ItemIds[storage[i].it],
				num: parseInt(storage[i].num)});
	}
}

Inventory.prototype.QueryNum = function(item) {
	for(var i = 0; i < this.items.length; i++) {
		if(this.items[i].it === item)
			return this.items[i].num;
	}
	return null;
}

Inventory.prototype.AddItem = function(item, num) {
	// Default to 1
	num = num || 1;
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: Added " + num + " " + item.name + " (ID: " + item.id + ")"));
		Text.Newline();
	}
	
	// Try to find if there is already an entry
	for(var i = 0; i < this.items.length; i++) {
		if(this.items[i].it === item) {
			this.items[i].num += num;
			return;
		}
	}
	// Item not found, add new entry
	this.items.push({it: item, num: num});
}

Inventory.prototype.RemoveItem = function(item, num) {
	// Default to 1
	num = num || 1;
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: Removed " + num + " " + item.name + " (ID: " + item.id + ")"));
		Text.Newline();
	}
	
	// Try to find a stack containing said item
	for(var i = 0; i < this.items.length; i++) {
		if(this.items[i].it === item) {
			this.items[i].num -= num;
			// If there are no more items in the stack, remove it
			if(this.items[i].num <= 0)
				this.items.remove(i);
			return;
		}
	}
}

// Todo temp
Inventory.prototype.Print = function() {
	for(var i = 0; i < this.items.length; i++) {
		Text.AddOutput(this.items[i].num + "x " + this.items[i].it.name + " - " + this.items[i].it.Short() + "<br/>");
	}
}

Inventory.prototype.ShowInventory = function(preventClear) {
	var inv = this;
	var backPrompt = function() { inv.ShowInventory(); }
	if(!preventClear)
		Text.Clear();
	
	var list = [];
	for(var i = 0; i < this.items.length; i++) {
		var it = this.items[i].it;
		Text.Add(this.items[i].num + "x " + it.name + " - " + it.Short() + "<br/>");
		if(!it.Use) continue;
		list.push({
			nameStr: it.name,
			enabled: true,
			//tooltip: it.Long(),
			obj: it,
			func: function(item) {
				Text.Clear();
				Text.Add(item.Long());
				Text.NL();
				Text.Add("Use [it] on which partymember?", {it: item.name});
				Text.Flush();
				
				var target = new Array();
				for(var i=0,j=party.members.length; i<j; i++){
					var t = party.members[i];
					target.push({
					  	nameStr : t.name,
					  	func    : function(t) {
					  		Text.Clear();
					  		var use = t.ItemUse(item, backPrompt);
					  		if(use.grab) {
					  			if(use.consume)
					  				inv.RemoveItem(item);
					  		}
					  		else {
						  		if(item.Use(t).consume) // Consume?
						  			inv.RemoveItem(item);
						  		Gui.NextPrompt(backPrompt);
					  		}
					  	},
					  	enabled : t.ItemUsable(item),
					  	obj     : t
					});
				};
				
				Gui.SetButtonsFromList(target, true, backPrompt);
			}
		});
	}
	Gui.SetButtonsFromList(list);
	
	if(this.items.length == 0)
		Text.Add("You are not carrying anything at the moment.");
	Text.Flush();
	SetExploreButtons();
}

Inventory.prototype.CombatInventory = function(encounter, entity, back) {
	var inv = this;
	Text.Clear();
	
	var backPrompt = function() {
		inv.CombatInventory(encounter, entity, back);
	}
	
	var list = [];
	for(var i = 0; i < this.items.length; i++) {
		var it = this.items[i].it;
		if(!it.UseCombat) continue;
		Text.Add(this.items[i].num + "x " + it.name + " - " + it.Short() + "<br/>");
		list.push({
			nameStr: it.name,
			enabled: true,
			//tooltip: it.Long(),
			obj: it,
			func: function(item) {
				Text.Clear();
				Text.Add(item.Long());
				Text.NL();
				Text.Add("Use [it] on whom?", {it: item.name});
				Text.Flush();
				
				it.OnSelect(inv, encounter, entity, backPrompt);
			}
		});
	}
	Gui.SetButtonsFromList(list, true, back);
	
	if(list.length == 0)
		Text.Add("You are not carrying any items usable in combat at the moment.");
	Text.Flush();
}

Inventory.prototype.ShowEquippable = function(entity, type, backPrompt) {
	var inv = this;
	// Populate item list
	var items = [];
	for(var i = 0; i < this.items.length; i++) {
		var it = this.items[i].it;
		switch(type) {
			case ItemType.Weapon:
				if(it.EquipType == ItemType.Weapon) items.push(it);
				break;
			case ItemType.TopArmor:
				if     (it.EquipType == ItemType.TopArmor)  items.push(it);
				else if(it.EquipType == ItemType.FullArmor) items.push(it);
				break;
			case ItemType.BotArmor:
				if(it.EquipType == ItemType.BotArmor) items.push(it);
				break;
			case ItemType.Acc1:
			case ItemType.Acc2:
				if(it.EquipType == ItemType.Accessory) items.push(it);
				break;
			case ItemType.Weapon:
				if(it.EquipType == ItemType.Weapon) items.push(it);
				break;
			case ItemType.StrapOn:
				if(it.EquipType == ItemType.StrapOn) items.push(it);
				break;
		}
	}

	var hasEquip = false;
	switch(type) {
		case ItemType.Weapon:   if(entity.weaponSlot)   hasEquip = true; break;
		case ItemType.TopArmor: if(entity.topArmorSlot) hasEquip = true; break;
		case ItemType.BotArmor: if(entity.botArmorSlot) hasEquip = true; break;
		case ItemType.Acc1:     if(entity.acc1Slot)     hasEquip = true; break;
		case ItemType.Acc2:     if(entity.acc2Slot)     hasEquip = true; break;
		case ItemType.StrapOn:  if(entity.strapOn)      hasEquip = true; break;
	}
	
	var list = [];
	list.push({
		nameStr : "Dequip",
		func    : function() {
			switch(type) {
				case ItemType.Weapon:
					if(entity.weaponSlot) inv.AddItem(entity.weaponSlot);
					entity.weaponSlot = null;
					break;
				case ItemType.TopArmor:
					if(entity.weaponSlot) inv.AddItem(entity.topArmorSlot);
					entity.topArmorSlot = null;
					break;
				case ItemType.BotArmor:
					if(entity.weaponSlot) inv.AddItem(entity.botArmorSlot);
					entity.botArmorSlot = null;
					break;
				case ItemType.Acc1:
					if(entity.acc1Slot) inv.AddItem(entity.acc1Slot);
					entity.acc1Slot = null;
					break;
				case ItemType.Acc2:
					if(entity.acc2Slot) inv.AddItem(entity.acc2Slot);
					entity.acc2Slot = null;
					break;
				case ItemType.StrapOn:
					if(entity.strapOn) inv.AddItem(entity.strapOn);
					entity.strapOn = null;
					break;
			}
			entity.Equip();
			backPrompt();
		},
		enabled : hasEquip
	});
	
	for(var i=0,j=items.length; i<j; i++) {
		var it = items[i];
		list.push({
		  	nameStr : it.name,
		  	func    : function(t) {
		  		inv.RemoveItem(t);
				switch(t.EquipType) {
					case ItemType.Weapon:
						if(entity.weaponSlot) inv.AddItem(entity.weaponSlot);
						entity.weaponSlot = t;
						break;
						
					case ItemType.FullArmor:
						if(entity.topArmorSlot) inv.AddItem(entity.topArmorSlot);
						if(entity.botArmorSlot) inv.AddItem(entity.botArmorSlot);
						entity.topArmorSlot = t;
						entity.botArmorSlot = null;
						break;
						
					case ItemType.TopArmor:
						if(entity.topArmorSlot) inv.AddItem(entity.topArmorSlot);
						entity.topArmorSlot = t;
						break;
						
					case ItemType.BotArmor:
						if(entity.botArmorSlot) inv.AddItem(entity.botArmorSlot);
						entity.botArmorSlot = t;
						break;
						
					case ItemType.Accessory:
						if(type == ItemType.Acc1) {
							if(entity.acc1Slot) inv.AddItem(entity.acc1Slot);
							entity.acc1Slot = t;
						}
						else if(type == ItemType.Acc2) {
							if(entity.acc2Slot) inv.AddItem(entity.acc2Slot);
							entity.acc2Slot = t;
						}
						break;
						
					case ItemType.StrapOn:
						if(entity.strapOn) inv.AddItem(entity.strapOn);
						entity.strapOn = t;
						break;
				}
				entity.Equip();
		  		backPrompt();
		  	},
		  	enabled : true,
		  	obj     : it
		});
	};
	
	Gui.SetButtonsFromList(list, true, backPrompt);
}
