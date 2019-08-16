import { GAME, WorldTime } from "../../GAME";

const RigardLB: any = {};

const RigardFlags = {
    Nobles : {
        MetMajid : 1,
        Alms     : 2,
        Elodie   : 4,
        Parade   : 8,
        Buns     : 16,
        BoughtBuns : 32,
    },
    KrawitzQ : {
        NotStarted   : 0,
        Started      : 1,
        HeistDone    : 2,
        HuntingTerry : 3,
        CaughtTerry  : 4,
    },
    Barnaby : { // Bitmask
        Met     : 1,
        Blowjob : 2,
        PassedOut : 4,
    },

    LB : RigardLB,
};

RigardLB.BusyState = {
	busy    : 0,
	midbusy : 1,
	notbusy : 2,
};
RigardLB.MealCost = () => {
	return 20;
};
RigardLB.RoomCost = () => {
	return 100;
};

RigardLB.Busy = () => {
	if (WorldTime().hour >= 17) {
        return RigardLB.BusyState.busy;
    } else if (WorldTime().hour >= 7 || WorldTime().hour < 1) {
        return RigardLB.BusyState.midbusy;
    } else {
        return RigardLB.BusyState.notbusy;
    }
};

RigardLB.KnowsOrvin = () => {
	const rigard = GAME().rigard;
	return rigard.LB.Orvin !== 0;
};

RigardLB.OrvinIsInnkeeper = () => {
	if (WorldTime().hour >= 8) {
        return true;
    } else {
        return false;
    }
};

RigardLB.HasRentedRoom = () => {
	const rigard = GAME().rigard;
	return !rigard.LBroomTimer.Expired();
};

export { RigardFlags };
