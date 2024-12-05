import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return new Response(
    `<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/frame/render?state=menu" />
      <meta property="fc:frame:button:1" content="Start Game" />
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
  
  return new Response(
    `<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/frame/render?state=game" />
      <meta property="fc:frame:button:1" content="Make Move" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
    </head></html>`,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  )
}
