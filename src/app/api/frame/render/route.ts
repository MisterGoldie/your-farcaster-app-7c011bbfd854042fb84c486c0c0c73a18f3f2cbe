import { NextRequest } from 'next/server'
import { validateWithNeynar } from '@/app/helpers/frames'

enum GameState {
  SPLASH = 'splash',
  MENU = 'menu',
  CHARACTER_SELECT = 'character',
  DIFFICULTY = 'difficulty',
  GAME = 'game',
  ABOUT = 'about'
}

interface FrameState {
  currentState: GameState;
  difficulty?: 'easy' | 'medium' | 'hard';
  piece?: 'chili' | 'scarygary' | 'podplaylogo';
  gameStarted: boolean;
  lastUpdate: number;
}

// Helper function to get next state based on current state and button press
function getNextState(currentState: GameState, buttonIndex: number): GameState {
  switch (currentState) {
    case GameState.SPLASH:
      return buttonIndex === 1 ? GameState.CHARACTER_SELECT : GameState.ABOUT;
    case GameState.CHARACTER_SELECT:
      return buttonIndex === 4 ? GameState.MENU : GameState.DIFFICULTY;
    case GameState.DIFFICULTY:
      return buttonIndex === 4 ? GameState.CHARACTER_SELECT : GameState.GAME;
    case GameState.ABOUT:
    case GameState.GAME:
      return GameState.MENU;
    default:
      return GameState.MENU;
  }
}

// Helper function to generate HTML for frame based on state
function generateFrameHtml(state: GameState): string {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  
  switch (state) {
    case GameState.SPLASH:
      return `<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/splash.png" />
        <meta property="fc:frame:button:1" content="Start Game" />
        <meta property="fc:frame:button:2" content="How to Play" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
      </head></html>`;
    
    case GameState.CHARACTER_SELECT:
      return `<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/character-select.png" />
        <meta property="fc:frame:button:1" content="Play as Chili" />
        <meta property="fc:frame:button:2" content="Play as ScaryGary" />
        <meta property="fc:frame:button:3" content="Play as POD" />
        <meta property="fc:frame:button:4" content="Back" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame/game" />
      </head></html>`;
    
    // Add other states as needed
    default:
      return `<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/menu.png" />
        <meta property="fc:frame:button:1" content="Back to Menu" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
      </head></html>`;
  }
}

// Helper function to get frame state from storage
async function getFrameState(fid: string): Promise<FrameState> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/frame/state?fid=${fid}`);
    const state = await response.json();
    return state;
  } catch (error) {
    return {
      currentState: GameState.SPLASH,
      gameStarted: false,
      lastUpdate: Date.now()
    };
  }
}

// Helper function to update frame state
async function updateFrameState(fid: string, state: Partial<FrameState>): Promise<void> {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/frame/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fid,
        state
      })
    });
  } catch (error) {
    console.error('Failed to update frame state:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { untrustedData, trustedData } = await req.json();
    const validationResult = await validateWithNeynar(trustedData.messageBytes);
    
    if (!validationResult.valid) {
      throw new Error('Invalid frame message');
    }

    const { fid } = validationResult.action.interactor;
    const buttonIndex = untrustedData?.buttonIndex || 1;
    
    const currentState = await getFrameState(fid);
    const nextState = getNextState(currentState.currentState, buttonIndex);
    
    await updateFrameState(fid, {
      currentState: nextState,
      lastUpdate: Date.now()
    });
    
    return new Response(
      generateFrameHtml(nextState),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Frame render error:', error);
    return new Response(
      generateFrameHtml(GameState.MENU),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}
