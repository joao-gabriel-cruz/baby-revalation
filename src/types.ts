export type Gender = 'male' | 'female';

export type TeamColors = {
  boy: 'pink' | 'blue';
  girl: 'pink' | 'blue';
};

export type Participant = {
  id: string;
  name: string;
  team: 'boy' | 'girl';
};

export type QuizRound = {
  type: 'quiz';
  question: string;
  options: string[];
  correctIndex: number;
};

export type TrueOrFalseRound = {
  type: 'true-or-false';
  statement: string;
  answer: boolean;
};

export type GuessRound = {
  type: 'guess';
  question: string;
  hint?: string;
};

export type WordScrambleRound = {
  type: 'word-scramble';
  scrambled: string;
  answer: string;
};

export type WheelRound = {
  type: 'wheel';
  segments: string[];
};

export type TicTacToeRound = {
  type: 'tic-tac-toe';
};

export type GameRound =
  | QuizRound
  | TrueOrFalseRound
  | GuessRound
  | WordScrambleRound
  | WheelRound
  | TicTacToeRound;

export type GameType = GameRound['type'];

export type Scores = {
  boy: number;
  girl: number;
};

export type Screen =
  | 'welcome'
  | 'config'
  | 'registration'
  | 'games'
  | 'pre-reveal'
  | 'reveal';

export type RoundState = 'showing' | 'answered' | 'scored';

export type AppState = {
  screen: Screen;
  gender: Gender;
  revealPhrase: string;
  teamColors: TeamColors;
  participants: Participant[];
  rounds: GameRound[];
  currentRoundIndex: number;
  scores: Scores;
  roundState: RoundState;
};

export type AppAction =
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'SET_CONFIG'; config: Pick<AppState, 'gender' | 'revealPhrase' | 'teamColors' | 'rounds'> }
  | { type: 'ADD_PARTICIPANT'; participant: Participant }
  | { type: 'REMOVE_PARTICIPANT'; id: string }
  | { type: 'AWARD_POINT'; team: 'boy' | 'girl' }
  | { type: 'NEXT_ROUND' }
  | { type: 'SET_ROUND_STATE'; roundState: RoundState }
  | { type: 'RESET' };
