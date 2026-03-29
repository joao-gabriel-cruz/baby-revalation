import type { AppAction } from '../types'
import { clearState } from '../utils'
import { Button } from '../components/Button'
import './WelcomeScreen.css'

type Props = {
  dispatch: React.Dispatch<AppAction>;
  hasSavedState: boolean;
}

export function WelcomeScreen({ dispatch, hasSavedState }: Props) {
  return (
    <div className="screen welcome-screen">
      <div className="welcome-bg" />

      <button
        className="welcome-config-btn"
        onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'config' })}
        title="Configuracoes"
      >
        ⚙️
      </button>

      <div className="welcome-content">
        <div className="welcome-icon">👶</div>
        <h1 className="welcome-title">Chá Revelação</h1>
        <p className="welcome-subtitle">A grande revelação está chegando!!!</p>
        <div className="welcome-buttons">
          <Button size="lg" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'registration' })}>
            Começar
          </Button>
          {hasSavedState && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                window.location.reload()
              }}
            >
              Continuar
            </Button>
          )}
        </div>
        {hasSavedState && (
          <button
            className="welcome-reset"
            onClick={() => {
              clearState()
              dispatch({ type: 'RESET' })
            }}
          >
            Limpar dados salvos
          </button>
        )}
      </div>
    </div>
  )
}
