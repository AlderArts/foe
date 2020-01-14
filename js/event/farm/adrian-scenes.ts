import { GAME } from "../../GAME";
import { Adrian } from "./adrian";
import { AdrianFlags } from "./adrian-flags";

export namespace AdrianScenes {
    export function _AdrianState() {
        const adrian: Adrian = GAME().adrian;
        const Shy = adrian.flags.Met === AdrianFlags.Met.Shy;
        const Dom = adrian.flags.Met === AdrianFlags.Met.Dom;
        const Sub = adrian.flags.Met === AdrianFlags.Met.Sub;
        const slut = adrian.Slut() >= 50 && adrian.Slut() > adrian.Relation();
        const friend = adrian.Relation() >= 50 && adrian.Relation() >= adrian.Slut();
        const Taunted = (adrian.flags.Flags & AdrianFlags.Flags.Taunted) !== 0;
        const Humiliated = (adrian.flags.Flags & AdrianFlags.Flags.Humiliated) !== 0;
        const Encouraged = (adrian.flags.Flags & AdrianFlags.Flags.Encouraged) !== 0;
        const Seduced = (adrian.flags.Flags & AdrianFlags.Flags.Seduced) !== 0;
        const jealous = adrian.Jealousy() >= 30 || Taunted;
        return { Shy, Dom, Sub, Seduced, Taunted, Humiliated, Encouraged, slut, friend, jealous };
    }
}
