import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const state = searchParams.get('state') || 'menu'
  const board = searchParams.get('board')?.split(',') || Array(9).fill(null)

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        padding: '20px',
      }}>
        <div style={{
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
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            POD Play
          </h1>
          {state === 'game' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              width: '100%',
              maxWidth: '300px',
            }}>
              {board.map((value, i) => (
                <div key={i} style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  aspectRatio: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: 'white',
                  borderRadius: '4px',
                }}>
                  {value || (i + 1).toString()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
} 