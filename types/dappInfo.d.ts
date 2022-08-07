
    type dappInfo = {
        chain: string,
        isEVM: boolean,
        isTestnet: boolean,
        testnet?: string,
        useBackend: boolean,
        backendProvider?: string,
        wantsTemplateFiles: boolean,
        apiKeys?:APIKeys,
      }
  
      type APIKeys = { 
        alchemy_api_key?: string
      }
  