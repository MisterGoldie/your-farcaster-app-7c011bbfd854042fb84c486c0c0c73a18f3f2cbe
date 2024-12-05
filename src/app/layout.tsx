import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'POD Play Tic-Tac-Toe',
  description: 'A Tic-Tac-Toe game presented by /thepod',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_URL}/api/frame/render?state=menu`,
    'fc:frame:button:1': 'Play as Chili',
    'fc:frame:button:2': 'Play as ScaryGary',
    'fc:frame:button:3': 'Play as POD',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_URL}/api/frame`
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