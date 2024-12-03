'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import MenuBoard from './MenuBoard'
import TicTacToe3D from './TicTacToe3D'

interface FrameGameWrapperProps {
  initialGameState?: {
    difficulty?: 'easy' | 'medium' | 'hard'
    piece?: 'chili' | 'scarygary' | 'podplaylogo'
  }
}

export default function FrameGameWrapper({ initialGameState }: FrameGameWrapperProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameSettings, setGameSettings] = useState(initialGameState || {})
  const [isMuted, setIsMuted] = useState(false)
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const initFrame = async () => {
      try {
        if (window.sdk) {
          await window.sdk.actions.ready()
          
          await window.sdk.actions.setPrimaryButton({
            text: gameStarted ? "New Game" : "Start Game",
            enabled: true
          })

          window.sdk.events.on("primaryButtonClick", handlePrimaryButton)
        }
      } catch (error) {
        console.error('Failed to initialize frame:', error)
      }
    }

    initFrame()

    return () => {
      if (window.sdk) {
        window.sdk.events.off("primaryButtonClick", handlePrimaryButton)
      }
    }
  }, [gameStarted])

  const handlePrimaryButton = async () => {
    if (gameStarted) {
      setGameStarted(false)
      setGameSettings({})
      updateFrameMetadata('menu')
    } else {
      setGameStarted(true)
      updateFrameMetadata('game')
    }
  }

  const updateFrameMetadata = async (state: 'menu' | 'game') => {
    if (!window.sdk) return

    const frameMetadata = {
      version: 'next',
      imageUrl: `${process.env.NEXT_PUBLIC_URL}/${state === 'menu' ? 'menu' : 'game-board'}.png`,
      buttons: [
        {
          title: state === 'menu' ? 'Start Game' : 'New Game',
          action: {
            type: 'post',
            url: `${process.env.NEXT_PUBLIC_URL}/api/frame`
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

  const handleStartGame = (difficulty: 'easy' | 'medium' | 'hard', piece: 'chili' | 'scarygary' | 'podplaylogo') => {
    setGameSettings({ difficulty, piece })
    setGameStarted(true)
    updateFrameMetadata('game')
  }

  const handleBackToMenu = () => {
    setGameStarted(false)
    setGameSettings({})
    updateFrameMetadata('menu')
  }

  const toggleMute = () => setIsMuted(!isMuted)

  const handleGameEnd = async (result: 'win' | 'lose' | 'draw') => {
    if (!window.sdk) return;
    
    const messages = {
      win: "Congratulations! You won the game!",
      lose: "Better luck next time!",
      draw: "It's a draw!"
    };

    await window.sdk.actions.close();
  }

  const handleExternalLink = async (url: string) => {
    if (!window.sdk) return;
    
    await window.sdk.actions.openUrl({
      url,
      close: false
    });
  }

  useEffect(() => {
    const initContext = async () => {
      if (window.sdk?.context) {
        const { user } = window.sdk.context;
        console.log('User context:', user);
        
        // Use context to customize the game experience
        if (user?.username) {
          // Personalize the game for the user
        }
      }
    };

    initContext();
  }, []);

  return (
    <div className="h-[100svh] w-full bg-black">
      {!gameStarted ? (
        <MenuBoard
                  onStartGame={handleStartGame}
                  onGoBack={handleBackToMenu}
                  isMuted={isMuted}
                  toggleMute={toggleMute} handleBackButton={function (): void {
                      throw new Error('Function not implemented.')
                  } } playHalloweenMusic={function (): void {
                      throw new Error('Function not implemented.')
                  } } stopHalloweenMusic={function (): void {
                      throw new Error('Function not implemented.')
                  } }        />
      ) : (
        <TicTacToe3D
                      difficulty={gameSettings.difficulty || 'easy'}
                      piece={gameSettings.piece || 'chili'}
                      isMuted={isMuted}
                      toggleMute={toggleMute}
                      onRestart={() => handleStartGame(gameSettings.difficulty || 'easy', gameSettings.piece || 'chili')}
                      onBackToMenu={handleBackToMenu} onGameOver={() => {
                          throw new Error('Function not implemented.')
                      } }        />
      )}
    </div>
  )
}