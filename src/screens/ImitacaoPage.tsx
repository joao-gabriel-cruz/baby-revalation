import { useParams } from 'react-router-dom'
import './ImitacaoPage.css'

type Team = 'menino' | 'menina'

const IMITACOES: Record<number, string> = {
  1: 'Bebê chorando',
  2: 'Mamãe cansada',
  3: 'Trocando fralda',
  4: 'Mamãe no parto',
  5: 'Preparando a mamadeira',
  6: `"Amor a bolsa estourou (Reação do mamãe)"`,
}

const IMITACOES_MENINO: Record<number, string> = {
  1: '`"Amor a bolsa estourou (Reação do papai)"`',
  2: 'Preparando a mamadeira',
  3: 'Papai no parto',
  4: 'Trocando fralda',
  5: 'Papai cansado',
  6: 'Bebê chorando',
}

const TEAM_EMOJIS: Record<Team, string[]> = {
  menino: ['👶', '🍼', '🧸', '⭐', '🎀', '💙'],
  menina: ['👶', '🍼', '🧸', '⭐', '🎀', '💖'],
}

export function ImitacaoPage() {
  const { team, numero: numeroStr } = useParams<{ team: string; numero: string }>()
  const validTeam = (team === 'menino' || team === 'menina') ? team as Team : null
  const numero = Number(numeroStr)

  if (!validTeam || isNaN(numero)) {
    return (
      <div className="imitacao-page imitacao-menino">
        <div className="imitacao-content">
          <h1>Página inválida!</h1>
          <p>Use /imitacao/menino/1 ou /imitacao/menina/1</p>
        </div>
      </div>
    )
  }

  const imitacaoMeninas = IMITACOES[numero]
  const emojis = TEAM_EMOJIS[validTeam]

  const imitacaoMenino = IMITACOES_MENINO[numero]
  const imitacao = validTeam === 'menino' ? imitacaoMenino : imitacaoMeninas

  if (!imitacao) {
    return (
      <div className="imitacao-page imitacao-menino">
        <div className="imitacao-content">
          <h1>Número inválido!</h1>
          <p>Use um número de 1 a 6</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`imitacao-page imitacao-${validTeam}`}>
      {/* Floating decorations */}
      <div className="imitacao-decorations">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="imitacao-floating-emoji"
            style={{
              left: `${5 + (i * 8) % 90}%`,
              top: `${10 + (i * 13) % 80}%`,
              animationDelay: `${i * 0.4}s`,
              fontSize: `${1.5 + (i % 3) * 0.8}rem`,
            }}
          >
            {emojis[i % emojis.length]}
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="imitacao-content">
        <div className="imitacao-team-badge">
          Time {validTeam === 'menino' ? 'Menino 💙' : 'Menina 💖'}
        </div>

        <div className="imitacao-number">
          {numero}
        </div>

        <div className="imitacao-card">
          <div className="imitacao-card-label">Sua imitação é:</div>
          <h1 className="imitacao-text">{imitacao}</h1>
        </div>

        <div className="imitacao-footer">
          Boa sorte! 🎉
        </div>
      </div>
    </div>
  )
}
