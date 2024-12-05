import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'POD Play Tic-Tac-Toe',
  description: 'A Tic-Tac-Toe game presented by /thepod',
  other: {
    'fc:frame': JSON.stringify({
      version: 'next',
      imageUrl: `${process.env.NEXT_PUBLIC_URL}/game-board.png`,
      button: {
        title: "Play POD Play",
        action: {
          type: "launch_frame",
          name: "POD Play",
          url: "https://v2frametest.vercel.app/",
          splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
          splashBackgroundColor: "#9333ea"
        }
      }
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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