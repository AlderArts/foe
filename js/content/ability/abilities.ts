import { AttackAb } from "./attack";
import { BlackAb } from "./black";
import { EnemySkillAb } from "./enemyskill";
import { PhysicalAb } from "./physical";
import { RunAb } from "./run";
import { SeductionAb } from "./seduction";
import { WaitAb } from "./wait";
import { WhiteAb } from "./white";

export const Abilities = {
    Attack : AttackAb,
    Run : RunAb,
    Wait : WaitAb,

    Black : BlackAb,
    White : WhiteAb,
    EnemySkill : EnemySkillAb,
    Physical : PhysicalAb,
    Seduction : SeductionAb,
};
