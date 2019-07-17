import { Item, Items, ItemType, ItemSubtype } from '../item';
import { Cock } from '../body/cock';

Items.Halloween = {};

Items.Halloween.SkimpyCostume = new Item("hw0", "Costume", ItemType.Armor);
Items.Halloween.SkimpyCostume.price = 0;
Items.Halloween.SkimpyCostume.sDesc = function() { return "skimpy costume"; }
Items.Halloween.SkimpyCostume.lDesc = function() { return "a skimpy costume"; }
Items.Halloween.SkimpyCostume.Short = function() { return "Skimpy costume"; }
Items.Halloween.SkimpyCostume.Long = function() { return "Clothing you found inside the tent you woke up in. It beats being naked, but not by much. To be honest you can’t be sure this isn’t some kind of kinky costume the previous owner wore during one of their sexual escapades, but still, little protection is better than <i>no</i> protection at all. The undies have a small slot for inserting a dildo, effectively doubling up as a strap-on.<br><b>+2 kinky, +1 leather fetish, +4 scantily clad, +1 cool cloak.</b>"; }
Items.Halloween.SkimpyCostume.subtype = ItemSubtype.FullArmor;


Items.Halloween.Stake = new Item("hw1", "Stake", ItemType.Toy);
Items.Halloween.Stake.price = 0;
Items.Halloween.Stake.sDesc = function() { return "stake"; }
Items.Halloween.Stake.lDesc = function() { return "a stake"; }
Items.Halloween.Stake.Short = function() { return "Stake"; }
Items.Halloween.Stake.Long = function() { return "A legendary weapon against evil, passed down through many generations of the Elder at the camp’s family… or just a kinky toy..."; }
Items.Halloween.Stake.subtype = ItemSubtype.StrapOn;
Items.Halloween.Stake.cock = new Cock();
Items.Halloween.Stake.cock.thickness.base = 4;
Items.Halloween.Stake.cock.length.base    = 20;
Items.Halloween.Stake.cock.isStrapon      = true;


Items.Halloween.Lantern = new Item("hw2", "Lantern", ItemType.Quest);
Items.Halloween.Lantern.price = 0;
Items.Halloween.Lantern.sDesc = function() { return "iron lantern"; }
Items.Halloween.Lantern.lDesc = function() { return "an iron lantern"; }
Items.Halloween.Lantern.Short = function() { return "Lantern"; }
Items.Halloween.Lantern.Long = function() { return "It’s heavy, barely warms you up, barely lights the way through the thick fog… still, it’s better than nothing."; }


Items.Halloween.HolyWater = new Item("hw3", "Holy water", ItemType.Quest);
Items.Halloween.HolyWater.price = 0;
Items.Halloween.HolyWater.sDesc = function() { return "holy water"; }
Items.Halloween.HolyWater.lDesc = function() { return "a bottle of holy water"; }
Items.Halloween.HolyWater.Short = function() { return "Holy water"; }
Items.Halloween.HolyWater.Long = function() { return "The label says <i>Holee</i> Water, whether it’s a typo or Holee is something else, you have no way to ascertain what the dubious liquid inside does..."; }


Items.Halloween.Garlic = new Item("hw4", "Garlic", ItemType.Quest);
Items.Halloween.Garlic.price = 0;
Items.Halloween.Garlic.sDesc = function() { return "garlic necklace"; }
Items.Halloween.Garlic.lDesc = function() { return "a garlic necklace"; }
Items.Halloween.Garlic.Short = function() { return "Garlic"; }
Items.Halloween.Garlic.Long = function() { return "A great tool for one adventuring out in the night. It repels vampires, evil creatures... and unwanted salesmen, you guess..."; }


Items.Halloween.Shades = new Item("hw5", "Shades", ItemType.Quest);
Items.Halloween.Shades.price = 0;
Items.Halloween.Shades.sDesc = function() { return "shades"; }
Items.Halloween.Shades.lDesc = function() { return "a pair of shades"; }
Items.Halloween.Shades.Short = function() { return "Shades"; }
Items.Halloween.Shades.Long = function() { return "You’ve been told it’s an invisibility charm that only works on zombies. Now, you don’t know how true that is, but it’s a fact that just putting these on makes you feel cooler."; }


Items.Halloween.SqueakyToy = new Item("hw6", "Dog toy", ItemType.Quest);
Items.Halloween.SqueakyToy.price = 0;
Items.Halloween.SqueakyToy.sDesc = function() { return "squeaky bone"; }
Items.Halloween.SqueakyToy.lDesc = function() { return "a squeaky bone"; }
Items.Halloween.SqueakyToy.Short = function() { return "Squeaky bone"; }
Items.Halloween.SqueakyToy.Long = function() { return Scenes.Halloween.HW.Werewolf() ? "It takes all your willpower to avoid giving in and chewing on this stupid toy every time it squeaks..." : "It squeaks when you squeeze it… kinda useless, though you suppose it could be useful when distracting a dog?"; }


Items.Halloween.Bread = new Item("hw7", "Stale bread", ItemType.Quest);
Items.Halloween.Bread.price = 0;
Items.Halloween.Bread.sDesc = function() { return "stale bread"; }
Items.Halloween.Bread.lDesc = function() { return "a loaf of stale bread"; }
Items.Halloween.Bread.Short = function() { return "Stale bread"; }
Items.Halloween.Bread.Long = function() { return "So hard it could be used as a blunt weapon. When was this made anyway? How come it’s not moldy yet?"; }


Items.Halloween.Guide = new Item("hw8", "M.Guide", ItemType.Quest);
Items.Halloween.Guide.price = 0;
Items.Halloween.Guide.sDesc = function() { return "monsterslaying guide"; }
Items.Halloween.Guide.lDesc = function() { return "a monsterslaying guide"; }
Items.Halloween.Guide.Short = function() { return "Monsterslaying guide"; }
Items.Halloween.Guide.Long = function() { return "The first two pages say, in big, bold letters: <i>DON’T PANIC!</i> That’s very sound advice, considering the predicament the writer found themselves in moments later..."; }


Items.Halloween.WerewolfHide = new Item("hw9", "Hide", ItemType.Armor);
Items.Halloween.WerewolfHide.price = 0;
Items.Halloween.WerewolfHide.sDesc = function() { return "werewolf hide"; }
Items.Halloween.WerewolfHide.lDesc = function() { return "a werewolf hide"; }
Items.Halloween.WerewolfHide.Short = function() { return "Werewolf hide"; }
Items.Halloween.WerewolfHide.Long = function() { return "Your natural, furry hide. You feel much warmer than you did in your previous skimpy clothes plus cloak combo, and your new muscles ripple with power whenever you flex them. All that combined with the fact that you still retain your ability to reason and think straight, maybe getting turned into a werewolf wasn’t so bad… It also feels great to feel the wind ruffling your fur with your junk dangling below.<br><b>+3 Muscles, +2 Howling, +10 Nakedness, +2 Static generation, +1 Fluffy tail.</b>"; }
Items.Halloween.WerewolfHide.subtype = ItemSubtype.FullArmor;


Items.Halloween.WerewolfClaw = new Item("hw10", "Claws", ItemType.Weapon);
Items.Halloween.WerewolfClaw.price = 0;
Items.Halloween.WerewolfClaw.sDesc = function() { return "werewolf claws"; }
Items.Halloween.WerewolfClaw.lDesc = function() { return "a set of werewolf claws"; }
Items.Halloween.WerewolfClaw.Short = function() { return "Werewolf claws"; }
Items.Halloween.WerewolfClaw.Long = function() { return "Razor-sharp claws, ideal for defending yourself against any threat you meet in your way. Just not that great when you want to <i>not</i> rip and shred stuff apart… but it’s universally agreed that ripping the clothes off someone is way faster than stripping them anyway.<br><b>-3 Stripping, +10 Ripping clothes apart, +2 Back scratching power, +3 Holding bitches down for mating, +4 Badass.</b>"; }

