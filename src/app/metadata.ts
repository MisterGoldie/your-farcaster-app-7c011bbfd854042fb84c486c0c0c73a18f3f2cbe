import { Metadata } from 'next'

const frameEmbed = {
  version: 'vNext',
  imageUrl: `${process.env.NEXT_PUBLIC_URL}/game-preview.png`,
  button: {
    title: 'Play Now',
    action: {
      type: 'launch_frame',
      name: 'POD Play',
      url: `${process.env.NEXT_PUBLIC_URL}/api/frame`,
      splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
      splashBackgroundColor: '#9333ea'
    }
  },
  aspectRatio: '1:1'
}

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  openGraph: {
    images: [`${process.env.NEXT_PUBLIC_URL}/game-preview.png`],
  },
  other: {
    'fc:frame': JSON.stringify(frameEmbed),
    'fc:frame:image': frameEmbed.imageUrl,
    'fc:frame:button:1': frameEmbed.button.title,
    'fc:frame:post_url': frameEmbed.button.action.url,
    'fc:custom:mini_app_id': process.env.NEXT_PUBLIC_APP_NAME?.toLowerCase().replace(/\s+/g, '-') || '',
    'fc:custom:base_url': process.env.NEXT_PUBLIC_URL || '',
  },
}
