import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import React from 'react'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const state = searchParams.get('state') || 'menu'
  const difficulty = searchParams.get('difficulty')
  const piece = searchParams.get('piece')
  const board = searchParams.get('board')?.split(',') || Array(9).fill(null)

  try {
    const fontData = await fetch(
      'https://fonts.googleapis.com/css2?family=Frijole&display=swap'
    ).then((res) => res.arrayBuffer())

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
      },
      title: {
        color: 'white',
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 0,
        fontFamily: 'Frijole',
      },
      subtitle: {
        color: 'white',
        fontSize: '20px',
        textAlign: 'center',
        marginTop: '10px',
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
          React.createElement('h1', { style: styles.title }, 'Select Difficulty')
        )
      )
    )

    const renderPieceSelection = () => (
      React.createElement('div', { style: styles.content },
        React.createElement('div', { style: styles.header },
          React.createElement('h1', { style: styles.title }, 'Choose Your Piece')
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
            }, value)
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

    return new ImageResponse(
      React.createElement('div', { style: styles.container },
        React.createElement('div', { style: styles.card },
          content()
        )
      ),
      {
        width: 600,
        height: 800,
        fonts: [
          {
            name: 'Frijole',
            data: fontData,
            style: 'normal',
            weight: 400
          }
        ]
      }
    )
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response('Error generating image', { status: 500 })
  }
}