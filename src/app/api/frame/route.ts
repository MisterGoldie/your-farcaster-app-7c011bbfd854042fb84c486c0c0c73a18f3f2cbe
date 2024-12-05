import { NextRequest } from 'next/server'
import { validateWithNeynar } from '@/app/helpers/frames'

export async function GET(req: NextRequest) {
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/frame/render" />
        <meta property="fc:frame:button:1" content="Start Game" />
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
    const { untrustedData } = body

    // Validate with Neynar if needed
    const buttonIndex = untrustedData?.buttonIndex || 1
    const state = new URL(req.url).searchParams.get('state') || 'menu'
    const difficulty = new URL(req.url).searchParams.get('difficulty') || ''
    const piece = new URL(req.url).searchParams.get('piece') || ''
    const board = new URL(req.url).searchParams.get('board') || ''

    let nextState = state
    let nextDifficulty = difficulty
    let nextPiece = piece
    let nextBoard = board

    // Handle state transitions
    switch (state) {
      case 'menu':
        nextState = 'difficulty'
        break
      
      case 'difficulty':
        if (buttonIndex <= 3) {
          nextState = 'piece'
          nextDifficulty = ['Easy', 'Medium', 'Hard'][buttonIndex - 1]
        } else {
          nextState = 'menu'
        }
        break
      
      case 'piece':
        if (buttonIndex <= 2) {
          nextState = 'game'
          nextPiece = buttonIndex === 1 ? 'X' : 'O'
          nextBoard = Array(9).fill(null).join(',')
        } else {
          nextState = 'difficulty'
        }
        break
      
      case 'game':
        if (buttonIndex === 9) {
          nextState = 'menu'
        } else if (board) {
          const boardArray = board.split(',')
          if (buttonIndex <= 9 && !boardArray[buttonIndex - 1]) {
            boardArray[buttonIndex - 1] = piece
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
        ...(nextBoard ? nextBoard.split(',').map((_, i) => ({ text: (i + 1).toString() })) : []),
        { text: 'New Game' }
      ]
    } as const

    const buttons = stateButtons[nextState as keyof typeof stateButtons] || stateButtons.menu

    // Build frame URL with state parameters
    let frameUrl = `${process.env.NEXT_PUBLIC_URL}/api/frame/render?state=${nextState}`
    if (nextDifficulty) frameUrl += `&difficulty=${nextDifficulty}`
    if (nextPiece) frameUrl += `&piece=${nextPiece}`
    if (nextBoard) frameUrl += `&board=${nextBoard}`

    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${frameUrl}" />
          ${buttons.map((button, i) => `
            <meta property="fc:frame:button:${i + 1}" content="${button.text}" />
            <meta property="fc:frame:button:${i + 1}:action" content="post" />
          `).join('')}
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame?state=${nextState}${nextDifficulty ? `&difficulty=${nextDifficulty}` : ''}${nextPiece ? `&piece=${nextPiece}` : ''}${nextBoard ? `&board=${nextBoard}` : ''}" />
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
