import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const frameEmbed = {
    version: 'vNext',
    imageUrl: `${process.env.NEXT_PUBLIC_URL}/game-preview.png`,
    button: {
      title: 'Start Game',
      action: {
        type: 'post',
        url: `${process.env.NEXT_PUBLIC_URL}/api/frame`
      }
    }
  }

  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>POD Play Tic-Tac-Toe</title>
        <meta property="fc:frame" content="${JSON.stringify(frameEmbed)}" />
        <meta property="og:image" content="${frameEmbed.imageUrl}" />
        <meta property="og:title" content="POD Play Tic-Tac-Toe" />
      </head>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
}

interface FrameRequest {
  untrustedData: {
    buttonIndex: number;
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
  };
  trustedData?: {
    messageBytes: string;
  };
}

export async function POST(req: NextRequest) {
  const data: FrameRequest = await req.json()
  const { untrustedData } = data
  const { buttonIndex, fid } = untrustedData

  const frameEmbed = {
    version: 'vNext',
    imageUrl: `${process.env.NEXT_PUBLIC_URL}/game-board.png`,
    button: {
      title: 'Play Game',
      action: {
        type: 'post',
        url: `${process.env.NEXT_PUBLIC_URL}/api/frame`
      }
    }
  }

  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>POD Play Tic-Tac-Toe</title>
        <meta property="fc:frame" content="${JSON.stringify(frameEmbed)}" />
        <meta property="og:title" content="POD Play Tic-Tac-Toe" />
        <meta property="og:image" content="${frameEmbed.imageUrl}" />
      </head>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
} 