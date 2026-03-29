import { useState } from 'react'
import type { AppState, AppAction, Gender, TeamColors, GameRound, GameType } from '../types'
import { REVEAL_PHRASES, DEFAULT_ROUNDS, GAME_TYPE_LABELS } from '../constants'
import { scrambleWord } from '../utils'
import { Button } from '../components/Button'
import './ConfigScreen.css'

type Props = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const GAME_TYPES: GameType[] = ['quiz', 'true-or-false', 'guess', 'word-scramble', 'wheel', 'tic-tac-toe']

function createEmptyRound(type: GameType): GameRound {
  switch (type) {
    case 'quiz':
      return { type: 'quiz', question: '', options: ['', '', '', ''], correctIndex: 0 }
    case 'true-or-false':
      return { type: 'true-or-false', statement: '', answer: true }
    case 'guess':
      return { type: 'guess', question: '' }
    case 'word-scramble':
      return { type: 'word-scramble', scrambled: '', answer: '' }
    case 'wheel':
      return { type: 'wheel', segments: ['', '', '', ''] }
    case 'tic-tac-toe':
      return { type: 'tic-tac-toe' }
  }
}

export function ConfigScreen({ state, dispatch }: Props) {
  const [gender, setGender] = useState<Gender>(state.gender)
  const [revealPhrase, setRevealPhrase] = useState(state.revealPhrase)
  const [teamColors, setTeamColors] = useState<TeamColors>(state.teamColors)
  const [rounds, setRounds] = useState<GameRound[]>(state.rounds.length > 0 ? state.rounds : DEFAULT_ROUNDS)
  const [editingRound, setEditingRound] = useState<number | null>(null)
  const [addingType, setAddingType] = useState<GameType>('quiz')

  function handleSave() {
    dispatch({
      type: 'SET_CONFIG',
      config: { gender, revealPhrase, teamColors, rounds },
    })
    dispatch({ type: 'SET_SCREEN', screen: 'welcome' })
  }

  function updateRound(index: number, updated: GameRound) {
    const newRounds = [...rounds]
    newRounds[index] = updated
    setRounds(newRounds)
  }

  function removeRound(index: number) {
    setRounds(rounds.filter((_, i) => i !== index))
    setEditingRound(null)
  }

  function moveRound(index: number, direction: -1 | 1) {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= rounds.length) return
    const newRounds = [...rounds]
    ;[newRounds[index], newRounds[newIndex]] = [newRounds[newIndex], newRounds[index]]
    setRounds(newRounds)
  }

  function addRound() {
    setRounds([...rounds, createEmptyRound(addingType)])
    setEditingRound(rounds.length)
  }

  return (
    <div className="screen screen-scrollable config-screen">
      <div className="config-container">
        <h1 className="config-title">Configuracao</h1>

        <div className="config-section">
          <label className="config-label">Sexo do Bebe</label>
          <div className="config-gender-toggle">
            <button
              className={`gender-btn gender-boy ${gender === 'male' ? 'active' : ''}`}
              onClick={() => {
                setGender('male')
                setRevealPhrase('Bem-vindo Luiz Miguel!!!')
              }}
            >
              👦 Menino
            </button>
            <button
              className={`gender-btn gender-girl ${gender === 'female' ? 'active' : ''}`}
              onClick={() => {
                setGender('female')
                setRevealPhrase('E uma menina!')
              }}
            >
              👧 Menina
            </button>
          </div>
        </div>

        <div className="config-section">
          <label className="config-label">Frase de Revelação</label>
          <input
            type="text"
            className="config-input"
            value={revealPhrase}
            onChange={e => setRevealPhrase(e.target.value)}
            placeholder="Ex: Bem-vindo Luiz Miguel!!!"
          />
          <div className="config-suggestions">
            {REVEAL_PHRASES.filter(p =>
              gender === 'male'
                ? p.includes('menino') || p.includes('principe')
                : p.includes('menina') || p.includes('princesa')
            ).map(phrase => (
              <button
                key={phrase}
                className={`suggestion-chip ${revealPhrase === phrase ? 'active' : ''}`}
                onClick={() => setRevealPhrase(phrase)}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        <div className="config-section">
          <label className="config-label">Cores dos Times</label>
          <div className="config-colors">
            <div className="color-option">
              <span>Time Menino:</span>
              <div className="color-toggle">
                <button
                  className={`color-btn color-blue ${teamColors.boy === 'blue' ? 'active' : ''}`}
                  onClick={() => setTeamColors({ boy: 'blue', girl: 'pink' })}
                >
                  Azul
                </button>
                <button
                  className={`color-btn color-pink ${teamColors.boy === 'pink' ? 'active' : ''}`}
                  onClick={() => setTeamColors({ boy: 'pink', girl: 'blue' })}
                >
                  Rosa
                </button>
              </div>
            </div>
            <div className="color-option">
              <span>Time Menina:</span>
              <div className="color-toggle">
                <button
                  className={`color-btn color-pink ${teamColors.girl === 'pink' ? 'active' : ''}`}
                  onClick={() => setTeamColors({ boy: 'blue', girl: 'pink' })}
                >
                  Rosa
                </button>
                <button
                  className={`color-btn color-blue ${teamColors.girl === 'blue' ? 'active' : ''}`}
                  onClick={() => setTeamColors({ boy: 'pink', girl: 'blue' })}
                >
                  Azul
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="config-section">
          <label className="config-label">Rodadas ({rounds.length})</label>
          <div className="rounds-list">
            {rounds.map((round, i) => (
              <div key={i} className="round-item">
                <div className="round-header">
                  <span className="round-number">{i + 1}</span>
                  <span className="round-type">{GAME_TYPE_LABELS[round.type]}</span>
                  <span className="round-preview">
                    {round.type === 'quiz' && round.question}
                    {round.type === 'true-or-false' && round.statement}
                    {round.type === 'guess' && round.question}
                    {round.type === 'word-scramble' && `${round.scrambled} → ${round.answer}`}
                    {round.type === 'wheel' && `${round.segments.length} desafios`}
                    {round.type === 'tic-tac-toe' && 'Times jogam entre si'}
                  </span>
                  <div className="round-actions">
                    <button className="round-action-btn" onClick={() => moveRound(i, -1)} disabled={i === 0}>↑</button>
                    <button className="round-action-btn" onClick={() => moveRound(i, 1)} disabled={i === rounds.length - 1}>↓</button>
                    <button className="round-action-btn" onClick={() => setEditingRound(editingRound === i ? null : i)}>✏️</button>
                    <button className="round-action-btn round-delete" onClick={() => removeRound(i)}>✕</button>
                  </div>
                </div>
                {editingRound === i && (
                  <div className="round-edit">
                    <RoundEditor round={round} onChange={r => updateRound(i, r)} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="add-round">
            <select
              className="config-select"
              value={addingType}
              onChange={e => setAddingType(e.target.value as GameType)}
            >
              {GAME_TYPES.map(t => (
                <option key={t} value={t}>{GAME_TYPE_LABELS[t]}</option>
              ))}
            </select>
            <Button variant="secondary" size="sm" onClick={addRound}>+ Adicionar</Button>
          </div>
        </div>

        <div className="config-buttons">
          <Button variant="secondary" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'welcome' })}>
            Voltar
          </Button>
          <Button onClick={handleSave} disabled={rounds.length === 0 || !revealPhrase.trim()}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )
}

function RoundEditor({ round, onChange }: { round: GameRound; onChange: (r: GameRound) => void }) {
  switch (round.type) {
    case 'quiz':
      return (
        <div className="round-fields">
          <input
            className="config-input"
            placeholder="Pergunta"
            value={round.question}
            onChange={e => onChange({ ...round, question: e.target.value })}
          />
          {round.options.map((opt, i) => (
            <div key={i} className="option-row">
              <input
                className="config-input"
                placeholder={`Opcao ${i + 1}`}
                value={opt}
                onChange={e => {
                  const options = [...round.options]
                  options[i] = e.target.value
                  onChange({ ...round, options })
                }}
              />
              <label className="correct-label">
                <input
                  type="radio"
                  name="correct"
                  checked={round.correctIndex === i}
                  onChange={() => onChange({ ...round, correctIndex: i })}
                />
                Correta
              </label>
            </div>
          ))}
        </div>
      )
    case 'true-or-false':
      return (
        <div className="round-fields">
          <input
            className="config-input"
            placeholder="Afirmacao"
            value={round.statement}
            onChange={e => onChange({ ...round, statement: e.target.value })}
          />
          <div className="tf-toggle">
            <button
              className={`tf-btn ${round.answer ? 'active' : ''}`}
              onClick={() => onChange({ ...round, answer: true })}
            >
              Verdadeiro
            </button>
            <button
              className={`tf-btn ${!round.answer ? 'active' : ''}`}
              onClick={() => onChange({ ...round, answer: false })}
            >
              Falso
            </button>
          </div>
        </div>
      )
    case 'guess':
      return (
        <div className="round-fields">
          <input
            className="config-input"
            placeholder="Pergunta"
            value={round.question}
            onChange={e => onChange({ ...round, question: e.target.value })}
          />
          <input
            className="config-input"
            placeholder="Dica (opcional)"
            value={round.hint ?? ''}
            onChange={e => onChange({ ...round, hint: e.target.value || undefined })}
          />
        </div>
      )
    case 'word-scramble':
      return (
        <div className="round-fields">
          <input
            className="config-input"
            placeholder="Palavra resposta"
            value={round.answer}
            onChange={e => {
              const answer = e.target.value.toUpperCase()
              onChange({ ...round, answer, scrambled: scrambleWord(answer) })
            }}
          />
          <p className="field-hint">Embaralhado: {round.scrambled}</p>
        </div>
      )
    case 'wheel':
      return (
        <div className="round-fields">
          {round.segments.map((seg, i) => (
            <div key={i} className="option-row">
              <input
                className="config-input"
                placeholder={`Desafio ${i + 1}`}
                value={seg}
                onChange={e => {
                  const segments = [...round.segments]
                  segments[i] = e.target.value
                  onChange({ ...round, segments })
                }}
              />
              <button
                className="round-action-btn round-delete"
                onClick={() => {
                  const segments = round.segments.filter((_, j) => j !== i)
                  onChange({ ...round, segments })
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onChange({ ...round, segments: [...round.segments, ''] })}
          >
            + Desafio
          </Button>
        </div>
      )
    case 'tic-tac-toe':
      return (
        <div className="round-fields">
          <p className="field-hint">Os times jogam jogo da velha entre si. Nao precisa de configuracao.</p>
        </div>
      )
  }
}
