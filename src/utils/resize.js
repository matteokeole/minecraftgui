import {GUI} from "../index.js";

/**
 * Stretches the layers to the GUI size and scales them.
 */
export function resize() {
	GUI.width = Math.ceil(innerWidth / 2) * 2;
	GUI.height = Math.ceil(innerHeight / 2) * 2;
	GUI.scale = GUI.preferredScale;

	// Calculate the new scale
	let i = GUI.preferredScale + 2;
	while (--i > 1) {
		if (
			GUI.width <= GUI.defaultWidth * i ||
			GUI.height < GUI.defaultHeight * i
		) GUI.scale = i - 1;
	}
	i = undefined;

	for (const layer of GUI.layers) {
		layer.ctx.setTransform(GUI.scale, 0, 0, GUI.scale, 0, 0);
		layer.stretch();
	}
};