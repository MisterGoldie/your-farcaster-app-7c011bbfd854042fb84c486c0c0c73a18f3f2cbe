import { NextRequest } from 'next/server'
import { validateWithNeynar } from '@/app/helpers/frames'

export async function GET(req: NextRequest) {
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>POD Play</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/game-preview.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="Play POD Play" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
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
  try {
    const body = await req.json()
    const { trustedData } = body
    
    const validationResult = await validateWithNeynar(trustedData.messageBytes)
    if (!validationResult.valid) {
      return new Response('Invalid frame message', { status: 400 })
    }

    const { fid } = validationResult.action.interactor

    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>POD Play</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/game-board.png" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content=" Launch Game" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL}/howtoplay" />
        </head>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  } catch (error) {
    console.error('Error in POST handler:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 