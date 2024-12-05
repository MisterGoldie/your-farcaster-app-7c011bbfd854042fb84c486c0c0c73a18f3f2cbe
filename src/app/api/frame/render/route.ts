import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import React from 'react'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const state = searchParams.get('state') || 'menu'
  const difficulty = searchParams.get('difficulty')
  const piece = searchParams.get('piece')
  const board = searchParams.get('board')?.split(',') || Array(9).fill(null)

  try {
    // Add error handling for font loading
    let fontData;
    try {
      fontData = await fetch(
        'https://fonts.googleapis.com/css2?family=Frijole&display=swap'
      ).then((res) => res.arrayBuffer())
    } catch (error) {
      console.error('Failed to load font:', error)
      // Use a fallback font if Frijole fails to load
      fontData = null
    }

    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        padding: '20px',
      },
      card: {
        width: '100%',
        maxWidth: '400px',
        aspectRatio: '3/4',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '4px',
      },
      content: {
        width: '100%',
        height: '100%',
        backgroundColor: '#9333ea',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
      },
      header: {
        backgroundColor: '#7e22ce',
        padding: '12px',
        width: '100%',
        marginBottom: '20px',
        textAlign: 'center' as const,
      },
      title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: 'white',
        margin: '0 0 8px 0',
        fontFamily: 'Frijole',
      },
      subtitle: {
        fontSize: '24px',
        color: 'white',
        margin: 0,
        fontFamily: 'Frijole',
      },
      board: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        width: '280px',
        height: '280px',
        backgroundColor: '#7e22ce',
        padding: '8px',
        borderRadius: '8px',
      },
      cell: {
        backgroundColor: '#9333ea',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Frijole',
      },
      pieceSelection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      },
      pieceOption: {
        fontSize: '48px',
        color: 'white',
        marginBottom: '10px',
        fontFamily: 'Frijole',
      }
    }

    const renderMenu = () => (
      React.createElement('div', { style: styles.content },
        React.createElement('div', { style: styles.header },
          React.createElement('h1', { style: styles.title }, 'POD Play'),
          React.createElement('p', { style: styles.subtitle }, 'Tic-Tac-Toe')
        )
      )
    )

    const renderDifficulty = () => (
      React.createElement('div', { style: styles.content },
        React.createElement('div', { style: styles.header },
          React.createElement('h1', { style: styles.title }, 'Select Difficulty'),
          React.createElement('p', { style: styles.subtitle }, 'Choose your level')
        )
      )
    )

    const renderPieceSelection = () => (
      React.createElement('div', { style: styles.content },
        React.createElement('div', { style: styles.header },
          React.createElement('h1', { style: styles.title }, 'Choose Your Piece'),
          React.createElement('p', { style: styles.subtitle }, 'X or O')
        ),
        React.createElement('div', { style: styles.pieceSelection },
          React.createElement('div', { style: styles.pieceOption }, 'X'),
          React.createElement('div', { style: styles.pieceOption }, 'O')
        )
      )
    )

    const renderGame = () => (
      React.createElement('div', { style: styles.content },
        React.createElement('div', { style: styles.header },
          React.createElement('h1', { style: styles.title }, 'POD Play'),
          React.createElement('p', { style: styles.subtitle }, `${difficulty} Mode`)
        ),
        React.createElement('div', { style: styles.board },
          ...board.map((value, index) => 
            React.createElement('div', { 
              key: index,
              style: styles.cell 
            }, value || (index + 1).toString())
          )
        )
      )
    )

    const content = {
      menu: renderMenu,
      difficulty: renderDifficulty,
      piece: renderPieceSelection,
      game: renderGame,
    }[state] || renderMenu

    const menuStyles = {
      container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        padding: '20px',
      },
      content: {
        width: '100%',
        maxWidth: '400px',
        aspectRatio: '1/1',
        backgroundColor: '#9333ea',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      },
      title: {
        color: 'white',
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '0 0 20px 0',
      },
      subtitle: {
        color: 'white',
        fontSize: '24px',
        textAlign: 'center',
        margin: 0,
      }
    }

    const renderMenuBoard = () => (
      React.createElement('div', { style: menuStyles.container },
        React.createElement('div', { style: menuStyles.content },
          React.createElement('h1', { style: menuStyles.title }, 'POD Play'),
          React.createElement('p', { style: menuStyles.subtitle }, 'Tic-Tac-Toe')
        )
      )
    )

    const imageConfig = {
      width: 1200,
      height: 628,
    }

    if (state === 'menu') {
      return new ImageResponse(
        renderMenuBoard(),
        {
          ...imageConfig,
        }
      )
    } else {
      return new ImageResponse(
        React.createElement('div', { style: styles.container },
          React.createElement('div', { style: styles.card },
            content()
          )
        ),
        {
          ...imageConfig,
          fonts: [
            {
              name: 'Frijole',
              data: fontData || Buffer.from([]),
              style: 'normal',
              weight: 400
            }
          ]
        }
      )
    }
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response('Error generating image', { status: 500 })
  }
}