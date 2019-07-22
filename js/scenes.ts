
import { MasturbationScenes } from "./event/masturbation";
import { ZinaScenes } from "./event/zina";
import { UruScenes } from "./event/uru";
import { SylistraxiaScenes } from "./event/sylistraxia";
import { Room69Scenes } from "./event/room69";
import { RoamingScenes } from "./event/roaming";
import { RavenMotherScenes } from "./event/raven";
import { PortalOpeningScenes } from "./event/portalopening";
import { PoetScenes } from "./event/poet";
import { MomoScenes } from "./event/momo";
import { MeditationScenes } from "./event/meditation";
import { AriaScenes } from "./event/aria";
import { DreamsScenes } from "./event/dreams";
import { OasisScenes } from "./loc/oasis";
import { CassidyScenes } from "./event/cassidy";
import { AscheScenes } from "./event/asche";
import { FeraScenes } from "./event/fera";
import { MirandaScenes } from "./event/miranda";
import { GlobalScenes } from "./event/global";
import { TerryScenes } from "./event/terry";
import { KiakaiScenes } from "./event/kiakai";
import { HalloweenScenes } from "./event/halloween";
import { FarmScenes } from "./loc/farm";
import { DryadGladeScenes } from "./loc/glade";

import { EquineScenes } from "./enemy/equine";
import { LizardsScenes } from "./enemy/lizard";
import { NagaScenes } from "./enemy/naga";
import { MaliceScoutsScenes } from "./enemy/malice-scouts";
import { OrchidScenes } from "./enemy/orchid";
import { LagomorphScenes } from "./enemy/rabbit";
import { MothgirlScenes } from "./enemy/mothgirl";
import { ScorpionScenes } from "./enemy/scorp";
import { ZebraShamanScenes } from "./enemy/zebra";
import { GolScenes } from "./enemy/gol";
import { FeralWolfScenes } from "./enemy/feralwolf";
import { FelinesScenes } from "./enemy/feline";
import { DrakeScenes } from "./enemy/drake";
import { BurrowsScenes } from "./loc/burrows";
import { KrawitzScenes } from "./loc/rigard/krawitz";
import { RigardScenes } from "./loc/rigard/rigard";
import { BarnabyScenes } from "./loc/rigard/tavern";
import { BrothelScenes } from "./loc/rigard/brothel";

let Scenes = {
	Masturbation  : MasturbationScenes,
	Meditation    : MeditationScenes,
	Dreams        : DreamsScenes,
	Roaming       : RoamingScenes,
	Poet          : PoetScenes,
    PortalOpening : PortalOpeningScenes,
    Global        : GlobalScenes,
    Halloween     : HalloweenScenes,

    Kiakai        : KiakaiScenes,
    Terry         : TerryScenes,
    Miranda       : MirandaScenes,
	Momo          : MomoScenes,

	Aria          : AriaScenes,
	Uru           : UruScenes,
	Room69        : Room69Scenes,
	RavenMother   : RavenMotherScenes,
    
    Asche         : AscheScenes,
    Cassidy       : CassidyScenes,
    Fera          : FeraScenes,
    Barnaby       : BarnabyScenes,

	Zina          : ZinaScenes,
    Sylistraxia   : SylistraxiaScenes,
    
    Burrows       : BurrowsScenes,
    Oasis         : OasisScenes,
    Farm          : FarmScenes,
    DryadGlade    : DryadGladeScenes,
    Krawitz       : KrawitzScenes,
    Rigard        : RigardScenes,
    Brothel       : BrothelScenes,

    Equine        : EquineScenes,
    Lizards       : LizardsScenes,
    Naga          : NagaScenes,
    MaliceScouts  : MaliceScoutsScenes,
    Lagomorph     : LagomorphScenes,
    Mothgirl      : MothgirlScenes,
    Scorpion      : ScorpionScenes,
    ZebraShaman   : ZebraShamanScenes,
    FeralWolf     : FeralWolfScenes,
    Felines       : FelinesScenes,
    Drake         : DrakeScenes,

    Orchid        : OrchidScenes,
    Gol           : GolScenes,
};

export { Scenes };
