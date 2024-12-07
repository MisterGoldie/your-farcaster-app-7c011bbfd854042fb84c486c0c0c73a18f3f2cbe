import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return new Response(
    `<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/menu-board.png" />
      <meta property="fc:frame:button:1" content="Play Game" />
      <meta property="fc:frame:button:2" content="How to Play" />
      <meta property="fc:frame:button:3" content="View Leaderboard" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame/action" />
    </head></html>`,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  )
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { untrustedData } = body
  const buttonIndex = untrustedData?.buttonIndex || 1

  switch (buttonIndex) {
    case 1: // Play Game
      return new Response(
        `<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/character-select.png" />
          <meta property="fc:frame:button:1" content="Play as Chili" />
          <meta property="fc:frame:button:2" content="Play as ScaryGary" />
          <meta property="fc:frame:button:3" content="Play as POD" />
          <meta property="fc:frame:button:4" content="Back" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame/game" />
        </head></html>`,
        {
          headers: { 'Content-Type': 'text/html' },
        }
      )
    
    case 2: // How to Play
      return new Response(
        `<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/how-to-play.png" />
          <meta property="fc:frame:button:1" content="Back to Menu" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
        </head></html>`,
        {
          headers: { 'Content-Type': 'text/html' },
        }
      )

    case 3: // Leaderboard
      return new Response(
        `<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/leaderboard.png" />
          <meta property="fc:frame:button:1" content="Back to Menu" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
        </head></html>`,
        {
          headers: { 'Content-Type': 'text/html' },
        }
      )
  }
}
