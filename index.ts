import * as _ from 'lodash';
import * as lzstring from 'lz-string';

// Assets
import './js/vendor/kimberley_bl_900.min.font.js';

import './assets/css/style.css';
import './assets/css/output.css';
import './assets/css/droid-sans.css';

// Javascript
import './app.js';
import './js/assets.js';

import './js/utility.js';
import './js/text.js';
import './js/button.js';
import './js/gui.js';

import './js/saver.js';

// Entity scripts
import './js/statuseffect.js';

import './js/pregnancy.js';
import './js/lactation.js';

import './js/body/color.js';
import './js/body/race.js';
import './js/body/bodypart.js';
import './js/body/appendage.js';
import './js/body/balls.js';
import './js/body/breasts.js';
import './js/body/orifice.js';
import './js/body/butt.js';
import './js/body/cock.js';
import './js/body/vagina.js';
import './js/body/hair.js';
import './js/body/head.js';
import './js/body/genitalia.js';
import './js/body/body.js';

import './js/entity.js';
import './js/entity-combat.js';
import './js/entity-desc.js';
import './js/entity-grammar.js';
import './js/entity-menu.js';
import './js/entity-save.js';
import './js/entity-sex.js';
import './js/entity-dict.js';

import './js/event/player.js';
import './js/perks.js';

// Combat
import './js/combat.js';
import './js/enemy/boss.js';

// World description
import './js/world.js';
import './js/exploration.js';

// Abilities
import './js/ability/node.js';
import './js/ability/attack.js';
import './js/ability/physical.js';
import './js/ability/seduction.js';
import './js/ability/wait.js';
import './js/ability/run.js';
import './js/ability/white.js';
import './js/ability/black.js';
import './js/ability/enemyskill.js';

// Items
import './js/tf.js';
import './js/items/quest.js';
import './js/items/ingredients.js';
import './js/items/alchemy.js';
import './js/items/alchemyspecial.js';
import './js/items/toys.js';
import './js/items/cards.js';
import './js/items/accessories.js';
import './js/items/armor.js';
import './js/items/strapon.js';
import './js/items/weapons.js';

import './js/items/halloween.js';

import './js/alchemy.js';
import './js/quest.js';
import './js/cavalcade.js';

// Locations and events
import './js/event/introduction.js';

import './js/loc/rigard/rigard.js';
import './js/loc/rigard/residential.js';
import './js/loc/rigard/guards.js';
import './js/loc/rigard/merchants.js';
import './js/loc/rigard/plaza.js';
import './js/loc/rigard/slums.js';
import './js/loc/rigard/tavern.js';
import './js/loc/rigard/brothel.js';
import './js/loc/rigard/krawitz.js';
import './js/loc/rigard/castle.js';
import './js/loc/rigard/clothstore.js';
import './js/loc/rigard/sexstore.js';
import './js/loc/rigard/magicshop.js';
import './js/loc/rigard/armorshop.js';
import './js/loc/rigard/weaponshop.js';
import './js/loc/rigard/inn.js';
import './js/loc/rigard/magetower.js';

import './js/loc/treecity/treecity.js';

import './js/loc/plains.js';
import './js/loc/nomads.js';
import './js/loc/highlands.js';
import './js/loc/dragonden.js';
import './js/loc/forest.js';
import './js/loc/desert.js';
import './js/loc/farm.js';
import './js/loc/lake.js';
import './js/loc/kingsroad.js';

import './js/loc/oasis.js';

import './js/loc/outlaws.js';
import './js/loc/glade.js';

import './js/loc/burrows.js';

import './js/event/global.js';
import './js/event/dreams.js';
import './js/event/nursery.js';
import './js/event/masturbation.js';
import './js/event/meditation.js';

// Characters
import './js/event/asche.js';
import './js/event/asche-tasks.js';
import './js/event/asche-sex.js';
import './js/event/cassidy.js';
import './js/event/cassidy-sex.js';
import './js/event/fera.js';
import './js/event/miranda.js';
import './js/event/terry.js';
import './js/event/momo.js';
import './js/event/sylistraxia.js';
import './js/event/kiakai.js';
import './js/event/kiakai-sex.js';
import './js/event/zina.js';

import './js/event/brothel/roa.js';
import './js/event/brothel/ches.js';
import './js/event/brothel/lucille.js';
import './js/event/brothel/belinda.js';
import './js/event/brothel/bastet.js';
import './js/event/brothel/gryphons.js';
import './js/event/brothel/fireblossom.js';

import './js/event/burrows/lagon.js';
import './js/event/burrows/lagon-defeated.js';
import './js/event/burrows/ophelia.js';
import './js/event/burrows/vena.js';
import './js/event/burrows/vena-restored.js';

import './js/event/farm/gwendy.js';
import './js/event/farm/adrian.js';
import './js/event/farm/danie.js';
import './js/event/farm/layla.js';

import './js/event/highlands/isla.js';

import './js/event/uru.js';
import './js/event/aria.js';

import './js/event/royals/lei.js';
import './js/event/royals/lei-tasks.js';
import './js/event/royals/lei-sex.js';
import './js/event/royals/twins.js';
import './js/event/royals/jeanne.js';
import './js/event/royals/golem.js';

import './js/event/room69.js';
import './js/event/poet.js';

import './js/event/nomads/chief.js';
import './js/event/nomads/patchwork.js';
import './js/event/nomads/rosalin.js';
import './js/event/nomads/estevan.js';
import './js/event/nomads/cale.js';
import './js/event/nomads/magnus.js';
import './js/event/nomads/cavalcade.js';

import './js/event/outlaws/outlaws.js';
import './js/event/outlaws/aquilius.js';
import './js/event/outlaws/maria.js';
import './js/event/outlaws/maria-dd.js';
import './js/event/outlaws/cveta.js';
import './js/event/outlaws/cveta-date.js';
import './js/event/outlaws/vaughn.js';
import './js/event/outlaws/vaughn-tasks.js';
import './js/event/outlaws/bulltower.js';
import './js/event/outlaws/cavalcade.js';

import './js/event/raven.js';

import './js/event/roaming.js';
import './js/event/portalopening.js';
import './js/event/citywatch.js';

// Seasonal
import './js/event/halloween.js';

// Enemies
import './js/enemy/bandit.js';
import './js/enemy/knight.js';
import './js/enemy/imp.js';
import './js/enemy/introdemon.js';
import './js/enemy/rabbit.js';
import './js/enemy/equine.js';
import './js/enemy/feline.js';
import './js/enemy/lizard.js';
import './js/enemy/mothgirl.js';
import './js/enemy/feralwolf.js';
import './js/enemy/scorp.js';
import './js/enemy/naga.js';
import './js/enemy/drake.js';
import './js/enemy/zebra.js';

import './js/enemy/orchid.js';
import './js/enemy/gol.js';
import './js/enemy/corishev.js';
import './js/enemy/malice-scouts.js';

// Start up the main text
import './js/main.ts';
import './js/credits.js';
import './js/cheats.js';
