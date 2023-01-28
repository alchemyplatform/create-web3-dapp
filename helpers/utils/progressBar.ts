import cliProgress from "cli-progress";

export class Multibar {
	private static multiBarContainer = new cliProgress.MultiBar({
		format: ' {bar} | "{file}" | {value}/{total}',
		hideCursor: true,
		barCompleteChar: "\u2588",
		barIncompleteChar: "\u2591",
		clearOnComplete: true,
		stopOnComplete: true,
	});
	private static bars: any = []

	static addBar(max, filename) {
		console.log("adding bar")
		const bar = this.multiBarContainer.create(max, 0, { file: filename });
		this.bars.push(bar);
		return this.bars.length-1;
	}

	static updateBar(id, value, filename?) {
		console.log("updating bar", id)

		this.bars[id].update(value, { filename: filename });
	}
}
