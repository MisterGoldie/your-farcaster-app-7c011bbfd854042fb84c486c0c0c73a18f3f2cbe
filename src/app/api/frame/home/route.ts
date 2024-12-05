import { NextRequest, NextResponse } from 'next/server'
import { validateWithNeynar, createFrame } from '@/app/helpers/frames'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trustedData } = body
    
    const validationResult = await validateWithNeynar(trustedData.messageBytes)
    if (!validationResult.valid) {
      return NextResponse.json({ message: "Invalid frame message" }, { status: 400 })
    }

    const { fid } = validationResult.action.interactor
    const generatedImage = `${process.env.NEXT_PUBLIC_URL}/api/frame/services/imggen?fid=${fid}`

    return new Response(
      `<!DOCTYPE html><html><head>
        <meta name="fc:frame" content='${JSON.stringify({
          version: 'next',
          imageUrl: generatedImage,
          button: {
            title: "Play Game",
            action: {
              type: "launch_frame",
              name: "POD Play",
              url: `${process.env.NEXT_PUBLIC_URL}/api/frame`,
              splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
              splashBackgroundColor: "#9333ea"
            }
          }
        })}' />
      </head></html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  } catch (error) {
    console.error('[home route.ts] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

