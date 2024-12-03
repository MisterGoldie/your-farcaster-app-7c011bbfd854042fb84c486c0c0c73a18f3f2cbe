import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const frameMetadata = {
    version: 'vNext',
    image: `${process.env.NEXT_PUBLIC_URL}/game-preview.png`,
    buttons: [
      {
        label: "Start Game",
        action: "post"
      }
    ],
    postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame`
  }

  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>POD Play Tic-Tac-Toe</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameMetadata.image}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="${frameMetadata.buttons[0].label}" />
        <meta property="fc:frame:button:1:action" content="${frameMetadata.buttons[0].action}" />
        <meta property="fc:frame:post_url" content="${frameMetadata.postUrl}" />
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
  const frameMetadata = {
    buttons: [
      {
        label: "Play Again",
        action: "post"
      }
    ],
    image: `${process.env.NEXT_PUBLIC_URL}/game-board.png`,
    post_url: `${process.env.NEXT_PUBLIC_URL}/api/frame`
  }

  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>POD Play Tic-Tac-Toe</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameMetadata.image}" />
        <meta property="fc:frame:button:1" content="${frameMetadata.buttons[0].label}" />
        <meta property="fc:frame:button:1:action" content="${frameMetadata.buttons[0].action}" />
        <meta property="fc:frame:post_url" content="${frameMetadata.post_url}" />
      </head>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
} 