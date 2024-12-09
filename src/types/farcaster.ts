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

export interface FrameContext {
  user?: {
    username: string;
    // Add other user properties as needed
  };
  // Add other context properties as needed
} 