#!/bin/bash

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js \
	js/jquery-1.9.1.min.js \
	js/raphael-min.js \
	data/cufon/Kimberley_Bl_900.font.js \
	app.js \
	js/assets.js \
	js/utility.js \
	js/input.js \
	js/text.js \
	js/button.js \
	js/gui.js \
	js/gamecache.js \
	js/saver.js \
	js/statuseffect.js \
	js/ability.js \
	js/entity.js \
	js/body.js \
	js/defbody.js \
	js/player.js \
	js/party.js \
	js/effect.js \
	js/combat.js \
	js/enemy/boss.js \
	js/time.js \
	js/event.js \
	js/world.js \
	js/exploration.js \
	js/ability/attack.js \
	js/ability/physical.js \
	js/ability/seduction.js \
	js/ability/tease.js \
	js/ability/wait.js \
	js/ability/run.js \
	js/ability/white.js \
	js/ability/black.js \
	js/ability/enemyskill.js \
	js/job.js \
	js/item.js \
	js/tf.js \
	js/items/ingredients.js \
	js/items/alchemyspecial.js \
	js/items/toys.js \
	js/items/cards.js \
	js/items/accessories.js \
	js/items/armor.js \
	js/items/strapon.js \
	js/items/weapons.js \
	js/shop.js \
	js/alchemy.js \
	js/cavalcade.js \
	js/event/introduction.js \
	js/loc/rigard/rigard.js \
	js/loc/rigard/backstreets.js \
	js/loc/rigard/guards.js \
	js/loc/rigard/merchants.js \
	js/loc/rigard/plaza.js \
	js/loc/rigard/slums.js \
	js/loc/rigard/tavern.js \
	js/loc/rigard/krawitz.js \
	js/loc/rigard/castle.js \
	js/loc/rigard/clothstore.js \
	js/loc/rigard/inn.js \
	js/loc/rigard/magetower.js \
	js/loc/treecity/treecity.js \
	js/loc/plains.js \
	js/loc/highlands.js \
	js/loc/dragonden.js \
	js/loc/forest.js \
	js/loc/desert.js \
	js/loc/farm.js \
	js/loc/burrows.js \
	js/event/dreams.js \
	js/event/fera.js \
	js/event/miranda.js \
	js/event/roa.js \
	js/event/sylistraxia.js \
	js/event/kiakai.js \
	js/event/lagon.js \
	js/event/gwendy.js \
	js/event/adrian.js \
	js/event/danie.js \
	js/event/uru.js \
	js/event/aria.js \
	js/event/lei.js \
	js/event/twins.js \
	js/event/room69.js \
	js/event/chief.js \
	js/event/patchwork.js \
	js/event/rosalin.js \
	js/event/estevan.js \
	js/event/wolfie.js \
	js/event/magnus.js \
	js/event/outlaws/maria.js \
	js/event/jeanne.js \
	js/event/golem.js \
	js/event/raven.js \
	js/enemy/bandit.js \
	js/enemy/imp.js \
	js/enemy/introdemon.js \
	js/enemy/rabbit.js \
	js/enemy/equine.js \
	js/enemy/feline.js \
	js/enemy/lizard.js \
	js/enemy/mothgirl.js \
	js/enemy/feralwolf.js \
	js/enemy/scorp.js \
	js/enemy/drake.js \
	js/main.js \
	js/credits.js \
	js/cheats.js \
	--js_output_file foe.min.js
	
rm -rf build
mkdir build

cp foe.min.js build/foe.js
cp js/excanvas.compiled.js build/excanvas.compiled.js

cp foe_min.html build/foe.html
cp style.css build/style.css
cp download.php build/download.php
cp changelog build/changelog

cp -R data build
