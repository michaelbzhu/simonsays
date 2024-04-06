export enum Color {
  red,
  blue,
  green,
  yellow,
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const pingESP = async (msg: string) => {
  const formData = new FormData();
  formData.append("message", msg);
  const response = await fetch("/api/ping", {
    method: "POST",
    body: formData,
  });
  // const data = await response.json();
};

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
    //convert sequence to string and send. For example [1, 0, 3, 4, 2, 1] -> "SEQ103421"
    let msg = "SEQ";
    this.rootSequence.forEach((element) => {
      msg += element.toString();
    });
    console.log(msg);
    pingESP(msg);
    //TODO: probably add delay or something to make sure they're not pressing buttons before it's done showing the current sequence
  }

  userInput = async (input: Color): Promise<boolean> => {
    this.userSequence.push(input);
    switch (input) {
      case Color.red:
        pingESP("INPR");
        break;
      case Color.blue:
        pingESP("INPB");
        break;
      case Color.green:
        pingESP("INPG");
        break;
      case Color.yellow:
        pingESP("INPY");
        break;
    }
    for (let i = 0; i < this.userSequence.length; i++) {
      if (this.userSequence[i] !== this.rootSequence[i]) {
        return false;
      }
    }

    if (this.userSequence.length === this.rootSequence.length) {
      this.userSequence = [];
      await delay(2500); //otherwise sometimes the SEQ message sends first before INP somehow
      this.nextLevel();
    }

    return true;
  };

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
