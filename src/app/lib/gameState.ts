export type GameState = {
  board: Array<string | null>
  currentPlayer: 'X' | 'O'
  winner: string | null
  isGameOver: boolean
}

export function createInitialGameState(): GameState {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    isGameOver: false
  }
}

export function makeMove(state: GameState, position: number): GameState {
  if (state.board[position] || state.isGameOver) {
    return state
  }

  const newBoard = [...state.board]
  newBoard[position] = state.currentPlayer

  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    winner: calculateWinner(newBoard),
    isGameOver: calculateWinner(newBoard) !== null || !newBoard.includes(null)
  }
}

function calculateWinner(board: Array<string | null>): string | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
} 