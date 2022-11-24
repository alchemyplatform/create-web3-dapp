import prompts from "prompts";

export default async function checkIfQuit(data: any, message: string | null):Promise<boolean> {
	let quit = false;
	if (data == "quit") {
		await prompts({
			type: "select",
			name: "quit",
			message:  "Are you sure you want to quit?" ,
			choices: [
				{
					title: "Yes",
					value: true,
				},
				{
					title: "No",
					value: false,
				},
			],
			hint: "- Space to select. Return to submit",
		}).then((data) => (quit = data.quit));
	}
	return quit;
}
