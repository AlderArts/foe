import { Race } from "../body/race";
import { ItemSubtype } from "../item";
import { ItemToy } from "./toy-item";

const plainStrapon = new ItemToy("strapon0", "Plain strap-on", ItemSubtype.StrapOn);
plainStrapon.price = 40;
plainStrapon.sDesc = () => "plain strap-on";
plainStrapon.lDesc = () => "a plain strap-on";
plainStrapon.Short = () => "A plain strap-on, shaped like a human cock";
plainStrapon.Long  = () => "The strap-on is roughly the size and shape of an average human phallus. It is made from a slightly rubbery material. At the base, there are straps for attatching it.";
plainStrapon.cock.thickness.base = 3;
plainStrapon.cock.length.base    = 15;
plainStrapon.cock.isStrapon      = true;

const largeStrapon = new ItemToy("strapon1", "Large strap-on", ItemSubtype.StrapOn);
largeStrapon.price = 70;
largeStrapon.sDesc = () => "large strap-on";
largeStrapon.lDesc = () => "a large strap-on";
largeStrapon.Short = () => "A large strap-on, shaped like a human cock";
largeStrapon.Long  = () => "The strap-on is roughly the shape of a human phallus, but very large. It is made from a slightly rubbery material. At the base, there are straps for attatching it.";
largeStrapon.cock.thickness.base = 4;
largeStrapon.cock.length.base    = 30;
largeStrapon.cock.isStrapon      = true;

const equineStrapon = new ItemToy("strapon2", "Equine strap-on", ItemSubtype.StrapOn);
equineStrapon.price = 100;
equineStrapon.sDesc = () => "equine strap-on";
equineStrapon.lDesc = () => "an equine strap-on";
equineStrapon.Short = () => "An immense strap-on in the shape of a horsecock";
equineStrapon.Long  = () => "About twenty inches in length, the pleasure toy is only for the most spacious orifices. It comes complete with a sheath and a flared head. It is made from a slightly rubbery material. At the base, there are straps for attatching it.";
equineStrapon.cock.thickness.base = 8;
equineStrapon.cock.length.base    = 40;
equineStrapon.cock.race           = Race.Horse;
equineStrapon.cock.isStrapon      = true;

const canidStrapon = new ItemToy("strapon3", "Canid strap-on", ItemSubtype.StrapOn);
canidStrapon.price = 100;
canidStrapon.sDesc = () => "knotted strap-on";
canidStrapon.lDesc = () => "a knotted strap-on";
canidStrapon.Short = () => "A huge strap-on with a canid knot at the base";
canidStrapon.Long  = () => "While not incredibly long, the dog-like strap-on is very thick. It comes complete with a knot and a pointed tip. It is made from a slightly rubbery material. At the base, there are straps for attatching it.";
canidStrapon.cock.thickness.base = 7;
canidStrapon.cock.length.base    = 24;
canidStrapon.cock.race           = Race.Canine;
canidStrapon.cock.knot           = 1;
canidStrapon.cock.isStrapon      = true;

const chimeraStrapon = new ItemToy("strapon4", "Chimera strap-on", ItemSubtype.StrapOn);
chimeraStrapon.price = 400;
chimeraStrapon.sDesc = () => "monstrous strap-on";
chimeraStrapon.lDesc = () => "a monstrous strap-on";
chimeraStrapon.Short = () => "An enormous, bestial strap-on";
chimeraStrapon.Long  = () => "About twentyfive inches in length, the strap-on is only for the most spacious orifices. It combines the barbed head of a feline cock with the sheath of a horse and the knot of a canine. It is made from a slightly rubbery material. At the base, there are straps for attatching it.";
chimeraStrapon.cock.thickness.base = 10;
chimeraStrapon.cock.length.base    = 50;
chimeraStrapon.cock.race           = Race.Feline;
chimeraStrapon.cock.knot           = 1;
chimeraStrapon.cock.isStrapon      = true;

export namespace StrapOnItems {
    export const PlainStrapon = plainStrapon;
    export const LargeStrapon = largeStrapon;
    export const EquineStrapon = equineStrapon;
    export const CanidStrapon = canidStrapon;
    export const ChimeraStrapon = chimeraStrapon;
}
