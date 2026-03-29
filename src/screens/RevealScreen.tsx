import type { AppState, AppAction } from '../types'
import { Confetti } from '../components/Confetti'
import { clearState } from '../utils'
import './RevealScreen.css'

type Props = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export function RevealScreen({ state, dispatch }: Props) {
  const { gender, revealPhrase, teamColors } = state
  const revealColor = gender === 'male'
    ? (teamColors.boy === 'blue' ? 'blue' : 'pink')
    : (teamColors.girl === 'pink' ? 'pink' : 'blue')

  const bgClass = revealColor === 'pink' ? 'reveal-bg-pink' : 'reveal-bg-blue'

  return (
    <div className={`screen reveal-screen ${bgClass}`}>
      <Confetti color={revealColor} count={120} />

      <div className="reveal-burst" />
      <div className="reveal-burst reveal-burst-2" />

      <div className="reveal-content">
        <div className="reveal-emoji">
          {gender === 'male' ? '👶💙' : '👶💖'}
        </div>
        <h1 className="reveal-phrase">{revealPhrase}</h1>
      </div>

      <button
        className="reveal-reset"
        onClick={() => {
          clearState()
          dispatch({ type: 'RESET' })
        }}
      >
        Voltar ao inicio
      </button>
    </div>
  )
}
