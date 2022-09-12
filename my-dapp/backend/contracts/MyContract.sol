
        //SPDX-License-Identifier: MIT
        pragma solidity ^0.8.4;    
        import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
            

        contract MyContract is ERC721 {
    

    
   

    constructor()ERC721("MyContract","MYC"){
        
    }

     

    function safeMint(address to, string memory uri) public   {
            
            
            _safeMint(to, tokenId);
            
        }
   

    

    
    
    
   
    

    
    
   
}
    