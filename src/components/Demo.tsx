'use client'

import { useEffect, useState } from 'react'

export default function Demo() {
  const [isFrameLoaded, setIsFrameLoaded] = useState(false)

  useEffect(() => {
    const initFrame = async () => {
      try {
        if (window.sdk) {
          await window.sdk.actions.ready()
          setIsFrameLoaded(true)
        }
      } catch (error) {
        console.error('Failed to initialize frame:', error)
      }
    }

    initFrame()
  }, [])

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">POD Play</h1>
      {!isFrameLoaded && <div>Loading frame...</div>}
    </div>
  )
} 