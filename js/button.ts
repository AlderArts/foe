/*
 *
 * Button class, includes input handling
 *
 */
import * as $ from "jquery";
import * as _ from "lodash";

import { BUTTON_FONT } from "../app";
import { Images } from "./assets";
import { gameState, GameState, SetGameState } from "./gamestate";
import { Text } from "./text";

export type Tooltip = ((obj: any) => string) | string;

export class Button {
	public Gui: any;
	public enabledImage: any;
	public disabledImage: any;
	public visible: boolean;
	public enabled: boolean;
	public func: CallableFunction;
	public obj: any;
	public tooltip: Tooltip;
	public key: number;
	public state: GameState;
	public oldEnImagePath: any;
	public oldDisImagePath: any;
	public set: any;
	public image: any;
	public text: any;
	public text2: any;
	public glow: any;

	constructor(Gui: any, rect: any, text: string, func: CallableFunction, enabled: boolean, image: any, disabledImage: any, glow?: boolean) {
		const that = this;

		this.Gui = Gui;

		this.enabledImage  = image || Images.imgButtonEnabled;
		this.disabledImage = disabledImage || Images.imgButtonDisabled;
		this.visible = false;
		this.enabled = enabled;
		this.func    = func;
		this.key     = -1;

		this.oldEnImagePath  = this.enabledImage;
		this.oldDisImagePath = this.disabledImage;

		this.set     = Gui.canvas.set();
		this.image   = Gui.canvas.image(this.enabledImage, rect.x, rect.y, rect.w, rect.h);
		this.image.node.ondragstart = () => {
			return false;
		};
		$(this.image.node).css({
			"-webkit-touch-callout": "none",
			"-webkit-user-select": "none",
			"-khtml-user-select": "none",
			"-moz-user-select": "none",
			"-ms-user-select": "none",
			"user-select": "none",
		});
		if (Button.Shadow) {
			this.text    = Gui.canvas.text((rect.x + rect.w / 2) + 2, (rect.y + rect.h / 2) + 2, text).attr(
				{fill: "#FFF", /*stroke:"#000",*/ font: BUTTON_FONT});
		}
		this.text2   = Gui.canvas.text(rect.x + rect.w / 2, rect.y + rect.h / 2, text).attr(
			{fill: "#000", /*stroke:"#000",*/ font: BUTTON_FONT});
		this.set.push(this.image);
		// Disable text selection
		if (Button.Shadow) {
			$(this.text.node).css({
				"-webkit-touch-callout": "none",
				"-webkit-user-select": "none",
				"-khtml-user-select": "none",
				"-moz-user-select": "none",
				"-ms-user-select": "none",
				"user-select": "none",
				"pointer-events": "none",
			});
			this.set.push(this.text);
		}
		$(this.text2.node).css({
			"-webkit-touch-callout": "none",
			"-webkit-user-select": "none",
			"-khtml-user-select": "none",
			"-moz-user-select": "none",
			"-ms-user-select": "none",
			"user-select": "none",
			"pointer-events": "none",
		});
		this.set.push(this.text2);
		if (glow) {
			this.glow = this.image.glow({width: 5, color: "green", opacity: 1});
			this.set.push(this.glow);
		}

		this.set.attr({
			cursor: "pointer",
		}).click(() => {
			that.HandleClick();
		}).hover(() => {
			that.HoverIn();
		}, () => {
			document.getElementById("tooltipTextArea").style.visibility = "hidden";
		});
	}

	static get Shadow() { return false; }

	public HandleClick() {
		if (!this.enabled) { return; }
		if (!this.visible) { return; }

		if (this.func) {
			if (this.state && gameState !== GameState.Combat) {
				SetGameState(this.state, this.Gui);
			}
			try {
				this.func(this.obj);
			} catch (e) {
				alert(e.message + "........." + e.stack);
			} finally {
				this.Gui.Render();
			}
		}
	}

	public HoverIn() {
		if (this.visible && this.enabled && this.tooltip) {
			if (_.isFunction(this.tooltip)) {
				this.tooltip(this.obj);
			} else {
				Text.SetTooltip(this.tooltip);
			}
			document.getElementById("tooltipTextArea").style.visibility = "visible";
		} else {
			document.getElementById("tooltipTextArea").style.visibility = "hidden";
		}
	}

	/*
	 * Shortcut key (for defines, see input.js)
	 */
	public SetKey(key: number) {
		this.key = key;
	}

	public SetEnabled(value: boolean) {
		if (value) {
			if (this.oldEnImagePath !== this.enabledImage || this.enabled !== value) {
				this.image.attr({src: this.enabledImage});
				this.oldEnImagePath  = this.enabledImage;
			}
		} else {
			if (this.oldDisImagePath !== this.disabledImage || this.enabled !== value) {
				this.image.attr({src: this.disabledImage});
				this.oldDisImagePath = this.disabledImage;
			}
		}
		this.enabled = value;
	}

	public SetVisible(value: boolean) {
		this.visible = value;
		if (value) {
			this.set.show();
		} else {
			this.set.hide();
		}
	}

	public SetVisibility() {
		if (this.visible) {
			this.set.show();
		} else {
			this.set.hide();
		}
	}

	public SetText(text: string) {
		if (Button.Shadow) {
			this.text.attr({text});
		}
		this.text2.attr({text});
	}

	/*
	 * This function is used to set the state of a button after it is created
	 */
	public Setup(text: string, func: CallableFunction, enabled: boolean, obj?: any, tooltip?: Tooltip, state?: GameState) {
		this.SetText(text);
		this.func    = func;
		this.obj     = obj;
		this.SetVisible(true);
		this.SetEnabled(enabled);
		this.tooltip = tooltip;
		this.state   = state;
	}

	/*
	 * Set from ability
	 */
	public SetFromAbility(encounter: any, caster: any, ability: any, backPrompt: CallableFunction) {
		this.SetText(ability.name);
		this.tooltip = ability.tooltip;
		this.SetVisible(true);
		const enabled = ability.enabledCondition ? ability.enabledCondition(encounter, caster) : true;

		this.SetEnabled(enabled);

		this.func = () => {
			ability.OnSelect(encounter, caster, backPrompt);
		};
	}

	public HandleKeydown(key: number) {
		if (!this.enabled) { return; }
		if (!this.visible) { return; }

		if (key !== this.key) { return; }

		if (this.func) {
			if (this.state && gameState !== GameState.Combat) {
				SetGameState(this.state, this.Gui);
			}
			try {
				this.func(this.obj);
				this.HoverIn();
			} catch (e) {
				alert(e.message + "........." + e.stack);
			} finally {
				this.Gui.Render();
			}
		}
	}
}
