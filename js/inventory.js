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
        var item = {
            it: ItemIds[storage[i].it],
            num: parseInt(storage[i].num)};
        if(item.it)
            this.items.push(item);
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

Inventory.ItemByType = function(inv, itemsByType, usableItemsByType, combatItemsByType) {
    //Add all keys first. Ensures item output will be in whatever order our ItemType enum is in
    for(var type in ItemType){
        if(itemsByType)
            itemsByType[type] = [];
        if(usableItemsByType)
            usableItemsByType[type] = [];
        if(combatItemsByType)
            combatItemsByType[type] = [];
    }
    //Populate type arrays with items if they're defined
    for(var i = 0; i < inv.length; i++) {
        var it = inv[i].it;
        if(itemsByType) {
            itemsByType[it.type].push(inv[i]);
        }

        if(usableItemsByType && it.Use) {
            usableItemsByType[it.type].push(inv[i]);
        }

        if(combatItemsByType && it.UseCombat) {
            combatItemsByType[it.type].push(inv[i]);
        }
    }
    //Clear empty arrays
    for(var type in ItemType){
        if(itemsByType && itemsByType[type].length == 0)
            delete itemsByType[type];
        if(usableItemsByType && usableItemsByType[type].length == 0)
            delete usableItemsByType[type];
        if(combatItemsByType && combatItemsByType[type].length == 0)
            delete combatItemsByType[type];
    }
}

Inventory.prototype.ShowInventory = function(preventClear) {
    var inv = this;
    inv.items.sort(compareItemByProp("name"));
    var backPrompt = function() { inv.ShowInventory(); }
    if(!preventClear)
        Text.Clear();

    var itemsByType = {};
    var usableItemsByType = {};

    Inventory.ItemByType(this.items, itemsByType, usableItemsByType);

    //TODO The output format could be much nicer,
    for(var key in itemsByType) {
        Text.Add("<b>"+key + ":</b>");
        var items = itemsByType[key];
        if(items) {
            for(var i=0; i < items.length; i++) {
                Text.Add("<br/>" + items[i].it.name + " x"+items[i].num);
            }
        }
        Text.NL();
    }

    var usable = [];
    for(var key in usableItemsByType) {
        var items = usableItemsByType[key];
        if(items)
            usable = usable.concat(items);
    }

    var options = [];
    for(var i = 0; i < usable.length; ++i) {
        var it  = usable[i].it;
        var num = usable[i].num;
        options.push({
            nameStr: it.name + " x"+ num,
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
    Gui.SetButtonsFromList(options);

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

    var combatItemsByType = {};
    Inventory.ItemByType(this.items, null, null, combatItemsByType);

    var usable = [];
    for(var key in combatItemsByType) {
        var items = combatItemsByType[key];
        if(items)
            usable = usable.concat(items);
    }

    var options = [];
    for(var i = 0; i < usable.length; ++i) {
        var it  = usable[i].it;
        var num = usable[i].num;

        Text.Add(num + "x " + it.name + " - " + it.Short() + "<br/>");
        options.push({
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
    Gui.SetButtonsFromList(options, true, back);

    if(options.length == 0)
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
                if(it.type == ItemType.Weapon) items.push(it);
                break;
            case ItemSubtype.TopArmor:
                if     (it.subtype == ItemSubtype.TopArmor)  items.push(it);
                else if(it.subtype == ItemSubtype.FullArmor) items.push(it);
                break;
            case ItemSubtype.BotArmor:
                if(it.subtype == ItemSubtype.BotArmor) items.push(it);
                break;
            case ItemSubtype.Acc1:
            case ItemSubtype.Acc2:
                if(it.type == ItemType.Accessory) items.push(it);
                break;
            case ItemSubtype.StrapOn:
                if(it.subtype == ItemSubtype.StrapOn) items.push(it);
                break;
        }
    }

    var hasEquip = false;
    switch(type) {
        case ItemType.Weapon:   if(entity.weaponSlot)   hasEquip = true; break;
        case ItemSubtype.TopArmor: if(entity.topArmorSlot) hasEquip = true; break;
        case ItemSubtype.BotArmor: if(entity.botArmorSlot) hasEquip = true; break;
        case ItemSubtype.Acc1:     if(entity.acc1Slot)     hasEquip = true; break;
        case ItemSubtype.Acc2:     if(entity.acc2Slot)     hasEquip = true; break;
        case ItemSubtype.StrapOn:  if(entity.strapOn)      hasEquip = true; break;
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
                case ItemSubtype.TopArmor:
                    if(entity.weaponSlot) inv.AddItem(entity.topArmorSlot);
                    entity.topArmorSlot = null;
                    break;
                case ItemSubtype.BotArmor:
                    if(entity.weaponSlot) inv.AddItem(entity.botArmorSlot);
                    entity.botArmorSlot = null;
                    break;
                case ItemSubtype.Acc1:
                    if(entity.acc1Slot) inv.AddItem(entity.acc1Slot);
                    entity.acc1Slot = null;
                    break;
                case ItemSubtype.Acc2:
                    if(entity.acc2Slot) inv.AddItem(entity.acc2Slot);
                    entity.acc2Slot = null;
                    break;
                case ItemSubtype.StrapOn:
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
                switch(t.type) {
                    case ItemType.Weapon:
                        if(entity.weaponSlot) inv.AddItem(entity.weaponSlot);
                        entity.weaponSlot = t;
                        break;

                    case ItemSubtype.FullArmor:
                        if(entity.topArmorSlot) inv.AddItem(entity.topArmorSlot);
                        if(entity.botArmorSlot) inv.AddItem(entity.botArmorSlot);
                        entity.topArmorSlot = t;
                        entity.botArmorSlot = null;
                        break;

                    case ItemSubtype.TopArmor:
                        if(entity.topArmorSlot) inv.AddItem(entity.topArmorSlot);
                        entity.topArmorSlot = t;
                        break;

                    case ItemSubtype.BotArmor:
                        if(entity.botArmorSlot) inv.AddItem(entity.botArmorSlot);
                        entity.botArmorSlot = t;
                        break;

                    case ItemSubtype.Accessory:
                        if(type == ItemSubtype.Acc1) {
                            if(entity.acc1Slot) inv.AddItem(entity.acc1Slot);
                            entity.acc1Slot = t;
                        }
                        else if(type == ItemSubtype.Acc2) {
                            if(entity.acc2Slot) inv.AddItem(entity.acc2Slot);
                            entity.acc2Slot = t;
                        }
                        break;

                    case ItemSubtype.StrapOn:
                        if(entity.strapOn) inv.AddItem(entity.strapOn);
                        entity.strapOn = t;
                        break;
                }
                entity.Equip();
                backPrompt();
            },
            enabled : true,
            obj     : it,
            tooltip : it.Long()
        });
    };

    Gui.SetButtonsFromList(list, true, backPrompt);
}