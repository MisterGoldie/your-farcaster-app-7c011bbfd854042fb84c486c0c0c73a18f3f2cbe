import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_JFS_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE
    },
    frame: {
      version: "0.0.0",
      name: "Your App Name",
      homeUrl: `${process.env.NEXT_PUBLIC_URL}`,
      iconUrl: `${process.env.NEXT_PUBLIC_URL}/icon.png`,
      splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
      splashBackgroundColor: "#ffffff",
      webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/notifications`
    },
    triggers: [
      {
        type: 'cast',
        id: 'default-action',
        url: `${process.env.NEXT_PUBLIC_URL}/api/frame`
      },
      {
        type: 'composer',
        id: 'compose-action',
        url: `${process.env.NEXT_PUBLIC_URL}/api/composer`
      }
    ]
  }

  return NextResponse.json(manifest)
} 
//