# Fall of Eden
Fall of Eden (FoE) is currently in alpha stage.

## Building
To build the game, you need [Node.js](https://nodejs.org).

After you have installed nodejs, you are now ready to build and run the game by running the following commands at the root of the project:

	$ npm install
	$ npm run start

This will start a development webserver at localhost:8080, just open that address in a web browser and you are good to go.

If you want the output in archive form (both as the raw files and zipped), you can instead run:

	$ npm run build

This generates a set of files in the dist/ folder.

## Starting
You can run the game by opening the file `foe.html` in your web browser, either from the dist/ folder or by opening http://localhost:8080/foe.html if you are running the dev server.
