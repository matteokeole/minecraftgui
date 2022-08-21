import {Instance, GUI, Loader, Layer, Component, Color, Font, Utils} from "../src/index.js";
import Config from "./config.js";

const {symbols, colors} = await (await fetch(Config.font)).json();
Object.assign(Font, {symbols, colors});

const settings = await (await fetch("public/settings.json")).json();
await Instance.setup(settings);

Utils.resize();

const loader = new Loader();
await loader.load(...Config.PRIMARY_SOURCES);

let progress = new Component.Progress({
		align: ["center", "bottom"],
		margin: [0, 86],
		length: 536,
	}),
	loadingScreen = new Layer({
		name: "mojang-loading-screen",
		z: 10,
		background: new Color(Config.mojangBackground),
		components: [
			new Component.Image({
				align: ["center", "center"],
				margin: [-128, 0],
				size: [256, 128],
				source: "gui/title/mojangstudios.png",
				scale: 0.5,
			}),
			new Component.Image({
				align: ["center", "center"],
				margin: [128, 0],
				size: [256, 128],
				source: "gui/title/mojangstudios.png",
				uv: [0, 256],
				scale: 0.5,
			}),
			progress,
		],
	});
loadingScreen.compute().draw();

loader.bind(progress);
await loader.load(...Config.SECONDARY_SOURCES);

const
	layers = await loader.loadLayers(Config.gui),
	mainMenu = layers["main-menu"];



// Prepare the main menu before fading out the loading screen
// Set the version number
const version = mainMenu.get("version");
version.text = `${Instance.name} ${Instance.version}`;
version.format();

// Show the main menu while the loading screen is faded out
mainMenu.compute().draw();
loadingScreen.toggle(2000, 500);