import { useState } from 'react'
import type { QuizRound, RoundState, TeamColors } from '../types'
import './QuizGame.css'

type Props = {
  round: QuizRound;
  roundState: RoundState;
  teamColors: TeamColors;
  onAutoScore?: (team: 'boy' | 'girl') => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = ['#4DABF7', '#FF6B9D', '#51cf66', '#FFD700']

export function QuizGame({ round, roundState, teamColors, onAutoScore }: Props) {
  const [boyAnswer, setBoyAnswer] = useState<number | null>(null)
  const [girlAnswer, setGirlAnswer] = useState<number | null>(null)
  const [selectingTeam, setSelectingTeam] = useState<'boy' | 'girl' | null>(null)
  const [scored, setScored] = useState(false)
  const revealed = roundState !== 'showing'

  function handleOptionClick(index: number) {
    if (revealed || selectingTeam === null) return
    if (selectingTeam === 'boy') {
      setBoyAnswer(index)
      setSelectingTeam(girlAnswer === null ? 'girl' : null)
    } else {
      setGirlAnswer(index)
      setSelectingTeam(boyAnswer === null ? 'boy' : null)
    }
  }

  // Auto-score when revealed
  if (revealed && !scored && onAutoScore) {
    const boyCorrect = boyAnswer === round.correctIndex
    const girlCorrect = girlAnswer === round.correctIndex
    if (boyCorrect && !girlCorrect) {
      setScored(true)
      setTimeout(() => onAutoScore('boy'), 600)
    } else if (girlCorrect && !boyCorrect) {
      setScored(true)
      setTimeout(() => onAutoScore('girl'), 600)
    } else {
      setScored(true)
    }
  }

  const boyColor = teamColors.boy === 'blue' ? 'var(--color-blue)' : 'var(--color-pink)'
  const girlColor = teamColors.girl === 'pink' ? 'var(--color-pink)' : 'var(--color-blue)'

  return (
    <div className="quiz-game">
      <h2 className="quiz-question">{round.question}</h2>

      {!revealed && (
        <div className="quiz-team-select">
          <button
            className={`quiz-team-btn ${selectingTeam === 'boy' ? 'active' : ''}`}
            style={{ '--team-color': boyColor } as React.CSSProperties}
            onClick={() => setSelectingTeam('boy')}
          >
            👦 Menino {boyAnswer !== null ? `→ ${OPTION_LETTERS[boyAnswer]}` : ''}
          </button>
          <button
            className={`quiz-team-btn ${selectingTeam === 'girl' ? 'active' : ''}`}
            style={{ '--team-color': girlColor } as React.CSSProperties}
            onClick={() => setSelectingTeam('girl')}
          >
            👧 Menina {girlAnswer !== null ? `→ ${OPTION_LETTERS[girlAnswer]}` : ''}
          </button>
        </div>
      )}

      <div className="quiz-options">
        {round.options.map((opt, i) => {
          const isCorrect = i === round.correctIndex
          const isBoyPick = boyAnswer === i
          const isGirlPick = girlAnswer === i
          let cls = 'quiz-option'
          if (!revealed && selectingTeam) cls += ' quiz-option-clickable'
          if (revealed && isCorrect) cls += ' quiz-correct'
          if (revealed && !isCorrect) cls += ' quiz-wrong'

          return (
            <div
              key={i}
              className={cls}
              onClick={() => handleOptionClick(i)}
            >
              <span className="quiz-letter" style={{ background: OPTION_COLORS[i] }}>
                {OPTION_LETTERS[i]}
              </span>
              <span className="quiz-text">{opt}</span>
              <div className="quiz-picks">
                {isBoyPick && <span className="quiz-pick" style={{ background: boyColor }}>👦</span>}
                {isGirlPick && <span className="quiz-pick" style={{ background: girlColor }}>👧</span>}
              </div>
              {revealed && isCorrect && <span className="quiz-check">✓</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
