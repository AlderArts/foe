
export enum Element {
	pSlash      = 0,
	pBlunt      = 1,
	pPierce     = 2,
	mVoid       = 3,
	mFire       = 4,
	mIce        = 5,
	mThunder    = 6,
	mEarth      = 7,
	mWater      = 8,
	mWind       = 9,
	mLight      = 10,
	mDark       = 11,
	mNature     = 12,
	lust        = 13,

	numElements = 14
}

export class DamageType {
	dmg : number[];
	constructor(type? : any) {
		type = type || {};
		this.dmg = [];
		this.dmg[Element.pSlash]   = type.pSlash   || 0;
		this.dmg[Element.pBlunt]   = type.pBlunt   || 0;
		this.dmg[Element.pPierce]  = type.pPierce  || 0;
		this.dmg[Element.mVoid]    = type.mVoid    || 0;
		this.dmg[Element.mFire]    = type.mFire    || 0;
		this.dmg[Element.mIce]     = type.mIce     || 0;
		this.dmg[Element.mThunder] = type.mThunder || 0;
		this.dmg[Element.mEarth]   = type.mEarth   || 0;
		this.dmg[Element.mWater]   = type.mWater   || 0;
		this.dmg[Element.mWind]    = type.mWind    || 0;
		this.dmg[Element.mLight]   = type.mLight   || 0;
		this.dmg[Element.mDark]    = type.mDark    || 0;
		this.dmg[Element.mNature]  = type.mNature  || 0;
		this.dmg[Element.lust]     = type.lust     || 0;
	}
	
	Add(other : any) {
		for(var i = 0; i < Element.numElements; i++)
			this.dmg[i] += other.dmg[i];
	}

	ApplyDmgType(def : any, atkDmg : number) {
		var ret = 0;
		for(var i = 0; i < Element.numElements; i++) {
			var dmg = this.dmg[i] * atkDmg;
			dmg -= dmg * def.dmg[i];
			ret += dmg;
		}
		return ret;
	}
}
