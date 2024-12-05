import { NextResponse } from 'next/server'
import type { FarcasterManifest } from '../../../types/farcaster'

type Cast = {
  fid: number;
  hash: string;
  text: string;
  embeds: string[];
  mentions: string[];
};

type CastEmbedLaunchContext = {
  type: 'cast';
  cast: Cast;
};

type NotificationLaunchContext = {
  type: 'notification';
  notification: {
    title: string;
    body: string;
    id: string;
  };
};

type FrameNotificationDetails = {
  url: string;
  token: string;
};

type AddFrameResult = {
  type: 'success';
  notificationDetails?: FrameNotificationDetails;
} | {
  type: 'error';
  errorReason: 'invalid-domain-manifest' | 'rejected-by-user';
};

type LaunchContext = CastEmbedLaunchContext | NotificationLaunchContext;

type User = {
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
  connectedAccounts: {
    platform: string;
    username: string;
  }[];
};

type FrameSDK = {
  context: {
    user: User;
    location: LaunchContext;
  };
  actions: {
    ready: () => Promise<void>;
    openUrl: (options: { url: string; close?: boolean }) => Promise<void>;
    close: (options?: { toast?: { message: string } }) => Promise<void>;
    addFrame: () => Promise<AddFrameResult>;
    requestAuthToken: (options?: { exp?: number }) => Promise<string>;
  };
  wallet: {
    ethProvider: any; // EIP-1193 Ethereum Provider
  };
};

export type {
  Cast,
  CastEmbedLaunchContext,
  NotificationLaunchContext,
  FrameNotificationDetails,
  AddFrameResult,
  LaunchContext,
  User,
  FrameSDK
};

declare global {
  interface Window {
    sdk: FrameSDK;
  }
}

export async function GET() {
  const manifest: FarcasterManifest = {
    accountAssociation: {
      header: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      payload: "eyJkb21haW4iOiJwb2RwbGF5djIudmVyY2VsLmFwcCJ9",
      signature: "MHhlM2MxZmVlMjcxYTY4YWNjYTI3NzM2ZGExNGJkN2YyMWQ5NDJiMzc3NjU1Mzk5NTU2Y2ZmNWFmMmMxODBlMGE4MWU2ZmVkMTMyNzljZmIyNDA2OTI5ODJjMzRlNWQ5MmE5NGM1NjRjYzVjODlmMTQ3Y2Y3ZTQxYWY0MGJmOWQ3YjFi"
    },
    frame: {
      version: "0.0.0",
      name: "POD Play Tic-Tac-Toe",
      homeUrl: "https://podplayv2.vercel.app",
      iconUrl: "https://podplayv2.vercel.app/icon.png",
      splashImageUrl: "https://podplayv2.vercel.app/splash.png",
      splashBackgroundColor: "#9333ea",
      webhookUrl: "https://podplayv2.vercel.app/api/frame"
    },
    triggers: [
      {
        type: "cast",
        id: "play-game",
        url: "https://podplayv2.vercel.app/api/frame",
        name: "Play Tic-Tac-Toe"
      }
    ]
  }

  return NextResponse.json(manifest)
} 
//