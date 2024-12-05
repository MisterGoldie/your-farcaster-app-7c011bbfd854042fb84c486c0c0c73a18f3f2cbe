import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const frameEmbed = {
    version: "next",
    imageUrl: `${process.env.NEXT_PUBLIC_URL}/game-board.png`,
    button: {
      title: "Play POD Play",
      action: {
        type: "launch_frame",
        name: "POD Play",
        url: `${process.env.NEXT_PUBLIC_URL}/api/frame`,
        splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
        splashBackgroundColor: "#9333ea"
      }
    }
  };

  return new Response(
    `<!DOCTYPE html><html><head>
      <meta property="fc:frame" content='${JSON.stringify(frameEmbed)}' />
    </head></html>`,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
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
