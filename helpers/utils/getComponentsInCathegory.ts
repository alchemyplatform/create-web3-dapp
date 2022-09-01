import fs from "fs"
import path from "path"

export const getComponentsInCathegory = ( toolkitType: string, ) => {
    return components[toolkitType]
}





const components = {
    nfts: [
        {
            title: "NFTs Gallery",
            value: "nftsGallery"
        },
        {
            title: "NFT Details PopUp",
            value: "nftDetailsPopUp"
        },
        {
            title: "NFT Minting panel",
            value: "nftMintingPanel"
        },
        {
            title: "NFT Transactions Box",
            value: "nftTransactionBox"
        },
        {
            title: "Collection Data Box",
            value: "collectionDataBox"
        },
        {
            title: "Collection Description Panel",
            value: "collectionDescriptionPanel"
        },
    ],
    defi: [
        {
            
        }
    ],
    governance: [
        {

        }
    ],
}
