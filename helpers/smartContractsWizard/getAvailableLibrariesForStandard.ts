export const getAvailableLibrariesForStandard = (standard) => {
	return libraries[standard];
};

export const selectLibrariesForStandard = (
	standard: string,
	selectedLibraries: [string]
) => {
	if (selectedLibraries && selectedLibraries.length) {
		for (const library of libraries[standard]) {
			if (selectedLibraries.includes(library.value)) {
				library.selected = true;
			} else {
				library.selected = false;
			}
		}
	}
};

const libraries = {
	ERC721: [
		{
			title: "Burnable",
			value: "isBurnable",
			description: "ERC721 Token that can be burned (destroyed).",
		},
		{
			title: "Pausable",
			value: "isPausable",
			description: "Adds pausable token transfers, minting and burning.",
		},
		{
			title: "Votes",
			value: "isVotes",
			description: "Support voting and delegation",
		},
		{
			title: "Auto Increment",
			value: "isAutoIncrement",
			description: "Adds auto incremint token IDs",
		},
		{
			title: "Enumerable",
			value: "isEnumerable",
			description:
				"Adds enumerability of all the token ids in the contract",
		},
		{
			title: "URIStorage",
			value: "isURIStorage",
			description: "Adds storage based token URI management.",
		},
		{
			title: "Ownable",
			value: "isOwnable",
			description: "Provides a basic access control mechanism",
		},
		{
			title: "Roles",
			value: "isRoles",
			description: "Implements role-based access control ",
		},
	],
	ERC20: [
		{
			title: "Burnable",
			value: "isBurnable",
			description: "ERC721 Token that can be burned (destroyed).",
		},
		{
			title: "Pausable",
			value: "isPausable",
			description: "Adds pausable token transfers, minting and burning.",
		},
		{
			title: "Votes",
			value: "isVotes",
			description: "Support voting and delegation",
		},
		{
			title: "Flash Mint",
			value: "isFlashMint",
			description:
				"Token level support for flash loans through minting and burning of ephemeral tokens",
		},
		{
			title: "Snapshot",
			value: "isEnumerable",
			description:
				"When a snapshot is created, the balances and total supply at the time are recorded for later access.",
		},
		{
			title: "Ownable",
			value: "isOwnable",
			description: "Provides a basic access control mechanism",
		},
		{
			title: "Roles",
			value: "isRoles",
			description: "Implements role-based access control ",
		},
	],
	ERC1155: [
		{
			title: "Burnable",
			value: "isBurnable",
			description: "ERC721 Token that can be burned (destroyed).",
		},
		{
			title: "Pausable",
			value: "isPausable",
			description: "Adds pausable token transfers, minting and burning.",
		},
		{
			title: "Ownable",
			value: "isOwnable",
			description: "Provides a basic access control mechanism",
		},
		{
			title: "Roles",
			value: "isRoles",
			description: "Implements role-based access control ",
		},
		
	],
};
