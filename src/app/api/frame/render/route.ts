import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import React from 'react'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const state = searchParams.get('state') || 'menu'

  return new ImageResponse(
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        padding: '20px',
      }
    }, [
      React.createElement('div', {
        style: {
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '3/4',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '4px',
        }
      }, [
        React.createElement('div', {
          style: {
            width: '100%',
            height: '100%',
            backgroundColor: '#9333ea',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }
        }, [
          React.createElement('div', {
            style: {
              backgroundColor: '#7e22ce',
              padding: '8px',
            }
          }, [
            React.createElement('h1', {
              style: {
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'white',
                margin: 0,
                fontFamily: 'Frijole',
              }
            }, state === 'menu' ? 'Main Menu' : 'Select Difficulty')
          ]),
          React.createElement('div', {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              gap: '16px',
            }
          }, state === 'menu' ? [
            React.createElement('h2', {
              style: {
                fontSize: '20px',
                color: 'white',
                marginBottom: '32px'
              }
            }, 'Select Game:'),
            React.createElement('button', {
              style: {
                backgroundColor: 'black',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '18px',
              }
            }, 'Tic-Tac-Maxi')
          ] : 
          ['Easy', 'Medium', 'Hard'].map(difficulty => 
            React.createElement('button', {
              key: difficulty,
              style: {
                backgroundColor: 'black',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '18px',
                width: '100%',
              }
            }, difficulty)
          ))
        ])
      ])
    ]),
    {
      width: 600,
      height: 800,
    }
  )
} 