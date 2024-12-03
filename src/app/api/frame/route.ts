import { NextRequest } from 'next/server'
import { validateWithNeynar } from '@/app/helpers/frames'

export const metadata = {
  other: {
    'fc:frame': JSON.stringify({
      version: 'vNext',
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/game-board.png`,
        aspectRatio: '1.91:1'
      },
      buttons: [
        {
          label: "Play POD Play",
          action: "post",
          target: `${process.env.NEXT_PUBLIC_URL}/api/frame`
        }
      ]
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { trustedData } = body
    
    const validationResult = await validateWithNeynar(trustedData.messageBytes)
    if (!validationResult.valid) {
      return new Response('Invalid frame message', { status: 400 })
    }

    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>POD Play</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/menu-board.png" />
          <meta property="fc:frame:image:aspect_ratio" content="3:4" />
          <meta property="fc:frame:button:1" content="Select Game" />
          <meta property="fc:frame:button:1:action" content="post" />
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