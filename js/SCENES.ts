// import { AriaScenes } from "./event/aria";
import { EquineScenes } from "./enemy/equine";
import { FelinesScenes } from "./enemy/feline";
import { FeralWolfScenes } from "./enemy/feralwolf";
import { GolScenes } from "./enemy/gol";
import { LizardsScenes } from "./enemy/lizard";
import { MaliceScoutsScenes } from "./enemy/malice-scouts";
import { MothgirlScenes } from "./enemy/mothgirl";
import { NagaScenes } from "./enemy/naga";
import { OrchidScenes } from "./enemy/orchid-scenes";
import { LagomorphScenes } from "./enemy/rabbit-scenes";
import { ScorpionScenes } from "./enemy/scorp";
import { ZebraShamanScenes } from "./enemy/zebra";
import { AscheScenes } from "./event/asche-scenes";
import { AscheSexScenes } from "./event/asche-sex";
import { AscheTasksScenes } from "./event/asche-tasks";
import { BastetScenes } from "./event/brothel/bastet";
import { FireblossomScenes } from "./event/brothel/fireblossom";
import { GryphonsScenes } from "./event/brothel/gryphons";
import { LucilleScenes } from "./event/brothel/lucille";
import { RoaScenes } from "./event/brothel/roa-scenes";
import { LagonDScenes } from "./event/burrows/lagon-defeated";
import { LagonScenes } from "./event/burrows/lagon-scenes";
import { OpheliaScenes } from "./event/burrows/ophelia-scenes";
import { VenaRScenes } from "./event/burrows/vena-restored";
import { VenaScenes } from "./event/burrows/vena-scenes";
import { CassidyScenes } from "./event/cassidy-scenes";
import { CassidySexScenes } from "./event/cassidy-sex";
import { DreamsScenes } from "./event/dreams";
import { AdrianScenes } from "./event/farm/adrian-scenes";
import { GwendyScenes } from "./event/farm/gwendy-scenes";
import { LaylaScenes } from "./event/farm/layla-scenes";
import { FeraScenes } from "./event/fera";
import { HalloweenScenes } from "./event/halloween";
import { IslaScenes } from "./event/highlands/isla";
import { Intro } from "./event/introduction";
import { KiakaiScenes } from "./event/kiakai-scenes";
import { KiakaiSexScenes } from "./event/kiakai-sex";
import { MasturbationScenes } from "./event/masturbation";
import { MeditationScenes } from "./event/meditation";
import { MirandaScenes } from "./event/miranda-scenes";
import { MomoScenes } from "./event/momo";
import { CaleScenes } from "./event/nomads/cale-scenes";
import { CaleSexScenes } from "./event/nomads/cale-sex";
import { NCavalcadeScenes } from "./event/nomads/cavalcade";
import { ChiefScenes } from "./event/nomads/chief";
import { EstevanScenes } from "./event/nomads/estevan";
import { MagnusScenes } from "./event/nomads/magnus";
import { PatchworkScenes } from "./event/nomads/patchwork";
import { RosalinScenes } from "./event/nomads/rosalin";
import { NurseryScenes } from "./event/nursery";
import { AquiliusScenes } from "./event/outlaws/aquilius";
import { OCavalcadeScenes } from "./event/outlaws/cavalcade";
import { CvetaDateScenes } from "./event/outlaws/cveta-date";
import { CvetaScenes } from "./event/outlaws/cveta-scenes";
import { DeadDropScenes } from "./event/outlaws/maria-dd";
import { MariaScenes } from "./event/outlaws/maria-scenes";
import { OutlawsScenes } from "./event/outlaws/outlaws";
import { VaughnScenes } from "./event/outlaws/vaughn-scenes";
import { VaughnTasksScenes } from "./event/outlaws/vaughn-tasks";
import { PoetScenes } from "./event/poet";
import { PortalOpeningScenes } from "./event/portalopening";
import { RavenMotherScenes } from "./event/raven";
import { RoamingScenes } from "./event/roaming";
import { Room69Scenes } from "./event/room69";
import { GolemScenes } from "./event/royals/golem";
import { JeanneScenes } from "./event/royals/jeanne-scenes";
import { LeiScenes } from "./event/royals/lei-scenes";
import { LeiSexScenes } from "./event/royals/lei-sex";
import { LeiTaskScenes } from "./event/royals/lei-tasks";
import { TwinsScenes } from "./event/royals/twins-scenes";
import { TerryScenes } from "./event/terry-scenes";
import { BurrowsScenes } from "./loc/burrows-scenes";
import { MarketScenes } from "./loc/farm-market";
import { FarmScenesIntro } from "./loc/farm-scenes";
import { DryadGladeScenes } from "./loc/glade";
import { OasisScenes } from "./loc/oasis";
import { ArmorShopScenes } from "./loc/rigard/armorshop";
import { BrothelScenes } from "./loc/rigard/brothel";
import { NobleScenes } from "./loc/rigard/castle";
import { ClothShopScenes } from "./loc/rigard/clothstore";
import { LBScenes } from "./loc/rigard/inn";
import { KrawitzScenes } from "./loc/rigard/krawitz";
import { MagicShopScenes } from "./loc/rigard/magicshop";
import { ShopStreetScenes } from "./loc/rigard/merchants";
import { PlazaScenes } from "./loc/rigard/plaza";
import { RigardScenes } from "./loc/rigard/rigard-scenes";
import { OddShopScenes } from "./loc/rigard/sexstore";
import { BarnabyScenes } from "./loc/rigard/tavern";
import { WeaponShopScenes } from "./loc/rigard/weaponshop";

const scenes = {
    // AriaScenes,
    AscheScenes,
    AscheSexScenes,
    AscheTasksScenes,
    CassidyScenes,
    CassidySexScenes,
    DreamsScenes,
    FeraScenes,
    HalloweenScenes,
    Intro,
    KiakaiScenes,
    KiakaiSexScenes,
    MasturbationScenes,
    MeditationScenes,
    MirandaScenes,
    MomoScenes,
    NurseryScenes,
    PoetScenes,
    PortalOpeningScenes,
    RavenMotherScenes,
    RoamingScenes,
    Room69Scenes,
    TerryScenes,
    // Brothel
    BastetScenes,
    FireblossomScenes,
    GryphonsScenes,
    LucilleScenes,
    RoaScenes,
    // Burrows
    LagonDScenes,
    LagonScenes,
    OpheliaScenes,
    VenaRScenes,
    VenaScenes,
    // Farm
    AdrianScenes,
    GwendyScenes,
    LaylaScenes,
    // Highlands
    IslaScenes,
    // Nomads
    CaleScenes,
    CaleSexScenes,
    NCavalcadeScenes,
    ChiefScenes,
    EstevanScenes,
    MagnusScenes,
    PatchworkScenes,
    RosalinScenes,
    // Outlaws
    AquiliusScenes,
    OCavalcadeScenes,
    CvetaDateScenes,
    CvetaScenes,
    DeadDropScenes,
    MariaScenes,
    OutlawsScenes,
    VaughnScenes,
    VaughnTasksScenes,
    // Royals
    GolemScenes,
    JeanneScenes,
    LeiScenes,
    LeiSexScenes,
    LeiTaskScenes,
    TwinsScenes,
    // LOCATIONS
    BurrowsScenes,
    MarketScenes,
    FarmScenesIntro,
    DryadGladeScenes,
    OasisScenes,
    // Rigard
    ArmorShopScenes,
    BrothelScenes,
    NobleScenes,
    ClothShopScenes,
    LBScenes,
    KrawitzScenes,
    MagicShopScenes,
    ShopStreetScenes,
    PlazaScenes,
    RigardScenes,
    OddShopScenes,
    BarnabyScenes,
    WeaponShopScenes,
    // ENEMIES
    EquineScenes,
    FelinesScenes,
    FeralWolfScenes,
    GolScenes,
    LizardsScenes,
    MaliceScoutsScenes,
    MothgirlScenes,
    NagaScenes,
    OrchidScenes,
    LagomorphScenes,
    ScorpionScenes,
    ZebraShamanScenes,
};

export function SCENES() {
    return scenes;
}
