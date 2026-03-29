import type { Scores, TeamColors } from '../types'
import { clamp } from '../utils'
import './ScoreBar.css'

type Props = {
  scores: Scores;
  teamColors: TeamColors;
  lastScored?: 'boy' | 'girl' | null;
}

export function ScoreBar({ scores, teamColors, lastScored }: Props) {
  const total = scores.boy + scores.girl
  const boyPercent = total === 0 ? 50 : clamp((scores.boy / total) * 100, 15, 85)
  const girlPercent = 100 - boyPercent

  return (
    <div className="score-bar">
      <div
        className={`score-bar-side score-bar-${teamColors.boy} ${lastScored === 'boy' ? 'score-flash' : ''}`}
        style={{ flexBasis: `${boyPercent}%` }}
      >
        <span className="score-bar-label">👦 Menino</span>
        <span className="score-bar-points">{scores.boy}</span>
      </div>
      <div
        className={`score-bar-side score-bar-${teamColors.girl} ${lastScored === 'girl' ? 'score-flash' : ''}`}
        style={{ flexBasis: `${girlPercent}%` }}
      >
        <span className="score-bar-points">{scores.girl}</span>
        <span className="score-bar-label">Menina 👧</span>
      </div>
    </div>
  )
}
