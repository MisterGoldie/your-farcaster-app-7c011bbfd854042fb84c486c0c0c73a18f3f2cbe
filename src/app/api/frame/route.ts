import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const frameEmbed = {
    version: 'vNext',
    imageUrl: `${process.env.NEXT_PUBLIC_URL}/game-preview.png`,
    button: {
      title: 'Start Game',
      action: {
        type: 'launch_frame',
        name: 'POD Play',
        url: `${process.env.NEXT_PUBLIC_URL}/api/frame`,
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
      </head>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const { untrustedData } = data
  const { buttonIndex } = untrustedData

  const frameEmbed = {
    version: 'vNext',
    imageUrl: `${process.env.NEXT_PUBLIC_URL}/game-board.png`,
    buttons: [
      {
        title: 'Play Again',
        action: {
          type: 'post',
          url: `${process.env.NEXT_PUBLIC_URL}/api/frame`
        }
      },
      {
        title: 'Share Score',
        action: {
          type: 'post',
          url: `${process.env.NEXT_PUBLIC_URL}/api/frame/share`
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
      </head>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
} 