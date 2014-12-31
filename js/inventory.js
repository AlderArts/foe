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
    for(var i = 0; i < inv.length; i++) {
        var it = inv[i].it;
        if(itemsByType) {
            var itemArr = [];
            if(itemsByType.hasOwnProperty(it.EquipType))
                itemArr = itemsByType[it.Type()];
            itemArr.push(inv[i]);
            itemsByType[it.Type()] = itemArr;
        }

        if(usableItemsByType && it.Use) {
            var itemArr = [];
            if(usableItemsByType.hasOwnProperty(it.EquipType))
                itemArr = usableItemsByType[it.Type()];
            itemArr.push(inv[i]);
            usableItemsByType[it.Type()] = itemArr;
        }

        if(combatItemsByType && it.UseCombat) {
            var itemArr = [];
            if(combatItemsByType.hasOwnProperty(it.EquipType))
                itemArr = combatItemsByType[it.Type()];
            itemArr.push(inv[i]);
            combatItemsByType[it.Type()] = itemArr;
        }
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
        Text.Add("<b>"+Item.TypeToStr(parseInt(key)) + ":</b>");
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