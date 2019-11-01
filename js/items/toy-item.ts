import { Cock } from "../body/cock";
import { Item, ItemSubtype, ItemType } from "../item";

export class ItemToy extends Item {
    public cock: Cock;
    public plural: boolean;

    constructor(id: string, name: string, subtype: ItemSubtype) {
        super(id, name, ItemType.Toy);

        this.subtype = subtype;
        this.cock = new Cock();
    }
}
