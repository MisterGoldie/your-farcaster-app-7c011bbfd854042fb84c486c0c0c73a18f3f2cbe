import { NextRequest, NextResponse } from 'next/server'

// In-memory state store (replace with a database in production)
const gameStates = new Map<string, any>()

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { fid, state } = data
    
    if (!fid) {
      return NextResponse.json({ error: 'Missing fid' }, { status: 400 })
    }

    // Store state with FID as key
    gameStates.set(fid.toString(), state)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save state' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const fid = req.nextUrl.searchParams.get('fid')
    
    if (!fid) {
      return NextResponse.json({ error: 'Missing fid' }, { status: 400 })
    }

    const state = gameStates.get(fid.toString())
    if (!state) {
      return NextResponse.json({ error: 'State not found' }, { status: 404 })
    }

    return NextResponse.json({ state })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve state' }, { status: 500 })
  }
} 