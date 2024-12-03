import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'POD Play',
  description: 'Play POD Play Game',
  viewport: 'width=device-width, initial-scale=1',
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
  other: {
    'fc:frame': JSON.stringify({
      version: 'next',
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/game-board.png`,
        aspectRatio: '1.91:1'
      },
      buttons: [
        {
          label: "Play POD Play",
          action: "post"
        }
      ],
      postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame`
    })
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Frijole&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md px-4">
          {children}
        </div>
      </body>
    </html>
  )
}