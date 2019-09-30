import * as _ from "lodash";
import { Entity } from "./entity";
import { GAME, WorldTime } from "./GAME";
import { Text } from "./text";

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

function _splitBody(opts: IParseSyntaxOpts, req: number) {
    let terms = opts.body.split("|");
    if (terms.length !== req) {
        alert(`Parser error, ${opts.type}${opts.method ? `.${opts.method}` : ""} requires ${req} terms, ${terms.length} given.`);
        terms = terms.fill("ERROR", terms.length, req - 1);
    }
    return terms;
}

function _parseSyntax(opts: IParseSyntaxOpts) {
    const parsed = syntax[opts.type];
    if (parsed) {
        return ParseRecurse(parsed(opts));
    } else {
        return Text.ApplyStyle(`Parse Error: '${opts.type}' not recognized`, "error");
    }
}

function parseComp(opts: IParseSyntaxOpts) {
    const terms = _splitBody(opts, 3);
    const num: number = GAME().party.Num();
    if (num > 2) { // group
        return terms[2];
    } else if (num === 2) { // two
        return terms[1];
    } else { // alone
        return terms[0];
    }
}

const parseChar: {[index: string]: (c: Entity, opts?: IParseSyntaxOpts) => string} = {
    name: (c: Entity) => c.name,
    // TODO forcegender?
    heshe: (c: Entity) => c.heshe(),
    HeShe: (c: Entity) => c.HeShe(),
    himher: (c: Entity) => c.himher(),
    HimHer: (c: Entity) => c.HimHer(),
    hisher: (c: Entity) => c.hisher(),
    HisHer: (c: Entity) => c.HisHer(),
    hishers: (c: Entity) => c.hishers(),
    poss: (c: Entity) => c.possessive(),
    Poss: (c: Entity) => c.Possessive(),
    poss2: (c: Entity) => c.possessivePlural(),
    Poss2: (c: Entity) => c.PossessivePlural(),
    has: (c: Entity) => c.has(),
    is: (c: Entity) => c.is(),
    mfFem: (c: Entity, opts: IParseSyntaxOpts) => { const terms = _splitBody(opts, 2); return c.mfFem(terms[0], terms[1]); },
    mfTrue: (c: Entity, opts: IParseSyntaxOpts) => { const terms = _splitBody(opts, 2); return c.mfTrue(terms[0], terms[1]); },
    taur: (c: Entity, opts: IParseSyntaxOpts) => { const terms = _splitBody(opts, 2); return c.IsTaur() ? terms[0] : terms[1]; },
    naga: (c: Entity, opts: IParseSyntaxOpts) => { const terms = _splitBody(opts, 2); return c.IsNaga() ? terms[0] : terms[1]; },
    goo: (c: Entity, opts: IParseSyntaxOpts) => { const terms = _splitBody(opts, 2); return c.IsGoo() ? terms[0] : terms[1]; },
    flexible: (c: Entity, opts: IParseSyntaxOpts) => { const terms = _splitBody(opts, 2); return c.IsFlexible() ? terms[0] : terms[1]; },
    hashair: (c: Entity, opts: IParseSyntaxOpts) => { const terms = _splitBody(opts, 2); return c.HasHair() ? terms[0] : terms[1]; },
    longhair: (c: Entity, opts: IParseSyntaxOpts) => { const terms = _splitBody(opts, 2); return c.HasLongHair() ? terms[0] : terms[1]; },
    longtongue: (c: Entity, opts: IParseSyntaxOpts) => { const terms = _splitBody(opts, 2); return c.LongTongue() ? terms[0] : terms[1]; },

    cocks: (c: Entity) => c.MultiCockDesc(),
    // TODO howto?
    // cock: (c: Entity) => p1cock.Short(),
    // cockTip: (c: Entity) => p1cock.TipShort(),
    // knot: (c: Entity) => p1cock.KnotShort(),
    balls: (c: Entity) => c.BallsDesc(),
    butt: (c: Entity) => c.Butt().Short(),
    anus: (c: Entity) => c.Butt().AnalShort(),
    vag: (c: Entity) => c.FirstVag().Short(),
    clit: (c: Entity) => c.FirstVag().ClitShort(),
    breasts: (c: Entity) => c.FirstBreastRow().Short(),
    nip: (c: Entity) => c.FirstBreastRow().NipShort(),
    nips: (c: Entity) => c.FirstBreastRow().NipsShort(),
    tongue: (c: Entity) => c.TongueDesc(),
    tongueTip: (c: Entity) => c.TongueTipDesc(),
    skin: (c: Entity) => c.SkinDesc(),
    hair: (c: Entity) => c.Hair().Short(),
    lips: (c: Entity) => c.LipsDesc(),
    face: (c: Entity) => c.FaceDesc(),
    ear: (c: Entity) => c.EarDesc(),
    ears: (c: Entity) => c.EarDesc(true),
    eye: (c: Entity) => c.EyeDesc(),
    eyes: (c: Entity) => c.EyesDesc(),
    hand: (c: Entity) => c.HandDesc(),
    palm: (c: Entity) => c.PalmDesc(),
    hip: (c: Entity) => c.HipDesc(),
    hips: (c: Entity) => c.HipsDesc(),
    thigh: (c: Entity) => c.ThighDesc(),
    thighs: (c: Entity) => c.ThighsDesc(),
    leg: (c: Entity) => c.LegDesc(),
    legs: (c: Entity) => c.LegsDesc(),
    knee: (c: Entity) => c.KneeDesc(),
    knees: (c: Entity) => c.KneesDesc(),
    foot: (c: Entity) => c.FootDesc(),
    feet: (c: Entity) => c.FeetDesc(),
    belly: (c: Entity) => c.StomachDesc(),
    tail: (c: Entity) => { const tail = c.HasTail(); return tail ? tail.Short() : ""; },
    wings: (c: Entity) => { const wings = c.HasWings(); return wings ? wings.Short() : ""; },
    horns: (c: Entity) => { const horns = c.HasHorns(); return horns ? horns.Short() : ""; },
    weapon: (c: Entity) => c.WeaponDesc(),
    armor: (c: Entity) => c.ArmorDesc(),
    botarmor: (c: Entity) => c.LowerArmorDesc(),
};

const syntax: {[index: string]: (opts: IParseSyntaxOpts) => string} = {
    // Character parsers
    pc: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().player, opts),
    comp: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().party.Get(1), opts),
    comps: (opts: IParseSyntaxOpts) => parseComp(opts),

    kiai: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().kiakai, opts),
    miranda: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().miranda, opts),
    terry: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().terry, opts),
    zina: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().zina, opts),
    momo: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().momo, opts),
    lei: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().lei, opts),
    rumi: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().twins.rumi, opts),
    rani: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().twins.rani, opts),
    room69: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().room69, opts),
    chief: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().chief, opts),
    rosalin: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().rosalin, opts),
    cale: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().cale, opts),
    estevan: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().estevan, opts),
    magnus: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().magnus, opts),
    patchwork: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().patchwork, opts),
    lagon: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().lagon, opts),
    ophelia: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().ophelia, opts),
    vena: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().vena, opts),
    roa: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().roa, opts),
    gwendy: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().gwendy, opts),
    danie: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().danie, opts),
    adrian: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().adrian, opts),
    layla: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().layla, opts),
    isla: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().isla, opts),
    aquilius: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().aquilius, opts),
    maria: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().maria, opts),
    cveta: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().cveta, opts),
    vaughn: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().vaughn, opts),
    fera: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().fera, opts),
    asche: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().asche, opts),
    cassidy: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().cassidy, opts),
    jeanne: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().jeanne, opts),
    golem: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().golem, opts),
    orchid: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().orchid, opts),
    raven: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().ravenmother, opts),
    uru: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().uru, opts),
    lucille: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().lucille, opts),
    belinda: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().belinda, opts),
    aria: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().aria, opts),
    ches: (opts: IParseSyntaxOpts) => parseChar[opts.method](GAME().ches, opts),

    season: (opts: IParseSyntaxOpts) => {
        const terms = _splitBody(opts, 4);
        return terms[WorldTime().season];
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
