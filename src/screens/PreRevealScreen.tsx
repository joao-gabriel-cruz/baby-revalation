import { useState, useEffect, useRef } from 'react'
import type { AppAction } from '../types'
import './PreRevealScreen.css'

type Props = {
  dispatch: React.Dispatch<AppAction>;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const MUSIC_DURATION = 269 // 4:29 in seconds
const COUNTDOWN_START = 238 // 3:58 in seconds

export function PreRevealScreen({ dispatch, audioRef }: Props) {
  const [phase, setPhase] = useState<'initial' | 'loading' | 'countdown'>('initial')
  const [count, setCount] = useState(3)
  const [elapsed, setElapsed] = useState(0)
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    if (phase !== 'loading') return
    const update = () => {
      if (audioRef.current) {
        const time = audioRef.current.currentTime
        setElapsed(time)
        if (time >= COUNTDOWN_START) {
          setPhase('countdown')
          return
        }
      }
      animFrameRef.current = requestAnimationFrame(update)
    }
    animFrameRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [phase, audioRef])

  useEffect(() => {
    if (phase !== 'countdown') return
    if (count <= 0) {
      dispatch({ type: 'SET_SCREEN', screen: 'reveal' })
      return
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1200)
    return () => clearTimeout(timer)
  }, [phase, count, dispatch])

  function startLoading() {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
    setPhase('loading')
  }

  const progress = Math.min(elapsed / MUSIC_DURATION, 1) * 100

  return (
    <div className="screen prereveal-screen">
      {phase === 'initial' && (
        <div className="prereveal-content">
          <div className="prereveal-hearts">
            <span className="prereveal-heart" style={{ animationDelay: '0s' }}>💖</span>
            <span className="prereveal-heart" style={{ animationDelay: '0.3s' }}>💙</span>
            <span className="prereveal-heart" style={{ animationDelay: '0.6s' }}>💖</span>
          </div>
          <h1 className="prereveal-title">Estão prontos???</h1>
          <p className="prereveal-sub">A grande revelação está prestes a acontecer!</p>
          <button className="prereveal-btn" onClick={startLoading}>
            Revelar!
          </button>
        </div>
      )}

      {phase === 'loading' && (
        <div className="loading-screen">
          <div className="loading-icon">
            <span className="loading-heart-beat">💖</span>
            <span className="loading-heart-beat" style={{ animationDelay: '0.3s' }}>💙</span>
            <span className="loading-heart-beat" style={{ animationDelay: '0.6s' }}>💖</span>
          </div>
          <h2 className="loading-title">Preparando a revelação...</h2>
          <div className="loading-bar-container">
            <div className="loading-bar" style={{ width: `${progress}%` }} />
            <div className="loading-bar-icon" style={{ left: `${progress}%` }}>👶</div>
          </div>
          <div className="loading-dots">
            <span className="loading-dot" style={{ animationDelay: '0s' }} />
            <span className="loading-dot" style={{ animationDelay: '0.3s' }} />
            <span className="loading-dot" style={{ animationDelay: '0.6s' }} />
          </div>
        </div>
      )}

      {phase === 'countdown' && (
        <div className="prereveal-countdown">
          <div key={count} className="countdown-number">
            {count > 0 ? count : ''}
          </div>
        </div>
      )}
    </div>
  )
}
