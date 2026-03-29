import { useState } from 'react'
import type { RoundState, TeamColors } from '../types'
import './TicTacToeGame.css'

type Props = {
  roundState: RoundState;
  teamColors: TeamColors;
  onAutoScore?: (team: 'boy' | 'girl') => void;
  onNoScore?: () => void;
}

type Cell = 'boy' | 'girl' | null;

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function checkWinner(board: Cell[]): { winner: 'boy' | 'girl'; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line }
    }
  }
  return null
}

export function TicTacToeGame({ roundState, teamColors, onAutoScore, onNoScore }: Props) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [currentTurn, setCurrentTurn] = useState<'boy' | 'girl'>('boy')
  const [scored, setScored] = useState(false)
  const [drawCount, setDrawCount] = useState(0)

  const result = checkWinner(board)
  const isDraw = !result && board.every(c => c !== null)

  if (result && !scored && onAutoScore) {
    setScored(true)
    setTimeout(() => onAutoScore(result.winner), 400)
  }

  if (isDraw && drawCount >= 2 && !scored && onNoScore) {
    setScored(true)
    setTimeout(() => onNoScore(), 400)
  }

  function handleCellClick(index: number) {
    if (board[index] || result || roundState !== 'showing' || scored) return
    const newBoard = [...board]
    newBoard[index] = currentTurn
    setBoard(newBoard)
    setCurrentTurn(currentTurn === 'boy' ? 'girl' : 'boy')
  }

  function resetBoard() {
    setBoard(Array(9).fill(null))
    setCurrentTurn('boy')
    setDrawCount(prev => prev + 1)
  }

  const boyColor = teamColors.boy === 'blue' ? 'var(--color-blue)' : 'var(--color-pink)'
  const girlColor = teamColors.girl === 'pink' ? 'var(--color-pink)' : 'var(--color-blue)'

  return (
    <div className="ttt-game">
      <h2 className="ttt-title">Jogo da Velha</h2>

      {!result && !isDraw && roundState === 'showing' && !scored && (
        <div className="ttt-turn">
          <span
            className="ttt-turn-indicator"
            style={{ color: currentTurn === 'boy' ? boyColor : girlColor }}
          >
            {currentTurn === 'boy' ? '👦 Menino' : '👧 Menina'} joga
          </span>
        </div>
      )}

      {result && (
        <div className="ttt-result">
          <span style={{ color: result.winner === 'boy' ? boyColor : girlColor }}>
            {result.winner === 'boy' ? '👦 Menino' : '👧 Menina'} venceu!
          </span>
        </div>
      )}

      {isDraw && !scored && (
        <div className="ttt-result">
          <span>Empate! ({drawCount + 1}/3)</span>
          <button className="ttt-retry-btn" onClick={resetBoard}>Jogar novamente</button>
        </div>
      )}

      {isDraw && scored && (
        <div className="ttt-result">
          <span>3 empates - ninguem pontuou!</span>
        </div>
      )}

      <div className="ttt-board">
        {board.map((cell, i) => {
          const isWinCell = result?.line.includes(i)
          return (
            <button
              key={i}
              className={`ttt-cell ${cell ? 'ttt-cell-filled' : ''} ${isWinCell ? 'ttt-cell-win' : ''}`}
              onClick={() => handleCellClick(i)}
              disabled={!!cell || !!result || roundState !== 'showing' || scored}
            >
              {cell === 'boy' && (
                <span className="ttt-mark ttt-mark-boy" style={{ color: boyColor }}>X</span>
              )}
              {cell === 'girl' && (
                <span className="ttt-mark ttt-mark-girl" style={{ color: girlColor }}>O</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="ttt-legend">
        <span style={{ color: boyColor }}>X = 👦 Menino</span>
        <span style={{ color: girlColor }}>O = 👧 Menina</span>
      </div>
    </div>
  )
}
