import * as _ from "lodash";
import { GAME, WorldTime } from "./GAME";
import { Season } from "./time";

/* Global parser */
export namespace GP {
    export function season(spring: string, summer: string, autumn: string, winter: string) {
        const s = WorldTime().season;
        switch (s) {
            case Season.Spring: return spring;
            case Season.Summer: return summer;
            case Season.Autumn: return autumn;
            default:
            case Season.Winter: return winter;
        }
    }

    export function comps(alone: string, two: string, group: string) {
        const num: number = GAME().party.Num();
        if (num > 2) { // group
            return group;
        } else if (num === 2) { // two
            return two;
        } else { // alone
            return alone;
        }
    }
}
