import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  return Response.json({
    frames: [{
      version: 'next',
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/game-board.png`,
        aspectRatio: '1.91:1'
      },
      buttons: [
        {
          label: "Play Game",
          action: "link",
          target: `${process.env.NEXT_PUBLIC_URL}/game`
        }
      ]
    }]
  })
}

export async function GET(req: NextRequest) {
  return Response.json({
    frames: [{
      version: 'next',
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/game-preview.png`,
        aspectRatio: '1.91:1'
      },
      buttons: [
        {
          label: "Start Game",
          action: "post"
        }
      ],
      postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame`
    }]
  })
} 