'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAccount, useConnect, useDisconnect, useSignMessage, useSignTypedData } from 'wagmi'
import { config } from '@/components/providers/WagmiProvider'
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
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<any>()
  const searchParams = useSearchParams()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect } = useConnect()
  
  const {
    signMessage,
    error: signError,
    isError: isSignError,
    isPending: isSignPending,
  } = useSignMessage()

  const {
    signTypedData,
    error: signTypedError,
    isError: isSignTypedError,
    isPending: isSignTypedPending,
  } = useSignTypedData()

  const handleSignMessage = useCallback(() => {
    signMessage({ message: "POD Play: Verify your game session!" })
  }, [signMessage])

  const handleSignTypedData = useCallback(() => {
    signTypedData({
      domain: {
        name: "POD Play",
        version: "1",
        chainId: 8453, // Base chain ID
      },
      types: {
        GameSession: [
          { name: "player", type: "address" },
          { name: "timestamp", type: "uint256" },
          { name: "gameId", type: "string" }
        ],
      },
      message: {
        player: address || "0x0",
        timestamp: BigInt(Math.floor(Date.now() / 1000)),
        gameId: `game-${Date.now()}`
      },
      primaryType: "GameSession",
    })
  }, [signTypedData, address])

  const renderError = (error: Error | null) => {
    if (!error) return null
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>
  }

  useEffect(() => {
    const initFrame = async () => {
      try {
        if (window.sdk && !isSDKLoaded) {
          setIsSDKLoaded(true)
          setContext(await window.sdk.context)
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
  }, [gameStarted, isSDKLoaded])

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
      button: {
        title: state === 'menu' ? 'Start Game' : 'New Game',
        action: {
          type: "launch_frame",
          name: "POD Play",
          url: `${process.env.NEXT_PUBLIC_URL}/api/frame`,
          splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
          splashBackgroundColor: "#9333ea"
        }
      }
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

  const handleGameEnd = useCallback(async (result: 'win' | 'lose' | 'draw') => {
    if (!window.sdk) return;
    
    const messages = {
      win: "Congratulations! You won the game!",
      lose: "Better luck next time!",
      draw: "It's a draw!"
    };

    await window.sdk.actions.close();
  }, [])

  const handleExternalLink = useCallback(async (url: string, shouldClose: boolean = false) => {
    if (!window.sdk) return;
    
    await window.sdk.actions.openUrl({
      url,
      close: shouldClose
    });
  }, [])

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

  const handleWalletConnection = async () => {
    if (isConnected) {
      disconnect()
    } else {
      connect({ connector: config.connectors[0] })
    }
  }

  const renderWalletStatus = () => {
    return (
      <div className="absolute top-4 right-4 text-white">
        {address && (
          <div className="text-xs mb-2">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleWalletConnection}
            className="px-4 py-2 bg-purple-800 rounded hover:bg-purple-900 transition-colors"
          >
            {isConnected ? 'Disconnect' : 'Connect Wallet'}
          </button>
          
          {isConnected && (
            <>
              <button
                onClick={handleSignMessage}
                disabled={isSignPending}
                className={`px-4 py-2 bg-purple-800 rounded hover:bg-purple-900 transition-colors ${
                  isSignPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSignPending ? 'Signing...' : 'Sign Message'}
              </button>
              {isSignError && renderError(signError)}

              <button
                onClick={handleSignTypedData}
                disabled={isSignTypedPending}
                className={`px-4 py-2 bg-purple-800 rounded hover:bg-purple-900 transition-colors ${
                  isSignTypedPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSignTypedPending ? 'Signing...' : 'Sign Typed Data'}
              </button>
              {isSignTypedError && renderError(signTypedError)}
            </>
          )}
        </div>
      </div>
    )
  }

  if (!isSDKLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-[100svh] w-full bg-black relative">
      {renderWalletStatus()}
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