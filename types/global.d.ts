declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ALCHEMY_API_KEY: string;
            PRIVATE_KEY?: string;
            ETHERSCAN_API_KEY?: string;
            ALCHEMY_NETWORK?: string;
            NEXT_PUBLIC_ALCHEMY_NETWORK?: string;
            NEXT_PUBLIC_DEFAULT_CHAIN?: string;
            [key: string]: string | undefined;
        }
    }
}

export {}; 