type FarcasterManifest = {
  accountAssociation: {
    header: string;
    payload: string;
    signature: string;
  };
  frame: {
    version: string;
    name: string;
    homeUrl: string;
    iconUrl: string;
    splashImageUrl: string;
    splashBackgroundColor: string;
    webhookUrl?: string;
  };
  triggers?: {
    type: 'cast' | 'composer';
    id: string;
    url: string;
    name: string;
  }[];
};

export type { FarcasterManifest }; 