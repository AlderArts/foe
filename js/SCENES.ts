// import { AriaScenes } from "./event/aria";
import { EquineScenes } from "./content/enemy/equine";
import { FelinesScenes } from "./content/enemy/feline";
import { FeralWolfScenes } from "./content/enemy/feralwolf";
import { GolScenes } from "./content/enemy/gol";
import { LizardsScenes } from "./content/enemy/lizard";
import { MaliceScoutsScenes } from "./content/enemy/malice-scouts";
import { MothgirlScenes } from "./content/enemy/mothgirl";
import { NagaScenes } from "./content/enemy/naga";
import { OrchidScenes } from "./content/enemy/orchid-scenes";
import { LagomorphScenes } from "./content/enemy/rabbit-scenes";
import { ScorpionScenes } from "./content/enemy/scorp";
import { ZebraShamanScenes } from "./content/enemy/zebra";
import { BastetScenes } from "./content/event/brothel/bastet";
import { FireblossomScenes } from "./content/event/brothel/fireblossom";
import { GryphonsScenes } from "./content/event/brothel/gryphons";
import { LucilleScenes } from "./content/event/brothel/lucille";
import { RoaScenes } from "./content/event/brothel/roa-scenes";
import { LagonDScenes } from "./content/event/burrows/lagon-defeated";
import { LagonScenes } from "./content/event/burrows/lagon-scenes";
import { OpheliaScenes } from "./content/event/burrows/ophelia-scenes";
import { VenaRScenes } from "./content/event/burrows/vena-restored";
import { VenaScenes } from "./content/event/burrows/vena-scenes";
import { DreamsScenes } from "./content/event/dreams";
import { AdrianScenes } from "./content/event/farm/adrian-scenes";
import { GwendyScenes } from "./content/event/farm/gwendy-scenes";
import { LaylaScenes } from "./content/event/farm/layla-scenes";
import { HalloweenScenes } from "./content/event/halloween";
import { IslaScenes } from "./content/event/highlands/isla";
import { Intro } from "./content/event/introduction";
import { KiakaiScenes } from "./content/event/kiakai-scenes";
import { KiakaiSexScenes } from "./content/event/kiakai-sex";
import { MasturbationScenes } from "./content/event/masturbation";
import { MeditationScenes } from "./content/event/meditation";
import { MomoScenes } from "./content/event/momo";
import { CaleScenes } from "./content/event/nomads/cale-scenes";
import { CaleSexScenes } from "./content/event/nomads/cale-sex";
import { NCavalcadeScenes } from "./content/event/nomads/cavalcade";
import { ChiefScenes } from "./content/event/nomads/chief";
import { EstevanScenes } from "./content/event/nomads/estevan";
import { MagnusScenes } from "./content/event/nomads/magnus";
import { PatchworkScenes } from "./content/event/nomads/patchwork";
import { RosalinScenes } from "./content/event/nomads/rosalin";
import { NurseryScenes } from "./content/event/nursery";
import { AquiliusScenes } from "./content/event/outlaws/aquilius";
import { OCavalcadeScenes } from "./content/event/outlaws/cavalcade";
import { CvetaDateScenes } from "./content/event/outlaws/cveta-date";
import { CvetaScenes } from "./content/event/outlaws/cveta-scenes";
import { DeadDropScenes } from "./content/event/outlaws/maria-dd";
import { MariaScenes } from "./content/event/outlaws/maria-scenes";
import { OutlawsScenes } from "./content/event/outlaws/outlaws";
import { VaughnScenes } from "./content/event/outlaws/vaughn-scenes";
import { VaughnTasksScenes } from "./content/event/outlaws/vaughn-tasks";
import { PoetScenes } from "./content/event/poet";
import { PortalOpeningScenes } from "./content/event/portalopening";
import { RavenMotherScenes } from "./content/event/raven";
import { AscheScenes } from "./content/event/rigard/asche-scenes";
import { AscheSexScenes } from "./content/event/rigard/asche-sex";
import { AscheTasksScenes } from "./content/event/rigard/asche-tasks";
import { CassidyScenes } from "./content/event/rigard/cassidy-scenes";
import { CassidySexScenes } from "./content/event/rigard/cassidy-sex";
import { FeraScenes } from "./content/event/rigard/fera";
import { MirandaScenes } from "./content/event/rigard/miranda-scenes";
import { Room69Scenes } from "./content/event/rigard/room69";
import { RoamingScenes } from "./content/event/roaming";
import { GolemScenes } from "./content/event/royals/golem";
import { JeanneScenes } from "./content/event/royals/jeanne-scenes";
import { LeiScenes } from "./content/event/royals/lei-scenes";
import { LeiSexScenes } from "./content/event/royals/lei-sex";
import { LeiTaskScenes } from "./content/event/royals/lei-tasks";
import { TwinsScenes } from "./content/event/royals/twins-scenes";
import { TerryScenes } from "./content/event/terry-scenes";
import { BurrowsScenes } from "./content/loc/burrows-scenes";
import { MarketScenes } from "./content/loc/farm-market";
import { FarmScenesIntro } from "./content/loc/farm-scenes";
import { DryadGladeScenes } from "./content/loc/glade";
import { OasisScenes } from "./content/loc/oasis";
import { ArmorShopScenes } from "./content/loc/rigard/armorshop";
import { BrothelScenes } from "./content/loc/rigard/brothel";
import { NobleScenes } from "./content/loc/rigard/castle";
import { ClothShopScenes } from "./content/loc/rigard/clothstore";
import { LBScenes } from "./content/loc/rigard/inn";
import { KrawitzScenes } from "./content/loc/rigard/krawitz";
import { MagicShopScenes } from "./content/loc/rigard/magicshop";
import { ShopStreetScenes } from "./content/loc/rigard/merchants";
import { PlazaScenes } from "./content/loc/rigard/plaza";
import { RigardScenes } from "./content/loc/rigard/rigard-scenes";
import { OddShopScenes } from "./content/loc/rigard/sexstore";
import { BarnabyScenes } from "./content/loc/rigard/tavern";
import { WeaponShopScenes } from "./content/loc/rigard/weaponshop";

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
