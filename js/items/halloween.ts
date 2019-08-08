import { Item, ItemType, ItemSubtype } from '../item';
import { Cock } from '../body/cock';
import { HalloweenScenes } from '../event/halloween';

let HalloweenItems : any = {};

HalloweenItems.SkimpyCostume = new Item("hw0", "Costume", ItemType.Armor);
HalloweenItems.SkimpyCostume.price = 0;
HalloweenItems.SkimpyCostume.sDesc = function() { return "skimpy costume"; }
HalloweenItems.SkimpyCostume.lDesc = function() { return "a skimpy costume"; }
HalloweenItems.SkimpyCostume.Short = function() { return "Skimpy costume"; }
HalloweenItems.SkimpyCostume.Long = function() { return "Clothing you found inside the tent you woke up in. It beats being naked, but not by much. To be honest you can’t be sure this isn’t some kind of kinky costume the previous owner wore during one of their sexual escapades, but still, little protection is better than <i>no</i> protection at all. The undies have a small slot for inserting a dildo, effectively doubling up as a strap-on.<br><b>+2 kinky, +1 leather fetish, +4 scantily clad, +1 cool cloak.</b>"; }
HalloweenItems.SkimpyCostume.subtype = ItemSubtype.FullArmor;


HalloweenItems.Stake = new Item("hw1", "Stake", ItemType.Toy);
HalloweenItems.Stake.price = 0;
HalloweenItems.Stake.sDesc = function() { return "stake"; }
HalloweenItems.Stake.lDesc = function() { return "a stake"; }
HalloweenItems.Stake.Short = function() { return "Stake"; }
HalloweenItems.Stake.Long = function() { return "A legendary weapon against evil, passed down through many generations of the Elder at the camp’s family… or just a kinky toy..."; }
HalloweenItems.Stake.subtype = ItemSubtype.StrapOn;
HalloweenItems.Stake.cock = new Cock();
HalloweenItems.Stake.cock.thickness.base = 4;
HalloweenItems.Stake.cock.length.base    = 20;
HalloweenItems.Stake.cock.isStrapon      = true;


HalloweenItems.Lantern = new Item("hw2", "Lantern", ItemType.Quest);
HalloweenItems.Lantern.price = 0;
HalloweenItems.Lantern.sDesc = function() { return "iron lantern"; }
HalloweenItems.Lantern.lDesc = function() { return "an iron lantern"; }
HalloweenItems.Lantern.Short = function() { return "Lantern"; }
HalloweenItems.Lantern.Long = function() { return "It’s heavy, barely warms you up, barely lights the way through the thick fog… still, it’s better than nothing."; }


HalloweenItems.HolyWater = new Item("hw3", "Holy water", ItemType.Quest);
HalloweenItems.HolyWater.price = 0;
HalloweenItems.HolyWater.sDesc = function() { return "holy water"; }
HalloweenItems.HolyWater.lDesc = function() { return "a bottle of holy water"; }
HalloweenItems.HolyWater.Short = function() { return "Holy water"; }
HalloweenItems.HolyWater.Long = function() { return "The label says <i>Holee</i> Water, whether it’s a typo or Holee is something else, you have no way to ascertain what the dubious liquid inside does..."; }


HalloweenItems.Garlic = new Item("hw4", "Garlic", ItemType.Quest);
HalloweenItems.Garlic.price = 0;
HalloweenItems.Garlic.sDesc = function() { return "garlic necklace"; }
HalloweenItems.Garlic.lDesc = function() { return "a garlic necklace"; }
HalloweenItems.Garlic.Short = function() { return "Garlic"; }
HalloweenItems.Garlic.Long = function() { return "A great tool for one adventuring out in the night. It repels vampires, evil creatures... and unwanted salesmen, you guess..."; }


HalloweenItems.Shades = new Item("hw5", "Shades", ItemType.Quest);
HalloweenItems.Shades.price = 0;
HalloweenItems.Shades.sDesc = function() { return "shades"; }
HalloweenItems.Shades.lDesc = function() { return "a pair of shades"; }
HalloweenItems.Shades.Short = function() { return "Shades"; }
HalloweenItems.Shades.Long = function() { return "You’ve been told it’s an invisibility charm that only works on zombies. Now, you don’t know how true that is, but it’s a fact that just putting these on makes you feel cooler."; }


HalloweenItems.SqueakyToy = new Item("hw6", "Dog toy", ItemType.Quest);
HalloweenItems.SqueakyToy.price = 0;
HalloweenItems.SqueakyToy.sDesc = function() { return "squeaky bone"; }
HalloweenItems.SqueakyToy.lDesc = function() { return "a squeaky bone"; }
HalloweenItems.SqueakyToy.Short = function() { return "Squeaky bone"; }
HalloweenItems.SqueakyToy.Long = function() { return HalloweenScenes.HW.Werewolf() ? "It takes all your willpower to avoid giving in and chewing on this stupid toy every time it squeaks..." : "It squeaks when you squeeze it… kinda useless, though you suppose it could be useful when distracting a dog?"; }


HalloweenItems.Bread = new Item("hw7", "Stale bread", ItemType.Quest);
HalloweenItems.Bread.price = 0;
HalloweenItems.Bread.sDesc = function() { return "stale bread"; }
HalloweenItems.Bread.lDesc = function() { return "a loaf of stale bread"; }
HalloweenItems.Bread.Short = function() { return "Stale bread"; }
HalloweenItems.Bread.Long = function() { return "So hard it could be used as a blunt weapon. When was this made anyway? How come it’s not moldy yet?"; }


HalloweenItems.Guide = new Item("hw8", "M.Guide", ItemType.Quest);
HalloweenItems.Guide.price = 0;
HalloweenItems.Guide.sDesc = function() { return "monsterslaying guide"; }
HalloweenItems.Guide.lDesc = function() { return "a monsterslaying guide"; }
HalloweenItems.Guide.Short = function() { return "Monsterslaying guide"; }
HalloweenItems.Guide.Long = function() { return "The first two pages say, in big, bold letters: <i>DON’T PANIC!</i> That’s very sound advice, considering the predicament the writer found themselves in moments later..."; }


HalloweenItems.WerewolfHide = new Item("hw9", "Hide", ItemType.Armor);
HalloweenItems.WerewolfHide.price = 0;
HalloweenItems.WerewolfHide.sDesc = function() { return "werewolf hide"; }
HalloweenItems.WerewolfHide.lDesc = function() { return "a werewolf hide"; }
HalloweenItems.WerewolfHide.Short = function() { return "Werewolf hide"; }
HalloweenItems.WerewolfHide.Long = function() { return "Your natural, furry hide. You feel much warmer than you did in your previous skimpy clothes plus cloak combo, and your new muscles ripple with power whenever you flex them. All that combined with the fact that you still retain your ability to reason and think straight, maybe getting turned into a werewolf wasn’t so bad… It also feels great to feel the wind ruffling your fur with your junk dangling below.<br><b>+3 Muscles, +2 Howling, +10 Nakedness, +2 Static generation, +1 Fluffy tail.</b>"; }
HalloweenItems.WerewolfHide.subtype = ItemSubtype.FullArmor;


HalloweenItems.WerewolfClaw = new Item("hw10", "Claws", ItemType.Weapon);
HalloweenItems.WerewolfClaw.price = 0;
HalloweenItems.WerewolfClaw.sDesc = function() { return "werewolf claws"; }
HalloweenItems.WerewolfClaw.lDesc = function() { return "a set of werewolf claws"; }
HalloweenItems.WerewolfClaw.Short = function() { return "Werewolf claws"; }
HalloweenItems.WerewolfClaw.Long = function() { return "Razor-sharp claws, ideal for defending yourself against any threat you meet in your way. Just not that great when you want to <i>not</i> rip and shred stuff apart… but it’s universally agreed that ripping the clothes off someone is way faster than stripping them anyway.<br><b>-3 Stripping, +10 Ripping clothes apart, +2 Back scratching power, +3 Holding bitches down for mating, +4 Badass.</b>"; }

export { HalloweenItems };
