import { NextRequest, NextResponse } from 'next/server'
import { validateWithNeynar } from '@/app/helpers/frames'

export async function GET(req: NextRequest) {
  const params = new URLSearchParams()
  params.set('state', 'menu')
  
  return new Response(
    `<!DOCTYPE html><html><head>
      <meta name="fc:frame" content='${JSON.stringify({
        version: 'next',
        imageUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame/render?${params.toString()}`,
        button: {
          title: "Start Game",
          action: {
            type: "post",
            url: `${process.env.NEXT_PUBLIC_URL}/api/frame`
          }
        }
      })}' />
    </head></html>`,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { untrustedData, trustedData } = body
    
    // Add validation
    const validationResult = await validateWithNeynar(trustedData.messageBytes)
    if (!validationResult.valid) {
      return NextResponse.json({ message: "Invalid frame message" }, { status: 400 })
    }

    const buttonIndex = untrustedData?.buttonIndex || 1
    const currentState = new URL(req.url).searchParams.get('state') || 'menu'
    const currentDifficulty = new URL(req.url).searchParams.get('difficulty') || ''
    const currentPiece = new URL(req.url).searchParams.get('piece') || ''
    const currentBoard = new URL(req.url).searchParams.get('board') || ''

    let nextState = currentState
    let nextDifficulty = currentDifficulty
    let nextPiece = currentPiece
    let nextBoard = currentBoard

    // Handle state transitions
    switch (currentState) {
      case 'menu':
        nextState = 'difficulty'
        break
      
      case 'difficulty':
        if (buttonIndex <= 3) {
          nextState = 'piece'
          nextDifficulty = ['Easy', 'Medium', 'Hard'][buttonIndex - 1]
        } else if (buttonIndex === 4) {
          nextState = 'menu'
          nextDifficulty = ''
        }
        break
      
      case 'piece':
        if (buttonIndex <= 2) {
          nextState = 'game'
          nextPiece = buttonIndex === 1 ? 'X' : 'O'
          nextBoard = Array(9).fill(null).join(',')
        } else if (buttonIndex === 3) {
          nextState = 'difficulty'
          nextPiece = ''
        }
        break
      
      case 'game':
        if (buttonIndex === 10) {
          nextState = 'menu'
          nextBoard = ''
          nextPiece = ''
          nextDifficulty = ''
        } else if (buttonIndex <= 9) {
          const boardArray = currentBoard.split(',')
          if (!boardArray[buttonIndex - 1]) {
            boardArray[buttonIndex - 1] = currentPiece
            nextBoard = boardArray.join(',')
          }
        }
        break
    }

    // Build frame response based on state
    const stateButtons = {
      menu: [{ text: 'Start Game' }],
      difficulty: [
        { text: 'Easy' },
        { text: 'Medium' },
        { text: 'Hard' },
        { text: 'Back' }
      ],
      piece: [
        { text: 'Play as X' },
        { text: 'Play as O' },
        { text: 'Back' }
      ],
      game: [
        ...Array(9).fill(null).map((_, i) => ({ text: (i + 1).toString() })),
        { text: 'Back to Menu' }
      ]
    } as const

    const buttons = stateButtons[nextState as keyof typeof stateButtons] || stateButtons.menu

    // Build frame URL with state parameters
    const params = new URLSearchParams()
    params.set('state', nextState)
    if (nextDifficulty) params.set('difficulty', nextDifficulty)
    if (nextPiece) params.set('piece', nextPiece)
    if (nextBoard) params.set('board', nextBoard)

    const frameUrl = `${process.env.NEXT_PUBLIC_URL}/api/frame/render?${params.toString()}`
    const postUrl = `${process.env.NEXT_PUBLIC_URL}/api/frame?${params.toString()}`

    return new Response(
      `<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameUrl}" />
        <meta property="fc:frame:button:1" content="Play Game" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:2" content="Open Website" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_URL}/game" />
        <meta property="fc:frame:button:3" content="Close Frame" />
        <meta property="fc:frame:button:3:action" content="post" />
        <meta property="fc:frame:post_url" content="${postUrl}" />
      </head></html>`,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    )
  } catch (error) {
    console.error('Error in POST handler:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
