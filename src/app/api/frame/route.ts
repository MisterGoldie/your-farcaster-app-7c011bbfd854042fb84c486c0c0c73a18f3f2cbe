import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  // Initial frame with splash screen and buttons
  return new Response(
    `<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/splash.png" />
      <meta property="fc:frame:button:1" content="Play as Chili" />
      <meta property="fc:frame:button:2" content="Play as ScaryGary" />
      <meta property="fc:frame:button:3" content="Play as POD" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
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
  
  // Map button index to piece selection
  const pieces = ['chili', 'scarygary', 'podplaylogo']
  const selectedPiece = pieces[buttonIndex - 1]

  if (buttonIndex <= 3) {
    // Piece selection, show difficulty options
    return new Response(
      `<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/frame/render?state=menu" />
        <meta property="fc:frame:button:1" content="Easy Mode" />
        <meta property="fc:frame:button:2" content="Medium Mode" />
        <meta property="fc:frame:button:3" content="Hard Mode" />
        <meta property="fc:frame:button:4" content="Back" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame/game?piece=${selectedPiece}" />
      </head></html>`,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    )
  } else {
    // Back button, return to main menu
    return new Response(
      `<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/frame/render?state=menu" />
        <meta property="fc:frame:button:1" content="Play as Chili" />
        <meta property="fc:frame:button:2" content="Play as ScaryGary" />
        <meta property="fc:frame:button:3" content="Play as POD" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
      </head></html>`,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }
}
