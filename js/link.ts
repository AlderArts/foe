
type funcType = (obj?: any, ...args: any[]) => void;

export class Link {
	public name: string|(() => string);
	public visibleCondition: boolean|(() => boolean);
	public enabledCondition: boolean|(() => boolean);
	public print: string|(() => void);
	public func: funcType;
    public tooltip: string|(() => string);
    public image: any;

	constructor(
        name: string|(() => string),
        visibleCondition: boolean|(() => boolean),
        enabledCondition: boolean|(() => boolean),
        print?: string|(() => void),
        func?: funcType,
        tooltip?: string|(() => string)) {

		// String or function that returns string
		this.name = name;
		// This can be set to true, or to a function
		// Both enabled and visible must be true for the option to be shown and active
		this.visibleCondition = visibleCondition;
		this.enabledCondition = enabledCondition;
		// This is called when the location is printed (can be an unconditional string)
		this.print = print;
		// This function is called when the player choses the option
		this.func = func;
		this.tooltip = tooltip;
	}
}

export interface IChoice {
    nameStr: string;
    func: funcType;
    obj?: any;
    enabled: boolean;
    tooltip?: string;
    image?: any;
}
