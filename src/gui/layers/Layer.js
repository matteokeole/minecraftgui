import {Instance, TEXTURE_PATH, GUI, Color, BackgroundLayer} from "../../index.js";
import {log} from "../../utils/index.js";

/**
 * Layer constructor.
 * 
 * @constructor
 * @param	{string}	name							Layer name (must be unique)
 * @param	{array}		[size=[GUI.width, GUI.height]]	Width & height
 * @param	{boolean}	[visible=true]					Visibility state
 * @param	{number}	[z=1]							Z-index (the farther, the nearest)
 * @param	{boolean}	[background=false]				Indicates whether the layer has a background pattern preset
 * @param	{array}		[components=[]]					Component list (can be managed later with add())
 */
export function Layer({name, size = [GUI.width, GUI.height], visible = true, z = 1, background = false, components = []}) {
	if (!name) return log("system.error.untitled_layer");

	let [width, height] = size;

	Object.assign(this, {name, width, height, visible, z, background});

	this.components = new Set();

	const canvas = document.createElement("canvas");
	name && (canvas.classList.add(name));
	canvas.width = Instance.data.gui.max_width;
	canvas.height = Instance.data.gui.max_height;
	Object.assign(canvas.style, {
		opacity: +this.visible,
		zIndex: this.z,
	});

	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	ctx.setTransform(GUI.scale, 0, 0, GUI.scale, 0, 0);

	Object.assign(this, {canvas, ctx});

	/**
	 * Toggles the canvas element.
	 * 
	 * @param	{number}	[duration=0]	Duration value (ms)
	 * @param	{number}	[delay=0]		Delay value (ms)
	 * @returns	{self}
	 */
	this.toggle = (duration = 0, delay = 0) => {
		this.visible = !this.visible;

		Object.assign(this.canvas.style, {
			"opacity":				+this.visible,
			"pointer-events":		pointerEvents[+this.visible],
			"transition-delay":		`${delay}ms`,
			"transition-duration":	`${duration}ms`,
		});

		return this;
	};

	this.stretch = (width = GUI.width, height = GUI.height) => {
		Object.assign(this, {width, height});

		return this;
	};

	this.add = (...components) => {
		for (const component of components) {
			this.components.add(component);
			component.layer = this;
		}

		return this;
	};

	this.remove = (...components) => {
		for (const component of components) {
			this.components.delete(component);
			component.layer = null;
		}

		return this;
	};

	/**
	 * Returns the component with the given name.
	 * NOTE: Please choose unique names for each of your components.
	 * 
	 * @param	{string}	name
	 * @returns	{Component}
	 */
	this.get = name => [...this.components].find(c => c.name === name);

	this.compute = () => {
		for (const component of this.components) {
			component.visible && component.compute();
		}

		return this;
	};

	this.erase = () => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this;
	};

	this.draw = () => {
		// if (this.background) BackgroundLayer.show();

		const {ctx} = this;

		for (const component of this.components) {
			component.visible && component.draw(ctx);
		}

		return this;
	};

	this.redraw = () => this.erase().draw();

	GUI.layers[this.name] = this;
	this.add(...components);
	document.body.appendChild(this.canvas);
};

let pointerEvents = ["none", "auto"];