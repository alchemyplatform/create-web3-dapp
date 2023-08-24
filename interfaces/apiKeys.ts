export interface APIKeys {
  ALCHEMY_API_KEY: string;
  PROJECT_ID?: string; // Add PROJECT_ID property	
  PRIVATE_KEY?: string | null;
  ETHERSCAN_API_KEY?: string | null;
  ALCHEMY_NETWORK?: string | null;
  NEXT_PUBLIC_ALCHEMY_NETWORK?: string | null;
  NEXT_PUBLIC_DEFAULT_CHAIN?: string | null;
  [key: string]: string | null | undefined;
}
