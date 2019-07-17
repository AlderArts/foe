
let Season = {
	Spring: 0,
	Summer: 1,
	Autumn: 2,
	Winter: 3,
	LAST  : 4
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
function Time(year, season, day, hour, minute) {
	this.year   = year   || 0;
	this.season = season || Season.Spring;
	this.day    = day    || 0;
	this.hour   = hour   || 0;
	this.minute = minute || 0;
}

Time.prototype.ToStorage = function() {
	var storage = {};
	if(this.year   != 0) storage["y"] = this.year;
	if(this.season != 0) storage["s"] = this.season;
	if(this.day    != 0) storage["d"] = this.day;
	if(this.hour   != 0) storage["h"] = this.hour;
	if(this.minute != 0) storage["m"] = this.minute;
	return storage;
}

Time.prototype.FromStorage = function(storage) {
	storage = storage || {};
	this.year   = parseInt(storage.y) || this.year;
	this.season = parseInt(storage.s) || this.season;
	this.day    = parseInt(storage.d) || this.day;
	this.hour   = parseInt(storage.h) || this.hour;
	this.minute = parseInt(storage.m) || this.minute;
}

Time.prototype.Clone = function() {
	var time = new Time(
		this.year,
		this.season,
		this.day,
		this.hour,
		this.minute
	);
	return time;
}

Time.prototype.Leq = function(time) {
	if(this.year   > time.year)   return false;
	if(this.season > time.season) return false;
	if(this.day    > time.day)    return false;
	if(this.hour   > time.hour)   return false;
	if(this.minute > time.minute) return false;
	return true;
}

Time.prototype.TimeToHour = function(hour, minute) {
	hour   = hour   || 0;
	minute = minute || 0;
	var step = {
		hour   : hour   - this.hour,
		minute : minute - this.minute
	};
	
	if(step.minute < 0) {
		step.minute += 60;
		step.hour--;
	}
	if(step.hour   < 0)
		step.hour   += 24;

	return step;
}

Time.prototype.Inc = function(time) {
	minutes = time.minute || 0;
	hours   = time.hour   || 0;
	days    = time.day    || 0;
	seasons = time.season || 0;
	years   = time.year   || 0;
	
	this.minute += minutes;
	this.hour   += hours;
	this.day    += days;
	this.season += seasons;
	this.year   += years;

	while(this.minute >= 60) {
		this.minute -= 60;
		this.hour++;
	}
	while(this.hour >= 24) {
		this.hour -= 24;
		this.day++;
	}
	while(this.day >= 30) {
		this.day -= 30;
		this.season++;
	}
	while(this.season >= Season.LAST) {
		this.season -= Season.LAST;
		this.year++;
	}
}

Time.prototype.Dec = function(time) {
	minutes = time.minute || 0;
	hours   = time.hour   || 0;
	days    = time.day    || 0;
	seasons = time.season || 0;
	years   = time.year   || 0;
	
	this.minute -= minutes;
	this.hour   -= hours;
	this.day    -= days;
	this.season -= seasons;
	this.year   -= years;

	while(this.minute < 0) {
		this.minute += 60;
		this.hour--;
	}
	while(this.hour < 0) {
		this.hour += 24;
		this.day--;
	}
	while(this.day < 0) {
		this.day += 30;
		this.season--;
	}
	while(this.season < 0) {
		this.season += Season.LAST;
		this.year--;
	}
	// Check expiration
	if(this.year < 0) {
		this.minute = 0;
		this.hour   = 0;
		this.day    = 0;
		this.season = 0;
		this.year   = 0;
	}
}

Time.prototype.Expired = function() {
	return (this.year   <= 0) &&
		   (this.season <= 0) &&
		   (this.day    <= 0) &&
		   (this.hour   <= 0) &&
		   (this.minute <= 0);
}

Time.prototype.DateString = function() {
	var season;
	if(this.season == Season.Spring) season = "Spring";
	else if(this.season == Season.Summer) season = "Summer";
	else if(this.season == Season.Autumn) season = "Autumn";
	else season = "Winter";
	
	var day = this.day + 1;
	var dateExtension = "th";
	if(day < 10 || day > 20) {
		if     (day % 10 == 1) dateExtension = "st";
		else if(day % 10 == 2) dateExtension = "nd";
		else if(day % 10 == 3) dateExtension = "rd";
	}
	
	return day + dateExtension + " of " + season + ", year " + (this.year + 1);
}
Time.prototype.DateStringShort = function() {
	var season;
	if(this.season == Season.Spring) season = "Spring";
	else if(this.season == Season.Summer) season = "Summer";
	else if(this.season == Season.Autumn) season = "Autumn";
	else season = "Winter";
	
	var day = this.day + 1;
	var dateExtension = "th";
	if(day < 10 || day > 20) {
		if     (day % 10 == 1) dateExtension = "st";
		else if(day % 10 == 2) dateExtension = "nd";
		else if(day % 10 == 3) dateExtension = "rd";
	}
	
	return day + dateExtension + " of " + season;
}

Time.prototype.TimeString = function() {
	var minutes = "00" + this.minute;
	minutes = minutes.substr(minutes.length-2);
	
	return this.hour + ":" + minutes;
}

Time.prototype.DayTime = function() {
	return this.hour >= 5  && this.hour < 10 ? "morning" :
	       this.hour >= 10 && this.hour < 17 ? "day"     :
	       this.hour >= 17 && this.hour < 21 ? "evening" :
	       "night";
}

Time.prototype.IsDay = function() {
	return this.hour >= 8 && this.hour < 20;
}

// TODO: possible variations for location
Time.prototype.LightStr = function(light, dark) {
	return this.hour >= 6 && this.hour < 21 ? light : dark;
}

Time.prototype.ToDays = function() {
	var day = this.day + this.hour/24 + this.minute/24/60;
	day += this.season * 30;
	day += this.year * Season.LAST * 30;
	return day;
}
Time.prototype.ToHours = function() {
	var hour = this.hour + this.minute/60;
	hour += this.day * 24;
	hour += this.season * 30 * 24;
	hour += this.year * Season.LAST * 30 * 24;
	return hour;
}
Time.prototype.ToMinutes = function() {
	var minute = this.minute;
	minute += this.hour * 60;
	minute += this.day * 24 * 60;
	minute += this.season * 30 * 24 * 60;
	minute += this.year * Season.LAST * 30 * 24 * 60;
	return minute;
}

export { Season, Time };
