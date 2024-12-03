import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import React from 'react'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const state = searchParams.get('state') || 'menu'

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
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
    },
    header: {
      backgroundColor: '#7e22ce',
      padding: '8px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
      margin: 0,
      fontFamily: 'Frijole',
    }
  }

  return new ImageResponse(
    React.createElement('div', { style: styles.container },
      React.createElement('div', { style: styles.card },
        React.createElement('div', { style: styles.content },
          React.createElement('div', { style: styles.header },
            React.createElement('h1', { style: styles.title },
              state === 'menu' ? 'POD Play' : 'Select Difficulty'
            )
          )
        )
      )
    ),
    {
      width: 600,
      height: 800,
    }
  )
} 