'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const TicTacToe3D = dynamic(() => import('../components/TicTacToe3D'), { ssr: false })

interface FarcasterContext {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
  };
  location?: {
    type: string;
    cast?: {
      hash: string;
    };
  };
}

export default function Game() {
  const [key, setKey] = useState(0)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [piece, setPiece] = useState<'chili' | 'scarygary' | 'podplaylogo'>('chili')
  const [isMuted, setIsMuted] = useState(false)
  const [farcasterContext, setFarcasterContext] = useState<FarcasterContext | null>(null)
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const difficultyFromURL = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard';
    const pieceFromURL = searchParams.get('piece') as 'chili' | 'scarygary' | 'podplaylogo';
    const mutedFromURL = searchParams.get('muted');

    if (difficultyFromURL) setDifficulty(difficultyFromURL);
    if (pieceFromURL) setPiece(pieceFromURL);
    if (mutedFromURL) setIsMuted(mutedFromURL === 'true');

    const initFarcaster = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.farcaster.xyz/sdk/v2/sdk.js';
        script.async = true;
        document.head.appendChild(script);

        script.onload = async () => {
          if (window.sdk) {
            await window.sdk.actions.ready();
            
            const context = await window.sdk.context.user;
            setFarcasterContext({ user: context });

            await window.sdk.actions.setPrimaryButton({
              text: "Play Again",
              enabled: true
            });
          }
        };
      } catch (error) {
        console.error('Failed to initialize Farcaster:', error);
      }
    };

    initFarcaster();

    return () => {
      const sdkScript = document.querySelector('script[src*="farcaster"]');
      if (sdkScript) sdkScript.remove();
    };
  }, []);

  const handleGameOver = async (score: number) => {
    if (farcasterContext?.user?.fid) {
      try {
        await fetch('/api/game/state', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fid: farcasterContext.user.fid,
            state: {
              score,
              difficulty,
              piece,
              gameStarted: true
            }
          })
        });
      } catch (error) {
        console.error('Failed to update game state:', error);
      }
    }
  };

  const handleRestart = async () => {
    setKey(prevKey => prevKey + 1);
    
    if (window.sdk) {
      try {
        await window.sdk.actions.setPrimaryButton({
          text: "Play Again",
          enabled: true
        });
      } catch (error) {
        console.error('Failed to update frame:', error);
      }
    }
  }

  const handleBackToMenu = async () => {
    if (window.sdk) {
      try {
        await window.sdk.actions.close();
      } catch (error) {
        console.error('Failed to close frame:', error);
      }
    }
    router.push('/howtoplay');
  }

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <main className="h-[100svh] bg-black text-white overflow-hidden">
      <TicTacToe3D 
        key={key}
        onRestart={handleRestart}
        onBackToMenu={handleBackToMenu}
        onGameOver={handleGameOver}
        difficulty={difficulty}
        piece={piece}
        isMuted={isMuted}
        toggleMute={toggleMute}
        farcasterUser={farcasterContext?.user}
      />
    </main>
  )
}

declare global {
  interface Window {
    sdk: {
      events: any;
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
