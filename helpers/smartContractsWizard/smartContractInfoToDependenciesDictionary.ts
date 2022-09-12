
export const smartContractInfoToDependenciesDictionary = {
	isBurnable: {
		ERC721: {
			libraryURL: `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";`,
			extends: "ERC721Burnable",
		},
		ERC20: {
			libraryURL: `import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";`,
			extends: "",
		},
	},
	isPausable: {
		ERC721: {
			libraryURL: `import "@openzeppelin/contracts/security/Pausable.sol";`,
			extends: "Pausable",
		},
		ERC20: {
			libraryURL: `import "@openzeppelin/contracts/security/Pausable.sol";`,
			extends: "",
		},
	},
	isOwnable: {
		ERC721: {
			libraryURL: `import "@openzeppelin/contracts/access/Ownable.sol";`,
			extends: "ERC721",
		},
		ERC20: `import "@openzeppelin/contracts/access/Ownable.sol";`,
	},
	isRoles: {
		ERC721: {
			libraryURL: `import "@openzeppelin/contracts/access/AccessControl.sol";`,
			extends: "AccessControl",
		},
		ERC20: `import "@openzeppelin/contracts/access/AccessControl.sol"`,
	},
	isPermit: {
		ERC20: `import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";`,
	},
	isVotes: {
		ERC721: {
			libraryURL: `import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";\nimport "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";`,
			extends: "ERC721Votes",
		},
	},
	isMintable: {
		ERC721: {
			libraryURL: "",
			extends: "ERC721",
		},
	},
	isFlashMinting: {
		ERC20: `import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";`,
	},
	isSnapshots: {
		ERC20: `import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";`,
	},
	isAutoIncrement: {
		ERC721: {
			libraryURL: `import "@openzeppelin/contracts/utils/Counters.sol";`,
			extends: "ERC721",
		},
	},
	isEnumerable: {
		ERC721: {
			libraryURL: `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";`,
			extends: "ERC721Enumerable",
		},
	},
	isURIStorage: {
		ERC721: {
			libraryURL: `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";`,
			extends: "ERC721URIStorage",
		},
	},
};
