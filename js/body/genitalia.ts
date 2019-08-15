
/*
 * Superclass for all entity genitalia. Handles things that
 * affect all genitalia as a group.
 */

enum GCover {
	NoCover = 0,
	Sheath  = 1,
	Slit    = 2,
};

export class Genitalia {
	body : any;
	cover : GCover;

	constructor(body : any, storage? : any) {
		this.body   = body;
		this.cover  = GCover.NoCover;
		
		if(storage) this.FromStorage(storage);
	}

	static get Cover() { return GCover; }
	
	ToStorage() {
		let storage = {
			c : this.cover.toFixed()
		}
		return storage;
	}

	FromStorage(storage : any) {
		storage = storage || {};
		this.cover = parseInt(storage.c) || this.cover;
	}

	NoCover() {
		if(this.body.NumCocks() == 0) return true;
		return this.cover == GCover.NoCover;
	}
	Sheath() {
		if(this.body.NumCocks() == 0) return false;
		return this.cover == GCover.Sheath;
	}
	Slit() {
		if(this.body.NumCocks() == 0) return false;
		return this.cover == GCover.Slit;
	}

	//TODO use in scenes (might need a lot of rewriting in places)
	InternalBalls() {
		//TODO other factors?
		return this.cover == GCover.Slit;
	}

	//TODO logic specific to changing cover?
	SetCover(cover : GCover) {
		if     (cover == GCover.NoCover) {
			
		}
		else if(cover == GCover.Sheath) {
			
		}
		else if(cover == GCover.Slit) {
			
		}
		else {
			//Invalid type
			return;
		}
		this.cover = cover;
	}

}

//TODO functions for clitcock growth
