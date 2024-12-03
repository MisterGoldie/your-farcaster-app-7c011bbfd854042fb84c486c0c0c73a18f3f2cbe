import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const frameEmbed = {
    version: 'next',
    imageUrl: `${process.env.NEXT_PUBLIC_URL}/game-preview.png`,
    button: {
      title: 'Start Game',
      action: {
        type: 'launch_frame',
        name: 'POD Play',
        url: `${process.env.NEXT_PUBLIC_URL}/game`,
        splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
        splashBackgroundColor: '#9333ea'
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
      <body>
        <h1>POD Play Tic-Tac-Toe</h1>
        <p>This is a Farcaster Frame game. View it on Warpcast to play!</p>
      </body>
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
    version: 'next',
    imageUrl: `${process.env.NEXT_PUBLIC_URL}/game-board.png`,
    buttons: [
      {
        title: 'Play Again',
        action: {
          type: 'launch_frame',
          url: `${process.env.NEXT_PUBLIC_URL}/game`,
          name: 'POD Play'
        }
      },
      {
        title: 'Share Score',
        action: {
          type: 'link',
          url: `${process.env.NEXT_PUBLIC_URL}/share/${fid}`
        }
      }
    ]
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
      <body>
        <h1>POD Play Tic-Tac-Toe</h1>
        <p>This is a Farcaster Frame game. View it on Warpcast to play!</p>
      </body>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
} 