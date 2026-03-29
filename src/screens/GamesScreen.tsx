import { useState, useCallback } from 'react'
import type { AppState, AppAction } from '../types'
import { GAME_TYPE_LABELS } from '../constants'
import { ScoreBar } from '../components/ScoreBar'
import { QuizGame } from '../games/QuizGame'
import { TrueOrFalseGame } from '../games/TrueOrFalseGame'
import { GuessGame } from '../games/GuessGame'
import { WordScrambleGame } from '../games/WordScrambleGame'
import { WheelOfFortuneGame } from '../games/WheelOfFortuneGame'
import { TicTacToeGame } from '../games/TicTacToeGame'
import { Button } from '../components/Button'
import './GamesScreen.css'

type Props = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export function GamesScreen({ state, dispatch }: Props) {
  const { rounds, currentRoundIndex, scores, teamColors, roundState } = state
  const [lastScored, setLastScored] = useState<'boy' | 'girl' | null>(null)
  const currentRound = rounds[currentRoundIndex]
  const isLastRound = currentRoundIndex >= rounds.length - 1

  const handleAwardPoint = useCallback((team: 'boy' | 'girl') => {
    setLastScored(team)
    dispatch({ type: 'AWARD_POINT', team })
    setTimeout(() => setLastScored(null), 700)
  }, [dispatch])

  if (!currentRound) {
    dispatch({ type: 'SET_SCREEN', screen: 'pre-reveal' })
    return null
  }

  function renderGame() {
    switch (currentRound.type) {
      case 'quiz':
        return (
          <QuizGame
            round={currentRound}
            roundState={roundState}
            teamColors={teamColors}
            onAutoScore={handleAwardPoint}
          />
        )
      case 'true-or-false':
        return (
          <TrueOrFalseGame
            round={currentRound}
            roundState={roundState}
            teamColors={teamColors}
            onAutoScore={handleAwardPoint}
          />
        )
      case 'guess':
        return <GuessGame round={currentRound} roundState={roundState} />
      case 'word-scramble':
        return <WordScrambleGame round={currentRound} roundState={roundState} />
      case 'wheel':
        return <WheelOfFortuneGame round={currentRound} roundState={roundState} />
      case 'tic-tac-toe':
        return (
          <TicTacToeGame
            roundState={roundState}
            teamColors={teamColors}
            onAutoScore={handleAwardPoint}
            onNoScore={() => dispatch({ type: 'SET_ROUND_STATE', roundState: 'answered' })}
          />
        )
    }
  }

  const isAutoScored = currentRound.type === 'quiz' || currentRound.type === 'tic-tac-toe' || currentRound.type === 'true-or-false'
  const isSelfContained = currentRound.type === 'tic-tac-toe'

  return (
    <div className="screen games-screen">
      <ScoreBar scores={scores} teamColors={teamColors} lastScored={lastScored} />

      <div className="games-round-indicator">
        <span className="round-tag">{GAME_TYPE_LABELS[currentRound.type]}</span>
        <span className="round-counter">Rodada {currentRoundIndex + 1} de {rounds.length}</span>
      </div>

      <div className="games-content">
        {renderGame()}
      </div>

      <div className="games-controls">
        {roundState === 'showing' && !isSelfContained && (
          <Button variant="primary" onClick={() => dispatch({ type: 'SET_ROUND_STATE', roundState: 'answered' })}>
            Revelar Resposta
          </Button>
        )}
        {roundState === 'answered' && !isAutoScored && (
          <>
            <Button
              variant={teamColors.boy === 'blue' ? 'blue' : 'pink'}
              onClick={() => handleAwardPoint('boy')}
            >
              Ponto Menino 👦
            </Button>
            <Button
              variant={teamColors.girl === 'pink' ? 'pink' : 'blue'}
              onClick={() => handleAwardPoint('girl')}
            >
              Ponto Menina 👧
            </Button>
          </>
        )}
        {roundState === 'answered' && isAutoScored && (
          <>
            {!isLastRound ? (
              <Button variant="primary" onClick={() => dispatch({ type: 'NEXT_ROUND' })}>
                Proxima Rodada
              </Button>
            ) : (
              <Button variant="primary" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'pre-reveal' })}>
                Ir para Revelacao!
              </Button>
            )}
          </>
        )}
        {roundState === 'scored' && (
          <>
            {!isLastRound ? (
              <Button variant="primary" onClick={() => dispatch({ type: 'NEXT_ROUND' })}>
                Proxima Rodada
              </Button>
            ) : (
              <Button variant="primary" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'pre-reveal' })}>
                Ir para Revelacao!
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
