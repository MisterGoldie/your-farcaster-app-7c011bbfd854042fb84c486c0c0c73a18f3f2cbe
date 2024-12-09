'use client'

import { useEffect, useCallback, useState } from 'react'
import { FrameContext } from '@/types/farcaster'

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FrameContext>()

  useEffect(() => {
    const initFrame = async () => {
      try {
        if (window.sdk) {
          setContext(await window.sdk.context)
          await window.sdk.actions.ready()
          setIsSDKLoaded(true)
          
          // After SDK is ready, update frame metadata to show game options
          await updateFrameMetadata('menu')
        }
      } catch (error) {
        console.error('Failed to initialize frame:', error)
      }
    }

    initFrame()
  }, [])

  const updateFrameMetadata = async (state: 'menu' | 'game') => {
    if (!window.sdk) return

    const frameMetadata = {
      version: 'next',
      imageUrl: `${process.env.NEXT_PUBLIC_URL}/${state === 'menu' ? 'menu' : 'game-board'}.png`,
      buttons: [
        {
          label: "Start Game",
          action: {
            type: "post",
            url: `${process.env.NEXT_PUBLIC_URL}/api/frame`
          }
        },
        {
          label: "How to Play",
          action: {
            type: "post",
            url: `${process.env.NEXT_PUBLIC_URL}/api/frame/about`
          }
        }
      ]
    }

    try {
      await fetch('/api/frame/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(frameMetadata)
      })
    } catch (error) {
      console.error('Failed to update frame metadata:', error)
    }
  }

  const handleStartGame = useCallback(async () => {
    if (!window.sdk) return
    
    try {
      // Close the splash screen and launch the game frame
      await window.sdk.actions.close()
      await window.sdk.actions.openUrl({
        url: `${process.env.NEXT_PUBLIC_URL}/game`,
        close: true  // This will close the frame after opening the URL
      })
    } catch (error) {
      console.error('Failed to start game:', error)
    }
  }, [])

  if (!isSDKLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">POD Play</h1>
          <p>Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">POD Play</h1>
        <button
          onClick={handleStartGame}
          className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  )
} 