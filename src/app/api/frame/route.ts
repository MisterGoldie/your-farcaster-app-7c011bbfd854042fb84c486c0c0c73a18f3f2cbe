import { NextRequest } from 'next/server'
import { validateWithNeynar } from '@/app/helpers/frames'

export async function GET() {
  const frameHtml = `
    <div class="h-[100vh] w-full bg-black flex items-center justify-center p-4">
      <div class="w-full max-w-md aspect-[3/4] bg-white rounded-lg p-1">
        <div class="w-full h-full bg-purple-600 rounded-lg overflow-hidden flex flex-col relative">
          <div class="bg-purple-700 py-2">
            <h1 class="text-2xl font-bold text-center text-white" style="font-family: Frijole, cursive; text-shadow: 2px 2px 4px rgba(0,0,0,0.5)">
              Main Menu
            </h1>
          </div>
          <div class="flex-grow flex flex-col items-center justify-center p-4">
            <h2 class="text-xl text-white mb-8">Select Game:</h2>
            <button class="bg-black text-white px-8 py-3 rounded-lg text-lg hover:bg-red-900 transition-colors">
              Tic-Tac-Maxi
            </button>
          </div>
        </div>
      </div>
    </div>
  `

  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>POD Play</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="Select Game" />
        <meta property="fc:frame:button:1:action" content="post" />
        <style>
          ${getStyles()}
        </style>
      </head>
      <body class="bg-black">
        ${frameHtml}
      </body>
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

    const buttonIndex = validationResult.action.tapped.index
    let frameHtml = ''

    // Show difficulty selection after game selection
    frameHtml = `
      <div class="h-[100vh] w-full bg-black flex items-center justify-center p-4">
        <div class="w-full max-w-md aspect-[3/4] bg-white rounded-lg p-1">
          <div class="w-full h-full bg-purple-600 rounded-lg overflow-hidden flex flex-col relative">
            <div class="bg-purple-700 py-2">
              <h1 class="text-2xl font-bold text-center text-white" style="font-family: Frijole, cursive; text-shadow: 2px 2px 4px rgba(0,0,0,0.5)">
                Main Menu
              </h1>
            </div>
            <div class="flex-grow flex flex-col items-center justify-center p-4">
              <h2 class="text-xl text-white mb-8">Select Game:</h2>
              <button class="bg-black text-white px-8 py-3 rounded-lg text-lg hover:bg-red-900 transition-colors">
                Tic-Tac-Maxi
              </button>
            </div>
          </div>
        </div>
      </div>
    `

    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>POD Play</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:button:1" content="Select Game" />
          <meta property="fc:frame:button:1:action" content="post" />
          <style>
            ${getStyles()}
          </style>
        </head>
        <body class="bg-black">
          ${frameHtml}
        </body>
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

function getStyles() {
    throw new Error('Function not implemented.')
}
