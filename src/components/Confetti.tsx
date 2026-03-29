import { useMemo } from 'react'
import './Confetti.css'

type Props = {
  color: 'pink' | 'blue';
  count?: number;
}

const PINK_SHADES = ['#FF6B9D', '#FFB3CC', '#E0457B', '#ff8ab5', '#ff4081']
const BLUE_SHADES = ['#4DABF7', '#A5D8FF', '#1C7ED6', '#74c0fc', '#339af0']

export function Confetti({ color, count = 100 }: Props) {
  const particles = useMemo(() => {
    const shades = color === 'pink' ? PINK_SHADES : BLUE_SHADES
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${(Math.random() - 0.5) * 100}vw`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2.5}s`,
      duration: `${2.5 + Math.random() * 2}s`,
      rotate: `${Math.random() * 720 - 360}deg`,
      size: `${8 + Math.random() * 10}px`,
      color: shades[Math.floor(Math.random() * shades.length)],
      shape: Math.random() > 0.5 ? '2' : '1',
    }))
  }, [color, count])

  return (
    <div className="confetti-container" aria-hidden>
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            '--x': p.x,
            '--rotate': p.rotate,
            '--size': p.size,
            '--color': p.color,
            '--ar': p.shape,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
