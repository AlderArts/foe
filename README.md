# Fall of Eden
Fall of Eden (FoE) is currently in alpha stage.

## Starting
You can run the game by opening the file `foe.html` in your web browser.

## Building
To build the game, you need [Node.js](https://nodejs.org). Once you have Node.js installed, you need to install gulp-cli globally by running:

	$ npm install -g gulp-cli

You are now ready to build the game by running the following commands at the root of the project:

	$ npm install
	$ gulp build

_Note: The build process only reduces file sizes, it is not required to run the game._

If you want the output in archive form, you can instead run:

	$ gulp pack

This generates a set of files containing the build output in different archive formats. Feel free to choose the format that best suits your needs.
