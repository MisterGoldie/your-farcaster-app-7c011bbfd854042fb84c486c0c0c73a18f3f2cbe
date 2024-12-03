import { NextRequest } from 'next/server'
import { validateWithNeynar } from '@/app/helpers/frames'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { trustedData } = body
    
    const validationResult = await validateWithNeynar(trustedData.messageBytes)
    if (!validationResult.valid) {
      return new Response('Invalid frame message', { status: 400 })
    }

    const frameConfig = {
      version: 'vNext',
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/menu-board.png`,
        aspectRatio: '3:4'
      },
      buttons: [
        {
          label: "Select Game",
          action: "post",
          target: `${process.env.NEXT_PUBLIC_URL}/api/frame`
        }
      ]
    }

    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>POD Play</title>
          <meta property="fc:frame" content="${JSON.stringify(frameConfig)}" />
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