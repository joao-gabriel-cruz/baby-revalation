import { useReducer, useEffect, useRef } from 'react'
import type { AppState, AppAction } from './types'
import { DEFAULT_ROUNDS } from './constants'
import { saveState, loadState } from './utils'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { ConfigScreen } from './screens/ConfigScreen'
import { RegistrationScreen } from './screens/RegistrationScreen'
import { GamesScreen } from './screens/GamesScreen'
import { PreRevealScreen } from './screens/PreRevealScreen'
import { RevealScreen } from './screens/RevealScreen'
import './App.css'

const initialState: AppState = {
  screen: 'welcome',
  gender: 'male',
  revealPhrase: 'Bem-vindo Luiz Miguel!!!',
  teamColors: { boy: 'blue', girl: 'pink' },
  participants: [],
  rounds: DEFAULT_ROUNDS,
  currentRoundIndex: 0,
  scores: { boy: 0, girl: 0 },
  roundState: 'showing',
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen }
    case 'SET_CONFIG':
      return { ...state, ...action.config }
    case 'ADD_PARTICIPANT':
      return { ...state, participants: [...state.participants, action.participant] }
    case 'REMOVE_PARTICIPANT':
      return { ...state, participants: state.participants.filter(p => p.id !== action.id) }
    case 'AWARD_POINT':
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.team]: state.scores[action.team] + 1,
        },
        roundState: 'scored',
      }
    case 'NEXT_ROUND':
      return {
        ...state,
        currentRoundIndex: state.currentRoundIndex + 1,
        roundState: 'showing',
      }
    case 'SET_ROUND_STATE':
      return { ...state, roundState: action.roundState }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

function App() {
  const saved = loadState()
  const [state, dispatch] = useReducer(appReducer, saved ?? initialState)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    const shouldPlay = state.screen === 'pre-reveal' || state.screen === 'reveal'
    if (shouldPlay) {
      if (!audioRef.current) {
        const audio = new Audio('/music/music.mp3')
        audio.loop = true
        audioRef.current = audio
      }
      audioRef.current.play().catch(() => {})
    } else if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }, [state.screen])

  switch (state.screen) {
    case 'welcome':
      return <WelcomeScreen dispatch={dispatch} hasSavedState={saved !== null && saved.screen !== 'welcome'} />
    case 'config':
      return <ConfigScreen state={state} dispatch={dispatch} />
    case 'registration':
      return <RegistrationScreen state={state} dispatch={dispatch} />
    case 'games':
      return <GamesScreen state={state} dispatch={dispatch} />
    case 'pre-reveal':
      return <PreRevealScreen dispatch={dispatch} audioRef={audioRef} />
    case 'reveal':
      return <RevealScreen state={state} dispatch={dispatch} />
  }
}

export default App
