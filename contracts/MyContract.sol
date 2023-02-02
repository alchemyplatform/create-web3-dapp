//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyContract is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    
   

    constructor()ERC721("MyContract","MYC"){
        
    }

     

    function safeMint(address to) public   {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            
            _safeMint(to, tokenId);
            
        }
   

    

    
    
    
   
    

    
    
   
}
    