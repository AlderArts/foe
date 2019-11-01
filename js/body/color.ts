// TODO: Palette instead?
enum Color {
	white    = 0,
	olive    = 1,
	black    = 2,
	red      = 3,
	green    = 4,
	blue     = 5,
	silver   = 6,
	gold     = 7,
	bronze   = 8,
	orange   = 9,
	light    = 10,
	dark     = 11,
	gray     = 12,
	brown    = 13,
	yellow   = 14,
	blonde   = 15,
	platinum = 16,
	purple   = 17,
	pink     = 18,
	teal     = 19,

	numColors= 20,
}
namespace Color {
	export function Desc(col: number) {
		switch (col) {
		case Color.white:    return "white";
		case Color.light:    return "light";
		case Color.dark:     return "dark";
		case Color.gray:     return "gray";
		case Color.olive:    return "olive";
		case Color.black:    return "black";
		case Color.red:      return "red";
		case Color.green:    return "green";
		case Color.blue:     return "blue";
		case Color.silver:   return "silver";
		case Color.gold:     return "gold";
		case Color.bronze:   return "bronze";
		case Color.orange:   return "orange";
		case Color.brown:    return "brown";
		case Color.yellow:   return "yellow";
		case Color.blonde:   return "blonde";
		case Color.platinum: return "platinum";
		case Color.purple:   return "purple";
		case Color.pink:     return "pink";
		case Color.teal:     return "teal";

		default:             return "colorless";
		}
	}
}

export { Color };
