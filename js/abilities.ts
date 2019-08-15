import { AttackAb } from "./ability/attack";
import { BlackAb } from "./ability/black";
import { EnemySkillAb } from "./ability/enemyskill";
import { PhysicalAb } from "./ability/physical";
import { RunAb } from "./ability/run";
import { SeductionAb } from "./ability/seduction";
import { WaitAb } from "./ability/wait";
import { WhiteAb } from "./ability/white";

const Abilities = {
    Attack : AttackAb,
    Run : RunAb,
    Wait : WaitAb,

    Black : BlackAb,
    White : WhiteAb,
    EnemySkill : EnemySkillAb,
    Physical : PhysicalAb,
    Seduction : SeductionAb,
};

export { Abilities };
