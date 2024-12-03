import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  const buttonId = searchParams.get('buttonId')

  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>POD Play Tic-Tac-Toe</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://your-domain.com/game-preview.png" />
        <meta property="fc:frame:button:1" content="Start Game" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="og:image" content="https://your-domain.com/game-preview.png" />
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

  let nextImage = 'https://your-domain.com/game-board.png'
  let nextButtons = ['Play Again', 'Share Score']

  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>POD Play Tic-Tac-Toe</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${nextImage}" />
        <meta property="fc:frame:button:1" content="${nextButtons[0]}" />
        <meta property="fc:frame:button:2" content="${nextButtons[1]}" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:2:action" content="post" />
      </head>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
} 