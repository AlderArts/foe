
enum Season {
	Spring = 0,
	Summer = 1,
	Autumn = 2,
	Winter = 3,
	LAST   = 4,
}

/*
 *
 * Time structure
 * --------------
 *
 * year starts at 0 (displayed as 1)
 * season go from 0 to 3
 * day goes from 0 to 29 (displayed as 1 to 30)
 * hour goes from 0 to 23
 * minute goes from 0 to 59
 *
 */
class Time {
	public year: number;
	public season: Season;
	public day: number;
	public hour: number;
	public minute: number;

	constructor(year: number = 0, season: number = 0, day: number = 0, hour: number = 0, minute: number = 0) {
		this.year   = year   || 0;
		this.season = season || Season.Spring;
		this.day    = day    || 0;
		this.hour   = hour   || 0;
		this.minute = minute || 0;
	}

	public ToStorage() {
		const storage: any = {};
		if (this.year   !== 0) { storage.y = this.year; }
		if (this.season !== 0) { storage.s = this.season; }
		if (this.day    !== 0) { storage.d = this.day; }
		if (this.hour   !== 0) { storage.h = this.hour; }
		if (this.minute !== 0) { storage.m = this.minute; }
		return storage;
	}

	public FromStorage(storage?: any) {
		storage = storage || {};
		this.year   = parseInt(storage.y, 10) || this.year;
		this.season = parseInt(storage.s, 10) || this.season;
		this.day    = parseInt(storage.d, 10) || this.day;
		this.hour   = parseInt(storage.h, 10) || this.hour;
		this.minute = parseInt(storage.m, 10) || this.minute;
	}

	public Clone() {
		const time = new Time(
			this.year,
			this.season,
			this.day,
			this.hour,
			this.minute,
		);
		return time;
	}

	public Leq(time: Time) {
		if (this.year   > time.year) {   return false; }
		if (this.season > time.season) { return false; }
		if (this.day    > time.day) {    return false; }
		if (this.hour   > time.hour) {   return false; }
		if (this.minute > time.minute) { return false; }
		return true;
	}

	public TimeToHour(hour?: number, minute?: number) {
		hour   = hour   || 0;
		minute = minute || 0;
		const step = {
			hour   : hour   - this.hour,
			minute : minute - this.minute,
		};

		if (step.minute < 0) {
			step.minute += 60;
			step.hour--;
		}
		if (step.hour   < 0) {
			step.hour   += 24;
		}

		return step;
	}

	public Inc(time: any) {
		const minutes = time.minute || 0;
		const hours   = time.hour   || 0;
		const days    = time.day    || 0;
		const seasons = time.season || 0;
		const years   = time.year   || 0;

		this.minute += minutes;
		this.hour   += hours;
		this.day    += days;
		this.season += seasons;
		this.year   += years;

		while (this.minute >= 60) {
			this.minute -= 60;
			this.hour++;
		}
		while (this.hour >= 24) {
			this.hour -= 24;
			this.day++;
		}
		while (this.day >= 30) {
			this.day -= 30;
			this.season++;
		}
		while (this.season >= Season.LAST) {
			this.season -= Season.LAST;
			this.year++;
		}
	}

	public Dec(time: any) {
		const minutes = time.minute || 0;
		const hours   = time.hour   || 0;
		const days    = time.day    || 0;
		const seasons = time.season || 0;
		const years   = time.year   || 0;

		this.minute -= minutes;
		this.hour   -= hours;
		this.day    -= days;
		this.season -= seasons;
		this.year   -= years;

		while (this.minute < 0) {
			this.minute += 60;
			this.hour--;
		}
		while (this.hour < 0) {
			this.hour += 24;
			this.day--;
		}
		while (this.day < 0) {
			this.day += 30;
			this.season--;
		}
		while (this.season < 0) {
			this.season += Season.LAST;
			this.year--;
		}
		// Check expiration
		if (this.year < 0) {
			this.minute = 0;
			this.hour   = 0;
			this.day    = 0;
			this.season = 0;
			this.year   = 0;
		}
	}

	public Expired(): boolean {
		return (this.year   <= 0) &&
			   (this.season <= 0) &&
			   (this.day    <= 0) &&
			   (this.hour   <= 0) &&
			   (this.minute <= 0);
	}

	public DateString(): string {
		let season;
		if (this.season === Season.Spring) {
			season = "Spring";
		} else if (this.season === Season.Summer) {
			season = "Summer";
		} else if (this.season === Season.Autumn) {
			season = "Autumn";
		} else {
			season = "Winter";
		}

		const day = this.day + 1;
		let dateExtension = "th";
		if (day < 10 || day > 20) {
			if     (day % 10 === 1) {
				dateExtension = "st";
			} else if (day % 10 === 2) {
				dateExtension = "nd";
			} else if (day % 10 === 3) {
				dateExtension = "rd";
			}
		}

		return day + dateExtension + " of " + season + ", year " + (this.year + 1);
	}

	public DateStringShort(): string {
		let season;
		if (this.season === Season.Spring) {
			season = "Spring";
		} else if (this.season === Season.Summer) {
			season = "Summer";
		} else if (this.season === Season.Autumn) {
			season = "Autumn";
		} else {
			season = "Winter";
		}

		const day = this.day + 1;
		let dateExtension = "th";
		if (day < 10 || day > 20) {
			if     (day % 10 === 1) {
				dateExtension = "st";
			} else if (day % 10 === 2) {
				dateExtension = "nd";
			} else if (day % 10 === 3) {
				dateExtension = "rd";
			}
		}

		return day + dateExtension + " of " + season;
	}

	public TimeString(): string {
		let minutes = "00" + this.minute;
		minutes = minutes.substr(minutes.length - 2);

		return this.hour + ":" + minutes;
	}

	public DayTime(): string {
		return this.hour >= 5  && this.hour < 10 ? "morning" :
			this.hour >= 10 && this.hour < 17 ? "day"     :
			this.hour >= 17 && this.hour < 21 ? "evening" :
			"night";
	}

	public IsDay(): boolean {
		return this.hour >= 8 && this.hour < 20;
	}

	// TODO: possible variations for location
	public LightStr(light: string, dark: string): string {
		return this.hour >= 6 && this.hour < 21 ? light : dark;
	}

	public ToDays(): number {
		let day = this.day + this.hour / 24 + this.minute / 24 / 60;
		day += this.season * 30;
		day += this.year * Season.LAST * 30;
		return day;
	}
	public ToHours(): number {
		let hour = this.hour + this.minute / 60;
		hour += this.day * 24;
		hour += this.season * 30 * 24;
		hour += this.year * Season.LAST * 30 * 24;
		return hour;
	}
	public ToMinutes(): number {
		let minute = this.minute;
		minute += this.hour * 60;
		minute += this.day * 24 * 60;
		minute += this.season * 30 * 24 * 60;
		minute += this.year * Season.LAST * 30 * 24 * 60;
		return minute;
	}
}

export { Season, Time };
