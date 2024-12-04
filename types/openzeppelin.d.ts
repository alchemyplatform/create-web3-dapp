declare module '@openzeppelin/wizard' {
    export interface CommonOptions {
        name: string;
        symbol?: string;
        access?: 'ownable' | 'roles' | 'none';
        upgradeable?: boolean;
        info?: boolean;
    }

    export interface ERC20PrintOptions extends CommonOptions {
        burnable?: boolean;
        snapshots?: boolean;
        pausable?: boolean;
        premint?: string;
        mintable?: boolean;
        permit?: boolean;
        votes?: boolean;
        flashmint?: boolean;
    }

    export interface ERC721PrintOptions extends CommonOptions {
        baseUri?: string;
        enumerable?: boolean;
        uriStorage?: boolean;
        burnable?: boolean;
        pausable?: boolean;
        mintable?: boolean;
        incremental?: boolean;
        votes?: boolean;
    }

    export interface ERC1155PrintOptions extends CommonOptions {
        uri: string;
        burnable?: boolean;
        pausable?: boolean;
        mintable?: boolean;
        supply?: boolean;
        updatableUri?: boolean;
    }

    export const erc20: {
        print: (options: ERC20PrintOptions) => string;
    };

    export const erc721: {
        print: (options: ERC721PrintOptions) => string;
    };

    export const erc1155: {
        print: (options: ERC1155PrintOptions) => string;
    };
}

declare module '@openzeppelin/wizard/dist/common-options' {
    export * from '@openzeppelin/wizard';
} 