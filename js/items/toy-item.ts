import { Item, ItemType, ItemSubtype } from "../item";
import { Cock } from "../body/cock";

export class ItemToy extends Item {
    cock : Cock;
    plural : boolean;

    constructor(id : string, name : string, subtype : ItemSubtype) {
        super(id, name, ItemType.Toy);

        this.subtype = subtype;
        this.cock = new Cock();
    }
}