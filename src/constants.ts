import type { GameRound } from './types';

export const REVEAL_PHRASES = [
  'Bem-vindo Luiz Miguel!!!',
  'É uma menina!!!',
  'Vai ser menino!!!',
  'Vai ser menina!!!',
  'Nosso principe chegou!!!',
  'Nossa princesa chegou!!!',
];

export const DEFAULT_ROUNDS: GameRound[] = [
  {
    type: 'quiz',
    question: 'Quem não acreditou na gravidez até o exame de sangue confirmar?',
    options: ['Papai Márcio', 'Mamãe Taynara', 'Vovó Rosi', 'Titia Laila'],
    correctIndex: 0,
  },
   {
    type: 'quiz',
    question: 'O nome Hadassa foi escolhido através de?',
    options: ['Um filme', 'Um parente com o mesmo nome', 'Um livro', 'Uma série'],
    correctIndex: 2,
  },
  {
    type: 'true-or-false',
    statement: 'O bebê na última ultrassom estava de barriga para cima?',
    answer: false,
  },
  {
    type: 'word-scramble',
    scrambled: 'IGRLAEM',
    answer: 'MILAGRE',
  },
     {
    type: 'quiz',
    question: 'Quanto o bebê pesava na última ultrassom?',
    options: ['380g', '1kg', '130g', '260g'],
    correctIndex: 3,
  },
  {
    type: 'tic-tac-toe',
  },
  {
    type: 'wheel',
    segments: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
    ],
  },
];

export const GAME_TYPE_LABELS: Record<GameRound['type'], string> = {
  'quiz': 'Quiz',
  'true-or-false': 'Verdadeiro ou Falso',
  'guess': 'Adivinhacao',
  'word-scramble': 'Palavras Embaralhadas',
  'wheel': 'Roda da Sorte',
  'tic-tac-toe': 'Jogo da Velha',
};
