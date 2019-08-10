
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
import { MirandaScenes } from "./event/miranda-scenes";
import { GlobalScenes } from "./event/global";
import { TerryScenes } from "./event/terry";
import { KiakaiScenes } from "./event/kiakai-scenes";
import { HalloweenScenes } from "./event/halloween";
import { FarmScenes } from "./loc/farm-scenes";
import { DryadGladeScenes } from "./loc/glade";

import { EquineScenes } from "./enemy/equine";
import { LizardsScenes } from "./enemy/lizard";
import { NagaScenes } from "./enemy/naga";
import { MaliceScoutsScenes } from "./enemy/malice-scouts";
import { OrchidScenes } from "./enemy/orchid-scenes";
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
import { PatchworkScenes } from "./event/nomads/patchwork";
import { RosalinScenes } from "./event/nomads/rosalin";
import { MagnusScenes } from "./event/nomads/magnus";
import { EstevanScenes } from "./event/nomads/estevan";
import { ChiefScenes } from "./event/nomads/chief";
import { CaleScenes } from "./event/nomads/cale-scenes";
import { IslaScenes } from "./event/highlands/isla";
import { LaylaScenes } from "./event/farm/layla-scenes";
import { GwendyScenes } from "./event/farm/gwendy-scenes";
import { RoaScenes } from "./event/brothel/roa";
import { LucilleScenes } from "./event/brothel/lucille";
import { BullTowerScenes } from "./event/outlaws/bulltower";
import { OutlawsScenes } from "./event/outlaws/outlaws";
import { CvetaScenes } from "./event/outlaws/cveta-scenes";
import { MariaScenes } from "./event/outlaws/maria-scenes";
import { VaughnScenes } from "./event/outlaws/vaughn-scenes";
import { NCavalcadeScenes } from "./event/nomads/cavalcade";
import { GolemScenes } from "./event/royals/golem";
import { JeanneScenes } from "./event/royals/jeanne";
import { LeiScenes } from "./event/royals/lei-scenes";
import { TwinsScenes } from "./event/royals/twins";
import { AquiliusScenes } from "./event/outlaws/aquilius";
import { TreeCityScenes } from "./loc/treecity/treecity";
import { NurseryScenes } from "./event/nursery";

let Scenes = {
	Masturbation  : MasturbationScenes,
	Meditation    : MeditationScenes,
	Dreams        : DreamsScenes,
	Roaming       : RoamingScenes,
	Poet          : PoetScenes,
    PortalOpening : PortalOpeningScenes,
    Global        : GlobalScenes,
    Halloween     : HalloweenScenes,
    BullTower     : BullTowerScenes,
    Nursery       : NurseryScenes,

    Kiakai        : KiakaiScenes,
    Terry         : TerryScenes,
    Miranda       : MirandaScenes,
    Gwendy        : GwendyScenes,
    Layla         : LaylaScenes,
    Roa           : RoaScenes,
    Cveta         : CvetaScenes,

	Aria          : AriaScenes,
	Uru           : UruScenes,
	Room69        : Room69Scenes,
    RavenMother   : RavenMotherScenes,

    Chief         : ChiefScenes,
    Cale          : CaleScenes,
    Patchwork     : PatchworkScenes,
    Rosalin       : RosalinScenes,
    Magnus        : MagnusScenes,
    Estevan       : EstevanScenes,
    Momo          : MomoScenes,
    NomadsCavalcade : NCavalcadeScenes,

    Outlaws       : OutlawsScenes,
    Aquilius      : AquiliusScenes,
    Maria         : MariaScenes,
    Vaughn        : VaughnScenes,

    Asche         : AscheScenes,
    Cassidy       : CassidyScenes,
    Fera          : FeraScenes,
    Barnaby       : BarnabyScenes,

    Twins         : TwinsScenes,
    Jeanne        : JeanneScenes,
    Lei           : LeiScenes,

	Zina          : ZinaScenes,
    Sylistraxia   : SylistraxiaScenes,
    Isla          : IslaScenes,
    
    Burrows       : BurrowsScenes,
    Oasis         : OasisScenes,
    Farm          : FarmScenes,
    DryadGlade    : DryadGladeScenes,
    Krawitz       : KrawitzScenes,
    Rigard        : RigardScenes,
    TreeCity      : TreeCityScenes,

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
    Lucille       : LucilleScenes,
    Golem         : GolemScenes,
};

export { Scenes };
