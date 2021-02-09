
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

	numElements = 14,
}

export interface IDamageType {
	pSlash  ?: number;
	pBlunt  ?: number;
	pPierce ?: number;
	mVoid   ?: number;
	mFire   ?: number;
	mIce    ?: number;
	mThunder?: number;
	mEarth  ?: number;
	mWater  ?: number;
	mWind   ?: number;
	mLight  ?: number;
	mDark   ?: number;
	mNature ?: number;
	lust    ?: number;
}

export class DamageType {
	public dmg: number[];
	constructor(type: IDamageType = {}) {
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

	public Add(other: DamageType) {
		for (let i = 0; i < Element.numElements; i++) {
			this.dmg[i] += other.dmg[i];
		}
	}

	public ApplyDmgType(def: DamageType, atkDmg: number) {
		let ret = 0;
		for (let i = 0; i < Element.numElements; i++) {
			let dmg = this.dmg[i] * atkDmg;
			dmg -= dmg * def.dmg[i];
			ret += dmg;
		}
		return ret;
	}
}
