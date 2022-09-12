export const getAvailableLibrariesForStandard = (standard) => {
	return libraries[standard];
};

export const selectLibrariesForStandard = (
	standard: string,
	selectedLibraries: [string]
) => {
	for (const library of libraries[standard]) {
		if (selectedLibraries.includes(library.value)) {
			library.selected = true;
		} else {
			library.selected = false;
		}
	}
};

const libraries = {
	ERC721: [
		{
			title: "Burnable",
			value: "isBurnable",
		},
		{
			title: "Pausable",
			value: "isPausable",
		},
		{
			title: "Votes",
			value: "isVotes",
		},
		{
			title: "Ownable",
			value: "isOwnable",
		},
		{
			title: "Roles",
			value: "isRoles",
		},
		{
			title: "Auto Increment",
			value: "isAutoIncrement",
		},
		{
			title: "Enumerable",
			value: "isEnumerable",
		},
		{
			title: "URIStorage",
			value: "isURIStorage",
		},
	],
};
