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
      header: "eyJmaWQiOjc0NzIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgzRjE2ODZlNEI1Yjg2NjdEQzY1RTMzQzMxZDVBYTg2NzcxNzhGZDRBIn0",
      payload: "eyJkb21haW4iOiJ2MmZyYW1ldGVzdC52ZXJjZWwuYXBwIn0",
      signature: "MHhlM2MxZmVlMjcxYTY4YWNjYTI3NzM2ZGExNGJkN2YyMWQ5NDJiMzc3NjU1Mzk5NTU2Y2ZmNWFmMmMxODBlMGE4MWU2ZmVkMTMyNzljZmIyNDA2OTI5ODJjMzRlNWQ5MmE5NGM1NjRjYzVjODlmMTQ3Y2Y3ZTQxYWY0MGJmOWQ3YjFi"
    },
    frame: {
      version: "vNext",
      name: "POD Play Tic-Tac-Toe",
      homeUrl: "https://v2frametest.vercel.app",
      iconUrl: "https://v2frametest.vercel.app/icon.png",
      splashImageUrl: "https://v2frametest.vercel.app/splash.png",
      splashBackgroundColor: "#9333ea",
      webhookUrl: "https://v2frametest.vercel.app/api/frame"
    },
    triggers: [
      {
        type: "cast",
        id: "play-game",
        url: "https://v2frametest.vercel.app/api/frame",
        name: "Play Tic-Tac-Toe"
      }
    ]
  }

  return NextResponse.json(manifest)
} 