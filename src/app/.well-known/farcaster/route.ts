import { NextResponse } from 'next/server'
import type { FarcasterManifest } from '../../../types/farcaster'

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
      homeUrl: "https://v2frametest.vercel.app/howtoplay",
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