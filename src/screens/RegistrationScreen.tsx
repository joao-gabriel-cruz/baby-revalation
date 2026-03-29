import { useState } from 'react'
import type { AppState, AppAction } from '../types'
import { generateId } from '../utils'
import { Button } from '../components/Button'
import './RegistrationScreen.css'

type Props = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export function RegistrationScreen({ state, dispatch }: Props) {
  const [name, setName] = useState('')
  const { participants, teamColors } = state

  const boyTeam = participants.filter(p => p.team === 'boy')
  const girlTeam = participants.filter(p => p.team === 'girl')

  function addToTeam(team: 'boy' | 'girl') {
    if (!name.trim()) return
    dispatch({
      type: 'ADD_PARTICIPANT',
      participant: { id: generateId(), name: name.trim(), team },
    })
    setName('')
  }

  const canStart = boyTeam.length >= 1 && girlTeam.length >= 1

  return (
    <div className="screen screen-scrollable reg-screen">
      <div className="reg-container">
        <h1 className="reg-title">Cadastro de Participantes</h1>

        <div className="reg-input-area">
          <input
            className="reg-input"
            placeholder="Nome do participante"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && name.trim()) addToTeam('boy')
            }}
          />
          <div className="reg-team-buttons">
            <Button
              variant={teamColors.boy === 'blue' ? 'blue' : 'pink'}
              onClick={() => addToTeam('boy')}
              disabled={!name.trim()}
            >
              Time Menino
            </Button>
            <Button
              variant={teamColors.girl === 'pink' ? 'pink' : 'blue'}
              onClick={() => addToTeam('girl')}
              disabled={!name.trim()}
            >
              Time Menina
            </Button>
          </div>
        </div>

        <div className="reg-teams">
          <div className={`reg-team reg-team-${teamColors.boy}`}>
            <h2 className="reg-team-title">
              👦 Time Menino ({boyTeam.length})
            </h2>
            <div className="reg-team-list">
              {boyTeam.map(p => (
                <div key={p.id} className="reg-participant">
                  <span>{p.name}</span>
                  <button
                    className="reg-remove"
                    onClick={() => dispatch({ type: 'REMOVE_PARTICIPANT', id: p.id })}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {boyTeam.length === 0 && (
                <p className="reg-empty">Nenhum participante</p>
              )}
            </div>
          </div>

          <div className={`reg-team reg-team-${teamColors.girl}`}>
            <h2 className="reg-team-title">
              👧 Time Menina ({girlTeam.length})
            </h2>
            <div className="reg-team-list">
              {girlTeam.map(p => (
                <div key={p.id} className="reg-participant">
                  <span>{p.name}</span>
                  <button
                    className="reg-remove"
                    onClick={() => dispatch({ type: 'REMOVE_PARTICIPANT', id: p.id })}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {girlTeam.length === 0 && (
                <p className="reg-empty">Nenhum participante</p>
              )}
            </div>
          </div>
        </div>

        <div className="reg-buttons">
          <Button variant="secondary" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'welcome' })}>
            Voltar
          </Button>
          <Button
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'games' })}
            disabled={!canStart}
          >
            Iniciar Jogos
          </Button>
        </div>
      </div>
    </div>
  )
}
