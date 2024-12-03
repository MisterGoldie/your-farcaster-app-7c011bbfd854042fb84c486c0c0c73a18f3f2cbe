import { NextRequest, NextResponse } from 'next/server'

interface FrameState {
  difficulty?: 'easy' | 'medium' | 'hard'
  piece?: 'chili' | 'scarygary' | 'podplaylogo'
  gameStarted: boolean
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