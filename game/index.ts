export enum Color {
  red,
  blue,
  green,
  yellow,
}

class Game {
  private rootSequence: Color[] = [];
  private userSequence: Color[] = [];
  private level: number = 0;

  constructor() {}

  resetGame(): void {
    this.rootSequence = [];
    this.userSequence = [];
    this.level = 0;
    this.nextLevel();
  }

  nextLevel(): void {
    const nextNumber = Math.floor(Math.random() * 4);
    this.rootSequence.push(nextNumber);
    this.level++;
    console.log("root sequence", this.rootSequence);
  }

  userInput(input: Color): boolean {
    this.userSequence.push(input);
    for (let i = 0; i < this.userSequence.length; i++) {
      if (this.userSequence[i] !== this.rootSequence[i]) {
        return false;
      }
    }

    if (this.userSequence.length === this.rootSequence.length) {
      this.userSequence = [];
      this.nextLevel();
    }

    return true;
  }

  getCurrentLevel(): number {
    return this.level;
  }
}

let game: Game | null = null;

export function getGameSingleton(): Game {
  if (game === null) {
    game = new Game();
  }
  return game;
}
