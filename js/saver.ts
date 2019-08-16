import * as $ from "jquery";
import * as LZString from "lz-string";

import { loadfileOverlay } from "./fileoverlay";
import { GameCache, SetGameCache } from "./GAME";
import { CacheToGame, GameToCache } from "./gamecache";
import { isOnline } from "./gamestate";
import { Gui } from "./gui";
import { Text } from "./text";
import { GenerateFile } from "./utility";

export namespace Saver {
	export const slots = 12;

	export function SavePrompt(backFunc?: CallableFunction) {
		Text.Clear();

		Text.Add("Save game:");
		Text.NL();

		const options = new Array();
		for (let i = 0; i < Saver.slots; i++) {
			Text.Add("Game " + i + ": ");
			const name = localStorage["save" + i];
			if (name) {
				Text.Add(name);
				options.push({ nameStr : "Game " + i,
					func(obj: number) {
						const prmpt = prompt("This will overwrite save slot " + obj + ", continue? \n\n Comment:");
						if (prmpt != null) { SaveGame(obj, prmpt); }
					}, enabled : true, obj : i,
				});
			} else {
				Text.Add("EMPTY");
				options.push({ nameStr : "Game " + i,
					func(obj: number) {
						const prmpt = prompt("This will save to slot " + obj + ", continue? \n\n Comment:");
						if (prmpt != null) { SaveGame(obj, prmpt); }
					}, enabled : true, obj : i,
				});
			}
			Text.NL();
		}
		Gui.SetButtonsFromList(options, true, backFunc);

		Text.NL();
		if (HasSaves()) {
			let storageLength = 0;
			for (const key in localStorage) {
				if (localStorage.hasOwnProperty(key) && localStorage[key].length) {
					storageLength += localStorage[key].length;
				}
			}
			Text.Add("localStorage usage: " + ((storageLength * 16) / (8 * 1024)).toFixed(2) + "kB");
		}
		Text.Flush();
	}

	function SaveGame(slot: number, comment: string) {
		GameToCache();
		const seen: any[] = [];
		const saveData = JSON.stringify(GameCache(), function(key, value) {
			if (typeof value === "object" && value !== null) {
				if (seen.indexOf(value) !== -1) {
					console.error("Circular reference found in the gameCache!\n" + key + ":", value);
					return;
				}
				seen.push(value);
			}
			return value;
		});

		let saveName = GameCache().name;
		if (comment) {
			saveName += " :: Comment: " + comment;
		}

		localStorage["saveDataLZ" + slot] = LZString.compressToUTF16(saveData);
		localStorage["save" + slot] = saveName;
		// Clear out legacy storage.
		delete localStorage["savedata" + slot];

		Saver.SavePrompt();
	}

	export function SaveToFile() {
		let filename;
		if (GenerateFile.canSaveOffline) {
			filename = prompt("SAVE TO FILE MIGHT NOT WORK IN OFFLINE MODE!\n\n Enter name of save file.");
		} else {
			filename = prompt("SAVE TO FILE WILL NOT WORK IN OFFLINE MODE!\n\n Enter name of save file.");
		}
		if (filename && filename != "") {
			GameToCache();
			const seen: any[] = [];
			GenerateFile({filename, content: JSON.stringify(GameCache(),
				function(key, val) {
					if (typeof val == "object") {
						if (seen.indexOf(val) >= 0) {
							return;
						}
						seen.push(val);
					}
					return val;
				}),
			});
		} else {
			Text.NL();
			Text.Add("No file saved: Enter a filename!", null, "bold");
			Text.Flush();
		}
	}

	// Returns true if there are any saves
	export function HasSaves() {
		if (!isOnline()) { return false; }
		for (let i = 0; i < Saver.slots; i++) {
			if (SaveHeader(i)) { return true; }
		}
		return false;
	}

	export function LoadPrompt(backFunc: any) {
		Text.Clear();

		Text.Add("Load game:");
		Text.NL();

		const options = new Array();
		for (let i = 0; i < Saver.slots; i++) {
			Text.Add("Game " + i + ": ");
			const name = localStorage["save" + i];
			if (name) {
				Text.Add(name);
			} else {
				Text.Add("EMPTY");
			}
			Text.NL();
			options.push({ nameStr : "Game " + i,
				func : LoadGame, enabled : SaveHeader(i), obj : i,
			});
		}
		Gui.SetButtonsFromList(options, true, backFunc);

		Text.NL();
		if (HasSaves()) {
			let storageLength = 0;
			for (const key in localStorage) {
				if (localStorage.hasOwnProperty(key) && localStorage[key].length) {
					storageLength += localStorage[key].length;
				}
			}
			Text.Add("localStorage usage: " + ((storageLength * 16) / (8 * 1024)).toFixed(2) + "kB");
		}
		Text.Flush();
	}

	function LoadGame(slot: number) {
		if (localStorage["saveDataLZ" + slot]) {
			const saveData = LZString.decompressFromUTF16(localStorage["saveDataLZ" + slot]);
			SetGameCache(JSON.parse(saveData));
		} else {
			// Load from legacy storage.
			SetGameCache(JSON.parse(localStorage["savedata" + slot]));
		}

		CacheToGame();
		Gui.PrintDefaultOptions();
	}

	function SaveHeader(nr: number) {
		return localStorage["save" + nr];
	}

	export function DeleteSave(nr: number) {
		delete localStorage["save" + nr];
		delete localStorage["savedata" + nr];
	}

	export function Clear() {
		// localStorage.clear();
		const conf = confirm("This will remove all local saves and settings, do you really want to continue?");
		if (conf == true) {
			for (let i = 0; i < Saver.slots; i++) {
				delete localStorage["save" + i];
				delete localStorage["savedata" + i];
			}
		}
	}

	function OnLoadFromFileClick() {
		const el: any = document.getElementById("loadFileFiles");
		const files = el.files;
		if (!files.length) {
			alert("Please select a file!");
			return;
		}

		loadfileOverlay();

		const file = files[0];

		LoadFromFile(file);
	}

	// Takes a File as argument
	function LoadFromFile(file: any) {
		if (!file) { return; }

		const reader = new FileReader();

		reader.onload = function(e) {
			const target: any = e.target;
			SetGameCache(JSON.parse(target.result));
			CacheToGame();
			Gui.PrintDefaultOptions();
			Gui.Render();
		};

		reader.readAsText(file);
	}

	export function Init() {
		$("#loadFileOk").click(OnLoadFromFileClick);
		$("#loadFileCancel").click(loadfileOverlay);
	}

}
