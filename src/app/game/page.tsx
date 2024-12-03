'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TicTacToe3D from '../components/TicTacToe3D'

export default function Game() {
  const [key, setKey] = useState(0)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [piece, setPiece] = useState<'chili' | 'scarygary' | 'podplaylogo'>('chili')
  const [isMuted, setIsMuted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const difficultyFromURL = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard';
    const pieceFromURL = searchParams.get('piece') as 'chili' | 'scarygary' | 'podplaylogo';
    const mutedFromURL = searchParams.get('muted');
    
    if (difficultyFromURL) {
      setDifficulty(difficultyFromURL);
    }
    if (pieceFromURL) {
      setPiece(pieceFromURL);
    }
    if (mutedFromURL) {
      setIsMuted(mutedFromURL === 'true');
    }
  }, []);

  const handleRestart = () => {
    setKey(prevKey => prevKey + 1)
  }

  const handleBackToMenu = () => {
    router.push('/howtoplay')
  }

  const toggleMute = () => {
    setIsMuted(prev => !prev)
  }

  const handleGameOver = () => {
    // Add this empty function to prevent crashes
    // We can implement game over logic here later if needed
  }

  console.log('Piece set in Game component:', piece);

  return (
    <div key={key}>
      <TicTacToe3D
        difficulty={difficulty}
        piece={piece}
        isMuted={isMuted}
        toggleMute={toggleMute}
        onRestart={handleRestart}
        onBackToMenu={handleBackToMenu}
        onGameOver={handleGameOver}
      />
    </div>
  )
}
