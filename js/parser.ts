import * as _ from "lodash";
import { Text } from "./text";
import { Entity } from "./entity";
import { GAME } from "./GAME";

export function P2(literals: TemplateStringsArray, ...tags: string[]) {
    let result = "";

    _.forEach(tags, (tag, key) => {
        result += literals[key];
        result += tag;
    });
    // Add the last literal
    result += _.last(literals);

    // Add <i></i> tags to dialogue
    // result = result.replace(/“/g, "<i>“").replace(/”/g, "”</i>");

    return ParseRecurse(result);
}

function ParseRecurse(literal: string) {
    let start = literal.indexOf("[");

    while (start !== -1) {
        let recurseLevel = 1;
        let stop = -1;

        for (let i = start + 1; i < literal.length; i++) {
            const c = literal.charAt(i);
            if (c === "[") {
                recurseLevel++;
            } else if (c === "]") {
                recurseLevel--;
                if (recurseLevel === 0) {
                    stop = i;
                    break;
                }
            }
        }

        if (stop === -1) {
            return literal + Text.ApplyStyle(`Parse Error, [ without closing ]`, "error");
        }

        const replaceStr = ParseReplace(literal.slice(start + 1, stop));

        literal = `${literal.slice(0, start)}${replaceStr}${literal.slice(stop + 1)}`;
        start = literal.indexOf("[", start + replaceStr.length);
    }

    return literal;
}

function ParseReplace(code: string) {
    let type = code;
    let method;
    const separator = code.indexOf(" ");
    if (separator !== -1) {
        type = code.substr(0, separator);
    }
    const body = code.substr(separator + 1);

    const dot = type.indexOf(".");
    if (dot !== -1) {
        method = type.substr(dot + 1);
        type = type.substr(0, dot);
    }

    return _parseSyntax({body, type, method});
}

interface IParseSyntaxOpts {
    body: string;
    type: string;
    method: string;
}

function _parseSyntax(opts: IParseSyntaxOpts) {
    const parsed = syntax[opts.type];
    if (parsed) {
        return ParseRecurse(parsed(opts));
    } else {
        return Text.ApplyStyle(`Parse Error: '${opts.type}' not recognized`, "error");
    }
}

const parseChar: {[index: string]: (c: Entity) => string} = {
    name: (c: Entity) => c.name,
    heshe: (c: Entity) => c.heshe(),
    HeShe: (c: Entity) => c.HeShe(),
    himher: (c: Entity) => c.himher(),
    HimHer: (c: Entity) => c.HimHer(),
    hisher: (c: Entity) => c.hisher(),
    HisHer: (c: Entity) => c.HisHer(),
    hishers: (c: Entity) => c.hishers(),
    // TODO
};

const syntax: {[index: string]: (opts: IParseSyntaxOpts) => string} = {
    // Character parsers
    pc: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().player),
    kiai: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().kiakai),
    miranda: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().miranda),
    terry: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().terry),
    zina: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().zina),
    momo: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().momo),
    lei: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().lei),
    rumi: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().twins.rumi),
    rani: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().twins.rani),
    room69: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().room69),
    chief: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().chief),
    rosalin: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().rosalin),
    cale: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().cale),
    estevan: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().estevan),
    magnus: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().magnus),
    patchwork: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().patchwork),
    lagon: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().lagon),
    ophelia: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().ophelia),
    vena: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().vena),
    roa: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().roa),
    gwendy: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().gwendy),
    danie: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().danie),
    adrian: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().adrian),
    layla: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().layla),
    isla: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().isla),
    aquilius: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().aquilius),
    maria: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().maria),
    cveta: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().cveta),
    vaughn: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().vaughn),
    fera: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().fera),
    asche: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().asche),
    cassidy: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().cassidy),
    jeanne: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().jeanne),
    golem: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().golem),
    orchid: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().orchid),
    raven: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().ravenmother),
    uru: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().uru),
    lucille: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().lucille),
    belinda: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().belinda),
    aria: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().aria),
    ches: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().ches),
    // TODO
    if: (opts: IParseSyntaxOpts) => {
        return `|if ${opts.body}|`;
    },
};

// Unrelated code below for matching enum

/*
const keys: {[key in keyof typeof Season]: string} = {
    Spring: "Hello",
    Summer: "Hi",
    Autumn: "hoi",
    Winter: "oo",
    LAST: undefined,
};

const season = keys[Season.Autumn];
*/
