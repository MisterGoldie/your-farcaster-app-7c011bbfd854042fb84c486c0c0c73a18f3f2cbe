declare global {
  interface Window {
    sdk: {
      context: {
        location: {
          type: 'embed' | 'notification';
          cast?: {
            fid: number;
            hash: string;
            text: string;
            embeds: string[];
            mentions: Array<{
              fid: number;
              username: string;
            }>;
          };
          notification?: {
            title: string;
            body: string;
            id: string;
          };
        };
        user: {
          fid: number;
          username?: string;
          displayName?: string;
          pfp?: string;
          bio?: string;
          location?: {
            placeId: string;
            description: string;
          };
          custodyAddress: string;
          verifiedAddresses: {
            ethereum: string[];
            solana: string[];
          };
          connectedAccounts: Array<{
            platform: string;
            username: string;
          }>;
        };
      };
      events: {
        on: (event: string, callback: () => void) => void;
        off: (event: string, callback: () => void) => void;
      };
      actions: {
        ready: () => Promise<void>;
        setPrimaryButton: (options: {
          text: string;
          enabled: boolean;
        }) => Promise<void>;
        openUrl: (options: {
          url: string;
          close?: boolean;
        }) => Promise<void>;
        close: (options?: {
          toast?: {
            message: string;
          };
        }) => Promise<void>;
      };
    };
  }
}

export {}; 