const modulesToComponentDictionary = {
	nftGallery: {
		moduleComponents: ["nftGallery", "nftCard"],
		hooks: [],
    },
    nftCard: {
        moduleComponents:["nftCard"]
    },
	nftDetailsPopUp: {
		moduleComponents: ["nftDetailsPopUp"],
		hooks: ["useComponentVisible"],
	},
};
export default modulesToComponentDictionary