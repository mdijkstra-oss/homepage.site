const COUNTDOWN_GO = 'GO';

export const GAME_COPY = {
  breakPill: 'Take a break',
  resumePill: 'Resume game',
  countdown: {
    steps: ['3', '2', '1', COUNTDOWN_GO],
    go: COUNTDOWN_GO,
  },
  hud: {
    separator: '   ·   ',
    score: 'SCORE',
    best: 'BEST',
    hint: 'esc to return to work',
  },
  gameOver: {
    title: 'GAME OVER',
    newBest: '★ NEW BEST',
    scoreLabel: 'SCORE',
    bestLabel: 'BEST',
    restart: 'Play again',
    restartShortcut: 'SPACE',
    quit: 'Return to work',
    quitShortcut: 'ESC',
  },
};
