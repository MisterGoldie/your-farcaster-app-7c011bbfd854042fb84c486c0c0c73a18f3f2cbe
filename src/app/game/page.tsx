'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { NextRequest, NextResponse } from 'next/server'

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

interface FrameState {
  difficulty?: 'easy' | 'medium' | 'hard'
  piece?: 'chili' | 'scarygary' | 'podplaylogo'
  gameStarted: boolean
  score?: number
}

// In-memory state store (consider using Redis/DB for production)
const frameStates = new Map<string, FrameState>()

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { fid, state } = data
    
    if (!fid) {
      return NextResponse.json({ error: 'Missing fid' }, { status: 400 })
    }

    frameStates.set(fid.toString(), state)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update state' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fid = searchParams.get('fid')

  if (!fid) {
    return NextResponse.json({ error: 'Missing fid' }, { status: 400 })
  }

  const state = frameStates.get(fid) || {
    gameStarted: false
  }

  return NextResponse.json(state)
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
    <>
      <Head>
        <meta property="fc:frame" content={JSON.stringify({
          version: 'next',
          imageUrl: `${process.env.NEXT_PUBLIC_URL}/game-board.png`,
          button: {
            title: 'Play Again',
            action: {
              type: 'launch_frame',
              name: 'POD Play',
              url: `${process.env.NEXT_PUBLIC_URL}/game`,
              splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
              splashBackgroundColor: '#000000'
            }
          }
        })} />
      </Head>
      <main className="h-[100svh] bg-black text-white overflow-hidden">
        <TicTacToe3D 
          key={key}
          onRestart={handleRestart}
          onBackToMenu={handleBackToMenu}
          difficulty={difficulty}
          piece={piece}
          isMuted={isMuted}
          toggleMute={toggleMute}
          farcasterUser={farcasterContext?.user} onGameOver={function (score: number): void {
            throw new Error('Function not implemented.')
          } }        />
      </main>
    </>
  )
}

declare global {
  interface Window {
    sdk: {
      events: any
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
