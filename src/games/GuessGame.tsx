import type { GuessRound, RoundState } from '../types'
import './GuessGame.css'

type Props = {
  round: GuessRound;
  roundState: RoundState;
}

export function GuessGame({ round, roundState }: Props) {
  const revealed = roundState !== 'showing'

  return (
    <div className="guess-game">
      <h2 className="guess-question">{round.question}</h2>
      {round.hint && <p className="guess-hint">💡 Dica: {round.hint}</p>}
      {!revealed ? (
        <div className="guess-mystery">
          <span className="guess-qmark">?</span>
        </div>
      ) : (
        <div className="guess-revealed">
          <p className="guess-decide">O apresentador decide!</p>
          <p className="guess-sub">Qual time chegou mais perto?</p>
        </div>
      )}
    </div>
  )
}
