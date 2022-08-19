import {GUI, Output, Utils, HoverLayer} from "../index.js";

/**
 * Global component.
 * 
 * @constructor
 * @param	{array}		align			Horizontal & vertical alignment
 * @param	{array}		[margin=[0, 0]]	X & Y offset relative to the window side
 * @param	{boolean}	[visible=true]	Visibility state
 */
export function Component({align, margin = [0, 0], visible = true}) {
	if (!align) return console.error(Output.needAlignment);

	Object.assign(this, {align, margin, visible});

	/**
	 * Calculates the absolute component position from its alignment and its margin.
	 */
	this.computePosition = () => {
		if (!this.layer) return console.error(Output.cantComputeUnlayeredComponent);

		let [horizontal, vertical] = this.align,
			[x, y] = this.margin,
			w = this.layer.width / GUI.scale - this.size[0],
			h = this.layer.height / GUI.scale - this.size[1];

		if (horizontal === "right") x = w - x;
		else if (horizontal === "center") x += w / 2;

		if (vertical === "bottom") y = h - y;
		else if (vertical === "center") y += h / 2;

		Object.assign(this, {x, y});
	};

	this.on = (event, callback) => {
		const {layer} = this;

		if (!layer) return console.error(Output.eventOnUnlayeredComponent);

		switch (event) {
			case "hover":
				event = "mousemove";

				break;
			case "click":
				event = "mousedown";

				break;
		}

		layer.canvas.addEventListener(event, e => {
			const
				{ctx} = HoverLayer,
				{scale} = GUI,
				{x, y} = this,
				[w, h] = this.size;
			let hovered = Utils.intersect([e.x, e.y], [x * scale, y * scale, (x + w) * scale, (y + h) * scale]);
			
			if (this.hovered !== hovered) {
				this.hovered = hovered;

				this.hover(ctx);
			}
		});
	};
};