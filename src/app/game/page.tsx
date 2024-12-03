'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const TicTacToe3D = dynamic(() => import('../components/TicTacToe3D'), { ssr: false })

export default function Game() {
  const [key, setKey] = useState(0)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [piece, setPiece] = useState<'chili' | 'scarygary' | 'podplaylogo'>('chili')
  const [isMuted, setIsMuted] = useState(false)
  const router = useRouter()

  const handleRestart = () => {
    setKey(prevKey => prevKey + 1)
  }

  const handleBackToMenu = () => {
    router.push('/howtoplay')
  }

  const toggleMute = () => setIsMuted(!isMuted)

  return (
    <main className="h-[100svh] bg-black text-white overflow-hidden">
      <TicTacToe3D 
        key={key}
        onRestart={handleRestart}
        onBackToMenu={handleBackToMenu}
        difficulty={difficulty}
        piece={piece}
        isMuted={isMuted}
        toggleMute={toggleMute} onGameOver={function (score: number): void {
          throw new Error('Function not implemented.')
        } }      />
    </main>
  )
}

declare global {
  interface Window {
    sdk: {
      events: {
        on: (event: string, callback: () => void) => void;
        off: (event: string, callback: () => void) => void;
      };
      actions: {
        ready: () => Promise<void>;
        setPrimaryButton: (options: {
          text: string;
          enabled: boolean;
        }) => Promise<void>;
        close: () => Promise<void>;
      };
      context: {
        user: any;
      };
    };
  }
}

/////
