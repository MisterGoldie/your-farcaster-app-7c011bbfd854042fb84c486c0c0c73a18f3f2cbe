import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_JFS_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE
    },
    frame: {
      version: "vNext",
      name: "POD Play Tic-Tac-Toe",
      homeUrl: `${process.env.NEXT_PUBLIC_URL}`,
      iconUrl: `${process.env.NEXT_PUBLIC_URL}/icon.png`,
      splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
      splashBackgroundColor: "#9333ea"
    },
    triggers: [
      {
        type: 'cast',
        id: 'play-game',
        url: `${process.env.NEXT_PUBLIC_URL}/api/frame`,
        name: 'Play Tic-Tac-Toe'
      },
      {
        type: 'composer',
        id: 'share-game',
        url: `${process.env.NEXT_PUBLIC_URL}/api/composer`,
        name: 'Share Game'
      }
    ]
  }

  return NextResponse.json(manifest)
} 
//