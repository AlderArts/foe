export namespace GwendyFlags {
	export enum Market {
		NotAsked     = 0,
		Asked        = 1,
		GoneToMarket = 2,
	}

	export enum Met {
		NotMet        = 0,
		Met           = 1,
		TalkedSelf    = 2,
		TalkedParents = 3,
	}

	export enum Bailout {
		Init     = 0,
		Slip     = 1,
		Talked   = 2,
		Resolved = 3,
		Dominate = 3,
		Submit   = 4,
	}

	export enum Toys {
		None     = 0,
		Strapon  = 1,
		RStrapon = 2,
		Beads    = 4,
		DDildo   = 8,
	}

	export enum ChallengeWinScene {
		Kiss    = 0,
		Hands   = 1,
		Titfuck = 2,
		Oral    = 3,
		Fuck    = 4,
		Anal    = 5,
		LAST    = 6, // TODO
	}

	export enum ChallengeLostScene {
		Kiss    = 0,
		Makeout = 1,
		Denial  = 2,
		Oral    = 3,
		Ride    = 4,
		Fucked  = 5,
		LAST    = 6, // TODO
	}
}
