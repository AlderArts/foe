import { Cock } from "../body/cock";
import { Item, ItemSubtype, ItemType } from "../item";
import { ItemToy } from "./toy-item";

const skimpyCostume = new Item("hw0", "Costume", ItemType.Armor);
skimpyCostume.price = 0;
skimpyCostume.sDesc = () => "skimpy costume";
skimpyCostume.lDesc = () => "a skimpy costume";
skimpyCostume.Short = () => "Skimpy costume";
skimpyCostume.Long = () => "Clothing you found inside the tent you woke up in. It beats being naked, but not by much. To be honest you can’t be sure this isn’t some kind of kinky costume the previous owner wore during one of their sexual escapades, but still, little protection is better than <i>no</i> protection at all. The undies have a small slot for inserting a dildo, effectively doubling up as a strap-on.<br><b>+2 kinky, +1 leather fetish, +4 scantily clad, +1 cool cloak.</b>";
skimpyCostume.subtype = ItemSubtype.FullArmor;

const stake = new ItemToy("hw1", "Stake", ItemSubtype.StrapOn);
stake.price = 0;
stake.sDesc = () => "stake";
stake.lDesc = () => "a stake";
stake.Short = () => "Stake";
stake.Long = () => "A legendary weapon against evil, passed down through many generations of the Elder at the camp’s family… or just a kinky toy...";
stake.cock = new Cock();
stake.cock.thickness.base = 4;
stake.cock.length.base    = 20;
stake.cock.isStrapon      = true;

const lantern = new Item("hw2", "Lantern", ItemType.Quest);
lantern.price = 0;
lantern.sDesc = () => "iron lantern";
lantern.lDesc = () => "an iron lantern";
lantern.Short = () => "Lantern";
lantern.Long = () => "It’s heavy, barely warms you up, barely lights the way through the thick fog… still, it’s better than nothing.";

const holyWater = new Item("hw3", "Holy water", ItemType.Quest);
holyWater.price = 0;
holyWater.sDesc = () => "holy water";
holyWater.lDesc = () => "a bottle of holy water";
holyWater.Short = () => "Holy water";
holyWater.Long = () => "The label says <i>Holee</i> Water, whether it’s a typo or Holee is something else, you have no way to ascertain what the dubious liquid inside does...";

const garlic = new Item("hw4", "Garlic", ItemType.Quest);
garlic.price = 0;
garlic.sDesc = () => "garlic necklace";
garlic.lDesc = () => "a garlic necklace";
garlic.Short = () => "Garlic";
garlic.Long = () => "A great tool for one adventuring out in the night. It repels vampires, evil creatures... and unwanted salesmen, you guess...";

const shades = new Item("hw5", "Shades", ItemType.Quest);
shades.price = 0;
shades.sDesc = () => "shades";
shades.lDesc = () => "a pair of shades";
shades.Short = () => "Shades";
shades.Long = () => "You’ve been told it’s an invisibility charm that only works on zombies. Now, you don’t know how true that is, but it’s a fact that just putting these on makes you feel cooler.";

const squeakyToy = new Item("hw6", "Dog toy", ItemType.Quest);
squeakyToy.price = 0;
squeakyToy.sDesc = () => "squeaky bone";
squeakyToy.lDesc = () => "a squeaky bone";
squeakyToy.Short = () => "Squeaky bone";
// squeakyToy.Long = () => HalloweenScenes.HW.Werewolf() ? "It takes all your willpower to avoid giving in and chewing on this stupid toy every time it squeaks..." : "It squeaks when you squeeze it… kinda useless, though you suppose it could be useful when distracting a dog?";

const bread = new Item("hw7", "Stale bread", ItemType.Quest);
bread.price = 0;
bread.sDesc = () => "stale bread";
bread.lDesc = () => "a loaf of stale bread";
bread.Short = () => "Stale bread";
bread.Long = () => "So hard it could be used as a blunt weapon. When was this made anyway? How come it’s not moldy yet?";

const guide = new Item("hw8", "M.Guide", ItemType.Quest);
guide.price = 0;
guide.sDesc = () => "monsterslaying guide";
guide.lDesc = () => "a monsterslaying guide";
guide.Short = () => "Monsterslaying guide";
guide.Long = () => "The first two pages say, in big, bold letters: <i>DON’T PANIC!</i> That’s very sound advice, considering the predicament the writer found themselves in moments later...";

const werewolfHide = new Item("hw9", "Hide", ItemType.Armor);
werewolfHide.price = 0;
werewolfHide.sDesc = () => "werewolf hide";
werewolfHide.lDesc = () => "a werewolf hide";
werewolfHide.Short = () => "Werewolf hide";
werewolfHide.Long = () => "Your natural, furry hide. You feel much warmer than you did in your previous skimpy clothes plus cloak combo, and your new muscles ripple with power whenever you flex them. All that combined with the fact that you still retain your ability to reason and think straight, maybe getting turned into a werewolf wasn’t so bad… It also feels great to feel the wind ruffling your fur with your junk dangling below.<br><b>+3 Muscles, +2 Howling, +10 Nakedness, +2 Static generation, +1 Fluffy tail.</b>";
werewolfHide.subtype = ItemSubtype.FullArmor;

const werewolfClaw = new Item("hw10", "Claws", ItemType.Weapon);
werewolfClaw.price = 0;
werewolfClaw.sDesc = () => "werewolf claws";
werewolfClaw.lDesc = () => "a set of werewolf claws";
werewolfClaw.Short = () => "Werewolf claws";
werewolfClaw.Long = () => "Razor-sharp claws, ideal for defending yourself against any threat you meet in your way. Just not that great when you want to <i>not</i> rip and shred stuff apart… but it’s universally agreed that ripping the clothes off someone is way faster than stripping them anyway.<br><b>-3 Stripping, +10 Ripping clothes apart, +2 Back scratching power, +3 Holding bitches down for mating, +4 Badass.</b>";

export namespace HalloweenItems {
    export const SkimpyCostume = skimpyCostume;
    export const Stake = stake;
    export const Lantern = lantern;
    export const HolyWater = holyWater;
    export const Garlic = garlic;
    export const Shades = shades;
    export const SqueakyToy = squeakyToy;
    export const Bread = bread;
    export const Guide = guide;
    export const WerewolfHide = werewolfHide;
    export const WerewolfClaw = werewolfClaw;
}
