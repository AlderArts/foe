import { GAME, WorldTime } from "../../GAME";

export namespace RigardFlags {
    export enum Nobles {
        MetMajid = 1,
        Alms     = 2,
        Elodie   = 4,
        Parade   = 8,
        Buns     = 16,
        BoughtBuns = 32,
    }
    export enum KrawitzQ {
        NotStarted   = 0,
        Started      = 1,
        HeistDone    = 2,
        HuntingTerry = 3,
        CaughtTerry  = 4,
    }
    export enum Barnaby { // Bitmask
        Met     = 1,
        Blowjob = 2,
        PassedOut = 4,
    }

    export namespace LB {
        export enum BusyState {
            busy    = 0,
            midbusy = 1,
            notbusy = 2,
        }
        export function MealCost() {
            return 20;
        }
        export function RoomCost() {
            return 100;
        }

        export function Busy() {
            if (WorldTime().hour >= 17) {
                return BusyState.busy;
            } else if (WorldTime().hour >= 7 || WorldTime().hour < 1) {
                return BusyState.midbusy;
            } else {
                return BusyState.notbusy;
            }
        }

        export function KnowsOrvin() {
            const rigard = GAME().rigard;
            return rigard.LB.Orvin !== 0;
        }

        export function OrvinIsInnkeeper() {
            if (WorldTime().hour >= 8) {
                return true;
            } else {
                return false;
            }
        }

        export function HasRentedRoom() {
            const rigard = GAME().rigard;
            return !rigard.LBroomTimer.Expired();
        }

    }
}
