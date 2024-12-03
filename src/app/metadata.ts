import { Metadata } from 'next'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  openGraph: {
    images: [`${process.env.NEXT_PUBLIC_URL}/game-preview.png`],
  },
  other: {
    'fc:frame': JSON.stringify({
      version: 'next',
      imageUrl: `${process.env.NEXT_PUBLIC_URL}/game-board.png`,
      button: {
        title: "Play POD Play",
        action: {
          type: "launch_frame",
          name: "POD Play",
          url: `${process.env.NEXT_PUBLIC_URL}/api/frame`,
          splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
          splashBackgroundColor: "#9333ea"
        }
      }
    })
  }
}
