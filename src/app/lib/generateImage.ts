import { GameState } from './gameState'
import { createCanvas } from '@napi-rs/canvas'

export async function generateGameImage(state: GameState): Promise<Buffer> {
  const canvas = createCanvas(600, 600)
  const ctx = canvas.getContext('2d')
  
  // Draw game board
  ctx.fillStyle = '#9333ea' // Using your purple theme
  ctx.fillRect(0, 0, 600, 600)
  
  // Draw grid lines
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 4
  
  // Draw game pieces and grid...
  
  return canvas.toBuffer('image/png')
} 