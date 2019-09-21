import { IStorage } from "../istorage";
import { IBody } from "./ibody";

/*
 * Superclass for all entity genitalia. Handles things that
 * affect all genitalia as a group.
 */

enum GCover {
	NoCover = 0,
	Sheath  = 1,
	Slit    = 2,
}

export class Genitalia {
	public body: IBody;
	public cover: GCover;

	constructor(body: IBody, storage?: IStorage) {
		this.body   = body;
		this.cover  = GCover.NoCover;

		if (storage) { this.FromStorage(storage); }
	}

	static get Cover() { return GCover; }

	public ToStorage() {
		const storage = {
			c : this.cover.toFixed(),
		};
		return storage;
	}

	public FromStorage(storage: IStorage) {
		storage = storage || {};
		this.cover = parseInt(storage.c, 10) || this.cover;
	}

	public NoCover() {
		if (this.body.NumCocks() === 0) { return true; }
		return this.cover === GCover.NoCover;
	}
	public Sheath() {
		if (this.body.NumCocks() === 0) { return false; }
		return this.cover === GCover.Sheath;
	}
	public Slit() {
		if (this.body.NumCocks() === 0) { return false; }
		return this.cover === GCover.Slit;
	}

	// TODO use in scenes (might need a lot of rewriting in places)
	public InternalBalls() {
		// TODO other factors?
		return this.cover === GCover.Slit;
	}

	// TODO logic specific to changing cover?
	public SetCover(cover: GCover) {
		this.cover = cover;
	}

}

// TODO functions for clitcock growth
