import { useState } from 'react'
import type { TrueOrFalseRound, RoundState, TeamColors } from '../types'
import './TrueOrFalseGame.css'

type Props = {
  round: TrueOrFalseRound;
  roundState: RoundState;
  teamColors: TeamColors;
  onAutoScore?: (team: 'boy' | 'girl') => void;
}

export function TrueOrFalseGame({ round, roundState, teamColors, onAutoScore }: Props) {
  const [boyAnswer, setBoyAnswer] = useState<boolean | null>(null)
  const [girlAnswer, setGirlAnswer] = useState<boolean | null>(null)
  const [selectingTeam, setSelectingTeam] = useState<'boy' | 'girl' | null>(null)
  const [scored, setScored] = useState(false)
  const revealed = roundState !== 'showing'

  function handleCardClick(answer: boolean) {
    if (revealed || selectingTeam === null) return
    if (selectingTeam === 'boy') {
      setBoyAnswer(answer)
      setSelectingTeam(girlAnswer === null ? 'girl' : null)
    } else {
      setGirlAnswer(answer)
      setSelectingTeam(boyAnswer === null ? 'boy' : null)
    }
  }

  if (revealed && !scored && onAutoScore) {
    const boyCorrect = boyAnswer === round.answer
    const girlCorrect = girlAnswer === round.answer
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
    <div className="tf-game">
      <h2 className="tf-statement">{round.statement}</h2>

      {!revealed && (
        <div className="tf-team-select">
          <button
            className={`tf-team-btn ${selectingTeam === 'boy' ? 'active' : ''}`}
            style={{ '--team-color': boyColor } as React.CSSProperties}
            onClick={() => setSelectingTeam('boy')}
          >
            👦 Menino {boyAnswer !== null ? `→ ${boyAnswer ? 'V' : 'F'}` : ''}
          </button>
          <button
            className={`tf-team-btn ${selectingTeam === 'girl' ? 'active' : ''}`}
            style={{ '--team-color': girlColor } as React.CSSProperties}
            onClick={() => setSelectingTeam('girl')}
          >
            👧 Menina {girlAnswer !== null ? `→ ${girlAnswer ? 'V' : 'F'}` : ''}
          </button>
        </div>
      )}

      <div className="tf-cards">
        <div
          className={`tf-card tf-true ${revealed ? (round.answer ? 'tf-card-correct' : 'tf-card-wrong') : ''} ${!revealed && selectingTeam ? 'tf-card-clickable' : ''}`}
          onClick={() => handleCardClick(true)}
        >
          <span className="tf-card-icon">✓</span>
          <span className="tf-card-label">Verdadeiro</span>
          <div className="tf-picks">
            {boyAnswer === true && <span className="tf-pick" style={{ background: boyColor }}>👦</span>}
            {girlAnswer === true && <span className="tf-pick" style={{ background: girlColor }}>👧</span>}
          </div>
        </div>
        <div
          className={`tf-card tf-false ${revealed ? (!round.answer ? 'tf-card-correct' : 'tf-card-wrong') : ''} ${!revealed && selectingTeam ? 'tf-card-clickable' : ''}`}
          onClick={() => handleCardClick(false)}
        >
          <span className="tf-card-icon">✕</span>
          <span className="tf-card-label">Falso</span>
          <div className="tf-picks">
            {boyAnswer === false && <span className="tf-pick" style={{ background: boyColor }}>👦</span>}
            {girlAnswer === false && <span className="tf-pick" style={{ background: girlColor }}>👧</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
