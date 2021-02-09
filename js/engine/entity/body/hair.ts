
import { IStorage } from "../istorage";
import { Stat } from "../stat";
import { BodyPart } from "./bodypart";
import { Color, ColorDesc } from "./color";
import { RaceDesc } from "./race";

export enum HairStyle {
	straight = 0,
	wavy     = 1,
	ponytail = 2,
	shaggy   = 3,
	curly    = 4,
	braid    = 5,
}

export class Hair extends BodyPart {
	public length: Stat;
	public style: HairStyle;

	constructor(color?: Color) {
		super(undefined, color);
		this.length = new Stat(5);
		this.style = HairStyle.straight;
	}

	public ToStorage() {
		const storage = {
			col   : this.color.toFixed(),
			len   : this.length.base.toFixed(2),
			race  : this.race.id.toFixed(),
			style : this.style.toFixed(),
		};
		return storage;
	}

	public FromStorage(storage: IStorage) {
		storage = storage || {};
		this.race        = (storage.race === undefined) ? this.race : RaceDesc.IdToRace[parseInt(storage.race, 10)];
		this.color       = (storage.col === undefined) ? this.color : parseInt(storage.col, 10);
		this.length.base = (storage.len === undefined) ? this.length.base : parseInt(storage.len, 10);
		this.style       = (storage.style === undefined) ? this.style : parseInt(storage.style, 10);
	}

	// TODO: Length and style
	public Bald() {
		return this.length.Get() === 0;
	}
	public IsLong() {
		return this.length.Get() >= 10;
	}
	public IsLongerThan(x: number) {
		return this.length.Get() >= x;
	}
	public Short() {
		if (this.length.Get() === 0) {
			return `bald scalp`;
		} else {
			return `${ColorDesc(this.color)} hair`;
		}
	}

	public Long() {
		const len = this.length.Get();
		if (len === 0) {
			return `bald scalp`;
		} else {
			const color = ColorDesc(this.color);
			const style = this.Style();

			if (len < 1) {
				return `${color} stubble`;
			} else if (len < 5) {
				return `short ${color} hair`;
			} else if (len < 10) {
				return `short ${style}`;
			} else if (len < 20) {
				return `medium length, ${style}`;
			} else if (len < 30) {
				return `shoulder-length, ${style}`;
			} else if (len < 50) {
				return `long, ${style}`;
			} else if (len < 70) {
				return `waist-length, ${style}`;
			} else if (len < 100) {
				return `ass-length, ${style}`;
			} else if (len < 140) {
				return `knee-length, ${style}`;
			} else {
				return `ground-dragging, ${style}`;
			}
		}
	}

	private Style() {
		const color = ColorDesc(this.color);
		switch (this.style) {
			case HairStyle.straight: return `straight ${color} hair`;
			case HairStyle.wavy:     return `wavy ${color} hair`;
			case HairStyle.ponytail: return `${color} hair, which is kept in a ponytail`;
			case HairStyle.shaggy:   return `shaggy ${color} hair`;
			case HairStyle.curly:    return `curly ${color} hair`;
			case HairStyle.braid:    return `${color} hair, which is kept in a braid`;
			default:                 return `unkempt hair`;
		}
	}
}
