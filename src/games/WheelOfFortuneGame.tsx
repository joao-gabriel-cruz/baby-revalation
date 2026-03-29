import { useState, useCallback } from 'react'
import type { WheelRound, RoundState } from '../types'
import './WheelOfFortuneGame.css'

type Props = {
  round: WheelRound;
  roundState: RoundState;
}

const SEGMENT_COLORS = [
  '#FF6B9D', '#4DABF7', '#51cf66', '#FFD700',
  '#c084fc', '#ff922b', '#20c997', '#f06595',
]

const spinAudio = new Audio('/music/roda-roda-jequiti-tempo-10-segundos.mp3')

export function WheelOfFortuneGame({ round, roundState }: Props) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const segments = round.segments
  const segmentAngle = 360 / segments.length

  const spin = useCallback(() => {
    if (spinning) return
    setSpinning(true)
    setSelectedIndex(null)
    spinAudio.currentTime = 0
    spinAudio.play().catch(() => {})
    const extraSpins = 15 + Math.floor(Math.random() * 4)
    const targetIndex = Math.floor(Math.random() * segments.length)
    const currentAngle = rotation % 360
    const targetAngle = (360 - (targetIndex * segmentAngle + segmentAngle / 2) - currentAngle + 720) % 360
    const totalRotation = rotation + extraSpins * 360 + targetAngle
    setRotation(totalRotation)
    setTimeout(() => {
      setSpinning(false)
      setSelectedIndex(targetIndex)
    }, 9700)
  }, [spinning, rotation, segments.length, segmentAngle])

  const conicGradient = segments
    .map((_, i) => {
      const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length]
      const start = i * segmentAngle
      const end = (i + 1) * segmentAngle
      return `${color} ${start}deg ${end}deg`
    })
    .join(', ')

  return (
    <div className="wheel-game">
      <h2 className="wheel-title">Imagem & Revel
        <span
           style={{
             color: '#fddb00'
           }}
        >
        AÇÃO
        </span>
        </h2>
      <div className="wheel-area">
        <div className="wheel-container">
          <div className="wheel-pointer">▼</div>
          <div
            className="wheel-disc"
            style={{
              background: `conic-gradient(${conicGradient})`,
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? 'transform 9.5s cubic-bezier(0.0, 0.0, 0.1, 0.4)'
                : 'none',
            }}
          >
            {segments.map((_, i) => {
              const angle = i * segmentAngle + segmentAngle / 2
              const isSelected = selectedIndex === i
              return (
                <div
                  key={i}
                  className={`wheel-segment-num ${isSelected ? 'wheel-segment-selected' : ''}`}
                  style={{ transform: `rotate(${angle}deg) translateY(-65px)` }}
                >
                  {i + 1}
                </div>
              )
            })}
          </div>
          {!spinning && roundState === 'showing' && (
            <button className="wheel-spin-btn" onClick={spin}>
              GIRAR
            </button>
          )}
        </div>
        <div className="wheel-legend">
          {/* {segments.map((seg, i) => (
            <div
              key={i}
              className={`wheel-legend-item ${selectedIndex === i ? 'wheel-legend-selected' : ''}`}
            >
              <span
                className="wheel-legend-num"
                style={{ background: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
              >
                {i + 1}
              </span>
              <span className="wheel-legend-text">{seg}</span>
            </div>
          ))} */}
        </div>
      </div>
      {/* {selectedIndex !== null && (
        <div className="wheel-result">
          <p className="wheel-result-text">{segments[selectedIndex]}</p>
        </div>
      )} */}
    </div>
  )
}
