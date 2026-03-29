import type { WordScrambleRound, RoundState } from '../types'
import './WordScrambleGame.css'

type Props = {
  round: WordScrambleRound;
  roundState: RoundState;
}

export function WordScrambleGame({ round, roundState }: Props) {
  const revealed = roundState !== 'showing'
  const letters = revealed ? round.answer.split('') : round.scrambled.split('')

  return (
    <div className="ws-game">
      <h2 className="ws-title">Descubra a palavra!</h2>
      <div className="ws-tiles">
        {letters.map((letter, i) => (
          <div
            key={`${revealed ? 'a' : 's'}-${i}`}
            className={`ws-tile ${revealed ? 'ws-tile-revealed' : ''}`}
            style={{ animationDelay: revealed ? `${i * 0.1}s` : '0s' }}
          >
            {letter}
          </div>
        ))}
      </div>
      {revealed && (
        <p className="ws-answer-label">
          ✓ {round.answer}
        </p>
      )}
    </div>
  )
}
