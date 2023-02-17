export const generateERC721Template = (smartContractInfo, superClasses) => {
	return `contract ${smartContractInfo.name} ${
		superClasses.length ? "is" : ""
	} ${superClasses.join(", ")} {
    ${
		smartContractInfo.isAutoIncrement
			? `using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;`
			: ""
	}

    ${
		smartContractInfo.isRoles
			? `bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
        bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");`
			: ""
	}
   

    constructor()ERC721("${smartContractInfo.name}","${
		smartContractInfo.symbol
	}")${
		smartContractInfo.isVotes
			? `EIP712("${smartContractInfo.name}", "1")`
			: ""
	}{
        ${
			smartContractInfo.isRoles
				? `_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);`
				: ""
		}
    }

    ${
		smartContractInfo.isPausable
			? `function pause() public ${
					smartContractInfo.isRoles ? `onlyRole(PAUSER_ROLE)` : ""
			  } ${smartContractInfo.isOwnable ? `onlyOwner` : ""} {
        _pause();
    }

    function unpause() public ${
		smartContractInfo.isRoles ? `onlyRole(PAUSER_ROLE)` : ""
	} ${smartContractInfo.isOwnable ? `onlyOwner` : ""} {
        _unpause();
    }`
			: ""
	} 

    ${
		smartContractInfo.isMintable
			? `function safeMint(address to${
					smartContractInfo.isURIStorage ? ", string memory uri" : ""
			  }) public ${
					smartContractInfo.isRoles ? `onlyRole(PAUSER_ROLE)` : ""
			  } ${smartContractInfo.isOwnable ? `onlyOwner` : ""} {
            ${
				smartContractInfo.isAutoIncrement
					? `uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();`
					: ""
			}
            
            _safeMint(to, tokenId);
            ${
				smartContractInfo.isURIStorage
					? `_setTokenURI(tokenId, uri);`
					: ""
			}
        }`
			: ""
	}
   

    ${
		smartContractInfo.isPausable || smartContractInfo.isEnumerable
			? `function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        ${smartContractInfo.isPausable ? `whenNotPaused` : ""}
        override(ERC721 ${
			smartContractInfo.isEnumerable ? `,ERC721Enumerable` : ""
		})
    {
            super._beforeTokenTransfer(from, to, tokenId, batchSize);
        }`
			: ""
	}

    ${
		smartContractInfo.isVotes
			? `function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Votes)
    {
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }`
			: ""
	}
    
    ${
		smartContractInfo.isBurnable || smartContractInfo.isURIStorage
			? `function _burn(uint256 tokenId) internal override(ERC721 ${
					smartContractInfo.isURIStorage ? ", ERC721URIStorage" : ""
			  }) {
        super._burn(tokenId);
    }`
			: ""
	}
   
    ${
		smartContractInfo.isURIStorage
			? `function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
{
    return super.tokenURI(tokenId);
} 
`
			: ""
	}

    ${
		smartContractInfo.isEnumerable || smartContractInfo.isOwnable
			? `function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721 ${
		smartContractInfo.isEnumerable ? `, ERC721Enumerable` : ""
	} ${smartContractInfo.isRoles ? `, AccessControl` : ""})
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}`
			: ""
	}
    
   
}`.trim();
};
